# Instruction to use this service:

# Single file upload:(Uploading single file service,handles one file at a time)
    * File type accepts - jpeg,jpg,png,gif,xlsx,xls,pdf,ods
    * URL - http:{remote_server_address}:8808/codezeros/uploadFile/common


### Above is the url that you need to use, for making use of this service

## Request parameters:
    * Method- POST
    * You need to send the file in form-data under the name file.

## Response parameters:
    * Code - corredponding code to the request 
    * Message - Corresponding message to the request
    * Url - The url of your uploaded file

NOTE:if you get internal server error please try after  5 or 10 min.


# Multiple file upload:(Uploading Multiple file service,handles multiple files at a time.)
    * File type accepts - jpeg,jpg,png,gif,xlsx,xls,pdf,ods
    * URL - http:{remote_server_address}:8808/codezeros/uploadMultipleFile/common

## Request parameters:
    * Method- POST
    * You need to send the files in form-data under the name file(can select multiple files).

## Response parameters:
    * code - corredponding code to the request 
    * Message - Corresponding message to the request
    * data - This will contain the array of url of your recently uploaded files.    

# Single Video upload:(Uploading single video service,handles one video at a time)
    * File type accepts - mp4,webm,ogg
    * URL - http:{remote_server_address}:8808/codezeros/uploadVideo/common


### Above is the url that you need to use, for making use of this service

## Request parameters:
    * Method- POST
    * You need to send the file in form-data under the name file.

## Response parameters:
    * Code - corredponding code to the request 
    * Message - Corresponding message to the request
    * Url - The url of your uploaded video

NOTE: if you get internal server error please try after  5 or 10 minutes, or check the file extension is as per the allowed extension or not.

NOTE: This service is for codezeros and dataeximit internal usage only.Please contact if you get any trouble integrating this service

