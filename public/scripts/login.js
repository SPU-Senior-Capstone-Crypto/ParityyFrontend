
let isLogged = false;

setLog();

// handler for signup form.
$(document).ready( () => {
    $('#input-form').submit( (e) => {

        e.preventDefault();

        let info = {
                    "first" : $('#firstname').val(),
                    "last" : $('#lastname').val(),
                    "email" : $('#email').val(),
                    "pswd" : $('#password').val()
                };

        register(info);
    });

    $('#login-form').submit( (e) => {
        e.preventDefault();

        let info = {
            "email" : $('#email').val(),
            "pswd" : $('#password').val()
        }

        log(info);
    });
});

function log (vars) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            console.log(this.responseText);
            createLoginCookie(this.responseText);
        }
    }

    let url = 'http://localhost:3001/api/account/log';
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(vars));
}



function register (vars) {
    console.log(vars);
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            console.log("good")
        } else {
            console.log(this.status)
        }
    }

    let url = "http://localhost:3001/api/account/create";
    xhttp.open('PUT', url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    console.log(JSON.stringify(vars));
    xhttp.send(JSON.stringify(vars));
}

function createLoginCookie (ssid) {
    document.cookie = "ssid=" + ssid + "; expires=Thu, 01 Jan 2023 00:00:00 UTC; path=/;"
    setLog();
}

function deleteCookie () {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            document.cookie = "ssid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            isLogged = false;
        }
    }

    let ssid = getSSID();

    let body = {'ssid': ssid}

    let url = 'http://localhost:3001/api/account/logout';

    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify(body));
}

function setLog () {
    if (getSSID() > 0){
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.status ==  200 && this.readyState == 4) {
                isLogged = true;
            } else if (this.status === 404){
                isLogged = false;
            }
        }

        let body = {'ssid':getSSID()}

        let url = 'http://localhost:3001/api/account/verify';
        xhttp.open('POST', url, true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send(JSON.stringify(body));

    } else {
        isLogged = false;
    }
}

function getSSID () {
    if (document.cookie){
        return (document.cookie.split('; ')  // BUGBUG make abstract
        .find(row => row.startsWith('ssid='))
        .split('=')[1]);
    } else {
        return -1;
    }
}