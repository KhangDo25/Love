import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Heart, Sparkles } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types/game';
import { PICKUP_LINES } from '../utils/questions';

interface ChatDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  unreadCount: number;
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onSendMessage: (text: string, type: 'text' | 'reaction' | 'pickup') => void;
}

const QUICK_REACTIONS = ['😘', '❤️', '🤗', '🥺', '😡', '💍', '🎁', '💋'];

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onToggle,
  messages,
  unreadCount,
  myProfile,
  partnerProfile,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), 'text');
    setInputText('');
  };

  const handleQuickReaction = (emoji: string) => {
    onSendMessage(emoji, 'reaction');
  };

  const handleSendPickupLine = () => {
    const randomLine = PICKUP_LINES[Math.floor(Math.random() * PICKUP_LINES.length)];
    onSendMessage(randomLine, 'pickup');
  };

  const renderAvatar = (avatarStr?: string) => {
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
    <>
      {/* Floating Chat Bubble trigger */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-500 text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
          title="Mở khung chat 💬"
        >
          <MessageCircle className="w-7 h-7" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white text-white text-[10px] font-black flex items-center justify-center animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-2xl border-l border-pink-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 px-4 py-3 flex items-center justify-between text-white safe-pt">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-yellow-200" />
                <h3 className="font-black text-sm tracking-wide">
                  Tâm Sự 2 Đứa 💬
                </h3>
              </div>
              <button
                onClick={onToggle}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Reactions Bar */}
            <div className="px-3 py-2 bg-pink-50/80 border-b border-pink-100 flex items-center justify-between overflow-x-auto gap-1">
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleQuickReaction(emoji)}
                  className="w-8 h-8 rounded-full hover:bg-pink-200 flex items-center justify-center text-lg active:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gradient-to-b from-rose-50/30 to-pink-50/20 text-xs">
              {messages.map((m) => {
                const isMe = m.senderId === myProfile.id;
                const isSystem = m.senderId === 'system';

                if (isSystem) {
                  return (
                    <div key={m.id} className="text-center my-2">
                      <span className="px-3 py-1 bg-pink-100/80 text-pink-700 rounded-full text-[11px] font-semibold">
                        {m.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <div className="w-7 h-7 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-sm overflow-hidden shrink-0">
                        {renderAvatar(partnerProfile?.avatar || '🐻')}
                      </div>
                    )}

                    <div className="max-w-[78%]">
                      <div
                        className={`p-3 rounded-2xl shadow-xs font-medium leading-relaxed ${
                          isMe
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-xs'
                            : 'bg-white border border-pink-100 text-slate-800 rounded-bl-xs'
                        } ${m.type === 'pickup' ? 'border-2 border-yellow-300' : ''}`}
                      >
                        {m.type === 'pickup' && (
                          <div className="flex items-center gap-1 text-[10px] text-yellow-200 font-black mb-1">
                            <Sparkles className="w-3 h-3 text-yellow-300" />
                            <span>Thả thính nè! 💕</span>
                          </div>
                        )}
                        <p className={m.type === 'reaction' ? 'text-2xl text-center' : ''}>
                          {m.text}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] text-slate-400 block mt-0.5 px-1 ${
                          isMe ? 'text-right' : 'text-left'
                        }`}
                      >
                        {new Date(m.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {isMe && (
                      <div className="w-7 h-7 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-sm overflow-hidden shrink-0">
                        {renderAvatar(myProfile.avatar)}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Pickup Line Button */}
            <div className="px-3 pt-2 bg-white">
              <button
                onClick={handleSendPickupLine}
                className="w-full py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Thả thính ngẫu nhiên 💌</span>
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-pink-100 flex items-center gap-2 safe-pb"
            >
              <input
                type="text"
                placeholder="Nhắn gì cho người yêu..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={200}
                className="flex-1 px-3.5 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:border-pink-500 text-xs bg-pink-50/30"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center disabled:opacity-40 shadow-sm active:scale-95 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
