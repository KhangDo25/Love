import React, { useState } from 'react';
import { UserProfile } from '../types/game';
import { X, Camera, Link as LinkIcon, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

const EMOJI_AVATARS = ['🐰', '🐻', '🐱', '🦊', '🐶', '🐼', '🐯', '🐥', '🦄', '💖', '🍓', '🥑', '🌸', '👑', '🧸', '🦁'];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [name, setName] = useState(profile.name || '');
  const [gender, setGender] = useState<'male' | 'female'>(profile.gender || 'female');
  const [avatar, setAvatar] = useState(profile.avatar || '🐰');
  const [anniversaryDate, setAnniversaryDate] = useState(profile.anniversaryDate || '2024-01-01');
  const [myBirthday, setMyBirthday] = useState(profile.myBirthday || '2001-05-20');
  const [partnerBirthday, setPartnerBirthday] = useState(profile.partnerBirthday || '2000-11-15');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlBox, setShowUrlBox] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Handle image upload and resize to ~200px Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
          setAvatar(compressedBase64);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setAvatar(urlInput.trim());
    setShowUrlBox(false);
    setUrlInput('');
  };

  const handleSave = () => {
    if (!name.trim()) {
      setErrorMsg('Tên không được để trống nhé bạn ơi!');
      return;
    }
    setErrorMsg('');
    const updated: UserProfile = {
      ...profile,
      name: name.trim(),
      gender,
      avatar,
      anniversaryDate,
      myBirthday,
      partnerBirthday,
      updatedAt: Date.now(),
    };
    onSave(updated);
    onClose();
  };

  const isImageAvatar = avatar.startsWith('data:image') || avatar.startsWith('http');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border-2 border-pink-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-200" />
            <h3 className="font-extrabold text-lg tracking-wide">Hồ Sơ Của Bạn 💕</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 active:scale-95 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl font-bold text-center border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Avatar Preview & Selection */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-pink-100 border-4 border-pink-300 shadow-md flex items-center justify-center overflow-hidden text-5xl">
                {isImageAvatar ? (
                  <img
                    src={avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to 😀 on image load error
                      (e.target as HTMLImageElement).src = '';
                      setAvatar('😀');
                    }}
                  />
                ) : (
                  <span>{avatar}</span>
                )}
              </div>
            </div>
            <p className="text-xs text-pink-500 font-bold mt-2">Chọn Emoji hoặc Tải ảnh đại diện</p>

            {/* Quick emoji palette */}
            <div className="grid grid-cols-8 gap-1.5 mt-3 p-2 bg-pink-50/70 rounded-2xl border border-pink-100">
              {EMOJI_AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-transform hover:scale-125 ${
                    avatar === emoji ? 'bg-pink-400 text-white shadow-sm scale-110' : 'hover:bg-pink-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Upload or URL buttons */}
            <div className="flex items-center gap-3 mt-3">
              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-full cursor-pointer transition active:scale-95">
                <Camera className="w-3.5 h-3.5" />
                <span>Tải ảnh từ máy</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowUrlBox(!showUrlBox)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-xs rounded-full transition active:scale-95"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Dán link ảnh</span>
              </button>
            </div>

            {showUrlBox && (
              <div className="flex gap-2 w-full mt-2">
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-pink-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-1.5 bg-pink-500 text-white font-bold text-xs rounded-xl"
                >
                  OK
                </button>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tên / Biệt danh của bạn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Bé Mèo, Gấu Béo, Anh Yêu..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={25}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-rose-50/30 text-slate-800 font-semibold"
              />
            </div>

            {/* Giới tính */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Giới tính</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition ${
                    gender === 'male'
                      ? 'bg-blue-100 border-blue-400 text-blue-700 shadow-xs'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span>👦</span> Nam
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition ${
                    gender === 'female'
                      ? 'bg-pink-100 border-pink-400 text-pink-700 shadow-xs'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span>👧</span> Nữ
                </button>
              </div>
            </div>

            {/* Ngày quen nhau */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Ngày quen nhau / Kỷ niệm 💑
              </label>
              <input
                type="date"
                value={anniversaryDate}
                onChange={(e) => setAnniversaryDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-rose-50/30 text-slate-800 font-semibold"
              />
            </div>

            {/* Ngày sinh mình & người yêu */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-xs">
                  🎂 Sinh nhật bạn
                </label>
                <input
                  type="date"
                  value={myBirthday}
                  onChange={(e) => setMyBirthday(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none text-xs font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-xs">
                  🎁 Sinh nhật người yêu
                </label>
                <input
                  type="date"
                  value={partnerBirthday}
                  onChange={(e) => setPartnerBirthday(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none text-xs font-semibold bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-pink-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition active:scale-95"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold shadow-md hover:from-pink-600 hover:to-rose-600 transition active:scale-95"
          >
            Lưu & Đồng bộ 💕
          </button>
        </div>
      </div>
    </div>
  );
};
