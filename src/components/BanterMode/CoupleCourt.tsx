import React, { useState } from 'react';
import { ArrowLeft, Scale, Plus, Gavel, Check, AlertCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CoupleCourtCase, UserProfile } from '../../types/game';
import { SAMPLE_COURT_CASES, RPS_PENALTIES } from '../../utils/questions';

interface CoupleCourtProps {
  cases: CoupleCourtCase[];
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onAddCase: (newCase: CoupleCourtCase) => void;
  onVoteCase: (caseId: string, verdict: 'guilty' | 'innocent', penalty: string) => void;
  onBack: () => void;
}

export const CoupleCourt: React.FC<CoupleCourtProps> = ({
  cases,
  myProfile,
  partnerProfile,
  onAddCase,
  onVoteCase,
  onBack,
}) => {
  const [isFiling, setIsFiling] = useState(false);
  const [title, setTitle] = useState('');
  const [situation, setSituation] = useState('');

  const handleUseSample = (s: { title: string; situation: string }) => {
    setTitle(s.title);
    setSituation(s.situation);
  };

  const handleFileCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !situation.trim()) return;

    const newCase: CoupleCourtCase = {
      id: `case_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      plaintiff: myProfile.name || 'Nguyên cáo',
      defendant: partnerProfile?.name || 'Bị cáo',
      title: title.trim(),
      situation: situation.trim(),
      verdict: 'pending',
      penalty: null,
      votedBy: null,
      timestamp: Date.now(),
    };

    onAddCase(newCase);
    setTitle('');
    setSituation('');
    setIsFiling(false);
  };

  const handleVote = (caseId: string, verdict: 'guilty' | 'innocent') => {
    const penalty =
      verdict === 'guilty'
        ? RPS_PENALTIES[Math.floor(Math.random() * RPS_PENALTIES.length)]
        : 'Được tuyên trắng án và thưởng 1 cái ôm thật chặt!';

    onVoteCase(caseId, verdict, penalty);
    confetti({ particleCount: 40, spread: 60 });
  };

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

        <button
          onClick={() => setIsFiling(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-black shadow-md active:scale-95 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Khởi kiện vụ mới</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-rose-200 space-y-4">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 shadow-inner">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">Tòa Án Tình Yêu ⚖️</h3>
          <p className="text-[11px] text-slate-400">
            Ai đúng ai sai? Phân xử công tâm bằng búa quan tòa!
          </p>
        </div>

        {/* Cases List */}
        <div className="space-y-3 max-h-[55vh] overflow-y-auto">
          {cases.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-medium space-y-2">
              <p>Chưa có vụ kiện nào! Hiện hai đứa đang rất hòa thuận 💕</p>
              <button
                onClick={() => setIsFiling(true)}
                className="text-xs text-rose-500 font-bold underline"
              >
                Bấm vào đây để kiện người yêu một vụ án vui nhộn!
              </button>
            </div>
          ) : (
            cases.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/70 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-black text-xs text-slate-800 leading-snug">
                    {c.title}
                  </h4>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                      c.verdict === 'guilty'
                        ? 'bg-red-100 text-red-700'
                        : c.verdict === 'innocent'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {c.verdict === 'guilty'
                      ? 'CÓ TỘI 🔨'
                      : c.verdict === 'innocent'
                      ? 'VÔ TỘI 😇'
                      : 'Đang xử án ⏳'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed font-medium">
                  {c.situation}
                </p>

                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Nguyên cáo: <b>{c.plaintiff}</b></span>
                  <span>Bị cáo: <b>{c.defendant}</b></span>
                </div>

                {/* Verdict result if already voted */}
                {c.verdict !== 'pending' && c.penalty && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-bold ${
                      c.verdict === 'guilty'
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-black">
                      PHÁN QUYẾT TÒA ÁN:
                    </span>
                    {c.penalty}
                  </div>
                )}

                {/* Voting buttons if pending */}
                {c.verdict === 'pending' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleVote(c.id, 'guilty')}
                      className="py-2 px-3 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Gavel className="w-3.5 h-3.5" />
                      <span>CÓ TỘI 🔨</span>
                    </button>
                    <button
                      onClick={() => handleVote(c.id, 'innocent')}
                      className="py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>VÔ TỘI 😇</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal File New Case */}
      {isFiling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border-2 border-rose-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                <Gavel className="w-4 h-4 text-rose-500" />
                <span>Nộp Đơn Khởi Kiện ⚖️</span>
              </h4>
              <button
                onClick={() => setIsFiling(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Sample Presets */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Gợi ý tình huống mẫu:
              </label>
              <div className="space-y-1.5">
                {SAMPLE_COURT_CASES.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUseSample(s)}
                    className="w-full text-left p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[11px] font-semibold text-rose-900 border border-rose-200 truncate block transition"
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleFileCase} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tên vụ kiện:
                </label>
                <input
                  type="text"
                  placeholder="VD: Vụ án ngủ quên không thèm chúc ngủ ngon..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={60}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Diễn biến vụ việc:
                </label>
                <textarea
                  rows={3}
                  placeholder="Kể chi tiết hành vi đáng trách của người yêu..."
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500 leading-relaxed font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={!title.trim() || !situation.trim()}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-xs rounded-2xl shadow-md active:scale-95 transition disabled:opacity-40"
              >
                Gõ Búa Khai Mạc Phiên Tòa 🔨
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
