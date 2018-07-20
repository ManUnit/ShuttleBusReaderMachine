const Web3v1 = require('web3');
config = {} ;
config.RPCSVR = "127.0.0.1";
config.RPCPORT = "8545"
var fs = require('fs');
var path = require('path');
var contractADDR = "0xa630286e3ec776bea965b9b7afaf22b079b9885d" ; 


var web3 = new Web3v1(new Web3v1.providers.HttpProvider('http://' + config.RPCSVR + ":" + config.RPCPORT));


var getShuttleBalance = async function(_shuttleAddr ,   callback) {  // Read only 
    console.log(" Hello get balance  ====== :");
    var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './prachachon_sol_MainContract.abi'), 'utf-8'));
    
    var contract = new web3.eth.Contract(abiArray, contractADDR, {
        from: _shuttleAddr,
        gasPrice: '20000000000'
    });
    try {
        var balanceof = await contract.methods.balanceOfShuttle(_shuttleAddr).call();
        callback(null, balanceof );
        return true;
    } catch (e) {
        console.log("Error catch allowance :\n" + e)
        callback("Error : balance of shuttle  " + e, null);
        return false;
    }
}


  var ReadGetIn = async function(_user, _bus , callback , errorback ) {
     var account = web3.eth.accounts.privateKeyToAccount(_bus);
    console.log(`web3 version: ${web3.version}`)
    var myAddress = account.address;
    var count = await web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);
    var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './prachachon_sol_MainContract.abi'), 'utf-8'));
    //    var contractAddress = "0xf1d28bac210b14b75e6ce1d529a1221c17579bfe";
    var privateKey = _bus;
    var contractAddress = contractADDR ;
    var contract = new web3.eth.Contract(abiArray, contractAddress, {
        "from": account.address
    });
    var gasPriceGwei = 30;
    var gasLimit = 999000;
    var chainId = 9559;
    var tx = {
        "from": account.address,
        "nonce": "0x" + count.toString(16),
        "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
        "gasLimit": web3.utils.toHex(gasLimit),
        "to": contractAddress,
        "value": "0x0",
        "data": contract.methods.getInFreeShuttleReader(_user).encodeABI(),
        "chainId": chainId
    };

    //  console.log(`Raw of Transaction: \n${JSON.stringify(tx, null, '\t')}\n------------------------`);

    try {
        var receiptOut = web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
            const tran = web3.eth
                .sendSignedTransaction(signed.rawTransaction)
                .on('confirmation', (confirmationNumber, receipt) => {
                    if (confirmationNumber >= 24) {
                        console.log('Send ' + destAddress + ' anomut : ' + web3.utils.fromWei(transferAmount, "ether") + '  => confirmation: 24/' + confirmationNumber);
                        return true;
                    }
                })
                .on('transactionHash', hash => {
                    console.log('=> hash');
                    console.log("TX hash : " + hash);
                })
                .on('receipt', receipt => {
                    console.log('=> reciept');
                    // console.log(" receipt confirmation 1/24 " + 'Send ' + destAddress + "  " + JSON.stringify(receipt, null, '\t'));
                    callback(null, receipt);
                    return true;
                })
                .on('error', error => {
                    errorback(" \n" + util.inspect(error, false, null).substr(0, 70), null);
                    return false;
                    // console.log("=============>" + util.inspect(error, false, null));
                    // onsole.log( JSON.stringify(error,null,'\t')  ) ; 
                });
        });


    } catch (err) {
        console.log(" ++++++++++++ Send Error  +++++++++++++++\n" + err);
        //     console.log ( err ) ;
        errorback("\nsend error " + err, null);
        return false;
    }
  }



  exports.ReadGetIn = ReadGetIn ;
  exports.getShuttleBalance = getShuttleBalance ; 