import React, { useState } from 'react';
import { ArrowLeft, Mail, Plus, X, Heart, Sparkles, Check } from 'lucide-react';
import { LoveLetter, UserProfile } from '../../types/game';

interface LoveLettersProps {
  letters: LoveLetter[];
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onSendLetter: (letter: LoveLetter) => void;
  onMarkRead: (id: string) => void;
  onBack: () => void;
}

export const LoveLetters: React.FC<LoveLettersProps> = ({
  letters,
  myProfile,
  partnerProfile,
  onSendLetter,
  onMarkRead,
  onBack,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [envelopeOpening, setEnvelopeOpening] = useState(false);

  const handleOpenLetter = (letter: LoveLetter) => {
    setSelectedLetter(letter);
    setEnvelopeOpening(true);
    setTimeout(() => setEnvelopeOpening(false), 500);
    if (!letter.read) {
      onMarkRead(letter.id);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newLetter: LoveLetter = {
      id: `letter_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: myProfile.id,
      senderName: myProfile.name || 'Người yêu bạn',
      title: title.trim(),
      content: content.trim(),
      timestamp: Date.now(),
      read: false,
    };

    onSendLetter(newLetter);
    setTitle('');
    setContent('');
    setIsComposing(false);
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
          onClick={() => setIsComposing(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black shadow-md active:scale-95 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Viết thư mới</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-pink-200 space-y-4">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 text-pink-500 shadow-inner">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">Hộp Thư Tình 💌</h3>
          <p className="text-[11px] text-slate-400">
            Những lời yêu thương chân thành gửi gắm riêng cho nhau
          </p>
        </div>

        {/* Letters List */}
        <div className="space-y-3 max-h-[55vh] overflow-y-auto">
          {letters.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-medium">
              Chưa có bức thư nào. Hãy viết lá thư đầu tiên cho người yêu nhé! 💕
            </div>
          ) : (
            letters.map((letter) => {
              const isMine = letter.senderId === myProfile.id;
              return (
                <div
                  key={letter.id}
                  onClick={() => handleOpenLetter(letter)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-between ${
                    !letter.read && !isMine
                      ? 'bg-rose-50 border-rose-400 shadow-sm'
                      : 'bg-white border-pink-100 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-inner ${
                        !letter.read && !isMine ? 'bg-rose-400 text-white' : 'bg-pink-100 text-pink-500'
                      }`}
                    >
                      💌
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-800">
                          {letter.title}
                        </span>
                        {!letter.read && !isMine && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Gửi bởi: {isMine ? 'Bạn' : letter.senderName} •{' '}
                        {new Date(letter.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-pink-500">Mở ✉️</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal View Letter with Envelope Opening Effect */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-amber-50/95 rounded-3xl w-full max-w-sm p-6 shadow-2xl border-4 border-amber-200 relative overflow-hidden animate-in zoom-in-90">
            {/* Wax seal watermark */}
            <div className="absolute top-4 right-4 text-rose-500/20 pointer-events-none">
              <Heart className="w-24 h-24 fill-current" />
            </div>

            <button
              onClick={() => setSelectedLetter(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-amber-200/60 flex items-center justify-center text-amber-800 hover:bg-amber-300 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4 text-left">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-700 font-extrabold">
                  Thư Tình Yêu
                </span>
                <h4 className="font-extrabold text-amber-950 text-lg mt-0.5">
                  {selectedLetter.title}
                </h4>
                <p className="text-[11px] text-amber-700">
                  Từ: <span className="font-bold">{selectedLetter.senderName}</span> •{' '}
                  {new Date(selectedLetter.timestamp).toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-2xl border border-amber-200/80 text-amber-950 text-xs font-medium leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-serif">
                {selectedLetter.content}
              </div>

              <div className="text-right">
                <span className="text-xs text-amber-800 font-black italic">
                  Thương gửi người tôi yêu nhất 💕
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Compose Letter */}
      {isComposing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border-2 border-pink-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-pink-500" />
                <span>Viết Thư Gửi Người Yêu 💌</span>
              </h4>
              <button
                onClick={() => setIsComposing(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tiêu đề bức thư
                </label>
                <input
                  type="text"
                  placeholder="VD: Gửi em bé của anh, Vài dòng nhắn nhủ..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 text-xs font-semibold focus:outline-none focus:border-pink-500 bg-pink-50/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nội dung tâm sự
                </label>
                <textarea
                  rows={5}
                  placeholder="Viết tất cả những điều bạn muốn nói từ tận đáy lòng..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-pink-200 text-xs font-medium focus:outline-none focus:border-pink-500 bg-pink-50/20 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={!title.trim() || !content.trim()}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-xs rounded-2xl shadow-md active:scale-95 transition disabled:opacity-40"
              >
                Gửi Thư Vào Hộp 💌
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
