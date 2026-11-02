import React, { useState } from 'react';
import { Palette, Plus, Trash2, Image as ImageIcon, Type, Sparkles } from 'lucide-react';
import { Moodboard, MoodboardElement, MemoryPost } from '../types';
import { memoryStorage } from '../lib/storage';

interface MoodboardViewProps {
  memories: MemoryPost[];
}

const STICKERS = ['✨', '🌸', '☕', '💖', '🎞️', '🌙', '🌊', '🌿', '☁️', '🕊️'];
const BACKGROUNDS = ['#FAF8F5', '#F4F1EA', '#EFECE6', '#1E1E1E', '#2A2826', '#E9E3D8'];

export const MoodboardView: React.FC<MoodboardViewProps> = ({ memories }) => {
  const [moodboards, setMoodboards] = useState<Moodboard[]>(() => memoryStorage.getMoodboards());
  const [activeBoardIndex, setActiveBoardIndex] = useState(0);
  const [isAddingText, setIsAddingText] = useState(false);
  const [textInput, setTextInput] = useState('');

  const currentBoard = moodboards[activeBoardIndex] || null;

  const handleCreateBoard = () => {
    const newBoard: Moodboard = {
      id: `mb-${Date.now()}`,
      title: `Moodboard #${moodboards.length + 1}`,
      backgroundColor: '#FAF8F5',
      elements: [],
      createdAt: new Date().toISOString()
    };
    const updated = memoryStorage.addMoodboard(newBoard);
    setMoodboards(updated);
    setActiveBoardIndex(updated.length - 1);
  };

  const handleAddSticker = (sticker: string) => {
    if (!currentBoard) return;
    const newElement: MoodboardElement = {
      id: `el-${Date.now()}`,
      type: 'sticker',
      content: sticker,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      rotation: (Math.random() - 0.5) * 30
    };

    const updated = moodboards.map((b, idx) =>
      idx === activeBoardIndex ? { ...b, elements: [...b.elements, newElement] } : b
    );
    setMoodboards(updated);
    memoryStorage.saveMoodboards(updated);
  };

  const handleAddTextElement = () => {
    if (!currentBoard || !textInput.trim()) return;
    const newElement: MoodboardElement = {
      id: `el-${Date.now()}`,
      type: 'text',
      content: textInput.trim(),
      x: 20 + Math.random() * 50,
      y: 20 + Math.random() * 50,
      rotation: (Math.random() - 0.5) * 15
    };

    const updated = moodboards.map((b, idx) =>
      idx === activeBoardIndex ? { ...b, elements: [...b.elements, newElement] } : b
    );
    setMoodboards(updated);
    memoryStorage.saveMoodboards(updated);
    setTextInput('');
    setIsAddingText(false);
  };

  const handleAddPhotoElement = (photoUrl: string) => {
    if (!currentBoard) return;
    const newElement: MoodboardElement = {
      id: `el-${Date.now()}`,
      type: 'image',
      content: photoUrl,
      x: 10 + Math.random() * 60,
      y: 10 + Math.random() * 60,
      rotation: (Math.random() - 0.5) * 20
    };

    const updated = moodboards.map((b, idx) =>
      idx === activeBoardIndex ? { ...b, elements: [...b.elements, newElement] } : b
    );
    setMoodboards(updated);
    memoryStorage.saveMoodboards(updated);
  };

  const handleDeleteElement = (elId: string) => {
    if (!currentBoard) return;
    const updated = moodboards.map((b, idx) =>
      idx === activeBoardIndex
        ? { ...b, elements: b.elements.filter(el => el.id !== elId) }
        : b
    );
    setMoodboards(updated);
    memoryStorage.saveMoodboards(updated);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#dbdbdb] dark:border-[#262626]">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
            <Palette className="w-5 h-5 text-rose-500" />
            <span>Visual Moodboards & Scrapbook</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Collage personal photos, notes, and aesthetic stickers in free-form visual scrapbook canvases.
          </p>
        </div>

        <button
          onClick={handleCreateBoard}
          className="px-4 py-2 rounded-xl bg-[#0095f6] hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Canvas</span>
        </button>
      </div>

      {!currentBoard ? (
        <div className="py-20 text-center text-neutral-400 border border-dashed rounded-2xl p-8">
          <Palette className="w-12 h-12 mx-auto mb-2 opacity-50 text-rose-400" />
          <h3 className="text-sm font-bold text-black dark:text-white">No Moodboards Yet</h3>
          <p className="text-xs text-neutral-500 mt-1">Create your first scrapbook canvas to start collaging memories.</p>
          <button
            onClick={handleCreateBoard}
            className="mt-4 px-4 py-2 rounded-xl bg-[#0095f6] text-white text-xs font-semibold"
          >
            Create Canvas
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Canvas Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#181818] border border-[#dbdbdb] dark:border-[#262626]">
            {/* Board Selector Tabs */}
            <div className="flex items-center gap-2">
              {moodboards.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBoardIndex(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    idx === activeBoardIndex
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {b.title}
                </button>
              ))}
            </div>

            {/* Elements palette */}
            <div className="flex items-center gap-2">
              {/* Stickers list */}
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                {STICKERS.slice(0, 6).map(s => (
                  <button
                    key={s}
                    onClick={() => handleAddSticker(s)}
                    className="p-1 text-sm hover:scale-125 transition-transform"
                    title={`Add sticker ${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Text note button */}
              <button
                onClick={() => setIsAddingText(true)}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold flex items-center gap-1 text-black dark:text-white"
              >
                <Type className="w-3.5 h-3.5" />
                <span>Text Note</span>
              </button>
            </div>
          </div>

          {/* Text Input Drawer if active */}
          {isAddingText && (
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex gap-2">
              <input
                type="text"
                placeholder="Write a scrapbook note or quote..."
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-white dark:bg-black text-xs outline-none text-black dark:text-white"
              />
              <button
                onClick={handleAddTextElement}
                className="px-4 py-2 rounded-lg bg-[#0095f6] text-white text-xs font-semibold"
              >
                Pin
              </button>
              <button
                onClick={() => setIsAddingText(false)}
                className="px-3 py-2 rounded-lg text-xs text-neutral-400"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Quick Memory Photos Tray to drag into canvas */}
          {memories.length > 0 && (
            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border space-y-2">
              <span className="text-[11px] font-semibold text-neutral-500 block">
                Tap photos to pin into scrapbook:
              </span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {memories.flatMap(m => m.media).map((med, idx) => (
                  <img
                    key={idx}
                    src={med.url}
                    alt="Pin"
                    onClick={() => handleAddPhotoElement(med.url)}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 cursor-pointer hover:scale-110 transition-transform border shadow-2xs"
                    title="Click to pin onto canvas"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Freeform Canvas Area */}
          <div
            className="relative w-full h-[520px] rounded-3xl border shadow-inner overflow-hidden"
            style={{ backgroundColor: currentBoard.backgroundColor }}
          >
            {currentBoard.elements.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <Sparkles className="w-8 h-8 text-amber-400 mb-2" />
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Your canvas is clean.
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Tap stickers, text notes, or photos from your archive to pin them here!
                </p>
              </div>
            ) : (
              currentBoard.elements.map(el => (
                <div
                  key={el.id}
                  style={{
                    position: 'absolute',
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    transform: `rotate(${el.rotation || 0}deg)`
                  }}
                  className="cursor-pointer group select-none transition-transform hover:scale-105"
                >
                  {el.type === 'sticker' && (
                    <div className="relative text-3xl filter drop-shadow-md">
                      {el.content}
                      <button
                        onClick={() => handleDeleteElement(el.id)}
                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] hidden group-hover:flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {el.type === 'text' && (
                    <div className="relative p-2.5 rounded-lg bg-amber-50 text-neutral-800 text-xs font-serif italic shadow-md border border-amber-200 max-w-xs">
                      "{el.content}"
                      <button
                        onClick={() => handleDeleteElement(el.id)}
                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] hidden group-hover:flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {el.type === 'image' && (
                    <div className="relative p-2 bg-white shadow-xl rounded-md border border-neutral-200">
                      <img src={el.content} alt="polaroid" className="w-28 h-28 object-cover rounded-xs" />
                      <button
                        onClick={() => handleDeleteElement(el.id)}
                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] hidden group-hover:flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
