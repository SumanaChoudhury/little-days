import React from 'react';
import { X, Sparkles, Heart, Archive, Clock, ShieldCheck } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const activities = [
    {
      id: '1',
      title: 'Memory Flashback',
      desc: 'You visited Sankey Tank Lake around this time last week.',
      time: '2h ago',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />
    },
    {
      id: '2',
      title: 'Smart Archive Status',
      desc: 'Summer 2026 archive bundle is safely verified and stored in cold storage.',
      time: '1d ago',
      icon: <Archive className="w-4 h-4 text-sky-500" />
    },
    {
      id: '3',
      title: 'Privacy Verification',
      desc: 'Your memory universe is 100% private. 0 external trackers or public connections.',
      time: '3d ago',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />
    },
    {
      id: '4',
      title: 'Reflection Log',
      desc: 'You added a private note to "Campus Library Corner".',
      time: '4d ago',
      icon: <Heart className="w-4 h-4 text-rose-500" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-white dark:bg-[#181818] rounded-2xl w-full max-w-sm border border-[#dbdbdb] dark:border-[#333] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#dbdbdb] dark:border-[#262626]">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-rose-500" />
            <span>Memory Activity</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400 hover:text-neutral-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {activities.map(act => (
            <div
              key={act.id}
              className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-white dark:bg-neutral-800 shadow-2xs shrink-0">
                {act.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {act.title}
                  </h4>
                  <span className="text-[10px] text-neutral-400">{act.time}</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-normal">
                  {act.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
