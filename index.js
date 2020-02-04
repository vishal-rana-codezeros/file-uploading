let app = require("express")();
require('dotenv').config()
let bodyParser = require("body-parser");
let service = require("./serviceHandling")
let methodOverride = require('method-override');
let morgan = require("morgan");
let cors = require("cors");
app.use(bodyParser.json({limit: '50mb',extended: true}));
app.use(bodyParser.urlencoded({
    extended: true,
	limit: '50mb'
}))

app.use(morgan("combined"))
app.use(cors())

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));


app.use(function (req, res, next) {
    //        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization,accessToken," +
        "lat lng,app_version,platform,ios_version,countryISO,Authorization");
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS');
    next();
});





app.post('/codezeros/uploadFile/common', (req, res) => service.UploadFile(req, res))
app.post('/codezeros/uploadMultipleFile/common', (req, res) => service.UploadMultiFile(req, res))
app.post('/codezeros/uploadVideo/common', (req, res) => service.UploadVideo(req, res))


 app.listen(process.env.PORT, () => {
    console.log(`Express server is running on ${process.env.PORT}`)
 })
