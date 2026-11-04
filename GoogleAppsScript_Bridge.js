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
 * - action=list & folderId=... : Lists all PDF files in the specified folder with thumbnails & metadata
 * - action=get & id=... (or ?id=...) : Streams binary base64 data of a PDF file
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

    // 1. LIST PDF FILES IN FOLDER
    if (action === 'list' || params.folderId || params.folder) {
      var folderId = params.folderId || params.folder;
      if (!folderId) {
        return createJsonResponse({ 
          status: "error", 
          message: "Missing 'folderId' parameter. Pass ?folderId=YOUR_DRIVE_FOLDER_ID" 
        });
      }

      var folder;
      try {
        folder = DriveApp.getFolderById(folderId);
      } catch (fErr) {
        return createJsonResponse({ 
          status: "error", 
          message: "Folder not accessible. Ensure folder sharing is set to 'Anyone with the link can view'." 
        });
      }

      var filesIterator = folder.getFilesByType(MimeType.PDF);
      var filesList = [];
      
      while (filesIterator.hasNext()) {
        var file = filesIterator.next();
        var fId = file.getId();
        filesList.push({
          id: fId,
          name: file.getName(),
          sizeBytes: file.getSize(),
          updatedAt: file.getLastUpdated().toISOString(),
          mimeType: file.getMimeType(),
          thumbnailLink: "https://drive.google.com/thumbnail?id=" + fId + "&sz=w400",
          webViewLink: file.getUrl()
        });
      }

      // Sort alphabetically by filename
      filesList.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });

      return createJsonResponse({
        status: "success",
        folderId: folderId,
        folderName: folder.getName(),
        totalFiles: filesList.length,
        files: filesList
      });
    }

    // 2. GET FILE BY ID (BASE64 STREAM)
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
          message: "File not accessible. Ensure file sharing is set to 'Anyone with the link can view'." 
        });
      }

      var blob = file.getBlob();
      var bytes = blob.getBytes();
      var base64Data = Utilities.base64Encode(bytes);

      return createJsonResponse({
        status: "success",
        id: fileId,
        name: file.getName(),
        sizeBytes: bytes.length,
        mimeType: blob.getContentType(),
        base64: base64Data
      });
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
