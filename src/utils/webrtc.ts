import { Peer, DataConnection } from 'peerjs';
import { P2PMessage } from '../types/game';

export interface P2PCallbacks {
  onStatusChange: (status: 'disconnected' | 'connecting' | 'reconnecting' | 'connected') => void;
  onMessage: (msg: P2PMessage) => void;
  onError: (errorMsg: string) => void;
  onRoomCreated?: (code: string) => void;
}

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' },
];

export class P2PManager {
  private peer: Peer | null = null;
  private activeConn: DataConnection | null = null;
  private isHost: boolean = false;
  private roomCode: string = '';
  private callbacks: P2PCallbacks;
  private reconnectTimer: number | null = null;
  private pingInterval: number | null = null;
  private isIntentionallyClosed: boolean = false;
  private hasExistingGuest: boolean = false;

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

  // Host creates room with tycct-XXXX
  public createRoom(preferredCode?: string): void {
    this.isIntentionallyClosed = false;
    this.isHost = true;
    this.roomCode = preferredCode || this.generateRoomCode();
    const hostPeerId = `tycct-${this.roomCode}`;

    this.cleanup();
    this.callbacks.onStatusChange('connecting');

    try {
      this.peer = new Peer(hostPeerId, {
        config: { iceServers: ICE_SERVERS },
      });

      this.peer.on('open', (id) => {
        console.log('Host peer opened with ID:', id);
        this.callbacks.onRoomCreated?.(this.roomCode);
        this.callbacks.onStatusChange('connecting'); // Waiting for guest
      });

      this.peer.on('connection', (conn) => {
        // Enforce max 2 players rule
        if (this.hasExistingGuest && this.activeConn && this.activeConn.open) {
          console.warn('Room full, rejecting incoming 3rd peer');
          conn.on('open', () => {
            conn.send({
              type: 'REJECT_ROOM_FULL',
              payload: { reason: 'Phòng đã đủ 2 người 💕' },
            } as P2PMessage);
            setTimeout(() => conn.close(), 1000);
          });
          return;
        }

        this.setupConnection(conn);
      });

      this.peer.on('error', (err: any) => {
        console.error('Host peer error:', err);
        if (err.type === 'unavailable-id') {
          // ID taken, auto retry with another 4-digit code
          console.log('Room code collision, generating another code...');
          this.createRoom();
        } else {
          this.callbacks.onError(`Lỗi máy chủ kết nối: ${err.type || err.message}`);
        }
      });

      this.peer.on('disconnected', () => {
        if (!this.isIntentionallyClosed) {
          this.callbacks.onStatusChange('reconnecting');
          this.peer?.reconnect();
        }
      });
    } catch (e: any) {
      this.callbacks.onError(`Không thể khởi tạo phòng: ${e.message}`);
    }
  }

  // Guest joins room with 4-digit code
  public joinRoom(roomCode: string): void {
    this.isIntentionallyClosed = false;
    this.isHost = false;
    this.roomCode = roomCode.trim();
    const hostPeerId = `tycct-${this.roomCode}`;

    this.cleanup();
    this.callbacks.onStatusChange('connecting');

    try {
      // Guest creates an ephemeral peer ID
      const guestId = `tycct-guest-${Math.random().toString(36).substring(2, 9)}`;
      this.peer = new Peer(guestId, {
        config: { iceServers: ICE_SERVERS },
      });

      this.peer.on('open', () => {
        console.log('Guest peer opened, connecting to host:', hostPeerId);
        const conn = this.peer!.connect(hostPeerId, {
          reliable: true,
        });
        this.setupConnection(conn);
      });

      this.peer.on('error', (err: any) => {
        console.error('Guest peer error:', err);
        if (err.type === 'peer-unavailable') {
          this.callbacks.onError('Không tìm thấy phòng này hoặc người yêu chưa mở phòng! Hãy kiểm tra lại 4 số nhé.');
          this.callbacks.onStatusChange('disconnected');
        } else {
          this.callbacks.onError(`Lỗi kết nối: ${err.type || err.message}`);
          this.callbacks.onStatusChange('disconnected');
        }
      });

      this.peer.on('disconnected', () => {
        if (!this.isIntentionallyClosed) {
          this.callbacks.onStatusChange('reconnecting');
          this.scheduleReconnect();
        }
      });
    } catch (e: any) {
      this.callbacks.onError(`Không thể tham gia phòng: ${e.message}`);
    }
  }

  private setupConnection(conn: DataConnection): void {
    this.activeConn = conn;

    conn.on('open', () => {
      console.log('Data connection established with partner!');
      this.hasExistingGuest = true;
      this.callbacks.onStatusChange('connected');
      this.startHeartbeat();
    });

    conn.on('data', (data: any) => {
      if (data && typeof data === 'object') {
        const msg = data as P2PMessage;
        if (msg.type === 'REJECT_ROOM_FULL') {
          this.callbacks.onError((msg as any).payload?.reason || 'Phòng đã đủ 2 người!');
          this.disconnect();
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
      }
    });

    conn.on('close', () => {
      console.log('Data connection closed');
      this.hasExistingGuest = false;
      this.stopHeartbeat();
      if (!this.isIntentionallyClosed) {
        this.callbacks.onStatusChange('reconnecting');
        this.scheduleReconnect();
      } else {
        this.callbacks.onStatusChange('disconnected');
      }
    });

    conn.on('error', (err) => {
      console.error('Data connection error:', err);
      this.stopHeartbeat();
      if (!this.isIntentionallyClosed) {
        this.callbacks.onStatusChange('reconnecting');
        this.scheduleReconnect();
      }
    });
  }

  public send(msg: P2PMessage): boolean {
    if (this.activeConn && this.activeConn.open) {
      try {
        this.activeConn.send(msg);
        return true;
      } catch (e) {
        console.error('Failed to send message over DataChannel', e);
      }
    }
    return false;
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.callbacks.onStatusChange('reconnecting');
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      if (this.isIntentionallyClosed || !this.roomCode) return;
      console.log('Attempting automatic reconnection...');
      if (this.isHost) {
        this.createRoom(this.roomCode);
      } else {
        this.joinRoom(this.roomCode);
      }
    }, 3000);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.pingInterval = window.setInterval(() => {
      if (this.activeConn && this.activeConn.open) {
        this.send({ type: 'PING' });
      }
    }, 10000);
  }

  private stopHeartbeat(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public disconnect(): void {
    this.isIntentionallyClosed = true;
    this.cleanup();
    this.callbacks.onStatusChange('disconnected');
  }

  private cleanup(): void {
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
