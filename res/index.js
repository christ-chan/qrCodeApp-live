var express = require('express');
var app = express();
var path = require('path');
var bodyparser = require('body-parser');
var urlbodyparser = bodyparser.urlencoded({extended: false});
var router = express.Router();

const cors = require('cors')
const API_Port = process.env.PORT || 5001;
const moment = require('moment');

const logger = (req, res, next) => {
        console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} : ${moment().format()}`);
        next();
}

app.use(cors({ origin: '*' }))
app.use(bodyparser.json());
app.use(logger);
app.use(express.json());
app.use(router);

//getRequestAddQRCode 
router.post('/ScannerQRCodeApp', urlbodyparser, (req, res, next) => {
        let reqBody = req.body.qrCode;
        
        console.log("posted:", reqBody);
       
       try {
        switch (reqBody) {
                case 'MH,1,UNLEADED':
                        console.log("Unleaded");
                        const CodeUnleaded = require('./qrCodeApp.js');
                        CodeUnleaded.readQRCodeUnleaded(reqBody);
                        
                        break;
                case 'MH,1,PREMIUM':
                        console.log("PREMIUM");
                        const CodePremium = require('./qrCodeApp2.js');
                        CodePremium.readQRCodePremium(reqBody);
                        break;
                case 'MH,1,DIESEL':
                        console.log("DIESEL");//DIESEL
                        const CodeDiesel = require('./qrCodeApp1.js');
                        CodeDiesel.readQRCodeDiesel(reqBody);
                        break;
                default:
                        console.log("No QR Code existed.");
                        break;
              }  

         res.redirect(307, '/SuccessMessage')
        } catch (err) {
                console.log(err);
                res.status(500).send({error: "Failed to add QR Code."})
        } 
        return next();
});
router.post('/SuccessMessage', (req, res)=> {
        res.send(JSON.stringify({msg: `Added success`}))
        res.end();
})


app.use(express.static(path.join(__dirname, 'public')));

app.listen(API_Port, (err) => {
        if (err) throw console.log(err);
        console.log('Server: PORT IS STARTED',API_Port);
});

module.exports = router;