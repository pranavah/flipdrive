# 📖 FlipDrive

> Turn any Google Drive PDF into an interactive, zero-storage e-magazine or e-book flipbook.

FlipDrive is a lightweight, responsive flipbook reader designed to host and render PDFs stored directly in Google Drive. By serving PDFs straight from Drive, it uses zero hosting storage and works out-of-the-box across desktops, tablets, and smartphones.

---

## ⚡ Features

- **Zero Host Storage:** Stream documents directly from public Google Drive links.
- **Realistic Page-Flip Experience:** Powered by Turn.js and PDF.js.
- **Adaptive Layout:** Automatically switches between a two-page magazine layout on desktops and a single-page swipeable view on mobile.
- **Multi-Platform Embedding:** Ready-to-use `iframe` embeds and a companion WordPress shortcode plugin.
- **Zero Build Tools:** Pure vanilla HTML, CSS, and JavaScript—hostable directly on GitHub Pages.

---

## 🚀 Quick Start (GitHub Pages)

### 1. Fork or Clone the Repo

```bash
git clone https://github.com/<YOUR_USERNAME>/flipdrive.git
cd flipdrive
```

### 2. Enable GitHub Pages

1. Navigate to **Settings** → **Pages** in your repository.
2. Under **Build and deployment > Source**, select **Deploy from a branch**.
3. Choose branch: `main` and folder: `/ (root)`.
4. Click **Save**.

Your reader is now live at:
```text
https://<YOUR_USERNAME>.github.io/flipdrive/?id=GOOGLE_DRIVE_FILE_ID
```

---

## 📁 Preparing Google Drive PDFs

To allow FlipDrive to render your PDF:

1. Upload your PDF to Google Drive.
2. Right-click the file (or the parent folder) → select **Share**.
3. Change **General access** to **Anyone with the link** and ensure the role is set to **Viewer**.
4. Copy the file URL (e.g., `https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9/view?usp=sharing`).
5. Extract the file ID between `/d/` and `/view` (in this case: `1a2b3c4d5e6f7g8h9`).

---

## 🧩 Embedding Options

### 1. Responsive HTML iFrame (Any Site)

Add this snippet to Notion, Webflow, Squarespace, Wix, or custom HTML:

```html
<div style="position: relative; width: 100%; max-width: 960px; aspect-ratio: 4 / 3; margin: auto;">
  <iframe 
    src="https://<YOUR_USERNAME>.github.io/flipdrive/?id=GOOGLE_DRIVE_FILE_ID" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.2);" 
    allowfullscreen>
  </iframe>
</div>
```

---

### 2. WordPress Plugin & Shortcode

A custom companion WordPress plugin is included to simplify embeds.

#### Installation

1. Copy the plugin folder into your WordPress site:
   ```text
   wp-content/plugins/ebook-drive-reader/
   ```
2. Activate the plugin via **Plugins → Installed Plugins** in the WordPress admin panel.

#### Shortcode Usage

Embed any document inside standard blocks or Elementor:

```text
[ebook_reader reader="https://<YOUR_USERNAME>.github.io/flipdrive/" id="GOOGLE_DRIVE_FILE_ID" height="700px"]
```

#### Shortcode Parameters

| Parameter | Default | Description |
| :--- | :--- | :--- |
| `id` | *(Required)* | The Google Drive file ID. |
| `reader` | `https://yourdomain.com/reader.html` | Base URL of your deployed FlipDrive reader. |
| `width` | `100%` | CSS width of the embed container. |
| `height` | `650px` | CSS height of the embed container. |

---

## 🛠️ Tech Stack

- **[PDF.js](https://mozilla.github.io/pdf.js/)** – Client-side PDF rendering.
- **[Turn.js](http://www.turnjs.com/)** – Realistic page-turn animations.
- **[jQuery](https://jquery.com/)** – DOM and event manipulation.

---

## 📄 License

MIT License. Free to use and customize for personal and commercial projects.