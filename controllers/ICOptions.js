/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var background=chrome.extension.getBackgroundPage();

var lat,lng,gmt,country,countryCode,timezoneId,city,formatted_address;
var map,marker,geocoder,center,zoomLevel=6;
icOptions = function(){
    var icOptions={
        initialize:function(){
        /*if(! window.localStorage.userAuth){
                window.open(background.ProxyService.proxyRootURL+background.ProxyService.authSub,"");
                chrome.extension.sendRequest({
                    'action':'authenticate'
                });
                window.close();
            }*/
        },
        domEvents:function(){
            //set dom events
            $("#login").click(function(){
                icOptions.login();
            });
            $("#logging").click(function(){
                window.localStorage.logged="false";
                window.localStorage.user=null;
                icOptions.setOldSettings();
            });
            $("#AllprayersSettings").change(function(){
                $("#fajrPrayer , #zuhrPrayer , #asrPrayer , #maghribPrayer , #ishaPrayer ,#fajrPrayersReminderTime,"+
                    "#asrPrayersReminderTime, #zuhrPrayersReminderTime, #maghribPrayersReminderTime, #ishaPrayersReminderTime,"
                    +"#fajrPrayersEventLong ,#zuhrPrayersEventLong,#asrPrayersEventLong,#maghribPrayersEventLong,#ishaPrayersEventLong,"
                    +"#fajrPrayersPrivacy,#zuhrPrayersPrivacy,#asrPrayersPrivacy,#maghribPrayersPrivacy,#ishaPrayersPrivacy,"
                    +"#fajrPrayersStatus,#zuhrPrayersStatus,#asrPrayersStatus,#maghribPrayersStatus,#ishaPrayersStatus,").each(function(){

                    this.disabled = $("#AllprayersSettings").attr('checked');
                    this.checked = false;
                    if(this.checked){
                        $("#fajrPrayersReminderTime , #zuhrPrayersReminderTime, #asrPrayersReminderTime , #maghribPrayersReminderTime , #ishaPrayersReminderTime").attr('value',$("#allPrayersReminderTime").val()).trigger("change");
                        $("#fajrPrayersEventLong , #zuhrPrayersEventLong, #asrPrayersEventLong , #maghribPrayersEventLong, #ishaPrayersEventLong").attr('value',$("#allPrayersEventLong").val()).trigger("change");
                        $("#fajrPrayersPrivacy, #zuhrPrayersPrivacy, #asrPrayersPrivacy, #maghribPrayersPrivacy, #ishaPrayersPrivacy").attr('value',$("#allPrayersPrivacy").val()).trigger("change");
                        $("#fajrPrayersStatus, #zuhrPrayersStatus, #asrPrayersStatus, #maghribPrayersStatus, #ishaPrayersStatus").attr('value',$("#allPrayersStatus").val()).trigger("change");
                    }
                });
            });
            $("#allPrayersReminderTime").change(function(){
                $("#fajrPrayersReminderTime , #zuhrPrayersReminderTime, #asrPrayersReminderTime , #maghribPrayersReminderTime , #ishaPrayersReminderTime").attr('value',this.value).trigger("change");
            });
            $("#allPrayersEventLong").change(function(){
                $("#fajrPrayersEventLong , #zuhrPrayersEventLong, #asrPrayersEventLong , #maghribPrayersEventLong, #ishaPrayersEventLong").attr('value',this.value).trigger("change");
            });
            $("#allPrayersPrivacy").change(function(){
                $("#fajrPrayersPrivacy, #zuhrPrayersPrivacy, #asrPrayersPrivacy, #maghribPrayersPrivacy, #ishaPrayersPrivacy").attr('value',this.value).trigger("change");
            });
            $("#allPrayersStatus").change(function(){
                $("#fajrPrayersStatus, #zuhrPrayersStatus, #asrPrayersStatus, #maghribPrayersStatus, #ishaPrayersStatus").attr('value',this.value).trigger("change");

            });
            $("#alertAll").change(function(){
                $("#alertALERT , #alertEMAIL , #alertSMS").each(function(){
                    this.disabled=$("#alertAll").attr('checked');
                    this.checked= true;
                });
            });

            $("#save").click(function(){
                if(!window.localStorage.user || window.localStorage.user=="null"){
                    alert(Mylocals[window.localStorage.lang].warningmessage);
                }else{
                    icOptions.saveSettings();
                }
            });
            $("#reset").click(function(){
                if(!window.localStorage.user || window.localStorage.user=="null"){
                    alert(Mylocals[window.localStorage.lang].warningmessage);
                }else{
                    icOptions.resetAllPrayers();
                }
            });
            icOptions.setOldSettings();
        },
        saveSettings:function(){
            //setting the new label.
            chrome.browserAction.setIcon({
                path:'../views/icons/32.png'
            });
            
            $("#saved").fadeIn(100, function(){
                $("#save").attr("disabled", true);
            });
            //skip label saving.
            //window.localStorage.setup = true;
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
                window.localStorage.allSettings = JSON.stringify(allSettings);
                window.localStorage.fajrSettings=allSettings;
                window.localStorage.zuhrSettings=allSettings;
                window.localStorage.asrSettings=allSettings;
                window.localStorage.maghribSettings=allSettings;
                window.localStorage.ishaSettings=allSettings;
            }else{
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
            chrome.extension.sendRequest({
                action:"resetSettings"
            },function(){
                $("#saved").fadeOut(100, function(){
                    $("#save").attr("disabled", false);
                });
            });
        },
        setOldSettings:function(){
            if(window.localStorage.logged == "true"){
                var user = JSON.parse(window.localStorage.user);
                $("#user").text(user.name);
                $("#userEmail").text(user.email);
                $("#logged").show();
            }else{
                $("#logged").hide();
                $("#notLogged").show();
                $("#notLogged2").show();
            }
            //stored vars
            if(window.localStorage.allSettings){
                var allS=JSON.parse(window.localStorage.allSettings);
            }
            var fajrS=JSON.parse(window.localStorage.fajrSettings);
            var zuhrS=JSON.parse(window.localStorage.zuhrSettings);
            var asrS=JSON.parse(window.localStorage.asrSettings);
            var maghribS=JSON.parse(window.localStorage.maghribSettings);
            var ishaS=JSON.parse(window.localStorage.ishaSettings);
            var eventFor=JSON.parse(window.localStorage.eventFor);
            var alertType=JSON.parse(window.localStorage.alertType);
            var lastFor=window.localStorage.lastFor;
            
            if($.inArray("ALL", eventFor) != -1){
                $("#AllprayersSettings").attr('checked',true);
                $("#AllprayersSettings").trigger("change");
            }
            if($.inArray("fajr", eventFor) != -1){
                $("#fajrPrayer").attr('checked',true);
            }
            if($.inArray("zuhr", eventFor) != -1){
                $("#zuhrPrayer").attr('checked',true);
            }
            if($.inArray("asr", eventFor) != -1){
                $("#asrPrayer").attr('checked',true);
            }
            if($.inArray("maghrib", eventFor) != -1){
                $("#maghribPrayer").attr('checked',true);
            }
            if($.inArray("isha", eventFor) != -1){
                $("#ishaPrayer").attr('checked',true);
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

            if(allS){
                $("#allPrayersReminderTime").val(allS.reminderAt);
                $("#allPrayersEventLong").val(allS.eventLong);
                $("#allPrayersPrivacy").val(allS.privacy);
                $("#allPrayersStatus").val(allS.status);
            }

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
        },
        login:function(){
            window.open(background.ProxyService.proxyRootURL+background.ProxyService.authSub,"");
            chrome.extension.sendRequest({
                'action':'authenticate'
            });
            window.close();
        },
        resetAllPrayers:function(){
            $('.tooltip').hide();
            $("#reset").unbind("mouseover");
            $("#reset").unbind("mouseout");
            $("#deleted").fadeIn(100, function(){
                $("#reset").attr("disabled", true);
            });
            chrome.extension.sendRequest({
                action:"deleteAllPrayers"
            },function(){
                resetAction();
                $("#deleted").fadeOut(100, function(){
                    $("#reset").attr("disabled", false);
                });
            });
        }
    };
    $(function(){
        icOptions.initialize();
        icOptions.domEvents();
    });
    return icOptions;
}

var Positioning={
    initialize:function(){
        var myOptions = {
            zoom: zoomLevel,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl:false
        };
        // initializing the map and the geocoder
        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        // setting the map center to the current position
        var position = null;
        if( window.localStorage.position){
            position = JSON.parse(window.localStorage.position);
        }
        moveToCurrent(position);

        //adding lister to changer lat,lng as the zoom changed.
        google.maps.event.addListener(map, 'zoom_changed', function() {
            zoomLevel = map.getZoom();
            //            center = map.getCenter();
            map.setCenter(center);
            //stoping the marker moving.
            //marker.setPosition(center);
            moveToDarwin(center.lat(),center.lng());
        //Positioning.newPosition();
        });

        //adding listener to dragging the map
        google.maps.event.addListener(map, "dragend", function() {
            //Positioning.newPosition();
            });

        google.maps.event.addListener(map, "drag", function() {
            center = map.getCenter();
            //stoping marker movement.
            //marker.setPosition(center);
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

        function setMapCenter(lat,lng){
            center = new google.maps.LatLng(lat,lng);
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
        }

        function moveToCurrent(oldPos){
            if(oldPos){
                setMapCenter(oldPos.lat,oldPos.lng);
            }else{
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        setMapCenter(position.coords.latitude,position.coords.longitude);
                    }, function() {
                        handleNoGeolocation();
                    });
                }
            }
        }

        function handleNoGeolocation() {
            map.setCenter(new google.maps.LatLng(43.834526782236814, -37.265625));
            map.setOptions({
                zoom:zoomLevel
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
                center = results[0].geometry.location;
                map.setCenter(center);
                marker.setPosition(center);
                marker.setDraggable(true);
                google.maps.event.addListener(marker,'dragend',function(){
                    center=marker.getPosition();
                    map.setCenter(center);
                    Positioning.newPosition();
                });
                map.setOptions({
                    zoom:zoomLevel
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
        lat = center.lat();
        lng = center.lng();
    },
    geonamesVars:function(){
        background.Positioning.geonamesVars(center.lat(),center.lng(),function(ob){
            gmt=ob.gmtOffset;
            timezoneId=ob.timezoneId;
            country = ob.countryName;
            countryCode = ob.countryCode;
        });
        background.Positioning.googlemapsLocation(center.lat(),center.lng(),function(ob){
            formatted_address = null;
            for(var i = 0 ; i < ob.results.length; i++){
                if($.inArray("administrative_area_level_2", ob.results[i].types) != -1/* ||  $.inArray("street_address", ob.results[i].types) != -1*/){
                    formatted_address=ob.results[i].formatted_address;
                    i = ob.results.length;
                }
            }
            if(formatted_address == null){
                for(var h = 0 ; h < ob.results.length; h++){
                    if($.inArray("administrative_area_level_1", ob.results[h].types) != -1){
                        formatted_address=ob.results[h].formatted_address;
                        h = ob.results.length;
                    }
                }
            }
            if(formatted_address == null){
                for( h = 0 ; h < ob.results.length; h++){
                    if($.inArray("route", ob.results[h].types) != -1){
                        formatted_address=ob.results[h].formatted_address;
                        h = ob.results.length;
                    }
                }
            }
            $("#address").val(formatted_address);
        });
    }
}
var icOptions= new icOptions();
$(function(){
    Positioning.initialize();
    $("#gotoButton").click(function(){
        Positioning.codeAddress();
    });
    $("#searchForm").submit(function(){
        Positioning.codeAddress();
        return false;
    });
    window.setTimeout(Positioning.newPosition, 1000);
})
