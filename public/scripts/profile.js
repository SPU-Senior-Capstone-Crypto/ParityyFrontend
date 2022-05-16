
// if not logged in redirect to login page
if (getSSID() < 0){
    window.location.href = '/login'
} else {
    getChart();
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