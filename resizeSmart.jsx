var inputFolder = Folder.selectDialog("Chọn thư mục để xử lý");
var outFolder = Folder.selectDialog("Chọn thư mục lưu kết quả");

var topFolder = new Folder(inputFolder);
var _fullPathInput = inputFolder.path + '/' + inputFolder.name;

var fileandfolderAr = scanSubFolders(topFolder,/\.(jpg|tif|psd|bmp|png|)$/i);
var fileList = fileandfolderAr[0];
var folderList = fileandfolderAr[1];
var maxWidth = prompt("Chiều ngang tối đa: ", 1000);
var maxHeight = prompt("Chiều cao tối đa: ", 1000);

for(var a = 0 ;a < folderList.length; a++) {
    var _indexPath = folderList[a].path + '/' + folderList[a].name;
    var _folderCurrent = _indexPath.replace(_fullPathInput, '');

    var _folderNew = Folder(outFolder + '/' + _folderCurrent);

    if (!_folderNew.exists) {
        _folderNew.create();
    }
}

for(var a = 0 ;a < fileList.length; a++)
{
    open(fileList[a]);
    if (activeDocument.width > maxWidth) {
        activeDocument.resizeImage(UnitValue(maxWidth,"px"), null, 72, ResampleMethod.BICUBIC);
    }

    if (activeDocument.height > maxHeight) {
        activeDocument.resizeImage(null, UnitValue(maxHeight,"px"), 72, ResampleMethod.BICUBIC);
    }
    var _fullPath = activeDocument.path + '/' + activeDocument.name;
    _fullPath = _fullPath.replace(_fullPathInput, '');
    saveJPEG( app.activeDocument, new File( outFolder + '/' + _fullPath), 12 );

    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

function scanSubFolders(tFolder, mask) {
    var sFolders = new Array();
    var allFiles = new Array();
    sFolders[0] = tFolder;
    for (var j = 0; j < sFolders.length; j++){
        var procFiles = sFolders[j].getFiles();
        for (var i=0;i<procFiles.length;i++){
            if (procFiles[i] instanceof File ){
                if(mask==undefined) allFiles.push(procFiles[i]);
                if (procFiles[i].fullName.search(mask) != -1) allFiles.push(procFiles[i]);
        }else if (procFiles[i] instanceof Folder){
            sFolders.push(procFiles[i]);
            scanSubFolders(procFiles[i], mask);
         }
      }
   }
   return [allFiles,sFolders];
};


function saveJPEG( doc, saveFile, qty ) {
     var saveOptions = new JPEGSaveOptions( );
     saveOptions.embedColorProfile = true;
     saveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
     saveOptions.matte = MatteType.NONE;
     saveOptions.quality = qty;
     doc.saveAs( saveFile, saveOptions, true );
}
