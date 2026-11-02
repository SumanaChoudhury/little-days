import React from 'react';
import { Plus } from 'lucide-react';
import { Story, UserProfile } from '../types';

interface StoriesBarProps {
  stories: Story[];
  profile: UserProfile;
  onSelectStory: (story: Story, index: number) => void;
  onAddStory: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  profile,
  onSelectStory,
  onAddStory
}) => {
  const hasStories = stories.length > 0;
  const allSeen = hasStories && stories.every(s => s.seen);

  const handleAvatarClick = () => {
    if (hasStories) {
      const firstUnseenIdx = stories.findIndex(s => !s.seen);
      const targetIdx = firstUnseenIdx >= 0 ? firstUnseenIdx : 0;
      onSelectStory(stories[targetIdx], targetIdx);
    } else {
      onAddStory();
    }
  };

  return (
    <div className="w-full bg-white dark:bg-black border-b border-[#dbdbdb] dark:border-[#262626] py-3.5 px-3 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-4 min-w-max">
        {/* Your Story Ring */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="relative">
            <div
              onClick={handleAvatarClick}
              className={`w-[68px] h-[68px] rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                hasStories
                  ? allSeen
                    ? 'border-2 border-[#dbdbdb] dark:border-[#383838]'
                    : 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-sm'
                  : 'border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div className="w-full h-full rounded-full p-[2px] bg-white dark:bg-black">
                <img
                  src={profile.avatarUrl}
                  alt={profile.username || 'Your story'}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            {/* Plus button to add new story */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddStory();
              }}
              title="Add story"
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#0095f6] text-white flex items-center justify-center border-2 border-white dark:border-black shadow-sm hover:scale-110 active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          <span className="text-[11px] font-normal text-[#262626] dark:text-[#f5f5f5] max-w-[74px] truncate text-center">
            {hasStories ? 'Your story' : 'Add story'}
          </span>
        </div>

        {/* Stories list: only show slide previews if there are multiple stories */}
        {stories.map((story, index) => {
          const isSeen = story.seen;
          const label = story.caption ? story.caption.slice(0, 10) : `Story ${index + 1}`;
          return (
            <div
              key={story.id}
              onClick={() => onSelectStory(story, index)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div
                className={`w-[68px] h-[68px] rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                  isSeen
                    ? 'border-2 border-[#dbdbdb] dark:border-[#363636]'
                    : 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-sm'
                }`}
              >
                <div className="w-full h-full rounded-full p-[2px] bg-white dark:bg-black">
                  <img
                    src={story.mediaUrl}
                    alt={label}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-normal text-[#262626] dark:text-[#f5f5f5] max-w-[70px] truncate text-center">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
