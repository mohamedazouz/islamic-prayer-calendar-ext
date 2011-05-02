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
                    "time string);",
                    [],
                    function() {
                        console.log("friends on.");
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
