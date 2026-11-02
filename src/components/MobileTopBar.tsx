import React from 'react';
import { InstagramLogo, NotificationsHeartIcon, MessengerIcon } from './InstagramIcons';
import { Settings, Moon, Sun } from 'lucide-react';
import { TabType } from './Sidebar';

interface MobileTopBarProps {
  onOpenNotifications: () => void;
  onOpenDirect: () => void;
  onOpenCamera: () => void;
  onOpenSettings: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setActiveTab: (t: TabType) => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  onOpenNotifications,
  onOpenDirect,
  onOpenCamera,
  onOpenSettings,
  isDarkMode,
  toggleDarkMode,
  setActiveTab
}) => {
  return (
    <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-[#dbdbdb] dark:border-[#262626] h-12 px-3.5 flex items-center justify-between select-none">
      {/* Brand Wordmark (Clean, unclipped) */}
      <div
        onClick={() => setActiveTab('feed')}
        className="cursor-pointer text-black dark:text-white flex items-center shrink-0"
        title="MyMemories"
      >
        <InstagramLogo width={116} height={28} />
      </div>

      {/* Right Icons: Heart, Messages, Settings */}
      <div className="flex items-center gap-3.5 text-black dark:text-white">
        {/* Notifications Heart */}
        <button
          onClick={onOpenNotifications}
          className="p-1 relative hover:opacity-70 transition-opacity"
          aria-label="Notifications"
        >
          <NotificationsHeartIcon className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ed4956]" />
        </button>

        {/* Direct Messages */}
        <button
          onClick={onOpenDirect}
          className="p-1 hover:opacity-70 transition-opacity"
          aria-label="Direct Messages"
        >
          <MessengerIcon className="w-6 h-6" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-1 text-neutral-700 dark:text-neutral-300 hover:opacity-70 transition-opacity"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>
    </header>
  );
};
