
if (getSSID > 0){
    loggedInDisplay();
} else {
    noLogDisplay();
}

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

/**
 * AJAX Handler for the login functionality.
 * @param {object} vars login paramaters for req body
 */
function log (vars) {
    let xhttp = new XMLHttpRequest();

    // TODO
    // handle wrong login info
    // reroute success
    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            console.log(this.responseText);
            createLoginCookie(this.responseText);
            if (getSSID() > 0){
                window.location.href = "/";
            }
        }
    }

    let url = getAjaxRoute() + '/api/account/log';  // login route
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(vars));
}


/**
 * 
 * @param {object} vars registartion info for req body
 */
function register (vars) {
    console.log(vars);
    let xhttp = new XMLHttpRequest();

    // TODO
    // handle route change for success
    // handle existing user
    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            console.log("good")
        } else {
            console.log(this.status)
        }
    }

    let url = getAjaxRoute() + "/api/account/create";
    xhttp.open('PUT', url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    console.log(JSON.stringify(vars));
    xhttp.send(JSON.stringify(vars));
}

/**
 * Creates a session cookie on front end
 * @param {number} ssid session id
 */
function createLoginCookie (ssid) {
    document.cookie = "ssid=" + ssid + "; expires=Thu, 01 Jan 2023 00:00:00 UTC; path=/;"
}

/**
 * Deletes session cookie and handles logout route
 */
function deleteCookie () {
    if (getSSID()  > 0) {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.status == 200 && this.readyState == 4){
                document.cookie = "ssid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = '/';
            }
        }

        let ssid = getSSID();

        let body = {'ssid': ssid}

        let url =  getAjaxRoute() + '/api/account/logout';

        xhttp.open('POST', url, true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send(JSON.stringify(body));
    }
}

// /**
//  * verifies and sets the login status of user/session
//  */
// function setLog () {
//     if (getSSID() > 0){
//         let xhttp = new XMLHttpRequest();

//         xhttp.onreadystatechange = function () {
//             if (this.status ==  200 && this.readyState == 4) {
//                 loggedInDisplay();
//             } else if (this.status === 404){
//                 deleteCookie();
//             }
//         }

//         let body = {'ssid':getSSID()}

//         let url = 'http://localhost:3001/api/account/verify';
//         xhttp.open('POST', url, true);
//         xhttp.setRequestHeader('Content-type', 'application/json');
//         xhttp.send(JSON.stringify(body));

//     } else {
//         // do false
//     }
// }

/**
 * displays propper UI if logged in
 * @returns void
 */
function loggedInDisplay () {
    if (getSSID() < 0 ){
        noLogDisplay();
        return;
    }
    $('#accountBtn').html(
        '<a href="profile.html">Account</a>'
        );
    $('#accountOptionBtn').html(
        'Logout'
    ).css({
        'background-color': 'black',
        'border-color' : 'black',
        'color' : 'lightgrey'
    }).on('click', () => {
        deleteCookie();
    })
}

function noLogDisplay () {
    if (getSSID() > 0){
        loggedInDisplay()
        return;
    }
    $('#accountBtn').html(
        '<a href="login.html">Login</a>'
    );
    $('#accountOptionBtn').html(
        '<a href="signup.html">Sign up</a>'
    ).css({
        'background-color' : '#6f42c1',
        'border-color' : '#6f42c1',
        'color' : 'black'
    }).on('click', () => {return})
}

/**
 * gets the session id if present
 * @returns <number> session id. -1 if missing
 */
function getSSID () {
    if (document.cookie){
        return (document.cookie.split('; ') 
        .find(row => row.startsWith('ssid='))
        .split('=')[1]);
    } else {
        return -1;
    }
}