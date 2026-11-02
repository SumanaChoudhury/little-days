import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Mic,
  MicOff,
  Image as ImageIcon,
  Calendar,
  Plus,
  Trash2,
  Lock,
  Sparkles,
  PenLine,
  X,
  Volume2
} from 'lucide-react';
import { JournalEntry, MoodEntry, UserProfile } from '../types';

interface DiaryViewProps {
  journals: JournalEntry[];
  onAddJournal: (entry: JournalEntry) => void;
  onDeleteJournal: (id: string) => void;
  onRecordMood: (entry: MoodEntry) => void;
  profile: UserProfile;
}

const DAILY_PROMPTS = [
  'What made you smile or pause today?',
  'A little moment from today you want to freeze in time...',
  'What is one thing you learned or felt deeply today?',
  'Describe a sensory detail you noticed (a sound, scent, or view).',
  'What gave you peace today?'
];

export const DiaryView: React.FC<DiaryViewProps> = ({
  journals,
  onAddJournal,
  onDeleteJournal,
  profile
}) => {
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [photos, setPhotos] = useState<string[]>([]);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecordingSeconds(0);

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setVoiceNoteUrl(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } catch {
      alert('Microphone access is not available or was denied.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setPhotos(p => [...p, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !title.trim()) {
      alert('Please write something in your diary entry.');
      return;
    }

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      date: entryDate,
      title: title.trim() || 'Untitled Reflection',
      content: content.trim(),
      prompt: selectedPrompt || undefined,
      voiceNoteUrl: voiceNoteUrl || undefined,
      photos,
      createdAt: new Date().toISOString()
    };

    onAddJournal(newEntry);

    // Reset form
    setTitle('');
    setContent('');
    setSelectedPrompt(null);
    setVoiceNoteUrl(null);
    setPhotos([]);
    setIsWriting(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-6 select-none animate-fade-in">
      {/* Top Header (Clean, Instagram typographic style) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#dbdbdb] dark:border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-black dark:text-white">
              Personal Diary
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>Only You</span>
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Your private journal for unshared thoughts, voice notes, and daily reflections.
          </p>
        </div>

        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="px-4 py-2 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        )}
      </div>

      {/* Editor Box */}
      {isWriting && (
        <form
          onSubmit={handleSave}
          className="mb-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#262626] shadow-xl space-y-4 animate-fade-in"
        >
          {/* Header Row: Date & Cancel */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 text-xs">
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <Calendar className="w-4 h-4" />
              <input
                type="date"
                value={entryDate}
                onChange={e => setEntryDate(e.target.value)}
                className="bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md text-black dark:text-white outline-none font-medium"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="text-neutral-400 hover:text-black dark:hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Prompt Selector Pills */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
              Choose a Prompt (Optional)
            </span>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {DAILY_PROMPTS.map((prompt, idx) => {
                const isSelected = selectedPrompt === prompt;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPrompt(isSelected ? null : prompt)}
                    className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                    }`}
                  >
                    {prompt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title Input */}
          <input
            type="text"
            placeholder="Entry Title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-base font-bold bg-transparent border-b border-neutral-200 dark:border-neutral-800 pb-2 outline-none text-black dark:text-white placeholder-neutral-400"
          />

          {/* Body Canvas */}
          <textarea
            rows={6}
            placeholder="Write your private thoughts freely... (Saved exclusively to your secure vault)"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full text-xs sm:text-sm leading-relaxed p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 outline-none resize-none text-black dark:text-white placeholder-neutral-400 focus:border-neutral-400"
          />

          {/* Attachments: Voice Note & Photos */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            {/* Microphone Voice Recorder */}
            {!isRecording ? (
              <button
                type="button"
                onClick={startVoiceRecording}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <Mic className="w-4 h-4 text-rose-500" />
                <span>{voiceNoteUrl ? 'Re-record Voice Note' : 'Record Audio Note'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopVoiceRecording}
                className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 animate-pulse"
              >
                <MicOff className="w-4 h-4" />
                <span>Recording ({recordingSeconds}s) • Tap to Stop</span>
              </button>
            )}

            {voiceNoteUrl && (
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-lg">
                <Volume2 className="w-3.5 h-3.5 text-neutral-500" />
                <audio src={voiceNoteUrl} controls className="h-7 w-44" />
              </div>
            )}

            {/* Attach Photos */}
            <label className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-neutral-700 dark:text-neutral-300 transition-colors">
              <ImageIcon className="w-4 h-4 text-sky-500" />
              <span>Attach Photos ({photos.length})</span>
              <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          {/* Photo Previews */}
          {photos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {photos.map((p, idx) => (
                <div key={idx} className="relative group shrink-0">
                  <img
                    src={p}
                    alt="Attachment"
                    className="w-16 h-16 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-black/70 rounded-full text-white flex items-center justify-center text-[10px]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-black dark:text-white hover:bg-neutral-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              Save Reflection
            </button>
          </div>
        </form>
      )}

      {/* Journal Entries List */}
      <div className="space-y-4">
        {journals.length === 0 ? (
          <div className="py-16 text-center border border-[#dbdbdb] dark:border-[#262626] rounded-2xl bg-white dark:bg-black p-8 space-y-4">
            <div className="w-14 h-14 rounded-full border-2 border-neutral-200 dark:border-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
              <PenLine className="w-6 h-6 stroke-[1.5]" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                No Journal Reflections Yet
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 leading-relaxed">
                Your personal diary is 100% private. Document daily thoughts, reflections, or voice notes that only you can ever see.
              </p>
            </div>

            {/* Quick Inspiration Prompts */}
            <div className="pt-2 max-w-md mx-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Start with a prompt
              </span>
              <div className="space-y-2 text-left">
                {DAILY_PROMPTS.slice(0, 3).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedPrompt(prompt);
                      setIsWriting(true);
                    }}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 text-xs text-neutral-700 dark:text-neutral-300 flex items-center justify-between transition-colors bg-neutral-50/50 dark:bg-neutral-900/50"
                  >
                    <span>{prompt}</span>
                    <Plus className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsWriting(true)}
                className="px-4 py-2 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold transition-colors"
              >
                Write Your First Entry
              </button>
            </div>
          </div>
        ) : (
          journals.map(entry => (
            <div
              key={entry.id}
              className="p-5 rounded-xl bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#262626] shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <h3 className="text-base font-bold text-black dark:text-white mt-0.5">
                    {entry.title}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this diary entry?')) {
                      onDeleteJournal(entry.id);
                    }
                  }}
                  className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {entry.prompt && (
                <div className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-900 p-2.5 rounded-lg border-l-2 border-neutral-400 italic">
                  "{entry.prompt}"
                </div>
              )}

              <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line">
                {entry.content}
              </p>

              {entry.voiceNoteUrl && (
                <div className="pt-1 flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900 p-2 rounded-lg border border-neutral-100 dark:border-neutral-800">
                  <Volume2 className="w-4 h-4 text-neutral-400" />
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase">Voice Note:</span>
                  <audio src={entry.voiceNoteUrl} controls className="h-7 w-48" />
                </div>
              )}

              {entry.photos && entry.photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pt-2">
                  {entry.photos.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Journal Photo"
                      className="w-20 h-20 rounded-lg object-cover shrink-0 border border-neutral-200 dark:border-neutral-800"
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
