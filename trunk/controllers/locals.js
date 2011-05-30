/*
 * changing locals to page accourding to the presetted locals or from navegator local language.
 * How to : add attribute local to each element you want (i.e.: <div local="localvariable"> Some Text </div> ) to set it's local language and add local value to Mylocals variable for each language
 * you want to view (i.e.:  Mylocals={ar:{localvariable:'Some Text In Arabic'},en:{localvariable:'Some Text in English'}} ).
 * set extra css file path and name you want to add to the RTLStyle variable.
 */
var Mylocals={
    ar:{
        "PrayersSettings":"إعدادات مواقيت الصلاة",
        "positioning":"تحديد المكان",
        "currentPosition":"تبعا للموقع الحالى",
        "search":"بحث",
        "Gcalendar":"تبعا لتقويم Google",
        "reminderType":"طريقة التذكير طبقاً لتقويم Google",
        "all":"الكل",
        "popup":"نا�?ذة منبثقة",
        "email":"بريد إلكترونى",
        "sms":"رسالة قصيرة",
        "privacysettings":"الحالة و الخصوصية لصلاة طبقاً لتقويم Google",
        "notation":" سيظهر �?ى تقويم Google مواقيت الصلاة المختارة �?قط  ",
        "alertAfter":"بدأ الصلاة بعد الأذان بـ (دقيقة/دقائق)",
        "min":"(دقيقة/دقائق)",
        "for":"لمدة",
        "privacy":"الخصوصية",
        "available":"متواجد",
        "busy":"مشغول",
        "status":"الحاله",
        "general":"عام",
        "private":"خاص",
        "default":"ا�?تراضى",
        "saveFor":"المدة الزمنية لتسجيل مواقيت الصلاة طبقاً لتقويم Google",
        "weakly":"أسبوعى",
        "monthly":"شهرى",
        "save":"ح�?ظ",
        "cancel":"الغاء التعديلات",
        "allprayers":"كل الصلوات",
        "fajrPrayer":"صلاة ال�?جر",
        "zuhrPrayer":"صلاة الظهر",
        "asrPrayer":"صلاة العصر",
        "maghribPrayer":"صلاة المغرب",
        "ishaPrayer":"صلاة العشاء",
        "ar":"العربية",
        "en":"English"
    },
    en:{
        "PrayersSettings":"Prayer Times Settings",
        "positioning":"localtion settings",
        "currentPosition":"According to Current Location",
        "search":"search",
        "Gcalendar":"Google Calendar Settings",
        "reminderType":"Reminder Method in Google Canlender",
        "all":"All",
        "popup":"Pop-up",
        "email":"Email",
        "sms":"SMS",
        "privacysettings":"Status & Privacy for players in Google Calender",
        "notation":"Only the selected Prayer timing will be exist in Google Calender",
        "alertAfter":"Prayer After",
        "min":"(Min/Mins)",
        "for":"For",
        "privacy":"Privacy",
        "available":"Available",
        "busy":"Busy",
        "status":"Status",
        "general":"Public",
        "private":"Private",
        "default":"Default",
        "saveFor":"Period to record Prayer Times in Google Calendar",
        "weakly":"Weekly",
        "monthly":"Monthly",
        "save":"Save",
        "cancel":"Cancel modifications",
        "allprayers":"All",
        "fajrPrayer":"Fajr Prayer",
        "zuhrPrayer":"Dhuhr Prayer",
        "asrPrayer":"'Asr Prayer",
        "maghribPrayer":"Maghrib Prayer",
        "ishaPrayer":"'Isha' Prayer",
        "ar":"العربية",
        "en":"English"
    }
}
var RTLStyle='css/english.css';
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
    if(lang == 'en'){
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
$(function(){
    setLocals();
    $("#langChooser").val(window.localStorage.lang);
    $("#langChooser").change(function(){
        window.localStorage.lang=this.value;
        window.location.reload();
    });
})