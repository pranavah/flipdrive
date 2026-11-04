/**
 * FlipDrive - Google Apps Script Ultra-Reliable Bridge
 * 
 * Instructions:
 * 1. Open https://script.google.com/ and create/open your project.
 * 2. Replace Code.gs with this code and save (Ctrl+S).
 * 3. Click Deploy -> Manage deployments -> Edit (pencil icon).
 * 4. Under Version, select "New version", then click Deploy.
 * 5. Copy the Web app URL.
 */

function doGet(e) {
  var output;
  try {
    var fileId = e.parameter.id;
    if (!fileId) {
      output = ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "Missing 'id' parameter. Pass ?id=YOUR_DRIVE_FILE_ID" 
      }));
      output.setMimeType(ContentService.MimeType.JSON);
      return output;
    }

    var file;
    try {
      file = DriveApp.getFileById(fileId);
    } catch (err) {
      output = ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "File not accessible. Ensure file sharing is set to 'Anyone with the link can view'." 
      }));
      output.setMimeType(ContentService.MimeType.JSON);
      return output;
    }

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

  } catch (globalErr) {
    output = ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: globalErr.toString() 
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}