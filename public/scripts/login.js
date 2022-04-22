const formSubmit = $('#registerBtn');

formSubmit.on('click', () => {
    // TODO
    // check reconfirm pass
    // check input validation
    let info = {
        "first" : $('#firstname').val(),
        "last" : $('#lastname').val(),
        "email" : $('#email').val(),
        "pswd" : $('#password').val()
    }
    register(info);
});


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