import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Sparkles, Heart, Share2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { UserProfile } from '../types/game';
import { calculateLoveFortune, FortuneResult } from '../utils/fortune';

interface LoveFortuneProps {
  isOpen: boolean;
  onClose: () => void;
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
}

export const LoveFortune: React.FC<LoveFortuneProps> = ({
  isOpen,
  onClose,
  myProfile,
  partnerProfile,
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [calculating, setCalculating] = useState(true);
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);

  const p1 = myProfile;
  const p2 = partnerProfile || {
    id: 'placeholder',
    name: 'Người Yêu',
    gender: myProfile.gender === 'female' ? 'male' : 'female',
    avatar: '🐻',
    anniversaryDate: myProfile.anniversaryDate,
    myBirthday: myProfile.partnerBirthday || '2000-11-15',
    partnerBirthday: myProfile.myBirthday,
    updatedAt: Date.now(),
  };

  useEffect(() => {
    if (!isOpen) {
      setDisplayScore(0);
      setCalculating(true);
      return;
    }

    // Calculate deterministic fortune
    const b1 = p1.myBirthday || '2001-05-20';
    const b2 = p2.myBirthday || '2000-11-15';
    const res = calculateLoveFortune(b1, b2);
    setFortune(res);

    // Number counting up animation
    setCalculating(true);
    let current = 0;
    const target = res.score;
    const duration = 1600; // ms
    const stepTime = 25;
    const increment = Math.ceil(target / (duration / stepTime));

    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
        setCalculating(false);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24'],
        });
      }
      setDisplayScore(current);
    }, stepTime);

    return () => clearInterval(interval);
  }, [isOpen, p1.myBirthday, p2.myBirthday]);

  if (!isOpen || !fortune) return null;

  const handleCaptureScreenshot = async () => {
    if (!resultCardRef.current || capturing) return;
    setCapturing(true);
    try {
      const canvas = await html2canvas(resultCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fff1f2',
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `boi-tinh-yeu-${p1.name}-${p2.name}.png`;
      link.href = dataUrl;
      link.click();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Screenshot capture failed', err);
    } finally {
      setCapturing(false);
    }
  };

  const renderAvatar = (avatarStr: string) => {
    if (avatarStr?.startsWith('data:image') || avatarStr?.startsWith('http')) {
      return (
        <img
          src={avatarStr}
          alt="avatar"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '';
          }}
        />
      );
    }
    return <span>{avatarStr || '🐰'}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border-2 border-pink-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 px-5 py-3.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
            <h3 className="font-black text-lg">Bói Tình Yêu Định Mệnh 💘</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 active:scale-95 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Card to screenshot */}
          <div
            ref={resultCardRef}
            className="bg-gradient-to-b from-rose-50 via-pink-50 to-purple-50 p-5 rounded-3xl border-2 border-pink-200 shadow-inner space-y-4 text-center"
          >
            {/* Top Avatars & Beating Heart */}
            <div className="flex items-center justify-center gap-4">
              {/* Partner 1 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-pink-100 border-3 border-pink-400 flex items-center justify-center text-3xl shadow-md overflow-hidden">
                  {renderAvatar(p1.avatar)}
                </div>
                <span className="font-extrabold text-xs text-slate-800 mt-1 max-w-[80px] truncate">
                  {p1.name || 'Bạn'}
                </span>
              </div>

              {/* Beating Heart in center */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Heart className="w-10 h-10 fill-rose-500 text-rose-600 animate-pulse-subtle filter drop-shadow-md" />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                    {displayScore}%
                  </span>
                </div>
                <span className="text-[10px] font-black text-pink-600 uppercase tracking-wider mt-0.5">
                  Độ Hợp
                </span>
              </div>

              {/* Partner 2 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 border-3 border-purple-400 flex items-center justify-center text-3xl shadow-md overflow-hidden">
                  {renderAvatar(p2.avatar)}
                </div>
                <span className="font-extrabold text-xs text-slate-800 mt-1 max-w-[80px] truncate">
                  {p2.name || 'Người ấy'}
                </span>
              </div>
            </div>

            {/* Score Display */}
            <div className="bg-white/90 p-4 rounded-2xl border border-pink-200 shadow-xs">
              <div className="text-4xl font-black text-rose-500 tracking-tight font-mono">
                {displayScore}%
              </div>
              <h4 className="font-black text-slate-800 text-base mt-1">
                {fortune.title}
              </h4>
            </div>

            {/* Detailed Compatibility Cards */}
            <div className="text-left space-y-2.5 text-xs">
              {/* Cung hoàng đạo */}
              <div className="p-3 bg-white/80 rounded-xl border border-pink-100">
                <span className="font-black text-purple-700 block mb-0.5">
                  ✨ Cung Hoàng Đạo:
                </span>
                <p className="text-slate-700 leading-relaxed">{fortune.zodiacMatch}</p>
              </div>

              {/* Con giáp */}
              <div className="p-3 bg-white/80 rounded-xl border border-pink-100">
                <span className="font-black text-amber-700 block mb-0.5">
                  🐾 Con Giáp Bản Mệnh:
                </span>
                <p className="text-slate-700 leading-relaxed">{fortune.conGiapMatch}</p>
              </div>

              {/* Thần số học */}
              <div className="p-3 bg-white/80 rounded-xl border border-pink-100">
                <span className="font-black text-blue-700 block mb-0.5">
                  🔢 Thần Số Học:
                </span>
                <p className="text-slate-700 leading-relaxed">{fortune.numerologyMatch}</p>
              </div>

              {/* Lời phán vui nhộn */}
              <div className="p-3 bg-pink-100/70 rounded-xl border border-pink-300">
                <span className="font-black text-rose-700 block mb-0.5">
                  💌 Lời Phán Của Thần Tình Yêu:
                </span>
                <p className="text-rose-900 leading-relaxed font-medium">
                  {fortune.humorousVerdict}
                </p>
              </div>

              {/* Hoạt động & màu may mắn */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-white/80 rounded-xl border border-pink-100">
                  <span className="font-bold text-slate-500 block">Hoạt động gắn kết:</span>
                  <p className="font-extrabold text-slate-800 mt-0.5">{fortune.luckyActivity}</p>
                </div>
                <div className="p-2.5 bg-white/80 rounded-xl border border-pink-100">
                  <span className="font-bold text-slate-500 block">Màu sắc phong thủy:</span>
                  <p className="font-extrabold text-pink-600 mt-0.5">{fortune.luckyColor}</p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              * Kết quả được tính toán chuẩn xác từ ngày sinh của cả 2 bạn 💕
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-slate-50 border-t border-pink-100 flex gap-2">
          <button
            onClick={handleCaptureScreenshot}
            disabled={capturing || calculating}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-pink-300/50 flex items-center justify-center gap-1.5 active:scale-95 transition-transform disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-yellow-300" />
                <span>ĐÃ TẢI ẢNH KẾT QUẢ! 📸</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>{capturing ? 'Đang chụp ảnh...' : 'CHỤP MÀN HÌNH LƯU ẢNH 📸'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
