
// if not logged in redirect to login page
if (getSSID() < 0){
    window.location.href = '/login'
} else {
    getCards();
    getTransactions();
    getChart();
}

function getChart () {
    let ctx = $('#balance-chart');
    
    let xhttp = new XMLHttpRequest();
 
    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            console.log(JSON.parse(this.responseText));
            const chart = new Chart(ctx, JSON.parse(this.responseText));
            let points = JSON.parse(this.responseText).data.datasets[0].data
            $('#balanceCol-title span').html(`${points[points.length - 1]}`)
        } else if (this.status == 502 && this.readyState == 4) {
                $('#balanceCol-title span').html('0');
                noTrans();
            }
    }

    let url =  getAjaxRoute() + '/api/account/chart';
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify({ssid:getSSID()}));
}

function getCards () {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            let res = JSON.parse(this.responseText);
            for (let i in res){
                buildCard(res[i], true);
            }
        }
    }

    let url =  getAjaxRoute() + '/api/account/cards';
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify({ssid:getSSID()}));

}

function getTransactions () {
    let shares = 0;
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            let res = JSON.parse(this.responseText);
            for (let i in res){
                buildTransaction(res[i]);
                shares += res[i].shares
            }
            setShares(shares);
        }   
    }

    let url =  getAjaxRoute() + '/api/account/transactions';
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify({ssid:getSSID()}));
}

function setShares (n) {
    $('#sharesCol-title span').html(`${n}`);
}

function buildTransaction (t) {
    const container = $('.list-container');
    let type = 'Purchase';

    if (t.shares < 0) { // if purchase
        type = 'Sell'
    }

    let d = new Date(t.date);
    let dFormat = `${d.getMonth() + 1}/${d.getDay()}/${d.getFullYear()}`

    container.prepend(
        `<div class='transaction'>
            <div class="row">
                <div class="col" id='nameCol'>
                ${t.property_name}
                </div>
                <div class="col-md-3" id='sharesCol'>
                ${type}: ${Math.abs(t.shares)} shares
                </div>
                <div class="col col-md-2" id ='ethCol'>
                    <span>${Number(t.principle) / 1e18}</span> eth.
                </div>
            </div>
            <div class = "row">
                <div class = "col">
                    ${t.hash}
                </div>
                <div class="col">
                </div>
                <div class="col" id='dateCol'>
                    ${dFormat}
                </div>
            </div>
        </div>
        `
    )
}

function noTrans() {
    $('.chart-container').remove();
    $('.cards-container').remove();
    $('.list-container').remove();

    $('.header-container').after(
        `
            <div style="text-align:center;margin-top:12%;margin-bottom:10%;">
                <h2>Looks like you are new here</h2>
                <p>Start buying properties <a href="/properties">here</a></p>
            </div>
        `
    )
}