setup();
let pricePerShare = 0;
let accounts = [];
let money;
/**
 * TODO
 * convert GWEI to eth for gas + est
 * Create transaction setup
 * loading while waiting on success/failure
 */

 async function getAccount() {
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  }

$("#sharesIn").change( () => {
    updatePricing();
});

$("#gas").change( () => {
    updatePricing();
})

function updatePricing () {
    let numShares = $("#sharesIn").val();
    $("#estGas").html(`Est. Gas fee: ${Number($("#gas").val())}`);  // Output gas est
    $('#estOut p').html(`Est. Price: <u>${(pricePerShare * numShares).toFixed(2)}`);    // output total est
    if (numShares <= 0){
        $("#sendEth").attr('disabled', true);
    } else {
        $("#sendEth").attr('disabled', false);
    }
}



async function setup () {
    getProperty();
    if (checkMM()) {
        ethereum.request({method : 'eth_chainId'})
        .then((result) => {
            if (result === '0x3') {
                console.log("hit");
                // Set correct chain fox
                $('#metaCheck').html('<img src="./icon/fox.png" height="50" width="50">');
                getAccount();
            } else {
                // set chain
            }
        })
    } else {
        // download metamask
    }
}

function checkMM () {
    if (!window.ethereum){  // needs to install/connect metamask
        console.log("Metamask is not installed");
        // TODO
        // Create popup to reroute/download metamask extension
        return false;
    }
    return true; 
}

function getProperty () {
    console.log("Getting Property")
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4){
            buildPage(JSON.parse(this.responseText)[0]);
        }
        if (this.status == 302 && this.readyState == 4){    // if no/wrong id given reroute to index or search page.
            location.href = 'index.html';
        }
    }
    let id = '';
    if (params.id){
        id += '/' + params.id;
    }
    let url = 'http://localhost:3001/api/property' + id;
    xhttp.open('GET', url, true) //BUGBUG end point not created and only works for local env.
    xhttp.send();
}

function buildPage (payload) {
    console.log(payload);
    pricePerShare = payload.value;
    $("#priceOut").html(`Price per Share<br><strong>${payload.value}</strong> eth`);
}
// ** CREATE TRANSACTION **
//Sending Ethereum to an address
$("#sendEth").on('click', () => {
    let hxValue = configWEI();
    money = hxValue;
    console.log(money);
    // check to ensure correct chain (ropsten test network) or local ganahce chain
      ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0],
            to: '0x952d6497fE49C808004cce2e3d8E8526fcF61366', // main parity wallet
            value: hxValue,                       // hex value of wei (10e+18 = 1 eth)
            gasPrice: '0x09184e72a000', // 10e+18
            gas: '0x5208',  //
          },
        ],
      })
      .then((txHash) => {
        getReceipt(txHash);
      })
      .catch((error) => console.error);   
  });

  // Retrieves receipt for transaction
  async function getReceipt (hash) {
    console.log("start Receipt request: ", hash);
    ethereum.request({
      method:'eth_getTransactionReceipt',
      params:[
        hash
      ]
    }).then((result) => {
      // console.log(result.blockHash);    //BUGBUG need to catch promise better for pending transaction
      if (result === null){
        setTimeout( () => {
          console.log('waiting...');
          getReceipt(hash);
        }, 3000);
      } else {
        getHash(result.blockHash, result.from);
      }
      
    }).catch();
  }

  // gets the contract hash for the transaction
  async function getHash (hash, s) {
    console.log("Start block request: ", hash);
    ethereum.request({
      method:'eth_getBlockByHash',
      params:[
        hash,
        true
      ]
    }).then((result) => {
      // find contract with mathing block# and sender
      for (let i in result.transactions){
          if (result.transactions[i].from === s){
              confirmTransaction(result.transactions[i]);
          }
      }
    })
  }

  // retieves the value in the contract
  function confirmTransaction (contract) {
    console.log("Confirm transaction value");
    let blockVal = contract.value;
    let targetVal = '0x' + money;
    if (blockVal === targetVal){
      console.log("success");
      // TODO handle successful transaction
      //document.getElementById('output').innerHTML = 'Transaction Sucess';
    } else {
      //document.getElementById('output').innerHTML = 'Transaction Failed';
    }
  }
  
  async function getAccount() {
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  }

  // computes the amount of WEI for the transaction
  function configWEI() {
    let shares = $("#sharesIn").val()
    // converts to WEI
    let result = shares * 1e18 * pricePerShare;
    // converts to hex
    let hxResult = result.toString(16);
    return(hxResult);
  }