import React from 'react';
import { Home, Search, PlusSquare, Archive, User } from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab = 'feed' | 'explore' | 'create' | 'archives' | 'profile';

interface BottomNavBarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  profile: UserProfile;
  archivedCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  archivedCount = 0
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-[#dbdbdb] dark:border-[#262626] transition-colors">
      <div className="max-w-xl mx-auto h-13 flex items-center justify-around px-2 py-2">
        {/* 1. Home / Feed */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center p-2 text-[#262626] dark:text-[#f5f5f5] transition-transform active:scale-90 ${
            activeTab === 'feed' ? 'font-bold' : 'opacity-70'
          }`}
          title="Home Feed"
        >
          <Home className={`w-6 h-6 stroke-[1.8] ${activeTab === 'feed' ? 'fill-current' : ''}`} />
          <span className="text-[9px] mt-0.5 sm:hidden">Feed</span>
        </button>

        {/* 2. Explore / Calendar */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center p-2 text-[#262626] dark:text-[#f5f5f5] transition-transform active:scale-90 ${
            activeTab === 'explore' ? 'font-bold' : 'opacity-70'
          }`}
          title="Explore & Calendar"
        >
          <Search className={`w-6 h-6 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[9px] mt-0.5 sm:hidden">Explore</span>
        </button>

        {/* 3. Create / Upload */}
        <button
          onClick={() => setActiveTab('create')}
          className="flex flex-col items-center justify-center p-1.5 text-[#262626] dark:text-[#f5f5f5] transition-transform active:scale-90 group"
          title="Add Memory"
        >
          <div className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <PlusSquare className="w-7 h-7 stroke-[1.8] group-hover:scale-105 transition-transform" />
          </div>
          <span className="text-[9px] sm:hidden">Add</span>
        </button>

        {/* 4. Smart 90-Day Archive Vault */}
        <button
          onClick={() => setActiveTab('archives')}
          className={`relative flex flex-col items-center justify-center p-2 text-[#262626] dark:text-[#f5f5f5] transition-transform active:scale-90 ${
            activeTab === 'archives' ? 'font-bold' : 'opacity-70'
          }`}
          title="Smart 90-Day Archive"
        >
          <Archive className={`w-6 h-6 stroke-[1.8] ${activeTab === 'archives' ? 'fill-current text-sky-500' : ''}`} />
          {archivedCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500" />
          )}
          <span className="text-[9px] mt-0.5 sm:hidden">Vault</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center p-2 transition-transform active:scale-90 ${
            activeTab === 'profile' ? 'opacity-100' : 'opacity-70'
          }`}
          title="Profile Grid"
        >
          <div
            className={`w-6 h-6 rounded-full overflow-hidden p-[1px] ${
              activeTab === 'profile' ? 'border-2 border-black dark:border-white' : ''
            }`}
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-full h-full text-neutral-500" />
            )}
          </div>
          <span className="text-[9px] mt-0.5 sm:hidden">Profile</span>
        </button>
      </div>
    </nav>
  );
};
