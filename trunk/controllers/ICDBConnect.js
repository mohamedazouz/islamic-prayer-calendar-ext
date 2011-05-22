/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var ICDB = function(){
    var icdb={
        db:this.db,
        setup:function(){
            icdb.db=openDatabase('islamicCalendar', '1.0', 'Islamic Calendar extension database',  5*1024*1024);
            icdb.db.transaction(function(tx) {
                tx.executeSql("create table if not exists " +
                    "ic(id integer primary key asc, name string, date string,"+
                    "time string,datetime string);",
                    [],
                    function() {
                        console.log("ic on.");
                    },
                    icdb.onError);
            });
        },
        getLastday:function(fn){
            var cs=[];
            icdb.db.transaction(function(tx){
                tx.executeSql("SELECT * FROM ic WHERE id = (select MAX(id) FROM ic);",
                    [],
                    function(tx,results) {
                        for (i = 0; i < results.rows.length; i++) {
                            cs.push(util.clone(results.rows.item(i)));
                        }
                        fn(cs.length == 0 ? null:cs[0]);
                    });
            });
        },
        insertPrayer:function(prayer,fn){
            icdb.db.transaction(function(tx) {
                tx.executeSql("INSERT into ic (name,date,time,datetime) VALUES (?,?,?,?);",
                    [prayer.name,prayer.date,prayer.time,prayer.dateTime],
                    fn,
                    icdb.onError);
            });
        },
        insertDayPrayer:function(prayerDay,date,fn){
            icdb.db.transaction(function(tx) {
                tx.executeSql("INSERT into ic (name,date,time,datetime) VALUES (?,?,?,?);",
                    ['fajr',date,prayerDay.fajr,prayerDay.fajrTime],
                    null,
                    icdb.onError);
                tx.executeSql("INSERT into ic (name,date,time,datetime) VALUES (?,?,?,?);",
                    ['zuhr',date,prayerDay.zuhr,prayerDay.zuhrTime],
                    null,
                    icdb.onError);
                tx.executeSql("INSERT into ic (name,date,time,datetime) VALUES (?,?,?,?);",
                    ['asr',date,prayerDay.asr,prayerDay.asrTime],
                    null,
                    icdb.onError);
                tx.executeSql("INSERT into ic (name,date,time,datetime) VALUES (?,?,?,?);",
                    ['maghrib',date,prayerDay.maghrib,prayerDay.maghribTime],
                    null,
                    icdb.onError);
                tx.executeSql("INSERT into ic (name,date,time,datetime) VALUES (?,?,?,?);",
                    ['isha',date,prayerDay.isha,prayerDay.ishaTime],
                    fn,
                    icdb.onError);
            });
        },
        getNextPrayer:function(now,fn){
            var cs=[];
            icdb.db.transaction(function(tx){
                tx.executeSql("SELECT * FROM ic WHERE datetime > ? Limit 1 ;",
                    [now],
                    function(tx,results) {
                        for (i = 0; i < results.rows.length; i++) {
                            cs.push(util.clone(results.rows.item(i)));
                        }
                        fn(cs.length == 0 ? null:cs[0]);
                    });
            });
        },
        deleteOldPrayers:function(fn){
            icdb.db.transaction(function(tx){
                tx.executeSql("DELETE FROM ic WHERE datetime < ? ;",
                    [new Date().getTime()],
                    fn);
            });
        },
        deleteAllPrayers:function(fn){
            icdb.db.transaction(function(tx){
                tx.executeSql("DELETE FROM ic;",
                    [],
                    fn);
            });
        },
        onError: function(tx,error) {
            console.log("Error occurred: ", error);
        }
    }
    $(function(){
        icdb.setup();
    });
    return icdb;
}
var icdb = new ICDB();
