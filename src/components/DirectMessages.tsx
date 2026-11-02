import React, { useState, useEffect } from 'react';
import { Send, Image, Smile, Phone, Video, Info, Lock } from 'lucide-react';
import { UserProfile } from '../types';

interface DirectMessagesProps {
  profile: UserProfile;
}

interface Message {
  id: string;
  sender: 'me' | 'vault';
  text: string;
  time: string;
  mediaUrl?: string;
}

const DM_STORAGE_KEY = 'insta_fresh_dms';

export const DirectMessages: React.FC<DirectMessagesProps> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const data = localStorage.getItem(DM_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    localStorage.setItem(DM_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputVal('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100vh-60px)] md:h-[calc(100vh-40px)] flex border border-[#dbdbdb] dark:border-[#262626] sm:rounded-xl bg-white dark:bg-black overflow-hidden select-none">
      {/* Left Chat List */}
      <div className="w-full sm:w-[320px] md:w-[350px] border-r border-[#dbdbdb] dark:border-[#262626] flex flex-col shrink-0">
        <div className="h-14 px-4 border-b border-[#dbdbdb] dark:border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-sm">
            <span>{profile.username || 'My Account'}</span>
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold">Messages</span>
            <span className="text-xs text-neutral-400">Primary</span>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 cursor-pointer">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt="Me"
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold truncate">{profile.fullName} (You)</span>
                <span className="text-[10px] text-neutral-400">Private</span>
              </div>
              <p className="text-xs text-neutral-500 truncate">
                {messages.length > 0 ? messages[messages.length - 1].text : 'Start your private thought stream'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Conversation Window */}
      <div className="hidden sm:flex flex-col flex-1 bg-white dark:bg-black">
        {/* Chat Header */}
        <div className="h-14 px-4 border-b border-[#dbdbdb] dark:border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatarUrl}
              alt="Me"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <div className="text-xs font-bold leading-none">{profile.fullName} (You)</div>
              <span className="text-[10px] text-neutral-400">Self-Chat & Thought Dump</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
            <Phone className="w-4 h-4 cursor-pointer hover:opacity-70" />
            <Video className="w-4 h-4 cursor-pointer hover:opacity-70" />
            <Info className="w-4 h-4 cursor-pointer hover:opacity-70" />
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                <Lock className="w-7 h-7 text-emerald-500" />
              </div>
              <h4 className="text-sm font-semibold text-black dark:text-white">Your Private Inbox</h4>
              <p className="text-xs text-neutral-500 max-w-xs mt-1">
                Type notes to yourself, dump quick thoughts, or paste links in your private stream.
              </p>
            </div>
          ) : (
            messages.map(m => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-2xl text-xs ${
                    m.sender === 'me'
                      ? 'bg-[#0095f6] text-white rounded-br-xs'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-neutral-400 mt-0.5 px-1">{m.time}</span>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-[#dbdbdb] dark:border-[#262626] flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 rounded-full px-4 py-2">
            <Smile className="w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Message yourself / note to self..."
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="w-full text-xs bg-transparent outline-none text-black dark:text-white"
            />
          </div>
          {inputVal.trim() && (
            <button type="submit" className="text-xs font-bold text-[#0095f6] hover:text-sky-600 px-2">
              Send
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
