import { MemoryPost, Story, Highlight, UserProfile, ArchiveBundle } from '../types';

export const initialProfile: UserProfile = {
  username: 'sumana',
  fullName: 'Sumana',
  bio: 'little days. • my private digital world 📷\ncollecting little moments before they fade away ✨\nno followers, no noise, just life.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  website: 'privatememories.internal'
};

// Calculate dates: some recent (<90 days) and some older (>90 days)
const now = new Date();
const daysAgo = (days: number) => {
  const d = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return d.toISOString().split('T')[0];
};

export const initialMemories: MemoryPost[] = [
  {
    id: 'post-1',
    caption: 'Late night debugging, endless chai, and somehow we actually fixed the backend bug at 2 AM ☕💻 #cseLife #hostelNights #littleWins',
    date: daysAgo(2),
    location: 'Campus Library Corner',
    mood: '⚡ chaotic',
    media: [
      {
        id: 'm-1-1',
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        type: 'image',
        aspectRatio: 'portrait',
        fileSize: 2450000,
        fileName: 'library_session_2am.jpg',
        isArchived: false
      },
      {
        id: 'm-1-2',
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
        type: 'image',
        aspectRatio: 'square',
        fileSize: 1890000,
        fileName: 'chai_break.jpg',
        isArchived: false
      }
    ],
    isLiked: true,
    isBookmarked: false,
    isArchived: false,
    tags: ['cseLife', 'hostelNights', 'littleWins'],
    collections: ['College', 'Little Joys'],
    personalNotes: [
      {
        id: 'n-1',
        text: 'Remember how tired we were here, but we could not stop laughing at the syntax error.',
        createdAt: '2 days ago'
      }
    ],
    createdAt: new Date(now.getTime() - 2 * 86400000).toISOString()
  },
  {
    id: 'post-2',
    caption: 'Golden hour walk by the lake. Sometimes you just need to close the laptop and watch the sky change colors. 🌅✨',
    date: daysAgo(5),
    location: 'Sankey Tank Lake',
    mood: '✨ peaceful',
    media: [
      {
        id: 'm-2-1',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        type: 'image',
        aspectRatio: 'square',
        fileSize: 3100000,
        fileName: 'sunset_lake_walk.jpg',
        isArchived: false
      }
    ],
    isLiked: true,
    isBookmarked: true,
    isArchived: false,
    tags: ['sunset', 'peace', 'nature'],
    collections: ['Travel', 'Little Joys'],
    personalNotes: [
      {
        id: 'n-2',
        text: 'Listened to my favorite indie playlist on loop here.',
        createdAt: '5 days ago'
      }
    ],
    createdAt: new Date(now.getTime() - 5 * 86400000).toISOString()
  },
  {
    id: 'post-3',
    caption: 'Tried the new matcha cloud latte and a warm croissant. Cozy autumn vibes are finally here 🥐🍵',
    date: daysAgo(12),
    location: 'Paper & Co. Café',
    mood: '☕ cozy',
    media: [
      {
        id: 'm-3-1',
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
        type: 'image',
        aspectRatio: 'portrait',
        fileSize: 2200000,
        fileName: 'matcha_croissant.jpg',
        isArchived: false
      },
      {
        id: 'm-3-2',
        url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80',
        type: 'image',
        aspectRatio: 'portrait',
        fileSize: 2750000,
        fileName: 'cafe_aesthetic.jpg',
        isArchived: false
      }
    ],
    isLiked: false,
    isBookmarked: true,
    isArchived: false,
    tags: ['cafe', 'matcha', 'cozy'],
    collections: ['Cafés', 'Little Joys'],
    personalNotes: [],
    createdAt: new Date(now.getTime() - 12 * 86400000).toISOString()
  },
  {
    id: 'post-4',
    caption: 'Road trip to the misty hills! Windows down, cold breeze, and endless green valleys. Best weekend escape ever 🌲🚗⛰️',
    date: daysAgo(35),
    location: 'Coorg Hills Viewpoint',
    mood: '🌸 joyful',
    media: [
      {
        id: 'm-4-1',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        type: 'image',
        aspectRatio: 'square',
        fileSize: 4200000,
        fileName: 'misty_hills_peak.jpg',
        isArchived: false
      }
    ],
    isLiked: true,
    isBookmarked: false,
    isArchived: false,
    tags: ['roadtrip', 'mountains', 'escape'],
    collections: ['Travel'],
    personalNotes: [],
    createdAt: new Date(now.getTime() - 35 * 86400000).toISOString()
  },
  // Memories older than 90 days to test the 90-day Smart Archive feature!
  {
    id: 'post-5',
    caption: 'Semester exams are officially over! First summer beach trip with the besties. Salt water heals everything 🌊🐚',
    date: daysAgo(98),
    location: 'Pondicherry Promenade',
    mood: '🌸 joyful',
    media: [
      {
        id: 'm-5-1',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        type: 'image',
        aspectRatio: 'square',
        fileSize: 3400000,
        fileName: 'pondy_beach_sunset.jpg',
        isArchived: true,
        archiveBundle: 'Summer_Archive.zip'
      }
    ],
    isLiked: true,
    isBookmarked: true,
    isArchived: true,
    tags: ['pondicherry', 'beach', 'summer', 'college'],
    collections: ['College', 'Travel'],
    personalNotes: [
      {
        id: 'n-5',
        text: 'We ate so much French gelato on the promenade road.',
        createdAt: '3 months ago'
      }
    ],
    createdAt: new Date(now.getTime() - 98 * 86400000).toISOString()
  },
  {
    id: 'post-6',
    caption: 'Monsoon evening by my bedroom window. Raindrops, warm blanket, and reading a thriller novel. Total bliss 🌧️📖',
    date: daysAgo(125),
    location: 'Home Sweet Home',
    mood: '☕ cozy',
    media: [
      {
        id: 'm-6-1',
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
        type: 'image',
        aspectRatio: 'portrait',
        fileSize: 3800000,
        fileName: 'monsoon_rain_window.jpg',
        isArchived: true,
        archiveBundle: 'July_Archive.zip'
      }
    ],
    isLiked: false,
    isBookmarked: false,
    isArchived: true,
    tags: ['monsoon', 'rain', 'reading', 'cozy'],
    collections: ['Little Joys'],
    personalNotes: [],
    createdAt: new Date(now.getTime() - 125 * 86400000).toISOString()
  }
];

export const initialStories: Story[] = [
  {
    id: 'story-1',
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    caption: 'Today: Coffee running through my veins ☕',
    createdAt: '2h ago',
    seen: false,
    user: {
      name: 'Today',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 'story-2',
    mediaUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    caption: 'Study session that turned into a laughter marathon 😭',
    createdAt: '6h ago',
    seen: false,
    user: {
      name: 'College',
      avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 'story-3',
    mediaUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    caption: 'Sky looked like a cotton candy painting tonight',
    createdAt: '1d ago',
    seen: true,
    user: {
      name: 'Sky & Joy',
      avatar: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 'story-4',
    mediaUrl: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    caption: 'Wildflowers by the campus walkway 🌼',
    createdAt: '2d ago',
    seen: true,
    user: {
      name: 'Little Things',
      avatar: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=300&q=80'
    }
  }
];

export const initialHighlights: Highlight[] = [
  {
    id: 'hl-1',
    title: 'College 🎓',
    coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
    stories: []
  },
  {
    id: 'hl-2',
    title: 'Travel ✈️',
    coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
    stories: []
  },
  {
    id: 'hl-3',
    title: 'Cafés ☕',
    coverUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
    stories: []
  },
  {
    id: 'hl-4',
    title: 'Little Joys 🌸',
    coverUrl: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=400&q=80',
    stories: []
  }
];

export const initialArchiveBundles: ArchiveBundle[] = [
  {
    monthYear: 'Summer 2026',
    fileName: 'Summer_Archive.zip',
    itemCount: 1,
    totalBytes: 3400000,
    createdAt: '2026-08-01',
    postIds: ['post-5'],
    status: 'archived'
  },
  {
    monthYear: 'July 2026',
    fileName: 'July_Archive.zip',
    itemCount: 1,
    totalBytes: 3800000,
    createdAt: '2026-07-01',
    postIds: ['post-6'],
    status: 'archived'
  }
];
