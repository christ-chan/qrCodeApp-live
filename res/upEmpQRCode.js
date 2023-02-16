const { dbConnection } = require('../../services/sqlConnection.js');
const { getIDEmployee } = require('../../API_Employee/create_Employee.js');

/** 4QRCode Update  **/
const upMethodEmployee = (id, qrCodeData) => {
    console.log("Started running QRCode updating Employee");
/* Gathering info*/
    // var qrCodeDataArr = qrCodeData
    const upEmployee = async (userId) => {
        // let [stCode, pumpNo, productType] = qrCodeData
        try {
            if( userId !== undefined || '') {
            var serve = await dbConnection;

            let insQRCodeDecoded = await serve.request()
                .input( 'empNo', sql.Char(6), userId)
                .input( 'stCode', sql.Char(6), stCode)
                .input( 'pumpNo', sql.INT, pumpNo)
                .input( 'productType', sql.NVARCHAR(30), productType)
                .execute( 'cf_upEmployee' )

                console.log("Success updated Employee info ... ", insQRCodeDecoded.recordsets);
                return insQRCodeDecoded.recordsets;
                }
                else {
                    console.log("Failed to update. Invalid")
                }      
            serve.close();    
        }
        catch (err){
            console.log(err);
            // res.send({msg: "Failed to update. Error"})
        } 
    }
    /** Checking ID to server **/
    let DataId = id
    console.log("DataID", DataId);
    const svrInfoID = async (res, id) => {
        const idServer = await getIDEmployee( DataId? DataId:id );
        return idServer;
    }
    
    svrInfoID().then(
        (res, req, result ) => {
            // console.log("res ", res.rowsAffected[0]);
            const id = res.rowsAffected[0];
            let serverId = res.recordset[0]?.empNo;            
            if ( id === 1 ) {
                //Not existed id
                upEmployee().then(
                    (res, req, result) => {
                       console.log(`Success identified. Update Id. `);
                })
            }
            else { 
                console.log(`id found ${serverId} already existed.`);
            }
        }) 
}
upMethodEmployee('000002')
module.exports = { upMethodEmployee };