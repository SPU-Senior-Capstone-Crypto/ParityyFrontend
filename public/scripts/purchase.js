

setup();

async function setup () {
    if (checkMM()) {
        ethereum.request({method : 'eth_chainId'})
        .then((result) => {
            if (result === '0x3') {
                console.log("hit");
                // Set correct chain fox
                $('#metaCheck').html('<img src="./icon/fox.png" height="50" width="50">');
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