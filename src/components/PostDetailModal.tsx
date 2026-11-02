import React from 'react';
import { X } from 'lucide-react';
import { MemoryPost, UserProfile } from '../types';
import { PostCard } from './PostCard';

interface PostDetailModalProps {
  post: MemoryPost | null;
  profile: UserProfile;
  onClose: () => void;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onDeletePost: (id: string) => void;
  onRestoreMemory: (id: string) => void;
  onAddNote: (postId: string, text: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  profile,
  onClose,
  onToggleLike,
  onToggleBookmark,
  onDeletePost,
  onRestoreMemory,
  onAddNote
}) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-30 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <PostCard
          post={post}
          profile={profile}
          onToggleLike={onToggleLike}
          onToggleBookmark={onToggleBookmark}
          onDeletePost={id => {
            onDeletePost(id);
            onClose();
          }}
          onRestoreMemory={onRestoreMemory}
          onAddNote={onAddNote}
        />
      </div>
    </div>
  );
};
