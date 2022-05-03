require('./login')

if (getSSID() < 0){
    window.location.href = '/login'
}