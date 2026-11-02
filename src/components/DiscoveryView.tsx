import React, { useState } from 'react';
import {
  Sparkles,
  Shuffle,
  Play,
  Lock,
  Mail,
  BookOpen,
  Copy,
  Calendar,
  Clock,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MemoryPost, TimeCapsule, FutureLetter, UserProfile } from '../types';
import { memoryStorage, formatMemoryDate } from '../lib/storage';

interface DiscoveryViewProps {
  memories: MemoryPost[];
  profile: UserProfile;
  onSelectPost: (post: MemoryPost) => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({ memories, profile, onSelectPost }) => {
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

  // Random memory picker
  const handleRandomMemory = () => {
    if (memories.length === 0) {
      alert('Upload some memories first to pick a random memory!');
      return;
    }
    confetti({ particleCount: 50, spread: 60 });
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
    confetti({ particleCount: 40 });
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
    confetti({ particleCount: 40 });
  };

  const duplicates = memoryStorage.findDuplicatePhotos();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#dbdbdb] dark:border-[#262626]">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Memory Discovery Hub</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Revisit past moments, lock time capsules, write to your future self, and generate photo books.
          </p>
        </div>

        {/* Action: Random Memory & Rewind */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomMemory}
            className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors text-black dark:text-white"
          >
            <Shuffle className="w-4 h-4 text-purple-500" />
            <span>Random Memory</span>
          </button>
          <button
            onClick={() => {
              if (memories.length === 0) {
                alert('Add memories first to watch a Memory Rewind!');
                return;
              }
              setIsRewindPlaying(true);
              setRewindIndex(0);
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-90"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Memory Rewind</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 border-b border-neutral-100 dark:border-neutral-800">
        <button
          onClick={() => setActiveSubTab('onThisDay')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'onThisDay'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          📅 On This Day
        </button>
        <button
          onClick={() => setActiveSubTab('capsules')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'capsules'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          ⏳ Time Capsules ({capsules.length})
        </button>
        <button
          onClick={() => setActiveSubTab('letters')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'letters'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          ✉️ Letters to Future Me ({letters.length})
        </button>
        <button
          onClick={() => setActiveSubTab('photobook')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'photobook'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          📖 Digital Photo Book
        </button>
        <button
          onClick={() => setActiveSubTab('duplicates')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'duplicates'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          🔍 Duplicate Detection ({duplicates.length})
        </button>
      </div>

      {/* 1. On This Day */}
      {activeSubTab === 'onThisDay' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-300/30 dark:border-amber-700/30">
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Flashback to This Calendar Date</span>
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
              Rediscover what you were feeling, capturing, and experiencing on this calendar day in previous months or years.
            </p>
          </div>

          {memories.length === 0 ? (
            <p className="text-xs text-neutral-400 py-8 text-center">
              No memories to look back on yet. Upload your first post!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {memories.slice(0, 6).map(m => (
                <div
                  key={m.id}
                  onClick={() => onSelectPost(m)}
                  className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer border border-[#dbdbdb] dark:border-[#262626]"
                >
                  <img
                    src={m.media[0]?.url}
                    alt={m.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                    <span className="text-[10px] text-white/80">{formatMemoryDate(m.date)}</span>
                    <p className="text-xs font-semibold truncate">{m.caption || 'Memory'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Time Capsules (PRD 3.8) */}
      {activeSubTab === 'capsules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Lock selected memories in a digital vault that unlocks on a future date of your choice.
            </p>
            {!isCreatingCapsule && (
              <button
                onClick={() => setIsCreatingCapsule(true)}
                className="px-3 py-1.5 rounded-xl bg-[#0095f6] text-white text-xs font-semibold"
              >
                + Lock New Capsule
              </button>
            )}
          </div>

          {isCreatingCapsule && (
            <form onSubmit={handleSaveCapsule} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border space-y-3">
              <h4 className="text-xs font-bold text-black dark:text-white">New Time Capsule</h4>
              <input
                type="text"
                placeholder="Capsule Title (e.g. To open on my graduation day 🎓)"
                value={capsuleTitle}
                onChange={e => setCapsuleTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-black border text-xs text-black dark:text-white outline-none"
              />
              <textarea
                placeholder="A secret note or description to your future self..."
                value={capsuleDesc}
                onChange={e => setCapsuleDesc(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-black border text-xs text-black dark:text-white outline-none"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">Unlock Date:</span>
                <input
                  type="date"
                  value={capsuleDate}
                  onChange={e => setCapsuleDate(e.target.value)}
                  className="p-2 rounded-xl bg-white dark:bg-black border text-xs"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsCreatingCapsule(false)} className="px-3 py-1.5 rounded-lg text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#0095f6] text-white text-xs font-semibold">
                  Lock in Vault 🔒
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {capsules.map(c => (
              <div
                key={c.id}
                className={`p-4 rounded-2xl border ${
                  c.isLocked
                    ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    c.isLocked ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <Lock className="w-3 h-3" />
                    <span>{c.isLocked ? `Locked until ${c.unlockDate}` : 'Unlocked!'}</span>
                  </span>
                </div>
                <h4 className="text-sm font-bold text-black dark:text-white">{c.title}</h4>
                <p className="text-xs text-neutral-500 mt-1">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Letters to Future Me */}
      {activeSubTab === 'letters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Write scheduled personal letters that deliver to your future self.
            </p>
            {!isCreatingLetter && (
              <button
                onClick={() => setIsCreatingLetter(true)}
                className="px-3 py-1.5 rounded-xl bg-[#0095f6] text-white text-xs font-semibold"
              >
                + Write Letter
              </button>
            )}
          </div>

          {isCreatingLetter && (
            <form onSubmit={handleSaveLetter} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border space-y-3">
              <h4 className="text-xs font-bold text-black dark:text-white">Letter to Future Me</h4>
              <input
                type="text"
                placeholder="Letter Title..."
                value={letterTitle}
                onChange={e => setLetterTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-black border text-xs text-black dark:text-white outline-none"
              />
              <textarea
                placeholder="Dear Future Me..."
                value={letterContent}
                onChange={e => setLetterContent(e.target.value)}
                rows={5}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-black border text-xs text-black dark:text-white outline-none"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">Delivery Date:</span>
                <input
                  type="date"
                  value={letterDelivery}
                  onChange={e => setLetterDelivery(e.target.value)}
                  className="p-2 rounded-xl bg-white dark:bg-black border text-xs"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsCreatingLetter(false)} className="px-3 py-1.5 rounded-lg text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#0095f6] text-white text-xs font-semibold">
                  Schedule Letter ✉️
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {letters.map(l => (
              <div key={l.id} className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-[#dbdbdb] dark:border-[#262626]">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-black dark:text-white">{l.title}</h4>
                  <span className="text-[10px] text-neutral-400">Scheduled for {l.deliveryDate}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 whitespace-pre-line mt-1">
                  {l.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Digital Photo Book (PRD 3.8) */}
      {activeSubTab === 'photobook' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">Printable Digital Photo Book</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Automatically generate a keepsake photo book album from your memories.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 border border-dashed rounded-2xl">
            {memories.map((m, idx) => (
              <div key={m.id} className="p-3 bg-white dark:bg-neutral-800 rounded-xl shadow-xs border text-center space-y-2">
                <img
                  src={m.media[0]?.url}
                  alt="Book item"
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <span className="text-[10px] font-mono text-neutral-400 block">{formatMemoryDate(m.date)}</span>
                <p className="text-xs font-serif italic text-neutral-800 dark:text-neutral-200 line-clamp-2">
                  {m.caption || 'A memorable moment'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Duplicate Photo Scanner (PRD 4.2) */}
      {activeSubTab === 'duplicates' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border">
            <h3 className="text-sm font-bold text-black dark:text-white">Cryptographic Duplicate Scanner</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Identifies identical files and suspected duplicate photos so you can safely clean up storage without losing originals.
            </p>
          </div>

          {duplicates.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold">0 Duplicate Photos Found</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Your memory archive is completely clean and deduplicated.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {duplicates.map((dup, idx) => (
                <div key={idx} className="p-4 rounded-xl border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={dup.fileA} alt="A" className="w-14 h-14 object-cover rounded-lg" />
                    <img src={dup.fileB} alt="B" className="w-14 h-14 object-cover rounded-lg" />
                    <div>
                      <span className="text-xs font-bold text-black dark:text-white">Suspected Duplicate Found</span>
                      <span className="text-[10px] text-neutral-400 block">Identical file size & content</span>
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-rose-500 hover:underline">
                    Review & Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Slideshow Rewind Modal */}
      {isRewindPlaying && memories.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 select-none animate-fade-in text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold uppercase tracking-wider">Memory Rewind</span>
            </div>
            <button
              onClick={() => setIsRewindPlaying(false)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full my-auto text-center">
            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl mb-4 border border-white/20">
              <img
                src={memories[rewindIndex].media[0]?.url}
                alt="Rewind"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-white/70 block mb-1">
              {formatMemoryDate(memories[rewindIndex].date)}
            </span>
            <p className="text-base font-serif italic text-white/95 max-w-md">
              "{memories[rewindIndex].caption || 'A moment frozen in time'}"
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between max-w-lg mx-auto w-full">
            <button
              onClick={() => setRewindIndex(i => Math.max(0, i - 1))}
              disabled={rewindIndex === 0}
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 disabled:opacity-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-xs font-mono">
              {rewindIndex + 1} of {memories.length}
            </span>
            <button
              onClick={() => setRewindIndex(i => Math.min(memories.length - 1, i + 1))}
              disabled={rewindIndex === memories.length - 1}
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 disabled:opacity-30"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
