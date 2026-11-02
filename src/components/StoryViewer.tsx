import React, { useState, useEffect } from 'react';
import { X, Heart, Send, Bookmark, MoreVertical, Plus } from 'lucide-react';
import { Story } from '../types';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onStorySeen: (id: string) => void;
  onAddToHighlight: (story: Story) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  onClose,
  onStorySeen,
  onAddToHighlight
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [hasLikedStory, setHasLikedStory] = useState(false);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!currentStory) return;
    onStorySeen(currentStory.id);
    setProgress(0);
    setHasLikedStory(false);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) return;

    const interval = 50;
    const totalTime = 5000;
    const step = (interval / totalTime) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(c => c + 1);
            return 0;
          } else {
            clearInterval(timer);
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(c => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none animate-fade-in">
      {/* Container (phone aspect ratio) */}
      <div
        className="relative w-full h-full max-w-md max-h-[95vh] sm:rounded-3xl overflow-hidden bg-neutral-900 flex flex-col justify-between shadow-2xl"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bars Header */}
        <div className="absolute top-0 left-0 right-0 z-30 p-3 pt-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex gap-1.5 mb-2.5">
            {stories.map((s, idx) => {
              let width = '0%';
              if (idx < currentIndex) width = '100%';
              else if (idx === currentIndex) width = `${progress}%`;

              return (
                <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-75" style={{ width }} />
                </div>
              );
            })}
          </div>

          {/* User info & Close */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.user.avatar || currentStory.mediaUrl}
                alt={currentStory.user.name}
                className="w-8 h-8 rounded-full object-cover border border-white/50"
              />
              <span className="text-xs font-semibold">{currentStory.user.name}</span>
              <span className="text-xs text-white/70">{currentStory.createdAt}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Background */}
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          {currentStory.mediaType === 'video' ? (
            <video
              src={currentStory.mediaUrl}
              autoPlay
              playsInline
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Tap areas for next/previous */}
        <div className="absolute inset-0 z-10 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Bottom footer: Caption, Reply & Highlight Action */}
        <div className="relative z-30 p-4 pt-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white space-y-3">
          {currentStory.caption && (
            <p className="text-sm font-medium text-center text-white/95 drop-shadow-md">
              {currentStory.caption}
            </p>
          )}

          <div className="flex items-center gap-2.5">
            {/* Private Note / Reply */}
            <div className="flex-1 flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/25">
              <input
                type="text"
                placeholder="Send a private note..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                className="bg-transparent text-xs text-white placeholder-white/70 outline-none w-full"
              />
              {replyText.trim() && (
                <button
                  onClick={() => {
                    setReplyText('');
                    setIsPaused(false);
                    alert('Private note saved to your memory diary!');
                  }}
                  className="text-white hover:text-pink-300 ml-1"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Add to Highlight Button (Instagram Feature) */}
            <button
              onClick={() => {
                setIsPaused(true);
                onAddToHighlight(currentStory);
              }}
              className="flex flex-col items-center justify-center p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
              title="Add to Highlight"
            >
              <Heart className="w-5 h-5 fill-white/30" />
            </button>

            {/* Like heart */}
            <button
              onClick={() => setHasLikedStory(l => !l)}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
            >
              <Heart
                className={`w-5 h-5 transition-transform duration-200 ${
                  hasLikedStory ? 'fill-[#ed4956] text-[#ed4956] scale-110' : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
