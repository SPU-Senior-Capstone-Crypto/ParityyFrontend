function getProperty () {
    if(params.id){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (this.status == 200 && this.readyState == 4){
                console.log(this.responseText);
            }
        }

        let url = 'localhost:8080/api/property/' + params.id;
        xhttp.open('GET', url) //BUGBUG end point not created and only works for local env.
        xhttp.send();
    } else {
        errorRedirect();
    }
}

function errorRedirect () {
    console.error('No id')
}

