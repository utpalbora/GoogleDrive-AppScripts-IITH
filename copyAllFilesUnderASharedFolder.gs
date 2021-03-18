/// This function recursively copies all the files and subfolders inside a
/// particular shared folder.
/// Please set defaultFolderID to the ID of the shared folder you want to copy.
/// Please set destRootFolderID to the ID of the folder you own, where you want
/// to copy to.
function copyAllFilesUnderASharedFolder(srcFolder, destRootFolder) {

  // Shared Folder I want to copy
  var defaultFolderID = "";

  if (srcFolder == null)
    srcFolder = DriveApp.getFolderById(defaultFolderID);

  //  Destination Root Folder Owned by me.
  var destRootFolderID = "";

  if (destRootFolder == null)
    destRootFolder = DriveApp.getFolderById(destRootFolderID);

  if (srcFolder == null || destRootFolder == null)
    return;

  //  Logger.log("Source Folder Name: " + srcFolder.getName());
  //  Logger.log("Destination Parent Folder Name: " + destRootFolder.getName());
  //  Logger.log("Creating folder: " + srcFolder.getName());
  var newFolder = DriveApp.createFolder(srcFolder.getName());

  destRootFolder.addFolder(newFolder);

  var files = srcFolder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    // Logger.log("Copying file: " + file.getName());
    var newFile = file.makeCopy();
    // Logger.log("Coppied file name: " + newFile.getName());
    newFolder.addFile(newFile);
    // Logger.log("Resetting coppied filename to : " + file.getName());
    newFile.setName(file.getName());
  }

  // Recursive step
  var childFolders = srcFolder.getFolders();
  while (childFolders.hasNext()) {
    var child = childFolders.next();
    // Logger.log("Child folder: "+ child.getName());
    copyAllFilesUnderASharedFolder(child, newFolder);
  }
}
