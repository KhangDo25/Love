import { Peer, DataConnection } from 'peerjs';
import { P2PMessage, UserProfile, CoupleGameState } from '../types/game';

export type ConnectionStatus =
  | 'idle'
  | 'creating_room'
  | 'waiting_guest'
  | 'joining_room'
  | 'connected'
  | 'reconnecting'
  | 'disconnected';

export interface P2PCallbacks {
  onStatusChange: (status: ConnectionStatus) => void;
  onRoomCreated: (code: string) => void;
  onHandshakeComplete: (partnerProfile: UserProfile, isHost: boolean, incomingState?: CoupleGameState) => void;
  onPartnerDisconnected: () => void;
  onMessage: (msg: P2PMessage) => void;
  onError: (errorMsg: string) => void;
  getCurrentState: () => CoupleGameState;
  getMyProfile: () => UserProfile;
}

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  {
    urls: 'turn:openrelay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443?transport=tcp',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
];

export class P2PManager {
  private peer: Peer | null = null;
  private activeConn: DataConnection | null = null;
  private isHost: boolean = false;
  private roomCode: string = '';
  private callbacks: P2PCallbacks;
  private reconnectTimer: number | null = null;
  private joinTimeoutTimer: number | null = null;
  private pingInterval: number | null = null;
  private isIntentionallyClosed: boolean = false;
  private hasExistingGuest: boolean = false;
  private wasInRoom: boolean = false;

  constructor(callbacks: P2PCallbacks) {
    this.callbacks = callbacks;
  }

  public getIsHost(): boolean {
    return this.isHost;
  }

  public getRoomCode(): string {
    return this.roomCode;
  }

  public isConnected(): boolean {
    return !!(this.activeConn && this.activeConn.open);
  }

  public generateRoomCode(): string {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  // -------------------------------------------------------------
  // HOST: Tạo phòng tycct-XXXX
  // -------------------------------------------------------------
  public createRoom(preferredCode?: string): void {
    this.cleanup();
    this.isIntentionallyClosed = false;
    this.isHost = true;
    this.wasInRoom = false;
    this.roomCode = preferredCode || this.generateRoomCode();
    const hostPeerId = `tycct-${this.roomCode}`;

    console.log('[P2P] Host creating room with peer ID:', hostPeerId);
    this.callbacks.onStatusChange('creating_room');

    try {
      this.peer = new Peer(hostPeerId, {
        config: { iceServers: ICE_SERVERS },
      });

      this.peer.on('open', (id) => {
        console.log('[P2P] Host peer successfully opened with ID:', id);
        this.callbacks.onRoomCreated(this.roomCode);
        this.callbacks.onStatusChange('waiting_guest');
      });

      this.peer.on('connection', (conn) => {
        console.log('[P2P] Host received incoming connection from peer:', conn.peer);

        // Enforce max 2 players: if guest is already connected and active
        if (this.hasExistingGuest && this.activeConn && this.activeConn.open) {
          console.warn('[P2P] Room already has 2 people. Rejecting 3rd peer:', conn.peer);
          conn.on('open', () => {
            conn.send({
              type: 'REJECT_ROOM_FULL',
              payload: { reason: 'Phòng đã đủ 2 người 💕' },
            } as P2PMessage);
            setTimeout(() => {
              try { conn.close(); } catch {}
            }, 600);
          });
          return;
        }

        this.setupHostConnection(conn);
      });

      this.peer.on('error', (err: any) => {
        console.error('[P2P] Host peer error:', err.type, err.message);
        if (err.type === 'unavailable-id') {
          console.log('[P2P] ID unavailable, generating another 4-digit code and retrying...');
          this.createRoom();
        } else {
          this.callbacks.onError(`Lỗi máy chủ kết nối: ${err.type || err.message}`);
          this.callbacks.onStatusChange('idle');
        }
      });

      this.peer.on('disconnected', () => {
        console.warn('[P2P] Host peer disconnected from signaling server');
        if (!this.isIntentionallyClosed && this.peer && !this.peer.destroyed) {
          console.log('[P2P] Host reconnecting peer to signaling...');
          try {
            this.peer.reconnect();
          } catch (e) {
            console.error('[P2P] Reconnect error:', e);
          }
        }
      });
    } catch (e: any) {
      console.error('[P2P] Fatal error creating host peer:', e);
      this.callbacks.onError(`Không thể khởi tạo phòng: ${e.message}`);
      this.callbacks.onStatusChange('idle');
    }
  }

  private setupHostConnection(conn: DataConnection): void {
    this.activeConn = conn;

    conn.on('open', () => {
      console.log('[P2P] Host: DataConnection opened! Waiting for HELLO from guest...');
      this.startHeartbeat();
    });

    conn.on('data', (data: any) => {
      if (!data || typeof data !== 'object') return;
      const msg = data as P2PMessage;

      if (msg.type === 'HELLO') {
        console.log('[P2P] Host received HELLO from guest:', msg.payload.profile.name);
        this.hasExistingGuest = true;
        this.wasInRoom = true;

        // 1. Notify UI that handshake is complete
        this.callbacks.onHandshakeComplete(msg.payload.profile, true);

        // 2. Respond with WELCOME including current full state & host profile
        const myProfile = this.callbacks.getMyProfile();
        const currentState = this.callbacks.getCurrentState();

        this.send({
          type: 'WELCOME',
          payload: {
            hostProfile: myProfile,
            state: currentState,
          },
        });

        // 3. Move host to connected
        this.callbacks.onStatusChange('connected');
        return;
      }

      if (msg.type === 'PING') {
        this.send({ type: 'PONG' });
        return;
      }
      if (msg.type === 'PONG') {
        return;
      }

      this.callbacks.onMessage(msg);
    });

    conn.on('close', () => {
      console.log('[P2P] Host: Connection with partner closed');
      this.handleConnectionLost();
    });

    conn.on('error', (err) => {
      console.error('[P2P] Host: Connection error:', err);
      this.handleConnectionLost();
    });
  }

  // -------------------------------------------------------------
  // GUEST: Vào phòng tycct-XXXX
  // -------------------------------------------------------------
  public joinRoom(roomCode: string, myProfile: UserProfile): void {
    this.cleanup();
    this.isIntentionallyClosed = false;
    this.isHost = false;
    this.wasInRoom = false;
    this.roomCode = roomCode.trim();
    const hostPeerId = `tycct-${this.roomCode}`;

    console.log('[P2P] Guest preparing to join room:', hostPeerId);
    this.callbacks.onStatusChange('joining_room');

    // 12s connection timeout
    this.clearJoinTimeout();
    this.joinTimeoutTimer = window.setTimeout(() => {
      console.warn('[P2P] Guest connection timeout after 12 seconds');
      this.cleanup();
      this.callbacks.onError('Kết nối thất bại, thử lại hoặc đổi mạng WiFi/4G');
      this.callbacks.onStatusChange('idle');
    }, 12000);

    try {
      // PeerJS generates a random unique ID for the guest
      this.peer = new Peer({
        config: { iceServers: ICE_SERVERS },
      });

      this.peer.on('open', (id) => {
        console.log('[P2P] Guest peer open with assigned ID:', id);
        console.log('[P2P] Guest connecting to host:', hostPeerId);

        const conn = this.peer!.connect(hostPeerId, {
          reliable: true,
        });

        this.setupGuestConnection(conn, myProfile);
      });

      this.peer.on('error', (err: any) => {
        console.error('[P2P] Guest peer error:', err.type, err.message);
        this.clearJoinTimeout();

        if (err.type === 'peer-unavailable') {
          this.callbacks.onError('Không tìm thấy phòng này, kiểm tra lại mã nhé');
        } else {
          this.callbacks.onError(`Lỗi kết nối: ${err.type || err.message}`);
        }
        this.cleanup();
        this.callbacks.onStatusChange('idle');
      });

      this.peer.on('disconnected', () => {
        console.warn('[P2P] Guest peer disconnected from signaling');
        if (!this.isIntentionallyClosed && this.peer && !this.peer.destroyed) {
          try {
            this.peer.reconnect();
          } catch {}
        }
      });
    } catch (e: any) {
      console.error('[P2P] Fatal error creating guest peer:', e);
      this.clearJoinTimeout();
      this.callbacks.onError(`Không thể tham gia phòng: ${e.message}`);
      this.callbacks.onStatusChange('idle');
    }
  }

  private setupGuestConnection(conn: DataConnection, myProfile: UserProfile): void {
    this.activeConn = conn;

    conn.on('open', () => {
      console.log('[P2P] Guest: DataConnection opened! Sending HELLO to host...');
      this.startHeartbeat();

      // Send HELLO with guest profile
      this.send({
        type: 'HELLO',
        payload: { profile: myProfile },
      });
    });

    conn.on('data', (data: any) => {
      if (!data || typeof data !== 'object') return;
      const msg = data as P2PMessage;

      if (msg.type === 'WELCOME') {
        console.log('[P2P] Guest received WELCOME from host!');
        this.clearJoinTimeout();
        this.hasExistingGuest = true;
        this.wasInRoom = true;

        // Complete handshake with host's profile and initial game state
        this.callbacks.onHandshakeComplete(msg.payload.hostProfile, false, msg.payload.state);
        this.callbacks.onStatusChange('connected');
        return;
      }

      if (msg.type === 'REJECT_ROOM_FULL') {
        console.warn('[P2P] Guest rejected: Room is full');
        this.clearJoinTimeout();
        this.callbacks.onError((msg as any).payload?.reason || 'Phòng đã đủ 2 người 💕');
        this.cleanup();
        this.callbacks.onStatusChange('idle');
        return;
      }

      if (msg.type === 'PING') {
        this.send({ type: 'PONG' });
        return;
      }
      if (msg.type === 'PONG') {
        return;
      }

      this.callbacks.onMessage(msg);
    });

    conn.on('close', () => {
      console.log('[P2P] Guest: Connection with host closed');
      this.clearJoinTimeout();
      this.handleConnectionLost();
    });

    conn.on('error', (err) => {
      console.error('[P2P] Guest: Connection error:', err);
      this.clearJoinTimeout();
      this.handleConnectionLost();
    });
  }

  // -------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------
  private handleConnectionLost(): void {
    this.stopHeartbeat();
    this.hasExistingGuest = false;

    if (this.isIntentionallyClosed) {
      this.callbacks.onStatusChange('idle');
      return;
    }

    if (this.wasInRoom) {
      console.log('[P2P] Connection lost while in room. Notifying and scheduling reconnect...');
      this.callbacks.onPartnerDisconnected();
      this.callbacks.onStatusChange('reconnecting');
      this.scheduleReconnect();
    } else {
      console.log('[P2P] Connection closed before room handshake completed.');
      this.callbacks.onError('Không thể kết nối tới phòng, vui lòng thử lại.');
      this.cleanup();
      this.callbacks.onStatusChange('idle');
    }
  }

  public send(msg: P2PMessage): boolean {
    if (this.activeConn && this.activeConn.open) {
      try {
        this.activeConn.send(msg);
        return true;
      } catch (e) {
        console.error('[P2P] Failed to send message over DataChannel:', e);
      }
    } else {
      console.warn('[P2P] Cannot send message, connection is not open');
    }
    return false;
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      if (this.isIntentionallyClosed || !this.roomCode) return;

      console.log('[P2P] Executing automatic reconnect attempt...');
      if (this.isHost) {
        this.createRoom(this.roomCode);
      } else {
        const myProfile = this.callbacks.getMyProfile();
        this.joinRoom(this.roomCode, myProfile);
      }
    }, 3000);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.pingInterval = window.setInterval(() => {
      if (this.activeConn && this.activeConn.open) {
        this.send({ type: 'PING' });
      }
    }, 8000);
  }

  private stopHeartbeat(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private clearJoinTimeout(): void {
    if (this.joinTimeoutTimer) {
      clearTimeout(this.joinTimeoutTimer);
      this.joinTimeoutTimer = null;
    }
  }

  public disconnect(): void {
    console.log('[P2P] Disconnecting intentionally...');
    this.isIntentionallyClosed = true;
    this.wasInRoom = false;
    this.cleanup();
    this.callbacks.onStatusChange('idle');
  }

  public cleanup(): void {
    this.clearJoinTimeout();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.stopHeartbeat();
    if (this.activeConn) {
      try {
        this.activeConn.close();
      } catch {}
      this.activeConn = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }
    this.hasExistingGuest = false;
  }
}
