import React, { useState, useEffect } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { MobileTopBar } from './components/MobileTopBar';
import { MobileBottomBar } from './components/MobileBottomBar';
import { FeedView } from './components/FeedView';
import { ExploreView } from './components/ExploreView';
import { ReelsView } from './components/ReelsView';
import { DirectMessages } from './components/DirectMessages';
import { ProfileView } from './components/ProfileView';
import { DiaryView } from './components/DiaryView';
import { DiscoveryView } from './components/DiscoveryView';
import { MoodboardView } from './components/MoodboardView';
import { ArchiveManagerView } from './components/ArchiveManagerView';
import { CreateModal } from './components/CreateModal';
import { CameraModal } from './components/CameraModal';
import { StoryViewer } from './components/StoryViewer';
import { HighlightModal } from './components/HighlightModal';
import { PostDetailModal } from './components/PostDetailModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthScreen } from './components/AuthScreen';
import { MemoryPost, Story, Highlight, UserProfile, ArchiveBundle, JournalEntry, MoodEntry } from './types';
import { memoryStorage } from './lib/storage';
import { authService, UserAccount } from './lib/auth';

export const App: React.FC = () => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => authService.getCurrentUser());

  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Core Data
  const [memories, setMemories] = useState<MemoryPost[]>(() => memoryStorage.getMemories());
  const [stories, setStories] = useState<Story[]>(() => memoryStorage.getStories());
  const [highlights, setHighlights] = useState<Highlight[]>(() => memoryStorage.getHighlights());
  const [archiveBundles, setArchiveBundles] = useState<ArchiveBundle[]>(() => memoryStorage.getArchiveBundles());
  const [journals, setJournals] = useState<JournalEntry[]>(() => memoryStorage.getJournals());

  // Modals
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPostDetail, setSelectedPostDetail] = useState<MemoryPost | null>(null);
  const [storyForHighlight, setStoryForHighlight] = useState<Story | null>(null);

  // Sync dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Auth Handlers
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setMemories(memoryStorage.getMemories());
    setStories(memoryStorage.getStories());
    setHighlights(memoryStorage.getHighlights());
    setJournals(memoryStorage.getJournals());
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsSettingsOpen(false);
  };

  const handleDeleteAccount = () => {
    authService.deleteAccount();
    setCurrentUser(null);
    setIsSettingsOpen(false);
    setMemories([]);
    setStories([]);
    setHighlights([]);
    setJournals([]);
    alert('Your account and all data have been completely deleted.');
  };

  // Memory Handlers
  const handleToggleLike = (id: string) => {
    const updated = memoryStorage.toggleLike(id);
    setMemories(updated);
    if (selectedPostDetail && selectedPostDetail.id === id) {
      setSelectedPostDetail(updated.find(m => m.id === id) || null);
    }
  };

  const handleToggleBookmark = (id: string) => {
    const updated = memoryStorage.toggleBookmark(id);
    setMemories(updated);
    if (selectedPostDetail && selectedPostDetail.id === id) {
      setSelectedPostDetail(updated.find(m => m.id === id) || null);
    }
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Delete this memory?')) {
      const updated = memoryStorage.deleteMemory(id);
      setMemories(updated);
      if (selectedPostDetail && selectedPostDetail.id === id) {
        setSelectedPostDetail(null);
      }
    }
  };

  const handleRestoreMemory = (id: string) => {
    const updated = memoryStorage.restoreMemory(id);
    setMemories(updated);
    alert('Restored memory to active hot storage!');
  };

  const handleAddNote = (postId: string, text: string) => {
    const updated = memoryStorage.addReflectionNote(postId, text);
    setMemories(updated);
    if (selectedPostDetail && selectedPostDetail.id === postId) {
      setSelectedPostDetail(updated.find(m => m.id === postId) || null);
    }
  };

  const handleAddMemory = (newMemory: MemoryPost) => {
    const updated = memoryStorage.addMemory(newMemory);
    setMemories(updated);
    setActiveTab('feed');
  };

  const handleAddStory = (newStory: Story) => {
    const updated = memoryStorage.addStory(newStory);
    setStories(updated);
  };

  const handleStorySeen = (id: string) => {
    const updated = memoryStorage.markStorySeen(id);
    setStories(updated);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    if (currentUser) {
      const updatedUser: UserAccount = { ...currentUser, ...updated };
      authService.saveUserToRegistry(updatedUser);
      authService.setCurrentUser(updatedUser);
      setCurrentUser(updatedUser);
    }
    memoryStorage.saveProfile(updated);
  };

  const handleSaveHighlights = (updatedHighlights: Highlight[]) => {
    memoryStorage.saveHighlights(updatedHighlights);
    setHighlights(updatedHighlights);
  };

  // Journal Handlers (PRD 3.3)
  const handleAddJournal = (entry: JournalEntry) => {
    const updated = memoryStorage.addJournal(entry);
    setJournals(updated);
  };

  const handleDeleteJournal = (id: string) => {
    const updated = memoryStorage.deleteJournal(id);
    setJournals(updated);
  };

  const handleRecordMood = (entry: MoodEntry) => {
    memoryStorage.recordMood(entry);
  };

  // Camera Capture ("CLICK PICS")
  const handlePhotoCaptured = (dataUrl: string, target: 'feed' | 'story') => {
    if (!currentUser) return;

    if (target === 'story') {
      const story: Story = {
        id: `story-${Date.now()}`,
        mediaUrl: dataUrl,
        mediaType: 'image',
        caption: 'Clicked pic 📸',
        createdAt: 'Just now',
        seen: false,
        user: {
          name: currentUser.username,
          avatar: currentUser.avatarUrl
        }
      };
      handleAddStory(story);
      alert('Photo posted to your Story!');
    } else {
      const memory: MemoryPost = {
        id: `post-${Date.now()}`,
        caption: 'Live snapshot 📸',
        date: new Date().toISOString().split('T')[0],
        mood: '✨ peaceful',
        media: [
          {
            id: `media-cam-${Date.now()}`,
            url: dataUrl,
            type: 'image',
            aspectRatio: 'square',
            fileName: 'camera_capture.jpg',
            fileSize: 1800000,
            isArchived: false
          }
        ],
        isLiked: false,
        isBookmarked: false,
        isArchived: false,
        tags: ['camera', 'liveCapture'],
        collections: ['Personal Vault'],
        personalNotes: [],
        createdAt: new Date().toISOString()
      };
      handleAddMemory(memory);
      alert('Photo shared to your Feed!');
    }
  };

  const refreshArchives = () => {
    setMemories(memoryStorage.getMemories());
    setArchiveBundles(memoryStorage.getArchiveBundles());
  };

  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#262626] dark:text-[#f5f5f5] flex flex-col md:flex-row antialiased selection:bg-pink-500 selection:text-white">
      {/* Desktop Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCreateModal={() => setIsCreateOpen(true)}
        openCameraModal={() => setIsCameraOpen(true)}
        openSettingsModal={() => setIsSettingsOpen(true)}
        profile={currentUser}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(d => !d)}
      />

      {/* Mobile Top Header */}
      <MobileTopBar
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenDirect={() => setActiveTab('direct')}
        onOpenCamera={() => setIsCameraOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(d => !d)}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[72px] xl:ml-[244px] min-h-screen overflow-y-auto pb-14 md:pb-0">
        {activeTab === 'feed' && (
          <FeedView
            memories={memories}
            stories={stories}
            profile={currentUser}
            archiveBundles={archiveBundles}
            onSelectStory={(_, idx) => setSelectedStoryIndex(idx)}
            onAddStory={() => setIsCreateOpen(true)}
            onToggleLike={handleToggleLike}
            onToggleBookmark={handleToggleBookmark}
            onDeletePost={handleDeletePost}
            onRestoreMemory={handleRestoreMemory}
            onAddNote={handleAddNote}
            onOpenArchiveVault={() => setActiveTab('archive')}
            onOpenCamera={() => setIsCameraOpen(true)}
          />
        )}

        {activeTab === 'search' && (
          <ExploreView
            memories={memories}
            onSelectPost={post => setSelectedPostDetail(post)}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            memories={memories}
            onSelectPost={post => setSelectedPostDetail(post)}
          />
        )}

        {activeTab === 'diary' && (
          <DiaryView
            journals={journals}
            onAddJournal={handleAddJournal}
            onDeleteJournal={handleDeleteJournal}
            onRecordMood={handleRecordMood}
            profile={currentUser}
          />
        )}

        {activeTab === 'discovery' && (
          <DiscoveryView
            memories={memories}
            profile={currentUser}
            onSelectPost={post => setSelectedPostDetail(post)}
          />
        )}

        {activeTab === 'moodboards' && (
          <MoodboardView memories={memories} />
        )}

        {activeTab === 'reels' && (
          <ReelsView
            profile={currentUser}
            memories={memories}
            onOpenCreate={() => setIsCreateOpen(true)}
          />
        )}

        {activeTab === 'direct' && (
          <DirectMessages profile={currentUser} />
        )}

        {activeTab === 'archive' && (
          <ArchiveManagerView
            memories={memories}
            bundles={archiveBundles}
            onRefresh={refreshArchives}
            onRestoreMemory={handleRestoreMemory}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={currentUser}
            memories={memories}
            highlights={highlights}
            onUpdateProfile={handleUpdateProfile}
            onSelectPost={post => setSelectedPostDetail(post)}
            onOpenStory={story => {
              const idx = stories.findIndex(s => s.id === story.id);
              setSelectedStoryIndex(idx >= 0 ? idx : 0);
            }}
            onOpenArchiveVault={() => setActiveTab('archive')}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCreateModal={() => setIsCreateOpen(true)}
        profile={currentUser}
      />

      {/* Modals & Overlays */}
      <CreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddMemory={handleAddMemory}
        onAddStory={handleAddStory}
        onOpenCamera={() => setIsCameraOpen(true)}
        profile={currentUser}
      />

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={handlePhotoCaptured}
        profile={currentUser}
      />

      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
          onStorySeen={handleStorySeen}
          onAddToHighlight={story => {
            setStoryForHighlight(story);
            setSelectedStoryIndex(null);
          }}
        />
      )}

      <HighlightModal
        isOpen={storyForHighlight !== null}
        onClose={() => setStoryForHighlight(null)}
        story={storyForHighlight}
        highlights={highlights}
        onSaveHighlight={handleSaveHighlights}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />

      <PostDetailModal
        post={selectedPostDetail}
        profile={currentUser}
        onClose={() => setSelectedPostDetail(null)}
        onToggleLike={handleToggleLike}
        onToggleBookmark={handleToggleBookmark}
        onDeletePost={handleDeletePost}
        onRestoreMemory={handleRestoreMemory}
        onAddNote={handleAddNote}
      />
    </div>
  );
};

export default App;
