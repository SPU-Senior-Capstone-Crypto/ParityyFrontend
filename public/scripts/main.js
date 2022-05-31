const urlParameters = new URLSearchParams(window.location.search);
const params = {};

checkMM();

function getAjaxRoute () {
    return 'http://137.184.114.83:3001';
}


urlParameters.forEach((val, key) => {
    params[key] = val;
});

/**
 * Builds cards for given property.
 * @param {objcet} prop property json object
 * @param {bool} sellable true if sellable. appends sell button
 */
function buildCard (prop, sellable = false) {
    const container = $('.cards-container');
    let meta = JSON.parse(prop.desc_meta);
    let images = JSON.parse(prop.image_meta);

    let p = `<div class="card property" style="width: 18rem; height:430px">
                <img class="card-img-top" src="images/${images.banner}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${prop.property_name}<span> ${Number(prop.value) / 1e18}eth</span></h5>
                    <p class="card-text">${meta.summary}</p>
            `;
    if (sellable) {
        p += `      <a href="/sell?id=${prop.property_id}" class="btn btn-light">Sell</a>`;
    }
             
    p += `          <a href="/property-info?id=${prop.property_id}" class="btn btn-light">Buy</a>
                </div>
            </div>
            `;

    container.append(p);
}

function checkMM () {
    if (!window.ethereum){  // needs to install/connect metamask
        let m = `   MetaMask is not installed. Please <a href="https://metamask.io/download/">install here</a>.
                    
        `
        notify(m)
        return false;
    }
    return true; 
}

function notify (m) {

    let alert = `<div class="alert alert-warning" role="alert" style="position:absolute;z-index:2; margin:1% 2% 1% 80%">
                    ${m}
                </div>`

    $('nav').after(
        alert
    );
}
