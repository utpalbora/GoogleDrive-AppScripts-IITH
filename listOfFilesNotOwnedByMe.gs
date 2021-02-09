/// This function will update the spreadsheet with list of files not owned by the user.
/// Please set the spreadsheet ID first
function listOfFilesNotOwnedByMe() {
  var ss = SpreadsheetApp.openById(""); // Set ID of Spreadsheet to be updated with list of files
  var sheet = ss.getSheets()[0]; // Updates the first sheet
  var numColumns = sheet.getMaxColumns();
  var lastColId = sheet.getLastColumn();

  if(lastColId == 0)
    lastColId++;

  if (lastColId < numColumns){
    Logger.log("Deleting Empty Columns!");
    sheet.deleteColumns(lastColId + 1, numColumns - lastColId);
  }
  sheet.setFrozenRows(1);
  var data = listOfFilesNotOwnedByMeUnderAFolder(null,null);
  sheet.getRange(
    sheet.getLastRow() + 1,
    1,
    data.length,
    data[0].length
  ).setValues(data);

}


/// Returns the list of all files and folders not owned by the user in a folder.
/// Please set defaultFolder to the ID of the folder you want to process.
function listOfFilesNotOwnedByMeUnderAFolder(rootFolderID, dataRows) {
  var defaultFolder = "";

   if(rootFolderID == null)
       rootFolderID = defaultFolder;

   if(dataRows == null)
     dataRows = [["Folder/File Name", "Owner", "URL"]];

   var folder = DriveApp.getFolderById(rootFolderID);
   Logger.log("Folder Name: " + folder.getName());
   var files = folder.getFiles();
   var activeuser = DriveApp.getRootFolder().getOwner();

   if(folder.getOwner().getUserLoginId() != activeuser.getUserLoginId()) {
      Logger.log("I do not own this folder: " + folder.getName());
      Logger.log("FolderName: " + folder.getName() + "; Owner: " + folder.getOwner().getEmail());
      var row = [folder.getName(), folder.getOwner().getEmail(), folder.getUrl()];
      dataRows.push(row);
   }

   while(files.hasNext()){
     var file = files.next();
     var owner = file.getOwner();
     if(owner.getUserLoginId() != activeuser.getUserLoginId()) {
        Logger.log("I do not own this file: " + file.getName());
        Logger.log("FileName: " + file.getName() + "; Owner: " + owner.getEmail());
        var row = [file.getName(), file.getOwner().getEmail(), file.getUrl()];
        dataRows.push(row);
     }
   }

  // Recursive step
  var childFolders = folder.getFolders();
  while(childFolders.hasNext()) {
    var child = childFolders.next();
    Logger.log("Child folder: "+ child.getName());
    listOfFilesNotOwnedByMeUnderAFolder(child.getId(), dataRows);
  }

  return dataRows;
}
