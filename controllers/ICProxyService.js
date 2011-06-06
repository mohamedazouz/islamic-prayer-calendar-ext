/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var ProxyService = {
    /**
     * Parameters:
     * lat=?&lng=?&yy=?&mm=?&gmt=?&m=json
     */
    XhanchPrayersURL : 'http://xhanch.com/api/islamic-get-prayer-time.php?',
    //    XhanchPrayersURL : 'http://localhost:88/temp/prayer.json?',
    formXhanchPrayersURL:function(lat,lng,yy,mm,gmt){
        return ProxyService.XhanchPrayersURL+'lat='+lat+'&lng='+lng+'&yy='+yy+'&mm='+mm+'&gmt='+gmt+'&m=json';
    },
    //proxyRootURL:'http://calendar.activedd.com',
//    proxyRootURL:'http://localhost:8084/cp',
    proxyRootURL:'http://local.activedd.com:8080/CalendarProxy',
    authSub:'/authsub/login.htm?nextcallback=../extensionloginthanks.htm',
    fetchToken:'/authsub/fetchtoken.htm',
    insertURL:'/isprayer/setiprayersForDay.htm',
    deleteOldURL:'/isprayer/deleteOldPrayers.htm',
    deleteAllURL:'/isprayer/deleteAllPrayers.htm'
}
var ICProxyService = function(ob){
    var icProxyService = {
        /**
         * get the prayer times from xhanch
         */
        loadPrayerTimes:function(lat,lng,yy,mm,gmt,fn){
            $.ajax({
                url:ProxyServic.formXhanchPrayersURL(lat, lng, yy, mm, gmt),
                dataType:'json',
                success:function(res){
                    var nextMon = (parseInt(mm)+1) %12;
                    if(nextMon == 1){
                        yy = parseInt(yy)+1;
                    }
                    $.ajax({
                        url:ProxyServic.formXhanchPrayersURL(lat, lng, yy, nextMon, gmt),
                        dataType:'json',
                        success:function(res2){
                            fn(res,res2)
                        }
                    });
                }
            });
        },
        /**
         * delete prayers that in the past.
         */
        deleteOldPrayers:function(fn){
            if(! window.localStorage.userAuth){
                return;
            }
            var authToken=window.localStorage.userAuth;
            $.ajax({
                url:ProxyService.proxyRootURL+ProxyService.deleteOldURL,
                dataType:'json',
                data:{
                    authToken:authToken
                },
                success:function(response){
                    fn(response);
                }
            });
        },
        /**
         * delete all prayers events.
         */
        deleteAllPrayers:function(fn){
            if(! window.localStorage.userAuth){
                return;
            }
            var authToken=window.localStorage.userAuth;
            $.ajax({
                url:ProxyService.proxyRootURL+ProxyService.deleteAllURL,
                dataType:'json',
                data:{
                    authToken:authToken
                },
                success:function(response){
                    fn(response);
                }
            });
        },
        /**
         * insert day prayers.
         * request parameters: [day, fajrObject, zuhrObject, asrObject, maghribObject, ishaObject]
         * Object must contains match the following {time sttime, busytime, privacy, status}
         */
        insertDayPrayer:function(prayerDay,fn,count){
            if(! window.localStorage.userAuth){
                if(! count){
                    count = 1;
                }
                count++;
                if(count < 6){
                    window.setTimeout(function(){
                        icProxyService.insertDayPrayer(prayerDay, fn,count);
                    }, 10 * 1000);
                }
                return;
            }
            var eventFor=JSON.parse(window.localStorage.eventFor);
            if(eventFor.length == 0){
                return;
            }
            var authToken=window.localStorage.userAuth;
            var fajrSettings=JSON.parse(window.localStorage.fajrSettings);
            var zuhrSettings=JSON.parse(window.localStorage.zuhrSettings);
            var asrSettings=JSON.parse(window.localStorage.asrSettings);
            var maghribSettings=JSON.parse(window.localStorage.maghribSettings);
            var ishaSettings=JSON.parse(window.localStorage.ishaSettings);
            $.ajax({
                url:ProxyService.proxyRootURL+ProxyService.insertURL,
                data:{
                    authToken:authToken,
                    eventFor:eventFor,
                    alertType:JSON.parse(window.localStorage.alertType),
                    gmtOffset:window.localStorage.gmtOffset,
                    timezoneId:window.localStorage.timeZoneId,
                    fajr:JSON.stringify({
                        reminderAt:fajrSettings.reminderAt,
                        sttime:prayerDay.fajrTime,
                        busytime:fajrSettings.eventLong,
                        privacy:fajrSettings.privacy,
                        status:fajrSettings.status
                    }),
                    zuhr:JSON.stringify({
                        reminderAt:zuhrSettings.reminderAt,
                        sttime:prayerDay.zuhrTime+(zuhrSettings.reminderAt * 1000 * 60),
                        busytime:zuhrSettings.eventLong,
                        privacy:zuhrSettings.privacy,
                        status:zuhrSettings.status
                    }),
                    asr:JSON.stringify({
                        reminderAt:asrSettings.reminderAt,
                        sttime:prayerDay.asrTime+(asrSettings.reminderAt * 1000 * 60),
                        busytime:asrSettings.eventLong,
                        privacy:asrSettings.privacy,
                        status:asrSettings.status
                    }),
                    maghrib:JSON.stringify({
                        reminderAt:maghribSettings.reminderAt,
                        sttime:prayerDay.maghribTime+(maghribSettings.reminderAt * 1000 * 60),
                        busytime:maghribSettings.eventLong,
                        privacy:maghribSettings.privacy,
                        status:maghribSettings.status
                    }),
                    isha:JSON.stringify({
                        reminderAt:ishaSettings.reminderAt,
                        sttime:prayerDay.ishaTime+(ishaSettings.reminderAt * 1000 * 60),
                        busytime:ishaSettings.eventLong,
                        privacy:ishaSettings.privacy,
                        status:ishaSettings.status
                    })
                },
                dataType:'json',
                type:'post',
                success:function(response){
                    fn(response);
                }
            });
        },
        /**
         *
         */
        getAuthSubToken:function(count,handler){
            if(! count){
                count=0;
            }
            $.ajax({
                url:ProxyService.proxyRootURL+ProxyService.fetchToken,
                dataType:'json',
                success:function(ob){
                    if((! ob || ob.status != '200')){
                        if(count < 60){
                            window.setTimeout(function (){
                                icProxyService.getAuthSubToken(count+1, handler);
                            }, 1000);
                        }
                    }else{
                        handler(ob);
                    }
                },
                error:function(){
                    if(count < 60){
                        window.setTimeout(function(){
                            icProxyService.getAuthSubToken(count+1, handler);
                        }, 1000);
                    }
                }
            })
        }
    }
    $(function(){
        ProxyServic=$.extend(ProxyService, ob);
    });
    return icProxyService;
}
var icProxyService = new ICProxyService();
