const urlParameters = new URLSearchParams(window.location.search);
const params = {};

function getAjaxRoute () {
    return 'http://137.184.114.83:3001';
}


urlParameters.forEach((val, key) => {
    params[key] = val;
});