import React from 'react';

// Exact Instagram SVG icons
export const InstagramLogo: React.FC<{ className?: string; width?: number; height?: number }> = ({
  className = '',
  width = 103,
  height = 29
}) => (
  <svg
    aria-label="Instagram"
    className={className}
    fill="currentColor"
    height={height}
    role="img"
    viewBox="0 0 103 29"
    width={width}
  >
    <path d="M74.7 11.2c-.3-.8-.9-1.4-1.7-1.7-1.2-.4-5.9-.4-5.9-.4s-4.7 0-5.9.4c-.8.3-1.4.9-1.7 1.7-.4 1.2-.4 3.7-.4 3.7s0 2.5.4 3.7c.3.8.9 1.4 1.7 1.7 1.2.4 5.9.4 5.9.4s4.7 0 5.9-.4c.8-.3 1.4-.9 1.7-1.7.4-1.2.4-3.7.4-3.7s0-2.5-.4-3.7zm-8.2 5.5v-3.6l3.4 1.8-3.4 1.8z" fill="none" />
    <path d="M12.2 8.4c-2.1 0-3.8 1.7-3.8 3.8s1.7 3.8 3.8 3.8 3.8-1.7 3.8-3.8-1.7-3.8-3.8-3.8zm0 6.2c-1.3 0-2.4-1.1-2.4-2.4s1.1-2.4 2.4-2.4 2.4 1.1 2.4 2.4-1.1 2.4-2.4 2.4z" />
    <circle cx="17.6" cy="6.8" r="0.9" />
    <path d="M21.5 6.4c-.1-.7-.3-1.3-.8-1.8s-1.1-.7-1.8-.8c-.8-.1-2.7-.1-6.7-.1s-5.9 0-6.7.1c-.7.1-1.3.3-1.8.8s-.7 1.1-.8 1.8c-.1.8-.1 2.7-.1 6.7s0 5.9.1 6.7c.1.7.3 1.3.8 1.8s1.1.7 1.8.8c.8.1 2.7.1 6.7.1s5.9 0 6.7-.1c.7-.1 1.3-.3 1.8-.8s.7-1.1.8-1.8c.1-.8.1-2.7.1-6.7s0-5.9-.1-6.7zm-1.8 13.2c-.1.5-.3.8-.6 1.1-.3.3-.6.5-1.1.6-.7.1-2.6.1-5.8.1s-5.1 0-5.8-.1c-.5-.1-.8-.3-1.1-.6-.3-.3-.5-.6-.6-1.1-.1-.7-.1-2.6-.1-5.8s0-5.1.1-5.8c.1-.5.3-.8.6-1.1.3-.3.6-.5 1.1-.6.7-.1 2.6-.1 5.8-.1s5.1 0 5.8.1c.5.1.8.3 1.1.6.3.3.5.6.6 1.1.1.7.1 2.6.1 5.8s0 5.1-.1 5.8z" />
    {/* Instagram Wordmark Text */}
    <text
      x="27"
      y="21"
      fontFamily="'Playfair Display', Georgia, 'Brush Script MT', cursive, serif"
      fontSize="24"
      fontStyle="italic"
      fontWeight="700"
      letterSpacing="-0.5px"
    >
      Instagram
    </text>
  </svg>
);

export const HomeIcon: React.FC<{ filled?: boolean; className?: string }> = ({ filled, className = 'w-6 h-6' }) => (
  filled ? (
    <svg aria-label="Home" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z" />
    </svg>
  ) : (
    <svg aria-label="Home" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Zm-5-2h4v-8.885l-9-8.59-9 8.59V21h4v-4.455a4.996 4.996 0 1 1 10 0V21Z" />
    </svg>
  )
);

export const SearchIcon: React.FC<{ filled?: boolean; className?: string }> = ({ filled, className = 'w-6 h-6' }) => (
  <svg aria-label="Search" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path
      d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={filled ? '3' : '2'}
    />
    <line
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={filled ? '3' : '2'}
      x1="16.511"
      x2="22"
      y1="16.511"
      y2="22"
    />
  </svg>
);

export const ExploreIcon: React.FC<{ filled?: boolean; className?: string }> = ({ filled, className = 'w-6 h-6' }) => (
  filled ? (
    <svg aria-label="Explore" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm3.714 8.286-2.571 6a.998.998 0 0 1-.572.572l-6 2.571a1 1 0 0 1-1.285-1.285l2.571-6a1 1 0 0 1 .572-.572l6-2.571a1 1 0 0 1 1.285 1.285Z" />
    </svg>
  ) : (
    <svg aria-label="Explore" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="m13.173 13.173 4.491-2.053 1.365-.624-6.48-6.48.624 1.366-2.053 4.49a2.002 2.002 0 0 0 2.053 3.301Z" fill="none" />
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10Zm5.714-13.714-6 2.571a1 1 0 0 0-.572.572l-2.571 6a1 1 0 0 0 1.285 1.285l6-2.571a1 1 0 0 0 .572-.572l2.571-6a1 1 0 0 0-1.285-1.285Zm-4.855 5.428 2.053-4.49-4.49 2.053-2.053 4.49 4.49-2.053Z" />
    </svg>
  )
);

export const ReelsIcon: React.FC<{ filled?: boolean; className?: string }> = ({ filled, className = 'w-6 h-6' }) => (
  <svg aria-label="Reels" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002" />
    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="13.504" x2="16.362" y1="2.001" y2="7.002" />
    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.207" x2="10.002" y1="2.11" y2="7.002" />
    <path d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.606 4.945 1.606h6.898c2.85 0 4.006-.698 4.945-1.606.91-.94 1.606-2.096 1.606-4.945V8.552c0-2.848-.697-4.006-1.606-4.945S18.299 2 15.45 2H8.552c-2.848 0-4.006.698-4.945 1.607C2.698 4.546 2 5.704 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    <polygon points="15.002 14.502 10.502 12.001 10.502 17.002 15.002 14.502" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

export const MessengerIcon: React.FC<{ filled?: boolean; className?: string }> = ({ filled, className = 'w-6 h-6' }) => (
  filled ? (
    <svg aria-label="Messenger" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M12.003 2.001a9.99 9.99 0 0 0-8.775 14.819l-1.196 4.364a1 1 0 0 0 1.229 1.229l4.364-1.196A9.99 9.99 0 1 0 12.003 2.001Zm4.675 7.625-2.737 4.106a1 1 0 0 1-1.442.247l-2.164-1.623a.5.5 0 0 0-.6.002l-2.923 2.193a.5.5 0 0 1-.778-.544l2.737-4.106a1 1 0 0 1 1.442-.247l2.164 1.623a.5.5 0 0 0 .6-.002l2.923-2.193a.5.5 0 0 1 .778.544Z" />
    </svg>
  ) : (
    <svg aria-label="Direct" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M22.05 1.577c-.393-.416-1.025-.506-1.517-.22L1.87 12.385c-.53.308-.75.952-.516 1.52.235.568.798.924 1.41.89l5.967-.333 3.633 6.056c.307.51.87.818 1.467.818.106 0 .213-.01.32-.03.7-.134 1.22-.72 1.272-1.434l1.83-16.59c.04-.37-.09-.738-.383-.984l-4.814 4.814 8.01-5.615ZM7.784 12.632l-3.32.185 14.28-7.77-10.96 7.585Z" />
    </svg>
  )
);

export const NotificationsHeartIcon: React.FC<{ filled?: boolean; className?: string }> = ({ filled, className = 'w-6 h-6' }) => (
  filled ? (
    <svg aria-label="Notifications" className={className} fill="#ed4956" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ) : (
    <svg aria-label="Notifications" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.437-.284-1.785-1.509-4.303-3.752C5.148 14.075 2.5 12.193 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.586-.516.877-.768 2.463-2.14 5.013-4.357 5.013-7.967 0-4.003-3.11-7.218-6.708-7.218Z" />
    </svg>
  )
);

export const CreateIcon: React.FC<{ filled?: boolean; className?: string }> = ({ filled, className = 'w-6 h-6' }) => (
  <svg aria-label="New post" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.699 4.946-1.608.908-.939 1.606-2.095 1.606-4.944V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.698 18.296 2 15.448 2H8.552c-2.848 0-4.006.698-4.946 1.607C2.698 4.546 2 5.704 2 8.552Zm18 0c0 2.502-.559 3.415-1.127 3.984-.57.57-1.482 1.128-3.985 1.128H8.552c-2.502 0-3.415-.558-3.984-1.128C4.001 15.415 3.443 14.502 3.443 12V8.552c0-2.503.558-3.416 1.127-3.985.57-.569 1.482-1.127 3.984-1.127h6.896c2.503 0 3.416.558 3.985 1.127.568.569 1.127 1.482 1.127 3.985Z" />
    <path d="M12 6.5a1 1 0 0 1 1 1V11h3.5a1 1 0 0 1 0 2H13v3.5a1 1 0 0 1-2 0V13H7.5a1 1 0 0 1 0-2H11V7.5a1 1 0 0 1 1-1Z" />
  </svg>
);

export const CommentIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg aria-label="Comment" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

export const SharePostIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg aria-label="Share Post" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="2" y2="10.083" />
    <polygon fill="none" points="11.698 20.334 22 2.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

export const BookmarkIcon: React.FC<{ filled?: boolean; className?: string }> = ({ filled, className = 'w-6 h-6' }) => (
  filled ? (
    <svg aria-label="Save" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z" />
    </svg>
  ) : (
    <svg aria-label="Save" className={className} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  )
);
