/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
icOptions = function(){
    var icOptions={
        initialize:function(){
            if(! window.localStorage.userAuth){
                background.extension.openURL(background.ProxyService.proxyRootURL+background.ProxyService.authSub,true);
                chrome.extension.sendRequest({
                    'action':'authenticate'
                });
                window.close();
            }
        },
        domEvents:function(){
            //stored vars
            var fajrS=JSON.parse(window.localStorage.fajrSettings);
            var zuhrS=JSON.parse(window.localStorage.zuhrSettings);
            var asrS=JSON.parse(window.localStorage.asrSettings);
            var maghribS=JSON.parse(window.localStorage.maghribSettings);
            var ishaS=JSON.parse(window.localStorage.ishaSettings);
            var eventFor=JSON.parse(window.localStorage.eventFor);
            var alertType=JSON.parse(window.localStorage.alertType);
            var lastFor=window.localStorage.lastFor;

            //set dom events
            $("#AllprayersSettings").change(function(){
                $("#fajrPrayer , #zuhrPrayer , #asrPrayer , #maghribPrayer , #ishaPrayer ,#fajrPrayersReminderTime,"+
                    "#asrPrayersReminderTime, #zuhrPrayersReminderTime, #maghribPrayersReminderTime, #ishaPrayersReminderTime,"
                    +"#fajrPrayersEventLong ,#zuhrPrayersEventLong,#asrPrayersEventLong,#maghribPrayersEventLong,#ishaPrayersEventLong,"
                    +"#fajrPrayersPrivacy,#zuhrPrayersPrivacy,#asrPrayersPrivacy,#maghribPrayersPrivacy,#ishaPrayersPrivacy,"
                    +"#fajrPrayersStatus,#zuhrPrayersStatus,#asrPrayersStatus,#maghribPrayersStatus,#ishaPrayersStatus,").each(function(){

                    this.disabled = $("#AllprayersSettings").attr('checked');
                    this.checked = false;
                });
            });
            $("#alertAll").change(function(){
                $("#alertALERT , #alertEMAIL , #alertSMS").each(function(){
                    this.disabled=$("#alertAll").attr('checked');
                    this.checked= false;
                });
            });

            $("#save").click(function(){
                window.localStorage.setup = true;
                //saving vars
                window.localStorage.timeZoneId=timezoneId;
                window.localStorage.gmtOffset=gmt;
                window.localStorage.position=JSON.stringify({
                    lat:lat,
                    lng:lng
                });

                window.localStorage.lastFor = util.radioValue("status");
                window.localStorage.alertType =JSON.stringify( util.specificRowsSelected("alertType"));
                var eventFor=util.specificRowsSelected("eventFor");
                window.localStorage.eventFor =JSON.stringify( eventFor);

                if($.inArray("ALL", eventFor) != -1){
                    var allSettings=JSON.stringify({
                        reminderAt:$("#allPrayersReminderTime").val(),
                        eventLong:$("#allPrayersEventLong").val(),
                        privacy:$("#allPrayersPrivacy").val(),
                        status:$("#allPrayersStatus").val()
                    });
                    window.localStorage.fajrSettings=allSettings;
                    window.localStorage.zuhrSettings=allSettings;
                    window.localStorage.asrSettings=allSettings;
                    window.localStorage.maghribSettings=allSettings;
                    window.localStorage.ishaSettings=allSettings;
                }else{
                    //{"reminderAt":10,"eventLong":10,"privacy":"public","status":"opaque"}
                    window.localStorage.fajrSettings=JSON.stringify({
                        reminderAt:$("#fajrPrayersReminderTime").val(),
                        eventLong:$("#fajrPrayersEventLong").val(),
                        privacy:$("#fajrPrayersPrivacy").val(),
                        status:$("#fajrPrayersStatus").val()
                    });
                
                    window.localStorage.zuhrSettings=JSON.stringify({
                        reminderAt:$("#zuhrPrayersReminderTime").val(),
                        eventLong:$("#zuhrPrayersEventLong").val(),
                        privacy:$("#zuhrPrayersPrivacy").val(),
                        status:$("#zuhrPrayersStatus").val()
                    });
                
                    window.localStorage.asrSettings=JSON.stringify({
                        reminderAt:$("#asrPrayersReminderTime").val(),
                        eventLong:$("#asrPrayersEventLong").val(),
                        privacy:$("#asrPrayersPrivacy").val(),
                        status:$("#asrPrayersStatus").val()
                    });
                
                    window.localStorage.maghribSettings=JSON.stringify({
                        reminderAt:$("#maghribPrayersReminderTime").val(),
                        eventLong:$("#maghribPrayersEventLong").val(),
                        privacy:$("#maghribPrayersPrivacy").val(),
                        status:$("#maghribPrayersStatus").val()
                    });
                    window.localStorage.ishaSettings=JSON.stringify({
                        reminderAt:$("#ishaPrayersReminderTime").val(),
                        eventLong:$("#ishaPrayersEventLong").val(),
                        privacy:$("#ishaPrayersPrivacy").val(),
                        status:$("#ishaPrayersStatus").val()
                    });
                }

            });
            $("#reset").click(function(){
                window.location.reload();
            });
            

            //set Page last vars
            if($.inArray("ALL", eventFor) != -1){
                $("#AllprayersSettings").attr('checked',true);
                $("#AllprayersSettings").trigger("change");
            }

            if($.inArray("ALL", alertType) != -1){
                $("#alertAll").attr('checked',true);
                $("#alertAll").trigger("change");
            }else{
                for( i in alertType){
                    $("#alert"+alertType[i]).attr('checked',true);
                }
            }

            $("#current").attr('checked',true);
            $("#googleCalendarSettings").parent('label').hide();

            $("#lastFor-"+lastFor).attr('checked',true);
            
            $("#fajrPrayersReminderTime").val(fajrS.reminderAt);
            $("#fajrPrayersEventLong").val(fajrS.eventLong);
            $("#fajrPrayersPrivacy").val(fajrS.privacy);
            $("#fajrPrayersStatus").val(fajrS.status);

            $("#zuhrPrayersReminderTime").val(zuhrS.reminderAt);
            $("#zuhrPrayersEventLong").val(zuhrS.eventLong);
            $("#zuhrPrayersPrivacy").val(zuhrS.privacy);
            $("#zuhrPrayersStatus").val(zuhrS.status);

            $("#asrPrayersReminderTime").val(asrS.reminderAt);
            $("#asrPrayersEventLong").val(asrS.eventLong);
            $("#asrPrayersPrivacy").val(asrS.privacy);
            $("#asrPrayersStatus").val(asrS.status);

            $("#maghribPrayersReminderTime").val(maghribS.reminderAt);
            $("#maghribPrayersEventLong").val(maghribS.eventLong);
            $("#maghribPrayersPrivacy").val(maghribS.privacy);
            $("#maghribPrayersStatus").val(maghribS.status);

            $("#ishaPrayersReminderTime").val(ishaS.reminderAt);
            $("#ishaPrayersEventLong").val(ishaS.eventLong);
            $("#ishaPrayersPrivacy").val(ishaS.privacy);
            $("#ishaPrayersStatus").val(ishaS.status);
        }
    };
    $(function(){
        icOptions.initialize();
        icOptions.domEvents();
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
            $("#address").val(formatted_address);
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
