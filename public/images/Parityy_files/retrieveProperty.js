function getProperty () {
    console.log("Getting Property")
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4){
            buildPage(JSON.parse(this.responseText)[0]);
        }
    }
    let url = 'http://localhost:3001/api/property/' + params.id;

    xhttp.open('GET', url, true) //BUGBUG end point not created and only works for local env.
    xhttp.send();
}

function buildPage (payload) {
    let imgs = JSON.parse(payload.image_meta);
    let desc = JSON.parse(payload.desc_meta);
    console.log(imgs);
    console.log(desc);

    // Set banner back image
    $(".banner_main").css( 
        {
            "background": `url(../images/${imgs.banner})`,
            'background-repeat': 'no-repeat',
            'min-height': '840px',
            'background-size': '100% 100%',
            'display': 'flex',
            'justify-content': 'center',
            'align-content': 'center',
            'align-items': 'center'
        });

    //Set images
    $("#img1").attr('src', "images/"+imgs.img1);
    $("#img2").attr('src', "images/"+imgs.img2);
    $("#img3").attr('src', "images/"+imgs.img3);

    //Set all of the wording/titles
    $("h1").html(desc.title);
    $(".text-bg p").html(desc.summary);
    $(".titlepage h2").html(desc.grabber);
    $(".hottest_box p").html(desc.info);
}

function errorRedirect () {
    console.error('No id')
}
