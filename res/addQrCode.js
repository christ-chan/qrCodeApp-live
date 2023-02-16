
var sql = require("mssql");
const { dbConnection } = require('./services/sqlConnection.js');
        
        const addQRCode = async (code, pumpNo, product) => {
            try {
                if(code !== undefined || '' ) {
                var serve = await dbConnection;
                let insQRCode = await serve.request()
                    .input( 'code', sql.Char(6), code)
                    .input( 'pumpNo', sql.Int, pumpNo)
                    .input( 'Product', sql.NVarChar(50), product)
                    .execute('cf_AddQRCode')

                    console.log(`Success Added QRCode: ${product}... `);
                    return insQRCode;
                    }
                    else {
                        console.log("Failed to Add.")
                    }      
                serve.close();   
            }
            catch (err) {
                console.log("Connection Error: ", err);
            } 
        }

module.exports = {
    addQRCode
}

