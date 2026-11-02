import React from 'react';
import { HomeIcon, SearchIcon, CreateIcon, ReelsIcon } from './InstagramIcons';
import { Sparkles, Clock } from 'lucide-react';
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-[#dbdbdb] dark:border-[#262626] h-12 flex items-center justify-around px-3 select-none">
      {/* 1. Home */}
      <button
        onClick={() => setActiveTab('feed')}
        className="p-1 text-black dark:text-white transition-transform active:scale-90"
        title="Home"
        aria-label="Home"
      >
        <HomeIcon filled={activeTab === 'feed'} />
      </button>

      {/* 2. Explore / Search */}
      <button
        onClick={() => setActiveTab('explore')}
        className="p-1 text-black dark:text-white transition-transform active:scale-90"
        title="Search & Calendar"
        aria-label="Search"
      >
        <SearchIcon filled={activeTab === 'explore'} />
      </button>

      {/* 3. Create (+) */}
      <button
        onClick={openCreateModal}
        className="p-1 text-black dark:text-white transition-transform active:scale-90"
        title="Create Memory or Story"
        aria-label="Create"
      >
        <CreateIcon />
      </button>

      {/* 4. Memories & Discovery */}
      <button
        onClick={() => setActiveTab('discovery')}
        className={`p-1 transition-transform active:scale-90 ${
          activeTab === 'discovery' ? 'text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
        }`}
        title="Memories"
        aria-label="Memories"
      >
        <Clock className={`w-6 h-6 ${activeTab === 'discovery' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
      </button>

      {/* 5. Profile */}
      <button
        onClick={() => setActiveTab('profile')}
        className="p-1 transition-transform active:scale-90"
        title="Profile"
        aria-label="Profile"
      >
        <div
          className={`w-[26px] h-[26px] rounded-full overflow-hidden p-[1.5px] ${
            activeTab === 'profile'
              ? 'border-2 border-black dark:border-white'
              : 'border border-transparent'
          }`}
        >
          <img
            src={profile.avatarUrl}
            alt={profile.username || 'Profile'}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </button>
    </nav>
  );
};
