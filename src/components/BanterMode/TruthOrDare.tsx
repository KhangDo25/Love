import React, { useState } from 'react';
import { ArrowLeft, Sparkles, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRUTH_QUESTIONS, DARE_CHALLENGES } from '../../utils/questions';
import { UserProfile } from '../../types/game';

interface TruthOrDareProps {
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onAddLovePoints: (pts: number) => void;
  onBack: () => void;
}

export const TruthOrDare: React.FC<TruthOrDareProps> = ({
  myProfile,
  partnerProfile,
  onAddLovePoints,
  onBack,
}) => {
  const [mode, setMode] = useState<'truth' | 'dare' | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);

  const handleSelectMode = (selected: 'truth' | 'dare') => {
    setMode(selected);
    const list = selected === 'truth' ? TRUTH_QUESTIONS : DARE_CHALLENGES;
    setCurrentIndex(Math.floor(Math.random() * list.length));
    setCompleted(false);
    setTimerSeconds(selected === 'dare' ? 60 : null);
  };

  const handleNextChallenge = () => {
    if (!mode) return;
    const list = mode === 'truth' ? TRUTH_QUESTIONS : DARE_CHALLENGES;
    setCurrentIndex((prev) => (prev + 1) % list.length);
    setCompleted(false);
  };

  const handleComplete = () => {
    setCompleted(true);
    onAddLovePoints(20);
    confetti({ particleCount: 50, spread: 70 });
  };

  const currentItem =
    mode === 'truth'
      ? TRUTH_QUESTIONS[currentIndex]
      : mode === 'dare'
      ? DARE_CHALLENGES[currentIndex]
      : '';

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

        <span className="text-xs font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
          Thật Hay Thách 🔥
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-rose-200 text-center space-y-5">
        <div className="space-y-1">
          <span className="text-3xl">🎭</span>
          <h3 className="font-extrabold text-slate-800 text-base">
            Thật Hay Thách Cho Cặp Đôi
          </h3>
          <p className="text-[11px] text-slate-400">
            Nói ra bí mật sâu kín hoặc thực hiện thử thách siêu bựa!
          </p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSelectMode('truth')}
            className={`py-3.5 px-3 rounded-2xl font-black text-xs border-2 flex items-center justify-center gap-2 transition-all active:scale-95 ${
              mode === 'truth'
                ? 'bg-blue-500 border-blue-600 text-white shadow-md scale-102'
                : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <span>🗣️</span>
            <span>NÓI THẬT (TRUTH)</span>
          </button>

          <button
            onClick={() => handleSelectMode('dare')}
            className={`py-3.5 px-3 rounded-2xl font-black text-xs border-2 flex items-center justify-center gap-2 transition-all active:scale-95 ${
              mode === 'dare'
                ? 'bg-orange-500 border-orange-600 text-white shadow-md scale-102'
                : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
            }`}
          >
            <span>🔥</span>
            <span>THÁCH ĐỐ (DARE)</span>
          </button>
        </div>

        {/* Challenge Box */}
        {mode ? (
          <div className="space-y-4 animate-in fade-in">
            <div
              className={`p-6 rounded-3xl border-2 space-y-3 ${
                mode === 'truth'
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 text-blue-950'
                  : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 text-orange-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/80">
                  {mode === 'truth' ? 'Bí Mật Nói Thật' : 'Thử Thách Hành Động'} #
                  {currentIndex + 1}
                </span>

                <button
                  onClick={handleNextChallenge}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white/60 px-2 py-0.5 rounded-full"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Đổi câu</span>
                </button>
              </div>

              <p className="font-extrabold text-base leading-relaxed text-slate-800 py-2">
                "{currentItem}"
              </p>
            </div>

            {/* Complete challenge button */}
            {!completed ? (
              <button
                onClick={handleComplete}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <CheckCircle className="w-4 h-4" />
                <span>ĐÃ THỰC HIỆN XONG (+20 ĐỘ YÊU) 💕</span>
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-700 font-extrabold text-xs flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Xuất sắc! Đã cộng +20 điểm Độ Yêu vào quỹ chung!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 bg-rose-50/50 rounded-2xl border border-dashed border-rose-200 text-xs text-slate-400 font-medium">
            Hãy chọn "NÓI THẬT" hoặc "THÁCH ĐỐ" ở trên để bắt đầu!
          </div>
        )}
      </div>
    </div>
  );
};
