import React, { useState } from 'react';
import { ArrowLeft, Clock, Paintbrush, Disc, Sparkles } from 'lucide-react';
import {
  CoupleGameState,
  UserProfile,
  DrawStroke,
  WheelState,
} from '../../types/game';
import { CountdownAnniversary } from './CountdownAnniversary';
import { RealtimeDrawing } from './RealtimeDrawing';
import { DecisionWheel } from './DecisionWheel';

interface SharedHubProps {
  gameState: CoupleGameState;
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onBack: () => void;
  onSendStroke: (stroke: DrawStroke) => void;
  onClearCanvas: () => void;
  onSpinWheel: (state: WheelState) => void;
}

type SharedSubView = 'hub' | 'countdown' | 'drawing' | 'wheel';

export const SharedHub: React.FC<SharedHubProps> = ({
  gameState,
  myProfile,
  partnerProfile,
  onBack,
  onSendStroke,
  onClearCanvas,
  onSpinWheel,
}) => {
  const [subView, setSubView] = useState<SharedSubView>('hub');

  if (subView === 'countdown') {
    return (
      <CountdownAnniversary
        myProfile={myProfile}
        partnerProfile={partnerProfile}
        onBack={() => setSubView('hub')}
      />
    );
  }

  if (subView === 'drawing') {
    return (
      <RealtimeDrawing
        drawingStrokes={gameState.drawingStrokes}
        myProfile={myProfile}
        partnerProfile={partnerProfile}
        onSendStroke={onSendStroke}
        onClearCanvas={onClearCanvas}
        onBack={() => setSubView('hub')}
      />
    );
  }

  if (subView === 'wheel') {
    return (
      <DecisionWheel
        wheelState={gameState.wheelState}
        myProfile={myProfile}
        partnerProfile={partnerProfile}
        onSpin={onSpinWheel}
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

        <div className="flex items-center gap-1 text-xs font-black text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tính Năng Dùng Chung</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 p-6 rounded-3xl text-white shadow-xl text-center space-y-2">
        <span className="text-3xl">💞</span>
        <h2 className="text-2xl font-black tracking-tight">Góc Chung Của 2 Đứa</h2>
        <p className="text-xs text-purple-100 font-medium">
          Cùng vẽ tranh, đếm ngược ngày kỷ niệm và quay vòng quay giải cứu những cơn đói!
        </p>
      </div>

      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {/* 1. Đếm ngược kỷ niệm */}
        <div
          onClick={() => setSubView('countdown')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setSubView('countdown'); }}
          className="p-4 bg-white rounded-3xl border-2 border-purple-100 shadow-md hover:shadow-purple-200 hover:border-purple-300 transition-all cursor-pointer flex items-center justify-between active:scale-98"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              ⏳
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Đếm Ngược Kỷ Niệm 💑</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Đếm số ngày đã bên nhau, sinh nhật và các cột mốc 100, 365 ngày
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-purple-500">Xem ➔</span>
        </div>

        {/* 2. Bảng vẽ chung realtime */}
        <div
          onClick={() => setSubView('drawing')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setSubView('drawing'); }}
          className="p-4 bg-white rounded-3xl border-2 border-pink-100 shadow-md hover:shadow-pink-200 hover:border-pink-300 transition-all cursor-pointer flex items-center justify-between active:scale-98"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🎨
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Bảng Vẽ Chung Realtime 🖌️</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Cùng nhau vẽ trái tim, ký tên và vẽ bậy đồng thời trên 2 màn hình
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-pink-500">Vẽ ➔</span>
        </div>

        {/* 3. Vòng quay hôm nay ăn gì/đi đâu */}
        <div
          onClick={() => setSubView('wheel')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setSubView('wheel'); }}
          className="p-4 bg-white rounded-3xl border-2 border-rose-100 shadow-md hover:shadow-rose-200 hover:border-rose-300 transition-all cursor-pointer flex items-center justify-between active:scale-98"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🎡
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Vòng Quay Quyết Định 🍲</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ăn gì? Đi đâu? Làm gì? Bấm quay đồng bộ trên cả 2 điện thoại
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-rose-500">Quay ➔</span>
        </div>
      </div>
    </div>
  );
};
