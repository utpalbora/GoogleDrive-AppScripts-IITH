/// This function recursively delegates ownership of all files and subfolders
/// from self to someone for all files inside a particular folder.
/// Please set defaultFolder to the ID of the folder you want to process.
/// Please set newOwner to email address of person you want to delegate ownership to.
function delegateOwnershipFromMeForAllFiles(rootFolderID) {
  var newOwner = "";
  var defaultFolder = "";

   if(rootFolderID == null)
       rootFolderID = defaultFolder;

   var folder = DriveApp.getFolderById(rootFolderID);
   Logger.log("Folder Name: " + folder.getName());
   var files = folder.getFiles();
   var activeuser = DriveApp.getRootFolder().getOwner();

   while(files.hasNext()){
     var file = files.next();
     var owner = file.getOwner();
     if(owner.getUserLoginId() == activeuser.getUserLoginId()) {
        Logger.log("I own this file: " + file.getName());
        Logger.log("Changing owner to " + newOwner);
        file.setOwner(newOwner);
     }
   }

   if(folder.getOwner().getUserLoginId() == activeuser.getUserLoginId()) {
        Logger.log("I own this folder: " + folder.getName());
        Logger.log("Changing owner to " + newOwner);        
        folder.setOwner(newOwner);
   }

  // Recursive step
  var childFolders = folder.getFolders();
  while(childFolders.hasNext()) {
    var child = childFolders.next();
    Logger.log("Child folder: "+ child.getName());
    delegateOwnershipFromMeForAllFiles(child.getId());
  }
}
