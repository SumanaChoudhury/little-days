import JSZip from 'jszip';
import {
  MemoryPost,
  Story,
  Highlight,
  UserProfile,
  ArchiveBundle,
  ReflectionNote,
  JournalEntry,
  MoodEntry,
  TimeCapsule,
  FutureLetter,
  Moodboard
} from '../types';

const STORAGE_KEYS = {
  MEMORIES: 'insta_fresh_memories',
  STORIES: 'insta_fresh_stories',
  HIGHLIGHTS: 'insta_fresh_highlights',
  PROFILE: 'insta_fresh_profile',
  ARCHIVES: 'insta_fresh_archives',
  JOURNALS: 'insta_fresh_journals',
  MOODS: 'insta_fresh_moods',
  TIME_CAPSULES: 'insta_fresh_capsules',
  FUTURE_LETTERS: 'insta_fresh_letters',
  MOODBOARDS: 'insta_fresh_moodboards'
};

export function isOlderThan90Days(dateStr: string): boolean {
  try {
    const postDate = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 90;
  } catch {
    return false;
  }
}

export function formatMemoryDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

class MemoryStorageService {
  // --- Profile ---
  getProfile(defaultUsername = ''): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
      return {
        username: defaultUsername,
        fullName: defaultUsername,
        bio: '',
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${defaultUsername || 'user'}`
      };
    } catch {
      return {
        username: defaultUsername,
        fullName: defaultUsername,
        bio: '',
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${defaultUsername || 'user'}`
      };
    }
  }

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  // --- Memories (Clean Slate: [] by default) ---
  getMemories(): MemoryPost[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveMemories(memories: MemoryPost[]): void {
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
  }

  addMemory(memory: MemoryPost): MemoryPost[] {
    const current = this.getMemories();
    const updated = [memory, ...current];
    this.saveMemories(updated);
    return updated;
  }

  updateMemory(id: string, updates: Partial<MemoryPost>): MemoryPost[] {
    const current = this.getMemories();
    const updated = current.map(m => (m.id === id ? { ...m, ...updates } : m));
    this.saveMemories(updated);
    return updated;
  }

  deleteMemory(id: string): MemoryPost[] {
    const current = this.getMemories();
    const updated = current.filter(m => m.id !== id);
    this.saveMemories(updated);
    return updated;
  }

  toggleLike(id: string): MemoryPost[] {
    const current = this.getMemories();
    const updated = current.map(m => (m.id === id ? { ...m, isLiked: !m.isLiked } : m));
    this.saveMemories(updated);
    return updated;
  }

  toggleBookmark(id: string): MemoryPost[] {
    const current = this.getMemories();
    const updated = current.map(m => (m.id === id ? { ...m, isBookmarked: !m.isBookmarked } : m));
    this.saveMemories(updated);
    return updated;
  }

  addReflectionNote(postId: string, text: string): MemoryPost[] {
    const current = this.getMemories();
    const note: ReflectionNote = {
      id: 'note-' + Date.now(),
      text,
      createdAt: 'Just now'
    };
    const updated = current.map(m => {
      if (m.id === postId) {
        return {
          ...m,
          personalNotes: [...(m.personalNotes || []), note]
        };
      }
      return m;
    });
    this.saveMemories(updated);
    return updated;
  }

  // --- Stories ---
  getStories(): Story[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STORIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveStories(stories: Story[]): void {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
  }

  addStory(story: Story): Story[] {
    const current = this.getStories();
    const updated = [story, ...current];
    this.saveStories(updated);
    return updated;
  }

  markStorySeen(id: string): Story[] {
    const current = this.getStories();
    const updated = current.map(s => (s.id === id ? { ...s, seen: true } : s));
    this.saveStories(updated);
    return updated;
  }

  // --- Highlights ---
  getHighlights(): Highlight[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveHighlights(highlights: Highlight[]): void {
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
  }

  // --- PRD 3.3: Personal Diary / Journals ---
  getJournals(): JournalEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOURNALS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveJournals(journals: JournalEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
  }

  addJournal(journal: JournalEntry): JournalEntry[] {
    const current = this.getJournals();
    const updated = [journal, ...current];
    this.saveJournals(updated);
    return updated;
  }

  deleteJournal(id: string): JournalEntry[] {
    const current = this.getJournals();
    const updated = current.filter(j => j.id !== id);
    this.saveJournals(updated);
    return updated;
  }

  // --- PRD 3.4: Mood Tracking ---
  getMoods(): MoodEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOODS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveMoods(moods: MoodEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moods));
  }

  recordMood(entry: MoodEntry): MoodEntry[] {
    const current = this.getMoods();
    const filtered = current.filter(m => m.date !== entry.date);
    const updated = [entry, ...filtered];
    this.saveMoods(updated);
    return updated;
  }

  // --- PRD 3.8: Time Capsules ---
  getTimeCapsules(): TimeCapsule[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TIME_CAPSULES);
      const list: TimeCapsule[] = data ? JSON.parse(data) : [];
      const today = new Date().toISOString().split('T')[0];
      // Evaluate lock status based on unlock date
      return list.map(c => ({
        ...c,
        isLocked: c.unlockDate > today
      }));
    } catch {
      return [];
    }
  }

  saveTimeCapsules(capsules: TimeCapsule[]): void {
    localStorage.setItem(STORAGE_KEYS.TIME_CAPSULES, JSON.stringify(capsules));
  }

  addTimeCapsule(capsule: TimeCapsule): TimeCapsule[] {
    const current = this.getTimeCapsules();
    const updated = [capsule, ...current];
    this.saveTimeCapsules(updated);
    return updated;
  }

  // --- PRD 3.8: Letters to Future Me ---
  getFutureLetters(): FutureLetter[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FUTURE_LETTERS);
      const list: FutureLetter[] = data ? JSON.parse(data) : [];
      const today = new Date().toISOString().split('T')[0];
      return list.map(l => ({
        ...l,
        isDelivered: l.deliveryDate <= today
      }));
    } catch {
      return [];
    }
  }

  saveFutureLetters(letters: FutureLetter[]): void {
    localStorage.setItem(STORAGE_KEYS.FUTURE_LETTERS, JSON.stringify(letters));
  }

  addFutureLetter(letter: FutureLetter): FutureLetter[] {
    const current = this.getFutureLetters();
    const updated = [letter, ...current];
    this.saveFutureLetters(updated);
    return updated;
  }

  // --- PRD 3.6: Moodboards ---
  getMoodboards(): Moodboard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOODBOARDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveMoodboards(boards: Moodboard[]): void {
    localStorage.setItem(STORAGE_KEYS.MOODBOARDS, JSON.stringify(boards));
  }

  addMoodboard(board: Moodboard): Moodboard[] {
    const current = this.getMoodboards();
    const updated = [board, ...current];
    this.saveMoodboards(updated);
    return updated;
  }

  // --- PRD 4.2: Duplicate Photo Detection ---
  findDuplicatePhotos(): { fileA: string; fileB: string; memoryIdA: string; memoryIdB: string }[] {
    const memories = this.getMemories();
    const duplicates: { fileA: string; fileB: string; memoryIdA: string; memoryIdB: string }[] = [];
    const seen = new Map<string, { memId: string; url: string }>();

    memories.forEach(m => {
      m.media.forEach(item => {
        // Simple hash by size or url prefix
        const key = `${item.fileSize}_${item.fileName || 'unknown'}`;
        if (item.fileSize && seen.has(key)) {
          const prev = seen.get(key)!;
          duplicates.push({
            fileA: prev.url,
            fileB: item.url,
            memoryIdA: prev.memId,
            memoryIdB: m.id
          });
        } else if (item.fileSize) {
          seen.set(key, { memId: m.id, url: item.url });
        }
      });
    });

    return duplicates;
  }

  // --- PRD 3.9: Archives ---
  getArchiveBundles(): ArchiveBundle[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ARCHIVES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveArchiveBundles(bundles: ArchiveBundle[]): void {
    localStorage.setItem(STORAGE_KEYS.ARCHIVES, JSON.stringify(bundles));
  }

  getStorageStats() {
    const memories = this.getMemories();
    let hotBytes = 0;
    let coldBytes = 0;
    let hotCount = 0;
    let coldCount = 0;

    memories.forEach(m => {
      const isArchived = m.isArchived || isOlderThan90Days(m.date);
      const postBytes = m.media.reduce((acc, item) => acc + (item.fileSize || 2000000), 0);
      if (isArchived) {
        coldBytes += postBytes;
        coldCount++;
      } else {
        hotBytes += postBytes;
        hotCount++;
      }
    });

    return {
      hotCount,
      coldCount,
      hotBytes,
      coldBytes,
      totalBytes: hotBytes + coldBytes,
      totalMemories: memories.length
    };
  }

  async createMonthlyArchive(monthYear: string, memoriesToArchive: MemoryPost[]): Promise<Blob> {
    const zip = new JSZip();
    const manifest = {
      archiveName: `${monthYear.replace(/\s+/g, '_')}_Archive.zip`,
      generatedAt: new Date().toISOString(),
      retentionPolicy: '90-day smart cold storage',
      itemCount: memoriesToArchive.length,
      memories: memoriesToArchive.map(m => ({
        id: m.id,
        caption: m.caption,
        date: m.date,
        location: m.location,
        mood: m.mood,
        tags: m.tags,
        collections: m.collections,
        personalNotes: m.personalNotes,
        mediaFiles: m.media.map(media => ({
          fileName: media.fileName || `${media.id}.jpg`,
          type: media.type,
          originalUrl: media.url.startsWith('data:') ? 'base64_embedded' : media.url
        }))
      }))
    };

    zip.file('manifest.json', JSON.stringify(manifest, null, 2));
    const mediaFolder = zip.folder('media');

    for (let i = 0; i < memoriesToArchive.length; i++) {
      const m = memoriesToArchive[i];
      for (let j = 0; j < m.media.length; j++) {
        const item = m.media[j];
        const filename = item.fileName || `memory_${m.id}_item_${j + 1}.jpg`;

        if (item.url.startsWith('data:')) {
          const base64Data = item.url.split(',')[1];
          mediaFolder?.file(filename, base64Data, { base64: true });
        } else {
          try {
            const resp = await fetch(item.url, { mode: 'cors' });
            if (resp.ok) {
              const blob = await resp.blob();
              mediaFolder?.file(filename, blob);
            } else {
              mediaFolder?.file(`${filename}.url.txt`, item.url);
            }
          } catch {
            mediaFolder?.file(`${filename}.url.txt`, item.url);
          }
        }
      }
    }

    return await zip.generateAsync({ type: 'blob' });
  }

  async run90DayArchiving(onProgress?: (status: string) => void): Promise<{
    archivedCount: number;
    bundle: ArchiveBundle;
  }> {
    if (onProgress) onProgress('Scanning memories older than 90 days...');
    const memories = this.getMemories();
    const olderMemories = memories.filter(m => isOlderThan90Days(m.date) && !m.isArchived);

    if (olderMemories.length === 0) {
      throw new Error('No unarchived memories older than 90 days found.');
    }

    const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const bundleName = `${currentMonthYear.replace(/\s+/g, '_')}_Archive.zip`;

    if (onProgress) onProgress(`Generating ZIP archive for ${olderMemories.length} memories...`);
    const zipBlob = await this.createMonthlyArchive(currentMonthYear, olderMemories);

    const bundle: ArchiveBundle = {
      monthYear: currentMonthYear,
      fileName: bundleName,
      itemCount: olderMemories.length,
      totalBytes: zipBlob.size,
      createdAt: new Date().toISOString().split('T')[0],
      postIds: olderMemories.map(m => m.id),
      status: 'archived'
    };

    const updatedMemories = memories.map(m => {
      if (olderMemories.some(old => old.id === m.id)) {
        return {
          ...m,
          isArchived: true,
          media: m.media.map(med => ({
            ...med,
            isArchived: true,
            archiveBundle: bundleName
          }))
        };
      }
      return m;
    });

    this.saveMemories(updatedMemories);

    const currentBundles = this.getArchiveBundles();
    this.saveArchiveBundles([bundle, ...currentBundles]);

    this.triggerDownload(zipBlob, bundleName);

    return {
      archivedCount: olderMemories.length,
      bundle
    };
  }

  triggerDownload(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  restoreMemory(id: string): MemoryPost[] {
    const current = this.getMemories();
    const updated = current.map(m => {
      if (m.id === id) {
        return {
          ...m,
          isArchived: false,
          media: m.media.map(med => ({ ...med, isArchived: false }))
        };
      }
      return m;
    });
    this.saveMemories(updated);
    return updated;
  }
}

export const memoryStorage = new MemoryStorageService();
