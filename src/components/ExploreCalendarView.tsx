import React, { useState, useMemo } from 'react';
import { Search, Calendar as CalendarIcon, Heart, Sparkles, Filter, ChevronLeft, ChevronRight, Layers, Film } from 'lucide-react';
import { MemoryPost, UserProfile } from '../types';
import { formatMemoryDate } from '../lib/storage';

interface ExploreCalendarViewProps {
  memories: MemoryPost[];
  profile: UserProfile;
  onSelectPost: (post: MemoryPost) => void;
}

export const ExploreCalendarView: React.FC<ExploreCalendarViewProps> = ({
  memories,
  profile,
  onSelectPost
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'liked' | 'archived' | 'photos' | 'videos'>('all');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  // Calendar month state
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter memories
  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      // Search text match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        m.caption?.toLowerCase().includes(query) ||
        m.location?.toLowerCase().includes(query) ||
        m.tags?.some(t => t.toLowerCase().includes(query)) ||
        m.collections?.some(c => c.toLowerCase().includes(query)) ||
        m.date?.includes(query);

      // Filter category
      let matchesCategory = true;
      if (filterType === 'liked') matchesCategory = m.isLiked;
      else if (filterType === 'archived') matchesCategory = m.isArchived;
      else if (filterType === 'photos') matchesCategory = m.media.some(med => med.type === 'image');
      else if (filterType === 'videos') matchesCategory = m.media.some(med => med.type === 'video');

      // Mood match
      const matchesMood = !selectedMood || m.mood === selectedMood;

      return matchesSearch && matchesCategory && matchesMood;
    });
  }, [memories, searchQuery, filterType, selectedMood]);

  // "On This Day" throwback memory: check if any memory has matching month & day or older throwback
  const throwbackMemory = useMemo(() => {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    return memories.find(m => {
      const d = new Date(m.date);
      return (d.getMonth() + 1 === todayMonth && d.getDate() === todayDay) || m.isArchived;
    }) || memories[memories.length - 1];
  }, [memories]);

  // Calendar Days Calculation
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    // Days with memories
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayMemories = memories.filter(m => m.date === dateString);
      days.push({
        day,
        dateString,
        memories: dayMemories
      });
    }

    return days;
  }, [currentDate, memories]);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 pb-20 pt-2 select-none">
      {/* 1. Search Bar */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search captions, #tags, places, or dates..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-[#dbdbdb] dark:border-[#262626] text-xs text-[#262626] dark:text-[#f5f5f5] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#0095f6]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* 2. Mode & Filter Chips */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1 mb-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              filterType === 'all'
                ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('liked')}
            className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 transition-colors ${
              filterType === 'liked'
                ? 'bg-rose-500 text-white font-semibold'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
            }`}
          >
            <Heart className="w-3 h-3 fill-current" />
            <span>Favorites</span>
          </button>
          <button
            onClick={() => setFilterType('photos')}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              filterType === 'photos'
                ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setFilterType('videos')}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              filterType === 'videos'
                ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
            }`}
          >
            Videos
          </button>
        </div>

        {/* View mode toggle: Explore Grid vs Calendar */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                : 'text-neutral-400'
            }`}
            title="Grid View"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                : 'text-neutral-400'
            }`}
            title="Calendar View"
          >
            <CalendarIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. "On This Day" Flashback Banner */}
      {throwbackMemory && !searchQuery && (
        <div
          onClick={() => onSelectPost(throwbackMemory)}
          className="relative w-full rounded-2xl overflow-hidden mb-4 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-300/30 dark:border-amber-700/30 p-3 flex items-center justify-between cursor-pointer hover:opacity-95 transition-all shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/50">
              <img
                src={throwbackMemory.media[0]?.url}
                alt="Flashback"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  On This Day Flashback
                </span>
              </div>
              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 line-clamp-1 mt-0.5">
                {throwbackMemory.caption || 'A memorable little day'}
              </p>
              <span className="text-[10px] text-neutral-500">
                {formatMemoryDate(throwbackMemory.date)} • {throwbackMemory.location || 'Special moment'}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-rose-500 hover:underline">Revisit →</span>
        </div>
      )}

      {/* 4. Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-[#121212] rounded-2xl p-4 border border-[#dbdbdb] dark:border-[#262626] shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2 text-[11px] font-semibold text-neutral-400">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const hasMemories = cell.memories.length > 0;
              const firstMemory = cell.memories[0];

              return (
                <div
                  key={cell.dateString}
                  onClick={() => {
                    if (hasMemories) {
                      onSelectPost(firstMemory);
                    }
                  }}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center relative overflow-hidden text-xs transition-all ${
                    hasMemories
                      ? 'cursor-pointer hover:scale-105 ring-2 ring-[#0095f6]'
                      : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-400'
                  }`}
                >
                  {hasMemories ? (
                    <>
                      <img
                        src={firstMemory.media[0]?.url}
                        alt="Day thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-bold text-[11px]">{cell.day}</span>
                      </div>
                      <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
                    </>
                  ) : (
                    <span>{cell.day}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Explore 3-Column Instagram Grid View */}
      {filteredMemories.length === 0 ? (
        <div className="py-12 text-center text-neutral-400">
          <p className="text-xs font-medium">No memories found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
          {filteredMemories.map((m, index) => {
            const hasMultiple = m.media.length > 1;
            const isVideo = m.media[0]?.type === 'video';

            return (
              <div
                key={m.id}
                onClick={() => onSelectPost(m)}
                className="relative aspect-square group cursor-pointer overflow-hidden bg-neutral-100 dark:bg-neutral-900 select-none"
              >
                <img
                  src={m.media[0]?.url}
                  alt={m.caption || 'Memory thumbnail'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Top right icon (Multiple items or Video indicator) */}
                <div className="absolute top-1.5 right-1.5 text-white drop-shadow-md">
                  {hasMultiple && <Layers className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {isVideo && <Film className="w-3.5 h-3.5 stroke-[2.5]" />}
                </div>

                {/* Hover overlay with likes and notes count */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-semibold">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white text-white" />
                    <span>{m.isLiked ? '1' : '0'}</span>
                  </div>
                  {(m.personalNotes?.length || 0) > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] bg-white/30 px-1 rounded">
                        {m.personalNotes.length} notes
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
