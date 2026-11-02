import React from 'react';
import { Heart, Send, Moon, Sun, Lock, Smartphone, Monitor } from 'lucide-react';

interface InstagramHeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isMobileFrame: boolean;
  toggleMobileFrame: () => void;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onOpenNotes?: () => void;
}

export const InstagramHeader: React.FC<InstagramHeaderProps> = ({
  isDarkMode,
  toggleDarkMode,
  isMobileFrame,
  toggleMobileFrame,
  unreadCount = 2,
  onOpenNotifications,
  onOpenNotes
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-[#dbdbdb] dark:border-[#262626] transition-colors">
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <h1 className="font-script text-2xl font-bold tracking-tight text-[#262626] dark:text-white select-none">
            little days.
          </h1>
          <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f0f0f0] dark:bg-[#262626] text-[#737373] dark:text-[#a8a8a8] border border-black/5 dark:border-white/5">
            <Lock className="w-2.5 h-2.5 text-emerald-500" />
            <span>Only You</span>
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-4 text-[#262626] dark:text-white">
          {/* Frame View Toggle (Desktop / Mobile preview) */}
          <button
            onClick={toggleMobileFrame}
            className="hidden md:flex p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500"
            title={isMobileFrame ? 'Expand to Web View' : 'Switch to Mobile Frame'}
          >
            {isMobileFrame ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Toggle Dark / Light Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Heart / Activity */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Memory Flashbacks"
          >
            <Heart className="w-6 h-6 stroke-[1.8]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ed4956] animate-pulse" />
            )}
          </button>

          {/* Airplane / Reflection Inbox */}
          <button
            onClick={onOpenNotes}
            className="relative p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Private Journal Notes"
          >
            <Send className="w-6 h-6 stroke-[1.8] -rotate-12" />
          </button>
        </div>
      </div>
    </header>
  );
};
