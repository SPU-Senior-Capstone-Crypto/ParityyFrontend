function getProperty () {
    if(params.id){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (this.status == 200 && this.readyState == 4){
                console.log(this.responseText);
            }
        }

        xhttp.open('POST', 'localhost:8080/api/property') //BUGBUG end point not created and only works for local env.
        // send post request
    } else {
        errorRedirect();
    }
}

function errorRedirect () {
    console.error('error')
}

