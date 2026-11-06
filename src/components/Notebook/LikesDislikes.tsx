import React, { useState } from 'react';
import { ArrowLeft, Heart, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { LikesDislikes as LikesDislikesType, UserProfile } from '../../types/game';

interface LikesDislikesProps {
  likesDislikes: LikesDislikesType;
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onUpdate: (updated: LikesDislikesType) => void;
  onBack: () => void;
}

export const LikesDislikes: React.FC<LikesDislikesProps> = ({
  likesDislikes,
  myProfile,
  partnerProfile,
  onUpdate,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'mine' | 'partner'>('mine');
  const [newLike, setNewLike] = useState('');
  const [newDislike, setNewDislike] = useState('');

  const handleAddLike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLike.trim()) return;

    if (activeTab === 'mine') {
      onUpdate({
        ...likesDislikes,
        myLikes: [...(likesDislikes.myLikes || []), newLike.trim()],
      });
    } else {
      onUpdate({
        ...likesDislikes,
        partnerLikes: [...(likesDislikes.partnerLikes || []), newLike.trim()],
      });
    }
    setNewLike('');
  };

  const handleAddDislike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDislike.trim()) return;

    if (activeTab === 'mine') {
      onUpdate({
        ...likesDislikes,
        myDislikes: [...(likesDislikes.myDislikes || []), newDislike.trim()],
      });
    } else {
      onUpdate({
        ...likesDislikes,
        partnerDislikes: [...(likesDislikes.partnerDislikes || []), newDislike.trim()],
      });
    }
    setNewDislike('');
  };

  const handleRemoveLike = (index: number) => {
    if (activeTab === 'mine') {
      onUpdate({
        ...likesDislikes,
        myLikes: likesDislikes.myLikes.filter((_, i) => i !== index),
      });
    } else {
      onUpdate({
        ...likesDislikes,
        partnerLikes: likesDislikes.partnerLikes.filter((_, i) => i !== index),
      });
    }
  };

  const handleRemoveDislike = (index: number) => {
    if (activeTab === 'mine') {
      onUpdate({
        ...likesDislikes,
        myDislikes: likesDislikes.myDislikes.filter((_, i) => i !== index),
      });
    } else {
      onUpdate({
        ...likesDislikes,
        partnerDislikes: likesDislikes.partnerDislikes.filter((_, i) => i !== index),
      });
    }
  };

  const currentLikes = activeTab === 'mine' ? likesDislikes.myLikes || [] : likesDislikes.partnerLikes || [];
  const currentDislikes = activeTab === 'mine' ? likesDislikes.myDislikes || [] : likesDislikes.partnerDislikes || [];

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
          Cẩm Nang Thích / Ghét 📝
        </span>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-pink-200 space-y-4">
        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('mine')}
            className={`py-2 text-xs font-black rounded-xl transition ${
              activeTab === 'mine'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sở thích của bạn 💕
          </button>
          <button
            onClick={() => setActiveTab('partner')}
            className={`py-2 text-xs font-black rounded-xl transition ${
              activeTab === 'partner'
                ? 'bg-white text-purple-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sở thích của {partnerProfile?.name || 'Người yêu'} 🐻
          </button>
        </div>

        {/* Section 1: Thích */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Những thứ RẤT THÍCH 💕:</span>
            </span>
            <span className="text-[10px] text-slate-400">({currentLikes.length} món)</span>
          </div>

          <form onSubmit={handleAddLike} className="flex gap-2">
            <input
              type="text"
              placeholder="Thêm món đồ/sở thích mới..."
              value={newLike}
              onChange={(e) => setNewLike(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!newLike.trim()}
              className="px-3 py-1.5 bg-emerald-500 text-white font-bold text-xs rounded-xl disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {currentLikes.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold"
              >
                <span>{item}</span>
                <button
                  onClick={() => handleRemoveLike(idx)}
                  className="hover:text-red-500 text-emerald-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Section 2: Ghét */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-rose-700 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Những thứ RẤT GHÉT (Tránh bom nổ) ⚠️:</span>
            </span>
            <span className="text-[10px] text-slate-400">({currentDislikes.length} món)</span>
          </div>

          <form onSubmit={handleAddDislike} className="flex gap-2">
            <input
              type="text"
              placeholder="Thêm điều ghét cay ghét đắng..."
              value={newDislike}
              onChange={(e) => setNewDislike(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={!newDislike.trim()}
              className="px-3 py-1.5 bg-rose-500 text-white font-bold text-xs rounded-xl disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {currentDislikes.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold"
              >
                <span>{item}</span>
                <button
                  onClick={() => handleRemoveDislike(idx)}
                  className="hover:text-red-500 text-rose-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-slate-400 italic text-center pt-2">
          * Đọc kỹ sổ tay trước mỗi dịp kỷ niệm để tặng quà đúng ý người yêu nhé! 🎁
        </p>
      </div>
    </div>
  );
};
