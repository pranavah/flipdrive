/**
 * FlipDrive - Google Apps Script Ultra-Reliable Bridge & Drive Linker
 * 
 * Instructions:
 * 1. Open https://script.google.com/ and create or open your project.
 * 2. Replace Code.gs with this code and save (Ctrl+S).
 * 3. Click Deploy -> Manage deployments -> Edit (pencil icon).
 * 4. Under Version, select "New version", then click Deploy.
 * 5. Ensure "Who has access" is set to "Anyone".
 * 6. Copy the Web app URL (ends in /exec).
 *
 * Supported Actions:
 * - action=list & folderId=... : Recursively lists all PDF files in folder and subfolders with categories, thumbnails & metadata
 * - action=get & id=... (or ?id=...) : Streams binary base64 data and direct download URL of a PDF file
 */

function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action;
    
    // Auto-detect action if not explicitly provided
    if (!action) {
      if (params.folderId || params.folder) {
        action = 'list';
      } else if (params.id) {
        action = 'get';
      } else {
        return createJsonResponse({
          status: "error",
          message: "No action specified. Provide 'folderId' to fetch PDF catalogue, or 'id' to read a file."
        });
      }
    }

    // 1. RECURSIVE LIST OF PDF FILES IN FOLDER & SUBFOLDERS
    if (action === 'list' || params.folderId || params.folder) {
      var folderId = params.folderId || params.folder;
      if (!folderId) {
        return createJsonResponse({ 
          status: "error", 
          message: "Missing 'folderId' parameter. Pass ?folderId=YOUR_DRIVE_FOLDER_ID" 
        });
      }

      var rootFolder;
      try {
        rootFolder = DriveApp.getFolderById(folderId);
      } catch (fErr) {
        return createJsonResponse({ 
          status: "error", 
          message: "Folder not accessible. Ensure folder sharing is set to 'Anyone with the link can view'." 
        });
      }

      var filesList = [];
      var categoryStats = {};
      var maxDepth = 6;
      var maxFiles = 1000;

      // Recursive scanner for folder and its subfolders
      function scanFolder(currentFolder, categoryPath, currentDepth) {
        if (currentDepth > maxDepth || filesList.length >= maxFiles) return;

        var catName = categoryPath || "Main";
        if (!categoryStats[catName]) {
          categoryStats[catName] = 0;
        }

        // A. Process files in current folder
        try {
          var filesIter = currentFolder.getFiles();
          while (filesIter.hasNext() && filesList.length < maxFiles) {
            try {
              var file = filesIter.next();
              var fileName = file.getName();
              var mime = file.getMimeType();

              // Match PDF by MIME or extension
              var isPdf = (mime === MimeType.PDF) || 
                          (mime === 'application/x-pdf') || 
                          (mime === 'application/acrobat') ||
                          (fileName.toLowerCase().slice(-4) === '.pdf');

              if (isPdf) {
                var fId = file.getId();
                categoryStats[catName]++;
                filesList.push({
                  id: fId,
                  name: fileName,
                  category: catName,
                  sizeBytes: file.getSize(),
                  updatedAt: file.getLastUpdated().toISOString(),
                  mimeType: mime,
                  thumbnailLink: "https://drive.google.com/thumbnail?id=" + fId + "&sz=w400",
                  webViewLink: file.getUrl()
                });
              }
            } catch (fileErr) {
              // Ignore individual unreadable file and continue
            }
          }
        } catch (filesErr) {
          // Folder files access error
        }

        // B. Process subfolders recursively
        try {
          var subFoldersIter = currentFolder.getFolders();
          while (subFoldersIter.hasNext() && filesList.length < maxFiles) {
            try {
              var subFolder = subFoldersIter.next();
              var subName = subFolder.getName();
              var nextCat = (catName === "Main") ? subName : (catName + " / " + subName);
              scanFolder(subFolder, nextCat, currentDepth + 1);
            } catch (subErr) {
              // Ignore inaccessible subfolder
            }
          }
        } catch (foldersErr) {
          // Subfolder iterator error
        }
      }

      // Start recursive scan from root folder
      scanFolder(rootFolder, "Main", 0);

      // Format category summary
      var categoriesSummary = [];
      for (var cat in categoryStats) {
        if (categoryStats.hasOwnProperty(cat) && categoryStats[cat] > 0) {
          categoriesSummary.push({
            name: cat,
            count: categoryStats[cat]
          });
        }
      }

      // Sort files alphabetically by name
      filesList.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });

      return createJsonResponse({
        status: "success",
        folderId: folderId,
        folderName: rootFolder.getName(),
        totalFiles: filesList.length,
        categories: categoriesSummary,
        files: filesList
      });
    }

    // 2. GET FILE BY ID (BASE64 BINARY STREAM & DIRECT URL)
    if (action === 'get' || params.id) {
      var fileId = params.id;
      if (!fileId) {
        return createJsonResponse({ 
          status: "error", 
          message: "Missing 'id' parameter. Pass ?id=YOUR_DRIVE_FILE_ID" 
        });
      }

      var file;
      try {
        file = DriveApp.getFileById(fileId);
      } catch (err) {
        return createJsonResponse({ 
          status: "error", 
          message: "File not accessible via DriveApp (" + err.toString() + "). Verify file sharing is set to 'Anyone with the link can view'." 
        });
      }

      var directDownloadUrl = "https://drive.google.com/uc?export=download&id=" + fileId;
      var fileSize = file.getSize();

      // For large files (>20 MB), Base64 string memory limits in Apps Script V8 can be exceeded.
      // In that case, return directDownloadUrl so the reader can stream it without crashing.
      if (fileSize > 22000000) {
        return createJsonResponse({
          status: "success",
          id: fileId,
          name: file.getName(),
          sizeBytes: fileSize,
          mimeType: file.getMimeType(),
          downloadUrl: directDownloadUrl
        });
      }

      try {
        var blob = file.getBlob();
        var bytes = blob.getBytes();
        var base64Data = Utilities.base64Encode(bytes);

        return createJsonResponse({
          status: "success",
          id: fileId,
          name: file.getName(),
          sizeBytes: bytes.length,
          mimeType: blob.getContentType(),
          base64: base64Data,
          downloadUrl: directDownloadUrl
        });
      } catch (blobErr) {
        // Fallback: If byte conversion or Base64 encoding fails, return downloadUrl
        return createJsonResponse({
          status: "success",
          id: fileId,
          name: file.getName(),
          sizeBytes: fileSize,
          mimeType: file.getMimeType(),
          downloadUrl: directDownloadUrl,
          warning: blobErr.toString()
        });
      }
    }

    return createJsonResponse({ 
      status: "error", 
      message: "Unrecognized action: " + action 
    });

  } catch (globalErr) {
    return createJsonResponse({ 
      status: "error", 
      message: globalErr.toString() 
    });
  }
}

function createJsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
