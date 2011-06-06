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
        "popup":"نافذة منبثقة",
        "email":"بريد إلكترونى",
        "sms":"رسالة قصيرة",
        "privacysettings":"الحالة و الخصوصية لصلاة طبقاً لتقويم Google",
        "notation":" سيظهر فى تقويم Google مواقيت الصلاة المختارة فقط  ",
        "alertAfter":"بدأ الصلاة بعد الأذان بـ",
        "min":"(دقيقة/دقائق)",
        "for":"لمدة",
        "privacy":"الخصوصية",
        "available":"متواجد",
        "busy":"مشغول",
        "status":"الحاله",
        "general":"عام",
        "private":"خاص",
        "default":"افتراضى",
        "saveFor":"المدة الزمنية لتسجيل مواقيت الصلاة طبقاً لتقويم Google",
        "weakly":"أسبوعى",
        "monthly":"شهرى",
        "save":"حفظ",
        "cancel":"حذف",
        "allprayers":"كل الصلوات",
        "fajrPrayer":"صلاة الفجر",
        "zuhrPrayer":"صلاة الظهر",
        "asrPrayer":"صلاة العصر",
        "maghribPrayer":"صلاة المغرب",
        "ishaPrayer":"صلاة العشاء",
        "ar":"العربية",
        "en":"English",
        "lang":"اللغة",
        "saved":"تم حفظ الاعدادات",
        "deleted":" ‫سيتم حذف مواقيت الصلاة في غضون دقائق"
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
        "cancel":"Delete",
        "allprayers":"All",
        "fajrPrayer":"Fajr Prayer",
        "zuhrPrayer":"Dhuhr Prayer",
        "asrPrayer":"'Asr Prayer",
        "maghribPrayer":"Maghrib Prayer",
        "ishaPrayer":"'Isha' Prayer",
        "ar":"العربية",
        "en":"English",
        "lang":"Lang",
        "saved":"Settings Saved",
        "deleted":"The prayer times will be deleted within minutes!"
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
        link.setAttribute("id", "NewStyle");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        $('head').append(link);
        $("div.tooltip img").attr("src","images/tooltip_en.png");
    }else{
        $("#NewStyle").remove();
        $("div.tooltip img").attr("src","images/tooltip_ar.png");
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
        setLocals();
    });
})