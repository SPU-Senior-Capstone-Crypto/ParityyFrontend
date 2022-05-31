
if(getSSID() < 0){
    window.location.href = '/login'
  }

getProperty();
getShares();
getAccount();

let pricePerShare;
let accounts = [];
let maxShares;

async function getAccount() {
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
}

$("#sharesIn").change( () => {
    if ($('#sharesIn').val() > maxShares){
        $('#sharesIn').val(maxShares)
    }
    updatePricing();
});

$("#gas").change( () => {
    updatePricing();
});

$('#sendEth').on('click', () => {
    let value = Number(pricePerShare) * $('#sharesIn').val()
    let tx = {
        shares : $("#sharesIn").val() * -1,
        r : accounts[0],
        value : '0x' + value.toString(16),
        property_id : params.id,
        ssid : getSSID()
    }

    console.log('val' , value);
    console.log('tx' , tx);

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            let response = JSON.parse(this.responseText);
            
            let hash = response.hash
            let hashStr = hash.toString();
            let hashOut = hashStr.substring(0, 6) + "..." + hashStr.substring(hashStr.length - 4);

            $('#pendingRow').remove();

            $('#successRow')
                .append(`<p>Successful Transaction<br>Result:</p>`)

            // update hash row with hash and copy btn
            $('#hashRow')
                .append(`<div id="hashCol" class="col-sm"><p>${hashOut}</p></div>`)
                .append(`<div class="col-sm"><button type="button" id="copyBtn" class="btn btn-light" onclick="navigator.clipboard.writeText('${hashStr}')">Copy to Clipboard</button></div>`)

            // return home btn
            $("#receiptFoot").html(`<button type="button" onclick="window.location.href='/'" class="btn btn-primary">Return Home</button>`);
        }
    }

    let url =  getAjaxRoute() + '/api/transaction';
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify(tx));
});

function updatePricing () {
    let numShares = $("#sharesIn").val();
    $("#estGas").html(`Est. Gas fee: ${Number($("#gas").val())}`);  // Output gas est
    $('#estOut p').html(`Est. Price: <u>${(Number(pricePerShare) * numShares / 1e18).toFixed(2)}`);    // output total est
    if (numShares <= 0){
        $("#sendEth").attr('disabled', true);
    } else {
        $("#sendEth").attr('disabled', false);
    }
}

function getProperty () {
    console.log("Getting Property")
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4){
            buildPage(JSON.parse(this.responseText)[0]);
        }
        if (this.status == 402){    // if no/wrong id given reroute to index or search page.
            location.href = 'index.html';
        }
    }
    let id = '';
    if (params.id){
        id += '/' + params.id;
    }
    let url =  getAjaxRoute() + '/api/property' + id;
    xhttp.open('GET', url, true) //BUGBUG end point not created and only works for local env.
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send();
}

function getShares () {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            buildShares(Number(JSON.parse(this.responseText).shares))
        }
    }

    let id = '';
    if (params.id){
        id += '/' + params.id;
    }
    let url =  getAjaxRoute() + '/api/account/shares' + id;
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify({ssid:getSSID()}));
}

function buildPage (data) {
    pricePerShare = data.value;
    $('#sell-title').append(`
        <span class='prop-title'>${data.property_name}</span>
    `);

    $('#priceOut').append(`
        <span class='price-span'>${Number(data.value) / 1e18} Eth</span>
    `);
}

function buildShares (n) {
    if (n < 0){
        // handle no shares
    } else {
        $('#sell-title').append(`
            <span class='shares-title'>(${n} Shares Owned)</span>
        `);
        $('#sharesIn').attr('max', `${n}`);
    }
    maxShares = n;
}