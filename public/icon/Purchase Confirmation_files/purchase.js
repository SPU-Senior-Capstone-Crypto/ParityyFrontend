

setup();

async function setup () {
    getProperty();
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

    $("#priceOut").html(`Price per Share<br><strong>${payload.value}</strong> eth`);
}