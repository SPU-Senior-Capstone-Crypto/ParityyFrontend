
// if not logged in redirect to login page
if (getSSID() < 0){
    window.location.href = '/login'
}