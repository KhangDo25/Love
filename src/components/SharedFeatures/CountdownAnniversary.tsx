import React, { useMemo } from 'react';
import { ArrowLeft, Calendar, Heart, Gift, Sparkles, Clock } from 'lucide-react';
import { UserProfile } from '../../types/game';

interface CountdownAnniversaryProps {
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onBack: () => void;
}

export const CountdownAnniversary: React.FC<CountdownAnniversaryProps> = ({
  myProfile,
  partnerProfile,
  onBack,
}) => {
  const anniversaryDate = myProfile.anniversaryDate || '2024-01-01';
  const myBirthday = myProfile.myBirthday || '2001-05-20';
  const partnerBirthday = partnerProfile?.myBirthday || myProfile.partnerBirthday || '2000-11-15';

  // Calculate current days together
  const daysTogether = useMemo(() => {
    const start = new Date(anniversaryDate).getTime();
    const now = Date.now();
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [anniversaryDate]);

  // Calculate next round milestone (e.g. 100, 200, 365, 500, 1000 days)
  const nextMilestone = useMemo(() => {
    const milestones = [100, 200, 300, 365, 500, 730, 1000, 1500, 2000];
    const next = milestones.find((m) => m > daysTogether) || Math.ceil((daysTogether + 50) / 100) * 100;
    const daysLeft = next - daysTogether;
    return { target: next, daysLeft };
  }, [daysTogether]);

  // Helper to calculate days until next birthday
  const getDaysUntilBirthday = (bdayStr: string) => {
    if (!bdayStr) return 0;
    const today = new Date();
    const bday = new Date(bdayStr);
    let nextBday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
    if (nextBday.getTime() < today.getTime()) {
      nextBday = new Date(today.getFullYear() + 1, bday.getMonth(), bday.getDate());
    }
    const diff = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysToPartnerBday = getDaysUntilBirthday(partnerBirthday);
  const daysToMyBday = getDaysUntilBirthday(myBirthday);

  return (
    <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-pink-200 text-xs font-bold text-slate-700 shadow-xs hover:bg-pink-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <span className="text-xs font-black text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
          Đếm Ngược Kỷ Niệm ⏳
        </span>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-pink-200 space-y-5">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 text-pink-500 shadow-inner">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">Cột Mốc Tình Yêu 💕</h3>
          <p className="text-[11px] text-slate-400">
            Từng giây từng phút bên nhau đều là kỷ niệm vô giá
          </p>
        </div>

        {/* Current Days Banner */}
        <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 p-6 rounded-3xl text-white text-center shadow-lg space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-pink-100">
            CHÚNG MÌNH ĐÃ BÊN NHAU
          </span>
          <div className="text-5xl font-black font-mono tracking-tight">
            {daysTogether} <span className="text-2xl font-bold font-sans">ngày</span>
          </div>
          <p className="text-xs text-pink-100 font-medium">
            Kể từ ngày {new Date(anniversaryDate).toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Milestone Cards */}
        <div className="space-y-3">
          {/* Next Days Milestone */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-400 text-white flex items-center justify-center text-lg shadow-sm">
                🎉
              </div>
              <div>
                <span className="text-xs font-black text-slate-800 block">
                  Cột mốc {nextMilestone.target} ngày yêu
                </span>
                <span className="text-[11px] text-slate-500">
                  Chuẩn bị hẹn hò lãng mạn nha!
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-rose-600 font-mono">
                {nextMilestone.daysLeft}
              </span>
              <span className="text-[10px] text-slate-400 block font-bold">ngày nữa</span>
            </div>
          </div>

          {/* Partner Birthday */}
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-400 text-white flex items-center justify-center text-lg shadow-sm">
                🎁
              </div>
              <div>
                <span className="text-xs font-black text-slate-800 block">
                  Sinh nhật {partnerProfile?.name || 'Người yêu'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {new Date(partnerBirthday).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-purple-600 font-mono">
                {daysToPartnerBday}
              </span>
              <span className="text-[10px] text-slate-400 block font-bold">ngày nữa</span>
            </div>
          </div>

          {/* My Birthday */}
          <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-400 text-white flex items-center justify-center text-lg shadow-sm">
                🎂
              </div>
              <div>
                <span className="text-xs font-black text-slate-800 block">
                  Sinh nhật của bạn
                </span>
                <span className="text-[11px] text-slate-500">
                  {new Date(myBirthday).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-pink-600 font-mono">
                {daysToMyBday}
              </span>
              <span className="text-[10px] text-slate-400 block font-bold">ngày nữa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
