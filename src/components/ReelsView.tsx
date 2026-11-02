import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, Music, Volume2, VolumeX, Film, Plus } from 'lucide-react';
import { UserProfile, MemoryPost } from '../types';

interface ReelsViewProps {
  profile: UserProfile;
  memories?: MemoryPost[];
  onOpenCreate?: () => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({ profile, memories = [], onOpenCreate }) => {
  const videoMemories = memories.flatMap(m =>
    m.media.filter(med => med.type === 'video').map(med => ({
      id: med.id,
      videoUrl: med.url,
      caption: m.caption || 'Video Reel',
      audio: 'Original Audio',
      likes: m.isLiked ? '1' : '0',
      comments: m.personalNotes?.length.toString() || '0'
    }))
  );

  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (videoMemories.length === 0) {
    return (
      <div className="w-full max-w-sm mx-auto h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center text-neutral-400 mb-4">
          <Film className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-black dark:text-white">No Reels Yet</h3>
        <p className="text-xs text-neutral-500 mt-1.5 max-w-xs leading-normal">
          Upload videos or record a video memory to see your personal reels feed here.
        </p>
        {onOpenCreate && (
          <button
            onClick={onOpenCreate}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#0095f6] text-white text-xs font-semibold flex items-center gap-2 shadow-sm hover:bg-sky-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Reel</span>
          </button>
        )}
      </div>
    );
  }

  const reel = videoMemories[currentReelIndex];

  const handleNext = () => {
    if (currentReelIndex < videoMemories.length - 1) {
      setCurrentReelIndex(i => i + 1);
      setIsLiked(false);
    }
  };

  const handlePrev = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(i => i - 1);
      setIsLiked(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto h-[calc(100vh-60px)] md:h-[calc(100vh-40px)] flex flex-col items-center justify-center select-none py-2">
      <div className="relative w-full h-full max-h-[750px] aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl flex items-center justify-center">
        <video
          ref={videoRef}
          src={reel.videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        <button
          onClick={() => setIsMuted(m => !m)}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white z-20 backdrop-blur-xs"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Right Action Icons */}
        <div className="absolute right-3 bottom-16 z-20 flex flex-col items-center gap-5 text-white">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
          >
            <Heart className={`w-7 h-7 stroke-[1.8] ${isLiked ? 'fill-[#ed4956] text-[#ed4956]' : ''}`} />
            <span className="text-[11px] font-semibold">{isLiked ? 'Loved' : reel.likes}</span>
          </button>

          <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
            <MessageCircle className="w-7 h-7 stroke-[1.8]" />
            <span className="text-[11px] font-semibold">{reel.comments}</span>
          </button>

          <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
            <Send className="w-6 h-6 stroke-[1.8] -rotate-12" />
          </button>

          <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
            <Bookmark className="w-6 h-6 stroke-[1.8]" />
          </button>

          <button className="p-1 hover:opacity-70">
            <MoreVertical className="w-5 h-5" />
          </button>

          <div className="w-8 h-8 rounded-lg border-2 border-white overflow-hidden animate-spin shadow-md">
            <img src={profile.avatarUrl} alt="Audio" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Bottom Details */}
        <div className="absolute left-3 right-16 bottom-4 z-20 text-white space-y-2 bg-gradient-to-t from-black/80 to-transparent p-2 rounded-xl">
          <div className="flex items-center gap-2">
            <img src={profile.avatarUrl} alt="User" className="w-8 h-8 rounded-full border border-white/60 object-cover" />
            <span className="text-xs font-bold">{profile.username}</span>
            <button className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-white/60">
              Personal
            </button>
          </div>

          <p className="text-xs line-clamp-2 leading-relaxed text-white/95">{reel.caption}</p>

          <div className="flex items-center gap-1.5 text-[11px] text-white/80">
            <Music className="w-3.5 h-3.5" />
            <span className="truncate">{reel.audio}</span>
          </div>
        </div>

        {/* Up / Down Navigation */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
          {currentReelIndex > 0 && (
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
              title="Previous Reel"
            >
              ▲
            </button>
          )}
          {currentReelIndex < videoMemories.length - 1 && (
            <button
              onClick={handleNext}
              className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
              title="Next Reel"
            >
              ▼
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
