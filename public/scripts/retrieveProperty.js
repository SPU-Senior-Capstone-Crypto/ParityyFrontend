getProperty();

function getProperty (filter = undefined) {
    console.log("Getting Property")
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4){
            let a = JSON.parse(this.responseText)
            if (filter){
                a = search(a, filter.toUpperCase());
            }
            if (a.length == 0){
                $('.cards-container').append(
                    `<h2>No Results Found :(</h2>`
                )
            }
            for (let i in a) {
                if (window.location.href.includes('properties')){
                    buildCard(a[i]);
                } else {
                    buildPage(a[i]);
                }
                
            }
        }
        if (this.status == 302 && this.readyState == 4){    // if no/wrong id given reroute to index or search page.
            window.location.href = 'index.html';
        }
    }
    let id = '';
    if (!window.location.href.toString().includes('properties')){
        if (params.id){
            id += '/' + params.id;
        }
    }
    
    let url =  getAjaxRoute() + '/api/property' + id;
    xhttp.open('GET', url, true) //BUGBUG end point not created and only works for local env.
    xhttp.send();
}

function search (a, filter){
    let r = [];

    // search by name exact
    for (let i in a){
        if (a[i].property_name.toUpperCase() === filter) {
            r.push(a[i]);
            return r;
        }
    }

    // name includes
    for (let i in a) {
        if (a[i].property_name.toUpperCase().includes(filter)){
            r.push(a[i]);
            delete a[i];
        }
    }

    // close to val
    for (let i in a) {
        let eth = Number(a[i].value, 16) / 1e18;
        if (Math.abs(Number(filter) - eth) < .01){
            r.push(a[i]);
            delete a[i];
        }
    }
    
    return r;
}


/**
 * Populates the page with the property specific stuff
 * @param {JSON} payload property meta treieved from db
 */
function buildPage (payload) {
    let imgs = JSON.parse(payload.image_meta);
    let desc = JSON.parse(payload.desc_meta);
    // console.log(imgs);
    // console.log(desc);


    // Set buy button link
    let buyLink = "/purchase?id=" + params.id;
    $("#buyBtn").attr('href', buyLink);

    // Set banner back image
    $('#banner .w-100').attr('src', 'images/'+imgs.banner)

    //Set images
    $(".first img").attr('src', "images/"+imgs.img1);
    $(".second img").attr('src', "images/"+imgs.img2);
    $(".third img").attr('src', "images/"+imgs.img3);
    $('#blogPic').attr('src', "images/"+imgs.banner);

    //Set all of the wording/titles
    $("#banner h3").html(desc.title);
    $("#banner h4").html(payload.address);
    $("#grabber").html(desc.grabber);
    $('#summary').html(desc.summary);
    $("#desc").html(desc.info);
}

function errorRedirect () {
    console.error('No id')
}

