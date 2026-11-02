/**
 * Supabase Online Safe Database Client
 * 
 * SECURITY NOTICE:
 * Keys are loaded from environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
 * and are NEVER hardcoded or committed to GitHub.
 * 
 * Row Level Security (RLS) is enforced on all 22 PostgreSQL tables:
 * Only auth.uid() = user_id can read, write, or delete.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseConfig: SupabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  isConfigured: Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase-project'))
};

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
    return supabaseRequest('journals', {
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
  }
};
