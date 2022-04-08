function getProperty () {
    console.log("Getting Property")
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4){
            console.log(JSON.parse(this.responseText)[0]);
        }
    }
    let url = 'http://localhost:3001/api/property/' + params.id;

    xhttp.open('GET', url, true) //BUGBUG end point not created and only works for local env.
    xhttp.send();
}

function errorRedirect () {
    console.error('No id')
}

