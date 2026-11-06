import mqtt from 'mqtt/dist/mqtt.min.js';
import type { MqttClient } from 'mqtt';
import { Buffer } from 'buffer';
import { P2PMessage, UserProfile, CoupleGameState } from '../types/game';

export type ConnectionStatus =
  | 'idle'
  | 'creating_room'
  | 'waiting_guest'
  | 'joining_room'
  | 'connected'
  | 'reconnecting'
  | 'disconnected';

export interface MQTTCallbacks {
  onStatusChange: (status: ConnectionStatus) => void;
  onRoomCreated: (code: string) => void;
  onHandshakeComplete: (partnerProfile: UserProfile, isHost: boolean, incomingState?: CoupleGameState) => void;
  onPartnerDisconnected: () => void;
  onMessage: (msg: P2PMessage) => void;
  onError: (errorMsg: string) => void;
  getCurrentState: () => CoupleGameState;
  getMyProfile: () => UserProfile;
}

interface MQTTEnvelope {
  type: string;
  from: string;
  seq: number;
  payload?: any;
}

const BROKERS = [
  'wss://broker.hivemq.com:8884/mqtt',
  'wss://broker.emqx.io:8084/mqtt',
  'wss://test.mosquitto.org:8081',
];

export class MQTTManager {
  private client: MqttClient | null = null;
  private clientId: string = 'tycct_' + Math.random().toString(36).substring(2, 9);
  private isHost: boolean = false;
  private roomCode: string = '';
  private callbacks: MQTTCallbacks;
  private seqCounter: number = 0;
  private seenSeqs: Set<string> = new Set();
  private isIntentionallyClosed: boolean = false;
  private hasActiveGuest: boolean = false;
  private wasInRoom: boolean = false;

  // Timers
  private presenceWaitTimer: number | null = null;
  private welcomeWaitTimer: number | null = null;
  private heartbeatInterval: number | null = null;
  private watchdogInterval: number | null = null;
  private lastPartnerHeardTime: number = 0;
  private isPartnerMarkedDisconnected: boolean = false;

  constructor(callbacks: MQTTCallbacks) {
    this.callbacks = callbacks;
  }

  public getIsHost(): boolean {
    return this.isHost;
  }

  public getRoomCode(): string {
    return this.roomCode;
  }

  public isConnected(): boolean {
    return !!(this.client && this.client.connected && this.wasInRoom);
  }

  public generateRoomCode(): string {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  private getTopicPrefix(code: string): string {
    return `tycct-9f3a7/${code}`;
  }

  private getPresenceTopic(code: string): string {
    return `${this.getTopicPrefix(code)}/presence`;
  }

  private getHostTopic(code: string): string {
    return `${this.getTopicPrefix(code)}/host`;
  }

  private getGuestTopic(code: string): string {
    return `${this.getTopicPrefix(code)}/guest`;
  }

  // --------------------------------------------------------------------------
  // Broker Connection with 6s Timeout & Fallback
  // --------------------------------------------------------------------------
  private connectWithBrokerFallback(
    brokerIndex: number,
    willOptions?: { topic: string; payload: string; qos: 0 | 1 | 2; retain: boolean }
  ): Promise<MqttClient> {
    return new Promise((resolve, reject) => {
      if (brokerIndex >= BROKERS.length) {
        console.error('[MQTT] All brokers failed to connect');
        reject(new Error('Không thể kết nối đến máy chủ MQTT, thử đổi mạng WiFi/4G'));
        return;
      }

      const brokerUrl = BROKERS[brokerIndex];
      console.log(`[MQTT] Attempting connection to broker (${brokerIndex + 1}/${BROKERS.length}): ${brokerUrl}`);

      let settled = false;
      const timeoutId = window.setTimeout(() => {
        if (!settled) {
          settled = true;
          console.warn(`[MQTT] Broker ${brokerUrl} timed out after 6 seconds. Trying next broker...`);
          try {
            client.end(true);
          } catch {}
          this.connectWithBrokerFallback(brokerIndex + 1, willOptions)
            .then(resolve)
            .catch(reject);
        }
      }, 6000);

      const client = mqtt.connect(brokerUrl, {
        clientId: this.clientId,
        clean: true,
        connectTimeout: 5500,
        keepalive: 30,
        reconnectPeriod: 3000,
        will: willOptions
          ? {
              topic: willOptions.topic,
              payload: Buffer.from(willOptions.payload),
              qos: willOptions.qos,
              retain: willOptions.retain,
            }
          : undefined,
      });

      client.once('connect', () => {
        if (!settled) {
          settled = true;
          clearTimeout(timeoutId);
          console.log(`[MQTT] Successfully connected to broker: ${brokerUrl}`);
          resolve(client);
        }
      });

      client.once('error', (err: any) => {
        if (!settled) {
          settled = true;
          clearTimeout(timeoutId);
          console.warn(`[MQTT] Broker ${brokerUrl} error:`, err.message);
          try {
            client.end(true);
          } catch {}
          this.connectWithBrokerFallback(brokerIndex + 1, willOptions)
            .then(resolve)
            .catch(reject);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // HOST: Tạo phòng
  // --------------------------------------------------------------------------
  public createRoom(preferredCode?: string): void {
    this.cleanup();
    this.isIntentionallyClosed = false;
    this.isHost = true;
    this.wasInRoom = false;
    this.hasActiveGuest = false;
    this.isPartnerMarkedDisconnected = false;
    this.roomCode = preferredCode || this.generateRoomCode();

    const presenceTopic = this.getPresenceTopic(this.roomCode);
    const hostTopic = this.getHostTopic(this.roomCode);

    console.log(`[MQTT] Host creating room with code: ${this.roomCode}`);
    this.callbacks.onStatusChange('creating_room');

    // Connect to broker with Last Will clearing presence
    this.connectWithBrokerFallback(0, {
      topic: presenceTopic,
      payload: '',
      qos: 1,
      retain: true,
    })
      .then((client) => {
        this.client = client;
        this.setupClientListeners(client);

        // Check if room code is already taken: subscribe to /presence and wait 1.5s
        console.log(`[MQTT] Host checking presence for topic: ${presenceTopic}`);
        let codeTaken = false;

        const presenceHandler = (topic: string, message: Buffer) => {
          if (topic === presenceTopic) {
            const raw = message.toString().trim();
            if (raw) {
              try {
                const parsed = JSON.parse(raw);
                if (parsed.host && parsed.host !== this.clientId) {
                  console.log(`[MQTT] Room code ${this.roomCode} already has active host: ${parsed.host}`);
                  codeTaken = true;
                }
              } catch {
                if (raw.length > 0) codeTaken = true;
              }
            }
          }
        };

        client.on('message', presenceHandler);
        client.subscribe(presenceTopic, { qos: 1 }, (err) => {
          if (err) {
            console.error('[MQTT] Host failed to subscribe presence topic:', err);
          }
        });

        this.presenceWaitTimer = window.setTimeout(() => {
          this.presenceWaitTimer = null;
          client.removeListener('message', presenceHandler);
          client.unsubscribe(presenceTopic);

          if (codeTaken) {
            console.log('[MQTT] Room code collided, generating new code and retrying...');
            try {
              client.end(true);
            } catch {}
            this.createRoom();
            return;
          }

          // Vacant room confirmed!
          console.log(`[MQTT] Room ${this.roomCode} is vacant. Publishing retained presence...`);
          const presencePayload = JSON.stringify({ host: this.clientId, ts: Date.now() });
          client.publish(presenceTopic, presencePayload, { qos: 1, retain: true }, (pubErr) => {
            if (pubErr) {
              console.error('[MQTT] Host failed to publish presence:', pubErr);
            }
          });

          // Subscribe to /host topic for incoming guest messages
          client.subscribe(hostTopic, { qos: 1 }, (subErr) => {
            if (subErr) {
              console.error('[MQTT] Host failed to subscribe host topic:', subErr);
              this.callbacks.onError('Không thể đăng ký kênh phòng: ' + subErr.message);
              this.callbacks.onStatusChange('idle');
              return;
            }

            console.log(`[MQTT] Host successfully listening on: ${hostTopic}`);
            this.callbacks.onRoomCreated(this.roomCode);
            this.callbacks.onStatusChange('waiting_guest');
          });
        }, 1500);
      })
      .catch((err) => {
        console.error('[MQTT] Fatal error creating room:', err);
        this.callbacks.onError('Không thể kết nối máy chủ MQTT: ' + err.message);
        this.callbacks.onStatusChange('idle');
      });
  }

  // --------------------------------------------------------------------------
  // GUEST: Vào phòng
  // --------------------------------------------------------------------------
  public joinRoom(roomCode: string, myProfile: UserProfile): void {
    this.cleanup();
    this.isIntentionallyClosed = false;
    this.isHost = false;
    this.wasInRoom = false;
    this.hasActiveGuest = false;
    this.isPartnerMarkedDisconnected = false;
    this.roomCode = roomCode.trim();

    const presenceTopic = this.getPresenceTopic(this.roomCode);
    const hostTopic = this.getHostTopic(this.roomCode);
    const guestTopic = this.getGuestTopic(this.roomCode);

    console.log(`[MQTT] Guest joining room: ${this.roomCode}`);
    this.callbacks.onStatusChange('joining_room');

    this.connectWithBrokerFallback(0)
      .then((client) => {
        this.client = client;
        this.setupClientListeners(client);

        // 1. Subscribe to /presence to verify host is online
        console.log(`[MQTT] Guest checking presence on: ${presenceTopic}`);
        let hasHostPresence = false;

        const checkPresenceTimeout = window.setTimeout(() => {
          if (!hasHostPresence) {
            console.warn(`[MQTT] No host presence found for room ${this.roomCode} after 3s`);
            client.unsubscribe(presenceTopic);
            try {
              client.end(true);
            } catch {}
            this.callbacks.onError('Không tìm thấy phòng này, kiểm tra lại mã nhé');
            this.callbacks.onStatusChange('idle');
          }
        }, 3000);

        const presenceListener = (topic: string, message: Buffer) => {
          if (topic === presenceTopic) {
            const raw = message.toString().trim();
            if (raw) {
              try {
                const parsed = JSON.parse(raw);
                if (parsed.host) {
                  hasHostPresence = true;
                  clearTimeout(checkPresenceTimeout);
                  client.removeListener('message', presenceListener);
                  client.unsubscribe(presenceTopic);

                  console.log(`[MQTT] Found active host: ${parsed.host}. Subscribing to: ${guestTopic}`);
                  // 2. Subscribe to guest topic
                  client.subscribe(guestTopic, { qos: 1 }, (subErr) => {
                    if (subErr) {
                      console.error('[MQTT] Guest subscribe error:', subErr);
                      this.callbacks.onError('Lỗi kết nối phòng: ' + subErr.message);
                      this.callbacks.onStatusChange('idle');
                      return;
                    }

                    // 3. Publish HELLO to /host
                    console.log(`[MQTT] Guest sending HELLO to host: ${hostTopic}`);
                    this.sendToTopic(hostTopic, {
                      type: 'HELLO',
                      payload: { profile: myProfile },
                    } as P2PMessage);

                    // 4. Set 10-second timeout for WELCOME
                    this.clearWelcomeTimeout();
                    this.welcomeWaitTimer = window.setTimeout(() => {
                      this.welcomeWaitTimer = null;
                      console.warn('[MQTT] Timeout: Did not receive WELCOME from host after 10s');
                      this.cleanup();
                      this.callbacks.onError('Kết nối thất bại, thử lại hoặc đổi mạng WiFi/4G');
                      this.callbacks.onStatusChange('idle');
                    }, 10000);
                  });
                }
              } catch (e) {
                console.error('[MQTT] Failed to parse presence:', e);
              }
            }
          }
        };

        client.on('message', presenceListener);
        client.subscribe(presenceTopic, { qos: 1 });
      })
      .catch((err) => {
        console.error('[MQTT] Fatal error joining room:', err);
        this.callbacks.onError('Không thể kết nối máy chủ MQTT: ' + err.message);
        this.callbacks.onStatusChange('idle');
      });
  }

  // --------------------------------------------------------------------------
  // Message Handling
  // --------------------------------------------------------------------------
  private setupClientListeners(client: MqttClient): void {
    client.on('message', (topic: string, message: Buffer) => {
      const myListeningTopic = this.isHost
        ? this.getHostTopic(this.roomCode)
        : this.getGuestTopic(this.roomCode);

      if (topic !== myListeningTopic) return;

      try {
        const envelope: MQTTEnvelope = JSON.parse(message.toString());
        if (!envelope || !envelope.type) return;

        // Skip self-messages
        if (envelope.from === this.clientId) return;

        // Deduplicate using sender + seq
        const seqKey = `${envelope.from}_${envelope.seq}`;
        if (this.seenSeqs.has(seqKey)) {
          return;
        }
        this.seenSeqs.add(seqKey);
        if (this.seenSeqs.size > 200) {
          const first = this.seenSeqs.values().next().value;
          if (first) this.seenSeqs.delete(first);
        }

        // Record partner activity timestamp
        this.lastPartnerHeardTime = Date.now();
        if (this.isPartnerMarkedDisconnected) {
          console.log('[MQTT] Partner re-established communication!');
          this.isPartnerMarkedDisconnected = false;
          this.callbacks.onStatusChange('connected');

          // If Host, re-send full state to ensure 100% sync
          if (this.isHost) {
            console.log('[MQTT] Host re-syncing full state after partner reconnection');
            this.send({
              type: 'SYNC_FULL_STATE',
              payload: this.callbacks.getCurrentState(),
            });
          }
        }

        this.processIncomingEnvelope(envelope);
      } catch (e) {
        console.error('[MQTT] Failed to parse incoming message envelope:', e);
      }
    });

    client.on('reconnect', () => {
      console.log('[MQTT] Client reconnecting to broker...');
      if (this.wasInRoom) {
        this.callbacks.onStatusChange('reconnecting');
      }
    });

    client.on('close', () => {
      console.log('[MQTT] Broker connection closed');
      if (this.wasInRoom && !this.isIntentionallyClosed) {
        this.callbacks.onStatusChange('reconnecting');
      }
    });

    client.on('error', (err) => {
      console.error('[MQTT] Client runtime error:', err);
    });
  }

  private processIncomingEnvelope(envelope: MQTTEnvelope): void {
    // Handshake: HELLO (received by Host)
    if (envelope.type === 'HELLO' && this.isHost) {
      console.log('[MQTT] Host received HELLO from guest:', envelope.payload?.profile?.name);

      if (this.hasActiveGuest && !this.isPartnerMarkedDisconnected) {
        console.warn('[MQTT] Host already has active guest. Rejecting additional guest.');
        this.sendToTopic(this.getGuestTopic(this.roomCode), {
          type: 'FULL',
          payload: { reason: 'Phòng đã đủ 2 người 💕' },
        } as P2PMessage);
        return;
      }

      this.hasActiveGuest = true;
      this.wasInRoom = true;
      this.callbacks.onHandshakeComplete(envelope.payload.profile, true);

      // Reply with WELCOME
      console.log('[MQTT] Host replying WELCOME with current game state');
      this.sendToTopic(this.getGuestTopic(this.roomCode), {
        type: 'WELCOME',
        payload: {
          hostProfile: this.callbacks.getMyProfile(),
          state: this.callbacks.getCurrentState(),
        },
      } as P2PMessage);

      this.callbacks.onStatusChange('connected');
      this.startHeartbeat();
      return;
    }

    // Handshake: FULL (received by Guest)
    if (envelope.type === 'FULL' && !this.isHost) {
      console.warn('[MQTT] Guest received FULL rejection');
      this.clearWelcomeTimeout();
      this.cleanup();
      this.callbacks.onError(envelope.payload?.reason || 'Phòng đã đủ 2 người 💕');
      this.callbacks.onStatusChange('idle');
      return;
    }

    // Handshake: WELCOME (received by Guest)
    if (envelope.type === 'WELCOME' && !this.isHost) {
      console.log('[MQTT] Guest received WELCOME from host!');
      this.clearWelcomeTimeout();
      this.hasActiveGuest = true;
      this.wasInRoom = true;
      this.callbacks.onHandshakeComplete(envelope.payload.hostProfile, false, envelope.payload.state);
      this.callbacks.onStatusChange('connected');
      this.startHeartbeat();
      return;
    }

    // Ping / Pong
    if (envelope.type === 'PING') {
      const targetTopic = this.isHost
        ? this.getGuestTopic(this.roomCode)
        : this.getHostTopic(this.roomCode);
      this.sendToTopic(targetTopic, { type: 'PONG' } as P2PMessage);
      return;
    }

    if (envelope.type === 'PONG') {
      return;
    }

    // Standard game message
    this.callbacks.onMessage({
      type: envelope.type as any,
      payload: envelope.payload,
    });
  }

  // --------------------------------------------------------------------------
  // Send Messages
  // --------------------------------------------------------------------------
  public send(msg: P2PMessage): boolean {
    if (!this.client || !this.client.connected) {
      console.warn('[MQTT] Cannot send: client is not connected');
      return false;
    }

    const targetTopic = this.isHost
      ? this.getGuestTopic(this.roomCode)
      : this.getHostTopic(this.roomCode);

    return this.sendToTopic(targetTopic, msg);
  }

  private sendToTopic(topic: string, msg: P2PMessage): boolean {
    if (!this.client) return false;

    const envelope: MQTTEnvelope = {
      type: msg.type,
      from: this.clientId,
      seq: ++this.seqCounter,
      payload: (msg as any).payload,
    };

    try {
      this.client.publish(topic, JSON.stringify(envelope), { qos: 1 });
      return true;
    } catch (e) {
      console.error('[MQTT] Publish error:', e);
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // Heartbeat & Watchdog (5s heartbeat, 15s timeout)
  // --------------------------------------------------------------------------
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.lastPartnerHeardTime = Date.now();
    this.isPartnerMarkedDisconnected = false;

    // Send PING every 5 seconds
    this.heartbeatInterval = window.setInterval(() => {
      if (this.client && this.client.connected && this.wasInRoom) {
        const targetTopic = this.isHost
          ? this.getGuestTopic(this.roomCode)
          : this.getHostTopic(this.roomCode);
        this.sendToTopic(targetTopic, { type: 'PING' } as P2PMessage);
      }
    }, 5000);

    // Watchdog checks every 2 seconds
    this.watchdogInterval = window.setInterval(() => {
      if (!this.wasInRoom || this.isIntentionallyClosed) return;

      const elapsed = Date.now() - this.lastPartnerHeardTime;
      if (elapsed > 15000 && !this.isPartnerMarkedDisconnected) {
        console.warn(`[MQTT] No message received from partner for ${Math.round(elapsed / 1000)}s! Marking reconnecting...`);
        this.isPartnerMarkedDisconnected = true;
        this.callbacks.onPartnerDisconnected();
        this.callbacks.onStatusChange('reconnecting');
      }
    }, 2000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.watchdogInterval) {
      clearInterval(this.watchdogInterval);
      this.watchdogInterval = null;
    }
  }

  private clearWelcomeTimeout(): void {
    if (this.welcomeWaitTimer) {
      clearTimeout(this.welcomeWaitTimer);
      this.welcomeWaitTimer = null;
    }
  }

  // --------------------------------------------------------------------------
  // Disconnect & Cleanup
  // --------------------------------------------------------------------------
  public disconnect(): void {
    console.log('[MQTT] Disconnecting intentionally...');
    this.isIntentionallyClosed = true;
    this.wasInRoom = false;
    this.stopHeartbeat();
    this.clearWelcomeTimeout();

    if (this.client) {
      // If Host, clear retained presence
      if (this.isHost && this.roomCode) {
        const presenceTopic = this.getPresenceTopic(this.roomCode);
        try {
          console.log(`[MQTT] Clearing retained presence for: ${presenceTopic}`);
          this.client.publish(presenceTopic, '', { qos: 1, retain: true });
        } catch {}
      }

      try {
        this.client.end(true);
      } catch {}
      this.client = null;
    }

    this.hasActiveGuest = false;
    this.callbacks.onStatusChange('idle');
  }

  public cleanup(): void {
    this.stopHeartbeat();
    this.clearWelcomeTimeout();
    if (this.presenceWaitTimer) {
      clearTimeout(this.presenceWaitTimer);
      this.presenceWaitTimer = null;
    }
    if (this.client) {
      try {
        this.client.end(true);
      } catch {}
      this.client = null;
    }
    this.hasActiveGuest = false;
  }
}
