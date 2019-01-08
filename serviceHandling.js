let cloudinary = require('cloudinary');
let multerFile = require('./multerFile')
cloudinary.config({
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloudinary_key,
    api_secret: process.env.cloudinary_secret
});



function UploadFile(req, res) {
    multerFile.Upload(req, res, async function (err) {
        if (err) {
            console.log(err);
            return res.json({
                code: 500,
                message: "Internal server error, Please try again after some time."
            })
        }else{
            let sendOption = {}
            let upload_len = req.newFile_name
            if(req.fileExt == '.xlsx' || req.fileExt== '.xls' || req.fileExt== '.ods'){
                sendOption["resource_type"] = "raw"
            }
            console.log(req.fileExt)
            console.log({upload_len,sendOption,})
            cloudinary.v2.uploader.upload(`${process.cwd()}/files/${upload_len}`,sendOption,(error,result)=>{
                require('fs').unlink(`${process.cwd()}/files/${upload_len}`,(err_file,data_resp)=>{
                    if(error || err_file){
                        console.log("Printing out the error==========",error)
                        return res.json({
                            code: 500,
                            message: "Internal server error, Please try again after some time."
                        })
                    }else{
                        console.log({result})
                        return res.json({
                            code: 201,
                            message: "File uploading successful.",
                            url:result.url
                        })     
                    }
                })
                
            })

        }
    })
}




module.exports = {
    UploadFile
}