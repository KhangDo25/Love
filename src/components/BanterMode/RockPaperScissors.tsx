import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Trophy, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RPSRound, UserProfile } from '../../types/game';
import { RPS_PENALTIES } from '../../utils/questions';

interface RockPaperScissorsProps {
  rpsState: RPSRound;
  rpsScore: { hostWins: number; guestWins: number; draws: number };
  isHost: boolean;
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onMakeMove: (choice: 'rock' | 'paper' | 'scissors') => void;
  onResetRound: (penalty?: string) => void;
  onBack: () => void;
}

const CHOICES = [
  { id: 'rock' as const, label: 'Búa', emoji: '✊', beats: 'scissors' },
  { id: 'paper' as const, label: 'Bao', emoji: '🖐️', beats: 'rock' },
  { id: 'scissors' as const, label: 'Kéo', emoji: '✌️', beats: 'paper' },
];

export const RockPaperScissors: React.FC<RockPaperScissorsProps> = ({
  rpsState,
  rpsScore,
  isHost,
  myProfile,
  partnerProfile,
  onMakeMove,
  onResetRound,
  onBack,
}) => {
  const myChoice = isHost ? rpsState.hostChoice : rpsState.guestChoice;
  const partnerChoice = isHost ? rpsState.guestChoice : rpsState.hostChoice;
  const roundResolved = !!(myChoice && partnerChoice);

  // Determine who won this round
  let outcome: 'win' | 'lose' | 'draw' | null = null;
  if (roundResolved) {
    if (myChoice === partnerChoice) {
      outcome = 'draw';
    } else {
      const myObj = CHOICES.find((c) => c.id === myChoice);
      if (myObj?.beats === partnerChoice) {
        outcome = 'win';
      } else {
        outcome = 'lose';
      }
    }
  }

  const handlePick = (choice: 'rock' | 'paper' | 'scissors') => {
    if (myChoice) return;
    onMakeMove(choice);
  };

  const handleNextRound = () => {
    // Generate penalty for the loser
    const randomPenalty = RPS_PENALTIES[Math.floor(Math.random() * RPS_PENALTIES.length)];
    onResetRound(randomPenalty);
  };

  const getEmoji = (c: 'rock' | 'paper' | 'scissors' | null) => {
    if (c === 'rock') return '✊';
    if (c === 'paper') return '🖐️';
    if (c === 'scissors') return '✌️';
    return '❓';
  };

  const myWins = isHost ? rpsScore.hostWins : rpsScore.guestWins;
  const partnerWins = isHost ? rpsScore.guestWins : rpsScore.hostWins;

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

        {/* Score Pill */}
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-rose-200 shadow-xs text-xs font-black">
          <span className="text-pink-600">{myProfile.name || 'Bạn'}: {myWins}</span>
          <span className="text-slate-300">vs</span>
          <span className="text-purple-600">{partnerProfile?.name || 'Gấu'}: {partnerWins}</span>
        </div>
      </div>

      {/* Main Arena */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-rose-200 text-center space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[11px] font-black">
            <Flame className="w-3.5 h-3.5" />
            <span>Kéo Búa Bao Realtime 🥊</span>
          </div>
          <h3 className="font-black text-slate-800 text-base">Đấu Trí Tìm Người Chịu Phạt</h3>
          <p className="text-[11px] text-slate-400">
            Người thua sẽ phải chịu 1 hình phạt cực kỳ đáng yêu!
          </p>
        </div>

        {/* Dual Battle Screen */}
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-6 rounded-3xl border border-rose-100 relative overflow-hidden">
          <div className="flex items-center justify-around">
            {/* My Side */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-600 mb-2">{myProfile.name || 'Bạn'}</span>
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-md border-3 transition-transform ${
                  roundResolved
                    ? outcome === 'win'
                      ? 'bg-emerald-100 border-emerald-400 scale-110'
                      : 'bg-white border-rose-200'
                    : myChoice
                    ? 'bg-rose-100 border-rose-300'
                    : 'bg-white border-dashed border-slate-300 animate-pulse'
                }`}
              >
                {myChoice ? getEmoji(myChoice) : '❓'}
              </div>
              <span className="text-[11px] font-bold text-slate-400 mt-2">
                {myChoice ? 'Đã ra đòn!' : 'Chọn đòn dưới'}
              </span>
            </div>

            {/* VS Badge */}
            <div className="font-black text-rose-500 text-lg font-mono">VS</div>

            {/* Partner Side */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-600 mb-2">
                {partnerProfile?.name || 'Người yêu'}
              </span>
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-md border-3 transition-transform ${
                  roundResolved
                    ? outcome === 'lose'
                      ? 'bg-emerald-100 border-emerald-400 scale-110'
                      : 'bg-white border-purple-200'
                    : partnerChoice
                    ? 'bg-purple-100 border-purple-300'
                    : 'bg-white border-dashed border-slate-300 animate-pulse'
                }`}
              >
                {roundResolved ? getEmoji(partnerChoice) : partnerChoice ? '🔒' : '❓'}
              </div>
              <span className="text-[11px] font-bold text-slate-400 mt-2">
                {partnerChoice ? (roundResolved ? 'Đã lật bài' : 'Đã chọn xong!') : 'Đang suy nghĩ...'}
              </span>
            </div>
          </div>

          {/* Outcome Banner */}
          {roundResolved && (
            <div className="mt-5 p-3 rounded-2xl bg-white shadow-sm border border-rose-200 animate-in zoom-in-95">
              {outcome === 'win' && (
                <div className="text-emerald-600 font-black text-sm flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  <span>BẠN THẮNG RỒI! Người yêu bị phạt nha! 🎉</span>
                </div>
              )}
              {outcome === 'lose' && (
                <div className="text-rose-600 font-black text-sm flex items-center justify-center gap-1">
                  <span>Ối dồi ôi! Bạn thua rồi, chấp nhận hình phạt đi nè! 😜</span>
                </div>
              )}
              {outcome === 'draw' && (
                <div className="text-amber-600 font-black text-sm flex items-center justify-center gap-1">
                  <span>HÒA NHAU! Hai đứa tâm đầu ý hợp ghê! 🤝</span>
                </div>
              )}

              {/* Penalty Note */}
              {rpsState.penalty && (
                <div className="mt-2.5 p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 font-bold text-left">
                  <span className="text-rose-600 block text-[10px] uppercase font-black">
                    ⚡ HÌNH PHẠT VÒNG NÀY:
                  </span>
                  {rpsState.penalty}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Choice Buttons (when not chosen yet) */}
        {!roundResolved ? (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-bold">Hãy chọn nước đi của bạn:</p>
            <div className="grid grid-cols-3 gap-3">
              {CHOICES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handlePick(c.id)}
                  disabled={!!myChoice}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-90 ${
                    myChoice === c.id
                      ? 'bg-rose-500 border-rose-600 text-white shadow-lg scale-105'
                      : myChoice
                      ? 'opacity-40 border-slate-200'
                      : 'border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-slate-800 bg-white shadow-xs'
                  }`}
                >
                  <span className="text-3xl">{c.emoji}</span>
                  <span className="text-xs font-black">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={handleNextRound}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white font-black text-xs rounded-2xl shadow-lg active:scale-95 transition"
          >
            Ván tiếp theo 🥊 (Đổi hình phạt mới)
          </button>
        )}
      </div>
    </div>
  );
};
