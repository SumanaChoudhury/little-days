export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  fileSize?: number;
  fileName?: string;
  isArchived?: boolean;
  archiveBundle?: string;
  checksum?: string;
}

export interface ReflectionNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface MemoryPost {
  id: string;
  caption: string;
  date: string; // YYYY-MM-DD
  location?: string;
  mood?: string;
  media: MediaItem[];
  isLiked: boolean;
  isBookmarked: boolean;
  isArchived: boolean;
  isPinned?: boolean;
  tags: string[];
  collections: string[];
  taggedPeople?: string[];
  personalNotes: ReflectionNote[];
  createdAt: string;
}

export interface Story {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: string;
  highlightCategory?: string;
  seen: boolean;
  user: {
    name: string;
    avatar: string;
  };
}

export interface Highlight {
  id: string;
  title: string;
  coverUrl: string;
  stories: Story[];
}

export interface UserProfile {
  username: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  website?: string;
  pinCode?: string; // Optional app lock PIN
  themePreset?: 'journal' | 'gallery' | 'scrapbook';
}

export interface ArchiveBundle {
  monthYear: string;
  fileName: string;
  itemCount: number;
  totalBytes: number;
  createdAt: string;
  postIds: string[];
  status: 'ready' | 'archived';
}

// PRD 3.3: Personal Diary
export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  prompt?: string;
  mood?: string;
  voiceNoteUrl?: string;
  photos: string[];
  createdAt: string;
}

// PRD 3.4: Mood Entry
export interface MoodEntry {
  date: string;
  mood: string;
  emoji: string;
  note?: string;
}

// PRD 3.8: Time Capsules & Letters
export interface TimeCapsule {
  id: string;
  title: string;
  description: string;
  mediaUrls: string[];
  unlockDate: string; // YYYY-MM-DD
  isLocked: boolean;
  createdAt: string;
}

export interface FutureLetter {
  id: string;
  title: string;
  content: string;
  deliveryDate: string; // YYYY-MM-DD
  isDelivered: boolean;
  createdAt: string;
}

// PRD 3.6: Moodboards
export interface MoodboardElement {
  id: string;
  type: 'image' | 'text' | 'sticker';
  content: string; // image url or text or sticker emoji
  x: number;
  y: number;
  rotation?: number;
}

export interface Moodboard {
  id: string;
  title: string;
  backgroundColor: string;
  elements: MoodboardElement[];
  createdAt: string;
}

// PRD 4.1: People Recognition / Tagging
export interface PersonTag {
  id: string;
  name: string;
  avatarUrl?: string;
  postCount: number;
}
