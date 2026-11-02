import React from 'react';
import {
  InstagramLogo,
  HomeIcon,
  SearchIcon,
  ExploreIcon,
  ReelsIcon,
  MessengerIcon,
  NotificationsHeartIcon,
  CreateIcon
} from './InstagramIcons';
import { Archive, Camera, Settings, Moon, Sun, BookOpen, Sparkles, Palette } from 'lucide-react';
import { UserProfile } from '../types';

export type TabType =
  | 'feed'
  | 'search'
  | 'explore'
  | 'diary'
  | 'discovery'
  | 'moodboards'
  | 'reels'
  | 'direct'
  | 'notifications'
  | 'archive'
  | 'profile';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  openCreateModal: () => void;
  openCameraModal: () => void;
  openSettingsModal: () => void;
  profile: UserProfile;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openCreateModal,
  openCameraModal,
  openSettingsModal,
  profile,
  isDarkMode,
  toggleDarkMode
}) => {
  return (
    <aside className="hidden md:flex flex-col justify-between fixed left-0 top-0 bottom-0 w-[72px] xl:w-[244px] border-r border-[#dbdbdb] dark:border-[#262626] bg-white dark:bg-black px-3 py-5 z-30 transition-all select-none overflow-y-auto no-scrollbar">
      {/* Top Section */}
      <div className="flex flex-col gap-4">
        {/* MyMemories Logo */}
        <div
          onClick={() => setActiveTab('feed')}
          className="cursor-pointer px-2 py-2 flex items-center h-10"
          title="MyMemories"
        >
          <div className="hidden xl:block text-black dark:text-white">
            <InstagramLogo width={125} height={32} />
          </div>
          <div className="xl:hidden text-black dark:text-white flex items-center justify-center w-full">
            <svg aria-label="MyMemories" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="17.5" cy="6.5" r="1" />
            </svg>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-0.5 text-[#000000] dark:text-[#f5f5f5]">
          {/* Home */}
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left ${
              activeTab === 'feed' ? 'font-bold' : 'font-normal'
            }`}
          >
            <HomeIcon filled={activeTab === 'feed'} />
            <span className="hidden xl:inline text-sm">Home</span>
          </button>

          {/* Search */}
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left ${
              activeTab === 'search' ? 'font-bold' : 'font-normal'
            }`}
          >
            <SearchIcon filled={activeTab === 'search'} />
            <span className="hidden xl:inline text-sm">Search</span>
          </button>

          {/* Explore */}
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left ${
              activeTab === 'explore' ? 'font-bold' : 'font-normal'
            }`}
          >
            <ExploreIcon filled={activeTab === 'explore'} />
            <span className="hidden xl:inline text-sm">Explore</span>
          </button>

          {/* Personal Diary (PRD 3.3) */}
          <button
            onClick={() => setActiveTab('diary')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left ${
              activeTab === 'diary' ? 'font-bold text-indigo-500' : 'font-normal'
            }`}
          >
            <BookOpen className="w-6 h-6 stroke-[1.8]" />
            <span className="hidden xl:inline text-sm">Diary</span>
          </button>

          {/* Memory Discovery (PRD 3.8) */}
          <button
            onClick={() => setActiveTab('discovery')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left ${
              activeTab === 'discovery' ? 'font-bold text-amber-500' : 'font-normal'
            }`}
          >
            <Sparkles className="w-6 h-6 stroke-[1.8]" />
            <span className="hidden xl:inline text-sm">Discovery</span>
          </button>

          {/* Moodboards & Scrapbook (PRD 3.6) */}
          <button
            onClick={() => setActiveTab('moodboards')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left ${
              activeTab === 'moodboards' ? 'font-bold text-rose-500' : 'font-normal'
            }`}
          >
            <Palette className="w-6 h-6 stroke-[1.8]" />
            <span className="hidden xl:inline text-sm">Moodboards</span>
          </button>

          {/* Reels */}
          <button
            onClick={() => setActiveTab('reels')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left ${
              activeTab === 'reels' ? 'font-bold' : 'font-normal'
            }`}
          >
            <ReelsIcon filled={activeTab === 'reels'} />
            <span className="hidden xl:inline text-sm">Reels</span>
          </button>

          {/* Messages */}
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left relative ${
              activeTab === 'direct' ? 'font-bold' : 'font-normal'
            }`}
          >
            <MessengerIcon filled={activeTab === 'direct'} />
            <span className="hidden xl:inline text-sm">Messages</span>
          </button>

          {/* Click Pics (Camera) */}
          <button
            onClick={openCameraModal}
            className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left text-pink-500 font-semibold"
            title="Click Pics"
          >
            <Camera className="w-6 h-6 stroke-[2]" />
            <span className="hidden xl:inline text-sm">Click Pics</span>
          </button>

          {/* Create (+) */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left"
          >
            <CreateIcon />
            <span className="hidden xl:inline text-sm">Create</span>
          </button>

          {/* Archive Vault (PRD 3.9) */}
          <button
            onClick={() => setActiveTab('archive')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left ${
              activeTab === 'archive' ? 'font-bold text-sky-500' : 'font-normal'
            }`}
            title="90-Day Archive Vault"
          >
            <Archive className="w-6 h-6 stroke-[1.8]" />
            <span className="hidden xl:inline text-sm">Archive</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left ${
              activeTab === 'profile' ? 'font-bold' : 'font-normal'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full overflow-hidden p-[1px] ${
                activeTab === 'profile' ? 'border-2 border-black dark:border-white' : ''
              }`}
            >
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="hidden xl:inline text-sm">Profile</span>
          </button>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-1 pt-4 border-t border-neutral-100 dark:border-neutral-900">
        <button
          onClick={openSettingsModal}
          className="flex items-center gap-4 px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left text-neutral-800 dark:text-neutral-200"
          title="Account Settings"
        >
          <Settings className="w-5 h-5 text-neutral-500" />
          <span className="hidden xl:inline text-sm font-medium">Settings & Account</span>
        </button>

        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-4 px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors w-full text-left text-neutral-800 dark:text-neutral-200"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          <span className="hidden xl:inline text-sm font-medium">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>
    </aside>
  );
};
