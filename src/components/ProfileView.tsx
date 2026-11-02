import React, { useState } from 'react';
import {
  Grid,
  Bookmark,
  Calendar,
  Settings,
  Lock,
  Plus,
  Layers,
  Film,
  Heart,
  X,
  Archive,
  MoreHorizontal
} from 'lucide-react';
import { MemoryPost, Highlight, UserProfile, Story } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  memories: MemoryPost[];
  highlights: Highlight[];
  onUpdateProfile: (updated: UserProfile) => void;
  onSelectPost: (post: MemoryPost) => void;
  onOpenStory: (story: Story) => void;
  onOpenArchiveVault: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  memories,
  highlights,
  onUpdateProfile,
  onSelectPost,
  onOpenStory,
  onOpenArchiveVault
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'archive'>('posts');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(profile.fullName);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAvatar, setEditAvatar] = useState(profile.avatarUrl);

  const totalPhotos = memories.reduce((acc, m) => acc + m.media.filter(med => med.type === 'image').length, 0);
  const totalVideos = memories.reduce((acc, m) => acc + m.media.filter(med => med.type === 'video').length, 0);
  const bookmarkedMemories = memories.filter(m => m.isBookmarked);
  const archivedMemories = memories.filter(m => m.isArchived);

  const displayedMemories =
    activeTab === 'saved' ? bookmarkedMemories : activeTab === 'archive' ? archivedMemories : memories;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      fullName: editName.trim() || profile.fullName,
      username: editUsername.trim() || profile.username,
      bio: editBio.trim() || profile.bio,
      avatarUrl: editAvatar.trim() || profile.avatarUrl
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 select-none">
      {/* 1. Profile Header (Instagram Desktop/Mobile layout) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-16 mb-8">
        {/* Avatar */}
        <div className="w-20 h-20 sm:w-36 sm:h-36 rounded-full p-[2.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shrink-0 self-center sm:self-auto">
          <img
            src={profile.avatarUrl}
            alt={profile.username}
            className="w-full h-full rounded-full object-cover border-2 sm:border-4 border-white dark:border-black"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4 w-full">
          {/* Top row: username & action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-normal text-black dark:text-white">
              {profile.username}
            </h2>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-black dark:text-white transition-colors"
            >
              Edit profile
            </button>
            <button
              onClick={onOpenArchiveVault}
              className="px-4 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-black dark:text-white transition-colors flex items-center gap-1.5"
            >
              <Archive className="w-3.5 h-3.5 text-sky-500" />
              <span>View archive</span>
            </button>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="p-1.5 hover:opacity-70 text-black dark:text-white"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Stats row: exact Instagram counts */}
          <div className="flex items-center gap-8 text-sm">
            <div>
              <span className="font-semibold text-black dark:text-white">{memories.length} </span>
              <span className="text-neutral-600 dark:text-neutral-400">posts</span>
            </div>
            <div>
              <span className="font-semibold text-black dark:text-white">0 </span>
              <span className="text-neutral-600 dark:text-neutral-400">followers</span>
            </div>
            <div>
              <span className="font-semibold text-black dark:text-white">1 </span>
              <span className="text-neutral-600 dark:text-neutral-400">following (you)</span>
            </div>
          </div>

          {/* Bio section */}
          <div className="text-xs sm:text-sm space-y-1">
            <h3 className="font-semibold text-black dark:text-white">{profile.fullName}</h3>
            <span className="text-xs text-neutral-400 block font-normal">Personal Memory Vault 🔒</span>
            <p className="whitespace-pre-line text-neutral-800 dark:text-neutral-200 leading-relaxed font-normal">
              {profile.bio}
            </p>
            {profile.website && (
              <a href="#" className="font-semibold text-[#00376b] dark:text-[#e0f1ff] hover:underline block">
                {profile.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. Story Highlights Tray */}
      <div className="py-2 mb-6 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 min-w-max">
          {highlights.map(hl => (
            <div
              key={hl.id}
              onClick={() => {
                if (hl.stories.length > 0) onOpenStory(hl.stories[0]);
              }}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] border-2 border-neutral-300 dark:border-neutral-700 group-hover:scale-105 transition-transform">
                <img
                  src={hl.coverUrl}
                  alt={hl.title}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-xs font-semibold text-black dark:text-white max-w-[75px] truncate text-center">
                {hl.title}
              </span>
            </div>
          ))}

          {/* New highlight button */}
          <div
            onClick={() => alert('New highlight created from stories!')}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:border-neutral-500 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-neutral-400">New</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs (POSTS, SAVED, ARCHIVE) */}
      <div className="flex items-center justify-center gap-12 border-t border-[#dbdbdb] dark:border-[#262626] mb-4">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 text-xs tracking-widest font-semibold border-t-2 -mt-[1px] transition-colors ${
            activeTab === 'posts'
              ? 'border-black dark:border-white text-black dark:text-white'
              : 'border-transparent text-neutral-400'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>POSTS</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 py-3 text-xs tracking-widest font-semibold border-t-2 -mt-[1px] transition-colors ${
            activeTab === 'saved'
              ? 'border-black dark:border-white text-black dark:text-white'
              : 'border-transparent text-neutral-400'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>SAVED</span>
        </button>

        <button
          onClick={() => setActiveTab('archive')}
          className={`flex items-center gap-2 py-3 text-xs tracking-widest font-semibold border-t-2 -mt-[1px] transition-colors ${
            activeTab === 'archive'
              ? 'border-black dark:border-white text-black dark:text-white'
              : 'border-transparent text-neutral-400'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>ARCHIVED (90d+)</span>
        </button>
      </div>

      {/* 4. 3x3 Photo Grid (Instagram Signature Grid) */}
      {displayedMemories.length === 0 ? (
        <div className="py-16 text-center text-neutral-400">
          <p className="text-sm font-semibold">
            {activeTab === 'saved'
              ? 'No saved memories yet.'
              : activeTab === 'archive'
              ? 'No memories older than 90 days.'
              : 'No posts yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 sm:gap-4">
          {displayedMemories.map(m => {
            const hasMultiple = m.media.length > 1;
            const isVideo = m.media[0]?.type === 'video';

            return (
              <div
                key={m.id}
                onClick={() => onSelectPost(m)}
                className="relative aspect-square group cursor-pointer overflow-hidden bg-neutral-100 dark:bg-neutral-900 select-none"
              >
                <img
                  src={m.media[0]?.url}
                  alt={m.caption || 'Photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Top right indicator */}
                <div className="absolute top-2 right-2 text-white drop-shadow-md">
                  {hasMultiple && <Layers className="w-4 h-4 stroke-[2.5]" />}
                  {isVideo && <Film className="w-4 h-4 stroke-[2.5]" />}
                </div>

                {/* Hover overlay with likes and comment count */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-sm font-bold">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-5 h-5 fill-white text-white" />
                    <span>{m.isLiked ? '1' : '0'}</span>
                  </div>
                  {(m.personalNotes?.length || 0) > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span>{m.personalNotes.length} notes</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-sm p-4 border border-[#dbdbdb] dark:border-[#383838] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-black dark:text-white">Edit Profile</h3>
              <button onClick={() => setIsEditingProfile(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-500 block mb-1">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-black dark:text-white"
                />
              </div>

              <div>
                <label className="text-neutral-500 block mb-1">Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  className="w-full p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-black dark:text-white"
                />
              </div>

              <div>
                <label className="text-neutral-500 block mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-black dark:text-white"
                />
              </div>

              <div>
                <label className="text-neutral-500 block mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={e => setEditAvatar(e.target.value)}
                  className="w-full p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-black dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0095f6] text-white font-semibold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
