var fs = require('fs')
var path = require('path')
var multer = require('multer');

/**
 * Single file uploading
 */
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './files');
    },
    filename: function (req, file, callback) {
        let file_name = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        req.newFile_name = file_name;
        req.fileExt = path.extname(file.originalname)
        callback(null, file_name);
    }
});


var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback)
    }
}).single('file')


/**
 * Multiple file uploading 
 */
var Multistorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './files')
    },
    filename: function (req, file, callback) {
        let file_Name = file.fieldname + ' ' + Date.now() + path.extname(file.originalname)
        //push fileName in array
        req.newFile_name.push({ name: file_Name, fileExt: path.extname(file.originalname) })
        callback(null, file_Name)
    }
})


/**upload Multiple images using multer */
var uploadMultiple = multer({
    storage: Multistorage,
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback)
    }
}).array('file')


/**
 * check for the allowed file types
 */
function checkFileType(file, callback) {
    const fileTypes = /jpeg|jpg|png|gif|xlsx|xls|pdf|ods/;
    const extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    if (extName) {
        return callback(null, true);
    } else {
        callback('Error:Images only!')
    }
}


module.exports = {
    upload,

    uploadMultiple
}