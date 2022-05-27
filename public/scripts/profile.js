
// if not logged in redirect to login page
if (getSSID() < 0){
    window.location.href = '/login'
} else {
    getChart();
    getCards();
    getTransactions();
}

function getChart () {
    let ctx = $('#balance-chart');
    
    let xhttp = new XMLHttpRequest();
 
    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            const chart = new Chart(ctx, JSON.parse(this.responseText));
            let points = JSON.parse(this.responseText).data.datasets[0].data
            $('#balanceCol-title span').html(`${points[points.length - 1]}`)
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
                buildCard(res[i]);
            }
        }
    }

    let url =  getAjaxRoute() + '/api/account/cards';
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify({ssid:getSSID()}));

}

function buildCard (prop) {
    const container = $('.cards-container');
    let meta = JSON.parse(prop.desc_meta);
    let images = JSON.parse(prop.image_meta);
    container.append(
        `<div class="card property" style="width: 18rem;">
            <img class="card-img-top" src="images/${images.banner}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${prop.property_name}</h5>
                <p class="card-text">${meta.summary}</p>
                <a href="/sell?id=${prop.property_id}" class="btn btn-primary">Sell</a>
            </div>
        </div>
        `
    );
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