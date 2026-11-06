import React, { useState } from 'react';
import { ArrowLeft, Send, Sparkles, Lock, Unlock, Shuffle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuickQAState, UserProfile } from '../../types/game';
import { QUICK_QA_QUESTIONS } from '../../utils/questions';

interface QuickQAProps {
  qaState: QuickQAState;
  isHost: boolean;
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onSubmitAnswer: (answer: string) => void;
  onNextQuestion: (index: number) => void;
  onBack: () => void;
}

export const QuickQA: React.FC<QuickQAProps> = ({
  qaState,
  isHost,
  myProfile,
  partnerProfile,
  onSubmitAnswer,
  onNextQuestion,
  onBack,
}) => {
  const [inputText, setInputText] = useState('');
  const currentIndex = qaState.currentQuestionIndex || 0;
  const currentQuestion = QUICK_QA_QUESTIONS[currentIndex] || QUICK_QA_QUESTIONS[0];

  const myAnswer = isHost ? qaState.hostAnswer : qaState.guestAnswer;
  const partnerAnswer = isHost ? qaState.guestAnswer : qaState.hostAnswer;

  const bothAnswered = !!(myAnswer && partnerAnswer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSubmitAnswer(inputText.trim());
    setInputText('');
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % QUICK_QA_QUESTIONS.length;
    onNextQuestion(nextIdx);
    confetti({ particleCount: 30, spread: 60 });
  };

  const handleRandomQuestion = () => {
    const randIdx = Math.floor(Math.random() * QUICK_QA_QUESTIONS.length);
    onNextQuestion(randIdx);
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

        <button
          onClick={handleRandomQuestion}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold hover:bg-pink-200 transition"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Đổi câu hỏi</span>
        </button>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-pink-200 space-y-5">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[11px] font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hỏi Xoáy Đáp Xoay (Câu {currentIndex + 1}/{QUICK_QA_QUESTIONS.length})</span>
          </div>

          <h3 className="font-extrabold text-slate-800 text-lg leading-snug pt-1">
            "{currentQuestion}"
          </h3>
          <p className="text-[11px] text-slate-400">
            Cả 2 cùng trả lời bí mật, khi cả 2 trả lời xong mới lật bài nhé!
          </p>
        </div>

        {/* Answers Display or Waiting State */}
        <div className="space-y-3">
          {/* My Answer Box */}
          <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-pink-200 flex items-center justify-center text-xs overflow-hidden">
                  {renderAvatar(myProfile.avatar)}
                </div>
                <span className="font-bold text-xs text-slate-700">Câu trả lời của bạn:</span>
              </div>
              {myAnswer && <span className="text-[10px] text-emerald-600 font-bold">✓ Đã gửi</span>}
            </div>

            {myAnswer ? (
              <p className="font-semibold text-xs text-pink-900 bg-white p-3 rounded-xl border border-pink-100">
                {myAnswer}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <textarea
                  rows={2}
                  placeholder="Gõ câu trả lời thật lòng vào đây nè..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:border-pink-500 bg-white"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-full py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-40"
                >
                  Khóa câu trả lời bí mật 🔒
                </button>
              </form>
            )}
          </div>

          {/* Partner Answer Box (Hidden until both answered) */}
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-xs overflow-hidden">
                  {renderAvatar(partnerProfile?.avatar || '🐻')}
                </div>
                <span className="font-bold text-xs text-slate-700">
                  Câu trả lời của {partnerProfile?.name || 'Người yêu'}:
                </span>
              </div>
              {partnerAnswer && !bothAnswered && (
                <span className="text-[10px] text-purple-600 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Đã trả lời (đang khóa)
                </span>
              )}
            </div>

            {bothAnswered ? (
              <div className="font-semibold text-xs text-purple-900 bg-white p-3 rounded-xl border border-purple-100 animate-in flip-in-y">
                <div className="flex items-center gap-1 text-[10px] text-purple-600 font-bold mb-1">
                  <Unlock className="w-3 h-3" /> Đã mở khóa bí mật:
                </div>
                <p className="leading-relaxed">{partnerAnswer}</p>
              </div>
            ) : (
              <div className="py-4 text-center bg-white/70 rounded-xl border border-purple-100 text-xs text-slate-400 flex items-center justify-center gap-2 font-medium">
                <Lock className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>
                  {partnerAnswer
                    ? 'Người yêu đã gửi! Đang chờ bạn gửi câu trả lời...'
                    : 'Đang đợi người yêu gõ câu trả lời bí mật...'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action button when both answered */}
        {bothAnswered && (
          <button
            onClick={handleNext}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-xs rounded-2xl shadow-md active:scale-95 transition"
          >
            Sang câu hỏi tiếp theo ➡️
          </button>
        )}
      </div>
    </div>
  );
};
