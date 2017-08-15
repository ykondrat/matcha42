var UserPosition = {
        latitude: '',
        longitude: '',
        country: '',
        city: ''
};
    
window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            UserPosition.latitude = position.coords.latitude;
            UserPosition.longitude = position.coords.longitude;
        });
    }
    if (UserPosition.latitude && UserPosition.longitude) {
        $.getJSON('https://geoip-db.com/json/geoip.php?jsonp=?').done(function(location) {
            UserPosition.country = location.country_name;
            UserPosition.city = location.city;
        });
    } else {
        $.getJSON('https://geoip-db.com/json/geoip.php?jsonp=?').done(function(location) {
            UserPosition.latitude = location.latitude;
            UserPosition.longitude = location.longitude;
            UserPosition.country = location.country_name;
            UserPosition.city = location.city;
        });
    }
}

setTimeout(function(){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/geolocation',
        dataType: 'json',
        data: UserPosition
    });
}, 2000);