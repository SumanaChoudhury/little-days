import React, { useState } from 'react';
import { X, Image, MapPin, Calendar, Sparkles, ChevronLeft, ChevronRight, Shield, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MemoryPost, MediaItem, Story, UserProfile } from '../types';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (memory: MemoryPost) => void;
  onAddStory: (story: Story) => void;
  onOpenCamera?: () => void;
  profile: UserProfile;
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onAddMemory,
  onAddStory,
  onOpenCamera,
  profile
}) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('✨ peaceful');
  const [isStory, setIsStory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newMediaItems: MediaItem[] = [];
    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      const isVideo = file.type.startsWith('video');

      reader.onload = event => {
        const url = event.target?.result as string;
        newMediaItems.push({
          id: `media-${Date.now()}-${idx}`,
          url,
          type: isVideo ? 'video' : 'image',
          aspectRatio: 'square',
          fileSize: file.size,
          fileName: file.name,
          isArchived: false
        });

        if (newMediaItems.length === files.length) {
          setSelectedMedia(prev => [...prev, ...newMediaItems]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleShare = () => {
    if (selectedMedia.length === 0) {
      alert('Please upload or select at least one photo or video.');
      return;
    }

    setIsSubmitting(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    if (isStory) {
      const story: Story = {
        id: `story-${Date.now()}`,
        mediaUrl: selectedMedia[0].url,
        mediaType: selectedMedia[0].type,
        caption: caption.trim() || undefined,
        createdAt: 'Just now',
        seen: false,
        user: {
          name: profile.username,
          avatar: profile.avatarUrl
        }
      };
      onAddStory(story);
    } else {
      const tags = caption.match(/#[a-zA-Z0-9_]+/g)?.map(t => t.slice(1)) || [];
      const memory: MemoryPost = {
        id: `post-${Date.now()}`,
        caption: caption.trim(),
        date: date || new Date().toISOString().split('T')[0],
        location: location.trim() || undefined,
        mood,
        media: selectedMedia,
        isLiked: false,
        isBookmarked: false,
        isArchived: false,
        tags,
        collections: ['Personal Vault'],
        personalNotes: [],
        createdAt: new Date().toISOString()
      };
      onAddMemory(memory);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSelectedMedia([]);
      setCaption('');
      setLocation('');
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 select-none animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#262626] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="h-12 border-b border-[#dbdbdb] dark:border-[#383838] px-4 flex items-center justify-between">
          <button onClick={onClose} className="p-1 hover:opacity-70 text-black dark:text-white">
            <X className="w-5 h-5" />
          </button>
          <span className="font-semibold text-sm text-black dark:text-white">
            {isStory ? 'Create Story' : 'Create new post'}
          </span>
          <button
            onClick={handleShare}
            disabled={selectedMedia.length === 0 || isSubmitting}
            className="text-sm font-semibold text-[#0095f6] hover:text-sky-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sharing...' : 'Share'}
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
          {/* Left Media Area */}
          <div className="w-full md:w-3/5 aspect-square md:aspect-auto bg-neutral-100 dark:bg-black flex items-center justify-center relative overflow-hidden">
            {selectedMedia.length > 0 ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {selectedMedia[activeMediaIndex].type === 'video' ? (
                  <video
                    src={selectedMedia[activeMediaIndex].url}
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={selectedMedia[activeMediaIndex].url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}

                <button
                  onClick={() => {
                    setSelectedMedia(m => m.filter((_, idx) => idx !== activeMediaIndex));
                    setActiveMediaIndex(0);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>

                {selectedMedia.length > 1 && (
                  <>
                    <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      {activeMediaIndex + 1}/{selectedMedia.length}
                    </span>
                    {activeMediaIndex > 0 && (
                      <button
                        onClick={() => setActiveMediaIndex(i => i - 1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    {activeMediaIndex < selectedMedia.length - 1 && (
                      <button
                        onClick={() => setActiveMediaIndex(i => i + 1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 mb-4">
                  <Image className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold mb-1 text-black dark:text-white">
                  Upload your photos and videos
                </h3>
                <p className="text-xs text-neutral-500 mb-5">
                  Select media from your device to dump into your private archive.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="px-5 py-2.5 rounded-lg bg-[#0095f6] hover:bg-sky-600 text-white text-xs font-semibold cursor-pointer shadow-sm">
                    Select from computer
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {onOpenCamera && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCamera();
                      }}
                      className="px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-black dark:text-white text-xs font-semibold flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4 text-pink-500" />
                      <span>Click with Camera</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Settings */}
          <div className="w-full md:w-2/5 p-4 border-t md:border-t-0 md:border-l border-[#dbdbdb] dark:border-[#383838] flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.username}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold">{profile.username}</span>
                </div>
                <button
                  onClick={() => setIsStory(!isStory)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                    isStory
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-transparent'
                      : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {isStory ? 'Story Mode' : 'Feed Post'}
                </button>
              </div>

              <textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
                rows={4}
                className="w-full text-xs p-2 rounded-lg bg-transparent text-black dark:text-white placeholder-neutral-400 outline-none resize-none border border-neutral-200 dark:border-neutral-700 focus:border-[#0095f6]"
              />

              <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-neutral-500">
                  <Calendar className="w-4 h-4" />
                  <span>Memory Date</span>
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="bg-transparent text-xs text-neutral-800 dark:text-neutral-200 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs py-1 border-b border-neutral-200 dark:border-neutral-800">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Add location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-transparent text-xs text-black dark:text-white placeholder-neutral-400 outline-none"
                />
              </div>

              <div>
                <span className="text-[11px] font-medium text-neutral-400 block mb-1.5">
                  Mood tag:
                </span>
                <div className="flex flex-wrap gap-1">
                  {['🌸 joyful', '☕ cozy', '✨ peaceful', '⚡ chaotic', '🌊 nostalgic', '💖 grateful'].map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMood(m)}
                      className={`text-[11px] px-2 py-0.5 rounded-full ${
                        mood === m
                          ? 'bg-sky-500 text-white font-semibold'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full resolution original • Auto-bundled into 90-day cold archive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
