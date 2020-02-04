let cloudinary = require('cloudinary');
let multerFile = require('./multerFile');
const imageThumbnail = require('image-thumbnail');
cloudinary.config({
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloudinary_key,
    api_secret: process.env.cloudinary_secret
});


/**
 * This function will create the thumbnail, update it on server and return us the url 
 * @param {*} image_raw , image in raw format
 */
async function createThumbAndReturnUrl(image_raw) {
    const thumbnail = await imageThumbnail({
        uri: image_raw
    });
    return new Promise((resolve, reject) => {
        let randomNum = `files/${Math.floor(Math.random() * 10000)}`;
        require('fs').writeFile(randomNum, thumbnail, 'binary', async function () {
            cloudinary.v2.uploader.upload(randomNum, (err_upper,data) => {
                if (data) {
                    require('fs').unlink(randomNum, function (err) {
                        if (err) throw err;
                        console.log('File deleted!');
                    });
                    resolve(data.url);

                } else {
                    console.log({err_upper})
                    reject(err_upper);
                }
            })
        });
    })

}
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
                require('fs').unlink(`${process.cwd()}/files/${upload_len}`, async (err_file, data_resp) => {
                    if (error || err_file) {
                        return res.json({
                            code: 500,
                            message: "Internal server error, Please try again after some time."
                        })
                    } else {
                        let thumb = await createThumbAndReturnUrl(result.url);
                        return res.json({
                            code: 201,
                            message: "File uploading successful.",
                            url: result.url,
                            thumbnail: thumb
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
                        require('fs').unlink(`${process.cwd()}/files/${data.name}`, async (err_file, data_resp) => {
                            if (error || err_file) {
                                console.log({ error, err_file });
                                return res.json({
                                    code: 500,
                                    message: "Internal server error, Please try again after some time."
                                })
                            } else {
                                if (result1) {
                                    /**push cloudinary url in upload_response array */
                                    /**check length of uploded url */
                                    let thumb = await createThumbAndReturnUrl(result1.url);
                                    upload_response.push({ url: result1.url, thumbnail: thumb })
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


function UploadVideo(req, res) {
    multerFile.uploadVideo(req, res, async function (err) {
        if (err) {
            return res.json({
                code: 500,
                message: "Internal server error, Please try again after some time."
            })
        } else {
            let sendOption = {
                resource_type: "video",
                chunk_size: 6000000
            }
            let upload_len = req.newFile_name
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

module.exports = {
    UploadFile, //handle single file upload

    UploadMultiFile, //handle multifile uploads

    UploadVideo, //handle single video upload
}
