/**
 * Supabase Online Safe Database Client
 * 
 * SECURITY NOTICE:
 * Keys are loaded from environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
 * or private local browser settings, and are NEVER hardcoded or committed to GitHub.
 * 
 * Row Level Security (RLS) is enforced on all 22 PostgreSQL tables:
 * Only auth.uid() = user_id can read, write, or delete.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

const LOCAL_KEY = 'little_days_supabase_config';

function loadConfig(): SupabaseConfig {
  let envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  let envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  // Check local override if user entered keys in Settings modal
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        envUrl = parsed.url;
        envKey = parsed.anonKey;
      }
    }
  } catch (e) {
    // ignore
  }

  const isConfigured = Boolean(
    envUrl &&
    envKey &&
    !envUrl.includes('your-supabase-project') &&
    envUrl.startsWith('http')
  );

  return {
    url: envUrl,
    anonKey: envKey,
    isConfigured
  };
}

export const supabaseConfig: SupabaseConfig = loadConfig();

export function saveLocalSupabaseConfig(url: string, anonKey: string) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ url, anonKey }));
    supabaseConfig.url = url;
    supabaseConfig.anonKey = anonKey;
    supabaseConfig.isConfigured = Boolean(url && anonKey && url.startsWith('http'));
  } catch (e) {
    console.error('Failed to save Supabase config locally', e);
  }
}

// Safe request helper to PostgreSQL REST API
export async function supabaseRequest(endpoint: string, options: RequestInit = {}) {
  if (!supabaseConfig.isConfigured) {
    return null;
  }

  try {
    const res = await fetch(`${supabaseConfig.url}/rest/v1/${endpoint}`, {
      ...options,
      headers: {
        'apikey': supabaseConfig.anonKey,
        'Authorization': `Bearer ${supabaseConfig.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn(`Supabase API request warning (${res.status}):`, err);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn('Network error reaching Supabase cloud database:', err);
    return null;
  }
}

// Cloud Sync Helpers
export const cloudDatabase = {
  async syncPost(post: any) {
    if (!supabaseConfig.isConfigured) return;
    return supabaseRequest('posts', {
      method: 'POST',
      body: JSON.stringify(post)
    });
  },

  async syncJournal(journal: any) {
    if (!supabaseConfig.isConfigured) return;
    return supabaseRequest('journal_entries', {
      method: 'POST',
      body: JSON.stringify(journal)
    });
  },

  async syncStory(story: any) {
    if (!supabaseConfig.isConfigured) return;
    return supabaseRequest('stories', {
      method: 'POST',
      body: JSON.stringify(story)
    });
  },

  async syncMood(mood: any) {
    if (!supabaseConfig.isConfigured) return;
    return supabaseRequest('mood_logs', {
      method: 'POST',
      body: JSON.stringify(mood)
    });
  },

  async syncMoodboard(moodboard: any) {
    if (!supabaseConfig.isConfigured) return;
    return supabaseRequest('moodboards', {
      method: 'POST',
      body: JSON.stringify(moodboard)
    });
  }
};
