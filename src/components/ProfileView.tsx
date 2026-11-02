import React, { useState, useRef } from 'react';
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
  MoreHorizontal,
  Camera,
  Upload,
  Trash2
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
  onOpenCamera?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  memories,
  highlights,
  onUpdateProfile,
  onSelectPost,
  onOpenStory,
  onOpenArchiveVault,
  onOpenCamera
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'archive'>('posts');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setEditAvatar(dataUrl);
        onUpdateProfile({
          ...profile,
          avatarUrl: dataUrl
        });
        setShowAvatarModal(false);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be selected again if needed
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    const defaultAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.username || 'user'}`;
    setEditAvatar(defaultAvatar);
    onUpdateProfile({
      ...profile,
      avatarUrl: defaultAvatar
    });
    setShowAvatarModal(false);
  };

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
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 select-none animate-fade-in">
      {/* Hidden file input for uploading profile picture */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleAvatarFileSelect}
        className="hidden"
      />

      {/* 1. Profile Header (Instagram Desktop/Mobile layout) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-16 mb-8">
        {/* Interactive Avatar with Camera Overlay & Click Handler */}
        <div className="flex flex-col items-center gap-2 shrink-0 self-center sm:self-auto">
          <div
            onClick={() => setShowAvatarModal(true)}
            className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full p-[2.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] cursor-pointer group transition-transform active:scale-95"
            title="Click to change profile picture"
          >
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              className="w-full h-full rounded-full object-cover border-2 sm:border-4 border-white dark:border-black group-hover:brightness-90 transition-all"
            />

            {/* Hover Camera Overlay (Desktop) */}
            <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white">
              <Camera className="w-6 h-6 stroke-[2]" />
              <span className="text-[10px] font-bold mt-1">Change</span>
            </div>

            {/* Visible Camera Badge (Mobile) */}
            <div className="sm:hidden absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0095f6] text-white flex items-center justify-center border-2 border-white dark:border-black shadow-md">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Direct "Change photo" text link */}
          <button
            type="button"
            onClick={() => setShowAvatarModal(true)}
            className="text-xs font-semibold text-[#0095f6] hover:text-[#1877f2] transition-colors"
          >
            Change profile picture
          </button>
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
              title="Profile Settings"
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
              {profile.bio || 'Capturing moments, preserved forever.'}
            </p>
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-[#00376b] dark:text-[#e0f1ff] hover:underline block"
              >
                {profile.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. Story Highlights Tray */}
      <div className="mb-8">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2">
          {highlights.map(hl => (
            <div
              key={hl.id}
              onClick={() => {
                if (hl.stories.length > 0) onOpenStory(hl.stories[0]);
              }}
              className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] border border-[#dbdbdb] dark:border-[#383838] group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full p-[2px] bg-white dark:bg-black">
                  <img
                    src={hl.coverUrl}
                    alt={hl.title}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-black dark:text-white max-w-[74px] truncate text-center">
                {hl.title}
              </span>
            </div>
          ))}

          {/* New highlight button */}
          <div
            onClick={() => alert('New highlights are created from your active Stories! Click the Highlight button while watching any story.')}
            className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:border-neutral-500 transition-colors">
              <Plus className="w-6 h-6 stroke-[1.5]" />
            </div>
            <span className="text-xs font-normal text-neutral-500">New</span>
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
        <div className="py-16 text-center text-neutral-400 space-y-2">
          <div className="w-14 h-14 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center mx-auto text-neutral-400">
            <Camera className="w-6 h-6 stroke-[1.5]" />
          </div>
          <p className="text-sm font-semibold text-black dark:text-white">
            {activeTab === 'saved'
              ? 'No saved memories yet'
              : activeTab === 'archive'
              ? 'No archived memories (90d+) yet'
              : 'Share Photos'}
          </p>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            When you take pictures or upload memories, they will appear here on your private profile grid.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 sm:gap-7">
          {displayedMemories.map(memory => {
            const firstMedia = memory.media[0];
            const hasMultiple = memory.media.length > 1;
            const isVideo = firstMedia?.type === 'video';

            return (
              <div
                key={memory.id}
                onClick={() => onSelectPost(memory)}
                className="relative aspect-square cursor-pointer group bg-neutral-100 dark:bg-neutral-900 overflow-hidden"
              >
                {isVideo ? (
                  <video
                    src={firstMedia.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={firstMedia?.url}
                    alt={memory.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}

                {/* Multiple Media Badge */}
                {hasMultiple && (
                  <div className="absolute top-2 right-2 text-white drop-shadow-md">
                    <Layers className="w-4 h-4" />
                  </div>
                )}

                {/* Video Badge */}
                {isVideo && (
                  <div className="absolute top-2 right-2 text-white drop-shadow-md">
                    <Film className="w-4 h-4" />
                  </div>
                )}

                {/* Hover overlay with Like / Comments count (Instagram Desktop style) */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-5 h-5 fill-white" />
                    <span>{memory.isLiked ? 1 : 0}</span>
                  </div>
                  {memory.personalNotes && memory.personalNotes.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span>📝 {memory.personalNotes.length}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Change Profile Photo Action Sheet Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-sm overflow-hidden border border-[#dbdbdb] dark:border-[#383838] shadow-2xl text-center text-sm font-semibold divide-y divide-[#dbdbdb] dark:divide-[#383838]">
            <div className="py-4 px-6 text-center">
              <h3 className="text-base font-bold text-black dark:text-white">Change Profile Photo</h3>
            </div>

            {/* Upload Photo */}
            <button
              onClick={() => {
                fileInputRef.current?.click();
              }}
              className="w-full py-3.5 text-[#0095f6] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-bold"
            >
              Upload Photo from Device
            </button>

            {/* Take Photo with Camera */}
            {onOpenCamera && (
              <button
                onClick={() => {
                  setShowAvatarModal(false);
                  onOpenCamera();
                }}
                className="w-full py-3.5 text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Take Photo with Camera
              </button>
            )}

            {/* Remove Current Photo */}
            <button
              onClick={handleRemovePhoto}
              className="w-full py-3.5 text-[#ed4956] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Remove Current Photo
            </button>

            {/* Cancel */}
            <button
              onClick={() => setShowAvatarModal(false)}
              className="w-full py-3.5 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-normal"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-sm p-5 border border-[#dbdbdb] dark:border-[#383838] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-black dark:text-white">Edit Profile</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-neutral-400 hover:text-black dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatar Section inside Edit Profile */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mb-4">
              <img
                src={editAvatar || profile.avatarUrl}
                alt={profile.username}
                className="w-12 h-12 rounded-full object-cover border border-neutral-300 dark:border-neutral-600"
              />
              <div>
                <span className="font-bold text-sm block text-black dark:text-white">{profile.username}</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-[#0095f6] hover:text-[#1877f2] transition-colors"
                >
                  Change profile photo
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-500 block mb-1 font-semibold uppercase text-[10px]">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none text-black dark:text-white focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="text-neutral-500 block mb-1 font-semibold uppercase text-[10px]">Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none text-black dark:text-white focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="text-neutral-500 block mb-1 font-semibold uppercase text-[10px]">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  placeholder="Tell your private world about yourself..."
                  className="w-full p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none text-black dark:text-white focus:border-neutral-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold text-xs transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
