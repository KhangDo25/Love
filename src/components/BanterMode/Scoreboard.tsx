import React from 'react';
import { ArrowLeft, Trophy, Flame, RotateCcw } from 'lucide-react';
import { UserProfile } from '../../types/game';

interface ScoreboardProps {
  rpsScore: { hostWins: number; guestWins: number; draws: number };
  isHost: boolean;
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onBack: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  rpsScore,
  isHost,
  myProfile,
  partnerProfile,
  onBack,
}) => {
  const myWins = isHost ? rpsScore.hostWins : rpsScore.guestWins;
  const partnerWins = isHost ? rpsScore.guestWins : rpsScore.hostWins;
  const totalGames = myWins + partnerWins + rpsScore.draws;

  const myTitle =
    myWins > partnerWins
      ? 'Đại Vương Nóc Nhà 👑'
      : myWins === partnerWins
      ? 'Cân Tài Cân Sức ⚖️'
      : 'Bé Ngoan Chịu Phạt 🥺';

  const partnerTitle =
    partnerWins > myWins
      ? 'Đại Vương Nóc Nhà 👑'
      : partnerWins === myWins
      ? 'Cân Tài Cân Sức ⚖️'
      : 'Bé Ngoan Chịu Phạt 🥺';

  return (
    <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-200 text-xs font-bold text-slate-700 shadow-xs hover:bg-rose-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <span className="text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
          Bảng Điểm Cà Khịa 🏆
        </span>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-rose-200 text-center space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 text-yellow-600 shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">Thống Kê Chiến Tích 🥊</h3>
          <p className="text-[11px] text-slate-400">
            Xem ai đang giữ vị trí "Nóc nhà" tối cao của mối quan hệ
          </p>
        </div>

        {/* Head-to-head score comparison */}
        <div className="grid grid-cols-2 gap-3">
          {/* Me */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1 text-center">
            <span className="text-xs font-black text-slate-700 truncate block">
              {myProfile.name || 'Bạn'}
            </span>
            <div className="text-4xl font-black text-rose-600 font-mono">{myWins}</div>
            <span className="text-[10px] font-bold text-rose-700 block bg-rose-100/80 px-2 py-0.5 rounded-full">
              {myTitle}
            </span>
          </div>

          {/* Partner */}
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1 text-center">
            <span className="text-xs font-black text-slate-700 truncate block">
              {partnerProfile?.name || 'Người yêu'}
            </span>
            <div className="text-4xl font-black text-purple-600 font-mono">{partnerWins}</div>
            <span className="text-[10px] font-bold text-purple-700 block bg-purple-100/80 px-2 py-0.5 rounded-full">
              {partnerTitle}
            </span>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Tổng số ván đã đấu:</span>
            <span className="font-bold text-slate-800">{totalGames} ván</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Số ván hòa nhau:</span>
            <span className="font-bold text-amber-600">{rpsScore.draws} ván</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Hình phạt đang nợ:</span>
            <span className="font-bold text-rose-600">
              {Math.abs(myWins - partnerWins)} ly trà sữa / thơm má
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          * Đấu trường vui vẻ, thua phạt nhẹ nhàng cấm dỗi nhau nhé! 💕
        </p>
      </div>
    </div>
  );
};
