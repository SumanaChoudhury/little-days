import React, { useState, useRef } from 'react';
import {
  NotificationsHeartIcon,
  CommentIcon,
  SharePostIcon,
  BookmarkIcon
} from './InstagramIcons';
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Smile,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Trash2,
  Download,
  Archive
} from 'lucide-react';
import { MemoryPost, UserProfile } from '../types';
import { formatMemoryDate, isOlderThan90Days } from '../lib/storage';

interface PostCardProps {
  post: MemoryPost;
  profile: UserProfile;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onDeletePost: (id: string) => void;
  onRestoreMemory: (id: string) => void;
  onAddNote: (postId: string, text: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  profile,
  onToggleLike,
  onToggleBookmark,
  onDeletePost,
  onRestoreMemory,
  onAddNote
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const lastTapRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentMedia = post.media[activeMediaIndex] || post.media[0];
  const isArchived = post.isArchived || isOlderThan90Days(post.date);

  // Double tap to like
  const handleMediaTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!post.isLiked) {
        onToggleLike(post.id);
      }
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
    }
    lastTapRef.current = now;
  };

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMediaIndex < post.media.length - 1) {
      setActiveMediaIndex(i => i + 1);
    }
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMediaIndex > 0) {
      setActiveMediaIndex(i => i - 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddNote(post.id, commentText.trim());
      setCommentText('');
    }
  };

  const toggleVideoPlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  return (
    <article className="w-full bg-white dark:bg-black border-b border-[#dbdbdb] dark:border-[#262626] sm:border sm:rounded-lg mb-4 sm:mb-6 transition-colors overflow-hidden">
      {/* 1. Header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              className="w-full h-full rounded-full object-cover border border-white dark:border-black"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-xs text-[#262626] dark:text-[#f5f5f5] hover:opacity-80 cursor-pointer">
              {profile.username}
            </span>
            {post.location && (
              <span className="text-[11px] text-[#737373] dark:text-[#a8a8a8]">
                {post.location}
              </span>
            )}
          </div>
        </div>

        {/* 3-dots Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(m => !m)}
            className="p-1 text-[#262626] dark:text-[#f5f5f5] hover:opacity-60"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-30 w-48 bg-white dark:bg-[#262626] rounded-xl shadow-2xl border border-[#dbdbdb] dark:border-[#383838] py-1 text-xs">
              {isArchived && (
                <button
                  onClick={() => {
                    onRestoreMemory(post.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sky-500 font-semibold"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore from 90-Day Archive</span>
                </button>
              )}
              <button
                onClick={() => {
                  window.open(currentMedia.url, '_blank');
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                <Download className="w-4 h-4" />
                <span>Save Original Media</span>
              </button>
              <button
                onClick={() => {
                  onDeletePost(post.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 text-rose-500 font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Media (Full Bleed) */}
      <div
        className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex items-center justify-center cursor-pointer select-none"
        onClick={handleMediaTap}
      >
        {currentMedia.type === 'video' ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={currentMedia.url}
              playsInline
              loop
              autoPlay
              muted={isMuted}
              className="w-full h-full object-cover"
            />
            {/* Audio Button */}
            <div className="absolute bottom-3 right-3 z-10">
              <button
                onClick={e => {
                  e.stopPropagation();
                  setIsMuted(m => !m);
                }}
                className="p-1.5 rounded-full bg-black/70 text-white"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
            {!isVideoPlaying && (
              <div
                onClick={toggleVideoPlayback}
                className="absolute inset-0 flex items-center justify-center bg-black/30"
              >
                <Play className="w-12 h-12 text-white fill-white" />
              </div>
            )}
          </div>
        ) : (
          <img
            src={currentMedia.url}
            alt={post.caption || 'Photo'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {/* Carousel indicator badge & navigation */}
        {post.media.length > 1 && (
          <>
            <span className="absolute top-3 right-3 bg-black/70 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs z-10">
              {activeMediaIndex + 1}/{post.media.length}
            </span>

            {activeMediaIndex > 0 && (
              <button
                onClick={handlePrevMedia}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 dark:bg-black/70 text-black dark:text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform z-10"
              >
                <ChevronLeft className="w-4 h-4 stroke-[3]" />
              </button>
            )}

            {activeMediaIndex < post.media.length - 1 && (
              <button
                onClick={handleNextMedia}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 dark:bg-black/70 text-black dark:text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform z-10"
              >
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            )}
          </>
        )}

        {/* Center Double-tap Animated Popping Heart */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <svg
              className="w-24 h-24 text-white fill-white drop-shadow-2xl animate-like-bounce"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        )}

        {/* Subtle 90-Day Cold Vault Badge if archived */}
        {isArchived && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 text-white backdrop-blur-sm text-[10px] font-medium border border-white/10">
            <Archive className="w-3 h-3 text-sky-400" />
            <span>Archived (90-Day Cold Vault)</span>
          </div>
        )}
      </div>

      {/* 3. Action Bar */}
      <div className="px-3 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-black dark:text-white">
            {/* Heart */}
            <button
              onClick={() => onToggleLike(post.id)}
              className="hover:opacity-60 transition-transform active:scale-125"
            >
              <NotificationsHeartIcon filled={post.isLiked} />
            </button>

            {/* Comment */}
            <button
              onClick={() => setShowAllComments(s => !s)}
              className="hover:opacity-60"
            >
              <CommentIcon />
            </button>

            {/* Share */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.caption, url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(post.caption || '');
                  alert('Copied memory link to clipboard!');
                }
              }}
              className="hover:opacity-60"
            >
              <SharePostIcon />
            </button>
          </div>

          {/* Dots Indicator in center */}
          {post.media.length > 1 && (
            <div className="flex items-center gap-1">
              {post.media.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === activeMediaIndex ? 'bg-[#0095f6] w-2' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Bookmark */}
          <button
            onClick={() => onToggleBookmark(post.id)}
            className="text-black dark:text-white hover:opacity-60 active:scale-110"
          >
            <BookmarkIcon filled={post.isBookmarked} />
          </button>
        </div>

        {/* 4. Likes Count */}
        <div className="mt-2.5 text-xs font-semibold text-[#262626] dark:text-[#f5f5f5]">
          {post.isLiked ? 'Liked by you and memories' : '1 like'}
        </div>

        {/* 5. Caption */}
        {post.caption && (
          <div className="mt-1 text-xs text-[#262626] dark:text-[#f5f5f5] leading-normal">
            <span className="font-semibold mr-1.5">{profile.username}</span>
            <span>
              {isCaptionExpanded || post.caption.length <= 100
                ? post.caption
                : `${post.caption.slice(0, 100)}... `}
            </span>
            {post.caption.length > 100 && (
              <button
                onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                className="text-[#737373] dark:text-[#a8a8a8] font-normal hover:underline ml-1"
              >
                {isCaptionExpanded ? 'less' : 'more'}
              </button>
            )}
          </div>
        )}

        {/* 6. Comments / Reflection notes */}
        {(post.personalNotes?.length || 0) > 0 && (
          <button
            onClick={() => setShowAllComments(!showAllComments)}
            className="mt-1 text-[12px] text-[#737373] dark:text-[#a8a8a8] hover:underline block"
          >
            {showAllComments
              ? 'Hide reflections'
              : `View all ${post.personalNotes.length} reflection ${
                  post.personalNotes.length === 1 ? 'note' : 'notes'
                }`}
          </button>
        )}

        {showAllComments && (
          <div className="mt-2 space-y-1.5">
            {post.personalNotes?.map(note => (
              <div key={note.id} className="text-xs">
                <span className="font-semibold mr-1.5 text-neutral-800 dark:text-neutral-200">
                  {profile.username}
                </span>
                <span className="text-neutral-700 dark:text-neutral-300">{note.text}</span>
                <span className="text-[10px] text-neutral-400 ml-2">{note.createdAt}</span>
              </div>
            ))}
          </div>
        )}

        {/* 7. Timestamp (Instagram style: e.g. "OCTOBER 14, 2026") */}
        <div className="mt-1 text-[10px] text-[#737373] dark:text-[#a8a8a8] uppercase tracking-wide">
          {formatMemoryDate(post.date)}
        </div>

        {/* 8. "Add a comment..." Input */}
        <form
          onSubmit={handleAddComment}
          className="mt-2.5 pt-2 border-t border-[#efefef] dark:border-[#262626] flex items-center justify-between pb-3"
        >
          <div className="flex items-center gap-2 flex-1">
            <Smile className="w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Add a comment / private reflection..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="w-full text-xs bg-transparent text-[#262626] dark:text-[#f5f5f5] placeholder-[#737373] outline-none"
            />
          </div>
          {commentText.trim() && (
            <button
              type="submit"
              className="text-xs font-semibold text-[#0095f6] hover:text-sky-600 ml-2"
            >
              Post
            </button>
          )}
        </form>
      </div>
    </article>
  );
};
