import React, { useState } from 'react';
import { Search, Heart, Layers, Film } from 'lucide-react';
import { MemoryPost } from '../types';

interface ExploreViewProps {
  memories: MemoryPost[];
  onSelectPost: (post: MemoryPost) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ memories, onSelectPost }) => {
  const [query, setQuery] = useState('');

  const filtered = memories.filter(m => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      m.caption?.toLowerCase().includes(q) ||
      m.location?.toLowerCase().includes(q) ||
      m.tags?.some(t => t.toLowerCase().includes(q)) ||
      m.date?.includes(q)
    );
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-3 select-none">
      {/* Search Input Bar */}
      <div className="relative mb-4 max-w-xl mx-auto">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search memories, locations, or #tags..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs text-black dark:text-white placeholder-neutral-400 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400"
          >
            Clear
          </button>
        )}
      </div>

      {/* Explore Grid */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {filtered.map((m, idx) => {
          const isLarge = idx % 6 === 1 || idx % 6 === 4;
          const hasMultiple = m.media.length > 1;
          const isVideo = m.media[0]?.type === 'video';

          return (
            <div
              key={m.id}
              onClick={() => onSelectPost(m)}
              className={`relative cursor-pointer overflow-hidden bg-neutral-100 dark:bg-neutral-900 group ${
                isLarge ? 'row-span-2 col-span-1' : 'aspect-square'
              }`}
            >
              <img
                src={m.media[0]?.url}
                alt={m.caption || 'Explore item'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Indicator icon */}
              <div className="absolute top-2 right-2 text-white drop-shadow-md">
                {hasMultiple && <Layers className="w-4 h-4 stroke-[2.5]" />}
                {isVideo && <Film className="w-4 h-4 stroke-[2.5]" />}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{m.isLiked ? '1' : '0'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
