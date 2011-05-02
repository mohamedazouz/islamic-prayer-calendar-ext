/*
 * changing locals to page accourding to the presetted locals or from navegator local language.
 * How to : add attribute local to each element you want (i.e.: <div local="localvariable"> Some Text </div> ) to set it's local language and add local value to Mylocals variable for each language
 * you want to view (i.e.:  Mylocals={ar:{localvariable:'Some Text In Arabic'},en:{localvariable:'Some Text in English'}} ).
 * set extra css file path and name you want to add to the RTLStyle variable.
 */
var Mylocals={
    ar:{},
    en:{}
}
var RTLStyle='';
var setLocals = function(){
    function getNavigatorLang (){
        var lang=window.navigator.language;
        if(lang.indexOf("ar")!= -1){
            return 'ar';
        }else if(lang.indexOf("en")!= -1){
            return 'en';
        }else{
            return 'en';
        }
    }
    if(! window.localStorage.lang){
        window.localStorage.lang = getNavigatorLang();
    }
    var lang=window.localStorage.lang;
    if(lang == 'ar'){
        var link=document.createElement("link");
        link.setAttribute("href", RTLStyle);
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        $('head').append(link);
    }
    try{
        $("*").each(function(){
            var local=$(this).attr("local");
            if(local != null && local != undefined){
                $(this).text((Mylocals[lang])[local]);
            }
        });
    }catch(e){
        console.log(e);
    }
}
setLocals();