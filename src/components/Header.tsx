import React, { useMemo } from 'react';
import { Heart, Sparkles, User, LogOut, Flame } from 'lucide-react';
import { ConnectionStatus } from '../utils/webrtc';

interface HeaderProps {
  connectionStatus: ConnectionStatus;
  roomCode: string;
  lovePoints: number;
  anniversaryDate: string;
  onOpenFortune: () => void;
  onOpenProfile: () => void;
  onLeaveRoom: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  connectionStatus,
  roomCode,
  lovePoints,
  anniversaryDate,
  onOpenFortune,
  onOpenProfile,
  onLeaveRoom,
}) => {
  // Calculate days in love
  const daysInLove = useMemo(() => {
    if (!anniversaryDate) return 100;
    const start = new Date(anniversaryDate).getTime();
    const now = Date.now();
    const diff = now - start;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  }, [anniversaryDate]);

  // Calculate 5 hearts fill level (each 100 points = 1 heart, capped at 5)
  const heartsCount = Math.min(5, Math.max(1, Math.floor(lovePoints / 100)));

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs px-3 py-2.5 safe-pt">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Left: Connection status & Days in love */}
        <div className="flex items-center gap-2">
          {/* Status badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-bold">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : connectionStatus === 'reconnecting'
                  ? 'bg-amber-500 animate-ping'
                  : 'bg-rose-400'
              }`}
            />
            <span className="text-[11px] text-slate-700">
              {connectionStatus === 'connected'
                ? `Phòng ${roomCode}`
                : connectionStatus === 'reconnecting'
                ? 'Đang nối lại...'
                : 'Chờ nối'}
            </span>
          </div>

          {/* Days in love badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-black shadow-xs">
            <Heart className="w-3 h-3 fill-white text-white animate-pulse" />
            <span>{daysInLove} ngày</span>
          </div>
        </div>

        {/* Right: Love Points & Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Love meter hearts */}
          <div
            className="flex items-center gap-0.5 px-2 py-1 bg-pink-50 rounded-full border border-pink-200"
            title={`Độ yêu: ${lovePoints} điểm`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Heart
                  key={i}
                  className={`w-3 h-3 ${
                    i <= heartsCount
                      ? 'fill-rose-500 text-rose-500 scale-105'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-black text-rose-600 ml-0.5">
              {lovePoints}
            </span>
          </div>

          {/* Fortune Teller Button */}
          <button
            onClick={onOpenFortune}
            title="Bói tình yêu 💘"
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-transform"
          >
            <Sparkles className="w-4 h-4 text-yellow-200" />
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            title="Hồ sơ cá nhân"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center active:scale-95 transition-transform"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Leave Room Button */}
          <button
            onClick={onLeaveRoom}
            title="Thoát phòng"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 flex items-center justify-center active:scale-95 transition-transform"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
