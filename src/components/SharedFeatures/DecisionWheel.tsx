import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, Plus, Trash2, Sparkles, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WheelState, UserProfile } from '../../types/game';
import { WHEEL_PRESETS } from '../../utils/questions';

interface DecisionWheelProps {
  wheelState: WheelState;
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onSpin: (state: WheelState) => void;
  onBack: () => void;
}

const SLICE_COLORS = [
  '#f43f5e',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
];

export const DecisionWheel: React.FC<DecisionWheelProps> = ({
  wheelState,
  myProfile,
  partnerProfile,
  onSpin,
  onBack,
}) => {
  const [category, setCategory] = useState<'food' | 'date' | 'fun'>('food');
  const [options, setOptions] = useState<string[]>(WHEEL_PRESETS.food);
  const [newOption, setNewOption] = useState('');
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isLocalSpinning, setIsLocalSpinning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Switch category
  const handleSelectCategory = (cat: 'food' | 'date' | 'fun') => {
    setCategory(cat);
    setOptions(WHEEL_PRESETS[cat]);
  };

  // Draw the wheel slices on canvas
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 8;
    const numSlices = options.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, size, size);

    // Draw slices
    for (let i = 0; i < numSlices; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.fillStyle = SLICE_COLORS[i % SLICE_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Nunito, sans-serif';
      ctx.fillText(options[i], radius - 20, 5);
      ctx.restore();
    }

    // Draw center pin
    ctx.beginPath();
    ctx.arc(center, center, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();
  };

  useEffect(() => {
    drawWheel();
  }, [options]);

  // Sync external spin events from partner
  useEffect(() => {
    if (wheelState.spinning && wheelState.timestamp) {
      setIsLocalSpinning(true);
      setCurrentRotation(wheelState.targetAngle);

      const timer = setTimeout(() => {
        setIsLocalSpinning(false);
        confetti({ particleCount: 50, spread: 70 });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [wheelState.timestamp, wheelState.targetAngle]);

  const handleTriggerSpin = () => {
    if (isLocalSpinning || options.length === 0) return;

    // Pick random winning slice
    const winningIndex = Math.floor(Math.random() * options.length);
    const sliceAngle = 360 / options.length;
    // Calculate angle that will point at top (270 deg)
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    const targetAngle =
      currentRotation +
      extraSpins +
      (360 - winningIndex * sliceAngle - sliceAngle / 2);

    const winningOption = options[winningIndex];

    const nextState: WheelState = {
      spinning: true,
      targetAngle,
      selectedOption: winningOption,
      spunBy: myProfile.name || 'Bạn',
      timestamp: Date.now(),
    };

    onSpin(nextState);
  };

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOption.trim()) return;
    setOptions([...options, newOption.trim()]);
    setNewOption('');
  };

  const handleRemoveOption = (idx: number) => {
    if (options.length <= 2) return; // Keep at least 2
    setOptions(options.filter((_, i) => i !== idx));
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

        <span className="text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
          Vòng Quay Quyết Định 🎡
        </span>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-pink-200 text-center space-y-4">
        {/* Category Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => handleSelectCategory('food')}
            className={`py-2 text-xs font-black rounded-xl transition ${
              category === 'food'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ăn gì? 🍲
          </button>
          <button
            onClick={() => handleSelectCategory('date')}
            className={`py-2 text-xs font-black rounded-xl transition ${
              category === 'date'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đi đâu? 🛵
          </button>
          <button
            onClick={() => handleSelectCategory('fun')}
            className={`py-2 text-xs font-black rounded-xl transition ${
              category === 'fun'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Làm gì? 🎬
          </button>
        </div>

        {/* Wheel Box with Arrow Pointer */}
        <div className="relative flex flex-col items-center justify-center py-2">
          {/* Top Indicator Arrow */}
          <div className="absolute top-0 z-20 text-rose-600 drop-shadow-md -translate-y-1">
            <span className="text-3xl">🔻</span>
          </div>

          {/* Canvas Wheel with CSS rotation */}
          <div
            className="w-[280px] h-[280px] rounded-full shadow-xl border-4 border-white transition-transform duration-[4000ms] ease-out"
            style={{
              transform: `rotate(${currentRotation}deg)`,
            }}
          >
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="w-full h-full rounded-full"
            />
          </div>
        </div>

        {/* Selected Result Banner */}
        {wheelState.selectedOption && !isLocalSpinning && (
          <div className="p-3 bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 rounded-2xl animate-in zoom-in-95">
            <span className="text-[10px] uppercase font-black text-slate-400 block">
              KẾT QUẢ VÒNG QUAY:
            </span>
            <span className="text-lg font-black text-rose-600 mt-0.5 block">
              {wheelState.selectedOption}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Chốt đơn này nhé, không được đổi ý đâu nha! 😜
            </span>
          </div>
        )}

        {/* Spin Trigger Button */}
        <button
          onClick={handleTriggerSpin}
          disabled={isLocalSpinning}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-black text-sm rounded-2xl shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {isLocalSpinning ? 'Đang quay tít thò lò... 🎡' : 'QUAY NGAY CÙNG NHAU 🎡'}
        </button>

        {/* Options Editor */}
        <div className="pt-2 text-left space-y-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700">Các lựa chọn trong vòng quay:</span>

          <form onSubmit={handleAddOption} className="flex gap-2">
            <input
              type="text"
              placeholder="Thêm món/nơi khác..."
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              disabled={!newOption.trim()}
              className="px-3 py-1.5 bg-rose-500 text-white font-bold text-xs rounded-xl disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {options.map((opt, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700"
              >
                <span>{opt}</span>
                {options.length > 2 && (
                  <button
                    onClick={() => handleRemoveOption(idx)}
                    className="hover:text-red-500"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
