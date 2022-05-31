
$(function(){
    $("#nav-placeholder").load("/components/nav.html", () => {
        if (getSSID() > 0){
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
            });
            $('#propBtn').css(
                {
                    'display':'grid'
                }
            ); 
        }
    });
});