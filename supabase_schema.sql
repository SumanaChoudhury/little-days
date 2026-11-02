-- =========================================================================
-- little days. - Supabase PostgreSQL Schema & Security Blueprint
-- PRD Version 1.0 - All 22 Core Database Entities with Row Level Security (RLS)
-- =========================================================================

create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  username text unique not null,
  full_name text,
  bio text,
  avatar_url text,
  website text,
  theme_preset text default 'gallery',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Posts Table
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  caption text,
  date date not null default current_date,
  location text,
  mood text,
  is_liked boolean default false,
  is_bookmarked boolean default false,
  is_archived boolean default false,
  is_pinned boolean default false,
  tags text[] default '{}',
  collections text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Media Items Table
create table if not exists public.media (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  file_path text not null,
  media_type text check (media_type in ('image', 'video')) not null default 'image',
  aspect_ratio text default 'square',
  file_size bigint,
  file_name text,
  checksum text,
  order_index integer default 0,
  is_archived boolean default false,
  archive_bundle text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Stories Table
create table if not exists public.stories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  media_url text not null,
  media_type text check (media_type in ('image', 'video')) not null default 'image',
  caption text,
  highlight_category text,
  seen boolean default false,
  expires_at timestamp with time zone default (timezone('utc'::text, now()) + interval '24 hours'),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Story Highlights Table
create table if not exists public.story_highlights (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  cover_url text,
  story_ids uuid[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Personal Journals Table (PRD 3.3)
create table if not exists public.journals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null default current_date,
  title text not null,
  content text not null,
  prompt text,
  mood text,
  voice_note_url text,
  photos text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Voice Notes Table (PRD 3.3)
create table if not exists public.voice_notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  journal_id uuid references public.journals(id) on delete cascade,
  audio_url text not null,
  duration integer,
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Moods Tracking Table (PRD 3.4)
create table if not exists public.moods (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null default current_date,
  mood text not null,
  emoji text not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Collections Table (PRD 3.6)
create table if not exists public.collections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  cover_url text,
  description text,
  is_highlight boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Collection Posts Table (PRD 3.6)
create table if not exists public.collection_posts (
  collection_id uuid references public.collections(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (collection_id, post_id)
);

-- 11. Moodboards Table (PRD 3.6)
create table if not exists public.moodboards (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  background_color text default '#FAF8F5',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Moodboard Elements Table (PRD 3.6)
create table if not exists public.moodboard_elements (
  id uuid primary key default uuid_generate_v4(),
  moodboard_id uuid references public.moodboards(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  element_type text check (element_type in ('image', 'text', 'sticker')) not null,
  content text not null,
  x_pos real not null default 0,
  y_pos real not null default 0,
  rotation real default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. Tags Table
create table if not exists public.tags (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, name)
);

-- 14. Post Tags Table
create table if not exists public.post_tags (
  post_id uuid references public.posts(id) on delete cascade not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  primary key (post_id, tag_id)
);

-- 15. Locations Table
create table if not exists public.locations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  latitude double precision,
  longitude double precision,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 16. People Table (PRD 4.1)
create table if not exists public.people (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  avatar_url text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 17. Media People Table (PRD 4.1)
create table if not exists public.media_people (
  media_id uuid references public.media(id) on delete cascade not null,
  person_id uuid references public.people(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  primary key (media_id, person_id)
);

-- 18. Time Capsules Table (PRD 3.8)
create table if not exists public.time_capsules (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  media_urls text[] default '{}',
  unlock_date date not null,
  is_locked boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 19. Future Letters Table (PRD 3.8)
create table if not exists public.future_letters (
  id uuid primary key default uuid_generate_v4(),
  user_id references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  delivery_date date not null,
  is_delivered boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 20. Archives Table (PRD 3.9)
create table if not exists public.archives (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  month_year text not null,
  file_name text not null,
  file_path text,
  item_count integer not null default 0,
  total_bytes bigint not null default 0,
  checksum text,
  status text check (status in ('ready', 'archived', 'verified')) default 'archived',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 21. Archive Entries Table (PRD 3.9)
create table if not exists public.archive_entries (
  archive_id uuid references public.archives(id) on delete cascade not null,
  media_id uuid references public.media(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  original_path text not null,
  entry_path_in_zip text not null,
  checksum text,
  primary key (archive_id, media_id)
);

-- 22. Device Sessions Table (PRD 3.11)
create table if not exists public.device_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  device_name text,
  platform text check (platform in ('android', 'ios', 'web')),
  last_active timestamp with time zone default timezone('utc'::text, now()) not null,
  is_revoked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Privacy Rule: Only auth.uid() = user_id can SELECT, INSERT, UPDATE, DELETE
-- =========================================================================

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.media enable row level security;
alter table public.stories enable row level security;
alter table public.story_highlights enable row level security;
alter table public.journals enable row level security;
alter table public.voice_notes enable row level security;
alter table public.moods enable row level security;
alter table public.collections enable row level security;
alter table public.collection_posts enable row level security;
alter table public.moodboards enable row level security;
alter table public.moodboard_elements enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.locations enable row level security;
alter table public.people enable row level security;
alter table public.media_people enable row level security;
alter table public.time_capsules enable row level security;
alter table public.future_letters enable row level security;
alter table public.archives enable row level security;
alter table public.archive_entries enable row level security;
alter table public.device_sessions enable row level security;

-- Owner-only generic policy for all tables
do $$
declare
  t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('drop policy if exists "Owner only access" on public.%I;', t);
    execute format('create policy "Owner only access" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id);', t);
  end loop;
end $$;

-- High performance indexes
create index if not exists idx_posts_user_date on public.posts(user_id, date desc);
create index if not exists idx_media_post_id on public.media(post_id);
create index if not exists idx_stories_user on public.stories(user_id, created_at desc);
create index if not exists idx_journals_user_date on public.journals(user_id, date desc);
create index if not exists idx_moods_user_date on public.moods(user_id, date desc);
