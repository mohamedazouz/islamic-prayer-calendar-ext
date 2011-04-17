/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var icBackground=function(){
    var icBackground ={

    }
    $(function(){
        if(!window.localStorage.setup){
            extension.openOptionPage();
        }
    });
    return icBackground;
};

icBackgroun = new icBackground();
