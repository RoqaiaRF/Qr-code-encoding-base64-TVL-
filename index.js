const express = require("express");
const app = express();
const port = 5000;
const bp = require("body-parser");
const qr = require("qrcode");

app.use(express.static(__dirname + '/public'));
/************ buffer code************** */
function getTLVForValue(tagNum,tagValue) {

    var tagBuf = Buffer.from([tagNum],'utf8');
    
    tagValueLenBuf = Buffer.from([tagValue.length],'utf8');
    // convert the value into byte array
    var tagValueBuf =  Buffer.from(tagValue,'utf8');
    /*  Once we have 3 byte arrays, we concat 
        them into 1 byte array representing our 
        TLV Messag*/
    var bufsArray = [tagBuf,tagValueLenBuf,tagValueBuf]

    return Buffer.concat(bufsArray);
}

/******GET FROM DATABASE*******/
 
//1.Seller Name
var SellerNameBuf = getTLVForValue("1","Roqaia Alrfou");
//2. VAR Registration
var VatRegistrationBuf = getTLVForValue("2","46876543");
// 3. Time Stamp
var TimeStampBuf = getTLVForValue("3","2022-04-25T15:30:00Z");
//4. Invoice total
var InvoiceTotalBuf = getTLVForValue("4","5000.00");
//5. VAT total 
var VATTotalBuf = getTLVForValue("5","800.00");
/*********************************************************/

var tagsBufsArray = [SellerNameBuf,VatRegistrationBuf,
     TimeStampBuf,InvoiceTotalBuf,VATTotalBuf];

var qrCodeBuf = Buffer.concat(tagsBufsArray);
var qrCodeB64 = qrCodeBuf.toString('base64');

console.log(qrCodeB64);
/**********************************/

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/scan", (req, res) => {
    
    /******GET FROM DATABASE*******/
    const sellername = req.body.sellername;
    const varregistration = req.body.varregistration;
    const timestamp = req.body.timestamp;
    const vattotal = req.body.vattotal;
    const invoicetotal = req.body.invoicetotal;
    //1.Seller Name
    var SellerNameBuf = getTLVForValue("1", sellername);
    //2. VAR Registration
    var VatRegistrationBuf = getTLVForValue("2", varregistration);
    // 3. Time Stamp
    var TimeStampBuf = getTLVForValue("3", timestamp);
    //4. Invoice total
    var InvoiceTotalBuf = getTLVForValue("4", invoicetotal);
    //5. VAT total 
    var VATTotalBuf = getTLVForValue("5", vattotal);
    var tagsBufsArray = [SellerNameBuf, VatRegistrationBuf,
        TimeStampBuf, InvoiceTotalBuf, VATTotalBuf];

    var qrCodeBuf = Buffer.concat(tagsBufsArray);
    var qrCodeB64 = qrCodeBuf.toString('base64');
    console.log(qrCodeB64);
    //res.render({qrCodeB64: qrCodeB64});
    /*if (url.length === 0) res.send("Empty Data!");*/
    qr.toDataURL(qrCodeB64, (err, src) => {
        if (true) res.send(qrCodeB64);
        res.render("scan", { qrCodeB64 });
    });
});

app.listen(port, () => console.log("Server at 5000"));



