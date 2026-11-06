import React from 'react';
import { ArrowLeft, CheckCircle2, Trophy, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UnderstandingQuizState, UserProfile } from '../../types/game';
import { UNDERSTANDING_QUESTIONS } from '../../utils/questions';

interface UnderstandingQuizProps {
  quizState: UnderstandingQuizState;
  isHost: boolean;
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onSubmitAnswer: (questionIndex: number, answer: string) => void;
  onNextQuestion: (nextIndex: number) => void;
  onRestartQuiz: () => void;
  onBack: () => void;
}

export const UnderstandingQuiz: React.FC<UnderstandingQuizProps> = ({
  quizState,
  isHost,
  myProfile,
  partnerProfile,
  onSubmitAnswer,
  onNextQuestion,
  onRestartQuiz,
  onBack,
}) => {
  const currentIndex = quizState.currentQuestionIndex || 0;
  const currentQ = UNDERSTANDING_QUESTIONS[currentIndex];

  const myAnswers = isHost ? quizState.hostAnswers : quizState.guestAnswers;
  const partnerAnswers = isHost ? quizState.guestAnswers : quizState.hostAnswers;

  const myCurrentAnswer = myAnswers[currentIndex];
  const partnerCurrentAnswer = partnerAnswers[currentIndex];

  const bothAnswered = myCurrentAnswer !== undefined && partnerCurrentAnswer !== undefined;

  // Calculate overall match score when all 10 completed
  const totalCompleted = UNDERSTANDING_QUESTIONS.filter(
    (q, idx) => quizState.hostAnswers[idx] && quizState.guestAnswers[idx]
  ).length;

  const matches = UNDERSTANDING_QUESTIONS.filter(
    (q, idx) =>
      quizState.hostAnswers[idx] &&
      quizState.guestAnswers[idx] &&
      quizState.hostAnswers[idx] === quizState.guestAnswers[idx]
  ).length;

  const isAllFinished = totalCompleted === UNDERSTANDING_QUESTIONS.length;

  const handleSelectAnswer = (option: string) => {
    onSubmitAnswer(currentIndex, option);
  };

  const handleNext = () => {
    if (currentIndex < UNDERSTANDING_QUESTIONS.length - 1) {
      onNextQuestion(currentIndex + 1);
    } else {
      confetti({ particleCount: 70, spread: 80 });
    }
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
        <div className="text-xs font-black text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
          Câu {currentIndex + 1} / {UNDERSTANDING_QUESTIONS.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / UNDERSTANDING_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {isAllFinished ? (
        // Results summary screen
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-pink-200 text-center space-y-5 animate-in zoom-in-95">
          <div className="w-20 h-20 mx-auto rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-4xl shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-pink-500">
              KẾT QUẢ ĐỘ HIỂU NHAU
            </span>
            <div className="text-5xl font-black text-rose-500 mt-1 font-mono">
              {Math.round((matches / UNDERSTANDING_QUESTIONS.length) * 100)}%
            </div>
            <p className="text-slate-700 font-bold mt-2 text-sm">
              Trùng khớp {matches} / {UNDERSTANDING_QUESTIONS.length} câu trả lời!
            </p>
          </div>

          <div className="p-4 bg-pink-50 rounded-2xl border border-pink-200 text-xs text-rose-900 leading-relaxed font-medium">
            {matches >= 8 ? (
              <span>Thần giao cách cảm siêu đỉnh! Hai bạn như sinh ra để dành cho nhau, không cần nói cũng tự hiểu 💕</span>
            ) : matches >= 5 ? (
              <span>Khá là ăn ý! Thỉnh thoảng vẫn có vài điểm lệch pha tạo nên sự thú vị bất ngờ cho tình yêu 🌸</span>
            ) : (
              <span>Cặp đôi "nam châm trái dấu"! Tuy suy nghĩ khác nhau nhưng bù trừ cho nhau cực kỳ hài hước và ngọt ngào ⚡</span>
            )}
          </div>

          <button
            onClick={onRestartQuiz}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Chơi lại từ đầu</span>
          </button>
        </div>
      ) : (
        // Active Question Screen
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-pink-200 space-y-5">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 inline-block">
              Thử thách thấu hiểu 💕
            </span>
            <h3 className="font-extrabold text-slate-800 text-base leading-snug">
              {currentQ.question}
            </h3>
            <p className="text-[11px] text-slate-400">
              Hãy chọn câu trả lời theo đúng tính cách của người yêu nhé!
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt) => {
              const isSelected = myCurrentAnswer === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelectAnswer(opt)}
                  className={`w-full p-3.5 rounded-2xl border-2 font-bold text-left text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-pink-100 border-pink-500 text-pink-900 shadow-sm'
                      : 'border-slate-200 hover:border-pink-300 text-slate-700 bg-slate-50/50'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Waiting/Reveal status */}
          <div className="p-3 bg-rose-50/70 rounded-2xl border border-pink-100 text-xs">
            {!bothAnswered ? (
              <div className="text-center text-slate-500 font-semibold flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                <span>
                  {myCurrentAnswer ? 'Đã chọn! Đang chờ người yêu chọn...' : 'Hãy chọn một câu trả lời ở trên nhé!'}
                </span>
              </div>
            ) : (
              <div className="space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">Người yêu chọn:</span>
                  <span className="font-black text-purple-700">{partnerCurrentAnswer}</span>
                </div>
                <div className="text-center pt-1">
                  {myCurrentAnswer === partnerCurrentAnswer ? (
                    <span className="font-black text-emerald-600 text-xs inline-flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Trùng khớp rồi! +20 Độ Yêu 💕
                    </span>
                  ) : (
                    <span className="font-bold text-amber-600 text-xs">
                      Khác nhau rồi nè, lát phạt thơm má nha! 😜
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {bothAnswered && (
            <button
              onClick={handleNext}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-xs rounded-2xl shadow-md active:scale-95 transition"
            >
              {currentIndex < UNDERSTANDING_QUESTIONS.length - 1 ? 'Câu tiếp theo ➡️' : 'Xem kết quả tổng kết 🏆'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
