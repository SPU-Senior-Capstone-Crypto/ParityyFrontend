const urlParameters = new URLSearchParams(window.location.search);
const params = {};
urlParameters.forEach((val, key) => {
    params[key] = val;
});