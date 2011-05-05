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
    formXhanchPrayersURL:function(lat,lng,yy,mm,gmt){
        return ProxyService.XhanchPrayersURL+'lat='+lat+'&lng='+lng+'&yy='+yy+'&mm='+mm+'&gmt='+gmt+'&m=json';
    }
}
var ICProxyService = function(ob){
    var icProxyService = {
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
        }
    }
    $(function(){
        ProxyServic=$.extend(ProxyService, ob);
    });
    return icProxyService;
}
var icProxyService = new ICProxyService();
