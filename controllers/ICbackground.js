/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var icBackground=function(){
    var icBackground ={
        /**
         * constructor of islamic calendar background class.
         */
        initialize:function(){
            if(! window.localStorage.lastFor){
                window.localStorage.lastFor = 7;
            }
        },
        /**
         * the running processes.
         */
        doInBackground:function(){

        },
        /**
         * update the calendar.
         */
        updateCalendar:function(){

        },
        nextPrayerBadge:function(){
            if(! window.localStorage.prayers){
                return;
            }
            var nextPrayer;
            if(! window.localStorage.nextPrayer){
                var now=new Date();
                var prayers=JSON.parse(window.localStorage.prayers);
                var todayPrayers=prayers[now.getDate()];
                var fajr = new Date();
                fajr.setHours(todayPrayers.fajr.split(':')[0], todayPrayers.fajr.split(':')[1]);
                var zuhr = new Date();
                zuhr.setHours(todayPrayers.zuhr.split(':')[0], todayPrayers.zuhr.split(':')[1]);
                var asr = new Date();
                asr.setHours(todayPrayers.asr.split(':')[0], todayPrayers.asr.split(':')[1]);
                var maghreb = new Date();
                maghreb.setHours(todayPrayers.maghreb.split(':')[0], todayPrayers.maghreb.split(':')[1]);
                var isha = new Date();
                isha.setHours(todayPrayers.isha.split(':')[0], todayPrayers.isha.split(':')[1]);
                var todayprayersTimes = new Array();
                todayprayersTimes.push(fajr.getTime());
                todayprayersTimes.push(zuhr.getTime());
                todayprayersTimes.push(asr.getTime());
                todayprayersTimes.push(maghreb.getTime());
                todayprayersTimes.push(isha.getTime());
                var nextPrayerTime;
                for(i = 0; todayprayersTimes.length; i++){
                    if(now.getTime() < todayprayersTimes[i]){
                        nextPrayerTime=todayprayersTimes[i];
                    }
                }
            }
            console.log(todayPrayers);
            console.log(todayPrayers[0]);
        },
        /**
         * update client position and check it's changed.
         */
        updatePosition:function(){
            if(window.navigator.geolocation){
                //getting the new position.
                navigator.geolocation.getCurrentPosition(function(pos) {
                    var position={
                        lat:pos.coords.latitude,
                        lng:pos.coords.longitude
                    }
                    if(! window.localStorage.position){
                        window.localStorage.position=JSON.stringify(position);
                    }
                    var oldPosition = JSON.parse(window.localStorage.position);
                    if(Positioning.latLngChanged(position, oldPosition)){
                        //position changed, do what ever you do when the position changed.
                    }
                });
            }
        },
        /**
         * check for the last calendar updated day, and if it's not within a week or a month as setted in the option complete it for week/month.
         */
        calendarLast:function(){
            icdb.getLastday(function(lastprayer){
                if(lastprayer){
                    var lastFor=parseInt(window.localStorage.lastFor);
                    var lastdate=new Date(lastprayer.date);
                    var date=new Date();
                    date.setTime(date.getTime()+ (lastFor * 24 * 60 * 60 * 1000));
                    if(date.getDate() != lastdate.getdata() || date.getMonth() != lastdate.getMonth() ){
                        //u have calendar leek. :) do something about that.
                    }
                }
            });
        }
    }
    $(function(){
        //icBackground.nextPrayerBadge();
        if(!window.localStorage.setup){
    //extension.openOptionPage();
    }
    });
    return icBackground;
};

icBackground = new icBackground();
icBackground.updatePosition();
var Positioning={};

Positioning.geonamesVars = function(lat,lng,handler){
    var geoURL="http://api.geonames.org/timezoneJSON";
    $.ajax({
        url:geoURL,
        dataType:'json',
        data:{
            lat:lat,
            lng:lng,
            username:'gshaban'
        },
        success:function(ob){
            handler(ob);
        }
    });
}
Positioning.googlemapsLocation=function(lat,lng,handler){
    var mapAPIURL="https://maps.googleapis.com/maps/api/geocode/json";
    $.ajax({
        url:mapAPIURL,
        dataType:'json',
        data:{
            latlng:lat+','+lng,
            sensor:'false'
        },
        success:function(ob){
            handler(ob)
        }
    })
}
Positioning.latLngChanged = function(newPosition,oldPosition){
    var latDifference = 10, lngDifference = 1, positionChanged = false;

    newPosition.lat = Math.sqrt(newPosition.lat * newPosition.lat);
    newPosition.lng = Math.sqrt(newPosition.lng * newPosition.lng);

    oldPosition.lat = Math.sqrt(oldPosition.lat * oldPosition.lat);
    oldPosition.lng = Math.sqrt(oldPosition.lng * oldPosition.lng);

    if(Math.sqrt((newPosition.lat - oldPosition.lat) * (newPosition.lat - oldPosition.lat)) > latDifference  ||
        Math.sqrt((newPosition.lng - oldPosition.lng) * (newPosition.lng - oldPosition.lng)) > lngDifference ){
        positionChanged = true;
    }

    return positionChanged;
}