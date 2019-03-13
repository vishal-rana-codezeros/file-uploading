let cloudinary = require('cloudinary');
let multerFile = require('./multerFile')
cloudinary.config({
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloudinary_key,
    api_secret: process.env.cloudinary_secret
});



function UploadFile(req, res) {
    multerFile.upload(req, res, async function (err) {
        if (err) {
            return res.json({
                code: 500,
                message: "Internal server error, Please try again after some time."
            })
        } else {
            let sendOption = {}
            let upload_len = req.newFile_name
            if (req.fileExt == '.xlsx' || req.fileExt == '.xls' || req.fileExt == '.ods') {
                sendOption["resource_type"] = "raw"
            }
            cloudinary.v2.uploader.upload(`${process.cwd()}/files/${upload_len}`, sendOption, (error, result) => {
                require('fs').unlink(`${process.cwd()}/files/${upload_len}`, (err_file, data_resp) => {
                    if (error || err_file) {
                        return res.json({
                            code: 500,
                            message: "Internal server error, Please try again after some time."
                        })
                    } else {
                        return res.json({
                            code: 201,
                            message: "File uploading successful.",
                            url: result.url
                        })
                    }
                })

            })

        }
    })
}



function UploadMultiFile(req, res) {
    req.newFile_name = [];
    multerFile.uploadMultiple(req, res, async function (err) {
        if (err) {
            return res.json({ code: 400, message: "Error uplading files,Please try after some time." })
        }
        else {
            var filePaths = req.newFile_name /**store all images in filePaths */
            let multipleUpload = new Promise((resolve, reject) => {
                let upload_len = filePaths.length/*store length of images in upload_len */
                upload_response = new Array();

                filePaths.map(async (data) => {
                    let sendOption = {}
                    if (data.fileExt == '.xlsx' || data.fileExt == '.xls' || data.fileExt == '.ods') {
                        sendOption["resource_type"] = "raw"
                    }
                    /**use coudinary for uploading images */
                    cloudinary.v2.uploader.upload(`${process.cwd()}/files/${data.name}`, sendOption, (error, result1) => {
                        require('fs').unlink(`${process.cwd()}/files/${data.name}`, (err_file, data_resp) => {
                            if (error || err_file) {
                                return res.json({
                                    code: 500,
                                    message: "Internal server error, Please try again after some time."
                                })
                            } else {
                                if (result1) {
                                    /**push cloudinary url in upload_response array */
                                    /**check length of uploded url */
                                    upload_response.push(result1.url)
                                    if (upload_response.length === upload_len) {
                                        // return res.json({code:200,message:"Done"})
                                        resolve(upload_response)
                                    }
                                }
                            }
                        })
                    })
                })
            })
            let upload = await multipleUpload;
            return res.json({ code: 200, message: "Success", data: upload })
        }
    })
}



module.exports = {
    UploadFile, //handle single file upload

    UploadMultiFile, //handle multifile uploads
}