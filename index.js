let app = require("express")();
require('dotenv').config()
let bodyParser = require("body-parser");
let service = require("./serviceHandling")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

app.post('/codezeros/uploadFile/common',(req,res)=>service.UploadFile(req,res))



app.listen(process.env.PORT, () => {
    console.log(`Express server is running on ${process.env.PORT}`)
})