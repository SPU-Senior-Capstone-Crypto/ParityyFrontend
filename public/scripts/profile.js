
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
        } else {
            console.log('error');
        }
    }

    let url = 'http://localhost:3001/api/account/chart';
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify({ssid:getSSID()}));
}

function getCards () {

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            let res = JSON.parse(this.responseText);
            console.log(res);
            for (let i in res){
                buildCard(res[i]);
            }
        }
    }

    let url = 'http://localhost:3001/api/account/cards';
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify({ssid:getSSID()}));

}

function buildCard (prop) {
    const container = $('.cards-container');
    let meta = JSON.parse(prop.desc_meta);
    let images = JSON.parse(prop.image_meta);
    container.append(
        `<div class="card" style="width: 18rem;">
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
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            let res = JSON.parse(this.responseText);
            for (let i in res){
                buildTransaction(res[i]);
            }
        }   
    }

    let url = 'http://localhost:3001/api/account/transactions';
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify({ssid:getSSID()}));
}

function buildTransaction (t) {
    const container = $('.list-container');
    container.prepend(
        `<div class="row">
            <div class="col">
            ${t.hash}
            </div>
            <div class="col-md-auto">
            ${t.date}
            </div>
            <div class="col col-lg-2">
            ${Number(t.principle) / 1e18}
            </div>
        </div>
        `
    )
}