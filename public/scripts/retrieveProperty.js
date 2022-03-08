function getProperty () {
    if(params.id){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (this.status == 200 && this.readyState == 4){
                console.log(this.responseText);
            }
        }
        body = JSON.stringify({id : params.id});
        xhttp.open('POST', 'localhost:8080/api/property') //BUGBUG end point not created and only works for local env.
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(body);
        // send post request
    } else {
        errorRedirect();
    }
}

function errorRedirect () {
    console.error('error')
}

