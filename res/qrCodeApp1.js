
//Importing jimp module
var jimp = require("jimp");
// Importing filesystem module
var fs = require('fs');
// Importing qrcode-reader module
var qrCode = require('qrcode-reader');
var addQRCode = require('./addQrCode.js');
// const { database } = require("../../services/dbconfig.js");

const readQRCodeDiesel = (req, res) => { //MethodReadQRCode

// Read the image and create a buffer
// (Here insert File .png is our QR code)
var buffer1 = fs.readFileSync('storage_QRCode' + '/qrCode1.png');

jimp.read(buffer1, function(err, image) { // Parse the image using Jimp.read() method
	if (err) {
		console.error(err);
	}
	// Creating an instance of qrcode-reader module
	let Newqrcode = new qrCode();
	Newqrcode.callback = function(err, value) {
		var val = value.result;
		if (err) {
			console.error(err);
		}
		// Printing the decrypted value
		if (val = req) { 
			const splitVal = () => {
				let Data = []
				
				for (let index = 0; index < val.length; index++) {
					if(val.length < index ) {
						Data.push(val.length);
					 } 
				}
					let stringSplit = val.split(",");
					Data = stringSplit;
					const [code, pumpNo, Product] = stringSplit
					console.log("checkvalue:", Data);
					//Add QRCode to DB
					addQRCode.addQRCode(code, pumpNo, Product);
					return Data;
				}
				splitVal()
		}
	};
	// Decoding the QR code
	Newqrcode.decode(image.bitmap);
});

}

module.exports = { readQRCodeDiesel }
