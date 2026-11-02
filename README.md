# MyMemories 📸 — Private Visual Memory Archive

> **"Your life deserves a place of its own. Not everything needs to be posted for other people."**

A private personal memory and diary application crafted as a **pixel-perfect Instagram clone** with zero social pressure, zero public algorithms, and no public followers. Built strictly to PRD v1.0 specifications.

🔗 **GitHub Repository**: [https://github.com/SumanaChoudhury/little-days](https://github.com/SumanaChoudhury/little-days)

---

## 🌟 Core Highlights & Instagram Experience

- **Clean Slate Privacy (No Dummy Data)**: Starts with a clean Instagram authentication screen (Sign Up / Log In). No pre-created accounts, no fake photos or stories.
- **Account Lifecycle & Data Purge**: Complete Sign Up, Sign In, Log Out, and full irreversible **Delete Account** that purges all local & cloud records.
- **Camera Capture ("Click Pics")**: Real-time webcam and smartphone camera capture with instant shutter, camera flip, and preview.
- **Stories & Highlights**: Ephemeral 24h stories tray with the iconic Instagram gradient ring, fullscreen story viewer, and permanent named Story Highlights (`College`, `Travel`, `Little Joys`, etc.).
- **Interactive Feed**: High-resolution multi-photo/video carousels, double-tap popping heart (❤️), private reflection notes, mood tags, and uppercase chronological timestamps.
- **Personal Diary**: Rich-text journal with daily prompts, mood tracking, and **live microphone voice note recording**.
- **Discovery Hub**:
  - *On This Day* flashbacks.
  - *Random Memory* instant surprise.
  - *Slideshow Rewind* memory player.
  - *Time Capsules* locked until future dates.
  - *Letters to Future Me*.
  - *Printable Digital Photo Book* generator.
  - *Duplicate Photo Scanner* based on file hashes.
- **Moodboards & Scrapbook**: Interactive canvas for stickers, polaroid photos, and journal sticky notes.
- **Smart 90-Day Cold Vault**: Automatically groups memories older than 90 days into monthly ZIP bundles with sha256 checksum manifests using `JSZip`.

---

## 🔒 Safe Online Database Architecture (Supabase PostgreSQL)

Security is guaranteed by design to ensure **database keys are never disclosed**:

1. **Row Level Security (RLS)**:
   - All 22 relational tables enforce `auth.uid() = user_id`.
   - Even with a public Anon key, no user or third party can access, query, or modify another person's records.
2. **Zero Hardcoded Secrets**:
   - Keys are loaded strictly from environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
   - `.gitignore` prevents `.env` or any secret from ever being committed to GitHub.
3. **In-App Local Configuration**:
   - Users can safely enter their Supabase credentials directly within the app's **Settings & Privacy** modal. Credentials remain confined to the user's local browser storage.
4. **Database Schema**:
   - `supabase_schema.sql` contains the complete production-grade DDL for all 22 tables, foreign keys, cascade deletes, RLS policies, and performance indexes.

---

## 🚀 Deploying to Render in 2 Minutes

This project includes a pre-configured `render.yaml` blueprint for zero-config Render Static Site deployment.

### Option 1: Automatic Blueprint (Recommended)
1. Go to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub account and select the `SumanaChoudhury/little-days` repository.
4. Render will read `render.yaml` automatically:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **SPA Routing**: Automatic rewrite (`/* -> /index.html`)
5. When prompted for Environment Variables, optionally enter your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (or leave blank to use the built-in encrypted local vault).
6. Click **Apply**. Your app is live with a free HTTPS URL!

### Option 2: Manual Static Site
1. On Render, click **New +** -> **Static Site**.
2. Select `SumanaChoudhury/little-days`.
3. Set the following:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. In **Redirects / Rewrites**, add:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
5. Click **Create Static Site**.

---

## 🛠️ Local Development

```powershell
# Clone the repository
git clone https://github.com/SumanaChoudhury/little-days.git
cd little-days

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` to test the app locally.

---

## 📱 Mobile App (Android & iOS via Capacitor)

```powershell
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "little days" com.sumana.littledays --web-dir dist
npm run build
npx cap add android
npx cap add ios
npx cap open android
```

---

## 📜 License

MIT License. Designed with love for private, lifelong memory preservation.
