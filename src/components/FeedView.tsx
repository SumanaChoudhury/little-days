import React from 'react';
import { StoriesBar } from './StoriesBar';
import { PostCard } from './PostCard';
import { MemoryPost, Story, UserProfile, ArchiveBundle } from '../types';
import { Archive, Plus, Camera, Sparkles } from 'lucide-react';

interface FeedViewProps {
  memories: MemoryPost[];
  stories: Story[];
  profile: UserProfile;
  archiveBundles: ArchiveBundle[];
  onSelectStory: (story: Story, index: number) => void;
  onAddStory: () => void;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onDeletePost: (id: string) => void;
  onRestoreMemory: (id: string) => void;
  onAddNote: (postId: string, text: string) => void;
  onOpenArchiveVault: () => void;
  onOpenCamera?: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  memories,
  stories,
  profile,
  archiveBundles,
  onSelectStory,
  onAddStory,
  onToggleLike,
  onToggleBookmark,
  onDeletePost,
  onRestoreMemory,
  onAddNote,
  onOpenArchiveVault,
  onOpenCamera
}) => {
  const hotMemoriesCount = memories.filter(m => !m.isArchived).length;
  const coldMemoriesCount = memories.filter(m => m.isArchived).length;

  return (
    <div className="w-full max-w-[1000px] mx-auto flex justify-center gap-12 px-0 sm:px-4 py-2 sm:py-6 select-none">
      {/* Center Feed Column */}
      <div className="w-full max-w-[470px] shrink-0">
        {/* Instagram Stories Carousel Bar */}
        <div className="mb-4 sm:rounded-lg overflow-hidden border-b sm:border border-[#dbdbdb] dark:border-[#262626]">
          <StoriesBar
            stories={stories}
            profile={profile}
            onSelectStory={onSelectStory}
            onAddStory={onAddStory}
          />
        </div>

        {/* Feed Posts */}
        {memories.length === 0 ? (
          <div className="py-16 text-center px-4 bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#262626] sm:rounded-xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 p-[2px] mx-auto flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-black rounded-full flex items-center justify-center">
                <Camera className="w-7 h-7 text-neutral-600 dark:text-neutral-300" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-black dark:text-white">
                Welcome to Your Private Instagram
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto leading-normal">
                You haven't added any memories yet. Click pictures or upload photos and videos to start building your private archive!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onAddStory}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0095f6] hover:bg-sky-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Photos / Videos</span>
              </button>

              {onOpenCamera && (
                <button
                  onClick={onOpenCamera}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-black dark:text-white text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4 text-pink-500" />
                  <span>Click with Camera</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          memories.map(post => (
            <PostCard
              key={post.id}
              post={post}
              profile={profile}
              onToggleLike={onToggleLike}
              onToggleBookmark={onToggleBookmark}
              onDeletePost={onDeletePost}
              onRestoreMemory={onRestoreMemory}
              onAddNote={onAddNote}
            />
          ))
        )}
      </div>

      {/* Right Desktop Suggestions / Vault Panel */}
      <div className="hidden lg:block w-[320px] shrink-0 pt-4 space-y-5">
        {/* User Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full p-[1px] bg-gradient-to-tr from-[#f09433] to-[#bc1888]">
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="w-full h-full rounded-full object-cover border border-white dark:border-black"
              />
            </div>
            <div>
              <span className="font-semibold text-xs block text-black dark:text-white">
                {profile.username || 'My Profile'}
              </span>
              <span className="text-xs text-neutral-400 block">{profile.fullName}</span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-500">
            Private 🔒
          </span>
        </div>

        {/* 90-Day Smart Cold Storage Card */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#262626] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Archive className="w-4 h-4 text-sky-500" />
              <span>Smart 90-Day Archiving</span>
            </span>
            <button
              onClick={onOpenArchiveVault}
              className="text-[11px] font-semibold text-[#0095f6] hover:underline"
            >
              Vault
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
              <span className="font-bold block text-emerald-600 dark:text-emerald-400">
                {hotMemoriesCount}
              </span>
              <span className="text-[10px] text-neutral-400">Hot (0-90d)</span>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
              <span className="font-bold block text-sky-600 dark:text-sky-400">
                {coldMemoriesCount}
              </span>
              <span className="text-[10px] text-neutral-400">Cold (ZIP)</span>
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 leading-normal">
            Memories older than 90 days are automatically archived into monthly ZIP packages while remaining visible in your feed.
          </p>
        </div>

        {/* Footer Meta Links */}
        <div className="text-[11px] text-neutral-400 space-y-3 pt-2">
          <p className="space-x-1 leading-relaxed">
            <span>About</span> • <span>Help</span> • <span>Press</span> • <span>API</span> • <span>Jobs</span> • <span>Privacy</span> • <span>Terms</span> • <span>Locations</span> • <span>Language</span>
          </p>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
            © 2026 INSTAGRAM • YOUR PRIVATE MEMORY ARCHIVE
          </p>
        </div>
      </div>
    </div>
  );
};
