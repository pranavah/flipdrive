# 📖 FlipDrive

> Turn any Google Drive Folder or PDF into a responsive, zero-storage 3D e-magazine catalogue and flipbook reader with recursive subfolder categories and automatic reading progress resumption.

FlipDrive is a lightweight, responsive web application that connects directly to Google Drive. It allows users to link any folder of their choosing, automatically parses and recursively indexes all PDF publications inside it (including nested subfolders mapped directly to categories), presents an interactive categorized catalogue with live cover thumbnails and reading progress indicators, and opens publications in a realistic 3D flipbook reader with smooth page-curl physics and automatic progress bookmarking.

---

## ⚡ Key Capabilities

- **📁 Google Drive Linker:** Connect any Google Drive folder using either:
  1. **Direct Folder Link or ID:** Simply paste the share link of any folder (`https://drive.google.com/drive/folders/...`).
  2. **Google OAuth 2.0 & Drive Picker:** Sign in with Google and browse/select any folder interactively via Google's native Folder Picker dialog.
  3. **Instant Demo Collection:** Test the catalogue and reader with one click using curated public domain publications.
- **🗂️ Recursive Subfolder Indexing & Categories:**
  - Recursively discovers all PDF files across the main folder and any depth of subfolders.
  - Automatically maps subfolders into **interactive category chips** (`All`, `Main`, `Category A`, `Category B / Subcategory`).
  - Category tags on each publication card for 1-click filtering.
  - Real-time search across publication titles and category names.
  - Category / Subfolder grouping and sorting option.
- **📚 Rich PDF Catalogue:**
  - High-resolution cover thumbnails with automatic dynamic fallback covers.
  - Publication title, file size (MB/KB), and last updated timestamps.
  - Real-time title search and multi-criteria sorting (Recently Read, Category, Name A–Z, Name Z–A, Date Modified, File Size).
  - Visual status badges: `Unread`, `Page X / Y (Z%)`, and `Completed ✓`.
- **📖 Smart Reading Resumption:** Remembers where the user left off across browser sessions using `localStorage`:
  - Visual progress bar and resume button right on each catalogue card (`Resume (p. 14)`).
  - Prominent **"Continue Reading"** shelf at the top of the catalogue showcasing active publications.
  - Automatically turns to the saved page when opened, accompanied by a non-intrusive resume notification toast with a 1-click option to restart at Page 1.
  - Dynamically updates the saved page as the user flips through the book.
- **✨ Realistic 3D Flipbook:** Page-turning physics, drop shadows, responsive single/double page layout, keyboard shortcuts (`←`/`→`), jump-to-page input, and fullscreen mode.
- **🚀 Zero Build Step & Zero Hosting Cost:** Works purely with vanilla HTML, CSS, JavaScript, PDF.js, and Turn.js — fully compatible with GitHub Pages or static web servers.

---

## 🚀 Quick Setup Guide

### Step 1: Deploy the Google Apps Script Bridge (1 Minute)

Because Google Drive restricts raw cross-origin binary downloads and folder indexing from external client scripts, a Google Apps Script Web App serves as a zero-cost private bridge.

1. Go to [script.google.com](https://script.google.com/) and click **New project** (or open your existing project).
2. Replace all contents of `Code.gs` with the code from [`GoogleAppsScript_Bridge.js`](GoogleAppsScript_Bridge.js).
3. Click **Deploy** $\rightarrow$ **Manage deployments** $\rightarrow$ **Edit (pencil icon)**.
   - If deploying for the first time, click **Deploy** $\rightarrow$ **New deployment** $\rightarrow$ select **Web app**.
4. Configure the settings:
   - **Version:** Select **New version** (Crucial: Google requires a new version for code changes to take effect)
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone` *(Crucial: Do not select "Only myself" or "Anyone with a Google account")*
5. Click **Deploy**, approve permissions if prompted, and copy the **Web app URL** (ends in `/exec`).

> **Tip:** In FlipDrive, you can paste this URL into the **Settings (⚙)** modal or the **Bridge Update** prompt at any time to immediately connect your Drive library.
>
> Large PDFs are downloaded through authenticated, 512 KB Drive API ranges to avoid Apps Script's whole-file blob limit and keep each response small. After updating the bridge code, approve any requested Google permissions (including external requests), deploy a **new version**, and keep **Execute as: Me** so the bridge can access your Drive files.

---

### Step 2: Configure & Host on GitHub Pages

1. Clone or download this repository:
   ```bash
   git clone https://github.com/pranavah/flipdrive.git
   cd flipdrive
   ```
2. Open `index.html` and update `DEFAULT_GAS_ENDPOINT` (around line 527) with your Web App URL, or configure it dynamically via the **Settings (⚙)** modal inside the web interface.
3. Commit and push:
   ```bash
   git add index.html GoogleAppsScript_Bridge.js readme.md
   git commit -m "feat: recursive subfolders as categories and enhanced gas bridge"
   git push
   ```
4. Enable GitHub Pages in your repository:
   - Go to **Settings** $\rightarrow$ **Pages**.
   - Under **Build and deployment > Source**, choose **Deploy from a branch** (`main` / `root`).

---

## 📁 Linking a Google Drive Folder

1. Open your Google Drive, right-click the folder containing your PDFs and subfolders, and select **Share** $\rightarrow$ set access to **"Anyone with the link can view"**.
2. Copy the folder link:
   ```text
   https://drive.google.com/drive/folders/18QEJunaB1jtsFct9FBnOduENWIDlZUE3?usp=sharing
   ```
3. In FlipDrive:
   - Click **"Link Folder"** in the top navigation or click **"Paste Folder Link"**.
   - Paste the folder URL or ID and click **"Fetch PDF Catalogue"**.
   - FlipDrive recursively traverses all subfolders, categorizes them, and renders your library!

---

## 🔖 Reading Progress & Smart Resume

- **Continuous Tracking:** Every page flip is automatically synchronized to your local browser storage.
- **Catalogue Badges:** Cards indicate `Unread`, `Page X / Y (Z%)`, or `Completed ✓`.
- **Continue Reading Shelf:** A highlighted top shelf displays the publication you were most recently reading.
- **One-Click Resume:** Click **"Resume (p. 14)"** on any card or notification to resume reading exactly where you left off.
- **Restart Option:** Click the restart icon or toast prompt to jump back to Page 1 at any time.

---

## 🧩 Direct Linking & URL Parameters

You can link directly to specific folders or publications:

| Parameter | Example | Purpose |
| :--- | :--- | :--- |
| `?folder=FOLDER_ID` | `index.html?folder=18QEJunaB1jtsFct9FBnOduENWIDlZUE3` | Opens catalogue directly for that folder. |
| `?id=FILE_ID` | `index.html?id=1pt1pt...` | Opens reader directly for that publication. |
| `?id=FILE_ID&page=14` | `index.html?id=1pt1pt...&page=14` | Opens reader directly at Page 14. |

---

## 🛠️ Built With

- [Turn.js](http://www.turnjs.com/) – Realistic 3D flipbook animation engine.
- [PDF.js](https://mozilla.github.io/pdf.js/) – High-DPI browser PDF rendering.
- [Google Apps Script](https://developers.google.com/apps-script) – Zero-storage binary streaming and recursive folder indexing bridge.
- [Google Identity Services](https://developers.google.com/identity/gsi/web) – Secure OAuth 2.0 authorization and native Google Picker integration.

---

## 📄 License

MIT License. Free for personal and commercial use.
