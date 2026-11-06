import React, { useState } from 'react';
import { Copy, Check, Users, Sparkles, HeartHandshake, AlertCircle, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types/game';

interface LobbyProps {
  isWaitingHost: boolean;
  waitingCode: string;
  lastRoomCode: string | null;
  connectionStatus: 'disconnected' | 'connecting' | 'reconnecting' | 'connected';
  errorMessage: string | null;
  myProfile: UserProfile;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
  onCancelWait: () => void;
  onOpenProfile: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  isWaitingHost,
  waitingCode,
  lastRoomCode,
  connectionStatus,
  errorMessage,
  myProfile,
  onCreateRoom,
  onJoinRoom,
  onCancelWait,
  onOpenProfile,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showNetworkTip, setShowNetworkTip] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCode.trim().replace(/\D/g, '');
    if (clean.length === 4) {
      onJoinRoom(clean);
    }
  };

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('room', waitingCode);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // If host is waiting for partner
  if (isWaitingHost) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border-2 border-pink-200 w-full space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 text-rose-500 animate-pulse-subtle shadow-inner">
            <HeartHandshake className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Phòng Của 2 Bạn 💕
            </h2>
            <p className="text-pink-600 font-semibold text-sm mt-1">
              Đang chờ người yêu kết nối...
            </p>
          </div>

          {/* Big Room Code Box */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-100 p-6 rounded-3xl border-2 border-pink-300">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-extrabold mb-1">
              Mã Phòng 4 Số
            </p>
            <div className="text-5xl font-black tracking-widest text-rose-600 font-mono">
              {waitingCode}
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Bảo người yêu mở web và nhập 4 số này nha!
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCopyLink}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-black rounded-2xl shadow-lg hover:shadow-pink-300/50 flex items-center justify-center gap-2 active:scale-95 transition-all text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-yellow-300" />
                  <span>ĐÃ COPY LINK! GỬI NGAY CHO GẤU 💕</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>COPY LINK GỬI NGƯỜI YÊU 🔗</span>
                </>
              )}
            </button>

            <button
              onClick={onCancelWait}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition active:scale-95 text-sm"
            >
              HỦY PHÒNG NÀY
            </button>
          </div>

          <div className="text-xs text-slate-400">
            {connectionStatus === 'connecting' && (
              <span className="inline-flex items-center gap-1.5 text-pink-500 font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                Tín hiệu sẵn sàng, đang mở cửa đón người yêu...
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Lobby Home view
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-4 max-w-md mx-auto w-full z-10">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-2 border-pink-200 w-full space-y-6">
        {/* App Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-black shadow-xs">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>KHÔNG GIAN RIÊNG CHO 2 NGƯỜI</span>
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 tracking-tight">
            GAME CỦA 2 CHÚNG MÌNH 💕
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Kết nối 2 điện thoại qua internet không cần tài khoản!
          </p>
        </div>

        {/* User Mini Profile Badge */}
        <div
          onClick={onOpenProfile}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onOpenProfile(); }}
          className="flex items-center justify-between p-3 bg-pink-50/70 hover:bg-pink-100/70 rounded-2xl border border-pink-200 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-pink-200 flex items-center justify-center text-2xl border-2 border-white shadow-xs overflow-hidden">
              {myProfile.avatar?.startsWith('data:image') || myProfile.avatar?.startsWith('http') ? (
                <img
                  src={myProfile.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                  }}
                />
              ) : (
                <span>{myProfile.avatar || '🐰'}</span>
              )}
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400 font-bold">Hồ sơ của bạn:</p>
              <p className="font-extrabold text-slate-800 text-base">
                {myProfile.name ? myProfile.name : <span className="text-pink-500 underline">Bấm để đặt tên & avatar!</span>}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-white text-pink-600 rounded-full border border-pink-200 shadow-xs">
            ✏️ Sửa
          </span>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Connection status indicator */}
        {connectionStatus === 'connecting' && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
            <span>Đang thiết lập kết nối tới người yêu...</span>
          </div>
        )}

        {/* Primary Actions: Create or Join */}
        <div className="space-y-4">
          {/* Button Create Room */}
          <button
            onClick={onCreateRoom}
            className="w-full py-4 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-black rounded-2xl shadow-lg hover:shadow-pink-300/50 flex items-center justify-center gap-2 text-base active:scale-95 transition-transform"
          >
            <span>TẠO PHÒNG MỚI 🆕</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-xs font-extrabold">HOẶC</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Form Join Room with 4 digits */}
          <form onSubmit={handleJoin} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="Nhập 4 số mã phòng"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-pink-200 text-center font-mono font-black text-xl tracking-widest text-slate-800 focus:outline-none focus:border-pink-500 bg-pink-50/30"
              />
              <button
                type="submit"
                disabled={inputCode.length !== 4}
                className="px-5 py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-black rounded-2xl shadow-md transition active:scale-95 text-sm"
              >
                VÀO PHÒNG 🔑
              </button>
            </div>
          </form>

          {/* Rejoin last room if available */}
          {lastRoomCode && (
            <button
              onClick={() => onJoinRoom(lastRoomCode)}
              className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <span>🔁 Vào lại phòng cũ ({lastRoomCode})</span>
            </button>
          )}
        </div>

        {/* Tip on WebRTC network */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setShowNetworkTip(!showNetworkTip)}
            className="text-[11px] text-slate-400 hover:text-slate-600 underline font-medium"
          >
            {showNetworkTip ? 'Ẩn mẹo kết nối' : '💡 Mẹo kết nối 4G/WiFi'}
          </button>
          {showNetworkTip && (
            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 text-left space-y-1">
              <p className="font-bold text-slate-700">Lưu ý khi chơi qua mạng khác nhau:</p>
              <p>• WebRTC kết nối ngang hàng P2P giữa 2 máy.</p>
              <p>• Một số mạng 4G hoặc WiFi công ty có tường lửa chặn P2P. Nếu bị kẹt ở bước "Đang kết nối", hãy thử đổi cả 2 sang 4G hoặc cùng bắt 1 mạng WiFi nhé!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
