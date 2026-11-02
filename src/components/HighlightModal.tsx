import React, { useState } from 'react';
import { X, Plus, Check, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Highlight, Story } from '../types';

interface HighlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story | null;
  highlights: Highlight[];
  onSaveHighlight: (updatedHighlights: Highlight[]) => void;
}

export const HighlightModal: React.FC<HighlightModalProps> = ({
  isOpen,
  onClose,
  story,
  highlights,
  onSaveHighlight
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  if (!isOpen || !story) return null;

  const handleAddToExisting = (highlightId: string) => {
    const updated = highlights.map(hl => {
      if (hl.id === highlightId) {
        return {
          ...hl,
          stories: [...(hl.stories || []), story]
        };
      }
      return hl;
    });

    onSaveHighlight(updated);
    confetti({ particleCount: 40, spread: 50 });
    onClose();
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHl: Highlight = {
      id: `hl-${Date.now()}`,
      title: newTitle.trim(),
      coverUrl: story.mediaUrl,
      stories: [story]
    };

    onSaveHighlight([...highlights, newHl]);
    confetti({ particleCount: 50, spread: 60 });
    setIsCreatingNew(false);
    setNewTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-sm border border-[#dbdbdb] dark:border-[#383838] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#dbdbdb] dark:border-[#383838] flex items-center justify-between">
          <h3 className="text-sm font-bold text-black dark:text-white flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Add to Highlights</span>
          </h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-black dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {isCreatingNew ? (
            <form onSubmit={handleCreateNew} className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-2 border-neutral-300 dark:border-neutral-700 overflow-hidden mb-2">
                  <img src={story.mediaUrl} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] text-neutral-400">Highlight Cover</span>
              </div>

              <input
                type="text"
                placeholder="Highlight name (e.g. Friends 💖)"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                autoFocus
                className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-black dark:text-white outline-none focus:border-[#0095f6]"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="flex-1 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="flex-1 py-2 rounded-xl bg-[#0095f6] text-white text-xs font-semibold disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {/* Existing Highlights */}
              <div className="grid grid-cols-4 gap-3 text-center">
                {/* New Highlight Circle */}
                <div
                  onClick={() => setIsCreatingNew(true)}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-500 group-hover:border-[#0095f6] transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    New
                  </span>
                </div>

                {highlights.map(hl => (
                  <div
                    key={hl.id}
                    onClick={() => handleAddToExisting(hl.id)}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-full p-[2px] border-2 border-neutral-300 dark:border-neutral-700 group-hover:border-[#0095f6] transition-colors overflow-hidden">
                      <img
                        src={hl.coverUrl}
                        alt={hl.title}
                        className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-black dark:text-white truncate max-w-[65px]">
                      {hl.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
