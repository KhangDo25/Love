import React, { useMemo } from 'react';
import { Heart, Sparkles, Flame, BookOpen, Users, Wand2, MessageCircle } from 'lucide-react';
import { UserProfile } from '../types/game';

interface MainDashboardProps {
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  connectionStatus: 'disconnected' | 'connecting' | 'reconnecting' | 'connected';
  lovePoints: number;
  onOpenSweetMode: () => void;
  onOpenBanterMode: () => void;
  onOpenNotebook: () => void;
  onOpenSharedFeatures: () => void;
  onOpenFortune: () => void;
  onOpenProfile: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  myProfile,
  partnerProfile,
  connectionStatus,
  lovePoints,
  onOpenSweetMode,
  onOpenBanterMode,
  onOpenNotebook,
  onOpenSharedFeatures,
  onOpenFortune,
  onOpenProfile,
}) => {
  // Days in love
  const daysInLove = useMemo(() => {
    const anniv = myProfile.anniversaryDate || '2024-01-01';
    const start = new Date(anniv).getTime();
    const now = Date.now();
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [myProfile.anniversaryDate]);

  const p2 = partnerProfile || {
    id: 'placeholder',
    name: 'Người Yêu',
    gender: myProfile.gender === 'female' ? 'male' : 'female',
    avatar: '🐻',
    anniversaryDate: myProfile.anniversaryDate,
    myBirthday: myProfile.partnerBirthday,
    partnerBirthday: myProfile.myBirthday,
    updatedAt: Date.now(),
  };

  const renderAvatar = (avatarStr?: string) => {
    if (avatarStr?.startsWith('data:image') || avatarStr?.startsWith('http')) {
      return (
        <img
          src={avatarStr}
          alt="avatar"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '';
          }}
        />
      );
    }
    return <span>{avatarStr || '🐰'}</span>;
  };

  const heartsCount = Math.min(5, Math.max(1, Math.floor(lovePoints / 100)));

  return (
    <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-4 pb-20">
      {/* Reconnecting banner if state is reconnecting */}
      {connectionStatus === 'reconnecting' && (
        <div className="p-3 bg-amber-500 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
          <span>Đang kết nối lại tới điện thoại người yêu... 💕</span>
        </div>
      )}

      {/* Hero Couple Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-xl border-2 border-pink-200 text-center space-y-4 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-300/30 rounded-full blur-2xl pointer-events-none" />

        {/* Dual Avatars with Pulsing Heart */}
        <div className="flex items-center justify-around relative pt-1">
          {/* Me */}
          <div
            onClick={onOpenProfile}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onOpenProfile(); }}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-20 h-20 rounded-full bg-pink-100 border-4 border-pink-400 flex items-center justify-center text-4xl shadow-md overflow-hidden group-hover:scale-105 transition-transform">
              {renderAvatar(myProfile.avatar)}
            </div>
            <span className="font-black text-xs text-slate-800 mt-1.5 max-w-[90px] truncate">
              {myProfile.name || 'Bạn'}
            </span>
            <span className="text-[10px] text-pink-500 font-bold">Chạm để sửa</span>
          </div>

          {/* Center Heart & Love Counter */}
          <div className="flex flex-col items-center px-1">
            <div className="relative">
              <Heart className="w-12 h-12 fill-rose-500 text-rose-600 animate-pulse-subtle filter drop-shadow-md" />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                {daysInLove}
              </span>
            </div>
            <span className="text-[11px] font-black text-rose-600 uppercase tracking-wider mt-1">
              ĐÃ YÊU NHAU
            </span>
            <span className="text-xs font-mono font-black text-slate-800">
              {daysInLove} ngày
            </span>
          </div>

          {/* Partner */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-purple-100 border-4 border-purple-400 flex items-center justify-center text-4xl shadow-md overflow-hidden">
              {renderAvatar(p2.avatar)}
            </div>
            <span className="font-black text-xs text-slate-800 mt-1.5 max-w-[90px] truncate">
              {p2.name}
            </span>
            <span className="text-[10px] text-purple-500 font-bold">
              {connectionStatus === 'connected' ? '🟢 Online' : 'Chờ nối...'}
            </span>
          </div>
        </div>

        {/* Love Meter Bar */}
        <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 p-3.5 rounded-2xl border border-pink-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-rose-600">Độ yêu:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${
                    i <= heartsCount
                      ? 'fill-rose-500 text-rose-500 scale-110'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-xs font-black text-slate-800 font-mono">
            {lovePoints} điểm 💕
          </span>
        </div>

        {/* Fortune Button Callout */}
        <button
          onClick={onOpenFortune}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-1.5 hover:shadow-purple-300/50 active:scale-95 transition"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>BÓI TÌNH YÊU 2 ĐỨA (% HỢP NHAU) 💘</span>
        </button>
      </div>

      {/* 4 Big Main Mode Buttons */}
      <div className="space-y-3">
        {/* 1. CHẾ ĐỘ NGỌT */}
        <button
          onClick={onOpenSweetMode}
          className="w-full p-5 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white rounded-3xl shadow-xl hover:shadow-pink-300/50 flex items-center justify-between text-left active:scale-98 transition group border-2 border-white/40"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
              💕
            </div>
            <div>
              <h3 className="font-black text-lg tracking-wide">CHẾ ĐỘ NGỌT NGÀO</h3>
              <p className="text-xs text-pink-100 font-medium mt-0.5">
                Bao nhiêu hiểu nhau, Hỏi xoáy đáp xoay, Hộp thư tình, Lời hẹn ước
              </p>
            </div>
          </div>
          <span className="text-lg font-black text-yellow-300 ml-2">➔</span>
        </button>

        {/* 2. CHẾ ĐỘ CÀ KHỊA */}
        <button
          onClick={onOpenBanterMode}
          className="w-full p-5 bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 text-white rounded-3xl shadow-xl hover:shadow-orange-300/50 flex items-center justify-between text-left active:scale-98 transition group border-2 border-white/40"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
              🔥
            </div>
            <div>
              <h3 className="font-black text-lg tracking-wide">CHẾ ĐỘ CÀ KHỊA</h3>
              <p className="text-xs text-orange-100 font-medium mt-0.5">
                Kéo búa bao + phạt vui, Thật hay thách, Tòa án tình yêu, Bảng điểm
              </p>
            </div>
          </div>
          <span className="text-lg font-black text-yellow-300 ml-2">➔</span>
        </button>

        {/* 3. SỔ TAY YÊU NHAU */}
        <button
          onClick={onOpenNotebook}
          className="w-full p-5 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 text-white rounded-3xl shadow-xl hover:shadow-purple-300/50 flex items-center justify-between text-left active:scale-98 transition group border-2 border-white/40"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
              📖
            </div>
            <div>
              <h3 className="font-black text-lg tracking-wide">SỔ TAY YÊU NHAU</h3>
              <p className="text-xs text-purple-100 font-medium mt-0.5">
                Nhật ký chung theo dòng thời gian & Danh sách thích / ghét
              </p>
            </div>
          </div>
          <span className="text-lg font-black text-yellow-300 ml-2">➔</span>
        </button>

        {/* 4. TÍNH NĂNG DÙNG CHUNG */}
        <button
          onClick={onOpenSharedFeatures}
          className="w-full p-5 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500 text-white rounded-3xl shadow-xl hover:shadow-emerald-300/50 flex items-center justify-between text-left active:scale-98 transition group border-2 border-white/40"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
              💞
            </div>
            <div>
              <h3 className="font-black text-lg tracking-wide">TÍNH NĂNG DÙNG CHUNG</h3>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Đếm ngược kỷ niệm, Bảng vẽ đôi realtime & Vòng quay ăn gì/đi đâu
              </p>
            </div>
          </div>
          <span className="text-lg font-black text-yellow-300 ml-2">➔</span>
        </button>
      </div>
    </div>
  );
};
