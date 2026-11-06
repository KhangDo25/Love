import React, { useState } from 'react';
import { ArrowLeft, Heart, Sparkles, MessageSquareHeart, Mail, CheckCircle2 } from 'lucide-react';
import {
  CoupleGameState,
  UserProfile,
  LoveLetter,
  BucketItem,
} from '../../types/game';
import { UnderstandingQuiz } from './UnderstandingQuiz';
import { QuickQA } from './QuickQA';
import { LoveLetters } from './LoveLetters';
import { BucketList } from './BucketList';

interface SweetModeHubProps {
  gameState: CoupleGameState;
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onBack: () => void;
  onQuizSubmitAnswer: (index: number, answer: string) => void;
  onQuizNextQuestion: (index: number) => void;
  onQuizRestart: () => void;
  onQASubmitAnswer: (answer: string) => void;
  onQANextQuestion: (index: number) => void;
  onSendLetter: (letter: LoveLetter) => void;
  onMarkLetterRead: (id: string) => void;
  onUpdateBucketList: (items: BucketItem[]) => void;
}

type SweetSubView = 'hub' | 'quiz' | 'qa' | 'letters' | 'bucket';

export const SweetModeHub: React.FC<SweetModeHubProps> = ({
  gameState,
  myProfile,
  partnerProfile,
  onBack,
  onQuizSubmitAnswer,
  onQuizNextQuestion,
  onQuizRestart,
  onQASubmitAnswer,
  onQANextQuestion,
  onSendLetter,
  onMarkLetterRead,
  onUpdateBucketList,
}) => {
  const [subView, setSubView] = useState<SweetSubView>('hub');

  if (subView === 'quiz') {
    return (
      <UnderstandingQuiz
        quizState={gameState.understandingQuiz}
        isHost={gameState.isHost}
        myProfile={myProfile}
        partnerProfile={partnerProfile}
        onSubmitAnswer={onQuizSubmitAnswer}
        onNextQuestion={onQuizNextQuestion}
        onRestartQuiz={onQuizRestart}
        onBack={() => setSubView('hub')}
      />
    );
  }

  if (subView === 'qa') {
    return (
      <QuickQA
        qaState={gameState.quickQA}
        isHost={gameState.isHost}
        myProfile={myProfile}
        partnerProfile={partnerProfile}
        onSubmitAnswer={onQASubmitAnswer}
        onNextQuestion={onQANextQuestion}
        onBack={() => setSubView('hub')}
      />
    );
  }

  if (subView === 'letters') {
    return (
      <LoveLetters
        letters={gameState.letters}
        myProfile={myProfile}
        partnerProfile={partnerProfile}
        onSendLetter={onSendLetter}
        onMarkRead={onMarkLetterRead}
        onBack={() => setSubView('hub')}
      />
    );
  }

  if (subView === 'bucket') {
    return (
      <BucketList
        bucketList={gameState.bucketList}
        myProfile={myProfile}
        onUpdateBucketList={onUpdateBucketList}
        onBack={() => setSubView('hub')}
      />
    );
  }

  const unreadLetters = gameState.letters.filter(
    (l) => !l.read && l.senderId !== myProfile.id
  ).length;

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
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Chế Độ Ngọt Ngào</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 p-6 rounded-3xl text-white shadow-xl text-center space-y-2">
        <span className="text-3xl">🍯</span>
        <h2 className="text-2xl font-black tracking-tight">Vương Quốc Mật Ngọt 💕</h2>
        <p className="text-xs text-pink-100 font-medium">
          Dành riêng cho những khoảnh khắc dịu dàng, thấu hiểu và lãng mạn của hai đứa!
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {/* 1. Bao nhiêu hiểu nhau */}
        <div
          onClick={() => setSubView('quiz')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setSubView('quiz'); }}
          className="p-4 bg-white rounded-3xl border-2 border-pink-100 shadow-md hover:shadow-pink-200 hover:border-pink-300 transition-all cursor-pointer flex items-center justify-between active:scale-98"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🧠
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Bao Nhiêu Hiểu Nhau 🎯</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Trả lời 10 câu về người yêu xem hai đứa thấu hiểu nhau đến mức nào
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-pink-500">Chơi ➔</span>
        </div>

        {/* 2. Hỏi xoáy đáp xoay */}
        <div
          onClick={() => setSubView('qa')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setSubView('qa'); }}
          className="p-4 bg-white rounded-3xl border-2 border-pink-100 shadow-md hover:shadow-pink-200 hover:border-pink-300 transition-all cursor-pointer flex items-center justify-between active:scale-98"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              💬
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Hỏi Xoáy Đáp Xoay 🌀</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                &gt;40 câu hỏi bí mật, cả 2 cùng trả lời rồi đồng thời lật mở
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-purple-500">Chơi ➔</span>
        </div>

        {/* 3. Hộp thư tình */}
        <div
          onClick={() => setSubView('letters')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setSubView('letters'); }}
          className="p-4 bg-white rounded-3xl border-2 border-pink-100 shadow-md hover:shadow-pink-200 hover:border-pink-300 transition-all cursor-pointer flex items-center justify-between active:scale-98 relative"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              💌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-800 text-sm">Hộp Thư Tình Yêu 📮</h4>
                {unreadLetters > 0 && (
                  <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full animate-bounce">
                    {unreadLetters} thư mới
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Gửi và mở những phong thư bí mật lãng mạn có hiệu ứng phong bì
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-rose-500">Mở ➔</span>
        </div>

        {/* 4. Lời hẹn ước */}
        <div
          onClick={() => setSubView('bucket')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setSubView('bucket'); }}
          className="p-4 bg-white rounded-3xl border-2 border-pink-100 shadow-md hover:shadow-pink-200 hover:border-pink-300 transition-all cursor-pointer flex items-center justify-between active:scale-98"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              ⭐
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Lời Hẹn Ước Đôi 💍</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Bucket list những mục tiêu, chuyến đi mà cả 2 hứa cùng làm
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-500">Xem ➔</span>
        </div>
      </div>
    </div>
  );
};
