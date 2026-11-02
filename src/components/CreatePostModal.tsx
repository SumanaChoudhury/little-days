import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, MapPin, Calendar, Tag, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MemoryPost, MediaItem, Story, UserProfile } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (memory: MemoryPost) => void;
  onAddStory: (story: Story) => void;
  profile: UserProfile;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    name: 'Coffee & Books',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    type: 'image' as const
  },
  {
    name: 'Sunset Sky',
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=80',
    type: 'image' as const
  },
  {
    name: 'Campus Life',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    type: 'image' as const
  },
  {
    name: 'Rainy City Walk',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80',
    type: 'image' as const
  }
];

const MOOD_OPTIONS = [
  '🌸 joyful',
  '☕ cozy',
  '✨ peaceful',
  '⚡ chaotic',
  '🌊 nostalgic',
  '💖 grateful',
  '🌙 dreamy',
  '🌿 relaxed'
];

const COLLECTION_OPTIONS = ['College', 'Travel', 'Cafés', 'Little Joys', 'Friends', 'Outfits'];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onAddMemory,
  onAddStory,
  profile
}) => {
  const [postType, setPostType] = useState<'feed' | 'story'>('feed');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('✨ peaceful');
  const [selectedCollections, setSelectedCollections] = useState<string[]>(['Little Joys']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Handle local file uploads (multiple images/videos)
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
          id: `media-upload-${Date.now()}-${idx}`,
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

  const handleSelectPreset = (preset: typeof SAMPLE_PHOTO_PRESETS[0]) => {
    setSelectedMedia(prev => [
      ...prev,
      {
        id: `media-preset-${Date.now()}`,
        url: preset.url,
        type: preset.type,
        aspectRatio: 'square',
        fileName: `${preset.name.toLowerCase().replace(/\s+/g, '_')}.jpg`,
        fileSize: 2200000,
        isArchived: false
      }
    ]);
  };

  const toggleCollection = (col: string) => {
    if (selectedCollections.includes(col)) {
      setSelectedCollections(c => c.filter(item => item !== col));
    } else {
      setSelectedCollections(c => [...c, col]);
    }
  };

  const handleSubmit = () => {
    if (selectedMedia.length === 0) {
      alert('Please upload or select at least one photo or video.');
      return;
    }

    setIsSubmitting(true);

    // Trigger celebratory confetti
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });

    if (postType === 'story') {
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
      // Extract hashtags from caption
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
        collections: selectedCollections,
        personalNotes: [],
        createdAt: new Date().toISOString()
      };
      onAddMemory(memory);
    }

    // Reset and close
    setTimeout(() => {
      setIsSubmitting(false);
      setSelectedMedia([]);
      setCaption('');
      setLocation('');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121212] rounded-2xl shadow-2xl border border-[#dbdbdb] dark:border-[#262626] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#dbdbdb] dark:border-[#262626]">
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setPostType('feed')}
              className={`px-3 py-1 rounded-md transition-colors ${
                postType === 'feed'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs font-semibold'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Feed Post
            </button>
            <button
              onClick={() => setPostType('story')}
              className={`px-3 py-1 rounded-md transition-colors ${
                postType === 'story'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs font-semibold'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Story
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedMedia.length === 0 || isSubmitting}
            className="text-xs font-semibold text-[#0095f6] hover:text-sky-600 disabled:opacity-40 disabled:cursor-not-allowed px-2 py-1"
          >
            {isSubmitting ? 'Saving...' : 'Share'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Media Preview Box */}
          {selectedMedia.length > 0 ? (
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-[#dbdbdb] dark:border-[#262626]">
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

              {/* Remove active item button */}
              <button
                onClick={() => {
                  setSelectedMedia(m => m.filter((_, idx) => idx !== activeMediaIndex));
                  setActiveMediaIndex(0);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                title="Remove item"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Carousel navigation */}
              {selectedMedia.length > 1 && (
                <>
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {activeMediaIndex + 1}/{selectedMedia.length}
                  </span>
                  {activeMediaIndex > 0 && (
                    <button
                      onClick={() => setActiveMediaIndex(i => i - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                  {activeMediaIndex < selectedMedia.length - 1 && (
                    <button
                      onClick={() => setActiveMediaIndex(i => i + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="w-full aspect-square rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center p-6 text-center hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors">
              <div className="w-14 h-14 rounded-full bg-pink-50 dark:bg-pink-950/30 flex items-center justify-center text-[#ed4956] mb-3">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
                Upload photos and videos
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                Stored privately with full original resolution. Nothing leaves your personal device/cloud.
              </p>

              <label className="mt-4 px-4 py-2 rounded-lg bg-[#0095f6] hover:bg-sky-600 text-white text-xs font-semibold cursor-pointer shadow-sm hover:scale-102 transition-transform">
                Select from Computer
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Sample presets for fast testing */}
              <div className="mt-5 w-full pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-2 font-medium">
                  Or pick a photo preset to test right now:
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {SAMPLE_PHOTO_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(p)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add more files button if some already selected */}
          {selectedMedia.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#0095f6] hover:underline cursor-pointer font-medium flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>+ Add more photos/videos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Caption Input */}
          <div>
            <textarea
              placeholder="Write a caption... (e.g. Late night study session, best mango smoothie ever #collegelife)"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={3}
              className="w-full text-xs p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#dbdbdb] dark:border-[#262626] text-[#262626] dark:text-[#f5f5f5] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#0095f6]"
            />
          </div>

          {/* Memory Date Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
            <div className="flex-1 flex items-center justify-between text-xs">
              <span className="text-neutral-500 font-medium">Memory Date:</span>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg text-neutral-800 dark:text-neutral-200 outline-none text-xs"
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <input
              type="text"
              placeholder="Add location (e.g. Campus library, Pondicherry, Home)"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full text-xs p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-[#dbdbdb] dark:border-[#262626] text-neutral-800 dark:text-neutral-200 outline-none"
            />
          </div>

          {/* Mood Selector */}
          <div>
            <div className="flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>How did this moment feel?</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {MOOD_OPTIONS.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setMood(m)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                    mood === m
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-400 font-medium scale-105'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Collections Selector */}
          <div>
            <div className="flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
              <Tag className="w-3.5 h-3.5 text-sky-500" />
              <span>Add to Collections:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COLLECTION_OPTIONS.map((col, idx) => {
                const isSelected = selectedCollections.includes(col);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleCollection(col)}
                    className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-400 font-medium'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{col}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
