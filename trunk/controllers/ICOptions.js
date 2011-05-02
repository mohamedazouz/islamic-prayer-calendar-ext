/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
icOptions = function(){
    var icOptions={};
    $(function(){

        });
    return icOptions;
}
var icOptions= new icOptions();

var background=chrome.extension.getBackgroundPage();

var lat,lng,gmt,country,countryCode,timezoneId,city,formatted_address;
var map,marker,geocoder,center;
var Positioning={
    initialize:function(){
        var myOptions = {
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl:false
        };
        // initializing the map and the geocoder
        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        // setting the map center to the current position
        moveToCurrent();

        //adding lister to changer lat,lng as the zoom changed.
        google.maps.event.addListener(map, 'zoom_changed', function() {
            center = map.getCenter();
            marker.setPosition(center);
            moveToDarwin(center.lat(),center.lng());
            Positioning.newPosition();
        });

        //adding listener to dragging the map
        google.maps.event.addListener(map, "dragend", function() {
            Positioning.newPosition();
        });

        google.maps.event.addListener(map, "drag", function() {
            center = map.getCenter();
            marker.setPosition(center);
            moveToDarwin(center.lat(), center.lng());
        });

        function moveToDarwin(lat,lng){
            if(! lat || ! lng){
                moveToCurrent();
                return;
            }
            center = new google.maps.LatLng(lat,lng);
            map.setCenter(center);
        }

        function moveToCurrent(){
            // Try W3C Geolocation (Preferred)
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    center = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    marker = new google.maps.Marker({
                        map: map,
                        position: center
                    });
                    marker.setDraggable(true);
                    google.maps.event.addListener(marker,'dragend',function(){
                        center=marker.getPosition();
                        map.setCenter(center);
                        Positioning.newPosition();
                    });
                    map.setCenter(center);
                }, function() {
                    handleNoGeolocation();
                });
            }
        }

        function handleNoGeolocation() {
            map.setCenter(new google.maps.LatLng(43.834526782236814, -37.265625));
            map.setOptions({
                zoom:2
            });
        }
    },
    codeAddress:function(){
        var address = document.getElementById("address").value;
        if(address == ''){
            return;
        }
        geocoder.geocode( {
            'address': address
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                marker.setPosition(results[0].geometry.location);
                marker.setDraggable(true);
                google.maps.event.addListener(marker,'dragend',function(){
                    center=marker.getPosition();
                    map.setCenter(center);
                    Positioning.newPosition();
                });
                map.setOptions({
                    zoom:6
                });
                Positioning.newPosition();
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
            }
        });
    },
    newPosition:function(){
        var latDif,lngDif;
        if(lat && lng){
            latDif = Math.sqrt((center.lat()) * (center.lat())) - lat;
            latDif = Math.sqrt(latDif * latDif);

            lngDif = Math.sqrt((center.lng()) * (center.lng())) - lng;
            lngDif = Math.sqrt(lngDif * lngDif);

            if(latDif > 0.5 || lngDif > 0.5){
                Positioning.geonamesVars();
            }
        }else{
            Positioning.geonamesVars();
        }
        lat = Math.sqrt( (center.lat()) * (center.lat()));
        lng = Math.sqrt( (center.lng()) * (center.lng()));
    },
    geonamesVars:function(){
        background.Positioning.geonamesVars(center.lat(),center.lng(),function(ob){
            gmt=ob.gmtOffset;
            timezoneId=ob.timezoneId;
        });
        background.Positioning.googlemapsLocation(center.lat(),center.lng(),function(ob){
            for(var i = 0 ; i < ob.results.length; i++){
                if($.inArray("administrative_area_level_2", ob.results[i].types) != -1/* ||  $.inArray("street_address", ob.results[i].types) != -1*/){
                    formatted_address=ob.results[i].formatted_address;
                    for(j in ob.results[i].address_components){
                        if($.inArray("country", ob.results[i].address_components[j].types) != -1){
                            country = ob.results[i].address_components[j].long_name;
                            countryCode = ob.results[i].address_components[j].short_name;
                        }
                        if($.inArray("administrative_area_level_1", ob.results[i].address_components[j].types) != -1){
                            city = ob.results[i].address_components[j].long_name;
                        }
                    }
                    i = ob.results.length;
                }
            }
            $("#country").html(formatted_address);
        });
    }
}

$(function(){
    Positioning.initialize();
    $("#gotoButton").click(function(){
        Positioning.codeAddress();
    });
    window.setTimeout(Positioning.newPosition, 1000);
})
