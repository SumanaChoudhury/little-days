import React, { useState } from 'react';
import {
  Shuffle,
  Play,
  Lock,
  Mail,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Check,
  Plus,
  Sparkles,
  Camera,
  Layers,
  FileText,
  Images
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MemoryPost, TimeCapsule, FutureLetter, UserProfile } from '../types';
import { memoryStorage, formatMemoryDate } from '../lib/storage';

interface DiscoveryViewProps {
  memories: MemoryPost[];
  profile: UserProfile;
  onSelectPost: (post: MemoryPost) => void;
  onNavigateFeed?: () => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  memories,
  profile,
  onSelectPost,
  onNavigateFeed
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'onThisDay' | 'capsules' | 'letters' | 'photobook' | 'duplicates'>('onThisDay');

  // Time capsules & letters from storage
  const [capsules, setCapsules] = useState<TimeCapsule[]>(() => memoryStorage.getTimeCapsules());
  const [letters, setLetters] = useState<FutureLetter[]>(() => memoryStorage.getFutureLetters());

  // Form states
  const [isCreatingCapsule, setIsCreatingCapsule] = useState(false);
  const [capsuleTitle, setCapsuleTitle] = useState('');
  const [capsuleDesc, setCapsuleDesc] = useState('');
  const [capsuleDate, setCapsuleDate] = useState('2027-01-01');

  const [isCreatingLetter, setIsCreatingLetter] = useState(false);
  const [letterTitle, setLetterTitle] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [letterDelivery, setLetterDelivery] = useState('2027-01-01');

  // Slideshow Rewind state
  const [isRewindPlaying, setIsRewindPlaying] = useState(false);
  const [rewindIndex, setRewindIndex] = useState(0);

  // Filter memories for "On This Day"
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const currentYear = today.getFullYear();

  const onThisDayMemories = memories.filter(m => {
    try {
      const d = new Date(m.date);
      return (
        d.getMonth() === currentMonth &&
        d.getDate() === currentDay &&
        d.getFullYear() < currentYear
      );
    } catch {
      return false;
    }
  });

  // Random memory picker
  const handleRandomMemory = () => {
    if (memories.length === 0) {
      alert('Upload memories to rediscover moments at random.');
      return;
    }
    confetti({ particleCount: 40, spread: 50 });
    const randomIndex = Math.floor(Math.random() * memories.length);
    onSelectPost(memories[randomIndex]);
  };

  // Create Capsule
  const handleSaveCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capsuleTitle.trim()) return;

    const newCapsule: TimeCapsule = {
      id: `capsule-${Date.now()}`,
      title: capsuleTitle.trim(),
      description: capsuleDesc.trim(),
      mediaUrls: memories.slice(0, 3).flatMap(m => m.media.map(med => med.url)),
      unlockDate: capsuleDate,
      isLocked: true,
      createdAt: new Date().toISOString()
    };

    const updated = memoryStorage.addTimeCapsule(newCapsule);
    setCapsules(updated);
    setIsCreatingCapsule(false);
    setCapsuleTitle('');
    setCapsuleDesc('');
    confetti({ particleCount: 30 });
  };

  // Create Letter
  const handleSaveLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterTitle.trim() || !letterContent.trim()) return;

    const newLetter: FutureLetter = {
      id: `letter-${Date.now()}`,
      title: letterTitle.trim(),
      content: letterContent.trim(),
      deliveryDate: letterDelivery,
      isDelivered: false,
      createdAt: new Date().toISOString()
    };

    const updated = memoryStorage.addFutureLetter(newLetter);
    setLetters(updated);
    setIsCreatingLetter(false);
    setLetterTitle('');
    setLetterContent('');
    confetti({ particleCount: 30 });
  };

  const duplicates = memoryStorage.findDuplicatePhotos();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-6 select-none animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#dbdbdb] dark:border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-black dark:text-white">
              Memories & Archive
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>Only You</span>
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Chronological rewind, locked capsules, and letters to your future self.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleRandomMemory}
            className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg border border-[#dbdbdb] dark:border-[#363636] hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-neutral-500" />
            <span>Random Memory</span>
          </button>

          <button
            onClick={() => {
              if (memories.length === 0) {
                alert('Add memories first to watch a Memory Rewind slideshow.');
                return;
              }
              setIsRewindPlaying(true);
              setRewindIndex(0);
            }}
            className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Memory Rewind</span>
          </button>
        </div>
      </div>

      {/* Segmented Tabs (Instagram Style) */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-[#dbdbdb] dark:border-[#262626] mb-6 text-xs">
        <button
          onClick={() => setActiveSubTab('onThisDay')}
          className={`py-2.5 font-semibold transition-all relative flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'onThisDay'
              ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
              : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>On This Day</span>
        </button>

        <button
          onClick={() => setActiveSubTab('capsules')}
          className={`py-2.5 font-semibold transition-all relative flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'capsules'
              ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
              : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Time Capsules ({capsules.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('letters')}
          className={`py-2.5 font-semibold transition-all relative flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'letters'
              ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
              : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Letters to Future Self ({letters.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('photobook')}
          className={`py-2.5 font-semibold transition-all relative flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'photobook'
              ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
              : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Digital Photo Book</span>
        </button>

        <button
          onClick={() => setActiveSubTab('duplicates')}
          className={`py-2.5 font-semibold transition-all relative flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'duplicates'
              ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
              : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          <Images className="w-4 h-4" />
          <span>Duplicate Scanner ({duplicates.length})</span>
        </button>
      </div>

      {/* Tab 1: On This Day */}
      {activeSubTab === 'onThisDay' && (
        <div className="space-y-4">
          {onThisDayMemories.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Past Memories on {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  {onThisDayMemories.length} {onThisDayMemories.length === 1 ? 'memory' : 'memories'} found
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {onThisDayMemories.map(m => (
                  <div
                    key={m.id}
                    onClick={() => onSelectPost(m)}
                    className="group cursor-pointer rounded-xl border border-[#dbdbdb] dark:border-[#262626] overflow-hidden bg-white dark:bg-black transition-all hover:shadow-md"
                  >
                    <div className="aspect-square relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                      {m.media.length > 0 && (
                        <img
                          src={m.media[0].url}
                          alt={m.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-semibold">
                        {formatMemoryDate(m.date)}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-black dark:text-white line-clamp-2 leading-relaxed">
                        {m.caption || 'No caption'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center border border-[#dbdbdb] dark:border-[#262626] rounded-2xl bg-white dark:bg-black p-8 space-y-3">
              <div className="w-14 h-14 rounded-full border-2 border-neutral-200 dark:border-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                <Calendar className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white">
                  No Past Memories on This Day
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  Memories you document today ({today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}) will automatically appear here next year to look back on.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleRandomMemory}
                  className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-black dark:text-white transition-colors"
                >
                  Rediscover a Random Past Memory
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Time Capsules */}
      {activeSubTab === 'capsules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">Time Capsules</h3>
              <p className="text-xs text-neutral-500">
                Seal photos and notes that unlock on a specified future date.
              </p>
            </div>
            <button
              onClick={() => setIsCreatingCapsule(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Capsule</span>
            </button>
          </div>

          {capsules.length === 0 ? (
            <div className="py-16 text-center border border-[#dbdbdb] dark:border-[#262626] rounded-2xl bg-white dark:bg-black p-8 space-y-3">
              <div className="w-14 h-14 rounded-full border-2 border-neutral-200 dark:border-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                <Lock className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white">No Time Capsules Yet</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  Lock special memories away today to reopen next year, on graduation day, or a special milestone.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingCapsule(true)}
                className="mt-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-black dark:text-white transition-colors"
              >
                Seal Your First Capsule
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {capsules.map(c => {
                const isUnlocked = new Date(c.unlockDate) <= new Date();
                return (
                  <div
                    key={c.id}
                    className="rounded-xl border border-[#dbdbdb] dark:border-[#262626] p-4 bg-white dark:bg-black space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-black dark:text-white truncate">
                        {c.title}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isUnlocked
                            ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {isUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                    {c.description && (
                      <p className="text-xs text-neutral-500 line-clamp-2">{c.description}</p>
                    )}
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Unlocks:</span>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                        {c.unlockDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Letters to Future Self */}
      {activeSubTab === 'letters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">Letters to Future Me</h3>
              <p className="text-xs text-neutral-500">
                Write private reflections scheduled to unlock in the future.
              </p>
            </div>
            <button
              onClick={() => setIsCreatingLetter(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Write Letter</span>
            </button>
          </div>

          {letters.length === 0 ? (
            <div className="py-16 text-center border border-[#dbdbdb] dark:border-[#262626] rounded-2xl bg-white dark:bg-black p-8 space-y-3">
              <div className="w-14 h-14 rounded-full border-2 border-neutral-200 dark:border-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                <Mail className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white">No Letters Written Yet</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  Write a letter to yourself about your current dreams, hopes, and feelings to be read on a future date.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingLetter(true)}
                className="mt-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-black dark:text-white transition-colors"
              >
                Write Your First Letter
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {letters.map(l => {
                const isDelivered = new Date(l.deliveryDate) <= new Date();
                return (
                  <div
                    key={l.id}
                    className="p-4 rounded-xl border border-[#dbdbdb] dark:border-[#262626] bg-white dark:bg-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-black dark:text-white">{l.title}</h4>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isDelivered
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {isDelivered ? 'Delivered' : `Sealed until ${l.deliveryDate}`}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                        {isDelivered ? l.content : 'This letter remains sealed until its scheduled date.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Digital Photo Book */}
      {activeSubTab === 'photobook' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">Printable Digital Photo Book</h3>
              <p className="text-xs text-neutral-500">
                Curate selected memories into a clean, printable photo catalog.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg border border-[#dbdbdb] dark:border-[#363636] hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-semibold flex items-center gap-1.5 transition-colors text-black dark:text-white"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl border border-[#dbdbdb] dark:border-[#262626] bg-white dark:bg-black space-y-4">
            <div className="text-center pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-lg font-bold text-black dark:text-white">{profile.fullName || profile.username}'s Memory Book</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Curated Life Moments • Private Volume</p>
            </div>

            {memories.length === 0 ? (
              <div className="py-10 text-center text-xs text-neutral-400">
                No memories available to compile into a book yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {memories.slice(0, 12).map(m => (
                  <div key={m.id} className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 aspect-square relative">
                    {m.media.length > 0 && (
                      <img src={m.media[0].url} alt="" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 text-[9px] text-white truncate">
                      {formatMemoryDate(m.date)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Duplicate Scanner */}
      {activeSubTab === 'duplicates' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-black dark:text-white">Duplicate Photo Scanner</h3>
            <p className="text-xs text-neutral-500">
              Scans media items to detect identical checksums or filenames to optimize storage.
            </p>
          </div>

          {duplicates.length === 0 ? (
            <div className="py-16 text-center border border-[#dbdbdb] dark:border-[#262626] rounded-2xl bg-white dark:bg-black p-8 space-y-3">
              <div className="w-14 h-14 rounded-full border-2 border-neutral-200 dark:border-neutral-800 flex items-center justify-center mx-auto text-emerald-500">
                <Check className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-sm font-bold text-black dark:text-white">No Duplicate Media Detected</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1 leading-relaxed">
                Your archive is fully optimized with zero duplicate media files.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {duplicates.map((dup, i) => (
                <div key={i} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={dup.fileA} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <span className="font-bold text-xs block text-black dark:text-white">
                        Duplicate Photo Found
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Matches memory from post #{dup.memoryIdB.slice(-4)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      memoryStorage.deleteMemory(dup.memoryIdB);
                      alert('Removed duplicate post.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold"
                  >
                    Remove Duplicate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Memory Rewind Modal */}
      {isRewindPlaying && memories.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4 sm:p-8 animate-fade-in select-none">
          <div className="flex items-center justify-between text-white z-20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Memory Rewind
              </span>
              <span className="text-xs text-neutral-400">
                ({rewindIndex + 1} of {memories.length})
              </span>
            </div>
            <button
              onClick={() => setIsRewindPlaying(false)}
              className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative my-4">
            {memories[rewindIndex].media.length > 0 && (
              <img
                src={memories[rewindIndex].media[0].url}
                alt=""
                className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl transition-all duration-500"
              />
            )}
            <div className="absolute bottom-4 inset-x-4 max-w-md mx-auto p-4 rounded-xl bg-black/70 backdrop-blur-md text-white text-center">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                {formatMemoryDate(memories[rewindIndex].date)}
              </span>
              <p className="text-xs mt-1 font-medium line-clamp-2">
                {memories[rewindIndex].caption}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-white z-20">
            <button
              onClick={() => setRewindIndex(prev => Math.max(0, prev - 1))}
              disabled={rewindIndex === 0}
              className="p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setRewindIndex(prev => Math.min(memories.length - 1, prev + 1))}
              disabled={rewindIndex === memories.length - 1}
              className="p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Modal: Create Time Capsule */}
      {isCreatingCapsule && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-md border border-[#dbdbdb] dark:border-[#383838] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-black dark:text-white">Create Time Capsule</h3>
              <button onClick={() => setIsCreatingCapsule(false)} className="text-neutral-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCapsule} className="space-y-3">
              <div>
                <label className="text-[10.5px] font-semibold text-neutral-400 uppercase block mb-1">
                  Capsule Title
                </label>
                <input
                  type="text"
                  value={capsuleTitle}
                  onChange={e => setCapsuleTitle(e.target.value)}
                  placeholder="e.g. 2026 College Graduation"
                  required
                  className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-black dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-semibold text-neutral-400 uppercase block mb-1">
                  Unlock Date
                </label>
                <input
                  type="date"
                  value={capsuleDate}
                  onChange={e => setCapsuleDate(e.target.value)}
                  required
                  className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-black dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-semibold text-neutral-400 uppercase block mb-1">
                  Description / Note
                </label>
                <textarea
                  value={capsuleDesc}
                  onChange={e => setCapsuleDesc(e.target.value)}
                  placeholder="Message to the future..."
                  rows={3}
                  className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-black dark:text-white outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingCapsule(false)}
                  className="flex-1 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-black dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-[#0095f6] text-white text-xs font-semibold"
                >
                  Seal Capsule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Write Letter */}
      {isCreatingLetter && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-md border border-[#dbdbdb] dark:border-[#383838] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-black dark:text-white">Write Letter to Future Me</h3>
              <button onClick={() => setIsCreatingLetter(false)} className="text-neutral-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveLetter} className="space-y-3">
              <div>
                <label className="text-[10.5px] font-semibold text-neutral-400 uppercase block mb-1">
                  Letter Title
                </label>
                <input
                  type="text"
                  value={letterTitle}
                  onChange={e => setLetterTitle(e.target.value)}
                  placeholder="e.g. To Me in 5 Years"
                  required
                  className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-black dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-semibold text-neutral-400 uppercase block mb-1">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={letterDelivery}
                  onChange={e => setLetterDelivery(e.target.value)}
                  required
                  className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-black dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-semibold text-neutral-400 uppercase block mb-1">
                  Letter Content
                </label>
                <textarea
                  value={letterContent}
                  onChange={e => setLetterContent(e.target.value)}
                  placeholder="Dear Future Me..."
                  rows={4}
                  required
                  className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-black dark:text-white outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingLetter(false)}
                  className="flex-1 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-black dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-[#0095f6] text-white text-xs font-semibold"
                >
                  Seal Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
