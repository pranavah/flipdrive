# 📖 FlipDrive

> Turn any Google Drive PDF into a responsive, zero-storage 3D e-magazine or e-book flipbook.

FlipDrive is a lightweight, responsive flipbook reader designed to host and render PDFs stored directly in Google Drive. By using client-side rendering alongside a dedicated Google Apps Script bridge, it consumes zero hosting storage, bypasses cross-origin restrictions, and works across desktops, tablets, and mobile devices.

---

## ⚡ Features

- **Zero Host Storage:** Stream publications directly from your Google Drive files without storing extra copies on your server.
- **Realistic 3D Page-Flip:** Smooth page-curl physics, shadows, and touch/mouse-drag gestures powered by Turn.js and PDF.js.
- **Adaptive Multi-Device Layout:** Automatic two-page magazine spread on desktops/tablets and single-page swipe view on smartphones.
- **Reliable Google Drive Stream:** Native Google Apps Script bridge prevents CORS blockages and anti-bot rate-limits.
- **Embed Ready:** Native HTML iframe templates and a plug-and-play WordPress shortcode plugin.
- **Zero Build Step:** Hosted completely for free via GitHub Pages using vanilla HTML, CSS, and JavaScript.

---

## 🚀 Quick Setup Guide

### Step 1: Deploy the Google Apps Script Bridge (1 Minute)

Because Google Drive restricts raw binary downloads from external scripts, a simple Google Apps Script Web App serves as a zero-cost, private bridge.

1. Go to [script.google.com](https://script.google.com/) and click **New project**.
2. Replace the contents of `Code.gs` with the script from [`GoogleAppsScript_Bridge.js`](GoogleAppsScript_Bridge.js):
   ```javascript
   function doGet(e) {
     var output;
     try {
       var fileId = e.parameter.id;
       if (!fileId) {
         output = ContentService.createTextOutput(JSON.stringify({ 
           status: "error", 
           message: "Missing 'id' parameter." 
         }));
         output.setMimeType(ContentService.MimeType.JSON);
         return output;
       }

       var file = DriveApp.getFileById(fileId);
       var blob = file.getBlob();
       var bytes = blob.getBytes();
       var base64Data = Utilities.base64Encode(bytes);

       var payload = {
         status: "success",
         id: fileId,
         name: file.getName(),
         sizeBytes: bytes.length,
         mimeType: blob.getContentType(),
         base64: base64Data
       };

       output = ContentService.createTextOutput(JSON.stringify(payload));
       output.setMimeType(ContentService.MimeType.JSON);
       return output;
     } catch (err) {
       output = ContentService.createTextOutput(JSON.stringify({ 
         status: "error", 
         message: err.toString() 
       }));
       output.setMimeType(ContentService.MimeType.JSON);
       return output;
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
2. Open `index.html` and paste your Web App URL into `DEFAULT_GAS_ENDPOINT` (around line 166):
   ```javascript
   const DEFAULT_GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
3. Commit and push the changes:
   ```bash
   git add index.html
   git commit -m "feat: configure default GAS endpoint"
   git push
   ```
4. Enable GitHub Pages:
   - Go to your repository **Settings** $\rightarrow$ **Pages**.
   - Under **Build and deployment > Source**, choose **Deploy from a branch**.
   - Select branch **`main`** and folder **`/ (root)`**, then click **Save**.

Your live reader will be available at:
```text
https://pranavah.github.io/flipdrive/?id=GOOGLE_DRIVE_FILE_ID
```

---

## 📁 Preparing Google Drive PDFs

1. Upload your PDF to Google Drive.
2. Right-click the file $\rightarrow$ select **Share** $\rightarrow$ change access to **Anyone with the link** with the role **Viewer**.
3. Copy the link:
   ```text
   https://drive.google.com/file/d/1pt...1g/view?usp=sharing
   ```
4. The segment between `/d/` and `/view` is your file ID:
   ```text
   1pt1pt...1g
   ```

---

## 🧩 Embedding Publications

### 1. Standard HTML Embed (Wix, Squarespace, Webflow, Notion)

Insert this responsive container snippet into any website:

```html
<div style="position: relative; width: 100%; max-width: 980px; aspect-ratio: 4 / 3; margin: 20px auto;">
  <iframe 
    src="https://pranavah.github.io/flipdrive/?id=GOOGLE_DRIVE_FILE_ID" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.3);" 
    allowfullscreen>
  </iframe>
</div>
```

---

### 2. WordPress Integration

A lightweight custom plugin allows embedding via shortcodes.

#### Installation
1. Create a directory named `ebook-drive-reader` in `wp-content/plugins/`.
2. Place `ebook-drive-reader.php` inside this folder.
3. Activate the plugin in **WordPress Admin** $\rightarrow$ **Plugins**.

#### Shortcode Example
```text
[ebook_reader id="11pt...1g" height="700px"]
```

#### Shortcode Parameters

| Parameter | Default | Description |
| :--- | :--- | :--- |
| `id` | *(Required)* | Google Drive File ID. |
| `reader` | `https://pranavah.github.io/flipdrive/` | Hosted reader URL on GitHub Pages. |
| `width` | `100%` | CSS width of the player frame. |
| `height` | `650px` | CSS height of the player frame. |

---

## 🔧 Troubleshooting

| Error | Root Cause | Solution |
| :--- | :--- | :--- |
| **`Failed to fetch`** | Apps Script Web App permissions restricted to "Only myself". | Go to **Deploy** $\rightarrow$ **Manage deployments** $\rightarrow$ **Edit**, set **Who has access** to **`Anyone`**, select **New version**, and redeploy. |
| **`Script function not found`** | The pasted link ends in `/edit` or `/dev`. | Use the production deployment link ending with `/exec`. |
| **`File not accessible`** | Google Drive permissions are set to Restricted. | Set the PDF file/folder sharing to **"Anyone with the link can view"**. |

---

## 🛠️ Built With

- [Turn.js](http://www.turnjs.com/) – Realistic 3D flipbook animation engine.
- [PDF.js](https://mozilla.github.io/pdf.js/) – In-browser PDF parsing and canvas rendering.
- [Google Apps Script](https://developers.google.com/apps-script) – Zero-storage binary streaming bridge.

---

## 📄 License

MIT License. Free for personal and commercial use.