import React from 'react';
import { HomeIcon, SearchIcon, CreateIcon, ReelsIcon } from './InstagramIcons';
import { BookOpen, Sparkles } from 'lucide-react';
import { TabType } from './Sidebar';
import { UserProfile } from '../types';

interface MobileBottomBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  openCreateModal: () => void;
  profile: UserProfile;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  setActiveTab,
  openCreateModal,
  profile
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-[#dbdbdb] dark:border-[#262626] h-12 flex items-center justify-around px-2 select-none">
      {/* 1. Home */}
      <button
        onClick={() => setActiveTab('feed')}
        className="p-1.5 text-black dark:text-white"
        title="Home"
      >
        <HomeIcon filled={activeTab === 'feed'} />
      </button>

      {/* 2. Explore */}
      <button
        onClick={() => setActiveTab('explore')}
        className="p-1.5 text-black dark:text-white"
        title="Explore"
      >
        <SearchIcon filled={activeTab === 'explore'} />
      </button>

      {/* 3. Diary */}
      <button
        onClick={() => setActiveTab('diary')}
        className={`p-1.5 ${activeTab === 'diary' ? 'text-indigo-500' : 'text-neutral-500'}`}
        title="Diary"
      >
        <BookOpen className="w-6 h-6 stroke-[1.8]" />
      </button>

      {/* 4. Create (+) */}
      <button
        onClick={openCreateModal}
        className="p-1.5 text-black dark:text-white"
        title="Create"
      >
        <CreateIcon />
      </button>

      {/* 5. Discovery */}
      <button
        onClick={() => setActiveTab('discovery')}
        className={`p-1.5 ${activeTab === 'discovery' ? 'text-amber-500' : 'text-neutral-500'}`}
        title="Discovery"
      >
        <Sparkles className="w-6 h-6 stroke-[1.8]" />
      </button>

      {/* 6. Profile */}
      <button
        onClick={() => setActiveTab('profile')}
        className="p-1.5"
        title="Profile"
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
      </button>
    </nav>
  );
};
