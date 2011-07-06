/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
dayInMilliSecond = 1000 * 60 * 60 * 24;
var icBackground=function(){
    var icbackground ={
        /**
         * constructor of islamic calendar background class.
         */
        initialize:function(){
            icbackground.initialData();
            icbackground.doInBackground();
        //skip open option page if not settings saved.
        /*if(! window.localStorage.setup){
                extension.openOptionPage();
            }*/
        },
        /**
         * set Extension initial data settings.
         */
        initialData:function(){
            if(! window.localStorage.lastFor){
                window.localStorage.lastFor = 7;
            }
            if(! window.localStorage.alertType){
                window.localStorage.alertType = JSON.stringify(['ALL']);
            }
            if(! window.localStorage.eventFor){
                window.localStorage.eventFor = JSON.stringify(['ALL']);
            }
            if(! window.localStorage.fajrSettings){
                window.localStorage.fajrSettings = JSON.stringify({
                    reminderAt:10,
                    eventLong:10,
                    privacy:'public',
                    status:'opaque'
                });
            }
            if(! window.localStorage.zuhrSettings){
                window.localStorage.zuhrSettings = JSON.stringify({
                    reminderAt:10,
                    eventLong:10,
                    privacy:'public',
                    status:'opaque'
                });
            }
            if(! window.localStorage.asrSettings){
                window.localStorage.asrSettings = JSON.stringify({
                    reminderAt:10,
                    eventLong:10,
                    privacy:'public',
                    status:'opaque'
                });
            }
            if(! window.localStorage.maghribSettings){
                window.localStorage.maghribSettings = JSON.stringify({
                    reminderAt:10,
                    eventLong:10,
                    privacy:'public',
                    status:'opaque'
                });
            }
            if(! window.localStorage.ishaSettings){
                window.localStorage.ishaSettings = JSON.stringify({
                    reminderAt:10,
                    eventLong:10,
                    privacy:'public',
                    status:'opaque'
                });
            }

        },
        /**
         * the running processes.
         */
        doInBackground:function(){
            window.setInterval(function(){
                icbackground.nextPrayerBadge();
            }, 1000 * 60);
            window.setInterval(function(){
                icbackground.calendarLast();
            }, dayInMilliSecond);
            window.setInterval(function(){
                icbackground.updatePosition();
            }, dayInMilliSecond);
            icbackground.nextPrayerBadge();
            icbackground.calendarLast();
            icbackground.updatePosition();
        },
        /**
         * shows the badge text for next prayer time left.
         */
        nextPrayerBadge:function(){
            var nextPrayer = null;
            if(window.localStorage.nextPrayer){
                nextPrayer = parseInt(window.localStorage.nextPrayer);
            }
            if(nextPrayer == null || nextPrayer < new Date().getTime()){
                icdb.getNextPrayer(new Date().getTime(), function(ob){
                    if(!ob){
                        return;
                    }
                    nextPrayer = ob.datetime;
                    window.localStorage.nextPrayer = nextPrayer;
                    window.localStorage.nextPrayerName= ob.name;
                    var timeDeff = nextPrayer - new Date().getTime();
                    timeDeff /= (1000 * 60);
                    extension.setBadgeText(Math.floor(timeDeff / 60) + ":" + Math.floor(timeDeff % 60));
                    chrome.browserAction.setTitle({
                        title:(((Mylocals[window.localStorage.lang].badgeTitle).replace("#HR",Math.floor(timeDeff / 60))).
                            replace("#MIN", Math.floor(timeDeff % 60))).replace("#PR", Mylocals[window.localStorage.lang][window.localStorage.nextPrayerName])
                    });
                });
                icdb.deleteOldPrayers(null);
                icProxyService.deleteOldPrayers(function(rs){
                    console.log(rs)
                });
            }else{
                var timeDeff = nextPrayer - new Date().getTime();
                timeDeff /= (1000 * 60);
                extension.setBadgeText(Math.floor(timeDeff / 60) + ":" + Math.floor(timeDeff % 60));
                chrome.browserAction.setTitle({
                    title:(((Mylocals[window.localStorage.lang].badgeTitle).replace("#HR",Math.floor(timeDeff / 60))).
                        replace("#MIN", Math.floor(timeDeff % 60))).replace("#PR", Mylocals[window.localStorage.lang][window.localStorage.nextPrayerName])
                });
            }
            
        },
        /**
         * update client position and check it's changed.
         */
        updatePosition:function(){
            if(window.navigator.geolocation){
                //getting the new position.
                Positioning.getPosition(function(position){
                    if(! window.localStorage.position){
                        window.localStorage.position=JSON.stringify(position);
                    }
                    var oldPosition = JSON.parse(window.localStorage.position);
                    if(Positioning.latLngChanged(position, oldPosition)){
                        //position changed, do what ever you do when the position changed.
                        //delete the old calendar events, create new events for the upcoming days.
                        icProxyService.deleteAllPrayers(function(){
                            icdb.deleteAllPrayers(function(){
                                icbackground.calendarLast();
                            });
                        });
                    }
                });

            }
        },
        /**
         * check for the last calendar updated day, and if it's not within a week or a month as setted in the option complete it for week/month.
         */
        calendarLast:function(fn){
            icdb.getLastday(function(lastprayer){
                var lastdate=null;
                if(lastprayer){
                    lastdate=new Date(lastprayer.date);
                }else{
                    lastdate=new Date(date_util.yesterDay("-"));
                }
                var lastFor=parseInt(window.localStorage.lastFor);
                var date=new Date(date_util.today('-'));
                date.setTime(date.getTime()+ (lastFor * dayInMilliSecond));
                if(date.getDate() != lastdate.getDate() || date.getMonth() != lastdate.getMonth() ){
                    //u have calendar leek. :) do something about that.
                    //update the missing days.
                    function sendData(pos){
                        var month =lastdate.getMonth()+1;
                        icProxyService.loadPrayerTimes(pos.lat, pos.lng,lastdate.getFullYear(), month, window.localStorage.gmtOffset, function(ob,ob2){
                            function recusiveSaving(index){
                                lastdate.setTime(lastdate.getTime() + dayInMilliSecond);
                                var dayPrayers = null;
                                if(lastdate.getMonth()+1 == month){
                                    dayPrayers=ob[lastdate.getDate()];
                                }else{
                                    dayPrayers=ob2[lastdate.getDate()];
                                }
                                var fajr=new Date(lastdate.getFullYear(),lastdate.getMonth(),lastdate.getDate(),
                                    dayPrayers.fajr.split(":")[0],
                                    dayPrayers.fajr.split(":")[1]);
                                var zuhr=new Date(lastdate.getFullYear(),lastdate.getMonth(),lastdate.getDate(),dayPrayers.zuhr.split(":")[0],dayPrayers.zuhr.split(":")[1]);
                                var asr=new Date(lastdate.getFullYear(),lastdate.getMonth(),lastdate.getDate(),dayPrayers.asr.split(":")[0],dayPrayers.asr.split(":")[1]);
                                var maghrib=new Date(lastdate.getFullYear(),lastdate.getMonth(),lastdate.getDate(),dayPrayers.maghrib.split(":")[0],dayPrayers.maghrib.split(":")[1]);
                                var isha=new Date(lastdate.getFullYear(),lastdate.getMonth(),lastdate.getDate(),dayPrayers.isha.split(":")[0],dayPrayers.isha.split(":")[1]);
                                dayPrayers.fajrTime=fajr.getTime();
                                dayPrayers.zuhrTime=zuhr.getTime();
                                dayPrayers.asrTime=asr.getTime();
                                dayPrayers.maghribTime=maghrib.getTime();
                                dayPrayers.ishaTime=isha.getTime();
                                icdb.insertDayPrayer(dayPrayers, date_util.getDayString(lastdate, "-"), function(){
                                    console.log('inserting prayers done.');
                                });
                                icProxyService.insertDayPrayer(dayPrayers, function(resp){
                                    console.log(new Date().getMinutes()+":"+new Date().getSeconds())
                                    if(index +1 < daydiff){
                                        recusiveSaving(index +1);
                                    }else{
                                        fn?fn(): console.log('done saving');
                                    }
                                });//now send to calendar to set new events.
                            }
                            recusiveSaving(0);
                        });
                    }
                    var daydiff=date.getTime()-lastdate.getTime();
                    daydiff /= dayInMilliSecond;//sendData
                    if(window.localStorage.position && window.localStorage.timeZoneId){
                        sendData(JSON.parse(window.localStorage.position));
                    }else{
                        Positioning.getPosition(function(pos){
                            Positioning.geonamesVars(pos.lat, pos.lng, function(ob){
                                window.localStorage.gmtOffset=ob.gmtOffset;
                                window.localStorage.timeZoneId=ob.timezoneId;
                                sendData(pos);
                            });
                        });
                    }
                }
            });
        },
        /**
         *
         */
        authenticate:function(){
            icProxyService.getAuthSubToken(0, function(ob){
                //window.localStorage.userAuth=ob.authToken;
                window.localStorage.logged="true";
                window.localStorage.user=JSON.stringify(ob)
               /* icProxyService.getGmailUserInfo(ob,function(response){
                    json=JSON.parse(response);
                    
                    window.localStorage.user=JSON.stringify({
                        name:json.name,
                        userAuth:ob.authToken,
                        email:json.email
                    });
                })*/
            });
        },
        /**
         *
         */
        resetCalendar:function(fn){
            icProxyService.deleteAllPrayers(function(){
                icdb.deleteAllPrayers(function(){
                    icbackground.calendarLast(fn);
                });
            });
        },
        /**
         *
         */
        deleteAllPrayers:function(fn){
            icProxyService.deleteAllPrayers(fn);
        }
    }
    $(function(){
        icbackground.initialize();
    });
    return icbackground;
};

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
Positioning.getPosition = function(fn){
    navigator.geolocation.getCurrentPosition(function(pos) {
        var position={
            lat:pos.coords.latitude,
            lng:pos.coords.longitude
        }
        fn(position);
    })
}

var icbackground = new icBackground();
chrome.browserAction.onClicked.addListener(function(tab){
    extension.openOptionPage();
});
/**
 * Handles data sent via chrome.extension.sendRequest().
 * @param request Object Data sent in the request.
 * @param sender Object Origin of the request.
 * @param callback Function The method to call when the request completes.
 */
function onRequest(request, sender, callback) {
    if(request.action == 'authenticate'){
        icbackground.authenticate();
    }
    if(request.action == 'resetSettings'){
        icbackground.resetCalendar(callback);
    }
    if(request.action == 'deleteAllPrayers'){
        icbackground.deleteAllPrayers(callback);
    }
}

// Wire up the listener.
chrome.extension.onRequest.addListener(onRequest);

