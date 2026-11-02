import React, { useState, useRef } from 'react';
import { BookOpen, Mic, MicOff, Image, Sparkles, Calendar, Plus, Trash2, Play, Pause, Check } from 'lucide-react';
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

const MOODS = [
  { label: 'Joyful', emoji: '🌸' },
  { label: 'Peaceful', emoji: '✨' },
  { label: 'Cozy', emoji: '☕' },
  { label: 'Chaotic', emoji: '⚡' },
  { label: 'Nostalgic', emoji: '🌊' },
  { label: 'Grateful', emoji: '💖' },
  { label: 'Tired', emoji: '🌙' }
];

export const DiaryView: React.FC<DiaryViewProps> = ({
  journals,
  onAddJournal,
  onDeleteJournal,
  onRecordMood,
  profile
}) => {
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(DAILY_PROMPTS[0]);
  const [selectedMood, setSelectedMood] = useState('✨ Peaceful');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [photos, setPhotos] = useState<string[]>([]);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

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
    } catch {
      alert('Microphone access is not available or was denied.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
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
      alert('Please write something in your journal entry.');
      return;
    }

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      date: entryDate,
      title: title.trim() || 'Untitled Journal',
      content: content.trim(),
      prompt: selectedPrompt,
      mood: selectedMood,
      voiceNoteUrl: voiceNoteUrl || undefined,
      photos,
      createdAt: new Date().toISOString()
    };

    onAddJournal(newEntry);
    onRecordMood({
      date: entryDate,
      mood: selectedMood.split(' ')[1] || 'Peaceful',
      emoji: selectedMood.split(' ')[0] || '✨'
    });

    // Reset
    setTitle('');
    setContent('');
    setVoiceNoteUrl(null);
    setPhotos([]);
    setIsWriting(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#dbdbdb] dark:border-[#262626]">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span>Personal Diary</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Free-writing, daily prompts, audio voice notes, and mood tracking.
          </p>
        </div>

        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="px-4 py-2 rounded-xl bg-[#0095f6] hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Journal Entry</span>
          </button>
        )}
      </div>

      {/* Editor Box */}
      {isWriting && (
        <form
          onSubmit={handleSave}
          className="mb-8 p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#dbdbdb] dark:border-[#262626] shadow-xl space-y-4 animate-fade-in"
        >
          {/* Top: Date & Daily Prompt Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <input
                type="date"
                value={entryDate}
                onChange={e => setEntryDate(e.target.value)}
                className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-lg text-black dark:text-white outline-none font-medium"
              />
            </div>

            {/* Prompt dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <select
                value={selectedPrompt}
                onChange={e => setSelectedPrompt(e.target.value)}
                className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-lg text-neutral-800 dark:text-neutral-200 outline-none text-xs"
              >
                {DAILY_PROMPTS.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <input
            type="text"
            placeholder="Entry Title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-base font-bold bg-transparent border-b border-neutral-200 dark:border-neutral-800 pb-2 outline-none text-black dark:text-white"
          />

          {/* Writing canvas */}
          <textarea
            rows={6}
            placeholder="Write your thoughts freely today... (It's strictly private and saved securely on your device)"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full text-xs sm:text-sm leading-relaxed p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 outline-none resize-none text-black dark:text-white"
          />

          {/* Mood Check-In */}
          <div>
            <span className="text-[11px] font-semibold text-neutral-500 block mb-1.5">
              How did you feel today?
            </span>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map(m => {
                const fullStr = `${m.emoji} ${m.label}`;
                const isSelected = selectedMood === fullStr;
                return (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setSelectedMood(fullStr)}
                    className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-400 font-semibold scale-105'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attachments (Voice note & Photos) */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            {/* Voice Note Recorder */}
            <div className="flex items-center gap-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-xs font-semibold flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200"
                >
                  <Mic className="w-4 h-4 text-rose-500" />
                  <span>Record Voice Note</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopVoiceRecording}
                  className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 animate-pulse"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Stop Recording (Recording...)</span>
                </button>
              )}

              {voiceNoteUrl && (
                <audio src={voiceNoteUrl} controls className="h-8 w-48" />
              )}
            </div>

            {/* Photos */}
            <label className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-neutral-800 dark:text-neutral-200">
              <Image className="w-4 h-4 text-sky-500" />
              <span>Attach Photos ({photos.length})</span>
              <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          {/* Photo Previews */}
          {photos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {photos.map((p, idx) => (
                <img
                  key={idx}
                  src={p}
                  alt="Attachment"
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border"
                />
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-black dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0095f6] text-white text-xs font-semibold hover:bg-sky-600 shadow-xs"
            >
              Save Journal Entry
            </button>
          </div>
        </form>
      )}

      {/* Journal Entries List */}
      <div className="space-y-4">
        {journals.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 p-8 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">Your personal diary is waiting.</p>
            <p className="text-xs text-neutral-500 mt-1">
              Start writing your reflections, attach voice notes, and track your daily moods.
            </p>
          </div>
        ) : (
          journals.map(entry => (
            <div
              key={entry.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#dbdbdb] dark:border-[#262626] shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-neutral-400">
                      {entry.date}
                    </span>
                    {entry.mood && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium">
                        {entry.mood}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-black dark:text-white mt-1">
                    {entry.title}
                  </h3>
                </div>
                <button
                  onClick={() => onDeleteJournal(entry.id)}
                  className="p-1 text-neutral-400 hover:text-rose-500"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {entry.prompt && (
                <div className="text-[11px] italic text-neutral-500 bg-neutral-50 dark:bg-neutral-900 p-2 rounded-lg border-l-2 border-amber-400">
                  "{entry.prompt}"
                </div>
              )}

              <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line">
                {entry.content}
              </p>

              {entry.voiceNoteUrl && (
                <div className="pt-2">
                  <span className="text-[10px] text-neutral-400 font-semibold block mb-1">
                    Voice Note Attachment:
                  </span>
                  <audio src={entry.voiceNoteUrl} controls className="h-8 w-60" />
                </div>
              )}

              {entry.photos && entry.photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pt-2">
                  {entry.photos.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Journal Photo"
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-neutral-200 dark:border-neutral-700"
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
