import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Plus, Calendar, Tag, X } from 'lucide-react';
import { DiaryEntry, UserProfile } from '../../types/game';

interface TimelineDiaryProps {
  diaries: DiaryEntry[];
  myProfile: UserProfile;
  onAddDiary: (entry: DiaryEntry) => void;
  onBack: () => void;
}

const TAG_OPTIONS = ['Kỷ niệm 💕', 'Hẹn hò ☕', 'Du lịch ✈️', 'Làm lành 🤝', 'Chuyện tếu 🤪'];

export const TimelineDiary: React.FC<TimelineDiaryProps> = ({
  diaries,
  myProfile,
  onAddDiary,
  onBack,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tag, setTag] = useState(TAG_OPTIONS[0]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newEntry: DiaryEntry = {
      id: `diary_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      content: content.trim(),
      date,
      tag,
      authorName: myProfile.name || 'Người yêu',
      timestamp: Date.now(),
    };

    onAddDiary(newEntry);
    setTitle('');
    setContent('');
    setIsAdding(false);
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
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black shadow-md active:scale-95 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm trang mới</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-pink-200 space-y-4">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 text-pink-500 shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">Nhật Ký Đôi Dòng Thời Gian 📖</h3>
          <p className="text-[11px] text-slate-400">
            Lưu giữ từng kỷ niệm đáng yêu của hai đứa theo từng ngày
          </p>
        </div>

        {/* Timeline Entries */}
        <div className="space-y-4 max-h-[58vh] overflow-y-auto pr-1">
          {diaries.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-medium">
              Chưa có trang nhật ký nào. Hãy viết lại kỷ niệm đầu tiên nhé! 💕
            </div>
          ) : (
            diaries.map((entry) => (
              <div
                key={entry.id}
                className="relative pl-5 border-l-2 border-pink-300 space-y-1.5 text-left"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-pink-500 border-2 border-white shadow-xs" />

                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-400">
                    {new Date(entry.date).toLocaleDateString('vi-VN')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-extrabold text-[10px]">
                    {entry.tag}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-200 space-y-1.5">
                  <h4 className="font-black text-slate-800 text-xs">{entry.title}</h4>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                    {entry.content}
                  </p>
                  <div className="text-[10px] text-pink-600 font-bold text-right pt-1">
                    Ghi bởi: {entry.authorName}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Add Diary Entry */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border-2 border-pink-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-pink-500" />
                <span>Viết Nhật Ký Mới 📖</span>
              </h4>
              <button
                onClick={() => setIsAdding(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tiêu đề kỷ niệm:
                </label>
                <input
                  type="text"
                  placeholder="VD: Buổi tối đi ăn kem ở bờ hồ..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={60}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 text-xs font-semibold focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Ngày xảy ra:
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-pink-200 text-xs font-semibold focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Chủ đề:
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-pink-200 text-xs font-semibold focus:outline-none focus:border-pink-500 bg-white"
                  >
                    {TAG_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nội dung chi tiết:
                </label>
                <textarea
                  rows={4}
                  placeholder="Ghi lại cảm xúc, những câu nói đáng nhớ..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:border-pink-500 leading-relaxed font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={!title.trim() || !content.trim()}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs rounded-2xl shadow-md active:scale-95 transition disabled:opacity-40"
              >
                Lưu Vào Sổ Kỷ Niệm 📖
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
