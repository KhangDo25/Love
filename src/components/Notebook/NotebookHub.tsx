import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Heart, Sparkles, AlertCircle } from 'lucide-react';
import {
  CoupleGameState,
  UserProfile,
  DiaryEntry,
  LikesDislikes as LikesDislikesType,
} from '../../types/game';
import { TimelineDiary } from './TimelineDiary';
import { LikesDislikes } from './LikesDislikes';

interface NotebookHubProps {
  gameState: CoupleGameState;
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onBack: () => void;
  onAddDiary: (entry: DiaryEntry) => void;
  onUpdateLikesDislikes: (data: LikesDislikesType) => void;
}

type NotebookSubView = 'hub' | 'timeline' | 'likes';

export const NotebookHub: React.FC<NotebookHubProps> = ({
  gameState,
  myProfile,
  partnerProfile,
  onBack,
  onAddDiary,
  onUpdateLikesDislikes,
}) => {
  const [subView, setSubView] = useState<NotebookSubView>('hub');

  if (subView === 'timeline') {
    return (
      <TimelineDiary
        diaries={gameState.diaries}
        myProfile={myProfile}
        onAddDiary={onAddDiary}
        onBack={() => setSubView('hub')}
      />
    );
  }

  if (subView === 'likes') {
    return (
      <LikesDislikes
        likesDislikes={gameState.likesDislikes}
        myProfile={myProfile}
        partnerProfile={partnerProfile}
        onUpdate={onUpdateLikesDislikes}
        onBack={() => setSubView('hub')}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-pink-200 text-xs font-bold text-slate-700 shadow-xs hover:bg-pink-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chính</span>
        </button>

        <div className="flex items-center gap-1 text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Sổ Tay Yêu Nhau</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 p-6 rounded-3xl text-white shadow-xl text-center space-y-2">
        <span className="text-3xl">📖</span>
        <h2 className="text-2xl font-black tracking-tight">Nhật Ký & Cẩm Nang Đôi 💕</h2>
        <p className="text-xs text-pink-100 font-medium">
          Nơi lưu giữ từng kỷ niệm ngọt ngào và bí kíp chiều chuộng người yêu!
        </p>
      </div>

      {/* 2 Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {/* 1. Nhật ký dòng thời gian */}
        <div
          onClick={() => setSubView('timeline')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setSubView('timeline'); }}
          className="p-4 bg-white rounded-3xl border-2 border-pink-100 shadow-md hover:shadow-pink-200 hover:border-pink-300 transition-all cursor-pointer flex items-center justify-between active:scale-98"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              📅
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Nhật Ký Theo Dòng Thời Gian 📖</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ghi lại các ngày kỷ niệm, những chuyến đi và khoảnh khắc đáng nhớ
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-pink-500">Mở ➔</span>
        </div>

        {/* 2. Danh sách thích / ghét */}
        <div
          onClick={() => setSubView('likes')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setSubView('likes'); }}
          className="p-4 bg-white rounded-3xl border-2 border-pink-100 shadow-md hover:shadow-pink-200 hover:border-pink-300 transition-all cursor-pointer flex items-center justify-between active:scale-98"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🎁
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Danh Sách Thích / Ghét 📝</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ghi nhớ món người yêu thích và những bẫy ngầm cần tuyệt đối tránh!
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-purple-500">Xem ➔</span>
        </div>
      </div>
    </div>
  );
};
