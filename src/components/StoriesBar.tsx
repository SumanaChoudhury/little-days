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
  return (
    <div className="w-full bg-white dark:bg-black border-b border-[#dbdbdb] dark:border-[#262626] py-3.5 px-3 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-3.5 min-w-max">
        {/* Your Story (+ button) */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={onAddStory}>
          <div className="relative">
            <div className="w-[66px] h-[66px] rounded-full p-[2px] border-2 border-transparent">
              <img
                src={profile.avatarUrl}
                alt="Your Story"
                className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#0095f6] text-white flex items-center justify-center border-2 border-white dark:border-black shadow-sm">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-normal text-[#262626] dark:text-[#f5f5f5] max-w-[70px] truncate text-center">
            Your story
          </span>
        </div>

        {/* Stories list */}
        {stories.map((story, index) => {
          const isSeen = story.seen;
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
                    src={story.user.avatar || story.mediaUrl}
                    alt={story.user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-normal text-[#262626] dark:text-[#f5f5f5] max-w-[70px] truncate text-center">
                {story.user.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
