# 📖 FlipDrive

> Turn any Google Drive Folder or PDF into a responsive, zero-storage 3D e-magazine catalogue and flipbook reader with automatic reading progress resumption.

FlipDrive is a lightweight, responsive web application that connects directly to Google Drive. It allows users to link any folder of their choosing, automatically parses and indexes all PDF publications inside it, presents an interactive catalogue with live cover thumbnails and reading progress indicators, and opens publications in a realistic 3D flipbook reader with smooth page-curl physics and automatic progress bookmarking.

---

## ⚡ Key Capabilities

- **📁 Google Drive Linker:** Connect any Google Drive folder using either:
  1. **Direct Folder Link or ID:** Simply paste the share link of any folder (`https://drive.google.com/drive/folders/...`).
  2. **Google OAuth 2.0 & Drive Picker:** Sign in with Google and browse/select any folder interactively via Google's native Folder Picker dialog.
  3. **Instant Demo Collection:** Test the catalogue and reader with one click using curated public domain publications.
- **📚 Rich PDF Catalogue:** Automatically fetches all PDF files in the selected folder and displays:
  - High-resolution cover thumbnails with automatic dynamic fallback covers.
  - Publication title, file size (MB/KB), and last updated timestamps.
  - Real-time title search and multi-criteria sorting (Recently Read, Name A–Z, Name Z–A, Date Modified, File Size).
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

1. Go to [script.google.com](https://script.google.com/) and click **New project**.
2. Replace the contents of `Code.gs` with the script from [`GoogleAppsScript_Bridge.js`](GoogleAppsScript_Bridge.js):
   ```javascript
   function doGet(e) {
     try {
       var params = (e && e.parameter) ? e.parameter : {};
       var action = params.action;
       if (!action) {
         if (params.folderId || params.folder) action = 'list';
         else if (params.id) action = 'get';
       }

       // 1. List all PDF files in folder
       if (action === 'list' || params.folderId) {
         var folderId = params.folderId || params.folder;
         var folder = DriveApp.getFolderById(folderId);
         var filesIterator = folder.getFilesByType(MimeType.PDF);
         var files = [];
         while (filesIterator.hasNext()) {
           var f = filesIterator.next();
           files.push({
             id: f.getId(),
             name: f.getName(),
             sizeBytes: f.getSize(),
             updatedAt: f.getLastUpdated().toISOString(),
             thumbnailLink: "https://drive.google.com/thumbnail?id=" + f.getId() + "&sz=w400"
           });
         }
         var output = ContentService.createTextOutput(JSON.stringify({
           status: "success",
           folderId: folderId,
           folderName: folder.getName(),
           files: files
         }));
         output.setMimeType(ContentService.MimeType.JSON);
         return output;
       }

       // 2. Stream single file binary
       var file = DriveApp.getFileById(params.id);
       var blob = file.getBlob();
       var bytes = blob.getBytes();
       var output = ContentService.createTextOutput(JSON.stringify({
         status: "success",
         id: params.id,
         name: file.getName(),
         sizeBytes: bytes.length,
         base64: Utilities.base64Encode(bytes)
       }));
       output.setMimeType(ContentService.MimeType.JSON);
       return output;
     } catch (err) {
       var errOutput = ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }));
       errOutput.setMimeType(ContentService.MimeType.JSON);
       return errOutput;
     }
   }
   ```
3. Click **Deploy** $\rightarrow$ **New deployment**.
4. Configure the settings:
   - **Select type:** Web app (gear icon)
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone` *(Crucial: Do not select "Only myself" or "Anyone with a Google account")*
5. Click **Deploy**, approve permissions, and copy the **Web app URL** (ends in `/exec`).

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
   git commit -m "feat: google drive folder linker, pdf catalogue, and reading resumption"
   git push
   ```
4. Enable GitHub Pages in your repository:
   - Go to **Settings** $\rightarrow$ **Pages**.
   - Under **Build and deployment > Source**, choose **Deploy from a branch** (`main` / `root`).

---

## 📁 Linking a Google Drive Folder

1. Open your Google Drive, right-click the folder containing your PDFs, and select **Share** $\rightarrow$ set access to **"Anyone with the link can view"**.
2. Copy the folder link:
   ```text
   https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs?usp=sharing
   ```
3. In FlipDrive:
   - Click **"Link Folder"** in the top navigation or click **"Paste Folder Link"**.
   - Paste the folder URL or ID and click **"Fetch PDF Catalogue"**.
   - FlipDrive instantly loads all PDFs into your catalogue and saves the folder for your next visit!

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
| `?folder=FOLDER_ID` | `index.html?folder=1BxiMVs...` | Opens catalogue directly for that folder. |
| `?id=FILE_ID` | `index.html?id=1pt1pt...` | Opens reader directly for that publication. |
| `?id=FILE_ID&page=14` | `index.html?id=1pt1pt...&page=14` | Opens reader directly at Page 14. |

---

## 🛠️ Built With

- [Turn.js](http://www.turnjs.com/) – Realistic 3D flipbook animation engine.
- [PDF.js](https://mozilla.github.io/pdf.js/) – High-DPI browser PDF rendering.
- [Google Apps Script](https://developers.google.com/apps-script) – Zero-storage binary streaming and folder indexing bridge.
- [Google Identity Services](https://developers.google.com/identity/gsi/web) – Secure OAuth 2.0 authorization and native Google Picker integration.

---

## 📄 License

MIT License. Free for personal and commercial use.
