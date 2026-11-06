import React, { useState } from 'react';
import { ArrowLeft, CheckSquare, Square, Plus, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BucketItem, UserProfile } from '../../types/game';

interface BucketListProps {
  bucketList: BucketItem[];
  myProfile: UserProfile;
  onUpdateBucketList: (updatedList: BucketItem[]) => void;
  onBack: () => void;
}

export const BucketList: React.FC<BucketListProps> = ({
  bucketList,
  myProfile,
  onUpdateBucketList,
  onBack,
}) => {
  const [newWish, setNewWish] = useState('');

  const completedCount = bucketList.filter((item) => item.completed).length;
  const progressPercent =
    bucketList.length > 0 ? Math.round((completedCount / bucketList.length) * 100) : 0;

  const handleToggle = (id: string) => {
    const updated = bucketList.map((item) => {
      if (item.id === id) {
        const nextCompleted = !item.completed;
        if (nextCompleted) {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.7 },
          });
        }
        return {
          ...item,
          completed: nextCompleted,
          completedAt: nextCompleted ? Date.now() : undefined,
        };
      }
      return item;
    });
    onUpdateBucketList(updated);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.trim()) return;

    const newItem: BucketItem = {
      id: `bucket_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: newWish.trim(),
      completed: false,
      addedBy: myProfile.name || 'Người yêu',
    };

    onUpdateBucketList([...bucketList, newItem]);
    setNewWish('');
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

        <span className="text-xs font-black text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
          Đã đạt {completedCount}/{bucketList.length} ước mơ
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-pink-200 space-y-4">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 text-pink-500 shadow-inner">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">Lời Hẹn Ước Của 2 Đứa 💕</h3>
          <p className="text-[11px] text-slate-400">
            Những điều chúng mình nhất định phải cùng nhau làm trong đời
          </p>
        </div>

        {/* Progress Bar */}
        <div className="p-3 bg-pink-50 rounded-2xl border border-pink-100 space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-pink-700">Tiến độ hẹn ước:</span>
            <span className="text-rose-600 font-black">{progressPercent}%</span>
          </div>
          <div className="w-full bg-pink-200/60 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Add wish form */}
        <form onSubmit={handleAddWish} className="flex gap-2">
          <input
            type="text"
            placeholder="Thêm điều ước mới cùng nhau..."
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:border-pink-500 bg-pink-50/20"
          />
          <button
            type="submit"
            disabled={!newWish.trim()}
            className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-40 flex items-center gap-1 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm</span>
          </button>
        </form>

        {/* Bucket List Items */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pt-1">
          {bucketList.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                item.completed
                  ? 'bg-emerald-50/80 border-emerald-300 text-slate-400 line-through'
                  : 'bg-white border-pink-100 hover:border-pink-300 text-slate-700 font-bold'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 pr-2">
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-pink-300 shrink-0" />
                )}
                <span>{item.text}</span>
              </div>

              {item.completed && (
                <span className="text-[10px] font-black text-emerald-600 px-2 py-0.5 bg-emerald-100 rounded-full shrink-0">
                  Đã hoàn thành ✨
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
