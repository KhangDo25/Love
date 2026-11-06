import React, { useState } from 'react';
import { ArrowLeft, Flame, Swords, Gavel, Trophy, HelpCircle } from 'lucide-react';
import {
  CoupleGameState,
  UserProfile,
  CoupleCourtCase,
} from '../../types/game';
import { RockPaperScissors } from './RockPaperScissors';
import { TruthOrDare } from './TruthOrDare';
import { CoupleCourt } from './CoupleCourt';
import { Scoreboard } from './Scoreboard';

interface BanterModeHubProps {
  gameState: CoupleGameState;
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onBack: () => void;
  onRPSMove: (choice: 'rock' | 'paper' | 'scissors') => void;
  onRPSReset: (penalty?: string) => void;
  onAddLovePoints: (pts: number) => void;
  onAddCourtCase: (newCase: CoupleCourtCase) => void;
  onVoteCourtCase: (caseId: string, verdict: 'guilty' | 'innocent', penalty: string) => void;
}

type BanterSubView = 'hub' | 'rps' | 'tod' | 'court' | 'scores';

export const BanterModeHub: React.FC<BanterModeHubProps> = ({
  gameState,
  myProfile,
  partnerProfile,
  onBack,
  onRPSMove,
  onRPSReset,
  onAddLovePoints,
  onAddCourtCase,
  onVoteCourtCase,
}) => {
  const [subView, setSubView] = useState<BanterSubView>('hub');

  if (subView === 'rps') {
    return (
      <RockPaperScissors
        rpsState={gameState.rps}
        rpsScore={gameState.rpsScore}
        isHost={gameState.isHost}
        myProfile={myProfile}
        partnerProfile={partnerProfile}
        onMakeMove={onRPSMove}
        onResetRound={onRPSReset}
        onBack={() => setSubView('hub')}
      />
    );
  }

  if (subView === 'tod') {
    return (
      <TruthOrDare
        myProfile={myProfile}
        partnerProfile={partnerProfile}
        onAddLovePoints={onAddLovePoints}
        onBack={() => setSubView('hub')}
      />
    );
  }

  if (subView === 'court') {
    return (
      <CoupleCourt
        cases={gameState.courtCases}
        myProfile={myProfile}
        partnerProfile={partnerProfile}
        onAddCase={onAddCourtCase}
        onVoteCase={onVoteCourtCase}
        onBack={() => setSubView('hub')}
      />
    );
  }

  if (subView === 'scores') {
    return (
      <Scoreboard
        rpsScore={gameState.rpsScore}
        isHost={gameState.isHost}
        myProfile={myProfile}
        partnerProfile={partnerProfile}
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-200 text-xs font-bold text-slate-700 shadow-xs hover:bg-rose-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chính</span>
        </button>

        <div className="flex items-center gap-1 text-xs font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>Chế Độ Cà Khịa</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-orange-500 via-rose-500 to-red-500 p-6 rounded-3xl text-white shadow-xl text-center space-y-2">
        <span className="text-3xl">🥊</span>
        <h2 className="text-2xl font-black tracking-tight">Đấu Trường Cà Khịa 🔥</h2>
        <p className="text-xs text-orange-100 font-medium">
          Dành cho những lúc muốn "hơn thua" dễ thương và bắt đối phương chịu phạt!
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {/* 1. Kéo búa bao */}
        <div
          onClick={() => setSubView('rps')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setSubView('rps'); }}
          className="p-4 bg-white rounded-3xl border-2 border-orange-100 shadow-md hover:shadow-orange-200 hover:border-orange-300 transition-all cursor-pointer flex items-center justify-between active:scale-98"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              ✌️
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Kéo Búa Bao Realtime 🥊</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ra đòn bí mật, đồng thời mở bài và áp dụng hình phạt vui nhẹ
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-orange-500">Chơi ➔</span>
        </div>

        {/* 2. Thật hay thách */}
        <div
          onClick={() => setSubView('tod')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setSubView('tod'); }}
          className="p-4 bg-white rounded-3xl border-2 border-orange-100 shadow-md hover:shadow-orange-200 hover:border-orange-300 transition-all cursor-pointer flex items-center justify-between active:scale-98"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🎭
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Thật Hay Thách Đố 🔥</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                &gt;40 câu hỏi thật lòng & &gt;40 thử thách vui bựa không phản cảm
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-red-500">Chơi ➔</span>
        </div>

        {/* 3. Ai đúng ai sai */}
        <div
          onClick={() => setSubView('court')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setSubView('court'); }}
          className="p-4 bg-white rounded-3xl border-2 border-orange-100 shadow-md hover:shadow-orange-200 hover:border-orange-300 transition-all cursor-pointer flex items-center justify-between active:scale-98"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              ⚖️
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Ai Đúng Ai Sai (Tòa Án) 🔨</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Kể lại tình huống khó đỡ và bỏ phiếu "Có tội" hay "Vô tội"
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-rose-500">Xử án ➔</span>
        </div>

        {/* 4. Bảng điểm thắng thua */}
        <div
          onClick={() => setSubView('scores')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setSubView('scores'); }}
          className="p-4 bg-white rounded-3xl border-2 border-orange-100 shadow-md hover:shadow-orange-200 hover:border-orange-300 transition-all cursor-pointer flex items-center justify-between active:scale-98"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🏆
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Bảng Điểm Thắng Thua 🥇</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Xem ai đang thống trị nóc nhà và ai đang nợ nhiều trà sữa nhất
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-yellow-600">Xem ➔</span>
        </div>
      </div>
    </div>
  );
};
