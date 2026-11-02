# little days. 📸 — Private Visual Memory Archive

> **"Your life deserves a place of its own. Not everything needs to be posted for other people."**

A private personal social media application designed to look and feel like **Instagram**, built specifically for your personal memories, photo/video archives, and journal reflections.

---

## ✨ Features & Instagram Design

- **Authentic Instagram UI/UX**:
  - **Top Bar**: "little days." editorial logo script, unread memory activity badge, private reflection inbox, dark/light theme switch, and mobile frame preview toggle.
  - **Stories Tray**: Horizontal circular story avatars with the iconic Instagram gradient ring (`Today`, `College`, `Travel`, `Little Joys`, and `+` to add new stories).
  - **Fullscreen Story Viewer**: Segmented progress bars, tap navigation (prev/next), hold-to-pause, and reaction heart.
  - **Feed Posts**:
    - High-resolution photos & video support.
    - Multi-media carousels with swipeable arrows and pagination dots (`1/3`).
    - **Double-Tap Animated Heart ❤️**: Double tapping anywhere on a photo pops up an animated heart and favorites the post!
    - Like button, bookmarking, share/export options.
    - **Personal Reflection Notes**: Private journal reflections attached to any post.
    - Mood tag indicators (`✨ peaceful`, `☕ cozy`, `🌸 joyful`, `⚡ chaotic`).
    - Post date selector & location tags.
  - **Instagram Explore & Calendar**:
    - Search by caption, `#tags`, locations, and dates.
    - **"On This Day" Flashback Banner**: Surfaces past memories from previous years or months.
    - **Interactive Memory Calendar**: Select any day of the month to view photo thumbnails and filter memories from that day.
    - Filter chips: All, Favorites, Photos, Videos.
  - **Instagram Profile**:
    - User avatar with gradient ring, customizable bio, and memories/photos/videos counters.
    - Story highlights tray (`College 🎓`, `Travel ✈️`, `Cafés ☕`, `Little Joys 🌸`).
    - Signature **3×3 Photo Grid**, Saved/Bookmarked memories tab, and Timeline view.
    - Edit Profile modal (customize username, full name, bio, and avatar).

---

## 📦 Smart Memory Archiving (90-Day Cold Vault)

As designed in the product specification:
1. **Hot Storage (0–90 days)**: Original high-resolution photos and videos are kept readily accessible for instant viewing and sharing.
2. **Cold Storage (90+ days)**: Older media is packaged into monthly `.zip` archives (e.g. `Summer_Archive.zip`, `July_Archive.zip`).
3. **Feed Integrity**: Thumbnails, captions, dates, moods, reflection notes, and collections remain permanently visible in your feed and grid, even when original media is archived.
4. **Export & Restoration**:
   - One-click "Bundle Memories into Monthly ZIP" using client-side `JSZip`.
   - Download the complete `.zip` bundle containing full-res media and a structured `manifest.json`.
   - Restore any memory back to the active tier with 1 tap.

---

## 🚀 Running the App Locally

To start the development server:

```powershell
# In the project directory (c:\Users\sumana\Desktop\insta)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📱 Mobile App (Android & iOS)

This app is built with modern responsive web standards and can be converted into native Android and iOS apps in 2 minutes using **Capacitor**:

```powershell
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# 2. Initialize Capacitor
npx cap init "little days" com.sumana.littledays --web-dir dist

# 3. Build web assets
npm run build

# 4. Add Android and iOS platforms
npx cap add android
npx cap add ios

# 5. Open in Android Studio or Xcode
npx cap open android
```

---

## ☁️ Connecting Supabase Cloud Storage & Auth

The project works 100% offline using persistent browser storage out of the box. To enable cloud synchronization with Supabase:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in Supabase and run all queries from `supabase_schema.sql`.
3. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Row Level Security (RLS) is automatically configured so that **only your authenticated account** (`auth.uid() = user_id`) can read or write any memory, story, or media item.
