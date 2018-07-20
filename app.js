const express = require('express');
const config = [];
const cfunction = require('./functions');
var fs = require('fs');
var path = require('path');
//var compression =  require('compression') ;
var Web3v020 = require('./web3.js-0.20.6/lib/web3');
const Web3v1 = require('web3');
const webserver = express();

//var webserver = express.createServer() ;
var bodyParser = require('body-parser'); // Get Post data
config.RPCSVR = "127.0.0.1";
config.RPCPORT = "8545"

// example to use both version   
var web3v02 = new Web3v020(new Web3v020.providers.HttpProvider('http://' + config.RPCSVR + ":" + config.RPCPORT));
var web3 = new Web3v1(new Web3v1.providers.HttpProvider('http://' + config.RPCSVR + ":" + config.RPCPORT));
var CookieParser = require('cookie-parser');
webserver.use(express.static(path.join(__dirname, '/pubhtml')));
webserver.use(bodyParser.json());
webserver.use(bodyParser.urlencoded({ extended: true }));
const contractADDR = "0x561555ae4c4d7a3f75ed2c270e74833d6bf38e45";
// TEST blockchain connection with old version 
web3v02.eth.getAccounts(function(err, res) {

    console.log("=======connecting test web3js old Version  =======")
    console.log(err, res)


});

console.log("Web3 new version is : " + web3.version);


webserver.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/privatehtml/index.html');
});

webserver.get('/sbalance', (req, res, next) => {
    res.sendFile(__dirname + '/privatehtml/sbalance.html');
});

webserver.get('/readtogetin', (req, res, next) => {
 res.sendFile(__dirname + '/privatehtml/getinreader.html');
}) ;


webserver.post('/readtogetin', (request, wres, next) => {
    if (request) {
        // res.send(JSON.stringify(request.body, null, '\t'));
        // .....................................................................
        var userID = request.body.userID;
        var shuttlekey = request.body.shuttlekey;
        cfunction.ReadGetIn(userID, shuttlekey, function(err, res , errres) {
            if (err) {
                console.log(err);
                wres.send(" have Error : " + err);
            } else {
                wres.send(res);
            }
            if ( errres) {console.log("Transection Error" + errres)}
        });

        console.log(" Reader Value : " + JSON.stringify(request.body, null, '\t'));
    }
});

webserver.post('/getsbalance', (request, wres, next) => {
    if (request) {


        var shuttleAddr = request.body.shuttleAddr;
        cfunction.getShuttleBalance(shuttleAddr, function(err, res) {
            if (err) {
                console.log(err);
                wres.send(" have Error : " + err);
            } else {
                wres.send("Shuttle :" + shuttleAddr + " balance  " + res);
            }
        });

        console.log(" Reader Value : " + JSON.stringify(request.body, null, '\t'));
    }

});

webserver.get('/getnewkey', (req, res, next) => {
    var WalletAddr = web3.eth.accounts.create("2fellows$##^&^#556gty&&%$343%^^@#$$RGhhyg");
    web3.eth.accounts.wallet.add(WalletAddr.privateKey);
    console.log(WalletAddr)
    res.send("สร้าง wallet ลงใน blockchain เรียบร้อยแล้ว <br> " +
        "ไม่มีการบันทึกลงใน keystores directory <br> copy เอาไปใช้งานได้เลย ! <br>" +
        "Private KEY IS : " + WalletAddr.privateKey + "<br>" +
        " Address : " + WalletAddr.address);
})



var port = 8100;
var ser_var = webserver.listen(port);
console.log("open web  http://" + ser_var.address().address + ":" + port);
console.log("CTRL+C to Exit");