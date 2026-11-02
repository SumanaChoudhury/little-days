import React from 'react';
import { InstagramLogo, NotificationsHeartIcon, MessengerIcon } from './InstagramIcons';
import { Camera, Moon, Sun, Settings } from 'lucide-react';
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
    <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-[#dbdbdb] dark:border-[#262626] h-12 px-3 flex items-center justify-between select-none">
      {/* Left: Camera Click Pic Icon (Instagram Mobile Camera) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCamera}
          className="p-1.5 text-black dark:text-white hover:text-pink-500"
          title="Click Pics"
        >
          <Camera className="w-6 h-6 stroke-[2]" />
        </button>

        {/* MyMemories Wordmark Logo */}
        <div onClick={() => setActiveTab('feed')} className="cursor-pointer text-black dark:text-white flex items-center">
          <InstagramLogo width={118} height={28} />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3 text-black dark:text-white">
        {/* Settings */}
        <button onClick={onOpenSettings} className="p-1 text-neutral-600 dark:text-neutral-300">
          <Settings className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button onClick={onOpenNotifications} className="p-1 relative">
          <NotificationsHeartIcon className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ed4956]" />
        </button>

        {/* Direct Messages */}
        <button onClick={onOpenDirect} className="p-1">
          <MessengerIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};
