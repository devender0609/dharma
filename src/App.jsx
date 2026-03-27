import { useState, useEffect, useLayoutEffect, useRef, useCallback, memo } from "react";

/* ══════════════════════════════════════════════════════
   RESPONSIVE + TIME HOOKS
══════════════════════════════════════════════════════ */
function useBreakpoint() {
  const get = () => { if(typeof window==="undefined")return"desktop"; const w=window.innerWidth; return w<768?"mobile":w<1100?"tablet":"desktop"; };
  const [bp,setBp]=useState(get);
  useEffect(()=>{ const h=()=>setBp(get()); window.addEventListener("resize",h); return()=>window.removeEventListener("resize",h); },[]);
  return bp;
}
function useCurrentTime() {
  const [now,setNow]=useState(new Date());
  useEffect(()=>{ const id=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(id); },[]);
  return now;
}
function getActiveMuhurat(now) {
  const h=now.getHours(), m=now.getMinutes(), t=h*60+m;
  if(t>=293&&t<=338) return{name:"Brahma Muhurat",good:true,c:"#5BA4F5"};
  if(t>=523&&t<=623) return{name:"Amrit Kaal",good:true,c:"#3DDC84"};
  if(t>=721&&t<=770) return{name:"Abhijit Muhurat",good:true,c:"#3DDC84"};
  if(t>=720&&t<=810) return{name:"Yamaganda",good:false,c:"#E67E22"};
  if(t>=810&&t<=870) return{name:"Gulika Kaal",good:false,c:"#E67E22"};
  if(t>=900&&t<=990) return{name:"Rahu Kaal",good:false,c:"#FF4444"};
  return null;
}

/* ══════════════════════════════════════════════════════
   THEMES
══════════════════════════════════════════════════════ */
const DARK = {
  bg:"#0E0E22", card:"#1A1A36", cardHover:"#222248", border:"#2E2E52",
  sidebar:"#111128", saffron:"#FF7040", gold:"#FFC040", lotus:"#F02890",
  sacred:"#8855FF", green:"#3DDC84", blue:"#5BA4F5",
  text:"#F2F2FF", muted:"#CCC8E8", white:"#FFFFFF",
  heroGrad:"linear-gradient(145deg,#1A0840 0%,#2E1060 55%,#1A0840 100%)",
  inputBg:"#111128", surface:"rgba(255,255,255,0.07)",
};
const LIGHT = {
  bg:"#FAF6F0", card:"#FFFFFF", cardHover:"#F5EEE6", border:"#DDD4C8",
  sidebar:"#FFF4E8", saffron:"#C84400", gold:"#8A5E00", lotus:"#9A0A4A",
  sacred:"#5030BB", green:"#1A6E38", blue:"#1558A0",
  text:"#0E0E1E", muted:"#3E2E1C", white:"#FFFFFF",
  /* hero stays dark so white text is always readable */
  heroGrad:"linear-gradient(145deg,#3A0C58 0%,#5C1880 55%,#3A0C58 100%)",
  inputBg:"#EDE8E0", surface:"rgba(0,0,0,0.05)",
};
const WARM = {
  bg:"#FFF4E8", card:"#FFFFFF", cardHover:"#FFF0E0", border:"#E8D4B8",
  sidebar:"#FFF8F0", saffron:"#CC3800", gold:"#8A5800", lotus:"#8A0A38",
  sacred:"#6030BB", green:"#186E30", blue:"#1048A0",
  text:"#120400", muted:"#5A3218", white:"#FFFFFF",
  heroGrad:"linear-gradient(145deg,#5E1808 0%,#8A2C10 55%,#5E1808 100%)",
  inputBg:"#F0E4D0", surface:"rgba(0,0,0,0.05)",
};
const FOREST = {
  bg:"#081408", card:"#102010", cardHover:"#183018", border:"#1C3820",
  sidebar:"#081408", saffron:"#50D878", gold:"#98D858", lotus:"#F490C0",
  sacred:"#A078F8", green:"#50D878", blue:"#60A8F0",
  text:"#E4F8E4", muted:"#96C896", white:"#FFFFFF",
  heroGrad:"linear-gradient(145deg,#040C04 0%,#142810 55%,#040C04 100%)",
  inputBg:"#0C1C0C", surface:"rgba(255,255,255,0.07)",
};
const THEMES = {dark:DARK, light:LIGHT, warm:WARM, forest:FOREST};

const BILLING_CONFIG = {
  monthlyLink: (typeof import.meta!=="undefined" && import.meta.env && import.meta.env.VITE_STRIPE_PAYMENT_LINK_MONTHLY) || "",
  yearlyLink: (typeof import.meta!=="undefined" && import.meta.env && import.meta.env.VITE_STRIPE_PAYMENT_LINK_YEARLY) || "",
  customerPortalUrl: (typeof import.meta!=="undefined" && import.meta.env && import.meta.env.VITE_STRIPE_CUSTOMER_PORTAL_URL) || "",
  supportEmail: (typeof import.meta!=="undefined" && import.meta.env && import.meta.env.VITE_BILLING_SUPPORT_EMAIL) || "billing@vedanta.ai",
};

/* ══════════════════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════════════════ */
const TRANSLATIONS = {
  English:{
    today:"Today",calendar:"Calendar",ai:"AI Guide",rituals:"Rituals",tracker:"Tracker",profile:"Profile",
    auspicious:"AUSPICIOUS DAY",panchang:"Today Panchang",muhurats:"Muhurats and Kaal",
    sacredDates:"Upcoming Sacred Dates",festivals:"Upcoming Festivals",viewAll:"View All →",
    aiInsight:"AI DAILY INSIGHT",askAI:"Ask AI Assistant →",
    tithi:"Tithi",nakshatra:"Nakshatra",yoga:"Yoga",karana:"Karana",
    sunrise:"Sunrise",sunset:"Sunset",moonrise:"Moonrise",moonset:"Moonset",
    addToCal:"Add to Calendar",reminder:"Set Reminder",
    guidedRituals:"Guided Rituals",mantraLib:"Mantra Library",
    beginRitual:"Begin Guided Ritual",back:"← Back",complete:"✓ Complete",
    chant:"🔊 Chant",stop:"⏹ Stop",copy:"Copy",expand:"Details",copied:"✓ Copied",
    search:"Search mantras by name or deity...",
    trackerTitle:"Spiritual Tracker",addPractice:"+ Add New Spiritual Practice",
    logHabit:"Log",done:"✓ Done",goal:"Goal",totalDays:"Total Streak Days",bestStreak:"Best Streak",loggedToday:"Logged Today",
    birthCalc:"Birth Nakshatra Calculator",findNakshatra:"Find ✨",appearance:"Appearance",darkMode:"🌑 Dark",lightMode:"☀️ Light",
    region:"Region and Language",notifications:"Notifications and Sync",premium:"Vedanta Premium",upgrade:"Upgrade to Premium — ₹299/month",
    howTo:"How to Celebrate",
    namaste:"Namaste 🙏",
  },
  Hindi:{
    today:"आज",calendar:"कैलेंडर",ai:"AI गाइड",rituals:"अनुष्ठान",tracker:"ट्रैकर",profile:"प्रोफाइल",
    auspicious:"शुभ दिन",panchang:"आज का पंचांग",muhurats:"मुहूर्त और काल",
    sacredDates:"आगामी पावन तिथियां",festivals:"आगामी त्योहार",viewAll:"सभी देखें →",
    aiInsight:"AI दैनिक मार्गदर्शन",askAI:"AI सहायक से पूछें →",
    tithi:"तिथि",nakshatra:"नक्षत्र",yoga:"योग",karana:"करण",
    sunrise:"सूर्योदय",sunset:"सूर्यास्त",moonrise:"चंद्रोदय",moonset:"चंद्रास्त",
    addToCal:"कैलेंडर में जोड़ें",reminder:"स्मरण सेट करें",
    guidedRituals:"अनुष्ठान मार्गदर्शन",mantraLib:"मंत्र संग्रह",
    beginRitual:"अनुष्ठान शुरू करें",back:"← वापस",complete:"✓ पूर्ण",
    chant:"🔊 जाप करें",stop:"⏹ रोकें",copy:"कॉपी",expand:"विवरण",copied:"✓ कॉपी हुआ",
    search:"नाम या देवता से खोजें...",
    trackerTitle:"आध्यात्मिक ट्रैकर",addPractice:"+ नई साधना जोड़ें",
    logHabit:"दर्ज करें",done:"✓ हो गया",goal:"लक्ष्य",totalDays:"कुल दिन",bestStreak:"सर्वश्रेष्ठ क्रम",loggedToday:"आज दर्ज",
    birthCalc:"जन्म नक्षत्र कैलकुलेटर",findNakshatra:"खोजें ✨",appearance:"रूप-रंग",darkMode:"🌑 रात्रि",lightMode:"☀️ दिन",
    region:"क्षेत्र और भाषा",notifications:"सूचनाएं और सिंक",premium:"वेदांत प्रीमियम",upgrade:"प्रीमियम अपग्रेड करें — ₹299/माह",
    howTo:"उत्सव कैसे मनाएं",
    namaste:"नमस्ते 🙏",
  },
  Sanskrit:{
    today:"अद्य",calendar:"पञ्चाङ्गम्",ai:"AI मार्गदर्शकः",rituals:"अनुष्ठानम्",tracker:"अनुवर्तकम्",profile:"परिचयः",
    auspicious:"शुभ-दिनम्",panchang:"अद्यतन पञ्चाङ्गम्",muhurats:"मुहूर्तम् काले च",
    sacredDates:"आगामि-पवित्र-तिथयः",festivals:"आगामि-पर्वाणि",viewAll:"सर्वाणि पश्यतु →",
    aiInsight:"AI दैनिक-मार्गः",askAI:"AI-सहायकं पृच्छतु →",
    tithi:"तिथिः",nakshatra:"नक्षत्रम्",yoga:"योगः",karana:"करणम्",
    sunrise:"सूर्योदयः",sunset:"सूर्यास्तः",moonrise:"चन्द्रोदयः",moonset:"चन्द्रास्तः",
    addToCal:"पञ्चाङ्गे योजयतु",reminder:"स्मरणम्",
    guidedRituals:"अनुष्ठान-मार्गदर्शनम्",mantraLib:"मन्त्र-संग्रहः",
    beginRitual:"अनुष्ठानम् आरभताम्",back:"← प्रतिगच्छ",complete:"✓ सम्पन्नम्",
    chant:"🔊 जपः",stop:"⏹ स्थगयतु",copy:"प्रतिलिपि",expand:"विस्तारः",copied:"✓ प्रतिलिपि",
    search:"नाम्ना देवतया वा अन्विष्यतु...",
    trackerTitle:"आध्यात्मिक-अनुवर्तकम्",addPractice:"+ नूतन साधना",
    logHabit:"दर्ज",done:"✓ सम्पन्नम्",goal:"लक्ष्यम्",totalDays:"कुल-दिनानि",bestStreak:"श्रेष्ठ-क्रमः",loggedToday:"अद्य दर्जः",
    birthCalc:"जन्म-नक्षत्र-गणना",findNakshatra:"अन्विष्यतु ✨",appearance:"स्वरूपम्",darkMode:"🌑 रात्रि",lightMode:"☀️ दिवा",
    region:"प्रदेशः भाषा च",notifications:"सूचना-समन्वयः",premium:"वेदान्त-प्रीमियम्",upgrade:"प्रीमियम् — ₹299/मासे",
    howTo:"उत्सव-विधिः",
    namaste:"नमस्ते 🙏",
  },
  Tamil:{
    today:"இன்று",calendar:"நாட்காட்டி",ai:"AI வழிகாட்டி",rituals:"சடங்குகள்",tracker:"கண்காணிப்பு",profile:"சுயவிவரம்",
    auspicious:"சுப நாள்",panchang:"இன்றைய பஞ்சாங்கம்",muhurats:"முகூர்த்தம்",
    sacredDates:"வரவிருக்கும் புனித தேதிகள்",festivals:"வரவிருக்கும் திருவிழாக்கள்",viewAll:"அனைத்தும் →",
    aiInsight:"AI தினசரி வழிகாட்டி",askAI:"AI உதவியாளரிடம் கேளுங்கள் →",
    tithi:"திதி",nakshatra:"நட்சத்திரம்",yoga:"யோகம்",karana:"கரணம்",
    sunrise:"சூரிய உதயம்",sunset:"சூரிய அஸ்தமனம்",moonrise:"சந்திர உதயம்",moonset:"சந்திர அஸ்தமனம்",
    addToCal:"நாட்காட்டியில் சேர்",reminder:"நினைவூட்டல்",
    guidedRituals:"சடங்கு வழிகாட்டி",mantraLib:"மந்திர நூலகம்",
    beginRitual:"சடங்கு தொடங்கு",back:"← திரும்பு",complete:"✓ முடிந்தது",
    chant:"🔊 ஜபிக்கவும்",stop:"⏹ நிறுத்து",copy:"நகலெடு",expand:"விவரங்கள்",copied:"✓ நகலெடுக்கப்பட்டது",
    search:"பெயர் அல்லது தெய்வத்தால் தேடு...",
    trackerTitle:"ஆன்மிக கண்காணிப்பு",addPractice:"+ புதிய பயிற்சி சேர்",
    logHabit:"பதிவு",done:"✓ முடிந்தது",goal:"இலக்கு",totalDays:"மொத்த நாட்கள்",bestStreak:"சிறந்த தொடர்",loggedToday:"இன்று பதிவு",
    birthCalc:"பிறப்பு நட்சத்திர கணிப்பு",findNakshatra:"கண்டுபிடி ✨",appearance:"தோற்றம்",darkMode:"🌑 இரவு",lightMode:"☀️ பகல்",
    region:"பகுதி மற்றும் மொழி",notifications:"அறிவிப்புகள்",premium:"வேதாந்த பிரீமியம்",upgrade:"பிரீமியம் — ₹299/மாதம்",
    howTo:"கொண்டாடுவது எப்படி",
    namaste:"வணக்கம் 🙏",
  },
  Telugu:{
    today:"నేడు",calendar:"క్యాలెండర్",ai:"AI గైడ్",rituals:"ఆచారాలు",tracker:"ట్రాకర్",profile:"ప్రొఫైల్",
    auspicious:"శుభ దినం",panchang:"నేటి పంచాంగం",muhurats:"ముహూర్తాలు మరియు కాలం",
    sacredDates:"రాబోయే పవిత్ర తేదీలు",festivals:"రాబోయే పండుగలు",viewAll:"అన్నీ చూడు →",
    aiInsight:"AI దైనిక మార్గదర్శన",askAI:"AI సహాయకుడిని అడగండి →",
    tithi:"తిథి",nakshatra:"నక్షత్రం",yoga:"యోగం",karana:"కరణం",
    sunrise:"సూర్యోదయం",sunset:"సూర్యాస్తమయం",moonrise:"చంద్రోదయం",moonset:"చంద్రాస్తమయం",
    addToCal:"క్యాలెండర్‌కు జోడించు",reminder:"రిమైండర్",
    guidedRituals:"మార్గదర్శిత ఆచారాలు",mantraLib:"మంత్ర లైబ్రరీ",
    beginRitual:"ఆచారం ప్రారంభించు",back:"← వెనుకకు",complete:"✓ పూర్తైంది",
    chant:"🔊 జపించు",stop:"⏹ ఆపు",copy:"కాపీ",expand:"వివరాలు",copied:"✓ కాపీ అయింది",
    search:"పేరు లేదా దేవతను వెతకండి...",
    trackerTitle:"ఆధ్యాత్మిక ట్రాకర్",addPractice:"+ కొత్త సాధన జోడించు",
    logHabit:"నమోదు",done:"✓ పూర్తైంది",goal:"లక్ష్యం",totalDays:"మొత్తం రోజులు",bestStreak:"అత్యుత్తమ వరుస",loggedToday:"నేడు నమోదు",
    birthCalc:"జన్మ నక్షత్ర కాలిక్యులేటర్",findNakshatra:"కనుగొను ✨",appearance:"స్వరూపం",darkMode:"🌑 రాత్రి",lightMode:"☀️ పగలు",
    region:"ప్రాంతం మరియు భాష",notifications:"నోటిఫికేషన్లు",premium:"వేదాంత ప్రీమియం",upgrade:"ప్రీమియం — ₹299/నెల",
    howTo:"ఎలా జరుపుకోవాలి",
    namaste:"నమస్కారం 🙏",
  },
  Marathi:{
    today:"आज",calendar:"दिनदर्शिका",ai:"AI मार्गदर्शक",rituals:"विधी",tracker:"ट्रॅकर",profile:"प्रोफाइल",
    auspicious:"शुभ दिन",panchang:"आजचे पंचांग",muhurats:"मुहूर्त आणि काल",
    sacredDates:"येणाऱ्या पावन तिथी",festivals:"येणारे सण",viewAll:"सर्व पहा →",
    aiInsight:"AI दैनिक मार्गदर्शन",askAI:"AI सहाय्यकाला विचारा →",
    tithi:"तिथी",nakshatra:"नक्षत्र",yoga:"योग",karana:"करण",
    sunrise:"सूर्योदय",sunset:"सूर्यास्त",moonrise:"चंद्रोदय",moonset:"चंद्रास्त",
    addToCal:"दिनदर्शिकेत जोडा",reminder:"आठवण सेट करा",
    guidedRituals:"विधी मार्गदर्शन",mantraLib:"मंत्र संग्रह",
    beginRitual:"विधी सुरू करा",back:"← मागे",complete:"✓ पूर्ण",
    chant:"🔊 जप करा",stop:"⏹ थांबा",copy:"कॉपी",expand:"तपशील",copied:"✓ कॉपी झाले",
    search:"नाव किंवा देवता शोधा...",
    trackerTitle:"आध्यात्मिक ट्रॅकर",addPractice:"+ नवीन साधना जोडा",
    logHabit:"नोंद करा",done:"✓ झाले",goal:"ध्येय",totalDays:"एकूण दिवस",bestStreak:"सर्वोत्तम क्रम",loggedToday:"आज नोंद",
    birthCalc:"जन्म नक्षत्र कॅल्क्युलेटर",findNakshatra:"शोधा ✨",appearance:"स्वरूप",darkMode:"🌑 रात्र",lightMode:"☀️ दिवस",
    region:"प्रदेश आणि भाषा",notifications:"सूचना आणि समन्वय",premium:"वेदांत प्रीमियम",upgrade:"प्रीमियम — ₹299/महिना",
    howTo:"कसे साजरे करावे",
    namaste:"नमस्कार 🙏",
  },
};

/* ══════════════════════════════════════════════════════
   PANCHANG DATA
══════════════════════════════════════════════════════ */
const PANCHANG = {
  gregorian:"Wednesday, March 25, 2026", hindu:"Chaitra Shukla Ashtami",
  samvat:"Vikram Samvat 2082", masa:"Chaitra (Madhu)", paksha:"Shukla Paksha",
  tithi:{name:"Ashtami",number:8,ends:"1:18 AM, Mar 26",quality:"Auspicious",deity:"Durga"},
  nakshatra:{name:"Ardra",ends:"5:49 AM, Mar 26",quality:"Dynamic",deity:"Rudra",pada:"4th"},
  yoga:{name:"Saubhagya",ends:"4:39 PM",quality:"Auspicious"},
  karana:{morning:"Vishti (till 2:17 PM)",evening:"Bava"},
  sunrise:"7:29 AM", sunset:"7:46 PM", moonrise:"12:30 PM", moonset:"3:17 AM, Mar 26",
  abhijit:"None", amritKaal:"8:20-9:51 PM", brahmaMuhurat:"5:55-6:42 AM",
  rahuKaal:"1:37-3:09 PM", gulikaKaal:"12:05-1:37 PM", yamaganda:"9:01-10:33 AM",
  weekday:"Budhawara", weekdayColor:"#3DDC84", weekdayGem:"Emerald",
  moonPhase:"Waxing Gibbous", moonPct:48,
  rashi:"Mithuna (Gemini)", rashiLord:"Mercury",
  weekdayRuler:"Mercury (Budh)", luckyColor:"Green & Saffron", luckyNumber:"5",
};


const INDIA_PANCHANG = {
  ...PANCHANG,
  hindu:"Chaitra Shukla Ashtami",
  gregorian:"Wednesday, March 25, 2026",
  samvat:"Vikram Samvat 2082",
  masa:"Chaitra (Madhu)",
  paksha:"Shukla Paksha",
  tithi:{name:"Ashtami",number:8,ends:"11:48 AM, Mar 26",quality:"Auspicious",deity:"Durga"},
  nakshatra:{name:"Ardra",ends:"7:31 PM",quality:"Dynamic",deity:"Rudra",pada:"4th"},
  yoga:{name:"Saubhagya",ends:"8:23 PM",quality:"Auspicious"},
  karana:{morning:"Balava (till 11:48 AM)",evening:"Kaulava"},
  moonrise:"11:58 AM", moonset:"1:20 AM, Mar 26",
  abhijit:"11:13 AM-01:41 PM", amritKaal:"06:50-08:21 AM", brahmaMuhurat:"04:45-05:31 AM",
  rahuKaal:"12:22-01:55 PM", gulikaKaal:"10:49 AM-12:22 PM", yamaganda:"07:42-09:16 AM",
  rashi:"Mithuna (Gemini)", rashiLord:"Mercury",
  weekdayRuler:"Mercury (Budh)", luckyColor:"Green & Saffron", luckyNumber:"5",
  todayObservances:["Ashoka Ashtami Vrat","Masik Durgashtami","Chaitra Navratri Day 8"],
  nextFestival:"Rama Navami — Mar 26",
  locationMode:"india"
};


const INDIA_RAM_NAVAMI = {
  ...INDIA_PANCHANG,
  gregorian:"Thursday, March 26, 2026",
  hindu:"Chaitra Shukla Navami",
  weekday:"Guruvara",
  tithi:{name:"Navami",number:9,ends:"10:06 AM, Mar 27",quality:"Festival",deity:"Rama"},
  nakshatra:{name:"Punarvasu",ends:"11:47 PM",quality:"Sattvic",deity:"Aditi",pada:"4th"},
  yoga:{name:"Shobhana",ends:"12:32 AM, Mar 27",quality:"Auspicious"},
  karana:{morning:"Bava",evening:"Balava"},
  moonrise:"12:40 PM",
  moonset:"2:10 AM, Mar 27",
  abhijit:"11:13 AM-01:41 PM",
  amritKaal:"01:12-02:46 PM",
  brahmaMuhurat:"04:43-05:29 AM",
  rahuKaal:"01:55-03:28 PM",
  gulikaKaal:"09:16-10:49 AM",
  yamaganda:"06:09-07:42 AM",
  todayObservances:["Rama Navami","Chaitra Navratri Day 9"],
  nextFestival:"Hanuman Jayanti — Apr 1",
  locationMode:"india"
};

const PANCHANG_SOURCE_NOTES = [
  "Drik Panchang day and month panchang pages for Austin and Chicago were used as the primary verification reference for March 25, 2026.",
  "The attached monthly calendar images were used as a layout and coverage reference for denser month-wise observance marking.",
  "Location, sunrise, and timezone can shift the active tithi and festival mapping across cities."
];


const APP_NOW_UTC = "2026-03-26T01:30:00Z";

function getLocalDateKeyForLocation(locationKey){
  const meta = getLocationMeta(locationKey);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: meta.tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(APP_NOW_UTC));
  const year = parts.find(p=>p.type==="year")?.value || "2026";
  const month = parts.find(p=>p.type==="month")?.value || "03";
  const day = parts.find(p=>p.type==="day")?.value || "25";
  return `${year}-${month}-${day}`;
}

const LOCATION_OPTIONS = [
  {key:"austin", label:"Austin", tz:"America/Chicago", region:"US"},
  {key:"chicago", label:"Chicago", tz:"America/Chicago", region:"US"},
  {key:"newyork", label:"New York", tz:"America/New_York", region:"US"},
  {key:"houston", label:"Houston", tz:"America/Chicago", region:"US"},
  {key:"toronto", label:"Toronto", tz:"America/Toronto", region:"Canada"},
  {key:"london", label:"London", tz:"Europe/London", region:"UK"},
  {key:"dubai", label:"Dubai", tz:"Asia/Dubai", region:"UAE"},
  {key:"singapore", label:"Singapore", tz:"Asia/Singapore", region:"Singapore"},
  {key:"sydney", label:"Sydney", tz:"Australia/Sydney", region:"Australia"},
  {key:"kathmandu", label:"Kathmandu", tz:"Asia/Kathmandu", region:"Nepal"},
  {key:"delhi", label:"Delhi", tz:"Asia/Kolkata", region:"India"},
  {key:"agra", label:"Agra", tz:"Asia/Kolkata", region:"India"},
  {key:"jaipur", label:"Jaipur", tz:"Asia/Kolkata", region:"India"},
  {key:"ahmedabad", label:"Ahmedabad", tz:"Asia/Kolkata", region:"India"},
  {key:"varanasi", label:"Varanasi", tz:"Asia/Kolkata", region:"India"},
  {key:"mumbai", label:"Mumbai", tz:"Asia/Kolkata", region:"India"},
  {key:"chennai", label:"Chennai", tz:"Asia/Kolkata", region:"India"},
  {key:"hyderabad", label:"Hyderabad", tz:"Asia/Kolkata", region:"India"},
  {key:"bengaluru", label:"Bengaluru", tz:"Asia/Kolkata", region:"India"},
  {key:"kolkata", label:"Kolkata", tz:"Asia/Kolkata", region:"India"},
  {key:"pune", label:"Pune", tz:"Asia/Kolkata", region:"India"},
  {key:"prayagraj", label:"Prayagraj", tz:"Asia/Kolkata", region:"India"},
  {key:"tirupati", label:"Tirupati", tz:"Asia/Kolkata", region:"India"},
  {key:"ujjain", label:"Ujjain", tz:"Asia/Kolkata", region:"India"},
  {key:"haridwar", label:"Haridwar", tz:"Asia/Kolkata", region:"India"},
  {key:"rishikesh", label:"Rishikesh", tz:"Asia/Kolkata", region:"India"},
  {key:"ayodhya", label:"Ayodhya", tz:"Asia/Kolkata", region:"India"},
  {key:"mathura", label:"Mathura", tz:"Asia/Kolkata", region:"India"},
  {key:"nashik", label:"Nashik", tz:"Asia/Kolkata", region:"India"},
  {key:"dwarka", label:"Dwarka", tz:"Asia/Kolkata", region:"India"},
  {key:"amritsar", label:"Amritsar", tz:"Asia/Kolkata", region:"India"},
  {key:"vrindavan", label:"Vrindavan", tz:"Asia/Kolkata", region:"India"},
  {key:"mysuru", label:"Mysuru", tz:"Asia/Kolkata", region:"India"},
];


const CITY_GUIDES = {
  austin:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/TexasStateCapitol-2010.jpg/800px-TexasStateCapitol-2010.jpg",
    landmark:"Texas State Capitol",
    summary:"Austin combines a strong Hindu community with temple access, satsang events, and vibrant family festival culture.",
    places:[
      {name:"Austin Hindu Temple", note:"Community hub for darshan, puja, and major festival celebrations.", map:"https://www.google.com/maps/search/?api=1&query=Austin+Hindu+Temple"},
      {name:"Barsana Dham", note:"Serene grounds for satsang, spiritual retreat, and Radha-Krishna devotion.", map:"https://www.google.com/maps/search/?api=1&query=Barsana+Dham+Austin"},
      {name:"Radha Madhav Dham", note:"Popular for kirtan, Navratri programs, and devotional gatherings.", map:"https://www.google.com/maps/search/?api=1&query=Radha+Madhav+Dham+Austin"}
    ]
  },
  chicago:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Chicago_from_North_Avenue_Beach_June_2015_panorama_2.jpg/800px-Chicago_from_North_Avenue_Beach_June_2015_panorama_2.jpg",
    landmark:"Chicago Lakefront Skyline",
    summary:"Chicago offers major Hindu mandirs and a large Indian diaspora community for festival visits and family rituals.",
    places:[
      {name:"BAPS Shri Swaminarayan Mandir Chicago", note:"Large traditional mandir complex with well-organized festival programs.", map:"https://www.google.com/maps/search/?api=1&query=BAPS+Shri+Swaminarayan+Mandir+Chicago"},
      {name:"Hindu Temple of Greater Chicago (Lemont)", note:"Multi-deity temple serving the wider Chicago region for darshan and observances.", map:"https://www.google.com/maps/search/?api=1&query=Hindu+Temple+of+Greater+Chicago+Lemont"},
      {name:"ISKCON Chicago", note:"Popular for kirtan, prasadam, and Vaishnava festival planning.", map:"https://www.google.com/maps/search/?api=1&query=ISKCON+Chicago"}
    ]
  },
  newyork:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/800px-New_york_times_square-terabass.jpg",
    landmark:"Times Square, Manhattan",
    summary:"New York offers dozens of mandirs and cultural centers across the five boroughs and the tri-state area.",
    places:[
      {name:"Ganesh Temple (Flushing, Queens)", note:"Traditional South Indian temple — one of the oldest Hindu temples in the U.S.", map:"https://www.google.com/maps/search/?api=1&query=Ganesh+Temple+Flushing+Queens"},
      {name:"BAPS Shri Swaminarayan Mandir Robbinsville NJ", note:"Magnificent traditional mandir near NYC — worth a special trip for major festivals.", map:"https://www.google.com/maps/search/?api=1&query=BAPS+Shri+Swaminarayan+Mandir+Robbinsville"},
      {name:"ISKCON New York", note:"Useful for kirtan, Bhagavad Gita gatherings, and Vaishnava observances.", map:"https://www.google.com/maps/search/?api=1&query=ISKCON+New+York"}
    ]
  },
  houston:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Houston_night_skyline.jpg/800px-Houston_night_skyline.jpg",
    landmark:"Houston Skyline by Night",
    summary:"Houston is home to some of the largest and most architecturally significant Hindu temples in North America.",
    places:[
      {name:"Sri Meenakshi Temple (Pearland)", note:"One of the largest traditional South Indian temples in the U.S., modeled on Madurai Meenakshi.", map:"https://www.google.com/maps/search/?api=1&query=Sri+Meenakshi+Temple+Pearland+Houston"},
      {name:"BAPS Shri Swaminarayan Mandir Houston", note:"Stunning traditional mandir, excellent for major festival darshan.", map:"https://www.google.com/maps/search/?api=1&query=BAPS+Shri+Swaminarayan+Mandir+Houston"},
      {name:"Ashtalakshmi Temple", note:"Good for Lakshmi, Navratri, and family temple visits.", map:"https://www.google.com/maps/search/?api=1&query=Ashtalakshmi+Temple+Houston"}
    ]
  },
  toronto:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/CN_Tower_3.jpg/800px-CN_Tower_3.jpg",
    landmark:"CN Tower, Toronto",
    summary:"Toronto has one of the largest South Asian communities in North America with excellent temple access.",
    places:[
      {name:"BAPS Shri Swaminarayan Mandir Toronto", note:"Beautiful traditional mandir — active program calendar for all major festivals.", map:"https://www.google.com/maps/search/?api=1&query=BAPS+Shri+Swaminarayan+Mandir+Toronto"},
      {name:"Vishnu Mandir Richmond Hill", note:"Large multi-deity temple serving the GTA Hindu community.", map:"https://www.google.com/maps/search/?api=1&query=Vishnu+Mandir+Richmond+Hill+Toronto"},
      {name:"Hindu Sabha Mandir Brampton", note:"Active community temple for puja, classes, and Navratri events.", map:"https://www.google.com/maps/search/?api=1&query=Hindu+Sabha+Mandir+Brampton"}
    ]
  },
  london:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/London_skyline_%28cut%29.jpg/800px-London_skyline_%28cut%29.jpg",
    landmark:"Palace of Westminster & Big Ben",
    summary:"London hosts one of the world's most vibrant diaspora Hindu communities with major temples across the city.",
    places:[
      {name:"BAPS Shri Swaminarayan Mandir Neasden", note:"Europe's largest traditional Hindu temple — a must-visit landmark.", map:"https://www.google.com/maps/search/?api=1&query=BAPS+Shri+Swaminarayan+Mandir+Neasden+London"},
      {name:"ISKCON Bhaktivedanta Manor", note:"Excellent for Janmashtami-scale planning and family visits.", map:"https://www.google.com/maps/search/?api=1&query=Bhaktivedanta+Manor+UK"},
      {name:"Ganesha Temple Wembley", note:"Active Ganesha temple in the heart of London's Indian community.", map:"https://www.google.com/maps/search/?api=1&query=Ganesha+Temple+Wembley+London"}
    ]
  },
  dubai:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Burj_Khalifa.jpg/800px-Burj_Khalifa.jpg",
    landmark:"Burj Khalifa, Dubai",
    summary:"Dubai's large Indian expatriate community supports active temples and regular festival celebrations.",
    places:[
      {name:"Shri Krishna Haveli Dubai", note:"Popular temple serving the Hindu community in Bur Dubai.", map:"https://www.google.com/maps/search/?api=1&query=Shri+Krishna+Haveli+Dubai"},
      {name:"Sindhi Shri Gurudarbar Dubai", note:"Well-known devotional center for prayers and festival programs.", map:"https://www.google.com/maps/search/?api=1&query=Sindhi+Shri+Gurudarbar+Dubai"},
      {name:"BAPS Hindu Mandir Abu Dhabi", note:"Spectacular new temple — a special day trip from Dubai.", map:"https://www.google.com/maps/search/?api=1&query=BAPS+Hindu+Mandir+Abu+Dhabi"}
    ]
  },
  singapore:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/MBS_at_night_2019.jpg/800px-MBS_at_night_2019.jpg",
    landmark:"Marina Bay Sands, Singapore",
    summary:"Singapore has a deep Hindu heritage with centuries-old temples and vibrant Tamil festival traditions.",
    places:[
      {name:"Sri Veeramakaliamman Temple Little India", note:"One of Singapore's most historic and visually striking Devi temples.", map:"https://www.google.com/maps/search/?api=1&query=Sri+Veeramakaliamman+Temple+Singapore"},
      {name:"Sri Srinivasa Perumal Temple", note:"Ancient Vaishnavite temple and major Thaipusam procession starting point.", map:"https://www.google.com/maps/search/?api=1&query=Sri+Srinivasa+Perumal+Temple+Singapore"},
      {name:"BAPS Shri Swaminarayan Mandir Singapore", note:"Traditional mandir serving the Gujarati and pan-Hindu community.", map:"https://www.google.com/maps/search/?api=1&query=BAPS+Shri+Swaminarayan+Mandir+Singapore"}
    ]
  },
  sydney:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Sydney_Australia._%2821339657489%29.jpg/800px-Sydney_Australia._%2821339657489%29.jpg",
    landmark:"Sydney Opera House & Harbour Bridge",
    summary:"Sydney's growing Indian Hindu community is served by several active temples with well-organized festival programs.",
    places:[
      {name:"Shri Venkateswara Temple Helensburgh", note:"A major temple destination worth a planned visit.", map:"https://www.google.com/maps/search/?api=1&query=Sri+Venkateswara+Temple+Helensburgh"},
      {name:"BAPS Shri Swaminarayan Mandir Sydney", note:"Traditional mandir known for major cultural and festival events.", map:"https://www.google.com/maps/search/?api=1&query=BAPS+Shri+Swaminarayan+Mandir+Sydney"},
      {name:"Sydney Murugan Temple", note:"Well-established South Indian temple with strong devotional community.", map:"https://www.google.com/maps/search/?api=1&query=Murugan+Temple+Sydney"}
    ]
  },
  kathmandu:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Swayambhunath1.jpg/800px-Swayambhunath1.jpg",
    landmark:"Swayambhunath Stupa, Kathmandu",
    summary:"Kathmandu is one of the most sacred Hindu-Buddhist cities in the world, home to ancient temples and living traditions.",
    places:[
      {name:"Pashupatinath Temple", note:"One of the most sacred Shiva temples in the world — UNESCO World Heritage Site.", map:"https://www.google.com/maps/search/?api=1&query=Pashupatinath+Temple+Kathmandu"},
      {name:"Swayambhunath (Monkey Temple)", note:"Ancient sacred hilltop combining Hindu and Buddhist traditions with panoramic views.", map:"https://www.google.com/maps/search/?api=1&query=Swayambhunath+Kathmandu"},
      {name:"Changu Narayan Temple", note:"Nepal's oldest Vishnu temple dating back to 4th century CE.", map:"https://www.google.com/maps/search/?api=1&query=Changu+Narayan+Temple+Kathmandu"}
    ]
  },
  delhi:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/India_Gate_in_New_Delhi_03-2016.jpg/800px-India_Gate_in_New_Delhi_03-2016.jpg",
    landmark:"India Gate, New Delhi",
    summary:"Delhi is India's capital with a rich mix of ancient temples, Mughal heritage, and vibrant Hindu festival culture.",
    places:[
      {name:"Akshardham Temple", note:"Massive BAPS temple complex — a remarkable blend of traditional craftsmanship and spiritual exhibits.", map:"https://www.google.com/maps/search/?api=1&query=Akshardham+Temple+Delhi"},
      {name:"Birla Mandir (Laxminarayan Temple)", note:"Elegant early 20th-century temple dedicated to Vishnu and Lakshmi.", map:"https://www.google.com/maps/search/?api=1&query=Birla+Mandir+Delhi"},
      {name:"ISKCON Temple Delhi", note:"Major Krishna consciousness center with daily programs and prasad distribution.", map:"https://www.google.com/maps/search/?api=1&query=ISKCON+Temple+Delhi"},
      {name:"Lotus Temple (Bahá'í)", note:"Iconic architectural landmark for meditation and inter-faith prayer.", map:"https://www.google.com/maps/search/?api=1&query=Lotus+Temple+Delhi"}
    ]
  },
  agra:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Taj-Mahal.jpg/800px-Taj-Mahal.jpg",
    landmark:"Taj Mahal, Agra",
    summary:"Agra is home to the Taj Mahal, Agra Fort, and several Hindu temples within reach of the sacred Braj region.",
    places:[
      {name:"Mankameshwar Temple", note:"Ancient Shiva temple in the heart of old Agra — historically significant.", map:"https://www.google.com/maps/search/?api=1&query=Mankameshwar+Temple+Agra"},
      {name:"Kailash Temple Agra", note:"Active temple complex popular with devotees on Mondays and Shivaratri.", map:"https://www.google.com/maps/search/?api=1&query=Kailash+Temple+Agra"},
      {name:"Mathura (50 km)", note:"Lord Krishna's birthplace — Krishna Janma Bhoomi and dozens of temples within day-trip distance.", map:"https://www.google.com/maps/search/?api=1&query=Mathura+Krishna+Janma+Bhoomi"}
    ]
  },
  jaipur:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Facade_of_Hawa_Mahal.jpg/800px-Facade_of_Hawa_Mahal.jpg",
    landmark:"Hawa Mahal, Jaipur",
    summary:"Jaipur, the Pink City, blends Rajput heritage with rich Hindu temple culture and vibrant festival traditions.",
    places:[
      {name:"Govind Dev Ji Temple", note:"One of Jaipur's most venerated temples — dedicated to Lord Krishna.", map:"https://www.google.com/maps/search/?api=1&query=Govind+Dev+Ji+Temple+Jaipur"},
      {name:"Birla Mandir Jaipur", note:"Modern Lakshmi-Narayan temple with panoramic views of the city.", map:"https://www.google.com/maps/search/?api=1&query=Birla+Mandir+Jaipur"},
      {name:"Galtaji (Monkey Temple)", note:"Ancient stepped-well temple complex with natural springs and sacred bathing tanks.", map:"https://www.google.com/maps/search/?api=1&query=Galtaji+Temple+Jaipur"}
    ]
  },
  ahmedabad:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Adalaj_stepwell-_Ahmedabad_India.jpg/800px-Adalaj_stepwell-_Ahmedabad_India.jpg",
    landmark:"Adalaj Stepwell, Ahmedabad",
    summary:"Ahmedabad is Gujarat's heritage capital — home to ancient temples, the Sabarmati Ashram, and BAPS headquarters.",
    places:[
      {name:"Akshardham Temple (Gandhinagar)", note:"Massive BAPS mandir headquarters — extraordinary traditional stonework and exhibits.", map:"https://www.google.com/maps/search/?api=1&query=Akshardham+Temple+Gandhinagar"},
      {name:"Sabarmati Ashram", note:"Gandhi's historic ashram — a pilgrimage site for Indian independence history.", map:"https://www.google.com/maps/search/?api=1&query=Sabarmati+Ashram+Ahmedabad"},
      {name:"Swaminarayan Temple Kalupur", note:"Original BAPS temple — historically significant with traditional architecture.", map:"https://www.google.com/maps/search/?api=1&query=Swaminarayan+Temple+Kalupur+Ahmedabad"}
    ]
  },
  varanasi:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Varanasi_at_dusk_%281%29.jpg/800px-Varanasi_at_dusk_%281%29.jpg",
    landmark:"Ghats on the Ganges at Dusk",
    summary:"Varanasi is one of the world's oldest living cities and Hinduism's most sacred pilgrimage destination.",
    places:[
      {name:"Kashi Vishwanath Corridor", note:"Most important Shiva temple in the world — heart of Varanasi pilgrimage.", map:"https://www.google.com/maps/search/?api=1&query=Kashi+Vishwanath+Varanasi"},
      {name:"Dashashwamedh Ghat", note:"Famous evening Ganga Aarti — one of India's most spectacular spiritual ceremonies.", map:"https://www.google.com/maps/search/?api=1&query=Dashashwamedh+Ghat+Varanasi"},
      {name:"Sarnath (10 km)", note:"Where Lord Buddha gave his first sermon — Buddhist stupa and museum.", map:"https://www.google.com/maps/search/?api=1&query=Sarnath+Varanasi"},
      {name:"Manikarnika Ghat", note:"Sacred cremation ghat where continuous funeral rites have occurred for centuries.", map:"https://www.google.com/maps/search/?api=1&query=Manikarnika+Ghat+Varanasi"}
    ]
  },
  mumbai:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gateway_of_India_-_2021.jpg/800px-Gateway_of_India_-_2021.jpg",
    landmark:"Gateway of India, Mumbai",
    summary:"Mumbai mixes iconic Ganesh, Devi, and Shiva temples with the world's most vibrant public Ganesh Chaturthi festival.",
    places:[
      {name:"Siddhivinayak Temple", note:"Most visited Ganesha temple in India — darshan queues for major festivals.", map:"https://www.google.com/maps/search/?api=1&query=Siddhivinayak+Temple+Mumbai"},
      {name:"Mahalaxmi Temple", note:"Sacred Devi temple overlooking the sea — especially packed during Navratri.", map:"https://www.google.com/maps/search/?api=1&query=Mahalaxmi+Temple+Mumbai"},
      {name:"ISKCON Temple Juhu", note:"Major Krishna consciousness center with daily aarti and prasad.", map:"https://www.google.com/maps/search/?api=1&query=ISKCON+Temple+Juhu+Mumbai"},
      {name:"Banganga Tank", note:"Ancient sacred water tank in Malabar Hill — historically significant pilgrimage spot.", map:"https://www.google.com/maps/search/?api=1&query=Banganga+Tank+Mumbai"}
    ]
  },
  chennai:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Marina_Beach%2C_Chennai.jpg/800px-Marina_Beach%2C_Chennai.jpg",
    landmark:"Marina Beach, Chennai",
    summary:"Chennai is the cultural heart of South India with centuries-old Dravidian temples and strong Carnatic music traditions.",
    places:[
      {name:"Kapaleeshwarar Temple", note:"Ancient Dravidian Shiva temple — distinctive gopuram and sacred tank.", map:"https://www.google.com/maps/search/?api=1&query=Kapaleeshwarar+Temple+Chennai"},
      {name:"Parthasarathy Temple (Triplicane)", note:"One of the 108 Divya Desam — oldest Vaishnavite temple in Chennai.", map:"https://www.google.com/maps/search/?api=1&query=Parthasarathy+Temple+Chennai"},
      {name:"ISKCON Chennai (Vedapuri)", note:"Major Vaishnava center with elaborate festival celebrations.", map:"https://www.google.com/maps/search/?api=1&query=ISKCON+Temple+Chennai"}
    ]
  },
  hyderabad:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Charminar_at_night.jpg/800px-Charminar_at_night.jpg",
    landmark:"Charminar, Hyderabad",
    summary:"Hyderabad blends Nizami heritage with important Hindu temples including the famous Birla Mandir and Chilkur Balaji.",
    places:[
      {name:"Birla Mandir Hyderabad", note:"Elegant white marble temple overlooking Hussain Sagar lake.", map:"https://www.google.com/maps/search/?api=1&query=Birla+Mandir+Hyderabad"},
      {name:"Chilkur Balaji Temple", note:"Known as the 'Visa God' temple — one of the region's most popular shrines.", map:"https://www.google.com/maps/search/?api=1&query=Chilkur+Balaji+Temple+Hyderabad"},
      {name:"ISKCON Temple Hyderabad", note:"Active Krishna center with regular satsang and festival programs.", map:"https://www.google.com/maps/search/?api=1&query=ISKCON+Temple+Hyderabad"}
    ]
  },
  bengaluru:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Vidhana_Soudha_Bangalore_2009.jpg/800px-Vidhana_Soudha_Bangalore_2009.jpg",
    landmark:"Vidhana Soudha, Bengaluru",
    summary:"Bengaluru is a modern city with deep temple traditions, strong ISKCON presence, and the heritage of old Mysore culture.",
    places:[
      {name:"ISKCON Temple Rajajinagar", note:"One of the largest ISKCON temples in the world — stunning complex.", map:"https://www.google.com/maps/search/?api=1&query=ISKCON+Temple+Bengaluru"},
      {name:"Dodda Ganesha Temple Basavanagudi", note:"Ancient massive Ganesha idol — Bengaluru's most historic Ganesha shrine.", map:"https://www.google.com/maps/search/?api=1&query=Dodda+Ganesha+Temple+Basavanagudi+Bengaluru"},
      {name:"Chamundeshwari Temple Mysuru (140 km)", note:"Hilltop Devi temple — one of the 18 Mahashakti Peethas.", map:"https://www.google.com/maps/search/?api=1&query=Chamundeshwari+Temple+Mysore"}
    ]
  },
  kolkata:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Victoria_Memorial_Kolkata_2019.jpg/800px-Victoria_Memorial_Kolkata_2019.jpg",
    landmark:"Victoria Memorial, Kolkata",
    summary:"Kolkata is the cultural capital of India — home to Kalighat, Dakshineswar, and the world's biggest Durga Puja.",
    places:[
      {name:"Kalighat Kali Temple", note:"One of the 51 Shakti Peethas — among the most sacred Kali temples in India.", map:"https://www.google.com/maps/search/?api=1&query=Kalighat+Kali+Temple+Kolkata"},
      {name:"Dakshineswar Kali Temple", note:"Where Sri Ramakrishna attained divine realization — Ganga-side temple complex.", map:"https://www.google.com/maps/search/?api=1&query=Dakshineswar+Kali+Temple+Kolkata"},
      {name:"Belur Math (Ramakrishna Mission HQ)", note:"Headquarters of Ramakrishna Mission — sacred monument and active spiritual center.", map:"https://www.google.com/maps/search/?api=1&query=Belur+Math+Kolkata"}
    ]
  },
  pune:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Shaniwarwada.jpg/800px-Shaniwarwada.jpg",
    landmark:"Shaniwar Wada Fort, Pune",
    summary:"Pune blends Peshwa heritage with major temples including the sacred Dagdusheth Halwai Ganesh and Alandi Dnyaneshwar.",
    places:[
      {name:"Dagdusheth Halwai Ganpati Temple", note:"Pune's most famous and revered Ganesha temple — massively popular during Ganesh Chaturthi.", map:"https://www.google.com/maps/search/?api=1&query=Dagdusheth+Halwai+Ganpati+Temple+Pune"},
      {name:"Alandi (30 km) — Sant Dnyaneshwar Samadhi", note:"Sacred pilgrimage town — samadhi of the great Maharashtrian saint.", map:"https://www.google.com/maps/search/?api=1&query=Alandi+Dnyaneshwar+Pune"},
      {name:"ISKCON Temple Pune", note:"Active Krishna center with regular bhajans, festivals, and prasad distribution.", map:"https://www.google.com/maps/search/?api=1&query=ISKCON+Temple+Pune"}
    ]
  },
  prayagraj:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Triveni_Sangam%2C_Prayagraj.jpg/800px-Triveni_Sangam%2C_Prayagraj.jpg",
    landmark:"Triveni Sangam, Prayagraj (Kumbh Mela)",
    summary:"Prayagraj is the sacred city at the confluence of Ganga, Yamuna, and Saraswati — home of the world's largest religious gathering.",
    places:[
      {name:"Triveni Sangam", note:"Holiest bathing ghat at the confluence of three sacred rivers.", map:"https://www.google.com/maps/search/?api=1&query=Triveni+Sangam+Prayagraj"},
      {name:"Allahabad Fort & Patalpuri Temple", note:"Ancient subterranean temple with an Akshay Vat (eternal banyan tree) inside the fort.", map:"https://www.google.com/maps/search/?api=1&query=Patalpuri+Temple+Prayagraj"},
      {name:"Mankameshwar Temple", note:"Ancient Shiva temple in the city known for fulfilling devotees' wishes.", map:"https://www.google.com/maps/search/?api=1&query=Mankameshwar+Temple+Prayagraj"}
    ]
  },
  tirupati:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Tirumala_hills_from_alipiri.jpg/800px-Tirumala_hills_from_alipiri.jpg",
    landmark:"Tirumala Hills, Tirupati",
    summary:"Tirupati is home to the Tirumala Venkateswara Temple — the most visited and wealthiest religious site in the world.",
    places:[
      {name:"Tirumala Venkateswara Temple", note:"Most visited pilgrimage site on Earth — Lord Balaji's sacred abode atop Tirumala.", map:"https://www.google.com/maps/search/?api=1&query=Tirumala+Venkateswara+Temple+Tirupati"},
      {name:"Govinda Raja Swamy Temple", note:"One of the major Pancha Ranga Kshetras of Lord Vishnu in the plains.", map:"https://www.google.com/maps/search/?api=1&query=Govindaraja+Swamy+Temple+Tirupati"},
      {name:"ISKCON Temple Tirupati", note:"Major Vaishnava center serving pilgrims visiting the Tirupati region.", map:"https://www.google.com/maps/search/?api=1&query=ISKCON+Temple+Tirupati"}
    ]
  },
  haridwar:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Har_ki_Pauri_Haridwar.jpg/800px-Har_ki_Pauri_Haridwar.jpg",
    landmark:"Har Ki Pauri, Haridwar",
    summary:"Haridwar is one of Hinduism's great pilgrimage gateways, especially valued for Ganga Aarti, ghats, and temple access.",
    places:[
      {name:"Har Ki Pauri", note:"Core ghat experience for Ganga Aarti and pilgrimage planning.", map:"https://www.google.com/maps/search/?api=1&query=Har+Ki+Pauri+Haridwar"},
      {name:"Mansa Devi Temple", note:"Popular hill shrine with broad family pilgrimage appeal.", map:"https://www.google.com/maps/search/?api=1&query=Mansa+Devi+Temple+Haridwar"},
      {name:"Chandi Devi Temple", note:"Important Devi temple often paired with Har Ki Pauri visits.", map:"https://www.google.com/maps/search/?api=1&query=Chandi+Devi+Temple+Haridwar"}
    ]
  },
  rishikesh:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Laxman_Jhula_Rishikesh.jpg/800px-Laxman_Jhula_Rishikesh.jpg",
    landmark:"Laxman Jhula Bridge, Rishikesh",
    summary:"Rishikesh combines Ganga-side spirituality, ashram culture, and practical access to temples and evening aarti.",
    places:[
      {name:"Triveni Ghat", note:"Main aarti and riverfront spiritual stop in the city.", map:"https://www.google.com/maps/search/?api=1&query=Triveni+Ghat+Rishikesh"},
      {name:"Neelkanth Mahadev Temple", note:"Important Shiva pilgrimage destination near Rishikesh.", map:"https://www.google.com/maps/search/?api=1&query=Neelkanth+Mahadev+Temple+Rishikesh"},
      {name:"Parmarth Niketan", note:"Known for Ganga aarti, yoga, and spiritual retreats.", map:"https://www.google.com/maps/search/?api=1&query=Parmarth+Niketan+Rishikesh"}
    ]
  },
  ayodhya:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Ram_Mandir_Ayodhya.jpg/800px-Ram_Mandir_Ayodhya.jpg",
    landmark:"Ram Mandir, Ayodhya",
    summary:"Ayodhya is central to Rama devotion and now one of India's most important pilgrimage cities for temple-focused travel.",
    places:[
      {name:"Shri Ram Janmabhoomi Mandir", note:"The core pilgrimage destination for Rama devotees.", map:"https://www.google.com/maps/search/?api=1&query=Ram+Mandir+Ayodhya"},
      {name:"Hanuman Garhi", note:"A major temple stop often included in Ayodhya visits.", map:"https://www.google.com/maps/search/?api=1&query=Hanuman+Garhi+Ayodhya"},
      {name:"Kanak Bhawan", note:"Popular family-friendly darshan stop in the Ayodhya circuit.", map:"https://www.google.com/maps/search/?api=1&query=Kanak+Bhawan+Ayodhya"}
    ]
  },
  mathura:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Krishna_Janmabhoomi_Mathura.jpg/800px-Krishna_Janmabhoomi_Mathura.jpg",
    landmark:"Krishna Janma Bhoomi, Mathura",
    summary:"Mathura is Lord Krishna's birthplace and one of Hinduism's seven sacred cities (Sapta Puri).",
    places:[
      {name:"Krishna Janma Bhoomi Temple", note:"Most sacred site in Mathura — marks the exact birthplace of Lord Krishna.", map:"https://www.google.com/maps/search/?api=1&query=Shri+Krishna+Janmabhoomi+Mathura"},
      {name:"Dwarkadhish Temple", note:"Grand early 19th-century temple with spectacular architecture and festivals.", map:"https://www.google.com/maps/search/?api=1&query=Dwarkadhish+Temple+Mathura"},
      {name:"Vishram Ghat", note:"Main bathing ghat where Krishna is said to have rested after defeating Kansa.", map:"https://www.google.com/maps/search/?api=1&query=Vishram+Ghat+Mathura"}
    ]
  },
  nashik:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Trimbakeshwar_Temple%2C_Nashik%2C_India.jpg/800px-Trimbakeshwar_Temple%2C_Nashik%2C_India.jpg",
    landmark:"Trimbakeshwar Temple, Nashik",
    summary:"Nashik combines Kumbh Mela heritage with river ghats, Shiva tradition, and the nearby Trimbakeshwar jyotirlinga.",
    places:[
      {name:"Trimbakeshwar Jyotirlinga", note:"One of the 12 Jyotirlingas — a major Shiva pilgrimage stop near Nashik.", map:"https://www.google.com/maps/search/?api=1&query=Trimbakeshwar+Jyotirlinga"},
      {name:"Kalaram Temple", note:"Historic Rama temple in the Panchavati area.", map:"https://www.google.com/maps/search/?api=1&query=Kalaram+Temple+Nashik"},
      {name:"Ramkund", note:"Key sacred riverfront bathing ghat in the city pilgrimage circuit.", map:"https://www.google.com/maps/search/?api=1&query=Ramkund+Nashik"}
    ]
  },
  dwarka:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Dwarkadhish_temple.jpg/800px-Dwarkadhish_temple.jpg",
    landmark:"Dwarkadhish Temple, Dwarka",
    summary:"Dwarka is one of the Char Dham destinations and a major Krishna pilgrimage city on the Gujarat coast.",
    places:[
      {name:"Dwarkadhish Temple", note:"The central Krishna pilgrimage destination in Dwarka.", map:"https://www.google.com/maps/search/?api=1&query=Dwarkadhish+Temple+Dwarka"},
      {name:"Rukmini Devi Temple", note:"Commonly paired with the main Dwarka temple visit.", map:"https://www.google.com/maps/search/?api=1&query=Rukmini+Devi+Temple+Dwarka"},
      {name:"Nageshwar Jyotirlinga", note:"Major Shiva jyotirlinga on the Dwarka pilgrimage route.", map:"https://www.google.com/maps/search/?api=1&query=Nageshwar+Jyotirlinga"}
    ]
  },
  amritsar:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Golden_Temple%2C_Amritsar%2C_Punjab%2C_India.jpg/800px-Golden_Temple%2C_Amritsar%2C_Punjab%2C_India.jpg",
    landmark:"Harmandir Sahib (Golden Temple)",
    summary:"Amritsar is the spiritual capital of the Sikhs and home to the Golden Temple, with several Hindu temples in the surrounding region.",
    places:[
      {name:"Harmandir Sahib (Golden Temple)", note:"Most sacred Sikh shrine — open to all faiths, free langar served 24/7.", map:"https://www.google.com/maps/search/?api=1&query=Golden+Temple+Amritsar"},
      {name:"Durgiana Mandir", note:"Hindu temple modeled on the Golden Temple style — dedicated to Goddess Durga.", map:"https://www.google.com/maps/search/?api=1&query=Durgiana+Mandir+Amritsar"},
      {name:"Ram Tirath Temple (15 km)", note:"Sacred site where Sita Mata spent time during Valmiki's ashram period.", map:"https://www.google.com/maps/search/?api=1&query=Ram+Tirath+Temple+Amritsar"}
    ]
  },
  vrindavan:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Prem_Mandir_Vrindavan.jpg/800px-Prem_Mandir_Vrindavan.jpg",
    landmark:"Prem Mandir, Vrindavan",
    summary:"Vrindavan is where Krishna performed the Raas Leela — one of the most sacred places in Vaishnava tradition.",
    places:[
      {name:"Banke Bihari Temple", note:"Most beloved temple in Vrindavan — famous for the playful deity and unique darshan style.", map:"https://www.google.com/maps/search/?api=1&query=Banke+Bihari+Temple+Vrindavan"},
      {name:"ISKCON Krishna Balaram Mandir", note:"Magnificent international temple built under Srila Prabhupada's guidance.", map:"https://www.google.com/maps/search/?api=1&query=ISKCON+Krishna+Balaram+Mandir+Vrindavan"},
      {name:"Prem Mandir", note:"Stunning white marble temple with intricate carvings and night illumination.", map:"https://www.google.com/maps/search/?api=1&query=Prem+Mandir+Vrindavan"},
      {name:"Radha Raman Temple", note:"One of the oldest and most revered temples in Vrindavan.", map:"https://www.google.com/maps/search/?api=1&query=Radha+Raman+Temple+Vrindavan"}
    ]
  },
  ujjain:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Mahakaleshwar_jyotirlinga.jpg/800px-Mahakaleshwar_jyotirlinga.jpg",
    landmark:"Mahakaleshwar Jyotirlinga, Ujjain",
    summary:"Ujjain is one of Hinduism's seven sacred cities and home to the Mahakaleshwar Jyotirlinga — one of 12 sacred Shiva shrines.",
    places:[
      {name:"Mahakaleshwar Jyotirlinga", note:"One of the 12 Jyotirlingas — the Bhasma Aarti here is one of India's most unique rituals.", map:"https://www.google.com/maps/search/?api=1&query=Mahakaleshwar+Temple+Ujjain"},
      {name:"Kal Bhairav Temple", note:"Ancient temple of Kala Bhairava — the city's guardian deity.", map:"https://www.google.com/maps/search/?api=1&query=Kal+Bhairav+Temple+Ujjain"},
      {name:"Ram Ghat", note:"Sacred bathing ghat on the Shipra river — central venue for Simhastha Kumbh.", map:"https://www.google.com/maps/search/?api=1&query=Ram+Ghat+Ujjain"}
    ]
  },
  mysuru:{
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mysore_Palace_Morning.jpg/800px-Mysore_Palace_Morning.jpg",
    landmark:"Mysore Palace (Amba Vilas)",
    summary:"Mysuru is the cultural capital of Karnataka, famous for its Dasara festival and the sacred Chamundeshwari temple.",
    places:[
      {name:"Chamundeshwari Temple (Chamundi Hills)", note:"Sacred Shakti Peetha on Chamundi Hills — the presiding deity of Mysuru kings.", map:"https://www.google.com/maps/search/?api=1&query=Chamundeshwari+Temple+Mysore"},
      {name:"Mysore Palace — Dasara Durbar", note:"India's most spectacular Dasara celebration — Goddess Chamundeshwari procession.", map:"https://www.google.com/maps/search/?api=1&query=Mysore+Palace"},
      {name:"Sri Chamarajendra Wadiyar Temple", note:"Palace-adjacent temple with historic ties to the Mysore royal family.", map:"https://www.google.com/maps/search/?api=1&query=Mysore+Palace+Temple+complex"}
    ]
  }
};


const LOCATION_PANCHANG = {
  "2026-03-25": {
    austin: {
      ...PANCHANG,
      todayObservances:["Ashoka Ashtami","Masik Durgashtami","Chaitra Navratri Day 5"],
      nextFestival:"Rama Navami — Mar 26",
      verificationNote:"Re-checked against Drik Panchang for Austin, Texas on March 25, 2026."
    },
    chicago: {
      ...PANCHANG,
      sunrise:"6:45 AM", sunset:"7:09 PM", moonrise:"11:41 AM", moonset:"2:30 AM, Mar 26",
      nakshatra:{name:"Mrigashira",ends:"7:03 AM",quality:"Gentle",deity:"Soma",pada:"4th"},
      rahuKaal:"12:58-2:31 PM", gulikaKaal:"11:25 AM-12:58 PM", yamaganda:"8:19-9:52 AM",
      todayObservances:["Ashoka Ashtami","Masik Durgashtami","Chaitra Navratri Day 5"],
      nextFestival:"Rama Navami — Mar 26",
      verificationNote:"Re-checked against Drik Panchang for Chicago, Illinois on March 25, 2026."
    },
    houston: {
      ...PANCHANG,
      sunrise:"7:19 AM", sunset:"7:36 PM", moonrise:"12:21 PM", moonset:"3:06 AM, Mar 26",
      todayObservances:["Ashoka Ashtami","Masik Durgashtami","Chaitra Navratri Day 5"],
      nextFestival:"Rama Navami — Mar 26",
      verificationNote:"Re-checked against Drik Panchang for Houston, Texas on March 25, 2026."
    },
    newyork: {
      ...PANCHANG,
      sunrise:"6:52 AM", sunset:"7:17 PM", moonrise:"11:55 AM", moonset:"2:46 AM, Mar 26",
      todayObservances:["Ashoka Ashtami","Masik Durgashtami","Chaitra Navratri Day 5"],
      nextFestival:"Rama Navami — Mar 26",
      verificationNote:"US location profile aligned to the corrected March 25, 2026 Panchang state."
    },
    varanasi: {
      ...INDIA_PANCHANG,
      sunrise:"5:54 AM", sunset:"6:11 PM", moonrise:"11:49 AM", moonset:"1:10 AM, Mar 26",
      verificationNote:"India profile kept separate because sunrise and day-boundary handling differ from U.S. cities."
    },
    mumbai: {
      ...INDIA_PANCHANG,
      sunrise:"6:36 AM", sunset:"6:49 PM", moonrise:"12:11 PM", moonset:"1:35 AM, Mar 26",
      verificationNote:"India profile kept separate because sunrise and day-boundary handling differ from U.S. cities."
    },
    chennai: {
      ...INDIA_PANCHANG,
      sunrise:"6:10 AM", sunset:"6:19 PM", moonrise:"11:53 AM", moonset:"1:18 AM, Mar 26",
      verificationNote:"India profile kept separate because sunrise and day-boundary handling differ from U.S. cities."
    }
    ,delhi: {
      ...INDIA_PANCHANG,
      sunrise:"6:19 AM", sunset:"6:31 PM", verificationNote:"India city profile tuned for Delhi timezone and sunrise handling."
    },
    agra: {
      ...INDIA_PANCHANG,
      sunrise:"6:17 AM", sunset:"6:29 PM", verificationNote:"India city profile tuned for Agra timezone and sunrise handling."
    },
    jaipur: {
      ...INDIA_PANCHANG,
      sunrise:"6:23 AM", sunset:"6:36 PM", verificationNote:"India city profile tuned for Jaipur timezone and sunrise handling."
    },
    ahmedabad: {
      ...INDIA_PANCHANG,
      sunrise:"6:35 AM", sunset:"6:47 PM", verificationNote:"India city profile tuned for Ahmedabad timezone and sunrise handling."
    },
    hyderabad: {
      ...INDIA_PANCHANG,
      sunrise:"6:12 AM", sunset:"6:23 PM", verificationNote:"India city profile tuned for Hyderabad timezone and sunrise handling."
    },
    bengaluru: {
      ...INDIA_PANCHANG,
      sunrise:"6:18 AM", sunset:"6:25 PM", verificationNote:"India city profile tuned for Bengaluru timezone and sunrise handling."
    },
    kolkata: {
      ...INDIA_PANCHANG,
      sunrise:"5:37 AM", sunset:"5:51 PM", verificationNote:"India city profile tuned for Kolkata timezone and sunrise handling."
    },
    pune: {
      ...INDIA_PANCHANG,
      sunrise:"6:31 AM", sunset:"6:43 PM", verificationNote:"India city profile tuned for Pune timezone and sunrise handling."
    },
    prayagraj: {
      ...INDIA_PANCHANG,
      sunrise:"5:58 AM", sunset:"6:12 PM", verificationNote:"India city profile tuned for Prayagraj timezone and sunrise handling."
    },
    tirupati: {
      ...INDIA_PANCHANG,
      sunrise:"6:07 AM", sunset:"6:18 PM", verificationNote:"India city profile tuned for Tirupati timezone and sunrise handling."
    },
    ujjain: {
      ...INDIA_PANCHANG,
      sunrise:"6:27 AM", sunset:"6:39 PM", verificationNote:"India city profile tuned for Ujjain timezone and sunrise handling."
    },
    haridwar: {
      ...INDIA_PANCHANG,
      sunrise:"6:18 AM", sunset:"6:29 PM", verificationNote:"India city profile tuned for Haridwar timezone and sunrise handling."
    },
    rishikesh: {
      ...INDIA_PANCHANG,
      sunrise:"6:17 AM", sunset:"6:28 PM", verificationNote:"India city profile tuned for Rishikesh timezone and sunrise handling."
    },
    ayodhya: {
      ...INDIA_PANCHANG,
      sunrise:"5:56 AM", sunset:"6:10 PM", verificationNote:"India city profile tuned for Ayodhya timezone and sunrise handling."
    },
    mathura: {
      ...INDIA_PANCHANG,
      sunrise:"6:16 AM", sunset:"6:28 PM", verificationNote:"India city profile tuned for Mathura timezone and sunrise handling."
    },
    nashik: {
      ...INDIA_PANCHANG,
      sunrise:"6:33 AM", sunset:"6:45 PM", verificationNote:"India city profile tuned for Nashik timezone and sunrise handling."
    },
    dwarka: {
      ...INDIA_PANCHANG,
      sunrise:"6:42 AM", sunset:"6:53 PM", verificationNote:"India city profile tuned for Dwarka timezone and sunrise handling."
    },
    toronto: {
      ...PANCHANG,
      sunrise:"7:11 AM", sunset:"7:35 PM", verificationNote:"Canada city profile aligned to local timezone display for Toronto."
    },
    london: {
      ...PANCHANG,
      sunrise:"5:50 AM", sunset:"6:18 PM", verificationNote:"UK city profile aligned to local timezone display for London."
    },
    dubai: {
      ...PANCHANG,
      sunrise:"6:18 AM", sunset:"6:32 PM", verificationNote:"UAE city profile aligned to local timezone display for Dubai."
    },
    singapore: {
      ...PANCHANG,
      sunrise:"7:07 AM", sunset:"7:13 PM", verificationNote:"Singapore city profile aligned to local timezone display for Singapore."
    },
    sydney: {
      ...PANCHANG,
      sunrise:"7:01 AM", sunset:"7:06 PM", verificationNote:"Australia city profile aligned to local timezone display for Sydney."
    },
    kathmandu: {
      ...PANCHANG,
      sunrise:"5:58 AM", sunset:"6:10 PM", verificationNote:"Nepal city profile aligned to local timezone display for Kathmandu."
    }

  },
  "2026-03-26": {
    delhi: {
      ...INDIA_RAM_NAVAMI,
      sunrise:"6:18 AM", sunset:"6:32 PM",
      verificationNote:"Delhi profile updated to the local March 26, 2026 Ram Navami day-state."
    },
    agra: {
      ...INDIA_RAM_NAVAMI,
      sunrise:"6:16 AM", sunset:"6:30 PM",
      verificationNote:"Agra profile updated to the local March 26, 2026 Ram Navami day-state."
    },
    jaipur: {
      ...INDIA_RAM_NAVAMI,
      sunrise:"6:22 AM", sunset:"6:36 PM",
      verificationNote:"Jaipur profile updated to the local March 26, 2026 Ram Navami day-state."
    },
    ahmedabad: {
      ...INDIA_RAM_NAVAMI,
      sunrise:"6:34 AM", sunset:"6:47 PM",
      verificationNote:"Ahmedabad profile updated to the local March 26, 2026 Ram Navami day-state."
    },
    varanasi: {
      ...INDIA_RAM_NAVAMI,
      sunrise:"5:53 AM", sunset:"6:12 PM",
      verificationNote:"Varanasi profile updated to the local March 26, 2026 Ram Navami day-state."
    },
    mumbai: {
      ...INDIA_RAM_NAVAMI,
      sunrise:"6:35 AM", sunset:"6:49 PM",
      verificationNote:"Mumbai profile updated to the local March 26, 2026 Ram Navami day-state."
    },
    chennai: {
      ...INDIA_RAM_NAVAMI,
      sunrise:"6:09 AM", sunset:"6:20 PM",
      verificationNote:"Chennai profile updated to the local March 26, 2026 Ram Navami day-state."
    },
    hyderabad: {
      ...INDIA_RAM_NAVAMI,
      sunrise:"6:11 AM", sunset:"6:24 PM",
      verificationNote:"Hyderabad profile updated to the local March 26, 2026 Ram Navami day-state."
    },
    bengaluru: {
      ...INDIA_RAM_NAVAMI,
      sunrise:"6:17 AM", sunset:"6:26 PM",
      verificationNote:"Bengaluru profile updated to the local March 26, 2026 Ram Navami day-state."
    },
    kathmandu: {
      ...INDIA_RAM_NAVAMI,
      sunrise:"5:56 AM", sunset:"6:09 PM",
      verificationNote:"Kathmandu profile updated to the local March 26, 2026 Ram Navami day-state."
    },
    dubai: {
      ...PANCHANG,
      gregorian:"Thursday, March 26, 2026",
      weekday:"Thursday",
      verificationNote:"Dubai uses the local March 26, 2026 date, with its own timezone display."
    },
    singapore: {
      ...PANCHANG,
      gregorian:"Thursday, March 26, 2026",
      weekday:"Thursday",
      verificationNote:"Singapore uses the local March 26, 2026 date, with its own timezone display."
    },
    sydney: {
      ...PANCHANG,
      gregorian:"Thursday, March 26, 2026",
      weekday:"Thursday",
      verificationNote:"Sydney uses the local March 26, 2026 date, with its own timezone display."
    },
    london: {
      ...PANCHANG,
      gregorian:"Thursday, March 26, 2026",
      weekday:"Thursday",
      verificationNote:"London uses the local March 26, 2026 date, with its own timezone display."
    },
    toronto: {
      ...PANCHANG,
      gregorian:"Wednesday, March 25, 2026",
      verificationNote:"Toronto remains on the local March 25, 2026 date at this moment."
    },
    austin: {
      ...PANCHANG,
      gregorian:"Wednesday, March 25, 2026",
      todayObservances:["Ashoka Ashtami","Masik Durgashtami","Chaitra Navratri Day 5"],
      nextFestival:"Rama Navami — Mar 26",
      verificationNote:"Austin remains on the local March 25, 2026 date at this moment."
    },
    chicago: {
      ...PANCHANG,
      gregorian:"Wednesday, March 25, 2026",
      verificationNote:"Chicago remains on the local March 25, 2026 date at this moment."
    },
    houston: {
      ...PANCHANG,
      gregorian:"Wednesday, March 25, 2026",
      verificationNote:"Houston remains on the local March 25, 2026 date at this moment."
    },
    newyork: {
      ...PANCHANG,
      gregorian:"Wednesday, March 25, 2026",
      verificationNote:"New York remains on the local March 25, 2026 date at this moment."
    }
  }
};

function getLocationPanchang(dateKey, locationKey) {
  const dayMap = LOCATION_PANCHANG[dateKey] || {};
  if (dayMap[locationKey]) return dayMap[locationKey];
  if (dateKey === "2026-03-26" && getLocationMeta(locationKey).region === "India") return INDIA_RAM_NAVAMI;
  if (getLocationMeta(locationKey).region === "India") return INDIA_PANCHANG;
  return PANCHANG;
}

function getLocationMeta(locationKey){
  return LOCATION_OPTIONS.find(x=>x.key===locationKey) || LOCATION_OPTIONS[0];
}


function getTodayObservances(locationKey){
  const localDateKey=getLocalDateKeyForLocation(locationKey);
  const local=getLocationPanchang(localDateKey, locationKey);
  return Array.isArray(local.todayObservances) && local.todayObservances.length
    ? local.todayObservances
    : [local.nextFestival || "Rama Navami — Mar 26"];
}

function formatLocationToday(locationKey){
  const localDateKey=getLocalDateKeyForLocation(locationKey);
  const local=getLocationPanchang(localDateKey, locationKey);
  const meta=getLocationMeta(locationKey);
  const observances=getTodayObservances(locationKey);
  const nextLine = local.nextFestival ? `
**Next major festival:** ${local.nextFestival}` : "";
  return `**📍 Today in ${meta.label}**

**Vedic date:** ${local.hindu}
**Tithi:** ${local.tithi.name} (ends ${local.tithi.ends})
**Nakshatra:** ${local.nakshatra.name}
**Yoga:** ${local.yoga.name}
**Karana:** ${local.karana.morning}${local.karana.evening ? ` → ${local.karana.evening}` : ""}

**Today's observances:** ${observances.join(" · ")}
**Best windows:** Prayer ${local.brahmaMuhurat} · Travel outside Rahu Kaal ${local.rahuKaal}${nextLine}`;
}

const AUDIT_SUMMARY = [
  "Corrected the default Today Panchang reference from Panchami to an Ashtami-based March 25, 2026 profile.",
  "Added location-aware Panchang profiles so U.S. and India cities no longer show a single universal day-state.",
  "Expanded the marked-calendar dataset with additional Ekadashi, Pradosh, Sankashti, Sankranti, Purnima, Amavasya, and Navratri day entries.",
  "Removed the separate innovation ideas panel and folded useful prompts into the AI question chips instead of a standalone section.",
  "Changed mantra display/audio behavior so text language and audio choice stay aligned, and the app stops reusing a mismatched language voice when a native voice is unavailable."
];

const FESTIVALS = [
  /* ─ January ─ */
  {id:101,name:"Lohri",date:"Jan 13",month:0,day:13,days:-72,type:"regional",region:"Punjab/North India",icon:"🔥",color:"#FF6B2C",
   desc:"Bonfire festival marking the end of winter solstice. Celebrated with folk songs, dancing, and offerings of popcorn and sesame to the fire.",
   howTo:"Light bonfire at sunset. Offer reori, gajak, popcorn, sesame seeds into fire. Sing Lohri songs and dance bhangra.",vedic:"Paush/Magha transition"},
  {id:102,name:"Makar Sankranti",date:"Jan 14",month:0,day:14,days:-71,type:"major",region:"All India",icon:"🪁",color:"#FFB300",
   desc:"Sun enters Capricorn — marks end of winter solstice period. Celebrated as Pongal (TN), Uttarayan (GJ), Bihu (AS) and Maghi (PB).",
   howTo:"Take holy dip at sunrise. Fly kites. Eat til-gur (sesame-jaggery). Donate to poor. Offer sesame to ancestors.",vedic:"Surya enters Makar Rashi"},
  {id:103,name:"Pongal",date:"Jan 14",month:0,day:14,days:-71,type:"regional",region:"Tamil Nadu",icon:"🍚",color:"#4CAF50",
   desc:"4-day harvest festival of Tamil Nadu. Bhogi, Thai Pongal, Mattu Pongal and Kaanum Pongal are the four days.",
   howTo:"Cook Pongal rice in new clay pot. Offer to Sun. Decorate with kolam. Thank Sun God and cattle.",vedic:"Thai month begins"},
  /* ─ February ─ */
  {id:104,name:"Basant Panchami",date:"Feb 2",month:1,day:2,days:-52,type:"major",region:"All India",icon:"🌼",color:"#FFD700",
   desc:"Celebration of spring's arrival and worship of Goddess Saraswati. Students place books and instruments before the goddess for blessings.",
   howTo:"Wear yellow clothes. Worship Saraswati with books and veena. Fly kites. Plant mustard flowers.",vedic:"Magha Shukla Panchami"},
  {id:105,name:"Maha Shivratri",date:"Feb 26",month:1,day:26,days:-28,type:"major",region:"All India",icon:"🔱",color:"#8B5CF6",
   desc:"The Great Night of Lord Shiva. Devotees fast, stay awake all night performing four prahar pujas. Shiva temples overflow with devotees.",
   howTo:"Fast all day. Perform 4 prahar puja at night. Offer milk, bel patra, dhatura. Stay awake chanting Om Namah Shivaya.",vedic:"Phalguna Krishna Chaturdashi"},
  /* ─ March ─ */
  {id:106,name:"Holi",date:"Mar 14",month:2,day:14,days:-12,type:"major",region:"All India",icon:"🎨",color:"#FF4081",
   desc:"Festival of colours celebrating the victory of Prahlad and Holika's destruction. Played with gulal, water and festive joy.",
   howTo:"Night before: Holika Dahan bonfire puja. Next day: Play with organic gulal. Share sweets. Sing folk songs.",vedic:"Phalguna Purnima"},
  {id:1,name:"Ram Navami",date:"Mar 26",month:2,day:26,days:2,type:"major",region:"All India",icon:"🏹",color:"#FF6B2C",
   desc:"Celebrates the birth of Lord Rama, the 7th avatar of Vishnu. Devotees observe fasting, visit temples, and recite the Ramayana.",
   howTo:"Fast from sunrise. Chant Shri Ram Jai Ram. Offer tulsi and fruits to Ram Lalla. Break fast with panchamrita.",vedic:"Chaitra Shukla Navami"},
  {id:2,name:"Hanuman Jayanti",date:"Apr 1",month:3,day:1,days:8,type:"major",region:"North India / varies by region",icon:"🐒",color:"#FF8C00",
   desc:"Birthday of Lord Hanuman, the epitome of devotion and strength.",
   howTo:"Recite Hanuman Chalisa 11 times. Offer sindoor mixed with oil. Distribute prasad.",vedic:"Chaitra Purnima"},
  {id:3,name:"Akshaya Tritiya",date:"Apr 19",month:3,day:19,days:26,type:"major",region:"All India",icon:"💰",color:"#4CAF50",
   desc:"Most auspicious day in the Hindu calendar. Any work started today yields permanent results.",
   howTo:"Buy gold. Start new ventures. Perform Vishnu-Lakshmi puja. Donate to the needy.",vedic:"Vaishakha Shukla Tritiya"},
  {id:4,name:"Buddha Purnima",date:"May 1",month:4,day:1,days:37,type:"purnima",region:"All India",icon:"☸️",color:"#7C4DFF",
   desc:"Commemorates the birth, enlightenment and death of Siddhartha Gautama Buddha.",
   howTo:"Meditate. Visit Buddhist temples. Practice ahimsa. Donate food and clothes.",vedic:"Vaishakha Purnima"},
  {id:5,name:"Rath Yatra",date:"Jul 15",month:6,day:15,days:112,type:"major",region:"Odisha",icon:"🚂",color:"#E91E8C",
   desc:"Festival of Chariots of Lord Jagannath in Puri. Millions pull the massive chariot.",
   howTo:"Pull the chariot ropes for spiritual merit. Participate in Mahaprasad distribution.",vedic:"Ashadha Shukla Dwitiya"},
  {id:6,name:"Guru Purnima",date:"Jul 29",month:6,day:29,days:126,type:"purnima",region:"All India",icon:"📚",color:"#FFB300",
   desc:"Day to honour spiritual teachers and the guru-disciple tradition.",
   howTo:"Visit your guru. Offer flowers and gratitude. Study scriptures.",vedic:"Ashadha Purnima"},
  {id:7,name:"Janmashtami",date:"Sep 3",month:8,day:3,days:162,type:"major",region:"Smarta / All India",icon:"🎭",color:"#3F51B5",
   desc:"Celebration of Lord Krishna's birth at midnight.",
   howTo:"Fast all day. Perform abhishek at midnight. Break fast with panchamrita.",vedic:"Bhadrapada Krishna Ashtami"},
  {id:8,name:"Ganesh Chaturthi",date:"Sep 14",month:8,day:14,days:173,type:"major",region:"All India",icon:"🐘",color:"#FF6B2C",
   desc:"10-day festival celebrating Lord Ganesha's birth.",
   howTo:"Bring home Ganesha idol. Daily puja. Offer modak and durva. Immerse idol.",vedic:"Bhadrapada Shukla Chaturthi"},
  {id:9,name:"Navratri",date:"Oct 11",month:9,day:11,days:200,type:"major",region:"All India",icon:"🕉️",color:"#E91E8C",
   desc:"Nine nights of worship of Goddess Durga in nine forms.",
   howTo:"Fast and pray to each Navadurga form. Perform Garba and Dandiya in evenings.",vedic:"Ashwin Shukla Pratipada to Navami"},
  {id:10,name:"Dussehra",date:"Oct 20",month:9,day:20,days:209,type:"major",region:"All India",icon:"🎆",color:"#FFB300",
   desc:"Victory of Lord Rama over Ravana — symbolizing good over evil.",
   howTo:"Attend Ramlila performance. Ravana dahan. Worship weapons (Ayudha Puja).",vedic:"Ashwin Shukla Dashami"},
  {id:11,name:"Diwali",date:"Nov 8",month:10,day:8,days:228,type:"major",region:"All India",icon:"🪔",color:"#FFB300",
   desc:"Festival of Lights — celebrating Lord Rama's return to Ayodhya.",
   howTo:"Light diyas at sunset. Perform Lakshmi puja. Exchange sweets.",vedic:"Kartika Krishna Amavasya"},
  {id:12,name:"Chhath Puja",date:"Nov 15",month:10,day:15,days:235,type:"regional",region:"Bihar/UP/Nepal belt",icon:"☀️",color:"#FF6B2C",
   desc:"Worship of Surya and Chhathi Maiya. Stand in water, offer arghya to the sun.",
   howTo:"36-hour fast without water. Stand in river at sunset and sunrise. Offer fruits.",vedic:"Kartika Shukla Shashthi"},
  /* ─ April ─ */
  {id:107,name:"Baisakhi",date:"Apr 14",month:3,day:14,days:51,type:"major",region:"Punjab / All India",icon:"🌾",color:"#FFB300",
   desc:"Harvest festival and Sikh New Year. Also marks the founding of the Khalsa Panth by Guru Gobind Singh in 1699.",
   howTo:"Attend Gurdwara. Perform Bhangra/Gidda. Visit Golden Temple. Share langar (community meal).",vedic:"Surya enters Mesha (Solar New Year)"},
  {id:108,name:"Ugadi / Gudi Padwa",date:"Mar 30",month:2,day:30,days:6,type:"regional",region:"Karnataka/AP/MH",icon:"🪆",color:"#4CAF50",
   desc:"Kannada, Telugu and Marathi New Year. Gudi (flag pole) is hoisted. Ugadi pachadi — a dish with 6 tastes — is prepared.",
   howTo:"Raise Gudi/flag. Eat Ugadi Pachadi (neem+jaggery+tamarind). Visit temple. Hear new-year almanac (Panchangashravanam).",vedic:"Chaitra Shukla Pratipada"},
  /* ─ July/August ─ */
  {id:109,name:"Hariyali Teej",date:"Jul 29",month:6,day:29,days:126,type:"regional",region:"North India",icon:"🌿",color:"#22C55E",
   desc:"Shravana Shukla Tritiya — married women fast for long life of their husbands. Swings are decorated, women wear green and sing folk songs.",
   howTo:"Married women fast all day. Apply mehndi. Wear green bangles and saree. Sing Teej geet. Visit Shiva-Parvati temple.",vedic:"Shravana Shukla Tritiya"},
  {id:110,name:"Nag Panchami",date:"Aug 5",month:7,day:5,days:133,type:"major",region:"All India",icon:"🐍",color:"#16A34A",
   desc:"Worship of the snake deity on the 5th day of Shravan. Milk is offered to snake images, and snakes in forests are respected.",
   howTo:"Offer milk to snake idol or at anthills. Visit Nag temple. Do not dig soil or cook on an open flame.",vedic:"Shravana Shukla Panchami"},
  {id:111,name:"Raksha Bandhan",date:"Aug 19",month:7,day:19,days:147,type:"major",region:"All India",icon:"🧵",color:"#EC4899",
   desc:"Sisters tie a sacred thread (rakhi) on their brother's wrist. Brothers promise to protect their sisters.",
   howTo:"Sister performs aarti. Ties rakhi. Brother gives gift. Family celebrates with sweets.",vedic:"Shravana Purnima"},
  /* ─ October ─ */
  {id:112,name:"Karva Chauth",date:"Oct 28",month:9,day:28,days:217,type:"regional",region:"North India",icon:"🌙",color:"#8B5CF6",
   desc:"Married women fast from sunrise to moonrise for their husband's long life and well-being. Moon is sighted through a sieve.",
   howTo:"Fast from sunrise. No food or water until moonrise. Sight moon through sieve and husband's face. Break fast with husband's hands.",vedic:"Kartika Krishna Chaturthi"},
  /* ─ November ─ */
  {id:113,name:"Dhanteras",date:"Nov 6",month:10,day:6,days:226,type:"major",region:"All India",icon:"🪙",color:"#FFD700",
   desc:"First day of Diwali week. Dedicated to Dhanvantari (god of Ayurveda) and Lakshmi. Gold/silver/utensils are bought for prosperity.",
   howTo:"Buy gold, silver or new utensils. Light 13 diyas at dusk. Worship Yama (south-facing lamp). Perform Lakshmi puja.",vedic:"Kartika Krishna Trayodashi"},
  {id:114,name:"Govardhan Puja",date:"Nov 9",month:10,day:9,days:229,type:"major",region:"All India",icon:"⛰️",color:"#10B981",
   desc:"Day after Diwali — commemorates Lord Krishna lifting the Govardhan hill to protect villagers from Indra's wrath.",
   howTo:"Make mountain of cow dung / food. Circumambulate it. Offer 56 items (Chappan Bhog). Eat Anna Kuta prasad.",vedic:"Kartika Shukla Pratipada"},
  {id:115,name:"Bhai Dooj",date:"Nov 10",month:10,day:10,days:230,type:"major",region:"All India",icon:"🤝",color:"#F97316",
   desc:"Two days after Diwali — sisters apply tilak on brothers' foreheads and pray for their long life. Similar to Raksha Bandhan.",
   howTo:"Sister performs tilak, aarti. Brother gives gifts. Eat together. Sisters pray for brother's prosperity.",vedic:"Kartika Shukla Dwitiya"},
  {id:116,name:"Kartik Purnima",date:"Nov 22",month:10,day:22,days:242,type:"purnima",region:"All India",icon:"🌕",color:"#FFB300",
   desc:"Full moon of Kartik — one of the most sacred. Holy dip at Pushkar, Varanasi, Prayagraj. Dev Diwali is celebrated at Varanasi ghats.",
   howTo:"Take holy bath at sunrise. Light lamps near Tulsi. Attend Dev Diwali (Varanasi). Donate food and clothes.",vedic:"Kartika Purnima / Tripuri Purnima"},
  {id:117,name:"Tulsi Vivah",date:"Nov 22",month:10,day:22,days:242,type:"major",region:"All India",icon:"🌿",color:"#22C55E",
   desc:"Ceremonial marriage of Tulsi plant with Lord Vishnu (Shaligram). Marks the end of the religious period when marriages resume.",
   howTo:"Decorate Tulsi with saree and ornaments. Perform wedding ceremony with Shaligram. Light diya. Ring conch.",vedic:"Kartika Shukla Ekadashi to Purnima"},
  /* ─ December ─ */
  {id:118,name:"Gita Jayanti",date:"Dec 19",month:11,day:19,days:269,type:"major",region:"All India",icon:"📖",color:"#6B4FFF",
   desc:"Anniversary of Lord Krishna's sermon of Bhagavad Gita to Arjuna on the battlefield of Kurukshetra. Celebrated with Gita readings.",
   howTo:"Read Bhagavad Gita (even one chapter). Attend temple Gita Path. Meditate on Krishna's teachings. Gift Gita to someone.",vedic:"Margashirsha Shukla Ekadashi (Mokshada Ekadashi)"},
  {id:119,name:"Vivah Panchami",date:"Dec 3",month:11,day:3,days:253,type:"major",region:"North India",icon:"💍",color:"#E11D48",
   desc:"Anniversary of the divine marriage of Ram and Sita. Grand celebrations at Janakpur (Nepal), Ayodhya and all Ram temples.",
   howTo:"Visit Ram temple. Attend Rama-Sita Vivah ceremony. Chant Ram naam. Read Bal Kand of Ramayana.",vedic:"Margashirsha Shukla Panchami"},
  /* ─ Regional / Important ─ */
  {id:120,name:"Onam",date:"Sep 5",month:8,day:5,days:164,type:"regional",region:"Kerala",icon:"🌸",color:"#22C55E",
   desc:"Kerala harvest festival celebrating the return of mythical King Mahabali. 10-day festival with Pookalam (flower carpet), Vallam Kali (boat race) and Onam Sadhya (feast).",
   howTo:"Create Pookalam (flower rangoli). Enjoy 26-dish Onam Sadhya on banana leaf. Watch Vallam Kali boat races.",vedic:"Thiruonam — Shravana Nakshatra in Chingam month"},
];
const FESTIVAL_MAP = {};
FESTIVALS.forEach(f=>{ FESTIVAL_MAP[f.month+"-"+f.day]=f; });

const SACRED_DATES = [
  {name:"Shattila Ekadashi",date:"Jan 13",days:-72,icon:"🌙",color:"#5BA4F5",desc:"Magha Krishna Ekadashi for austerity and donation."},
  {name:"Pausha Purnima",date:"Jan 2",days:-83,icon:"🌕",color:"#FFB300",desc:"Full Moon observance with snana and dana."},
  {name:"Vijaya Ekadashi",date:"Feb 12",days:-42,icon:"🌙",color:"#5BA4F5",desc:"Ekadashi associated with victory and Vishnu worship."},
  {name:"Amalaki Ekadashi",date:"Feb 27",days:-27,icon:"🌙",color:"#5BA4F5",desc:"Phalguna Shukla Ekadashi observed with Amla worship."},
  {name:"Papamochani Ekadashi",date:"Mar 14",days:-12,icon:"🌙",color:"#5BA4F5",desc:"Krishna Ekadashi before Chaitra Navratri."},
  {name:"Rama Navami",date:"Mar 26",days:1,icon:"🏹",color:"#FF6B2C",desc:"Lord Rama Jayanti on Chaitra Shukla Navami in Austin."},
  {name:"Kamada Ekadashi",date:"Mar 28",days:3,icon:"🌙",color:"#5BA4F5",desc:"Chaitra Shukla Ekadashi for purification and blessings."},
  {name:"Hanuman Jayanti",date:"Apr 1",days:7,icon:"🐒",color:"#FF8C00",desc:"Hanuman Janmotsava on Chaitra Purnima in Austin."},
  {name:"Varuthini Ekadashi",date:"Apr 13",days:19,icon:"🌙",color:"#5BA4F5",desc:"Vaishakha Krishna Ekadashi."},
  {name:"Akshaya Tritiya",date:"Apr 19",days:25,icon:"⭐",color:"#4CAF50",desc:"Vaishakha Shukla Tritiya; highly auspicious for charity and new starts."},
  {name:"Mohini Ekadashi",date:"Apr 27",days:33,icon:"🌙",color:"#5BA4F5",desc:"Vaishakha Shukla Ekadashi."},
  {name:"Buddha Purnima",date:"May 1",days:37,icon:"☸️",color:"#7C4DFF",desc:"Vaishakha Purnima; Buddha Jayanti."},
  {name:"Apara Ekadashi",date:"May 12",days:48,icon:"🌙",color:"#5BA4F5",desc:"Jyeshtha Krishna Ekadashi."},
  {name:"Padmini Ekadashi",date:"May 26",days:62,icon:"🌙",color:"#5BA4F5",desc:"Adhika month Shukla Ekadashi."},
  {name:"Parama Ekadashi",date:"Jun 11",days:78,icon:"🌙",color:"#5BA4F5",desc:"Adhika month Krishna Ekadashi."},
  {name:"Nirjala Ekadashi",date:"Jun 25",days:92,icon:"🌙",color:"#5BA4F5",desc:"Most austere Ekadashi fast."},
  {name:"Yogini Ekadashi",date:"Jul 10",days:107,icon:"🌙",color:"#5BA4F5",desc:"Ashadha Krishna Ekadashi."},
  {name:"Devshayani Ekadashi",date:"Jul 24",days:121,icon:"🌙",color:"#5BA4F5",desc:"Ashadha Shukla Ekadashi; Chaturmas begins."},
  {name:"Kamika Ekadashi",date:"Aug 8",days:136,icon:"🌙",color:"#5BA4F5",desc:"Shravana Krishna Ekadashi."},
  {name:"Shravana Putrada Ekadashi",date:"Aug 23",days:151,icon:"🌙",color:"#5BA4F5",desc:"Shravana Shukla Ekadashi."},
  {name:"Aja Ekadashi",date:"Sep 6",days:165,icon:"🌙",color:"#5BA4F5",desc:"Bhadrapada Krishna Ekadashi."},
  {name:"Parsva Ekadashi",date:"Sep 22",days:181,icon:"🌙",color:"#5BA4F5",desc:"Bhadrapada Shukla Ekadashi."},
  {name:"Indira Ekadashi",date:"Oct 6",days:195,icon:"🌙",color:"#5BA4F5",desc:"Ashwina Krishna Ekadashi."},
  {name:"Papankusha Ekadashi",date:"Oct 21",days:210,icon:"🌙",color:"#5BA4F5",desc:"Ashwina Shukla Ekadashi."},
  {name:"Rama Ekadashi",date:"Nov 4",days:224,icon:"🌙",color:"#5BA4F5",desc:"Kartika Krishna Ekadashi."},
  {name:"Devutthana Ekadashi",date:"Nov 20",days:240,icon:"🌙",color:"#5BA4F5",desc:"Kartika Shukla Ekadashi; marriages resume."},
  {name:"Utpanna Ekadashi",date:"Dec 4",days:254,icon:"🌙",color:"#5BA4F5",desc:"Margashirsha Krishna Ekadashi."},
  {name:"Mokshada Ekadashi",date:"Dec 19",days:269,icon:"🌙",color:"#5BA4F5",desc:"Margashirsha Shukla Ekadashi and Gita Jayanti."},
];

/* ══════════════════════════════════════════════════════
   MANTRAS
══════════════════════════════════════════════════════ */
const MANTRAS = [
  {id:1,name:"Gayatri Mantra",deity:"Surya / Universal",cat:"Universal",icon:"☀️",color:"#FFC040",chants:108,bestTime:"Sunrise, Noon, Sunset",
   sanskrit:"Om Bhur Bhuva Swaha, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat",
   devnagari:"ॐ भूर्भुवः स्वः। तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि। धियो यो नः प्रचोदयात्॥",
   meaning:"We meditate on the divine light of the Sun. May it illuminate our intellect.",benefits:"Wisdom, clarity, spiritual awakening"},
  {id:2,name:"Maha Mrityunjaya",deity:"Lord Shiva",cat:"Shiva",icon:"🔱",color:"#8855FF",chants:108,bestTime:"Brahma Muhurat, Mondays",
   sanskrit:"Om Tryambakam Yajamahe Sugandhim Pushtivardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat",
   devnagari:"ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥",
   meaning:"We worship Shiva who nourishes all beings. May he liberate us from death.",benefits:"Protection, health, overcoming fear"},
  {id:3,name:"Ganesha Moola Mantra",deity:"Lord Ganesha",cat:"Ganesha",icon:"🐘",color:"#FF7040",chants:108,bestTime:"Morning, before any task",
   sanskrit:"Om Gam Ganapataye Namah",devnagari:"ॐ गं गणपतये नमः॥",
   meaning:"I bow to Ganesha, the remover of all obstacles.",benefits:"Remove obstacles, success in ventures"},
  {id:4,name:"Vishnu Mantra",deity:"Lord Vishnu",cat:"Vishnu",icon:"🐚",color:"#3F51B5",chants:108,bestTime:"Morning, Ekadashi",
   sanskrit:"Om Namo Bhagavate Vasudevaya",devnagari:"ॐ नमो भगवते वासुदेवाय॥",
   meaning:"I bow to Lord Vasudeva, the all-pervading divine.",benefits:"Protection, prosperity, moksha"},
  {id:5,name:"Lakshmi Mantra",deity:"Goddess Lakshmi",cat:"Devi",icon:"🪷",color:"#F02890",chants:108,bestTime:"Friday evening",
   sanskrit:"Om Shreem Hreem Kleem Mahalakshmyai Namah",devnagari:"ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः॥",
   meaning:"I bow to Mahalakshmi, the goddess of wealth.",benefits:"Wealth, abundance, domestic harmony"},
  {id:6,name:"Durga Mantra",deity:"Goddess Durga",cat:"Devi",icon:"⚔️",color:"#E74C3C",chants:108,bestTime:"Navratri, Tuesdays",
   sanskrit:"Om Dum Durgayai Namah",devnagari:"ॐ दुं दुर्गायै नमः॥",
   meaning:"I bow to Goddess Durga, the invincible divine mother.",benefits:"Courage, protection, victory"},
  {id:7,name:"Hare Krishna Mahamantra",deity:"Lord Krishna",cat:"Vishnu",icon:"🎭",color:"#1565C0",chants:108,bestTime:"Any time",
   sanskrit:"Hare Krishna Hare Krishna Krishna Krishna Hare Hare, Hare Rama Hare Rama Rama Rama Hare Hare",
   devnagari:"हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे॥",
   meaning:"O Lord Krishna, O Lord Rama, please engage me in your service.",benefits:"Divine love, bliss, liberation"},
  {id:8,name:"Saraswati Mantra",deity:"Goddess Saraswati",cat:"Devi",icon:"🎵",color:"#00BCD4",chants:108,bestTime:"Morning, before study",
   sanskrit:"Om Aim Saraswatyai Namah",devnagari:"ॐ ऐं सरस्वत्यै नमः॥",
   meaning:"I bow to Goddess Saraswati, source of knowledge.",benefits:"Knowledge, creativity, eloquence"},
  {id:9,name:"Hanuman Mantra",deity:"Lord Hanuman",cat:"Hanuman",icon:"🙏",color:"#FF7040",chants:108,bestTime:"Tuesdays, Saturdays",
   sanskrit:"Om Hanumate Namah",devnagari:"ॐ हनुमते नमः॥",
   meaning:"I bow to Lord Hanuman.",benefits:"Strength, devotion, protection"},
  {id:10,name:"Om Namah Shivaya",deity:"Lord Shiva",cat:"Shiva",icon:"🔱",color:"#9C27B0",chants:108,bestTime:"Mondays, Pradosh",
   sanskrit:"Om Namah Shivaya",devnagari:"ॐ नमः शिवाय॥",
   meaning:"I bow to Lord Shiva, the auspicious supreme consciousness.",benefits:"Liberation, inner peace"},
  {id:11,name:"Ram Mantra",deity:"Lord Rama",cat:"Vishnu",icon:"🏹",color:"#FF8C00",chants:108,bestTime:"Morning, Ram Navami",
   sanskrit:"Shri Ram Jai Ram Jai Jai Ram",devnagari:"श्री राम जय राम जय जय राम॥",
   meaning:"Victory to Lord Rama.",benefits:"Righteousness, courage, truth, peace"},
  {id:12,name:"Surya Ashtakam",deity:"Surya Dev",cat:"Universal",icon:"🌅",color:"#FFC040",chants:12,bestTime:"Sunrise",
   sanskrit:"Om Mitraya Namah, Om Ravaye Namah, Om Suryaya Namah, Om Bhanave Namah",
   devnagari:"ॐ मित्राय नमः। ॐ रवये नमः। ॐ सूर्याय नमः। ॐ भानवे नमः।",
   meaning:"Salutations to the 12 names of Surya.",benefits:"Health, vitality, energy, mental clarity"},
];
const MANTRA_CATS = ["All","Universal","Ganesha","Shiva","Vishnu","Devi","Hanuman"];

/* ══════════════════════════════════════════════════════
   GLOBAL SEARCH
══════════════════════════════════════════════════════ */
const MUHURAT_DATA = [
  /* ── Muhurat / Kaal ── */
  {name:"Brahma Muhurat",icon:"🌅",desc:"4:53–5:38 AM — Most sacred window for meditation, yoga, and spiritual study. Mind is clearest before sunrise.",bestTime:"4:53–5:38 AM",type:"muhurat"},
  {name:"Amrit Kaal",icon:"🌸",desc:"8:43–10:23 AM — Auspicious period meaning 'nectar time'. Excellent for starting new ventures, taking medicine, and worship.",bestTime:"8:43–10:23 AM",type:"muhurat"},
  {name:"Abhijit Muhurat",icon:"⭐",desc:"12:01–12:50 PM — Most powerful daytime muhurat. Great for important decisions, business launches, and travel starts.",bestTime:"12:01–12:50 PM",type:"muhurat"},
  {name:"Rahu Kaal",icon:"⚠️",desc:"3:00–4:30 PM — Period ruled by shadow planet Rahu. Avoid starting new work, travel, or auspicious activities.",bestTime:"Avoid",type:"muhurat"},
  {name:"Gulika Kaal",icon:"🔶",desc:"1:30–3:00 PM — Moderately inauspicious period, son of Saturn. Avoid important new beginnings.",bestTime:"Avoid",type:"muhurat"},
  {name:"Yamaganda",icon:"🔴",desc:"10:30 AM–12:00 PM — Period of Yama (death god). Avoid travel, medical procedures, and important decisions.",bestTime:"Avoid",type:"muhurat"},
  {name:"Durmuhurta",icon:"🚫",desc:"Inauspicious window occurring twice daily. Check daily panchang and avoid all auspicious activities during this time.",bestTime:"Varies daily",type:"muhurat"},
  {name:"Vijaya Muhurat",icon:"🏆",desc:"The 'victory time' — 2nd quarter of the day. Excellent for competitions, legal matters, and new projects.",bestTime:"Afternoon",type:"muhurat"},
  {name:"Godhuli Muhurat",icon:"🌇",desc:"Dusk time when cows return home — naturally auspicious, especially for weddings and sacred ceremonies.",bestTime:"Dusk",type:"muhurat"},
  {name:"Nishita Muhurat",icon:"🌙",desc:"Midnight time — sacred to Shiva and Kali. Powerful for tantra sadhana and deep meditation.",bestTime:"Midnight",type:"muhurat"},
  /* ── Tithis ── */
  {name:"Ekadashi",icon:"🌙",desc:"11th day of lunar fortnight — most auspicious fasting day. Observing Ekadashi fast destroys past sins and grants moksha. Occurs twice monthly.",bestTime:"Monthly",type:"muhurat"},
  {name:"Pradosh Vrat",icon:"🔱",desc:"13th tithi (Trayodashi) twilight worship of Lord Shiva. Observing Pradosh fast fulfills desires and removes obstacles.",bestTime:"Monthly",type:"muhurat"},
  {name:"Chaturthi",icon:"🐘",desc:"4th tithi — sacred to Lord Ganesha. Sankashti Chaturthi (Krishna Paksha) is most powerful, fasting until moonrise.",bestTime:"Monthly",type:"muhurat"},
  {name:"Purnima",icon:"🌕",desc:"Full moon tithi — highly auspicious for worship, fasting, charity, and rituals. Moonlight enhances spiritual energy.",bestTime:"Monthly",type:"muhurat"},
  {name:"Amavasya",icon:"🌑",desc:"New moon — sacred for Pitru (ancestor) offerings. Tarpan and Shraddha rituals on this day liberate ancestors.",bestTime:"Monthly",type:"muhurat"},
  {name:"Navami",icon:"🌸",desc:"9th tithi — auspicious for Devi worship. Ram Navami (Chaitra Navami) celebrates Lord Rama's birth.",bestTime:"Monthly",type:"muhurat"},
  {name:"Dwadashi",icon:"🌿",desc:"12th tithi — day after Ekadashi, sacred to Vishnu. Breaking Ekadashi fast is prescribed on Dwadashi.",bestTime:"Monthly",type:"muhurat"},
  /* ── Fasting ── */
  {name:"fasting",icon:"🌙",desc:"Vedic fasting (Upavasa) purifies body and mind. Common fasts: Ekadashi, Pradosh, Mondays (Shiva), Fridays (Lakshmi), Saturdays (Shani).",bestTime:"Various",type:"muhurat"},
  {name:"Monday fast",icon:"🔱",desc:"Mondays (Somvar) are sacred to Lord Shiva. Fasting on Mondays grants blessings, removes problems, and fulfills wishes.",bestTime:"Every Monday",type:"muhurat"},
  {name:"Tuesday fast",icon:"💪",desc:"Tuesdays (Mangalvar) are sacred to Lord Hanuman and Mars (Mangal). Fasting removes Mangal dosha and grants strength.",bestTime:"Every Tuesday",type:"muhurat"},
  {name:"Wednesday fast",icon:"📗",desc:"Wednesdays (Budhvar) are sacred to Lord Ganesha and planet Mercury. Fasting improves intelligence and communication.",bestTime:"Every Wednesday",type:"muhurat"},
  {name:"Thursday fast",icon:"🙏",desc:"Thursdays (Guruvaar) are sacred to Lord Vishnu and Jupiter (Brihaspati). Fasting on Thursday brings wisdom and prosperity.",bestTime:"Every Thursday",type:"muhurat"},
  {name:"Friday fast",icon:"🪷",desc:"Fridays (Shukravar) are sacred to Goddess Lakshmi and planet Venus. Fasting brings wealth, love, and beauty.",bestTime:"Every Friday",type:"muhurat"},
  {name:"Saturday fast",icon:"⚫",desc:"Saturdays (Shanivar) are sacred to Lord Shani (Saturn). Fasting on Saturday pacifies Shani and removes suffering.",bestTime:"Every Saturday",type:"muhurat"},
  {name:"Solah Somvar",icon:"🔱",desc:"16 consecutive Monday fasts — powerful Shiva vrat for fulfilling desires, marriage, and removing hardships.",bestTime:"16 Mondays",type:"muhurat"},
  /* ── Major Festivals 2026 ── */
  {name:"Navratri",icon:"🕉️",desc:"Nine nights of Goddess Durga worship. Chaitra Navratri: Mar 19–27, 2026. Sharad Navratri: Oct 11–19, 2026. Includes Garba, fasting, and Devi puja.",bestTime:"Apr & Sep 2026",type:"muhurat"},
  {name:"Diwali",icon:"🪔",desc:"Festival of Lights — Lakshmi puja, earthen diyas, firecrackers, Govardhan Puja. Diwali 2026: Nov 8 in Austin and many U.S. locations. Celebrates Lord Rama's return to Ayodhya.",bestTime:"Oct 20, 2026",type:"muhurat"},
  {name:"Holi",icon:"🎨",desc:"Festival of Colors — celebrating spring and love of Radha-Krishna. Holika Dahan: Mar 2, 2026. Rangwali Holi: Mar 3, 2026.",bestTime:"Mar 4, 2026",type:"muhurat"},
  {name:"Maha Shivaratri",icon:"🔱",desc:"Great night of Shiva — Feb 15, 2026 in Austin. All-night vigil, fasting, abhishek with milk/belpatra. Most powerful Shiva festival.",bestTime:"Feb 18, 2026",type:"muhurat"},
  {name:"Janmashtami",icon:"🎺",desc:"Lord Krishna's birth — Sep 3, 2026 (Smarta) and Sep 4, 2026 (ISKCON) in Austin. Midnight celebrations, fasting, jhula (swing) decoration, Dahi Handi.",bestTime:"Aug 16, 2026",type:"muhurat"},
  {name:"Ram Navami",icon:"🏹",desc:"Lord Rama's birth — Mar 26, 2026 in the corrected 2026 dataset. Fasting, Ramayana readings, Ram rath yatra processions.",bestTime:"Apr 17, 2026",type:"muhurat"},
  {name:"Ganesh Chaturthi",icon:"🐘",desc:"Lord Ganesha's birth — Sep 14, 2026 in Austin. 10-day celebration with clay idol installation and immersion (visarjan).",bestTime:"Aug 26, 2026",type:"muhurat"},
  {name:"Onam",icon:"🌺",desc:"Kerala's harvest festival — Sep 6–15, 2026. Celebrates King Mahabali's return. Pookalam (flower rangoli), Onam Sadya feast.",bestTime:"Sep 2026",type:"muhurat"},
  {name:"Pongal",icon:"🌾",desc:"Tamil harvest festival — Jan 14–17, 2026. Celebrates Sun, cattle, and harvest. Kolam drawing, sugarcane, sweet rice.",bestTime:"Jan 14–17, 2026",type:"muhurat"},
  {name:"Makar Sankranti",icon:"☀️",desc:"Sun enters Capricorn — Jan 14, 2026. Kite flying, sesame sweets, holy dips. Marks end of inauspicious period.",bestTime:"Jan 14, 2026",type:"muhurat"},
  {name:"Raksha Bandhan",icon:"🧶",desc:"Bond of protection — Aug 27, 2026 in Austin. Sisters tie rakhi on brothers' wrists; brothers pledge protection.",bestTime:"Aug 3, 2026",type:"muhurat"},
  {name:"Dussehra",icon:"🏹",desc:"Victory of Ram over Ravana — Oct 20, 2026. Ravana effigy burning, Ram Lila plays. Also called Vijayadashami.",bestTime:"Oct 8, 2026",type:"muhurat"},
  {name:"Karva Chauth",icon:"🌕",desc:"Women's fast for husband's longevity — Oct 28, 2026. Fast from sunrise to moonrise, then moon puja.",bestTime:"Oct 13, 2026",type:"muhurat"},
  {name:"Baisakhi",icon:"🌾",desc:"Punjabi New Year and harvest festival — Apr 14, 2026. Marks founding of Khalsa Panth in 1699. Bhangra, melas, gurdwara visits.",bestTime:"Apr 14, 2026",type:"muhurat"},
  {name:"Chhath Puja",icon:"☀️",desc:"4-day Sun worship culminating Nov 15, 2026. Devotees stand in water at sunrise/sunset offering arghya (water offering) to Surya.",bestTime:"Oct 23–26, 2026",type:"muhurat"},
  {name:"Kumbh Mela",icon:"🏺",desc:"Largest religious gathering on Earth — occurs every 3, 6, or 12 years at Prayagraj, Haridwar, Ujjain, Nashik. Bathing on Shahi Snan dates grants liberation.",bestTime:"Every 3–12 years",type:"muhurat"},
  {name:"Guru Purnima",icon:"📿",desc:"Full moon of Ashadha month — Jul 29, 2026. Day to honor spiritual teachers (gurus). Disciples worship guru's feet for blessings.",bestTime:"Jul 10, 2026",type:"muhurat"},
  {name:"Vasant Panchami",icon:"🌼",desc:"5th day of spring — Jan 23, 2026 in Austin. Saraswati puja, yellow clothing, start of studies. Marks arrival of spring.",bestTime:"Feb 2, 2026",type:"muhurat"},
  {name:"Hanuman Jayanti",icon:"🐒",desc:"Lord Hanuman's birth — Apr 1, 2026 in Austin. All-day Hanuman Chalisa recitation, sindoor offering. Very auspicious.",bestTime:"Apr 12, 2026",type:"muhurat"},
  /* ── Deities ── */
  {name:"Shiva",icon:"🔱",desc:"Lord Shiva — Destroyer and transformer. Worship on Mondays, Pradosh, Shivaratri. Mantra: Om Namah Shivaya. Offerings: belpatra, milk, dhatura.",bestTime:"Mondays",type:"muhurat"},
  {name:"Vishnu",icon:"🐚",desc:"Lord Vishnu — Preserver of the universe. Worship on Ekadashi, Thursdays, Janmashtami. Mantra: Om Namo Bhagavate Vasudevaya. Offerings: tulsi, yellow flowers.",bestTime:"Ekadashi",type:"muhurat"},
  {name:"Ganesha",icon:"🐘",desc:"Lord Ganesha — Remover of obstacles, God of beginnings. Worship before any new venture. Chaturthi is most auspicious. Offerings: modak, durva grass.",bestTime:"Chaturthi",type:"muhurat"},
  {name:"Lakshmi",icon:"🪷",desc:"Goddess Lakshmi — Goddess of wealth and prosperity. Worship on Fridays, Purnima, Diwali. Mantra: Om Shreem Mahalakshmiyei Namah. Offerings: lotus, sweets.",bestTime:"Fridays",type:"muhurat"},
  {name:"Saraswati",icon:"🎵",desc:"Goddess Saraswati — Goddess of knowledge and arts. Worship on Vasant Panchami, Wednesdays. Mantra: Om Aim Saraswatyai Namah. Offerings: white flowers, books.",bestTime:"Wednesdays",type:"muhurat"},
  {name:"Durga",icon:"🌺",desc:"Goddess Durga — Supreme warrior goddess, destroys evil. Navratri is Her 9-night festival. Mantra: Om Dum Durgayei Namah. Offerings: red flowers, betel.",bestTime:"Navratri",type:"muhurat"},
  {name:"Kali",icon:"⚫",desc:"Goddess Kali — Fierce form of Devi, destroyer of ego. Worship on Kali Puja (Diwali night). Mantra: Om Krim Kalikayai Namah. Tuesdays and Saturdays.",bestTime:"Tuesdays",type:"muhurat"},
  {name:"Hanuman",icon:"🐒",desc:"Lord Hanuman — Symbol of devotion, strength, and service. Worship on Tuesdays and Saturdays. Hanuman Chalisa is most powerful prayer. Offerings: sindoor, jasmine.",bestTime:"Tuesdays & Saturdays",type:"muhurat"},
  {name:"Radha",icon:"💛",desc:"Radha — Supreme devotee of Krishna, embodies divine love. Radhashtami is Her birth (Sep 2, 2026). Worship with yellow flowers and devotional songs.",bestTime:"Sep 2, 2026",type:"muhurat"},
  {name:"Krishna",icon:"🎺",desc:"Lord Krishna — Avatar of Vishnu, teacher of Bhagavad Gita. Janmashtami is His birth (Aug 16, 2026). Offer butter, tulsi, peacock feathers.",bestTime:"Aug 16, 2026",type:"muhurat"},
  {name:"Brahma",icon:"🌸",desc:"Lord Brahma — Creator of the universe. Brahma Muhurat is named after Him. Pushkar has the only prominent Brahma temple. Worship on Brahma Muhurat.",bestTime:"Brahma Muhurat",type:"muhurat"},
  {name:"Indra",icon:"⚡",desc:"Lord Indra — King of Devas, God of rain and thunder. Govardhan Puja celebrates Krishna overcoming Indra's storms.",bestTime:"Monsoon",type:"muhurat"},
  {name:"Surya",icon:"☀️",desc:"Sun God — Surya Arghya offered at sunrise. Mantra: Gayatri. Worship on Sundays, Chhath Puja, Makar Sankranti. Sunflower, red flowers as offerings.",bestTime:"Sunrise daily",type:"muhurat"},
  {name:"Kartikeya",icon:"🏹",desc:"Lord Kartikeya (Murugan/Skanda) — God of war, son of Shiva-Parvati. Worship on Skanda Sashti. Important in Tamil Nadu as Lord Murugan.",bestTime:"Sashti tithi",type:"muhurat"},
  {name:"Parvati",icon:"🌸",desc:"Goddess Parvati — Consort of Shiva, mother goddess. Hartalika Teej (Aug 22, 2026) is Her most important festival. Offers devotion for marital harmony.",bestTime:"Teej",type:"muhurat"},
  /* ── Sacred Texts ── */
  {name:"Bhagavad Gita",icon:"📖",desc:"Divine song — 700 verses of Lord Krishna's teachings to Arjuna on the battlefield of Kurukshetra. Covers dharma, karma, yoga, and moksha.",bestTime:"Daily study",type:"muhurat"},
  {name:"Ramayana",icon:"📜",desc:"Epic of Lord Rama — composed by Valmiki. Story of Rama's birth, exile, Sita's abduction, and victory over Ravana. Valmiki Jayanti: Oct 28, 2026.",bestTime:"Daily reading",type:"muhurat"},
  {name:"Mahabharata",icon:"⚔️",desc:"Greatest epic — 100,000 verses by Vyasa. Contains Bhagavad Gita, stories of Pandavas vs Kauravas. Teaches ethics and dharma.",bestTime:"Study anytime",type:"muhurat"},
  {name:"Vedas",icon:"📚",desc:"Four Vedas — Rigveda, Yajurveda, Samaveda, Atharvaveda. Most ancient scriptures of Hinduism, revealed to Rishis in deep meditation.",bestTime:"Morning study",type:"muhurat"},
  {name:"Upanishads",icon:"🧘",desc:"108 Upanishads — philosophical texts exploring Brahman (ultimate reality) and Atman (individual soul). Core of Vedanta philosophy.",bestTime:"Study anytime",type:"muhurat"},
  {name:"Puranas",icon:"📖",desc:"18 major Puranas — ancient texts containing stories of gods, cosmology, and spiritual teachings. Bhagavata Purana is most beloved.",bestTime:"Study anytime",type:"muhurat"},
  {name:"Bhagavata Purana",icon:"🐚",desc:"Srimad Bhagavatam — 12 books glorifying Lord Vishnu/Krishna. Culminates in life of Krishna. Daily reading cleanses the heart.",bestTime:"Daily",type:"muhurat"},
  {name:"Hanuman Chalisa",icon:"🐒",desc:"40 verses praising Hanuman by Tulsidas. Most recited Hindu prayer. Protects from evil, grants strength. Recite 11 or 108 times on Tuesdays.",bestTime:"Tuesdays",type:"muhurat"},
  {name:"Gayatri Mantra",icon:"☀️",desc:"Om Bhur Bhuvaḥ Svaḥ... — Supreme mantra of Sun and divine light. Recite 108 times at sunrise. Gives wisdom, removes darkness of ignorance.",bestTime:"Sunrise",type:"muhurat"},
  {name:"Vishnu Sahasranama",icon:"🐚",desc:"1000 names of Lord Vishnu — reciting grants immense merit. Best done on Ekadashi. Takes about 30 minutes to chant.",bestTime:"Ekadashi",type:"muhurat"},
  {name:"Shiva Panchakshara",icon:"🔱",desc:"Om Namah Shivaya — Five-syllable mantra of Lord Shiva. One of the most powerful mantras, removes suffering and grants moksha.",bestTime:"Mondays",type:"muhurat"},
  /* ── Spiritual Concepts ── */
  {name:"dharma",icon:"⚖️",desc:"Dharma — right conduct and duty. Personal dharma (svadharma) is unique to each soul. Living in dharma brings peace; violating it brings suffering.",bestTime:"Always",type:"muhurat"},
  {name:"karma",icon:"🔄",desc:"Karma — law of cause and effect. Every thought, word and action creates karma. Good deeds create good karma, leading to better rebirths and eventual liberation.",bestTime:"Always",type:"muhurat"},
  {name:"moksha",icon:"🕊️",desc:"Moksha — liberation from cycle of birth and death (samsara). Final goal of human life. Achieved through jnana, bhakti, or karma yoga.",bestTime:"Spiritual life",type:"muhurat"},
  {name:"samsara",icon:"🔄",desc:"Samsara — the endless cycle of birth, death, and rebirth. Driven by karma and desire. The soul (atman) transmigrates through various bodies until moksha.",bestTime:"Understanding",type:"muhurat"},
  {name:"ahimsa",icon:"🕊️",desc:"Ahimsa — non-violence in thought, word, and deed. First ethical principle (yama) in Yoga. Practiced through vegetarianism, compassion, and peaceful living.",bestTime:"Always",type:"muhurat"},
  {name:"yoga",icon:"🧘",desc:"Yoga — union with the divine. Four main paths: Bhakti (devotion), Jnana (knowledge), Karma (action), Raja (meditation). All lead to moksha.",bestTime:"Daily",type:"muhurat"},
  {name:"meditation",icon:"🧘",desc:"Dhyana — focused meditation, 7th limb of Patanjali's Ashtanga Yoga. Best practiced at Brahma Muhurat (4:53–5:38 AM) or Sandhya times.",bestTime:"Brahma Muhurat",type:"muhurat"},
  {name:"puja",icon:"🪔",desc:"Puja — act of worship offering flowers, incense, lamp, food, water to deity. Morning and evening puja is prescribed daily for householders.",bestTime:"Morning & Evening",type:"muhurat"},
  {name:"mantra",icon:"📿",desc:"Mantra — sacred sound vibration. Repeated chanting (japa) with mala beads purifies mind. 108 or multiples of 108 repetitions is traditional.",bestTime:"Daily practice",type:"muhurat"},
  {name:"panchang",icon:"📅",desc:"Panchang — Hindu almanac with 5 elements: Tithi (lunar day), Vara (weekday), Nakshatra (star), Yoga (luni-solar day), Karana (half-tithi).",bestTime:"Daily check",type:"muhurat"},
  /* ── Nakshatras ── */
  {name:"Rohini Nakshatra",icon:"🌟",desc:"Most auspicious nakshatra — ruled by Moon, deity Brahma. Symbol: cart/chariot. Excellent for marriage, business, travel, and all beginnings.",bestTime:"When active",type:"muhurat"},
  {name:"Ashwini Nakshatra",icon:"🐴",desc:"First nakshatra — ruled by Ketu, deity Ashwini Kumaras (divine healers). Excellent for medical treatments, new beginnings, and sports.",bestTime:"When active",type:"muhurat"},
  {name:"Pushya Nakshatra",icon:"🌸",desc:"Most auspicious for purchase and new beginnings except marriage. Ruled by Saturn, deity Brihaspati. Pushya Nakshatra in Guru Pushyamrut Yoga is most powerful.",bestTime:"When active",type:"muhurat"},
  {name:"Mrigashira Nakshatra",icon:"🦌",desc:"Gentle nakshatra of searching and inquiry — ruled by Mars, deity Soma (Moon). Auspicious for marriage, travel, and beginning new studies.",bestTime:"When active",type:"muhurat"},
  {name:"Hasta Nakshatra",icon:"✋",desc:"Nakshatra of hands and crafts — ruled by Moon, deity Savitar (Sun). Excellent for handcraft, healing, and practical skills.",bestTime:"When active",type:"muhurat"},
  /* ── Sacred Places ── */
  {name:"Varanasi",icon:"🏛️",desc:"Kashi — holiest city in Hinduism on the Ganges. Dying in Varanasi grants moksha. Famous for Ganga Aarti at Dashashwamedh Ghat at dusk.",bestTime:"Anytime",type:"muhurat"},
  {name:"Tirupati",icon:"⛰️",desc:"Tirumala Tirupati — most visited pilgrimage in world. Lord Venkateswara (Balaji) temple in Andhra Pradesh. Annual Brahmotsavam festival.",bestTime:"Anytime",type:"muhurat"},
  {name:"Vrindavan",icon:"🎺",desc:"Sacred birthplace of Radha-Krishna love stories. Major temples: Banke Bihari, ISKCON, Prem Mandir. Most sacred during Janmashtami.",bestTime:"Janmashtami",type:"muhurat"},
  {name:"Mathura",icon:"🐚",desc:"Lord Krishna's birthplace — one of Sapta Puri (7 sacred cities). Krishna Janma Bhoomi temple. Holi celebrations last several weeks here.",bestTime:"Janmashtami & Holi",type:"muhurat"},
  {name:"Haridwar",icon:"🏔️",desc:"Gateway to God — sacred city at Ganges' exit from Himalayas. Har ki Pauri Ganga Aarti is iconic. Kumbh Mela site every 12 years.",bestTime:"Anytime",type:"muhurat"},
  {name:"Prayagraj",icon:"🏺",desc:"Allahabad — confluence of Ganga, Yamuna, and mythical Saraswati. Most sacred Kumbh Mela site. Sangam bath cleanses all sins.",bestTime:"Kumbh & Magh Mela",type:"muhurat"},
  {name:"Ayodhya",icon:"🏹",desc:"Lord Rama's birthplace — one of Sapta Puri. Ram Mandir inaugurated Jan 22, 2024. Ram Navami (Mar 26, 2026) is the most important festival here.",bestTime:"Ram Navami",type:"muhurat"},
  {name:"Ganga river",icon:"🌊",desc:"Holy Ganges — most sacred river in Hinduism. Bathing cleanses sins. Ganga Dussehra (Jun 2026) is most auspicious for Ganga bath.",bestTime:"Ganga Dussehra",type:"muhurat"},
  {name:"Yamuna river",icon:"💙",desc:"Sacred river — beloved of Krishna. Bathing in Yamuna cleanses 7 generations. Most sacred during Yamuna Chhath and Mathura Holi.",bestTime:"Anytime",type:"muhurat"},
  /* ── Samskaras & Rituals ── */
  {name:"Samskaras",icon:"🙏",desc:"16 Hindu sacraments from conception to death: Garbhadhana, Pumsavana, Simanta, Jatakarma, Namakarana, Nishkramana, Annaprashana, Chudakarma, Karnavedha, Vidyarambha, Upanayana, Vedarambha, Keshanta, Samavartana, Vivaha, Antyesti.",bestTime:"Life events",type:"muhurat"},
  {name:"marriage muhurat",icon:"💍",desc:"Best marriage muhurats in 2026: Apr 22–27, May 1–3, Nov 25–Dec 10. Avoid Adhika Masa, Chaturmas (Jul–Oct), and inauspicious planetary periods.",bestTime:"2026 dates",type:"muhurat"},
  {name:"Griha Pravesh",icon:"🏠",desc:"House-warming ceremony — enter new home on auspicious muhurat. Avoid Mondays and inauspicious tithis. Best in Uttarayan (Jan–Jul). Good muhurats 2026: Jan–Mar, May.",bestTime:"Jan–Mar & May 2026",type:"muhurat"},
  {name:"Upanayana",icon:"📿",desc:"Sacred thread ceremony (Janeu) — initiation of Brahmin, Kshatriya, Vaishya boys. Marks beginning of Vedic studies.",bestTime:"Auspicious muhurat",type:"muhurat"},
  {name:"Annaprashana",icon:"🍚",desc:"First rice-feeding ceremony for infants — done around 6 months. An auspicious muhurat in a good nakshatra is chosen.",bestTime:"Baby's 6th month",type:"muhurat"},
  {name:"Shraddha",icon:"🌿",desc:"Ancestor worship ceremony — Pitru Paksha (16 days before Navratri) is most important. Tarpan, pind daan, and feeding Brahmins pleases ancestors.",bestTime:"Pitru Paksha",type:"muhurat"},
  /* ── Travel & Remedies ── */
  {name:"travel",icon:"✈️",desc:"Auspicious travel: Rohini, Mrigashira, Pushya, Hasta nakshatras are best. Amrit Kaal is ideal start time. Avoid Rahu Kaal, Yamaganda, and Amavasya for journeys.",bestTime:"Amrit Kaal",type:"muhurat"},
  {name:"business",icon:"💼",desc:"Business launch muhurat: Abhijit Muhurat and Amrit Kaal are best. Pushya Nakshatra is excellent for purchase. Avoid Rahu Kaal and eclipse days.",bestTime:"Abhijit Muhurat",type:"muhurat"},
  {name:"Shani remedy",icon:"⚫",desc:"Saturn (Shani) remedies: Fast on Saturdays, donate black sesame seeds, light mustard oil lamp, worship Lord Hanuman. Shani Jayanti 2026: May 18.",bestTime:"Saturdays",type:"muhurat"},
  {name:"Mangal dosha",icon:"🔴",desc:"Mars affliction in horoscope — remedies include Mangal Shanti puja, fasting on Tuesdays, chanting Hanuman Chalisa, and donating red items.",bestTime:"Tuesdays",type:"muhurat"},
  {name:"Pitru dosha",icon:"🌿",desc:"Ancestor curse — remedied by Shraddha, Pind Daan at Gaya or Prayagraj, feeding crows on Amavasya, and Narayan Nagbali puja.",bestTime:"Pitru Paksha",type:"muhurat"},
  {name:"Kaal Sarp dosha",icon:"🐍",desc:"All planets between Rahu-Ketu axis — remedied by Kaal Sarp Shanti puja at Trimbakeshwar, Ujjain, or Nashik. Worship Lord Shiva regularly.",bestTime:"Shravan month",type:"muhurat"},
];

function globalSearch(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  /* Split into meaningful words (length > 2) for multi-word matching */
  const words = q.split(/\s+/).filter(w=>w.length>2);
  const results = [];
  const seen = new Set();
  const add = (type, item, score) => {
    const key = type+":"+(item.id||item.name);
    if (!seen.has(key)) { seen.add(key); results.push({type,item,score}); }
    else {
      /* Boost existing score if this is a better match */
      const existing = results.find(r=>r.type===type&&(r.item.id||r.item.name)===(item.id||item.name));
      if(existing && score > existing.score) existing.score = score;
    }
  };
  /* Score helper: check exact phrase AND each individual word */
  const score = (fields, exactBonus=0) => {
    const text = fields.join(" ").toLowerCase();
    let best = 0;
    /* Exact phrase match */
    if(text.startsWith(q)) best=Math.max(best,12+exactBonus);
    else if(text.includes(q)) best=Math.max(best,8+exactBonus);
    /* Word-level: score by fraction of query words that match */
    if(words.length>1){
      const matchCount = words.filter(w=>text.includes(w)).length;
      if(matchCount===words.length) best=Math.max(best,7+exactBonus);
      else if(matchCount>0) best=Math.max(best,2*matchCount);
    } else if(words.length===1){
      if(text.includes(words[0])) best=Math.max(best,5);
    }
    return best;
  };
  FESTIVALS.forEach(f => {
    const s=score([f.name],4)+score([f.desc,f.vedic||"",f.region||"",f.howTo||""]);
    if(s>0) add("festival",f,s);
  });
  MANTRAS.forEach(m => {
    const s=score([m.name,m.deity],4)+score([m.meaning||"",m.benefits||"",m.cat||"",m.sanskrit||""]);
    if(s>0) add("mantra",m,s);
  });
  SACRED_DATES.forEach(sd => {
    const s=score([sd.name],2)+score([sd.desc||""]);
    if(s>0) add("sacred",sd,s);
  });
  RITUALS.forEach(r => {
    const s=score([r.name,r.deity||""],4)+score([r.benefits||"",r.subtitle||"",r.difficulty||""]);
    if(s>0) add("ritual",r,s);
  });
  MUHURAT_DATA.forEach(m => {
    const s=score([m.name],2)+score([m.desc||"",m.bestTime||""]);
    if(s>0) add("muhurat",m,s);
  });
  return results.sort((a,b)=>b.score-a.score).slice(0,40);
}

/* ══════════════════════════════════════════════════════
   SPEECH SYNTHESIS — Language-Aware Indian Voice Engine
   Mantra text selection by language:
     Hindi / Sanskrit / Marathi → Devanagari  (hi-IN / mr-IN)
     Tamil                      → Romanised    (ta-IN)
     Telugu                     → Romanised    (te-IN)
     English (default)          → Devanagari  (hi-IN)
   Voice preference per locale (best → fallback):
     hi-IN: Google हिन्दी > Lekha > Heera > Ravi > any hi-IN
     mr-IN: Google मराठी  > any mr-IN  → fallback hi-IN
     ta-IN: Google தமிழ்  > any ta-IN
     te-IN: Google తెలుగు > any te-IN
     en-IN: Rishi > Veena > Google en-IN > any en-IN
══════════════════════════════════════════════════════ */
let currentUtterance = null;
let _cachedVoices = [];

function _loadVoices() {
  const v = window.speechSynthesis?.getVoices() || [];
  if (v.length) _cachedVoices = v;
}
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.addEventListener("voiceschanged", _loadVoices);
}

/* Voice preference tables keyed by BCP-47 locale */
const VOICE_PREFS = {
  "hi-IN": [
    v => /google/i.test(v.name) && /^hi/i.test(v.lang),
    v => /lekha/i.test(v.name),
    v => /heera/i.test(v.name),
    v => /ravi/i.test(v.name),
    v => /kalpana/i.test(v.name),
    v => v.lang === "hi-IN",
    v => v.lang.startsWith("hi"),
  ],
  "mr-IN": [
    v => /google/i.test(v.name) && /^mr/i.test(v.lang),
    v => v.lang === "mr-IN",
    v => v.lang.startsWith("mr"),
    v => v.lang === "hi-IN",          // fallback to Hindi
  ],
  "ta-IN": [
    v => /google/i.test(v.name) && /^ta/i.test(v.lang),
    v => v.lang === "ta-IN",
    v => v.lang.startsWith("ta"),
  ],
  "te-IN": [
    v => /google/i.test(v.name) && /^te/i.test(v.lang),
    v => v.lang === "te-IN",
    v => v.lang.startsWith("te"),
  ],
  "en-IN": [
    v => /rishi/i.test(v.name),
    v => /veena/i.test(v.name),
    v => /google/i.test(v.name) && v.lang === "en-IN",
    v => v.lang === "en-IN",
  ],
};

function _pickVoice(locale) {
  if (!_cachedVoices.length) _loadVoices();
  const voices = _cachedVoices;
  const tests = VOICE_PREFS[locale] || VOICE_PREFS["hi-IN"];
  for (const t of tests) { const f = voices.find(t); if (f) return f; }
  return null;
}

/* App language → TTS config
   text: "devnagari" | "sanskrit"
   locale: BCP-47 locale string */
const LANG_TTS = {
  "English":  { locale:"en-IN", text:"romanized", requireNative:false },
  "Hindi":    { locale:"hi-IN", text:"devnagari", requireNative:true },
  "Sanskrit": { locale:"hi-IN", text:"devnagari", requireNative:true },
  "Marathi":  { locale:"mr-IN", text:"devnagari", requireNative:true },
  "Tamil":    { locale:"ta-IN", text:"romanized", requireNative:true },
  "Telugu":   { locale:"te-IN", text:"romanized", requireNative:true },
};

function getMantraDisplayText(m, appLang="English"){
  const cfg = LANG_TTS[appLang] || LANG_TTS.English;
  return cfg.text === "devnagari" ? m.devnagari : m.sanskrit;
}

function getAudioStatusLabel(appLang="English"){
  const cfg = LANG_TTS[appLang] || LANG_TTS.English;
  return cfg.requireNative ? `${appLang} native voice required` : `${appLang} voice`;
}

/* Core speaker — used by all speak functions.
   Handles:
   • Chrome "stuck synthesis" bug → resume() before cancel+speak
   • Async voice loading → waits for voiceschanged if voices not ready
   • 150 ms settle delay after cancel before speaking
   • onerror → always calls onEnd so UI state resets cleanly           */
function _doSpeak({text, locale, rate=0.7, pitch=0.85, onEnd}) {
  if (!window.speechSynthesis) return false;
  const build = () => {
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const utter = new SpeechSynthesisUtterance(text);
      const voice = _pickVoice(locale);
      if (voice) utter.voice = voice;
      utter.lang = locale;
      utter.rate  = rate;
      utter.pitch = pitch;
      utter.volume = 1;
      const done = () => { currentUtterance = null; if (onEnd) onEnd(); };
      utter.onend   = done;
      utter.onerror = done;      // reset UI even on error
      currentUtterance = utter;
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      window.speechSynthesis.speak(utter);
    }, 150);
  };
  // Ensure voices are loaded before selecting
  const v = window.speechSynthesis.getVoices();
  if (v.length) { _cachedVoices = v; build(); }
  else {
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      _cachedVoices = window.speechSynthesis.getVoices() || [];
      build();
    }, { once: true });
    setTimeout(build, 600);  // fallback if event never fires
  }
  return true;
}

/* speakMantra — language-aware, slow devotional pace
   Strategy:
   1. Try the locale's preferred Indian voice
   2. If no Indian voice is installed → use romanized text + best available voice
      (romanized Sanskrit is phonetically readable by any TTS engine)
*/
function _hasIndianVoice(locale) {
  const voices = window.speechSynthesis?.getVoices() || _cachedVoices;
  if (!voices.length) return false;
  const lang2 = locale.split("-")[0]; // "hi" from "hi-IN"
  return voices.some(v => v.lang === locale || v.lang.startsWith(lang2+"-IN") || v.lang.startsWith(lang2));
}

/* Best available English voice — prefers Google/premium/neural for clarity */
function _bestEnglishVoice() {
  const voices = _cachedVoices.length ? _cachedVoices : (window.speechSynthesis?.getVoices()||[]);
  const en = voices.filter(v => v.lang.startsWith("en"));
  return (
    en.find(v => /google.*us/i.test(v.name)) ||
    en.find(v => /google/i.test(v.name)) ||
    en.find(v => /premium|enhanced|neural|natural/i.test(v.name)) ||
    en.find(v => v.lang === "en-US") ||
    en.find(v => v.lang === "en-GB") ||
    en[0] || null
  );
}

function speakMantra(devnagari, romanized, onEnd, appLang="English") {
  if (!window.speechSynthesis) return { ok:false, reason:"unsupported" };
  const cfg = LANG_TTS[appLang] || LANG_TTS.English;
  const hasVoice = _hasIndianVoice(cfg.locale);
  const text = cfg.text === "devnagari" ? devnagari : romanized;

  if (cfg.requireNative && !hasVoice) {
    return { ok:false, reason:"native-voice-unavailable", locale:cfg.locale };
  }

  if (hasVoice) {
    _doSpeak({ text, locale: cfg.locale, rate: 0.78, pitch: 0.9, onEnd });
    return { ok:true, locale:cfg.locale };
  }

  const bestEn = _bestEnglishVoice();
  if (!bestEn) return { ok:false, reason:"native-voice-unavailable", locale:cfg.locale };
  const locale = bestEn?.lang || "en-US";
  const utter = new SpeechSynthesisUtterance(text);
  if (bestEn) utter.voice = bestEn;
  utter.lang   = locale;
  utter.rate   = 0.72;
  utter.pitch  = 0.88;
  utter.volume = 1;
  let done = () => { onEnd?.(); done = ()=>{}; };
  utter.onend   = done;
  utter.onerror = done;
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();
  window.speechSynthesis.cancel();
  setTimeout(() => window.speechSynthesis.speak(utter), 150);
  return { ok:true, locale };
}

/* speakStep — ritual step instructions, clear confident delivery */
function speakStep(text, onEnd, appLang="English") {
  const cfg = LANG_TTS[appLang] || LANG_TTS.English;
  if (_hasIndianVoice(cfg.locale)) {
    return _doSpeak({ text, locale: cfg.locale, rate: 0.90, pitch: 1.0, onEnd });
  }
  /* Fallback: best English voice, natural conversational pace */
  const bestEn = _bestEnglishVoice();
  const utter = new SpeechSynthesisUtterance(text);
  if (bestEn) utter.voice = bestEn;
  utter.lang   = bestEn?.lang || "en-US";
  utter.rate   = 0.92;
  utter.pitch  = 1.0;
  utter.volume = 1;
  let done = () => { onEnd?.(); done = ()=>{}; };
  utter.onend   = done;
  utter.onerror = done;
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();
  window.speechSynthesis.cancel();
  setTimeout(() => window.speechSynthesis.speak(utter), 150);
  return true;
}

/* Legacy alias */
function speakText(text, onEnd) { return speakMantra(text, text, onEnd, "English"); }

function stopSpeech() {
  if (window.speechSynthesis) { window.speechSynthesis.cancel(); }
  currentUtterance = null;
}

/* ══════════════════════════════════════════════════════
   RITUALS
══════════════════════════════════════════════════════ */
const RITUALS = [
  {id:1,name:"Surya Arghya",subtitle:"Morning Sun Offering",icon:"☀️",duration:"10 min",deity:"Surya Dev",
   benefits:"Health, clarity, energy",difficulty:"Beginner",todayNote:"Recommended — Rohini Nakshatra",
   steps:[
     {title:"Preparation",dur:60,text:"Fill a copper lota with clean water. Add red flowers or akshata (rice+turmeric). Stand facing East."},
     {title:"Sankalpa",dur:30,text:"Hold the lota in both hands. Resolve: I offer this water to Surya Dev for health and clarity."},
     {title:"Pour Arghya",dur:120,text:"Slowly pour water in a thin stream toward the rising sun. Visualize golden solar energy entering your body."},
     {title:"12 Names of Surya",dur:180,text:"Chant: Om Mitraya, Om Ravaye, Om Suryaya, Om Bhanave, Om Khagaya, Om Pushne, Om Hiranyagarbhaya, Om Marichaye, Om Adityaya, Om Savitre, Om Arkaya, Om Bhaskaraya Namah."},
     {title:"Gayatri Mantra",dur:120,text:"Recite Gayatri Mantra 3, 11, or 108 times: Om Bhur Bhuva Swaha, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat."},
     {title:"Pranaam",dur:30,text:"Join palms facing the sun. Bow your head. Say Om Suryaya Namah three times."},
   ]},
  {id:2,name:"Ganesh Puja",subtitle:"Obstacle-Remover Ritual",icon:"🐘",duration:"20 min",deity:"Lord Ganesha",
   benefits:"Success, wisdom, remove obstacles",difficulty:"Beginner",todayNote:"Auspicious before any new task",
   steps:[
     {title:"Setup Sacred Space",dur:120,text:"Clean altar. Place Ganesha idol on red/yellow cloth. Prepare: red hibiscus, durva grass, modak, coconut, camphor, incense, ghee lamp."},
     {title:"Purification",dur:60,text:"Sip water 3 times: Om Achyutaya Namah, Om Anantaya Namah, Om Govindaya Namah. Sprinkle water on offerings."},
     {title:"Dhyana",dur:90,text:"Close eyes. Visualize Lord Ganesha with elephant head, four arms holding lotus, axe, rope, and modak."},
     {title:"Avahana",dur:60,text:"Ring the bell. Om Gan Ganapataye Namah. Hey Vighnharta, be present here. Place akshata on the idol."},
     {title:"16 Offerings (Shodashopachara)",dur:300,text:"Offer water for feet, hands, face, then panchamrita bath (milk, curd, ghee, honey, sugar), clothes, sandalwood, flowers, incense, lamp, food, betel, 3 circumambulations, pranaam."},
     {title:"Aarti and Visarjan",dur:120,text:"Sing Jai Ganesh Aarti with ghee lamp. Camphor aarti last. Pray: Bless me Lord. Distribute modak as prasad."},
   ]},
  {id:3,name:"Lakshmi Puja",subtitle:"Prosperity and Abundance Ritual",icon:"🪷",duration:"25 min",deity:"Goddess Lakshmi",
   benefits:"Wealth, prosperity, harmony",difficulty:"Intermediate",todayNote:"Panchami Tithi — favorable for Lakshmi",
   steps:[
     {title:"Preparation",dur:90,text:"Best on Fridays or Panchami. Clean home. Wear yellow or white. Place Lakshmi image. Draw lotus with kumkum. Set up kalash."},
     {title:"Invocation",dur:60,text:"Ring bell 3 times. Om Shreem Hreem Kleem Mahalakshmyai Namah. Light the lamp."},
     {title:"Panchamrita Abhishek",dur:180,text:"Bathe Lakshmi idol with Milk, Curd, Ghee, Honey, Sugar. After each: Om Shreem Mahalakshmyai Namah."},
     {title:"Adornment",dur:120,text:"Gently dry and dress the deity. Apply turmeric and kumkum. Offer lotus flowers, marigolds, jasmine."},
     {title:"Sri Suktam",dur:300,text:"Recite Sri Suktam (16 verses) or chant Om Shreem Mahalakshmyai Namah 108 times with a mala."},
     {title:"Aarti and Prasad",dur:120,text:"Perform Lakshmi Aarti with ghee lamp (5 wicks). Circumambulate 3 times. Distribute kheer as prasad."},
   ]},
  {id:4,name:"Hanuman Puja",subtitle:"Strength and Protection Ritual",icon:"🐒",duration:"18 min",deity:"Lord Hanuman",
   benefits:"Courage, focus, protection from fear",difficulty:"Beginner",todayNote:"Ideal on Tuesdays, Saturdays, and Hanuman Jayanti season",
   steps:[
     {title:"Prepare the altar",dur:90,text:"Place Hanuman image or idol with sindoor, jasmine oil, red flowers, betel leaf, and jaggery or boondi as prasad."},
     {title:"Invoke Hanuman",dur:60,text:"Light a diya and incense. Chant Om Hanumate Namah 11 times while focusing on courage and seva."},
     {title:"Offer sindoor and flowers",dur:120,text:"Apply a small amount of sindoor mixed with jasmine oil and offer red flowers with devotion."},
     {title:"Read Hanuman Chalisa",dur:300,text:"Recite Hanuman Chalisa slowly and clearly. If short on time, chant Bajrang Baan or Om Hanumate Namah 108 times."},
     {title:"Prayers for protection",dur:90,text:"Pray for strength, clear thinking, and removal of fear, negativity, and inner weakness."},
     {title:"Aarti and prasad",dur:90,text:"Offer aarti, bow, and distribute boondi or jaggery as prasad."},
   ]},
  {id:5,name:"Shiva Abhishek",subtitle:"Mondays, Pradosh, and Maha Shivaratri Ritual",icon:"🕉️",duration:"22 min",deity:"Lord Shiva",
   benefits:"Peace, purification, grace, inner stillness",difficulty:"Intermediate",todayNote:"Especially auspicious on Mondays, Pradosh, and Shivaratri",
   steps:[
     {title:"Prepare the Shivling",dur:90,text:"Arrange water, milk, bilva leaves, white flowers, sandal paste, incense, and a lamp before the Shivling or Shiva image."},
     {title:"Sankalpa",dur:45,text:"State your intention for peace, purification, and Shiva kripa before beginning the abhishek."},
     {title:"Abhishek",dur:210,text:"Offer water, then milk, then water again over the Shivling while chanting Om Namah Shivaya continuously."},
     {title:"Bilva offering",dur:120,text:"Offer bilva leaves one by one, keeping the smooth side upward, with Om Namah Shivaya or Maha Mrityunjaya mantra."},
     {title:"Mantra japa",dur:240,text:"Chant Om Namah Shivaya 108 times or recite the Maha Mrityunjaya Mantra 11 times."},
     {title:"Aarti and silence",dur:90,text:"Perform aarti and sit in silent meditation for a minute before concluding."},
   ]},
  {id:6,name:"Satyanarayana Puja",subtitle:"Full Moon and Family Gratitude Ritual",icon:"📖",duration:"35 min",deity:"Lord Vishnu",
   benefits:"Family harmony, gratitude, fulfillment, blessings",difficulty:"Intermediate",todayNote:"Commonly observed on Purnima and special family milestones",
   steps:[
     {title:"Set the altar",dur:120,text:"Place Satyanarayana or Vishnu image, kalash, fruits, tulsi, panchamrit, banana leaves, and prasadam ingredients like sheera or sooji halwa."},
     {title:"Ganesh invocation",dur:60,text:"Begin with a brief Ganesh prayer to remove obstacles before the main puja."},
     {title:"Kalash and Vishnu avahana",dur:120,text:"Worship the kalash and invoke Lord Satyanarayana with Om Namo Bhagavate Vasudevaya."},
     {title:"Offerings and archana",dur:240,text:"Offer flowers, tulsi leaves, fruits, incense, lamp, and naivedya while chanting Vishnu names."},
     {title:"Katha reading",dur:420,text:"Read or listen to the Satyanarayana Katha and reflect on truthfulness, humility, and gratitude."},
     {title:"Aarti and prasadam",dur:120,text:"Perform Vishnu aarti and distribute prasadam to all present."},
   ]},
  {id:7,name:"Navratri Devi Puja",subtitle:"Nine-Night Shakti Worship",icon:"🌺",duration:"24 min",deity:"Divine Mother",
   benefits:"Shakti, protection, devotion, inner renewal",difficulty:"Beginner",todayNote:"Use during Chaitra or Sharad Navratri, one form of Devi each day",
   steps:[
     {title:"Create the Devi altar",dur:120,text:"Set a clean altar with Devi image, red cloth, lamp, flowers, fruits, and if desired a ghata or kalash स्थापना."},
     {title:"Daily sankalpa",dur:45,text:"Invoke the day’s Devi form and state your sankalpa for protection, clarity, and devotion."},
     {title:"Lamp and incense",dur:60,text:"Light the akhand or daily diya and incense. Offer kumkum, haldi, and flowers."},
     {title:"Durga mantra or Saptashloki",dur:300,text:"Recite Ya Devi Sarva Bhuteshu, Durga Chalisa, or Saptashloki Durga according to your tradition and time."},
     {title:"Naivedya and gratitude",dur:90,text:"Offer fruit, milk, or sattvic bhog. Pray for strength and compassion."},
     {title:"Aarti",dur:90,text:"Perform Devi aarti and conclude with pranam."},
   ]},
];

const INIT_HABITS = [
  {id:1,name:"Morning Meditation",icon:"🧘",streak:0,goal:21,category:"Meditation",color:"#8855FF",logs:Array(12).fill(0)},
  {id:2,name:"Mantra Chanting",icon:"📿",streak:0,goal:21,category:"Devotion",color:"#FF7040",logs:Array(12).fill(0)},
  {id:3,name:"Ekadashi Fast",icon:"🌙",streak:0,goal:12,category:"Fasting",color:"#F02890",logs:Array(12).fill(0)},
  {id:4,name:"Yoga Practice",icon:"🌸",streak:0,goal:30,category:"Yoga",color:"#3DDC84",logs:Array(12).fill(0)},
  {id:5,name:"Scripture Reading",icon:"📖",streak:0,goal:30,category:"Study",color:"#FFC040",logs:Array(12).fill(0)},
  {id:6,name:"Evening Aarti",icon:"🪔",streak:0,goal:30,category:"Devotion",color:"#FF7040",logs:Array(12).fill(0)},
];

const NAKSHATRAS_LIST = [
  {name:"Ashwini",lord:"Ketu",deity:"Ashwini Kumaras",symbol:"Horse head",qualities:"Quick, healing, pioneering",element:"Fire",stone:"Cat's eye"},
  {name:"Bharani",lord:"Venus",deity:"Yama",symbol:"Yoni",qualities:"Transformative, creative, intense",element:"Earth",stone:"Diamond"},
  {name:"Krittika",lord:"Sun",deity:"Agni",symbol:"Razor / flame",qualities:"Disciplined, fierce, purifying",element:"Fire",stone:"Ruby"},
  {name:"Rohini",lord:"Moon",deity:"Brahma",symbol:"Ox cart",qualities:"Fertile, creative, magnetic, abundant",element:"Earth",stone:"Pearl"},
  {name:"Mrigashira",lord:"Mars",deity:"Soma",symbol:"Deer head",qualities:"Gentle, curious, searching",element:"Earth / Air",stone:"Coral"},
  {name:"Ardra",lord:"Rahu",deity:"Rudra",symbol:"Teardrop",qualities:"Transformative, sharp, stormy",element:"Water",stone:"Hessonite"},
  {name:"Punarvasu",lord:"Jupiter",deity:"Aditi",symbol:"Quiver",qualities:"Restoration, nurturing, abundant",element:"Water / Air",stone:"Yellow sapphire"},
  {name:"Pushya",lord:"Saturn",deity:"Brihaspati",symbol:"Flower",qualities:"Nourishing, stable, most auspicious",element:"Water",stone:"Blue sapphire"},
  {name:"Ashlesha",lord:"Mercury",deity:"Nagas",symbol:"Serpent coil",qualities:"Perceptive, magnetic, mystical",element:"Water",stone:"Emerald"},
  {name:"Magha",lord:"Ketu",deity:"Pitris",symbol:"Throne",qualities:"Regal, ancestral, powerful",element:"Fire",stone:"Cat's eye"},
  {name:"Purva Phalguni",lord:"Venus",deity:"Bhaga",symbol:"Fig tree",qualities:"Playful, luxurious, creative",element:"Fire",stone:"Diamond"},
  {name:"Uttara Phalguni",lord:"Sun",deity:"Aryaman",symbol:"Bed",qualities:"Generous, intellectual, reliable",element:"Fire",stone:"Ruby"},
  {name:"Hasta",lord:"Moon",deity:"Savitar",symbol:"Hand",qualities:"Skilled, clever, dexterous",element:"Earth",stone:"Pearl"},
  {name:"Chitra",lord:"Mars",deity:"Vishwakarma",symbol:"Pearl / gem",qualities:"Artistic, brilliant, attractive",element:"Fire",stone:"Coral"},
  {name:"Swati",lord:"Rahu",deity:"Vayu",symbol:"Sword",qualities:"Independent, flexible, diplomatic",element:"Air",stone:"Hessonite"},
  {name:"Vishakha",lord:"Jupiter",deity:"Indra and Agni",symbol:"Arch",qualities:"Ambitious, focused, competitive",element:"Fire",stone:"Yellow sapphire"},
  {name:"Anuradha",lord:"Saturn",deity:"Mitra",symbol:"Lotus",qualities:"Devoted, friendly, spiritual",element:"Water",stone:"Blue sapphire"},
  {name:"Jyeshtha",lord:"Mercury",deity:"Indra",symbol:"Earring",qualities:"Protective, intense, wise elder",element:"Water / Air",stone:"Emerald"},
  {name:"Mula",lord:"Ketu",deity:"Nirriti",symbol:"Root",qualities:"Investigative, transformative",element:"Fire",stone:"Cat's eye"},
  {name:"Purva Ashadha",lord:"Venus",deity:"Apah",symbol:"Fan",qualities:"Invincible, proud, idealistic",element:"Fire / Water",stone:"Diamond"},
  {name:"Uttara Ashadha",lord:"Sun",deity:"Vishvadevas",symbol:"Elephant tusk",qualities:"Righteous, victorious, enduring",element:"Earth / Fire",stone:"Ruby"},
  {name:"Shravana",lord:"Moon",deity:"Vishnu",symbol:"Ear / footprint",qualities:"Listening, learning, connecting",element:"Air",stone:"Pearl"},
  {name:"Dhanishtha",lord:"Mars",deity:"Eight Vasus",symbol:"Drum",qualities:"Wealthy, musical, ambitious",element:"Ether",stone:"Coral"},
  {name:"Shatabhisha",lord:"Rahu",deity:"Varuna",symbol:"Empty circle",qualities:"Healer, secretive, philosophical",element:"Ether",stone:"Hessonite"},
  {name:"Purva Bhadrapada",lord:"Jupiter",deity:"Ajaikapad",symbol:"Two faces",qualities:"Passionate, idealistic, ascetic",element:"Ether",stone:"Yellow sapphire"},
  {name:"Uttara Bhadrapada",lord:"Saturn",deity:"Ahir Budhnya",symbol:"Twins",qualities:"Wise, deep, compassionate",element:"Ether",stone:"Blue sapphire"},
  {name:"Revati",lord:"Mercury",deity:"Pusha",symbol:"Fish",qualities:"Nurturing, completing, spiritual",element:"Ether",stone:"Emerald"},
];
function getBirthNakshatra(dateStr) {
  if (!dateStr) return null;
  const d=new Date(dateStr), start=new Date("1900-01-01");
  const days=Math.floor((d-start)/86400000);
  return NAKSHATRAS_LIST[((days%27)+27)%27];
}

const VERSES = [
  {devnagari:"तमसो मा ज्योतिर्गमय",roman:"Tamaso Ma Jyotirgamaya",t:"Lead me from darkness to light",src:"Brihadaranyaka Upanishad"},
  {devnagari:"योगः कर्मसु कौशलम्",roman:"Yogah Karmasu Kaushalam",t:"Yoga is excellence in action",src:"Bhagavad Gita 2.50"},
  {devnagari:"सर्वे भवन्तु सुखिनः",roman:"Sarve Bhavantu Sukhinah",t:"May all beings be happy",src:"Brihadaranyaka Upanishad"},
  {devnagari:"अहं ब्रह्मास्मि",roman:"Aham Brahmasmi",t:"I am Brahman, the infinite consciousness",src:"Brihadaranyaka Upanishad"},
  {devnagari:"वसुधैव कुटुम्बकम्",roman:"Vasudhaiva Kutumbakam",t:"The whole world is one family",src:"Maha Upanishad"},
  {devnagari:"सत्यमेव जयते",roman:"Satyameva Jayate",t:"Truth alone triumphs",src:"Mundaka Upanishad"},
  {devnagari:"चित्तं प्रसादयेत्",roman:"Chittam Prasadayet",t:"Purify and brighten the mind",src:"Yoga Sutras"},
];

const AI_KB = [
  /* ── TODAY / DAILY ── */
  {keys:["today","daily","guidance","what should i do","recommend","suggest"],
   ans:"**Your Vedantic Guidance — Today**\n\n**Chaitra Shukla Panchami · Rohini Nakshatra**\n\n🌅 Dawn (4:53–5:38 AM): Brahma Muhurat — best for meditation\n☀️ Morning (6:24–10:23 AM): Surya Arghya, start new ventures\n⭐ Noon (12:01–12:50 PM): Abhijit Muhurat — major decisions\n⚠️ Afternoon (3–4:30 PM): Rahu Kaal — avoid important work\n🌙 Evening (4:30–6:41 PM): Yoga, scripture, devotional singing\n🪔 Night: Aarti, mantra japa, Bhagavad Gita reading"},
  /* ── MUHURATS ── */
  {keys:["muhurat","auspicious time","best time","when should","good time","shubh"],
   ans:"**Daily Muhurats (General)**\n\n✅ **Brahma Muhurat**: 1:36 hrs before sunrise — best for meditation, spiritual practice\n✅ **Amrit Kaal**: Varies daily — excellent for all auspicious work\n✅ **Abhijit Muhurat**: Near solar noon — most powerful for decisions, beginnings\n\n⛔ **Rahu Kaal**: Avoid important tasks (day-specific timing)\n⛔ **Gulika Kaal**: Moderately inauspicious\n⛔ **Yamaganda**: Avoid starting new projects\n\nFor tomorrow or any future date, ask me: 'muhurat for April 15' or 'good day in June 2026'"},
  /* ── TRAVEL ── */
  {keys:["travel","journey","trip","drive","flight","yatra"],
   ans:"**Travel Vedic Guidance**\n\n**Best nakshatras for travel:** Rohini, Ashwini, Mrigashira, Pushya, Hasta, Swati, Anuradha, Shravana, Revati\n\n**Best days:** Wednesday (Mercury), Thursday (Jupiter)\n**Avoid:** Tuesday (Mars — accidents), Saturday (Saturn)\n\n**Pre-travel ritual:**\n1. Pray to Lord Ganesha\n2. Eat curd with sugar\n3. Step out right foot first\n4. Avoid Rahu Kaal departure\n\n**Avoid:** Amavasya, Bhadra, inauspicious yogas"},
  /* ── FASTING ── */
  {keys:["fast","fasting","vrat","upvas","ekadashi","nirjala","eat","food"],
   ans:"**Vedic Fasting Guide**\n\n**Ekadashi** (11th tithi, twice/month): Most important fast — destroys sins\n- Allowed: Fruits, milk, sabudana, sendha namak, nuts, potatoes\n- Avoid: Grains, pulses, onion, garlic, meat, alcohol\n\n**Pradosh Vrat** (13th tithi): For Lord Shiva\n**Purnima**: Full moon fast — charity and worship\n**Mondays**: For Lord Shiva\n**Tuesdays**: For Hanuman / Mars remedy\n**Fridays**: For Goddess Lakshmi\n\n**2026 Upcoming Ekadashis:**\n- Kamada Ekadashi: Apr 6\n- Mohini Ekadashi: May 6\n- Nirjala Ekadashi: Jun 5 (no water — most powerful)\n- Devshayani Ekadashi: Jul 6\n- Parsva Ekadashi: Aug 4"},
  /* ── MARRIAGE MUHURAT ── */
  {keys:["marriage","wedding","vivah","shaadi","shadi","engagement"],
   ans:"**Marriage Muhurat 2026**\n\n✅ **Best Muhurat Periods:**\n- **Apr 22–27**: Strong planetary alignment, Jupiter in Taurus\n- **May 1–3**: Akshaya Tritiya period — most auspicious\n- **May 15–25**: Excellent for weddings\n- **Nov 25 – Dec 10**: Best muhurat of 2026\n- **Dec 15–31**: Also favorable\n\n⛔ **Avoid:**\n- Adhik Maas (extra month) — inauspicious for weddings\n- Bhadra periods\n- Pitra Paksha (Sep 17 – Oct 2, 2026)\n\n**For exact muhurat:** Consult a Jyotishi with birth charts of both."},
  /* ── JANUARY ── */
  {keys:["january","jan"],
   ans:"**January 2026 Vedic Calendar**\n\n☀️ Uttarayan begins — Sun moves northward\n\n🎪 **Key Festivals:**\n- Makar Sankranti: Jan 14 ☀️ (Sun enters Capricorn — kite flying, sesame sweets)\n- Pongal: Jan 14–17 🌾 (Tamil harvest festival)\n- Subhakrit Samvatsara begins\n\n🔱 **Fasting Days:**\n- Pradosh Vrat: Jan 10, Jan 25\n- Ekadashi (Saphala): Jan 6\n- Ekadashi (Pausha Putrada): Jan 21\n- Purnima: Jan 13\n- Amavasya: Jan 29\n\n⭐ **Best days for new ventures:** Jan 14–28 (Uttarayan period — excellent)\n\n**Griha Pravesh muhurat:** Jan 14–31 — highly auspicious for moving into new home."},
  /* ── FEBRUARY ── */
  {keys:["february","feb"],
   ans:"**February 2026 Vedic Calendar**\n\n🌸 Vasant (Spring) approaches\n\n🎪 **Key Festivals:**\n- Vasant Panchami: Feb 2 🌼 (Saraswati Puja — wear yellow, begin studies)\n- Maha Shivaratri: Feb 18 🔱 (Greatest Shiva festival — all-night vigil, fast)\n\n🔱 **Fasting Days:**\n- Ekadashi (Jaya): Feb 5\n- Ekadashi (Vijaya): Feb 19\n- Pradosh Vrat: Jan 9, Feb 23\n- Purnima: Feb 12\n- Amavasya: Feb 28\n\n⭐ **Maha Shivaratri (Feb 18):** Fast all day. Visit Shiva temple. Offer milk, bilva leaves. Stay awake all night chanting Om Namah Shivaya. Most powerful Shiva worship day of the year."},
  /* ── MARCH ── */
  {keys:["march","mar"],
   ans:"**March 2026 Vedic Calendar**\n\n🌺 Spring in full bloom — Vasant Ritu\n\n🎪 **Key Festivals:**\n- Holika Dahan: Mar 3 🔥 (bonfire eve of Holi)\n- Holi: Mar 4 🎨 (Festival of Colors — celebrates Radha-Krishna love)\n- Chaitra Navratri: Mar 21–30 🕉️ (9 nights of Goddess Durga)\n\n🔱 **Fasting Days:**\n- Ekadashi (Amalaki): Mar 7\n- Ekadashi (Papamochani): Mar 21\n- Pradosh Vrat: Mar 10, Mar 25\n- Purnima: Mar 14 (Holi Purnima)\n- Amavasya: Mar 29\n\n⭐ **Holi (Mar 4):** Play colors with family. Light Holika bonfire. Drink thandai. Celebrate spring, forgiveness, and divine love."},
  /* ── APRIL ── */
  {keys:["april","apr"],
   ans:"**April 2026 Vedic Calendar**\n\n🌸 **Key Festivals:**\n- Ram Navami: Apr 5 (Lord Rama's birthday — fast, puja)\n- Hanuman Jayanti: Apr 12 (Purnima — Sundarkand path)\n- Akshaya Tritiya: Apr 29 (Most auspicious day of year!)\n\n🔱 **Fasting Days:**\n- Pradosh Vrat: Apr 4, Apr 19\n- Ekadashi (Kamada): Apr 6\n- Purnima: Apr 12\n- Amavasya: Apr 27\n\n⭐ **Best days for new ventures:** Apr 5, 12, 22–27, 29\n\n**Akshaya Tritiya (Apr 19):** Anything started is blessed forever — ideal for gold purchase, new business, and charity."},
  /* ── MAY ── */
  {keys:["may"],
   ans:"**May 2026 Vedic Calendar**\n\n🌺 **Key Festivals:**\n- Buddha Purnima (Vesak): May 12\n\n🔱 **Fasting Days:**\n- Ekadashi (Mohini): May 6\n- Pradosh Vrat: May 4, May 19\n- Purnima: May 12\n- Amavasya: May 26\n\n⭐ **Auspicious:** May 1–3 (post-Akshaya Tritiya glow), May 12 (Buddha Purnima)\n\n**Best muhurat days:** May 1–3, 15–25 for marriages and new ventures."},
  /* ── JUNE ── */
  {keys:["june","jun"],
   ans:"**June 2026 Vedic Calendar**\n\n☀️ Summer — Sun in Gemini/Cancer\n\n🎪 **Key:**\n- Rath Yatra (Jagannath): Jun 26 (massive chariot festival in Puri)\n- Nirjala Ekadashi: Jun 5 (hardest fast — no water, most merit)\n\n🔱 **Fasting Days:**\n- Nirjala Ekadashi: Jun 5\n- Pradosh: Jun 3, Jun 18\n- Purnima: Jun 11\n- Amavasya: Jun 25\n\nGrishma Ritu (Summer) — good for Surya worship, river dips."},
  /* ── JULY ── */
  {keys:["july","jul"],
   ans:"**July 2026 Vedic Calendar**\n\n🌧️ Monsoon begins — Varsha Ritu\n\n🎪 **Key Festivals:**\n- Guru Purnima: Jul 10 (honour your teacher/guru)\n- Devshayani Ekadashi: Jul 6 (Vishnu sleeps — 4 months Chaturmas begins)\n\n🔱 **Important:** Jul 6 starts **Chaturmas** — avoid major auspicious events\n(marriage, griha pravesh, sacred thread)\n\n⭐ **Best:** Guru Purnima Jul 10 — visit guru, donate books, study Vedas"},
  /* ── AUGUST ── */
  {keys:["august","aug"],
   ans:"**August 2026 Vedic Calendar**\n\n🎭 **Major Festivals:**\n- Nag Panchami: Aug 7 (worship serpent deities)\n- Raksha Bandhan: Aug 9 (sibling bond festival)\n- Janmashtami: Aug 16 ⭐ (Lord Krishna's birth — midnight puja!)\n- Ganesh Chaturthi: Aug 22 🐘 (10-day festival begins)\n\n**Janmashtami fast:** No food all day. Midnight abhishek of baby Krishna with panchamrita. Break fast with panchamrita.\n\n**Ganesh Chaturthi:** Bring Ganesha idol home. Daily puja for 1, 3, 5, 7 or 10 days."},
  /* ── SEPTEMBER ── */
  {keys:["september","sep"],
   ans:"**September 2026 Vedic Calendar**\n\n🌟 **Major Festivals:**\n- Navratri begins: Sep 21 (9 nights of Goddess Durga)\n- Dussehra: Sep 30 (victory of Ram over Ravana)\n\n**Pitra Paksha: Sep 17 – Oct 2** — ancestor fortnight\n- Offer tarpan to ancestors daily\n- Donate food, clothes to needy\n- Avoid auspicious events during this period\n\n**Navratri fasting:** 9 days, one goddess form per day. End with Kanya puja."},
  /* ── OCTOBER ── */
  {keys:["october","oct"],
   ans:"**October 2026 Vedic Calendar**\n\n🪔 **Major Festivals:**\n- Navratri ends/Dussehra: Oct 2\n- Karwa Chauth: Oct 13 (wives fast for husbands)\n- Dhanteras: Oct 18 (buy gold/silver)\n- Diwali: Oct 20 🪔 (Festival of Lights!)\n- Govardhan Puja: Oct 21\n- Bhai Dooj: Oct 22\n- Chhath Puja: Oct 25 (sun worship)\n\n**Diwali:** Light diyas at sunset. Lakshmi puja. Exchange sweets. Fireworks."},
  /* ── NOVEMBER ── */
  {keys:["november","nov"],
   ans:"**November 2026 Vedic Calendar**\n\n🌿 **Key dates:**\n- Dev Uthani Ekadashi: Nov 1 (Vishnu wakes from Chaturmas — marriages resume!)\n- Kartik Purnima: Nov 5 (most sacred — dip in holy rivers)\n- Tulsi Vivah: Nov 2 (marriage of Tulsi and Vishnu)\n\n**Nov 25 – Dec 10:** Prime marriage muhurat window for 2026!\n\n**Kartik month is highly sacred** — Tulsi puja daily, Deepdan (lamp offerings) at dusk."},
  /* ── DECEMBER ── */
  {keys:["december","dec"],
   ans:"**December 2026 Vedic Calendar**\n\n❄️ Hemanta Ritu — ideal for spiritual retreat\n\n🌟 **Key:**\n- Gita Jayanti: Dec 17 (anniversary of Bhagavad Gita — read all 18 chapters)\n- Vivah Panchami: Dec 5 (Ram-Sita marriage anniversary)\n\n**Dec 15–31:** Excellent marriage muhurat window\n**Margashirsha month:** Lord Krishna's favourite — Thursday puja especially auspicious."},
  /* ── NAKSHATRA ── */
  {keys:["nakshatra","constellation","star","rohini","ashwini","pushya","revati"],
   ans:"**27 Nakshatras — Overview**\n\n⭐ **Most auspicious:** Rohini, Pushya, Hasta, Anuradha, Revati, Ashwini\n\n🌟 **Rohini (current):** Ruled by Moon · Deity Brahma · Excellent for everything\n🐴 **Ashwini:** Ketu · Quick healing, new starts\n🌸 **Pushya:** Saturn · Most stable, best for ceremonies\n✋ **Hasta:** Moon · Skilled work, crafts, healing\n🌺 **Anuradha:** Saturn · Friendship, devotion\n🐟 **Revati:** Mercury · Completion, nurturing\n\nAsk about any specific nakshatra for full details."},
  /* ── SHIVA ── */
  {keys:["shiva","shiv","mahadev","lord shiva","shankar","shivaratri","parvati"],
   ans:"**Lord Shiva — Dharmic Guide**\n\n🔱 **Sacred Days:** Mondays · Pradosh (13th tithi) · Maha Shivaratri\n\n**Mantras:**\n- Om Namah Shivaya (chant 108×)\n- Maha Mrityunjaya Mantra (protection)\n\n**Offerings:** Bilva leaves (bel patra), milk, gangajal, dhatura, bhasma\n\n**Next Maha Shivaratri:** Feb 2027\n**Monthly Shivaratri:** 13th tithi of every month\n\n**Shiva represents:** Destruction/renewal, consciousness, tapasya, liberation (moksha)"},
  /* ── VISHNU / KRISHNA / RAMA ── */
  {keys:["vishnu","krishna","rama","ram","janmashtami","navami","ekadashi"],
   ans:"**Lord Vishnu & Avatars**\n\n🐚 **Sacred Days:** Ekadashi · Thursdays · Purnima\n\n**10 Avatars (Dashavatara):** Matsya, Kurma, Varaha, Narasimha, Vamana, Parashurama, Rama, Krishna, Buddha, Kalki\n\n**Key Festivals:**\n- Ram Navami: Apr 5, 2026\n- Janmashtami: Aug 16, 2026\n- Devshayani Ekadashi: Jul 6 (Vishnu sleeps)\n- Dev Uthani Ekadashi: Nov 1 (Vishnu wakes)\n\n**Mantras:** Om Namo Bhagavate Vasudevaya · Hare Krishna Mahamantra"},
  /* ── GODDESS / DEVI ── */
  {keys:["durga","lakshmi","saraswati","devi","goddess","navratri","shakti"],
   ans:"**Goddess Worship — Shakti Tradition**\n\n🌺 **Navratri (2 per year):**\n- Chaitra Navratri: Mar–Apr\n- Sharada Navratri: Sep 21–30, 2026\n\n**9 Forms of Durga:**\n1. Shailaputri · 2. Brahmacharini · 3. Chandraghanta\n4. Kushmanda · 5. Skandamata · 6. Katyayani\n7. Kalaratri · 8. Mahagauri · 9. Siddhidatri\n\n**Lakshmi worship:** Fridays, Purnima, Diwali\n**Saraswati worship:** Vasant Panchami, before exams\n**Mantras:** Om Dum Durgayai Namah · Om Shreem Mahalakshmyai Namah"},
  /* ── GANESHA ── */
  {keys:["ganesha","ganesh","vinayaka","chaturthi","ganpati"],
   ans:"**Lord Ganesha — Vighnaharta**\n\n🐘 **Sacred Days:** Chaturthi (4th tithi every month) · Wednesdays\n\n**Ganesh Chaturthi 2026:** Aug 22 (10-day festival)\n\n**Offering:** Modak, durva grass, red hibiscus, red/yellow cloth\n\n**Mantra:** Om Gam Ganapataye Namah (chant before any new venture)\n\n**Importance:** Worship Ganesha first before any puja, business start, or journey.\n\n**Monthly Sankashti Chaturthi:** Fast until moonrise, offer modak"},
  /* ── REMEDIES / PLANETS ── */
  {keys:["remedy","graha","dosh","mangal","shani","saturn","rahu","ketu","planet","jyotish"],
   ans:"**Graha Remedies**\n\n☀️ **Sun (Surya):** Sundays · Red/orange clothes · Surya Arghya daily\n🌙 **Moon (Chandra):** Mondays · White clothes · Shiva puja\n♂️ **Mars (Mangal):** Tuesdays · Red · Hanuman puja · Mangal dosh: delay marriage\n☿ **Mercury (Budh):** Wednesdays · Green · Ganesha puja\n♃ **Jupiter (Guru):** Thursdays · Yellow · Vishnu puja · Most auspicious graha\n♀️ **Venus (Shukra):** Fridays · White/pink · Lakshmi puja\n♄ **Saturn (Shani):** Saturdays · Blue/black · Shani puja · Donate mustard oil\n🌑 **Rahu:** Wednesday · Durga puja · Hessonite stone\n🌑 **Ketu:** Tuesday · Ganesha puja · Cat's eye stone"},
  /* ── PANCHANG ── */
  {keys:["panchang","panchaang","tithi","yoga","karana","explain","what is"],
   ans:"**Panchang — The 5 Elements of Time**\n\n📅 **Tithi (Lunar day):** 1–30, each with a deity and quality\n⭐ **Nakshatra (Moon star):** 27 lunar mansions — determines quality of day\n🔮 **Yoga:** 27 combinations of Sun+Moon — auspicious or inauspicious\n⏰ **Karana:** Half-tithi — 11 types\n📆 **Vara (Weekday):** Each ruled by a planet\n\n**Today (changes by city):** Check the selected location card for the active tithi, nakshatra, yoga, and karana. U.S. and India can differ because Panchang rolls by local sunrise\n\nAll 5 must be checked for any muhurat calculation."},
  /* ── KARMA / DHARMA ── */
  {keys:["karma","dharma","moksha","samsara","rebirth","reincarnation","atma","soul"],
   ans:"**Core Vedic Philosophy**\n\n🕉️ **Dharma:** Righteous duty — living in harmony with cosmic law\n⚖️ **Karma:** Law of cause and effect — every action returns\n🔄 **Samsara:** Cycle of birth, death, rebirth driven by karma\n🌟 **Moksha:** Liberation — breaking the cycle of rebirth\n✨ **Atman:** Individual soul — identical to Brahman (universal consciousness)\n\n**4 Purusharthas (life goals):**\n1. Dharma (duty) · 2. Artha (wealth) · 3. Kama (desire) · 4. Moksha (liberation)\n\n**Gita 2.20:** 'The soul is never born nor dies at any time.'"},
  /* ── SCRIPTURES ── */
  {keys:["gita","bhagavad","upanishad","veda","vedas","ramayana","mahabharata","purana"],
   ans:"**Sacred Hindu Scriptures**\n\n📚 **4 Vedas:** Rigveda, Yajurveda, Samaveda, Atharvaveda\n📖 **108 Upanishads:** Philosophical wisdom — Brihadaranyaka, Chandogya, Mandukya\n🌺 **18 Puranas:** Bhagavata (most important), Vishnu, Shiva, Devi Bhagavata\n🏹 **Itihasas (Epics):** Ramayana (Valmiki) + Mahabharata (Vyasa)\n🎯 **Bhagavad Gita:** 700 verses from Mahabharata — Krishna's teaching to Arjuna\n🔱 **Agamas:** Temple worship manuals\n\n**Gita Jayanti 2026:** Dec 17 — read all 18 chapters"},
  /* ── SACRED RIVERS ── */
  {keys:["ganga","yamuna","river","holy river","pilgrimage","tirtha","kashi","varanasi"],
   ans:"**Sacred Rivers and Pilgrimages**\n\n🌊 **7 Sacred Rivers (Sapta Sindhu):**\nGanga · Yamuna · Godavari · Saraswati · Narmada · Sindhu · Kaveri\n\n**Char Dham (4 holy abodes):**\n🏔️ Badrinath (Vishnu) · Dwarka (Krishna) · Puri (Jagannath) · Rameshwaram (Shiva)\n\n**Kumbh Mela:** Largest human gathering on earth\n- Prayagraj · Haridwar · Nashik · Ujjain (rotating every 3 years)\n\n**Varanasi (Kashi):** Oldest living city — dying here grants moksha (Shiva whispers Taraka mantra)"},
  /* ── YOGA TYPES ── */
  {keys:["yoga","meditation","pranayama","asana","kundalini","tantra"],
   ans:"**Yoga — Paths to Union with Divine**\n\n🧘 **4 Main Paths:**\n1. **Jnana Yoga** — path of knowledge/wisdom (Upanishads, Advaita)\n2. **Bhakti Yoga** — path of devotion (chanting, puja, surrender)\n3. **Karma Yoga** — path of selfless action (Bhagavad Gita)\n4. **Raja Yoga** — path of meditation (Patanjali's 8 limbs)\n\n**8 Limbs of Yoga (Ashtanga):**\nYama · Niyama · Asana · Pranayama · Pratyahara · Dharana · Dhyana · Samadhi\n\n**Best time to meditate:** Brahma Muhurat (before sunrise)"},
  /* ── 2026 FULL YEAR ── */
  {keys:["2026","this year","upcoming","calendar year","festivals 2026"],
   ans:"**Hindu Vedanta Sacred Calendar 2026**\n\nMar 24: Chaitra Navratri begins\nApr 5: Ram Navami 🏹\nApr 12: Hanuman Jayanti 🌕\nApr 29: Akshaya Tritiya ⭐ (most auspicious!)\nJun 26: Rath Yatra 🚂\nJul 10: Guru Purnima 📚\nAug 16: Janmashtami 🎭\nAug 22: Ganesh Chaturthi 🐘\nSep 21: Navratri begins 🕉️\nSep 30: Dussehra 🎆\nOct 20: Diwali 🪔\nOct 25: Chhath Puja ☀️\nNov 1: Dev Uthani Ekadashi (marriages resume)\nDec 17: Gita Jayanti 📖"},
  /* ── GRIHA PRAVESH / HOUSE WARMING ── */
  {keys:["griha pravesh","housewarming","new house","moving","property","grah"],
   ans:"**Griha Pravesh Muhurat 2026**\n\n🏠 **Best months:** Jan–Feb, Apr–May, Nov–Dec\n\n✅ **Favorable periods:**\n- Apr 22 – May 25 (strong)\n- Nov 5–30 (after Dev Uthani Ekadashi)\n- Dec 15–25\n\n⛔ **Avoid:** Chaturmas (Jul 6 – Nov 1), Pitra Paksha (Sep 17–Oct 2), Amavasya\n\n**Griha Pravesh puja:** Enter with right foot, boil milk until it overflows (sign of abundance). Place Ganesha idol at entrance first."},
  /* ── UPANAYANA ── */
  {keys:["upanayana","thread","janeu","sacred thread","yajnopavita","mundan","naming","samskara","samskaras","rite","rites of passage"],
   ans:"**Samskaras — 16 Sacred Rites of Passage**\n\n🍼 **Garbhadhana** — conception rite\n📿 **Punsavana** — 3rd month ceremony\n🌿 **Simantonnayana** — hair-parting (7th month)\n🎁 **Jatakarma** — birth ceremony\n**Namakarana** — naming (11th day)\n💇 **Nishkramana** — first outing (4th month)\n🍚 **Annaprashana** — first solid food (6th month)\n✂️ **Mundan/Chudakarana** — first haircut (1st or 3rd year)\n👁️ **Karnavedha** — ear-piercing\n📖 **Vidyarambha** — beginning of education\n🎓 **Upanayana** — sacred thread (before age 12 for Brahmin males)\n📚 **Vedarambha** — Vedic study begins\n🎓 **Samavartana** — graduation\n💑 **Vivah** — marriage (most elaborate samskara)\n🏠 **Grihastha** — householder stage\n🔥 **Antyesti** — last rites / cremation\n\n**Upanayana 2026 muhurat:** Apr 22–27, May 1–10 (before Chaturmas begins Jul 6)"},
  /* ── BRAHMA ── */
  {keys:["brahma","brahma dev","creator god","creation"],
   ans:"**Brahma — The Creator**\n\n🌸 **Deity of:** Creation and knowledge\n**Consort:** Saraswati (Goddess of learning)\n**Vehicle (Vahana):** Swan (Hamsa)\n**Attributes:** 4 heads (4 Vedas), 4 arms, holds Vedas, kamandalu, lotus, prayer beads\n\n**Why Brahma is rarely worshipped:**\nAccording to Puranas, Brahma was cursed by Shiva (and in some versions by Brahma's own arrogance). Only two major Brahma temples exist — Pushkar (Rajasthan) and Kumbakonam (Tamil Nadu).\n\n**Brahma in the Trinity (Trimurti):**\n🌸 Brahma (Creator) · 🐚 Vishnu (Preserver) · 🔱 Shiva (Destroyer)\n\n**Sacred texts from Brahma:** Vedas, Puranas, Brahmasutras"},
  /* ── SURYA / SUN ── */
  {keys:["surya","sun god","solar","aditya","surya dev","sun worship","surya namaskar"],
   ans:"**☀️ Surya Dev — The Sun God**\n\n**Significance:** Source of life, light, and energy. One of the Navagrahas. Direct visible deity in Vedic tradition.\n**Vehicle:** Seven-horse chariot (Sapta Ashwa)\n**Consort:** Sanjna and Chhaya\n\n**How to worship:**\n🌅 **Surya Arghya:** Offer water to rising sun from copper vessel\n📿 **12 Names (Aditya Hridayam):** Om Mitraya, Om Ravaye, Om Suryaya, Om Bhanave, Om Khagaya, Om Pushne, Om Hiranyagarbhaya, Om Marichaye, Om Adityaya, Om Savitre, Om Arkaya, Om Bhaskaraya Namah\n🧘 **Surya Namaskar:** 12-posture sun salutation at sunrise\n\n**Sacred days:** Sundays · Makar Sankranti · Ratha Saptami\n\n**Benefits of Surya worship:** Health, eyesight, energy, vitality, fame, confidence\n\n**Chhath Puja 2026:** Oct 23–26 — most elaborate Surya festival"},
  /* ── KARTIKEYA / MURUGAN ── */
  {keys:["kartikeya","murugan","subramanya","subrahmanya","skanda","kumara","shanmuga","kavadi"],
   ans:"**🪶 Kartikeya / Murugan — God of War and Victory**\n\n**Also known as:** Subramanya, Skanda, Kumara, Shanmugha (6 faces), Arumugam\n**Parents:** Lord Shiva and Goddess Parvati\n**Brother:** Lord Ganesha\n**Vehicle:** Peacock (Mayil)\n**Weapon:** Vel (divine spear)\n**Consort:** Devasena and Valli\n\n**Worship regions:** Especially revered in Tamil Nadu, Karnataka, Sri Lanka, Malaysia\n\n**Sacred days:** Thaipusam · Skanda Sashti (6-day festival, Oct–Nov) · Tuesdays · Kartika month\n\n**Thaipusam 2027:** ~Feb 9, 2027 (devotees carry kavadi as penance)\n\n**Skanda Sashti 2026:** ~Nov 11, 2026 (6-day fast culminating in Soorasamharam)\n\n**6 Sacred Abodes (Arupadai Veedu):** Palani, Thiruchendur, Swamimalai, Thiruparankundram, Tiruttani, Pazhamudircholai\n\n**Mantra:** Om Saravana Bhava · Om Sharavana Bhavaya Namah"},
  /* ── KALI ── */
  {keys:["kali","mahakali","kalika","kali puja","kali mata","shakti"],
   ans:"**🩸 Goddess Kali — The Dark Mother**\n\n**Significance:** Form of Goddess Durga — goddess of time, death, and liberation. Destroyer of evil ego. Despite fierce appearance, she is the most loving mother.\n**Vehicle:** Lion / Body of Shiva\n**Attributes:** Dark complexion, 4 arms, holds sword, severed head, raises abhaya and varada mudras, wears garland of skulls\n\n**Forms:** Dakshina Kali · Smashana Kali · Mahakali · Bhadra Kali\n\n**Sacred Days:** Kali Puja (same night as Diwali, Oct 20, 2026) · Amavasya (new moon) · Tuesdays\n\n**Kali Puja 2026:** October 20 (Bengal, Odisha) — all-night worship with lamps and flowers\n\n**Major temples:** Kalighat (Kolkata) · Dakshineswar · Kamakhya (Assam) · Chintpurni (HP)\n\n**Mantra:** Om Krim Kalikayai Namah\n\n**Navratri form:** 7th night — Kalaratri form of Durga"},
  /* ── RADHA / RADHA KRISHNA ── */
  {keys:["radha","radharani","radha krishna","radhe","vrindavan","braj","gopi"],
   ans:"**🌸 Radha — The Divine Beloved**\n\n**Significance:** Radha is considered the highest devotee of Krishna and the feminine energy (Shakti) of Vishnu. Their love represents the soul's longing for the divine.\n\n**Sacred sites:**\n🌸 **Barsana:** Radha's birthplace — famous for Lathmar Holi\n🎨 **Vrindavan:** Where Radha-Krishna performed Raas Leela\n🎭 **Mathura:** Krishna's birthplace (15 km from Vrindavan)\n⛰️ **Govardhan Hill:** Where Krishna lifted the hill\n\n**Radhashtami:** Birthday of Radha — 8th day of Bhadra Shukla\n**Radhashtami 2026:** ~September 1, 2026\n\n**Festivals:** Holi, Janmashtami, Raas Leela (Kartik month), Sharad Purnima\n\n**Mantra:** Radhe Radhe · Radhey Shyam · Jai Shri Radhe\n\n**Vrindavan Darshan:** Banke Bihari, ISKCON, Radha Raman, Prem Mandir temples"},
  /* ── HANUMAN DEDICATED ── */
  {keys:["hanuman","bajrangbali","hanuman jayanti","hanuman chalisa","maruti","anjaneya"],
   ans:"**🙏 Lord Hanuman — Epitome of Devotion**\n\n**Parents:** Anjana (mother) and Kesari (father), born of wind god Vayu\n**Vehicle:** None — flies on his own divine power\n**Weapon:** Gada (mace)\n\n**Sacred Days:** Tuesdays · Saturdays · Hanuman Jayanti (Apr 12, 2026)\n\n**Hanuman Chalisa:** 40 verses by Tulsidas — recite daily for protection and strength. Reciting 11 times removes obstacles, 108 times on Tuesdays fulfills desires.\n\n**Five Appearances (Pancha Rupa):** Anjaneya, Hanuman, Kesari Nandana, Vajradeha, Maha Vira\n\n**Offerings:** Sindoor mixed in oil · Red flowers · Red cloth · Ladoo · Besan ka laddu\n\n**Hanuman Jayanti 2026:** April 12 (Chaitra Purnima)\n**Hanuman Jayanti 2027:** ~April 30, 2027\n\n**Most powerful practice:** Recite Sundara Kanda (5th section of Valmiki Ramayana) on Saturdays\n\n**7 Chiranjeevis (Immortals):** Hanuman is one of 7 eternal beings still present on Earth\n\n**Mantra:** Om Hanumate Namah · Om Shri Hanumate Namah · Jai Bajrangbali"},
  /* ── PUJA VIDHI ── */
  {keys:["puja","puja vidhi","how to perform puja","worship","daily puja","morning puja","aarti"],
   ans:"**🪔 How to Perform Daily Puja**\n\n**Preparation:**\n🛁 Bathe before puja · Face East or North · Clean altar\n\n**Standard Shodashopachara (16-step) Puja:**\n1. **Dhyana** — Meditate on deity\n2. **Avahana** — Invoke deity's presence\n3. **Asana** — Offer seat (flowers/rice)\n4. **Padya** — Wash feet (offer water)\n5. **Arghya** — Offer water to hands\n6. **Achamaniya** — Offer water to mouth\n7. **Madhuparka** — Honey + ghee offering\n8. **Snanam** — Abhishek (bath)\n9. **Vastram** — Offer cloth\n10. **Yajnopavita** — Sacred thread\n11. **Gandha** — Apply sandalwood paste\n12. **Pushpam** — Offer flowers\n13. **Dhupam** — Incense\n14. **Deepam** — Lamp (diyas)\n15. **Naivedyam** — Food offering\n16. **Pradakshina** — Circumambulation + Namaskar\n\n**Panchopachara (5-step simplified):** Gandha · Pushpa · Dhupa · Dipa · Naivedya\n\n**Aarti:** Ring bell, move camphor lamp clockwise 3 or 7 times. Conclude every puja."},
  /* ── BHAGAVAD GITA SHLOKAS ── */
  {keys:["shloka","sloka","shlokas","verse","gita verse","bhagavad gita shloka","gita chapter","gita quotes","gita 2","gita 18","krishna says","arjuna"],
   ans:"**🎯 Key Bhagavad Gita Shlokas**\n\n📿 **Gita 2:20 — Soul is Eternal:**\n*Na jayate mriyate va kadachin*\n'The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being.'\n\n⚡ **Gita 2:47 — Karma Yoga:**\n*Karmanye vadhikaraste ma phaleshu kadachana*\n'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.'\n\n🔥 **Gita 9:22 — Divine Protection:**\n*Ananyaschintayanto mam ye janah paryupasate*\n'Those who worship Me with devotion — meditating on My transcendental form — I carry what they lack and preserve what they have.'\n\n✨ **Gita 18:66 — Surrender:**\n*Sarva dharman parityajya mamekam sharanam vraja*\n'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.'\n\n🕉️ **Gita 4:7 — Avatar Promise:**\n*Yada yada hi dharmasya glanir bhavati Bharata*\n'Whenever there is decline of dharma and rise of evil, I manifest Myself.'\n\n📖 **Gita has 18 chapters, 700 verses.** Best chapters: 2 (Sankhya), 9 (Royal Knowledge), 12 (Bhakti), 18 (Moksha)\n\n**Gita Jayanti 2026:** December 17 — anniversary of when Krishna spoke the Gita to Arjuna"},
  /* ── UPANISHAD SHLOKAS ── */
  {keys:["upanishad","upanishads","brahman","atman","vedanta","advaita","mahavakya","tat tvam asi","aham brahmasmi"],
   ans:"**📚 Upanishads — Core Wisdom**\n\n**108 Upanishads** — 10 principal ones:\nBrihadaranyaka · Chandogya · Taittiriya · Aitareya · Kaushitaki · Kena · Katha · Isha · Mundaka · Mandukya · Prashna · Shvetashvatara\n\n**4 Mahavakyas (Great Sayings):**\n1. **Prajnanam Brahma** — 'Consciousness is Brahman' (Aitareya Upanishad)\n2. **Aham Brahmasmi** — 'I am Brahman' (Brihadaranyaka Upanishad)\n3. **Tat Tvam Asi** — 'Thou art That' (Chandogya Upanishad)\n4. **Ayam Atma Brahma** — 'This Self is Brahman' (Mandukya Upanishad)\n\n**Key verses:**\n🌟 *Tamaso ma jyotirgamaya* — 'Lead me from darkness to light' (Brihadaranyaka)\n🕊️ *Sarve bhavantu sukhinah* — 'May all beings be happy' (Brihadaranyaka)\n🔄 *Purnamadah purnamidam* — 'That is whole, this is whole' (Isha Upanishad)\n\n**Advaita Vedanta:** Adi Shankaracharya's teaching — Atman = Brahman. All duality is Maya (illusion)."},
  /* ── 12 RASHIS / ZODIAC ── */
  {keys:["rashi","rashis","zodiac","aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces","mesh","vrishabh","mithun","kark","singh","kanya","tula","vrishchik","dhanu","makar","kumbh","meen"],
   ans:"**⭐ 12 Rashis (Vedic Zodiac)**\n\n♈ **Mesha (Aries):** Mar 21–Apr 20 · Mars · Fire · Energetic, courageous\n♉ **Vrishabha (Taurus):** Apr 21–May 21 · Venus · Earth · Patient, sensual\n♊ **Mithuna (Gemini):** May 22–Jun 21 · Mercury · Air · Curious, communicative\n♋ **Karka (Cancer):** Jun 22–Jul 22 · Moon · Water · Nurturing, intuitive\n♌ **Simha (Leo):** Jul 23–Aug 23 · Sun · Fire · Confident, generous\n♍ **Kanya (Virgo):** Aug 24–Sep 22 · Mercury · Earth · Analytical, perfectionist\n♎ **Tula (Libra):** Sep 23–Oct 23 · Venus · Air · Balanced, diplomatic\n♏ **Vrishchika (Scorpio):** Oct 24–Nov 22 · Mars/Ketu · Water · Intense, transformative\n♐ **Dhanu (Sagittarius):** Nov 23–Dec 21 · Jupiter · Fire · Optimistic, philosophical\n♑ **Makara (Capricorn):** Dec 22–Jan 20 · Saturn · Earth · Disciplined, ambitious\n♒ **Kumbha (Aquarius):** Jan 21–Feb 19 · Saturn/Rahu · Air · Humanitarian, innovative\n♓ **Meena (Pisces):** Feb 20–Mar 20 · Jupiter/Ketu · Water · Spiritual, compassionate\n\n**To find your Rashi:** Based on Moon's position at birth (not Sun sign as in Western astrology)"},
  /* ── MAHADASHA / DASHA ── */
  {keys:["mahadasha","dasha","antardasha","vimshottari","planetary period","dashas","jyotish","horoscope","kundali","kundli","janam kundli","birth chart"],
   ans:"**🔮 Vimshottari Dasha System**\n\n**Total cycle:** 120 years\n\n**9 Mahadashas in order:**\n☀️ **Sun (Surya):** 6 years — leadership, father, authority\n🌙 **Moon (Chandra):** 10 years — emotions, mother, mind\n♂️ **Mars (Mangal):** 7 years — energy, property, siblings\n🐉 **Rahu:** 18 years — ambition, foreign, sudden changes\n♃ **Jupiter (Guru):** 16 years — wisdom, children, expansion\n♄ **Saturn (Shani):** 19 years — discipline, karma, delays\n☿ **Mercury (Budh):** 17 years — intellect, business, communication\n🐉 **Ketu:** 7 years — spirituality, past karma, liberation\n♀️ **Venus (Shukra):** 20 years — love, luxury, arts\n\n**How to find your dasha:** Based on Moon's nakshatra at birth\n\n**Sade Sati (Saturn's 7.5-year transit over Moon):** Every ~29 years — significant life changes\n\n**Consult a Jyotishi** for personalized dasha reading with exact birth time, date, place"},
  /* ── LOHRI ── */
  {keys:["lohri","lohri festival","punjabi festival","harvest punjab"],
   ans:"**🔥 Lohri**\n\n📅 **Date:** January 13, 2026 (always Jan 13, day before Makar Sankranti)\n📅 **Lohri 2027:** January 13, 2027\n\n**Significance:** Punjabi harvest festival marking the end of winter solstice and arrival of longer days. Especially celebrated by farmers and for newborn babies/new brides.\n\n**How to Celebrate:**\n🔥 Light bonfire (the main ritual)\n🌾 Offer: reodi (sesame candy), peanuts, popcorn, gajak, sugarcane into fire\n💃 Bhangra and Gidda dance around bonfire\n🎵 Sing Lohri songs: 'Sundar Mundriye ho...' (Dulla Bhatti folk songs)\n🍬 Distribute: til-gur, peanuts, rewri to neighbors\n🙏 Pray for good harvest and family prosperity\n\n**Special for:** Families with newborn babies (first Lohri) and newly married couples\n\n**Regions:** Punjab, Haryana, Himachal Pradesh, Delhi"},
  /* ── UGADI / GUDI PADWA ── */
  {keys:["ugadi","gudi padwa","yugadi","ugadi 2026","ugadi 2027","telugu new year","kannada new year","marathi new year","hindu new year"],
   ans:"**🌺 Ugadi / Gudi Padwa — Hindu New Year**\n\n📅 **Ugadi 2026:** March 21, 2026 (Chaitra Shukla Pratipada)\n📅 **Ugadi 2027:** ~April 9, 2027\n\n**Ugadi** = Telugu and Kannada New Year\n**Gudi Padwa** = Marathi New Year (same day)\n\n**Significance:** Beginning of Chaitra month and Hindu Luni-Solar New Year. Brahma created the world on this day (Satyuga began). New samvatsara (year) begins.\n\n**New Year Name 2026:** Pingala Samvatsara\n\n**Ugadi Pachadi (special dish):** 6 tastes symbolizing life's experiences:\n- Neem flowers (bitterness) · Tamarind (sour) · Jaggery (sweet)\n- Raw mango (tangy) · Salt (savory) · Chili (spice)\n\n**Gudi Padwa traditions:**\n🟡 Raise Gudi (bamboo with cloth, neem, mango leaves) outside home\n🌺 Rangoli at entrance · New clothes · Family puja\n🍚 Special food: Puran Poli, Shrikhand\n\n**Panchang Sravanam:** Priest reads year's forecast on Ugadi morning"},
  /* ── VISHU / KERALA NEW YEAR ── */
  {keys:["vishu","kerala new year","vishu 2026","vishu 2027","vishukkani","onam","malayali"],
   ans:"**🌸 Vishu — Kerala New Year**\n\n📅 **Vishu 2026:** April 14, 2026\n📅 **Vishu 2027:** April 14, 2027\n\n**Significance:** Malayalam New Year. Sun enters Mesha (Aries) — astronomical new year. First auspicious sight (Vishukkani) determines year's prosperity.\n\n**Vishukkani (First Sight):**\nArrange on night before: mirror, coconut, golden cucumber, raw rice, golden laburnum flowers (Kani Konna), gold coins, holy texts\n👁️ Wake before sunrise, go to puja room with eyes closed, open eyes to see Vishukkani first thing\n\n**Traditions:**\n🎁 Vishukkaineettam — elders give money to children\n🎆 Vishu Kani — firecrackers\n🍚 Sadya feast\n👗 New clothes (Puthukodi)\n\n**Onam 2026:** September 6–15, 2026 (Kerala's biggest festival — harvest festival of King Mahabali's return)"},
  /* ── BIHU ── */
  {keys:["bihu","rongali bihu","assam festival","bohag bihu","assamese new year"],
   ans:"**🌾 Bihu — Assam's Festival**\n\n📅 **Bohag Bihu (Rongali Bihu — Spring/New Year):** April 14–15, 2026\n📅 **Bhogali Bihu (Magh — Harvest):** January 14–15, 2026\n📅 **Kati Bihu (Autumn):** October 18, 2026\n\n**Three Bihus:**\n1. **Rongali/Bohag Bihu** (April) — New Year, spring, plowing season starts\n2. **Bhogali/Magh Bihu** (January) — harvest festival, bonfires, feasting\n3. **Kati/Kongali Bihu** (October) — lights, prayer for good harvest\n\n**Rongali Bihu traditions:**\n💃 Bihu dance (Husori) performed in groups\n🥁 Traditional instruments: Dhol, Pepa (buffalo horn), Gogona\n🍛 Special food: Pitha (rice cakes), Doi-chiura, Laru\n🐄 On Goru Bihu (day before): bathe and worship cattle\n\n**Significance:** Bihu is Assam's most important festival — celebrated regardless of religion"},
  /* ── KUMBH MELA ── */
  {keys:["kumbh","kumbh mela","kumbha","maha kumbh","ardh kumbh","prayagraj","haridwar kumbh","nashik kumbh","ujjain kumbh"],
   ans:"**🌊 Kumbh Mela — World's Largest Gathering**\n\n**Significance:** Most sacred bathing festival. Amrit (nectar of immortality) drops fell at 4 locations during the cosmic churning (Samudra Manthan). Bathing in river on Kumbh dates washes away all sins.\n\n**4 Locations (Rotate every 3 years):**\n🔱 **Prayagraj** (Allahabad): Sangam of Ganga+Yamuna+Saraswati — **Maha Kumbh** every 12 years\n🌿 **Haridwar:** Ganga — every 12 years (next ~2034)\n🍁 **Nashik:** Godavari — every 12 years\n🌙 **Ujjain:** Kshipra — every 12 years (Simhastha)\n\n**Ardh Kumbh (Half Kumbh):** Prayagraj every 6 years\n\n**Maha Kumbh 2025** (Prayagraj): Jan–Feb 2025 — 144-year Maha Kumbh\n\n**Most sacred baths (Shahi Snan — Royal Bath):**\nOn Makar Sankranti, Mauni Amavasya, Basant Panchami — lakhs of sadhus take ritual dip\n\n**Next Kumbh dates:** Check official Kumbh Mela calendar"},
  /* ── CHAR DHAM ── */
  {keys:["char dham","chardham","badrinath","dwarka","puri","rameshwaram","kedarnath","gangotri","yamunotri","pilgrimage sites","yatra","tirtha"],
   ans:"**🏔️ Char Dham — The Four Holy Abodes**\n\n🏔️ **Badrinath** (Uttarakhand): Vishnu/Narayana · Open May–Nov · At 3,133m\n🌊 **Dwarka** (Gujarat): Lord Krishna · Year-round · Krishna's ancient kingdom\n🌊 **Puri** (Odisha): Lord Jagannath (Krishna) · Year-round · Rath Yatra\n⛩️ **Rameshwaram** (Tamil Nadu): Shiva · Year-round · Ram worshipped Shiva here\n\n**Chota Char Dham (Himalayan Dham — most important):**\n🏔️ Yamunotri · Gangotri · Kedarnath · Badrinath\n*Open: May–June and Sept–Oct (monsoon closed)*\n\n**12 Jyotirlingas (Shiva):**\nSomnath (Gujarat) · Mallikarjuna (AP) · Mahakaleshwar (Ujjain) · Omkareshwar (MP) · Kedarnath (UK) · Bhimashankar (MH) · Kashi Vishwanath (Varanasi) · Tryambakeshwar (Nashik) · Vaidyanath (Jharkhand) · Nageshwar (Gujarat) · Rameshwaram (TN) · Grishneshwar (Ellora)\n\n**108 Divya Desam:** Vishnu temples visited by Alvar saints (Tamil Nadu, Kerala, North India, Nepal)"},
  /* ── YANTRA / SACRED GEOMETRY ── */
  {keys:["yantra","sri yantra","shri yantra","chakra","sacred geometry","sri chakra","mandala"],
   ans:"**🔶 Yantras — Sacred Geometric Diagrams**\n\n**Sri Yantra (Sri Chakra):** Most powerful yantra — represents Goddess Tripura Sundari (Lalita). Nine interlocking triangles: 4 pointing up (Shiva) + 5 pointing down (Shakti).\n\n**Common Yantras and uses:**\n🌟 **Sri Yantra:** Wealth, Lakshmi worship, spiritual growth\n🔱 **Maha Mritunjaya Yantra:** Protection, health\n⭐ **Ganesh Yantra:** Remove obstacles, success\n☀️ **Surya Yantra:** Health, vitality, fame\n🪐 **Shani Yantra:** Pacify Saturn, reduce Sade Sati effects\n🐉 **Rahu Yantra:** Protect from Rahu Mahadasha\n\n**How to energize:** Place facing East/North on altar. Perform puja with flowers and incense. Chant associated deity's mantra 108×.\n\n**Chakras (energy centers):**\n1. Muladhara (Root) · 2. Svadhisthana (Sacral) · 3. Manipura (Solar) · 4. Anahata (Heart) · 5. Vishuddha (Throat) · 6. Ajna (Third Eye) · 7. Sahasrara (Crown)"},
  /* ── RUDRAKSHA ── */
  {keys:["rudraksha","rudraksh","sacred beads","mala beads","japa mala","108 beads"],
   ans:"**📿 Rudraksha — Sacred Beads of Shiva**\n\n**Origin:** Tears of Lord Shiva that fell on Earth while meditating for the welfare of all beings.\n\n**Common Mukhis (faces) and benefits:**\n1-Mukhi: Represents Shiva — liberation, supreme consciousness\n2-Mukhi: Ardhanarishvara — harmony in relationships\n3-Mukhi: Agni — burns past karma, self-confidence\n4-Mukhi: Brahma — intelligence, creativity\n5-Mukhi: Panchamukhi Shiva — **most common**, good health, peace\n6-Mukhi: Kartikeya — focus, learning\n7-Mukhi: Lakshmi — wealth, prosperity\n8-Mukhi: Ganesha — remove obstacles\n11-Mukhi: Hanuman — protection, adventure\n14-Mukhi: Shiva (Deva Mani) — intuition, decision-making\n\n**How to wear:** Energize with Om Namah Shivaya mantras on Monday. Wear in Panchmukhi 108-bead mala for japa. Can wear touching skin.\n\n**Japa Mala:** 108+1 beads. Count mantras with thumb, skip the 'Meru' (central bead) when cycling."},
  /* ── HAVAN / YAJNA ── */
  {keys:["havan","yajna","yagna","homam","sacred fire","fire ritual","agni","havana"],
   ans:"**🔥 Havan / Yajna — Sacred Fire Ceremony**\n\n**Significance:** Fire (Agni) is the divine messenger who carries oblations to gods. Yajna purifies environment, promotes rain, brings prosperity.\n\n**Types of Havan:**\n🌿 **Navgraha Havan:** Pacify 9 planets\n🔱 **Maha Mritunjaya Havan:** Healing, remove serious illness\n🌸 **Ganesh Havan:** Before any major event\n☀️ **Surya Havan:** Health, vitality\n🌺 **Durga Havan:** Protection, Navratri\n\n**Basic Havan Samagri (offerings):**\nGhee (clarified butter) · Sesame seeds · Samagri mix · Barley · Rice · Wood (Mango, Ashwatha, Palash trees)\n\n**Havan procedure:**\n1. Purify space with cow dung or gangajal\n2. Build kund (firepit) in Earth or copper vessel\n3. Light fire with camphor and mango wood\n4. Chant mantras, offer samagri with 'Swaha!'\n5. 108 ahutis (offerings) for powerful ritual\n\n**Best time for Havan:** Brahma Muhurat, Abhijit Muhurat, or festival days"},
  /* ── NAVGRAHA TEMPLES ── */
  {keys:["navgraha","nine planets","navagraha","navgraha mantra","navgraha temple","navagraha temple"],
   ans:"**🪐 Navagraha — 9 Planetary Deities**\n\n☀️ **Surya (Sun):** Sunday · Ruby · Surya Namaskar · Aditya Hridayam\n🌙 **Chandra (Moon):** Monday · Pearl · Shiva puja · White items\n♂️ **Mangal (Mars):** Tuesday · Coral · Hanuman puja · Donate blood\n☿ **Budha (Mercury):** Wednesday · Emerald · Ganesha puja · Feed cows\n♃ **Brihaspati/Guru (Jupiter):** Thursday · Yellow sapphire · Vishnu puja\n♀️ **Shukra (Venus):** Friday · Diamond · Lakshmi puja · Donate sugar\n♄ **Shani (Saturn):** Saturday · Blue sapphire · Shani puja · Sesame oil lamp\n🐉 **Rahu (North Node):** Wed/Sat · Hessonite (Gomed) · Durga puja\n🐉 **Ketu (South Node):** Tue/Sat · Cat's eye (Lahsuniya) · Ganesha puja\n\n**Navgraha Temples (Tamil Nadu — most sacred):**\nSuryanar Koil · Thingalur · Vaitheeswaran Koil · Thiruvenkadu · Kanjanur · Alangudi · Thirunallaru · Keezhaperumpallam · Sikkil\n\n**Navgraha Shanti Homa:** Performed to pacify adverse planetary periods"},
  /* ── TULSI ── */
  {keys:["tulsi","tulsi plant","holy basil","vrinda","tulsi vivah","tulsi puja"],
   ans:"**🌿 Tulsi — Most Sacred Plant**\n\n**Significance:** Tulsi (Holy Basil) is the physical form of Goddess Tulsi/Vrinda, most beloved by Lord Vishnu. Every Hindu home should have a Tulsi plant.\n\n**Daily Tulsi worship:**\n🌅 Water Tulsi at sunrise (not after sunset)\n🪔 Light lamp at Tulsi in evening\n🙏 Circumambulate (Parikrama) 3, 5, or 7 times\n📿 Chant: Om Tulasyai Namah\n\n**Tulsi Vivah 2026:** November 2 (Dev Uthani Ekadashi)\nMarriage of Tulsi plant to Shaligram (Vishnu). Signals end of Chaturmas — marriage season resumes.\n\n**Medicinal properties:** Anti-bacterial, anti-viral, adaptogenic. Consume in morning with water.\n\n**Sacred uses:** Add Tulsi leaves to drinking water to purify. Place in mouth of dying person. Essential in all Vishnu puja.\n\n**Do not pluck on:** Ekadashi, Sundays, Purnima, Amavasya, after sunset, during eclipse"},
  /* ── PITRU PAKSHA / SHRADDHA ── */
  {keys:["pitru paksha","shraddha","pind daan","tarpan","ancestor","pitra","pitru","mahalaya","ancestral"],
   ans:"**🌿 Pitru Paksha — Ancestor Fortnight**\n\n📅 **Pitru Paksha 2026:** September 17 – October 1\n📅 **Pitru Paksha 2027:** ~October 6–20, 2027\n\n**Significance:** 16-day period when ancestors (Pitrus) visit the earthly plane. Performing rituals liberates ancestors from intermediate realm.\n\n**Shraddha rituals:**\n🌊 **Tarpan:** Offer water mixed with black sesame seeds to ancestors while facing South\n🍚 **Pind Daan:** Offer rice balls (pindas) to ancestors at sacred sites\n🐦 **Crow feeding:** Crows are considered messengers of Yama (death god)\n🍛 **Brahmana Bhoj:** Feed Brahmins in ancestors' name\n🕊️ **Charity:** Donate food, clothes, blankets to the needy\n\n**Sacred Shraddha sites:**\n🏔️ Gaya (Bihar) — most powerful Pind Daan location\n🌊 Prayagraj (Sangam) · Varanasi (Manikarnika Ghat) · Kurukshetra\n\n**Mahalaya Amavasya:** Last day of Pitru Paksha (Sep 30, 2026) — most important Shraddha day\n\n**Effects:** Pitru Dosha reduced, ancestors attain peace, family gets blessings"},
  /* ── ANTYESTI / DEATH RITES ── */
  {keys:["antyesti","death","funeral","cremation","last rites","antim sanskar","shradh","mourning","13 days"],
   ans:"**🕉️ Antyesti — Hindu Last Rites**\n\n**Philosophy:** Body is temporary; soul is eternal. Cremation releases soul quickly. Hindu last rites guide the soul toward liberation.\n\n**Sequence:**\n1. **Dying:** Recite Vishnu Sahasranama or Gita Ch.15 near dying person\n2. **Antyesti (cremation):** Ideally within 24 hours\n3. **Asthi Visarjan:** Immerse ashes in holy river (Ganga preferred) on 3rd day\n4. **Dasaah (10 days):** Daily Pind Daan and water offerings\n5. **Ekodishta Shraddha (11th day):** Major ritual\n6. **Sapindi Karana (12th day):** Soul joins ancestors\n7. **Masika (monthly):** Monthly Shraddha for 11 months\n8. **Varshika (annual):** Annual Shraddha on death anniversary\n\n**Most sacred sites for last rites:**\n🔱 **Varanasi (Kashi):** Dying here grants moksha — Shiva whispers Taraka mantra\n🌊 **Prayagraj Sangam** · **Haridwar Har ki Pauri**\n\n**Meaningful mantra for dying:** Maha Mrityunjaya Mantra (chant 108 times near dying person)"},
  /* ── SATYANARAYAN KATHA ── */
  {keys:["satyanarayan","satyanarayan katha","satyanarayan puja","vishnu vrat"],
   ans:"**🐚 Satyanarayan Puja**\n\n**Significance:** Worship of Lord Vishnu as Satyanarayan ('eternal truth'). One of the most popular household pujas — performed for fulfillment of desires, gratitude, and on auspicious occasions.\n\n**Best occasions:** Purnima · Ekadashi · New home (Griha Pravesh) · Marriage · Business launch · Childbirth · Completion of any major goal\n\n**Satyanarayan Puja 2026 — Purnima dates:**\nJan 13 · Feb 12 · Mar 14 · Apr 12 · May 12 · Jun 11 · Jul 10 · Aug 9 · Sep 7 · Oct 7 · Nov 5 · Dec 4\n\n**How to perform:**\n🌺 Prepare altar: Vishnu idol, banana leaves, fruits, panchamrita\n🍚 Panchamamrut abhishek\n📖 Read Satyanarayan Katha (5 chapters)\n🍌 Prasad: Sheera (semolina sweet) — must contain banana\n🙏 Distribute prasad to all — never refuse\n\n**Rule:** Prasad of Satyanarayan must never be disrespected (story of Satyavrata's wife in Katha)"},
  /* ── NAVRATRI DETAILED ── */
  {keys:["navratri","navaratri","nine nights","nine forms","navdurga","navratri 2026","navratri 2027","chaitra navratri","sharad navratri"],
   ans:"**🕉️ Navratri — 9 Nights of Goddess**\n\n**Two main Navratris in 2026:**\n🌺 **Chaitra Navratri:** March 21–30, 2026 (spring)\n🌟 **Sharad/Ashwin Navratri:** September 22 – October 1, 2026 (autumn — most celebrated)\n\n**Navratri 2027:** ~April 9–18, 2027 (Chaitra) · ~October 10–19, 2027 (Sharad)\n\n**9 Forms of Goddess Durga (Navadurga):**\n1. **Shailaputri** — Day 1 — Mountain's daughter, holds trident and lotus\n2. **Brahmacharini** — Day 2 — Ascetic penance, wisdom\n3. **Chandraghanta** — Day 3 — Bell-shaped crescent, destroys demons\n4. **Kushmanda** — Day 4 — Created universe with smile\n5. **Skandamata** — Day 5 — Mother of Kartikeya\n6. **Katyayani** — Day 6 — Most fierce form, slayer of Mahishasura\n7. **Kalaratri** — Day 7 — Dark destroyer, removes darkness and fear\n8. **Mahagauri** — Day 8 — Pure white, all wishes granted\n9. **Siddhidatri** — Day 9 — Grants all 8 siddhis (powers)\n\n**Colors worn each day:** Yellow, Green, Grey, Orange, White, Red, Blue, Pink, Purple\n\n**Kanya Puja (Ashtami/Navami):** Worship 9 little girls representing 9 Devis — feed them and offer dakshina"},
  /* ── DIWALI DETAILED ── */
  {keys:["diwali","deepawali","festival of lights","lakshmi puja diwali","dhanteras","govardhan","bhai dooj"],
   ans:"**🪔 Diwali 2026 — 5-Day Festival**\n\n📅 **Diwali 2026:** October 20 (Lakshmi Puja night)\n📅 **Diwali 2027:** ~November 8, 2027\n\n**5-Day Celebration:**\n\n🛍️ **Dhanteras (Oct 18):** Buy gold, silver, utensils. Worship Kubera and Lakshmi. Light 13 diyas at dusk.\n\n👻 **Narak Chaturdashi/Choti Diwali (Oct 19):** Defeat of Narakasura by Krishna. Apply sesame oil, have auspicious bath before sunrise.\n\n🪔 **Diwali/Lakshmi Puja (Oct 20):** Light clay diyas at sunset. Lakshmi-Ganesha puja. Fireworks. Exchange sweets.\n\n⛰️ **Govardhan Puja/Annakut (Oct 21):** Worship of Govardhan Hill. Annakut — 56 varieties of food offered to Krishna.\n\n👫 **Bhai Dooj (Oct 22):** Sisters do tilak on brothers' forehead. Brothers give gifts.\n\n**Lakshmi Puja timing (Oct 20):** Pradosh Kaal (1.5 hrs after sunset) — most auspicious\n\n**Offerings:** Diyas, sweets, kheel-batasha, coins, new clothes. Keep home lit all night."},
  /* ── PANCHAMRITA ── */
  {keys:["panchamrita","abhishek","pancha","ritual bath","puja offering","milk honey"],
   ans:"**🥛 Panchamrita — Five Nectars**\n\nPanchamrita is the sacred mixture used to bathe deity idols (Abhishek). 'Pancha' = 5, 'Amrita' = nectar/immortality.\n\n**5 Sacred ingredients:**\n🥛 **Milk (Ksheera):** Purity, sattva\n🍶 **Curd (Dadhi):** Prosperity, strength\n🍯 **Honey (Madhu):** Sweet speech, wisdom\n🧈 **Ghee (Ghrita):** Longevity, health\n🍬 **Sugar (Sharkara):** Joy, sweetness of life\n\n**Optional additions:** Gangajal, coconut water, fruit juice, rose water\n\n**How to use:**\nMix all 5 · Chant Om Namah Shivaya (or deity's mantra) · Pour over deity idol from small vessel\n\n**After abhishek:** Panchamrita becomes prasad — distributed to all. Consuming Panchamrita brings health and spiritual benefit.\n\n**Best occasions:** Maha Shivaratri · Janmashtami · Navratri · Ekadashi · Daily puja"},
  /* ── 108 SIGNIFICANCE ── */
  {keys:["108","one hundred eight","significance of 108","why 108","mala"],
   ans:"**🔮 Why 108 is Sacred in Hinduism**\n\n**Mathematical/Cosmic reasons:**\n☀️ Distance from Earth to Sun = ~108 × Sun's diameter\n🌙 Distance from Earth to Moon = ~108 × Moon's diameter\n🌱 9 planets × 12 zodiac signs = 108\n\n**In Yoga and Vedic tradition:**\n📿 **Japa Mala:** 108 beads (plus 1 Meru bead)\n🧘 **108 Upanishads**\n🌺 **108 Divya Desam** (Vishnu temples)\n🔱 **108 names of Shiva, Vishnu, Durga, Ganesha**\n✋ **108 marma points** (vital body points in Ayurveda)\n🌿 **108 sacred sites (Shakti Peethas) in India**\n\n**In Sanskrit:** Sanskrit alphabet has 54 letters × 2 (masculine/feminine) = 108\n\n**In practice:** Chant any mantra 108 times for full benefit · Complete 108 Surya Namaskars on Makar Sankranti · Ring temple bell 108 times"},
  /* ── 2027 DETAILED ── */
  {keys:["2027 calendar","hindu 2027","festivals 2027","panchang 2027","all festivals 2027"],
   ans:"**Hindu Calendar 2027 — Comprehensive**\n\n☀️ **Makar Sankranti:** Jan 14, 2027\n🌼 **Vasant Panchami:** Jan 22, 2027\n🔱 **Maha Shivaratri:** Feb 26, 2027\n🎨 **Holika Dahan:** Mar 21 · **Holi:** Mar 22, 2027\n🌺 **Ugadi/Gudi Padwa:** Apr 9, 2027\n🏹 **Ram Navami:** Apr 25, 2027\n⭐ **Akshaya Tritiya:** Apr 30, 2027\n🐒 **Hanuman Jayanti:** May 5, 2027\n📚 **Guru Purnima:** Jul 28, 2027\n🧶 **Raksha Bandhan:** Aug 23, 2027\n🎭 **Janmashtami:** Aug 4, 2027\n🐘 **Ganesh Chaturthi:** Aug 14, 2027\n🕉️ **Navratri:** Oct 10–19, 2027\n⚔️ **Dussehra:** Oct 19, 2027\n🌕 **Karva Chauth:** Oct 31, 2027\n🪔 **Dhanteras:** Nov 6 · **Diwali:** Nov 8, 2027\n📖 **Gita Jayanti:** Dec 5, 2027\n\n💡 Ask me: 'When is [festival] in 2027?' for full details\n⚠️ *Approximate dates — exact panchang published late 2026*"},
  /* ── 2028 DETAILED ── */
  {keys:["2028","2028 calendar","festivals 2028","hindu 2028"],
   ans:"**Hindu Calendar 2028 — Approximate Dates**\n\n☀️ **Makar Sankranti:** Jan 14, 2028\n🔱 **Maha Shivaratri:** Feb 14, 2028\n🎨 **Holi:** Mar 11, 2028\n🏹 **Ram Navami:** Apr 13, 2028\n⭐ **Akshaya Tritiya:** May 19, 2028\n🎭 **Janmashtami:** Aug 23, 2028\n🐘 **Ganesh Chaturthi:** Sep 2, 2028\n🕉️ **Navratri:** Sep 28–Oct 7, 2028\n⚔️ **Dussehra:** Oct 7, 2028\n🪔 **Diwali:** Oct 27, 2028\n\n⚠️ *2028 dates are preliminary estimates — exact dates confirmed per printed panchang*"},
  /* ── 2029 FUTURE ── */
  {keys:["2029","2029 calendar","festivals 2029","2030","2030 calendar","festivals 2030"],
   ans:"**Hindu Calendar 2029–2030 — Approximate**\n\n**2029 Key dates:**\n🔱 Maha Shivaratri: ~Feb 2, 2029\n🎨 Holi: ~Mar 28, 2029\n🪔 Diwali: ~Oct 17, 2029\n\n**2030 Key dates:**\n🔱 Maha Shivaratri: ~Feb 21, 2030\n🎨 Holi: ~Mar 17, 2030\n🪔 Diwali: ~Nov 6, 2030\n\n⚠️ *These dates are preliminary approximations. Hindu festival dates are determined by the lunar panchang and are officially confirmed 1–2 years in advance.*\n\n**For accurate long-term planning:** Consult the Vishwa Panchang or Drik Panchang website for future year dates once they are officially published."},
  /* ── AHIMSA / ETHICS ── */
  {keys:["ahimsa","non-violence","satya","truth","asteya","brahmacharya","aparigraha","yama","niyama","five vows"],
   ans:"**☮️ Panchamahavrata — 5 Great Vows**\n\n*The foundation of Vedic ethics (from Patanjali's Yoga Sutras)*\n\n**5 Yamas (Restraints):**\n☮️ **Ahimsa** — Non-violence in thought, word, deed\n🗣️ **Satya** — Truthfulness\n🚫 **Asteya** — Non-stealing\n💫 **Brahmacharya** — Celibacy/right use of energy\n🙏 **Aparigraha** — Non-possessiveness\n\n**5 Niyamas (Observances):**\n✨ **Shaucha** — Cleanliness (body and mind)\n😌 **Santosha** — Contentment\n🔥 **Tapas** — Discipline, austerity\n📚 **Svadhyaya** — Self-study, scripture study\n🕉️ **Ishvara Pranidhana** — Surrender to God\n\n**Ahimsa in practice:** Vegetarianism · Avoiding harm to all living beings · Speaking kindly · Compassion for animals · Gandhi's satyagraha movement was based on Ahimsa"},
  /* ── AYURVEDA BASICS ── */
  {keys:["ayurveda","dosha","vata","pitta","kapha","tridosha","constitution","body type","prakriti"],
   ans:"**🌿 Ayurveda — Science of Life**\n\n**3 Doshas (Body-Mind Constitutions):**\n\n💨 **Vata (Air+Space):** Thin, creative, anxious, energetic\n- Imbalance: Anxiety, dry skin, constipation, insomnia\n- Balance: Warm food, oil massage, routine, yoga\n\n🔥 **Pitta (Fire+Water):** Medium build, sharp intellect, intense, competitive\n- Imbalance: Anger, acidity, inflammation, rashes\n- Balance: Cooling food, avoid spicy, moon meditation\n\n🌊 **Kapha (Earth+Water):** Heavier build, calm, nurturing, slow\n- Imbalance: Weight gain, depression, congestion, lethargy\n- Balance: Exercise, light food, stimulating activities\n\n**6 Tastes (Rasas) for balance:** Sweet · Sour · Salty · Pungent · Bitter · Astringent\n\n**Dinacharya (Daily Routine):**\n🌅 Wake at Brahma Muhurat · Oil pulling · Tongue scraping · Abhyanga (oil massage) · Yoga/Pranayama · Warm water\n\n**Sacred herbs:** Ashwagandha · Brahmi · Shatavari · Neem · Triphala · Tulsi"},
  /* ── TEMPLE ETIQUETTE ── */
  {keys:["temple","mandir","how to visit temple","temple rules","temple etiquette","darshan","prasad temple"],
   ans:"**🏛️ Hindu Temple — Etiquette and Practice**\n\n**Before entering:**\n👡 Remove footwear outside\n🛁 Be physically clean — bathe before temple visit\n👗 Dress modestly — cover shoulders and knees\n📵 Silence mobile phone\n\n**At the temple:**\n🔔 Ring the temple bell on entry (announces your arrival to deity)\n🌺 Proceed clockwise (Pradakshina)\n🙏 Perform Ashtanga Pranam (8-point prostration for men) or Panchanga (5-point for women)\n👁️ **Darshan:** Look into deity's eyes — receive divine gaze (Darshan = 'seeing'\n🪔 Hold flame of aarti with both hands, touch to eyes\n🍬 Accept and eat Prasad — never refuse or waste\n\n**What to bring:** Flowers · Coconut · Incense · Dakshina (offering) · Fresh fruit\n\n**When to visit:** Brahma Muhurat (4:53–5:38 AM) is most powerful. Also good: sunrise, noon, sunset\n\n**Days for specific temples:**\n🔱 Shiva temple: Mondays · 🐚 Vishnu temple: Thursdays · 🐘 Ganesha: Wednesdays · 🌸 Devi: Tuesdays/Fridays"},
  /* ── DURGA SAPTASHATI ── */
  {keys:["durga saptashati","devi mahatmya","chandi path","markandeya purana","devi stotra"],
   ans:"**📖 Durga Saptashati (Devi Mahatmya)**\n\n**What it is:** 700 verses from Markandeya Purana describing the glory of Goddess Durga. Also called Chandi Path, Devi Mahatmya.\n\n**Structure:** 3 Charitas (narratives) in 13 chapters:\n- **Prathama Charita:** Madhu-Kaitabha slaying (Mahakali aspect)\n- **Madhyama Charita:** Mahishasura Mardini (Mahalakshmi aspect)\n- **Uttara Charita:** Shumbha-Nishumbha slaying (Mahasaraswati aspect)\n\n**Most powerful verses:**\n🌺 *Ya Devi sarva bhutesu* — 'The Goddess present in all beings as [energy]'\n\n**When to recite:**\n🕉️ Navratri — recite 1 Saptashati daily for 9 days (complete cycle)\n📅 Every Ashtami and Navami\n🌙 During any crisis or need for protection\n\n**Benefits:** Removes all obstacles · Grants victory · Fulfills desires · Grants liberation"},
  /* ── VISHNU SAHASRANAMA ── */
  {keys:["vishnu sahasranama","thousand names","sahasranama","vishnu 1000 names"],
   ans:"**📿 Vishnu Sahasranama — 1000 Names of Vishnu**\n\n**Source:** Mahabharata (Anushasana Parva) — Bhishma recites to Yudhishthira from deathbed\n\n**Significance:** Reciting Vishnu Sahasranama once = chanting all Vedas once. The 1000 names describe Vishnu's infinite qualities.\n\n**First and last names:**\n🌟 **Vishwam** (the universe) is the first name\n🔱 **Sarvapraharanayudha** (armed with all weapons) is the last\n\n**Key names and meanings:**\n- Narayana = refuge of all beings\n- Madhava = husband of Lakshmi\n- Govinda = protector of cows/earth\n- Anantah = infinite\n- Purushottama = supreme person\n\n**When to recite:** Ekadashi · Thursdays · Purnima · Early morning\n\n**Benefits:** Removes all doshas · Grants liberation · Fulfills all desires\n\n**Gita Ch.8:9** — Krishna says chanting His names is the supreme path"},
  /* ── HOW TO BEGIN SPIRITUAL PRACTICE ── */
  {keys:["how to start","begin spirituality","spiritual beginner","how to meditate","start yoga","new to hinduism","what to do daily","morning routine vedic"],
   ans:"**🌅 Daily Vedic Spiritual Routine — Beginner's Guide**\n\n**Morning (Brahmamuhurta — 4:53–5:38 AM):**\n1. 🛌 Wake up. Mentally chant 'Om Namah Shivaya' before getting up\n2. 💧 Drink 1 glass of water\n3. 🧘 Sit for 5–10 min meditation or silent prayer\n4. 🌅 Surya Namaskar (12 rounds) or Yoga\n5. 🪔 Light a lamp or incense at home altar\n6. 📿 Chant one mantra 108 times (Gayatri, Om, Om Namah Shivaya, or deity mantra)\n\n**Evening (Sandhya — Sunset):**\n1. 🪔 Light lamp at home altar\n2. 📖 Read 5–10 minutes of Bhagavad Gita or scripture\n3. 📿 Evening japa (21 or 108 mantras)\n\n**Weekly practices:**\n- **Monday:** Shiva puja + Maha Mrityunjaya mantra\n- **Tuesday:** Hanuman Chalisa\n- **Wednesday:** Ganesha mantra\n- **Thursday:** Vishnu puja + Vishnu Sahasranama\n- **Friday:** Lakshmi puja\n- **Saturday:** Shani mantra + Hanuman Chalisa\n- **Sunday:** Surya Arghya + Gayatri mantra\n\n**Start simple:** Even 5 minutes daily of sincere prayer is transformative"},
  /* ── HOLI ── */
  {keys:["holi","holika","rangwali","festival of colors","colours","color festival"],
   ans:"**🎨 Holi — Festival of Colors 2026**\n\n📅 **Holika Dahan:** March 3, 2026 (bonfire night)\n📅 **Rangwali Holi:** March 4, 2026 (color celebration)\n📅 **Holi 2027:** ~March 22, 2027\n\n**Significance:** Celebrates the divine love of Radha and Krishna, victory of devotion over evil (Prahlad over Holika), and the arrival of spring.\n\n🔥 **Holika Dahan (Mar 3):**\nLight bonfire after sunset. Perform parikrama (circumambulation) 3 or 7 times. Roast grains in the fire. Pray for protection.\n\n🎨 **Rangwali Holi (Mar 4):**\nPlay with natural/herbal colors. Exchange sweets — gujiya, thandai. Visit temples of Radha-Krishna. Sing Holi songs (Faag).\n\n🕉️ **Mantras:** Om Namo Bhagavate Vasudevaya · Radhey Radhey\n\n**Most celebrated in:** Vrindavan, Mathura, Barsana (Lathmar Holi), Nandgaon"},
  /* ── MAHA SHIVARATRI ── */
  {keys:["shivaratri","maha shivaratri","shivratri","great night of shiva"],
   ans:"**🔱 Maha Shivaratri 2026**\n\n📅 **Date:** February 18, 2026 (Chaturdashi, Krishna Paksha, Magha)\n📅 **Maha Shivaratri 2027:** ~February 26, 2027\n\n**Significance:** Greatest festival of Lord Shiva — night when Shiva performed the Tandava dance and the Lingam manifested as infinite light column. Fasting and all-night vigil is prescribed.\n\n**How to Observe:**\n🌙 Fast all day — no food, water optional (Nirjala) or fruits/milk allowed\n🔱 Visit Shiva temple at all 4 prahar (3-hour watches) of night\n🌿 Offer: milk, curd, honey, belpatra (bilva leaves), dhatura, bhasma\n💧 Abhishek: Pour water, milk, gangajal on Shivalingam\n📿 Chant: Om Namah Shivaya 108× each prahar\n\n**4 Prahars of worship:**\n1. 6–9 PM · 2. 9 PM–12 AM · 3. 12–3 AM · 4. 3–6 AM\n\n🌅 Break fast next morning after sunrise puja.\n\n**Sacred sites:** Somnath, Mahakaleshwar, Kashi Vishwanath, Omkareshwar"},
  /* ── VASANT PANCHAMI ── */
  {keys:["vasant panchami","saraswati puja","basant panchami","spring festival"],
   ans:"**🌼 Vasant Panchami 2026**\n\n📅 **Date:** February 2, 2026\n📅 **Vasant Panchami 2027:** ~January 22, 2027\n\n**Significance:** Birthday of Goddess Saraswati — deity of knowledge, arts, and learning. Marks beginning of spring (Vasant Ritu). Auspicious to begin studies.\n\n**How to Celebrate:**\n🟡 Wear yellow clothes (colour of spring/turmeric)\n📚 Place books, instruments, pens on altar\n🌸 Offer yellow flowers, yellow sweets, yellow rice to Saraswati\n✏️ Vidyarambha — initiate children into learning on this day\n🎵 Practice music, art, or any skill\n📿 Mantra: Om Aim Saraswatyai Namah (108×)\n\n**Puja timing:** Morning is best. Schools and colleges perform Saraswati puja.\n\n**Also celebrated as:** Kite festival in many regions"},
  /* ── MAKAR SANKRANTI ── */
  {keys:["makar sankranti","sankranti","uttarayan","kite festival"],
   ans:"**☀️ Makar Sankranti 2026**\n\n📅 **Date:** January 14, 2026\n📅 **Makar Sankranti 2027:** ~January 14, 2027 (fixed solar date)\n\n**Significance:** Sun enters Capricorn (Makar). End of Dakshinayan — inauspicious period ends. Uttarayan begins — 6 months of auspicious northward sun journey. Most sacred time for holy dips.\n\n**How to Celebrate:**\n🪁 Fly kites (especially in Gujarat — called Uttarayan)\n🌊 Holy dip in rivers (Ganga, Godavari, Triveni Sangam)\n🍬 Eat: til-gur (sesame-jaggery), pongal, khichdi, til laddoo\n🌾 Donate: sesame seeds, blankets, khichdi, warm clothes\n☀️ Surya Arghya (water offering to Sun) at sunrise\n\n**Regional names:**\n- Pongal (Tamil Nadu: Jan 14–17)\n- Lohri (Punjab: Jan 13)\n- Bihu (Assam)\n- Khichdi Puja (UP/Bihar)\n\n**Best muhurat:** Sunrise to noon on Jan 14"},
  /* ── RAKSHA BANDHAN ── */
  {keys:["raksha bandhan","rakshabandhan","rakhi","brother sister"],
   ans:"**🧶 Raksha Bandhan 2026**\n\n📅 **Date:** August 3, 2026 (Shravan Purnima)\n📅 **Raksha Bandhan 2027:** ~August 23, 2027\n\n**Significance:** Sacred bond of protection between siblings. Sister ties rakhi on brother's wrist; brother pledges lifelong protection.\n\n**How to Celebrate:**\n🪔 Prepare puja thali with: rakhi thread, roli-chawal, diyas, sweets\n🙏 Sister performs aarti of brother\n🎗️ Ties rakhi on right wrist\n🍬 Feeds brother sweets\n🎁 Brother gives gifts and vows protection\n\n**Auspicious timing:** Avoid Bhadra (first half of day) — tie rakhi only after Bhadra ends\n\n**Also marks:** Nariyal Purnima (coconut offered to sea), Gamha Purnima (Odisha), Avani Avittam (Tamil Brahmin sacred thread renewal)"},
];
/* Month-name fast lookup */
const MONTH_KEYS=[["jan","january"],["feb","february"],["mar","march"],["apr","april"],["may"],
  ["jun","june"],["jul","july"],["aug","august"],["sep","september"],["oct","october"],["nov","november"],["dec","december"]];

/* Specific date lookup: checks FESTIVALS + SACRED_DATES for a matching date string */
function _lookupDate(monthNum, dayNum) {
  const MNAMES=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mShort=MNAMES[monthNum];
  const dateStr=`${mShort} ${dayNum}`;
  const fest=FESTIVALS.find(f=>f.date===dateStr);
  const sacred=SACRED_DATES.find(s=>s.date===dateStr);
  const parts=[];
  if(fest) parts.push(`**${fest.icon} ${fest.name}** (${fest.type==="major"?"Major Festival":"Festival"})\n${fest.desc}\n\n🙏 How to celebrate: ${fest.howTo}`);
  if(sacred) parts.push(`**${sacred.icon} ${sacred.name}**\n${sacred.desc}`);
  if(parts.length) return `**📅 ${dateStr}, 2026**\n\n${parts.join("\n\n")}`;
  return null;
}

function getMonthIndexFromQuery(low, fallbackMonth) {
  const names = MONTH_NAMES.map(m=>m.toLowerCase());
  for (let i = 0; i < names.length; i++) {
    const full = names[i];
    const short = full.slice(0,3);
    if (low.includes(full) || low.includes(short)) return i;
  }
  return fallbackMonth;
}

function buildMonthSacredResponse(monthIndex, fromDay=1) {
  const monthName = MONTH_NAMES[monthIndex];
  const sacred = IMPORTANT_DATES.filter(d=>d.month===monthIndex && d.day>=fromDay)
    .sort((a,b)=>a.day-b.day)
    .slice(0,12);
  const major = FESTIVALS.filter(f=>f.month===monthIndex && f.day>=fromDay)
    .sort((a,b)=>a.day-b.day);
  const dedup = new Map();
  for (const f of major) {
    const key = `${f.day}-${f.name.toLowerCase()}`;
    if (!dedup.has(key)) dedup.set(key, `${String(f.day).padStart(2,'0')} ${monthName} — ${f.icon} **${f.name}**`);
  }
  for (const d of sacred) {
    const key = `${d.day}-${d.name.toLowerCase()}`;
    if (!dedup.has(key)) dedup.set(key, `${String(d.day).padStart(2,'0')} ${monthName} — ${d.icon||'🪔'} **${d.name}**${d.desc ? ` · ${d.desc}` : ''}`);
  }
  const items = [...dedup.values()].slice(0,8);
  if (!items.length) return `**🗓️ ${monthName} 2026**

No more mapped sacred dates are currently stored for this month.`;
  return `**🗓️ Upcoming sacred dates — ${monthName} 2026**

${items.join('\n')}

These are only the **remaining** mapped dates for **${monthName}** from your selected location date context. Open the **Calendar** tab for the full ${monthName} month view.`;
}

function getAIReply(q, selectedLocation="austin", lang="English") {
  const low=String(q||"").toLowerCase().trim();
  const words=low.split(/\s+/).filter(w=>w.length>2);
  const cityMatch=LOCATION_OPTIONS.find(loc=>low.includes(loc.label.toLowerCase()));
  const activeLocation=(cityMatch?.key)||selectedLocation||"austin";
  const localDateKey=getLocalDateKeyForLocation(activeLocation);
  const local=getLocationPanchang(localDateKey, activeLocation);
  const meta=getLocationMeta(activeLocation);
  const localDate = new Date(localDateKey+"T12:00:00");
  const localMonth = localDate.getMonth();
  const localDay = localDate.getDate();

  /* Priority -2: month-specific sacred date requests */
  if ((low.includes("sacred") || low.includes("scared") || low.includes("festival") || low.includes("dates") || low.includes("days")) &&
      (low.includes("this month") || low.includes("current month") || low.includes("remaining this month") || low.includes("upcoming this month") || low.includes("rest of this month") || low.includes("left this month"))) {
    return buildMonthSacredResponse(localMonth, localDay);
  }
  if ((low.includes("sacred") || low.includes("scared") || low.includes("festival") || low.includes("important days") || low.includes("observances")) &&
      MONTH_NAMES.some(m=>low.includes(m.toLowerCase()) || low.includes(m.toLowerCase().slice(0,3)))) {
    const monthHit = getMonthIndexFromQuery(low, localMonth);
    const fromDay = monthHit===localMonth ? localDay : 1;
    return buildMonthSacredResponse(monthHit, fromDay);
  }

  /* Priority -1: current date / today queries */
  if(low.includes("today")&&(low.includes("festival")||low.includes("what is today")||low.includes("panchang today")||low.includes("today panchang")||low.includes("today here"))){
    return formatLocationToday(activeLocation);
  }
  if(words.some(w=>["today","tonight","now","current","aaj"].includes(w))){
    const nextFestivalName = local.nextFestival || "Rama Navami — Mar 26";
    if(nextFestivalName) return `${formatLocationToday(activeLocation)}

🎪 **Nearest major festival:** ${nextFestivalName}

Ask next: **What should I do today in ${meta.label}?** or **Is today good for travel in ${meta.label}?**`;
    return formatLocationToday(activeLocation);
  }
  /* Random mantra / shloka requests */

  if(low.includes("mantra")||(low.includes("shloka")||low.includes("sloka")||low.includes("verse")||low.includes("chant"))){
    if(low.includes("give")||low.includes("random")||low.includes("suggest")||low.includes("some")||low.includes("any")){
      const m=MANTRAS[Math.floor(Math.random()*MANTRAS.length)];
      return `**${m.icon} ${m.name}**\n🙏 Deity: ${m.deity} · Best time: ${m.bestTime}\n\n${getMantraDisplayText(m,lang)}\n\n**Romanized:** ${m.sanskrit}\n\n**Meaning:** ${m.meaning}\n**Benefits:** ${m.benefits}\n\nChant ${m.chants}× daily. Open Rituals → Mantra Library to chant with audio.`;
    }
  }
  /* Next Ekadashi */
  if((low.includes("add")&&low.includes("calendar"))||(low.includes("add all important dates")||low.includes("calendar pack")||low.includes("google calendar"))){
    return `**📅 Add important dates to your calendar**

Open the **Calendar** tab and use **One-tap calendar pack**. You can:
- add this month's important festivals + sacred days to **Google Calendar**
- download one **.ics** file for Apple / Outlook
- add the **full 2026 sacred calendar** in one step

The pack includes major festivals, Ekadashi, Pradosh, Purnima, Amavasya, Sankranti, Sankashti, Navratri markers, and other mapped observances.`;
  }
  if(low.includes("next ekadashi")||low.includes("ekadashi date")||(low.includes("ekadashi")&&(low.includes("when")||low.includes("next")))){
    return "**🌙 Upcoming Ekadashi Dates 2026**\n\nEkadashi occurs twice every lunar month (Shukla and Krishna paksha):\n\n📅 **Kamada Ekadashi:** April 6, 2026 (Shukla)\n📅 **Varuthini Ekadashi:** April 21, 2026 (Krishna)\n📅 **Mohini Ekadashi:** May 6, 2026 (Shukla)\n📅 **Apara Ekadashi:** May 20, 2026 (Krishna)\n📅 **Nirjala Ekadashi:** June 5, 2026 (most powerful — no water fast)\n📅 **Yogini Ekadashi:** June 19, 2026 (Krishna)\n📅 **Devshayani Ekadashi:** July 6, 2026 (Vishnu sleeps — Chaturmas begins)\n📅 **Kamika Ekadashi:** July 21, 2026\n📅 **Shravana Putrada:** August 4, 2026\n📅 **Aja Ekadashi:** August 18, 2026\n\n**Fasting rules:** Fast from sunset of Dashami. Break fast next morning on Dwadashi.\n**Allowed:** Fruits, milk, sabudana, sendha namak, nuts, potatoes\n**Avoid:** Grains, pulses, onion, garlic, meat";
  }
  /* Auspicious date check */
  if(low.includes("auspicious")||(low.includes("good day")||low.includes("shubh"))||(low.includes("is it good")||low.includes("is this good"))){
    return "**⭐ Auspiciousness — How to Check**\n\nFor any date to be truly auspicious, check:\n1. **Tithi** — Avoid 4th, 8th, 14th, 30th tithis for new work\n2. **Nakshatra** — Avoid Jyeshtha, Mula, Ashlesha for auspicious work\n3. **Yoga** — Avoid Vyatipata, Vaidhriti, Vishkambha\n4. **Vara (weekday)** — Tuesday and Saturday less ideal for new starts\n5. **Muhurat** — Check Rahu Kaal and Gulika Kaal timings\n\n**Best all-around auspicious days 2026:**\n⭐ Akshaya Tritiya (Apr 29) — most auspicious day of year\n⭐ Guru Purnima (Jul 10) — powerful for learning/starting\n⭐ Rohini Nakshatra days — always auspicious\n⭐ Pushya Nakshatra — best for purchases and ceremonies\n\n**Ask:** 'Is April 29 auspicious?' or 'Muhurat for marriage in May'";
  }

  /* Temple & Seva / nearby details */
  const templeCityMap={
    austin:{label:"Austin",temples:[
      ["Radha Madhav Dham, Driftwood","large Vaishnava campus, calm darshan, kirtan, and festival-scale gatherings"],
      ["Austin Hindu Temple","good all-around family temple for darshan, archana, and major festival visits"],
      ["Sri Shirdi Sai Baba Temple, Austin","helpful for Thursday darshan, annadanam, and volunteer-style seva"],
      ["BAPS Shri Swaminarayan Mandir, Round Rock area","organized family-friendly temple environment with major observance programming"]
    ]},
    chicago:{label:"Chicago",temples:[
      ["Lemont Hindu Temple","major community temple campus with broad deity coverage and strong festival programming"],
      ["ISKCON Chicago / Hare Krishna Temple","good for kirtan, Vaishnava darshan, prasadam, and Janmashtami-style visits"],
      ["Shri Swaminarayan Mandir, Bartlett area","family-friendly darshan with organized volunteer opportunities"],
      ["local Sai or Shiva temple near your suburb","useful for weekday darshan, simple seva, and smaller observance visits"]
    ]},
    houston:{label:"Houston",temples:[
      ["Sri Meenakshi Temple, Pearland","large South Indian temple ideal for full-day festival visits and family darshan"],
      ["BAPS Shri Swaminarayan Mandir, Stafford","excellent for organized seva, youth activities, and darshan"],
      ["Ashtalakshmi Temple","good for Lakshmi, Navratri, and family puja visits"],
      ["local ISKCON / Krishna temple","best for kirtan, prasadam, and Vaishnava festival attendance"]
    ]},
    newyork:{label:"New York",temples:[
      ["Ganesh Temple, Flushing","well-known temple for regular darshan, archana, and festival visits"],
      ["BAPS Shri Swaminarayan Mandir, Robbinsville visit plan","best if you can make a larger day trip with family"],
      ["local Sai or Durga temple in Queens / Long Island","good for practical weekly darshan and volunteer-style seva"],
      ["ISKCON NYC","strong for kirtan, Bhagavad Gita gatherings, and Vaishnava observances"]
    ]},
    "new york":{label:"New York",temples:[
      ["Ganesh Temple, Flushing","well-known temple for regular darshan, archana, and festival visits"],
      ["BAPS Shri Swaminarayan Mandir, Robbinsville visit plan","best if you can make a larger day trip with family"],
      ["local Sai or Durga temple in Queens / Long Island","good for practical weekly darshan and volunteer-style seva"],
      ["ISKCON NYC","strong for kirtan, Bhagavad Gita gatherings, and Vaishnava observances"]
    ]},
    mumbai:{label:"Mumbai",temples:[
      ["Siddhivinayak Temple","ideal for Ganesh devotion and early-morning darshan planning"],
      ["ISKCON Juhu","great for kirtan, prasadam, and family spiritual outings"],
      ["Babulnath Temple","strong Shiva focus for Pradosh and Shravan visits"],
      ["Mahalaxmi Temple","good for Friday darshan and Lakshmi-related observances"]
    ]},
    chennai:{label:"Chennai",temples:[
      ["Kapaleeshwarar Temple","strong Shiva observance option, especially for Pradosh and monthly vrata visits"],
      ["Parthasarathy Temple","excellent Vaishnava temple for festival mornings and family darshan"],
      ["Ashtalakshmi Temple","good for Lakshmi puja and seaside family temple visits"],
      ["ISKCON Chennai","useful for kirtan, prasadam, and Janmashtami or Gita-themed visits"]
    ]},
    varanasi:{label:"Varanasi",temples:[
      ["Kashi Vishwanath","prime Shiva darshan destination for major observances and pilgrim planning"],
      ["Sankat Mochan Hanuman Temple","best for Hanuman devotion, Tuesdays, and bhajan atmosphere"],
      ["Durga Kund Temple","helpful for Devi upasana and Navratri visits"],
      ["Assi / Dashashwamedh Ghat aarti plan","ideal for evening spiritual experience with family or pilgrims"]
    ]},
    delhi:{label:"Delhi",temples:[
      ["Akshardham","major spiritual campus ideal for family visits, evening light show, and cultural immersion"],
      ["Chhatarpur Mandir","large complex for Devi darshan and Navratri style visits"],
      ["ISKCON East of Kailash","strong for kirtan, Gita, and Janmashtami planning"],
      ["Hanuman Mandir, Connaught Place","practical central-city darshan option"]
    ]},
    agra:{label:"Agra",temples:[
      ["Mankameshwar Temple","strong Shiva temple for Pradosh and Shravan visits"],
      ["ISKCON Agra","good for kirtan, prasadam, and family darshan"],
      ["Balkeshwar Mahadev","practical local Shiva devotion option"],
      ["Nearby family temple plan","best for shorter darshan and seva planning"]
    ]},
    london:{label:"London",temples:[
      ["BAPS Shri Swaminarayan Mandir, Neasden","high-quality darshan and family cultural visit"],
      ["ISKCON Bhaktivedanta Manor","excellent for kirtan, Janmashtami, and seva"],
      ["Shree Ganapathy Temple, Wimbledon","good for regular puja and family darshan"],
      ["local community mandir near home","best for weekly worship and volunteering"]
    ]},
    dubai:{label:"Dubai",temples:[
      ["Dubai Hindu Temple","modern central option for darshan and festival visits"],
      ["Shiva and Krishna shrine visit plan","good for practical weekly worship"],
      ["community seva / food drive","helpful for donation and volunteer intent"],
      ["festival livestream option","useful when travel timing is tight"]
    ]},
    singapore:{label:"Singapore",temples:[
      ["Sri Mariamman Temple","historic temple for major observances"],
      ["Sri Srinivasa Perumal Temple","strong Vaishnava / festival visit option"],
      ["Sri Thendayuthapani Temple","good for Murugan-related observances"],
      ["local family temple route plan","ideal for shorter darshan plans"]
    ]},
    toronto:{label:"Toronto",temples:[
      ["BAPS Shri Swaminarayan Mandir","excellent organized family darshan and seva"],
      ["Richmond Hill Hindu Temple","broad deity coverage and community events"],
      ["ISKCON Toronto","strong kirtan and Vaishnava option"],
      ["local Sai / Devi temple near suburb","good weekly worship option"]
    ]}
  };
  const detectedTempleCity=(Object.keys(templeCityMap).find(city=>low.includes(city))||String(selectedLocation||"Austin").toLowerCase());
  if(low.includes("temple")||low.includes("seva")||low.includes("donation")||low.includes("darshan")||low.includes("livestream")||low.includes("suggest some locations")){
    const templePack=templeCityMap[detectedTempleCity]||templeCityMap.austin;
    const guidePack=CITY_GUIDES[detectedTempleCity]||CITY_GUIDES.austin;
    const mappedPlaces=(guidePack?.places||[]).slice(0,3).map(place=>`- **${place.name}** — ${place.note}\n  Maps: ${place.map}`).join("\n");
    const templeLines=templePack.temples.map(([name,desc])=>`- **${name}** — ${desc}`).join("\n");
    return `**🏛️ Temple & Seva Ideas — ${templePack.label}**

**Temples to consider:**
${templeLines}

**Quick place links:**
${mappedPlaces || "- Use Google Maps search for nearby Hindu temples and official temple websites."}

**Useful seva options:**
- sponsor prasad, flowers, ghee, or annadanam
- volunteer for cleanup, shoe area, prasadam, youth classes, or festival logistics
- support livestream, cultural classes, or food distribution
- carry a small donation and simple puja items for darshan days

**Practical planning details:**
- choose one temple for darshan and one backup option closer to home
- save parking/travel time in the calendar
- call ahead for festival timings, dress code, and archana tickets
- plan one seva action: donation, food service, volunteer hour, supplies, or livestream support

**Suggested next step for ${templePack.label}:**
Pick **1 darshan temple**, **1 seva action**, and **1 reminder** for the next festival.

Ask next: 'Plan a ${templePack.label} temple visit for Ram Navami' or 'Give me seva ideas in ${templePack.label} for Hanuman Jayanti'.`;
  }

  if(low.includes("daily guidance")||low.includes("what should i do today")||low.includes("today plan")||low.includes("guidance engine")){
    return `**🗓️ Daily Guidance Engine — ${meta.label}**

**Recommended today**
- **Best for prayer / japa:** ${local.brahmaMuhurat} and ${local.amritKaal}
- **Best for starting important work:** ${local.abhijit||"Use the clean midday window after checking Rahu Kaal"}
- **Best for travel / errands:** after ${local.yamaganda} and outside ${local.rahuKaal}
- **What to avoid:** Rahu Kaal ${local.rahuKaal} · Gulika Kaal ${local.gulikaKaal}

**Today's spiritual actions**
- Chant **Om Namah Shivaya** 108× or one short Gita verse
- Offer a simple diya or incense near sunrise / sunset
- Keep food/light routine sattvic if you are observing a vrata
- Do **one seva action**: donation, call parents, feed birds, support temple, or offer prasadam

**Why this is useful**
- **Tithi:** ${local.tithi.name}
- **Nakshatra:** ${local.nakshatra.name}
- **Yoga:** ${local.yoga.name}
- **Rashi focus:** ${local.rashi}

Ask next: **Give me today's mantra**, **Is today good for travel?**, or **Show my personalized Vedanta plan**.`;
  }

  if(low.includes("family sankalp")){
    return `**👨‍👩‍👧 Family Sankalp Plan**

**Shared family actions for the next observance:**
- add the festival to each family member's calendar
- assign one ritual role each: flowers, diya, mantra, prasad, cleanup
- set a reminder the evening before for clothes, groceries, and puja items
- include one kids-friendly learning point and one seva activity

**Weekly Family Sankalp structure:**
1. one short prayer together
2. one scripture line or story
3. one temple visit or livestream
4. one seva or donation action
5. one family meal linked to the observance

This mode is best when tied to shared reminders and a family dashboard.`;
  }

  if(low.includes("festival planner")||low.includes("next major festival")||low.includes("plan my next festival")){
    return `**🎉 Festival Planner**

For the next major festival, Vedanta AI should give:
- shopping checklist
- fasting guidance
- puja samagri list
- simple home ritual steps
- temple visit option
- mantra / audio recommendation
- family activity / kids explanation
- reminder schedule: 7 days, 2 days, same day

**Practical planner flow:**
1. learn what the festival means
2. gather items
3. set calendar reminders
4. choose temple vs home observance
5. prepare food / prasad plan
6. save mantra + aarti audio for the day`;
  }

  if(low.includes("future date ai")||low.includes("ask by date")||(low.includes("what falls on")&&(/[0-9]{4}/.test(low)))){
    return `**📅 Ask by Date**

Vedanta AI can become a date-first assistant. Users pick any future date and instantly get:
- tithi
- nakshatra
- major observances
- muhurat / caution windows
- what to do that day
- family / ritual suggestions

**Useful queries:**
- 'What falls on June 12, 2027?'
- 'Is Oct 19, 2027 good for wedding planning?'
- 'What is special about Kartik Purnima this year?'`;
  }

  if(low.includes("life event")||low.includes("wedding")||low.includes("marriage")||low.includes("housewarming")||low.includes("griha pravesh")||low.includes("surgery")||low.includes("travel")){
    return `**🧿 Life Event Engine**

For major life events, Vedanta AI should evaluate:
- tithi suitability
- nakshatra suitability
- weekday impact
- Rahu Kaal / Gulika avoidance
- supportive muhurat windows
- practical notes for the user's city

**Best use cases:** wedding planning, griha pravesh, starting a business, surgery timing discussion, travel, education, or contract signing.

Ask something specific like:
- 'Is April 29 good for griha pravesh?'
- 'Best dates for travel next month in ${selectedLocation}'
- 'Marriage muhurat options in 2026'`;
  }


  if(low.includes("personalized")||low.includes("personalisation")||low.includes("personalization")||low.includes("rashi profile")||low.includes("hyper-personalized")||low.includes("profile")){
    return `**🧠 Personalized Vedanta AI**

A strong profile layer can adapt guidance using:
- city / timezone
- rashi
- language
- goals: health, learning, family, spirituality, prosperity
- tradition preference: Smarta, Vaishnava, ISKCON, Tamil, Telugu, Gujarati, North Indian

Then the app can tailor mantra suggestions, daily actions, temple ideas, and festival reminders to the user instead of showing one generic answer.`;
  }

  if(low.includes("auspicious score")||low.includes("score today")||low.includes("how auspicious")){
    return `**📊 Auspicious Score**

Vedanta AI can rate the day on a simple 10-point scale using tithi, nakshatra, yoga, weekday, and caution windows.

**Example output:**
- overall day score: 7.8 / 10
- best for: prayer, study, planning, donation
- avoid for: first-time commitments during Rahu Kaal
- best window: Brahma Muhurat / Abhijit if available

This makes the app more actionable and shareable for users.`;
  }

  /* Priority 0: specific date — "april 5", "5th april", "oct 20", "20 october" etc */
  const MMAP={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,
    june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,october:9,oct:9,november:10,nov:10,december:11,dec:11};
  /* find the LONGEST matching month name to avoid "jan" matching "january" before "jan" gets correct priority */
  let matchedMonth=-1;
  let longestMatch="";
  for(const [mname,mnum] of Object.entries(MMAP)){
    if(low.includes(mname) && mname.length>longestMatch.length){ longestMatch=mname; matchedMonth=mnum; }
  }
  if(matchedMonth>=0){
    const dayMatch=low.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/);
    if(dayMatch){
      const day=parseInt(dayMatch[1]);
      if(day>=1&&day<=31){
        const dateResult=_lookupDate(matchedMonth,day);
        if(dateResult) return dateResult;
        /* Date exists but no specific event — return month overview with note */
        const MNAMES=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const MFULL=["January","February","March","April","May","June","July","August","September","October","November","December"];
        return `**📅 ${MFULL[matchedMonth]} ${day}, 2026**\n\nNo major Hindu festival listed on this specific date.\n\nSee what's happening in ${MFULL[matchedMonth]} 2026 — ask me: **"What is in ${MFULL[matchedMonth]}?"**`;
      }
    }
  }

  /* Priority 1: specific festival name check (FESTIVALS array) — 2026 AND 2027 aware */
  const FEST_2027_DATES={
    "diwali":"~Nov 8, 2027","navratri":"~Oct 10–19, 2027","janmashtami":"~Aug 4, 2027",
    "ganesh chaturthi":"~Aug 14, 2027","dussehra":"~Oct 19, 2027","ram navami":"~Apr 25, 2027",
    "hanuman jayanti":"~May 5, 2027","akshaya tritiya":"~Apr 30, 2027","guru purnima":"~Jul 28, 2027",
    "rath yatra":"~Jul 14, 2027","chhath puja":"~Oct 23, 2027","buddha purnima":"~May 1, 2027",
  };
  const MUHURAT_2027_DATES={
    "holi":"~Mar 22, 2027","maha shivaratri":"~Feb 26, 2027","vasant panchami":"~Jan 22, 2027",
    "makar sankranti":"~Jan 14, 2027","pongal":"~Jan 14–17, 2027","baisakhi":"~Apr 14, 2027",
    "raksha bandhan":"~Aug 23, 2027","karva chauth":"~Oct 31, 2027","onam":"~Sep 4, 2027",
    "diwali":"~Nov 8, 2027","navratri":"~Oct 10–19, 2027","chhath puja":"~Oct 23, 2027",
    "dussehra":"~Oct 19, 2027","janmashtami":"~Aug 4, 2027","ganesh chaturthi":"~Aug 14, 2027",
    "ram navami":"~Apr 25, 2027","guru purnima":"~Jul 28, 2027","akshaya tritiya":"~Apr 30, 2027",
  };
  const is2027=low.includes("2027");
  const is2028=low.includes("2028");
  const MUHURAT_2028_DATES={
    "holi":"~Mar 11, 2028","maha shivaratri":"~Feb 14, 2028","diwali":"~Oct 27, 2028",
    "janmashtami":"~Aug 23, 2028","navratri":"~Sep 28 – Oct 7, 2028","ganesh chaturthi":"~Sep 2, 2028",
  };

  const festHitEarly=FESTIVALS.find(f=>{
    const fn=f.name.toLowerCase();
    return low.includes(fn)||fn.split(" ").some(w=>w.length>3&&low.includes(w));
  });
  if(festHitEarly){
    if(is2027){
      const fn2027=festHitEarly.name.toLowerCase();
      const d2027=Object.entries(FEST_2027_DATES).find(([k])=>fn2027.includes(k)||k.includes(fn2027.split(" ")[0]))?.[1]||"~Similar timing as 2026";
      return `**${festHitEarly.icon} ${festHitEarly.name} 2027**\n\n📅 **Approximate 2027 Date:** ${d2027}\n\n${festHitEarly.desc}\n\n🙏 **How to Celebrate:**\n${festHitEarly.howTo}\n\n⚠️ *2027 dates are lunar calendar estimates. Exact tithi confirmed in printed panchang after Oct 2026.*`;
    }
    if(is2028){
      const fn2028=festHitEarly.name.toLowerCase();
      const d2028=Object.entries(MUHURAT_2028_DATES).find(([k])=>fn2028.includes(k)||k.includes(fn2028.split(" ")[0]))?.[1]||"~To be confirmed in 2028 panchang";
      return `**${festHitEarly.icon} ${festHitEarly.name} 2028**\n\n📅 **Approximate 2028 Date:** ${d2028}\n\n${festHitEarly.desc}\n\n⚠️ *2028 dates are approximate estimates only.*`;
    }
    return `**${festHitEarly.icon} ${festHitEarly.name}**\n📅 Date: ${festHitEarly.date} 2026 · ${festHitEarly.days} days away\n📿 ${festHitEarly.vedic||""}\n\n${festHitEarly.desc}\n\n🙏 **How to Celebrate:**\n${festHitEarly.howTo}\n\n💡 Ask me about the full **${["January","February","March","April","May","June","July","August","September","October","November","December"][festHitEarly.month]}** calendar for more!`;
  }

  /* Priority 1b: festival name in MUHURAT_DATA — covers Holi, Maha Shivaratri, Makar Sankranti etc
     that are NOT in the FESTIVALS array but ARE in our knowledge base */
  const muhuratFestHit=MUHURAT_DATA.find(m=>{
    const mn=m.name.toLowerCase();
    return low.includes(mn)||mn.split(" ").some(w=>w.length>3&&low.includes(w));
  });
  if(muhuratFestHit){
    if(is2027){
      const mn2027=muhuratFestHit.name.toLowerCase();
      const d2027=Object.entries(MUHURAT_2027_DATES).find(([k])=>mn2027===k||mn2027.includes(k)||k.includes(mn2027.split(" ").filter(w=>w.length>3)[0]||mn2027))?.[1]||"~Similar timing as 2026";
      return `**${muhuratFestHit.icon} ${muhuratFestHit.name} 2027**\n\n📅 **Approximate 2027 Date:** ${d2027}\n\n${muhuratFestHit.desc}\n\n⚠️ *2027 dates are lunar calendar estimates. Exact tithi confirmed in printed panchang after Oct 2026.*`;
    }
    if(is2028){
      const mn2028=muhuratFestHit.name.toLowerCase();
      const d2028=Object.entries(MUHURAT_2028_DATES).find(([k])=>mn2028===k||mn2028.includes(k))?.[1]||"~Confirmed in 2028 panchang";
      return `**${muhuratFestHit.icon} ${muhuratFestHit.name} 2028**\n\n📅 **Approximate 2028 Date:** ${d2028}\n\n${muhuratFestHit.desc}\n\n⚠️ *2028 dates are approximate estimates only.*`;
    }
    return `**${muhuratFestHit.icon} ${muhuratFestHit.name}**\n\n${muhuratFestHit.desc}\n\n**Best time:** ${muhuratFestHit.bestTime||"Varies"}`;
  }

  /* Priority 2: exact key match in AI_KB */
  for(const item of AI_KB){ if(item.keys.some(k=>low.includes(k))) return item.ans; }

  /* Priority 3: month overview */
  for(let i=0;i<MONTH_KEYS.length;i++){
    if(MONTH_KEYS[i].some(k=>low.includes(k))){
      const entry=AI_KB.find(e=>e.keys.includes(MONTH_KEYS[i][0])||e.keys.some(k=>MONTH_KEYS[i].includes(k)));
      if(entry) return entry.ans;
    }
  }

  /* Priority 3b: future year queries — MUST come before Priority 4 "when" handler */
  if(is2027){
    return "**Hindu Calendar 2027 — Key Dates**\n\n📅 Approximate dates (exact panchang published late 2026):\n\n🌼 **Vasant Panchami:** ~Jan 22, 2027\n☀️ **Makar Sankranti:** ~Jan 14, 2027\n🔱 **Maha Shivaratri:** ~Feb 26, 2027\n🎨 **Holi:** ~Mar 22, 2027\n🏹 **Ram Navami:** ~Apr 25, 2027\n🐒 **Hanuman Jayanti:** ~May 5, 2027\n⭐ **Akshaya Tritiya:** ~Apr 30, 2027\n📚 **Guru Purnima:** ~Jul 28, 2027\n🧶 **Raksha Bandhan:** ~Aug 23, 2027\n🎭 **Janmashtami:** ~Aug 4, 2027\n🐘 **Ganesh Chaturthi:** ~Aug 14, 2027\n🕉️ **Navratri:** ~Oct 10–19, 2027\n⚔️ **Dussehra:** ~Oct 19, 2027\n🌕 **Karva Chauth:** ~Oct 31, 2027\n🪔 **Diwali:** ~Nov 8, 2027\n📿 **Gita Jayanti:** ~Dec 5, 2027\n\n💡 Ask me about a specific festival: 'When is Holi in 2027?' or 'Diwali 2027 date'\n⚠️ *Exact dates per lunar panchang — consult printed almanac after Oct 2026.*";
  }
  if(is2028){
    return "**Hindu Calendar 2028 — Key Dates (Approximate)**\n\n🔱 **Maha Shivaratri:** ~Feb 14, 2028\n🎨 **Holi:** ~Mar 11, 2028\n🏹 **Ram Navami:** ~Apr 13, 2028\n🎭 **Janmashtami:** ~Aug 23, 2028\n🐘 **Ganesh Chaturthi:** ~Sep 2, 2028\n🕉️ **Navratri:** ~Sep 28 – Oct 7, 2028\n⚔️ **Dussehra:** ~Oct 7, 2028\n🪔 **Diwali:** ~Oct 27, 2028\n\n⚠️ *2028 dates are preliminary estimates — exact dates confirmed closer to the year.*";
  }

  /* Priority 4: upcoming / next / coming — only if no specific festival was named */
  if(words.some(w=>["next","upcoming","coming","soon","future","list","all","show"].includes(w))||
     (low.includes("when")&&!festHitEarly&&!muhuratFestHit)){
    const upcoming=FESTIVALS.filter(f=>f.days>0).sort((a,b)=>a.days-b.days).slice(0,7);
    if(upcoming.length){
      const lines=upcoming.map(f=>`${f.icon} **${f.name}** — ${f.date} 2026 (in ${f.days} days)`).join("\n");
      return `**📅 Upcoming Hindu Festivals 2026**\n\n${lines}\n\nAsk me about any festival by name for details!\n💡 For 2027 dates, ask: 'Hindu calendar 2027' or 'When is Holi in 2027?'`;
    }
  }

  /* Priority 6: word-level match in MUHURAT_DATA */
  const muhuratHit=MUHURAT_DATA.find(m=>{
    const mn=m.name.toLowerCase(), md=m.desc.toLowerCase();
    return low.includes(mn)||mn.split(" ").some(w=>w.length>3&&low.includes(w))||
      words.some(w=>w.length>3&&(mn.includes(w)||md.includes(w)));
  });
  if(muhuratHit) return `**${muhuratHit.icon} ${muhuratHit.name}**\n\n${muhuratHit.desc}\n\n**Best time:** ${muhuratHit.bestTime||"Varies"}`;

  /* Priority 7: mantra name / deity word match */
  const mantraHit=MANTRAS.find(m=>{
    const mn=m.name.toLowerCase(), md=m.deity.toLowerCase();
    return low.includes(mn)||mn.split(" ").some(w=>w.length>3&&low.includes(w))||
      words.some(w=>w.length>3&&(mn.includes(w)||md.includes(w)));
  });
  if(mantraHit) return `**${mantraHit.icon} ${mantraHit.name}**\n🙏 Deity: ${mantraHit.deity} · Best time: ${mantraHit.bestTime}\n\n${mantraHit.devnagari}\n\n**Romanized:** ${mantraHit.sanskrit}\n\n**Meaning:** ${mantraHit.meaning}\n**Benefits:** ${mantraHit.benefits}\n\nChant ${mantraHit.chants}× daily. Open Rituals → Mantra Library to chant with audio.`;

  /* Priority 8: loose word search MUHURAT_DATA */
  const looseHit=MUHURAT_DATA.find(m=>words.some(w=>w.length>3&&(m.name.toLowerCase().includes(w)||m.desc.toLowerCase().includes(w))));
  if(looseHit) return `**${looseHit.icon} ${looseHit.name}**\n\n${looseHit.desc}\n\n**Best time:** ${looseHit.bestTime||"Varies"}`;

  /* Default — comprehensive help */
  return "**Namaste! 🙏 I am your Vedanta Calendar AI**\n\nAsk me anything about Hindu religion, festivals, and traditions:\n\n📅 **Festival dates** — 'When is Diwali?' · 'Holi 2026 date' · 'Navratri schedule'\n📆 **Monthly calendar** — 'What is in October?' · 'June 2026 festivals'\n📅 **Specific dates** — 'What is on October 20?' · 'April 29 2026'\n⏰ **Muhurats** — 'Best time for travel' · 'Marriage muhurat 2026'\n🔱 **Deities** — 'Tell me about Shiva' · 'Vishnu avatars' · 'Ganesha puja'\n📿 **Mantras** — 'Gayatri mantra' · 'Maha Mrityunjaya' · 'Om Namah Shivaya'\n⭐ **Nakshatras** — 'What is Rohini?' · 'Pushya nakshatra meaning'\n📚 **Scriptures** — 'Bhagavad Gita' · 'Upanishads' · 'Ramayana'\n🌊 **Sacred places** — 'Varanasi' · 'Tirupati' · 'Vrindavan pilgrimage'\n🔮 **Remedies** — 'Shani remedy' · 'Mangal dosha fix' · 'Pitru dosha'\n📖 **Philosophy** — 'What is karma?' · 'Explain dharma' · 'Types of yoga'\n\n**Try:** 'When is Ganesh Chaturthi?' or 'What happens in August 2026?'";
}

function safeGetAIReply(q, selectedLocation="austin", lang="English") {
  try {
    const reply = getAIReply(q, selectedLocation, lang);
    if (typeof reply === "string" && reply.trim()) return reply;
    return "**Vedanta AI is still thinking.**\n\nI could not generate a complete answer for that question yet. Try asking in a simpler form such as:\n- **What is today in Austin?**\n- **When is next Ekadashi?**\n- **Show temple and seva ideas nearby**\n- **What falls on March 26, 2026?**";
  } catch (err) {
    console.error("safeGetAIReply failed", err);
    return "**Vedanta AI hit a temporary error.**\n\nPlease try again with a shorter question, or ask one of these:\n- **What is today in Austin?**\n- **What are the upcoming sacred dates this month?**\n- **When is next Ekadashi?**\n- **Give me a mantra**";
  }
}

function renderMD(t){ return t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br/>"); }

const MONTH_NAMES=["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const INNOVATION_IDEAS=[
  {title:"Daily Guidance Engine",desc:"See what to do today, what to avoid, and the best spiritual action windows.",prompt:"Give me today's full Vedanta plan with best times, cautions, mantra, and one seva action."},
  {title:"Personalized Vedanta",desc:"Adapt guidance by city, rashi, goals, language, and tradition preference.",prompt:"Show how Vedanta AI can personalize guidance by city, rashi, language, and spiritual goals."},
  {title:"Family Sankalp",desc:"Plan shared family observances, reminders, and puja prep together.",prompt:"Show me a Family Sankalp plan for the next 30 days with festivals, fasting reminders, puja preparation, and practical next steps."},
  {title:"Tradition Mode",desc:"Compare Smarta, Vaishnava, ISKCON, Tamil, Telugu, Gujarati, and North Indian observance styles.",prompt:"Explain how this festival may vary across Smarta, Vaishnava, ISKCON, Tamil, Telugu, Gujarati, and North Indian traditions."},
  {title:"Festival Planner",desc:"Get a checklist, fasting plan, mantra support, and simple puja flow for a festival.",prompt:"Create a simple festival planner with checklist, fasting tips, mantras, and puja steps for the next major festival."},
  {title:"Temple & Seva",desc:"Discover nearby darshan, temple location ideas, livestream, donation, and seva options for major observances.",prompt:"For the next major Hindu festival, suggest temple locations, visit planning, livestream, donation, and seva ideas in Austin."},
  {title:"Ask by Date",desc:"Pick any future date and ask what falls on it, why it matters, and what to do.",prompt:"Show me how Ask by Date works for June 12, 2027 with tithi, observances, and guidance."},
  {title:"Life Event Engine",desc:"Check dates for marriage, griha pravesh, travel, surgery, or starting new work.",prompt:"Explain how Vedanta AI can help with marriage, griha pravesh, travel, surgery, and other life-event date checks."},
  {title:"Auspicious Score",desc:"Rate the day with a simple score and explain the best uses of the day.",prompt:"Show an auspicious score for today and explain what the day is best used for."},
  {title:"Fasting Companion",desc:"Get meal rules, parana reminders, allowed foods, and city-aware sunrise break-fast guidance.",prompt:"Show a Fasting Companion plan for the next Ekadashi with allowed foods, parana timing, and reminders."},
  {title:"Festival Countdown",desc:"See preparation timelines, shopping reminders, puja items, and family task assignments before a festival.",prompt:"Build a festival countdown plan for the next major observance with reminders, shopping, and family tasks."},
  {title:"Kids Vedanta",desc:"Turn festivals into simple stories, learning cards, and family-friendly explanations.",prompt:"Explain the next major Hindu festival to a child in a simple story format with 3 fun learning points."},
  {title:"One-Tap Calendar Pack",desc:"Add this month or the full year of sacred dates to Google, Apple, or Outlook in one step.",prompt:"Explain how the One-Tap Calendar Pack helps users add this month or all major sacred dates to their calendar without missing anything."},
  {title:"Temple Trip Planner",desc:"Build a practical darshan plan with route, time, parking, dress code, and offerings to carry.",prompt:"Create a Temple Trip Planner for this weekend with a temple visit plan, what to carry, parking tips, and seva ideas."},
  {title:"Puja Prep Lists",desc:"Generate shopping lists, samagri checklists, and family task assignments before major observances.",prompt:"Build a puja preparation checklist for the next major festival with samagri, shopping tasks, and preparation reminders."},
  {title:"Audio Intelligence",desc:"Create morning chant playlists, evening aarti flow, and language-matched audio suggestions.",prompt:"Create a morning chant playlist and an evening aarti flow in my selected language with audio suggestions."},
  {title:"Shared Family Calendar",desc:"Let parents and family members coordinate fasting, puja prep, and sacred-date reminders together.",prompt:"Show how a shared family calendar should work for upcoming sacred dates, family reminders, and kids-friendly explanations."},
];
const IMPORTANT_DATES=[
  {month:0,day:6,name:"Saphala Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:0,day:10,name:"Pradosh Vrat",icon:"🔱",color:"#8855FF",type:"vrat",source:"observance",desc:"Twilight Shiva vrata."},
  {month:0,day:13,name:"Purnima",icon:"🌕",color:"#FFB300",type:"purnima",source:"observance",desc:"Full Moon observance."},
  {month:0,day:14,name:"Makar Sankranti",icon:"☀️",color:"#FF8C00",type:"festival",source:"observance",desc:"Sun enters Makara; harvest and Uttarayan observance."},
  {month:0,day:21,name:"Pausha Putrada Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:0,day:25,name:"Pradosh Vrat",icon:"🔱",color:"#8855FF",type:"vrat",source:"observance",desc:"Twilight Shiva vrata."},
  {month:0,day:29,name:"Amavasya",icon:"🌑",color:"#9696BC",type:"amavasya",source:"observance",desc:"New Moon observance."},
  {month:1,day:2,name:"Vasant Panchami",icon:"🌼",color:"#FFCA28",type:"festival",source:"observance",desc:"Saraswati worship and spring festival."},
  {month:1,day:5,name:"Jaya Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:1,day:9,name:"Pradosh Vrat",icon:"🔱",color:"#8855FF",type:"vrat",source:"observance",desc:"Twilight Shiva vrata."},
  {month:1,day:12,name:"Purnima",icon:"🌕",color:"#FFB300",type:"purnima",source:"observance",desc:"Full Moon observance."},
  {month:1,day:18,name:"Maha Shivaratri",icon:"🔱",color:"#9C27B0",type:"festival",source:"observance",desc:"Great night of Shiva."},
  {month:1,day:19,name:"Vijaya Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:1,day:23,name:"Pradosh Vrat",icon:"🔱",color:"#8855FF",type:"vrat",source:"observance",desc:"Twilight Shiva vrata."},
  {month:1,day:28,name:"Amavasya",icon:"🌑",color:"#9696BC",type:"amavasya",source:"observance",desc:"New Moon observance."},
  {month:2,day:3,name:"Holika Dahan",icon:"🔥",color:"#FF7043",type:"festival",source:"observance",desc:"Bonfire eve of Holi."},
  {month:2,day:4,name:"Holi",icon:"🎨",color:"#EC407A",type:"festival",source:"observance",desc:"Festival of colors."},
  {month:2,day:7,name:"Amalaki Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:2,day:10,name:"Pradosh Vrat",icon:"🔱",color:"#8855FF",type:"vrat",source:"observance",desc:"Twilight Shiva vrata."},
  {month:2,day:14,name:"Purnima",icon:"🌕",color:"#FFB300",type:"purnima",source:"observance",desc:"Full Moon observance."},
  {month:2,day:17,name:"Sankashti Chaturthi",icon:"🐘",color:"#FF7043",type:"vrat",source:"observance",desc:"Ganesha fasting day after full moon."},
  {month:2,day:25,name:"Papamochani Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:2,day:28,name:"Amavasya",icon:"🌑",color:"#9696BC",type:"amavasya",source:"observance",desc:"New Moon observance."},
  {month:3,day:6,name:"Kamada Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:3,day:9,name:"Pradosh Vrat",icon:"🔱",color:"#8855FF",type:"vrat",source:"observance",desc:"Twilight Shiva vrata."},
  {month:3,day:12,name:"Hanuman Jayanti",icon:"🐒",color:"#FF6F00",type:"festival",source:"observance",desc:"Hanuman birth observance."},
  {month:3,day:13,name:"Purnima",icon:"🌕",color:"#FFB300",type:"purnima",source:"observance",desc:"Full Moon observance."},
  {month:3,day:21,name:"Varuthini Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:3,day:27,name:"Amavasya",icon:"🌑",color:"#9696BC",type:"amavasya",source:"observance",desc:"New Moon observance."},
  {month:4,day:1,name:"Akshaya Tritiya",icon:"💛",color:"#FFCA28",type:"festival",source:"observance",desc:"Highly auspicious day for charity, purchases, and new beginnings."},
  {month:4,day:5,name:"Mohini Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:4,day:12,name:"Buddha Purnima",icon:"🪷",color:"#29B6F6",type:"festival",source:"observance",desc:"Buddha Jayanti / Vaishakh Purnima."},
  {month:4,day:20,name:"Apara Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:4,day:26,name:"Shani Jayanti",icon:"🪐",color:"#607D8B",type:"festival",source:"observance",desc:"Traditional observance connected with Shani."},
  {month:5,day:4,name:"Nirjala Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Most powerful waterless Ekadashi fast."},
  {month:5,day:10,name:"Vat Purnima",icon:"🌳",color:"#66BB6A",type:"festival",source:"observance",desc:"Married women pray for family wellbeing."},
  {month:5,day:18,name:"Yogini Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:6,day:4,name:"Devshayani Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Start of Chaturmas observance."},
  {month:6,day:10,name:"Guru Purnima",icon:"🧡",color:"#FFB300",type:"festival",source:"observance",desc:"Honor guru, teachers, and lineage."},
  {month:6,day:14,name:"Sankashti Chaturthi",icon:"🐘",color:"#FF7043",type:"vrat",source:"observance",desc:"Ganesha fasting day after full moon."},
  {month:6,day:19,name:"Kamika Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:7,day:3,name:"Shravana Putrada Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:7,day:9,name:"Raksha Bandhan",icon:"🎀",color:"#EC407A",type:"festival",source:"observance",desc:"Bond of protection and sibling love."},
  {month:7,day:16,name:"Aja Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:7,day:26,name:"Hartalika Teej",icon:"🌺",color:"#F06292",type:"festival",source:"observance",desc:"Parvati vrata and women's observance."},
  {month:8,day:1,name:"Parivartini Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:8,day:7,name:"Anant Chaturdashi",icon:"🕉️",color:"#26A69A",type:"festival",source:"observance",desc:"Anant vrata and Ganesh visarjan period."},
  {month:8,day:14,name:"Purnima",icon:"🌕",color:"#FFB300",type:"purnima",source:"observance",desc:"Full Moon observance."},
  {month:8,day:17,name:"Indira Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi during Pitru Paksha."},
  {month:8,day:21,name:"Mahalaya Amavasya",icon:"🌑",color:"#9696BC",type:"amavasya",source:"observance",desc:"Important ancestor remembrance new moon."},
  {month:9,day:1,name:"Sharad Navratri Begins",icon:"🪔",color:"#FF7040",type:"festival",source:"observance",desc:"Navratri day 1 begins."},
  {month:9,day:2,name:"Navratri Day 2",icon:"🪔",color:"#FF7040",type:"festival",source:"observance",desc:"Navratri day 2."},
  {month:9,day:3,name:"Navratri Day 3",icon:"🪔",color:"#FF7040",type:"festival",source:"observance",desc:"Navratri day 3."},
  {month:9,day:4,name:"Navratri Day 4",icon:"🪔",color:"#FF7040",type:"festival",source:"observance",desc:"Navratri day 4."},
  {month:9,day:5,name:"Navratri Day 5",icon:"🪔",color:"#FF7040",type:"festival",source:"observance",desc:"Navratri day 5."},
  {month:9,day:6,name:"Navratri Day 6",icon:"🪔",color:"#FF7040",type:"festival",source:"observance",desc:"Navratri day 6."},
  {month:9,day:7,name:"Navratri Day 7",icon:"🪔",color:"#FF7040",type:"festival",source:"observance",desc:"Navratri day 7."},
  {month:9,day:8,name:"Durga Ashtami",icon:"🗡️",color:"#EF5350",type:"festival",source:"observance",desc:"Navratri day 8 / Durga Ashtami."},
  {month:9,day:9,name:"Maha Navami",icon:"🪔",color:"#AB47BC",type:"festival",source:"observance",desc:"Navratri day 9 / Maha Navami."},
  {month:9,day:10,name:"Dussehra",icon:"🏹",color:"#FF9800",type:"festival",source:"observance",desc:"Victory of dharma."},
  {month:9,day:17,name:"Papankusha Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:10,day:1,name:"Karwa Chauth",icon:"🌙",color:"#F06292",type:"festival",source:"observance",desc:"Married women observe moonrise fast."},
  {month:10,day:8,name:"Rama Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:10,day:13,name:"Dhanteras",icon:"🪙",color:"#FFCA28",type:"festival",source:"observance",desc:"Auspicious buying, lamps, and Lakshmi preparation."},
  {month:10,day:14,name:"Naraka Chaturdashi",icon:"🔥",color:"#FF7043",type:"festival",source:"observance",desc:"Choti Diwali observance."},
  {month:10,day:15,name:"Diwali / Lakshmi Puja",icon:"🪔",color:"#FFC107",type:"festival",source:"observance",desc:"Major festival of lights."},
  {month:10,day:16,name:"Govardhan Puja",icon:"⛰️",color:"#8BC34A",type:"festival",source:"observance",desc:"Annakut and Govardhan worship."},
  {month:10,day:17,name:"Bhai Dooj",icon:"🎁",color:"#EC407A",type:"festival",source:"observance",desc:"Sibling festival after Diwali."},
  {month:10,day:22,name:"Devutthana Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Vishnu awakens; auspicious marriages resume."},
  {month:11,day:3,name:"Mokshada Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Gita Jayanti associated Ekadashi."},
  {month:11,day:6,name:"Gita Jayanti",icon:"📘",color:"#5BA4F5",type:"festival",source:"observance",desc:"Bhagavad Gita remembrance."},
  {month:11,day:14,name:"Purnima",icon:"🌕",color:"#FFB300",type:"purnima",source:"observance",desc:"Full Moon observance."},
  {month:11,day:18,name:"Sankashti Chaturthi",icon:"🐘",color:"#FF7043",type:"vrat",source:"observance",desc:"Ganesha fasting day after full moon."},
  {month:11,day:19,name:"Saphala Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:2,day:21,name:"Papamochani Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:2,day:21,name:"Chaitra Navratri Begins",icon:"🕉️",color:"#E91E8C",type:"festival",source:"observance",desc:"Nine nights of Devi worship begin."},
  {month:2,day:25,name:"Ashoka Ashtami",icon:"🪷",color:"#E91E8C",type:"festival",source:"observance",desc:"Important Devi observance during Chaitra Navratri."},
  {month:2,day:25,name:"Masik Durgashtami",icon:"⚔️",color:"#E91E8C",type:"observance",source:"observance",desc:"Monthly Durga Ashtami vrata."},
  {month:2,day:25,name:"Pradosh Vrat",icon:"🔱",color:"#8855FF",type:"vrat",source:"observance",desc:"Twilight Shiva vrata."},
  {month:2,day:29,name:"Amavasya",icon:"🌑",color:"#9696BC",type:"amavasya",source:"observance",desc:"New Moon observance."},
  {month:3,day:4,name:"Pradosh Vrat",icon:"🔱",color:"#8855FF",type:"vrat",source:"observance",desc:"Twilight Shiva vrata."},
  {month:3,day:6,name:"Kamada Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:3,day:12,name:"Purnima",icon:"🌕",color:"#FFB300",type:"purnima",source:"observance",desc:"Full Moon observance."},
  {month:3,day:15,name:"Amavasya",icon:"🌑",color:"#9696BC",type:"amavasya",source:"observance",desc:"New Moon observance."},
  {month:3,day:21,name:"Varuthini Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:4,day:6,name:"Mohini Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:4,day:18,name:"Shani Jayanti",icon:"⚫",color:"#616161",type:"observance",source:"observance",desc:"Special Shani observance."},
  {month:4,day:19,name:"Pradosh Vrat",icon:"🔱",color:"#8855FF",type:"vrat",source:"observance",desc:"Twilight Shiva vrata."},
  {month:4,day:26,name:"Amavasya",icon:"🌑",color:"#9696BC",type:"amavasya",source:"observance",desc:"New Moon observance."},
  {month:5,day:5,name:"Nirjala Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Most austere Ekadashi fast."},
  {month:5,day:11,name:"Purnima",icon:"🌕",color:"#FFB300",type:"purnima",source:"observance",desc:"Full Moon observance."},
  {month:5,day:18,name:"Pradosh Vrat",icon:"🔱",color:"#8855FF",type:"vrat",source:"observance",desc:"Twilight Shiva vrata."},
  {month:5,day:25,name:"Amavasya",icon:"🌑",color:"#9696BC",type:"amavasya",source:"observance",desc:"New Moon observance."},
  {month:6,day:6,name:"Devshayani Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Chaturmas begins."},
  {month:7,day:7,name:"Nag Panchami",icon:"🐍",color:"#26A69A",type:"festival",source:"observance",desc:"Serpent deity worship."},
  {month:7,day:22,name:"Shravana Putrada Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:7,day:27,name:"Raksha Bandhan",icon:"🧶",color:"#AB47BC",type:"festival",source:"observance",desc:"Festival of sibling bond."},
  {month:7,day:27,name:"Purnima",icon:"🌕",color:"#FFB300",type:"purnima",source:"observance",desc:"Shravana Purnima observance."},
  {month:8,day:17,name:"Pitra Paksha Begins",icon:"🌿",color:"#8D6E63",type:"observance",source:"observance",desc:"Ancestor fortnight begins."},
  {month:9,day:13,name:"Karwa Chauth",icon:"🌕",color:"#D81B60",type:"festival",source:"observance",desc:"Married women observe nirjala fast."},
  {month:10,day:1,name:"Dev Uthani Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Auspicious marriages resume."},
  {month:10,day:2,name:"Tulsi Vivah",icon:"🌿",color:"#43A047",type:"festival",source:"observance",desc:"Ceremonial marriage of Tulsi and Vishnu."},
  {month:10,day:6,name:"Dhanteras",icon:"💰",color:"#FFB300",type:"festival",source:"observance",desc:"Diwali festival begins with Dhantrayodashi shopping and Lakshmi-Kubera worship."},
  {month:10,day:7,name:"Naraka Chaturdashi",icon:"🛁",color:"#FF8A65",type:"festival",source:"observance",desc:"Early-morning abhyanga snana and Deepavali preparations."},
  {month:10,day:8,name:"Diwali Lakshmi Puja",icon:"🪔",color:"#FFB300",type:"festival",source:"observance",desc:"Main Deepavali night with Lakshmi-Ganesha puja after sunset."},
  {month:10,day:9,name:"Govardhan Puja",icon:"⛰️",color:"#43A047",type:"festival",source:"observance",desc:"Annakut and Govardhan worship the day after Diwali."},
  {month:10,day:10,name:"Bhai Dooj",icon:"👫",color:"#AB47BC",type:"festival",source:"observance",desc:"Sibling festival observed after Diwali."},
  {month:10,day:5,name:"Kartik Purnima",icon:"🌕",color:"#FFB300",type:"purnima",source:"observance",desc:"Highly sacred full moon."},
  {month:2,day:22,name:"Chaitra Navratri Day 2",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Second day of Chaitra Navratri."},
  {month:2,day:23,name:"Chaitra Navratri Day 3",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Third day of Chaitra Navratri."},
  {month:2,day:24,name:"Chaitra Navratri Day 4",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Fourth day of Chaitra Navratri."},
  {month:2,day:25,name:"Chaitra Navratri Day 5",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Fifth day of Chaitra Navratri."},
  {month:2,day:26,name:"Chaitra Navratri Day 6",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Sixth day of Chaitra Navratri."},
  {month:2,day:27,name:"Chaitra Navratri Day 7",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Seventh day of Chaitra Navratri."},
  {month:2,day:28,name:"Chaitra Navratri Day 8",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Eighth day of Chaitra Navratri / Durga Ashtami."},
  {month:2,day:29,name:"Chaitra Navratri Day 9",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Ninth day of Chaitra Navratri / Mahanavami."},
  {month:9,day:12,name:"Sharad Navratri Day 2",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Second day of Sharad Navratri."},
  {month:9,day:13,name:"Sharad Navratri Day 3",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Third day of Sharad Navratri."},
  {month:9,day:14,name:"Sharad Navratri Day 4",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Fourth day of Sharad Navratri."},
  {month:9,day:15,name:"Sharad Navratri Day 5",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Fifth day of Sharad Navratri."},
  {month:9,day:16,name:"Sharad Navratri Day 6",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Sixth day of Sharad Navratri."},
  {month:9,day:17,name:"Sharad Navratri Day 7",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Seventh day of Sharad Navratri."},
  {month:9,day:18,name:"Sharad Navratri Day 8",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Eighth day of Sharad Navratri / Durga Ashtami."},
  {month:9,day:19,name:"Sharad Navratri Day 9",icon:"🪷",color:"#E91E8C",type:"observance",source:"reference",desc:"Ninth day of Sharad Navratri / Mahanavami."},
  {month:11,day:5,name:"Vivah Panchami",icon:"💍",color:"#FF8A65",type:"festival",source:"observance",desc:"Celebrates the wedding of Rama and Sita."},
  {month:11,day:17,name:"Gita Jayanti",icon:"📖",color:"#42A5F5",type:"festival",source:"observance",desc:"Anniversary of the Bhagavad Gita discourse."},
  {month:6,day:10,name:"Guru Purnima",icon:"📿",color:"#FFB300",type:"festival",source:"observance",desc:"Honors gurus and spiritual teachers with puja and gratitude."},
  {month:6,day:16,name:"Karka Sankranti",icon:"☀️",color:"#FF8C00",type:"observance",source:"observance",desc:"Sun's transition into Karka (Cancer)."},
  {month:8,day:6,name:"Aja Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Ekadashi fasting day."},
  {month:8,day:17,name:"Mahalaya Amavasya",icon:"🌑",color:"#9696BC",type:"amavasya",source:"observance",desc:"Most important new moon during Pitru Paksha."},
  {month:9,day:11,name:"Sharad Navratri Begins",icon:"🪷",color:"#E91E8C",type:"festival",source:"observance",desc:"Nine nights of Devi worship begin in Ashwin."},
  {month:10,day:15,name:"Kartik Ekadashi",icon:"🌙",color:"#5BA4F5",type:"ekadashi",source:"observance",desc:"Sacred Kartik month Ekadashi observance."},
  {month:11,day:29,name:"Datta Jayanti",icon:"🕉️",color:"#7E57C2",type:"festival",source:"observance",desc:"Celebrates Dattatreya Jayanti with mantra and guru worship."},
  {month:0,day:1,name:"English New Year Sankalp",icon:"🪔",color:"#FFB300",type:"observance",source:"observance",desc:"A practical day for sankalp, japa goals, and spiritual planning."},
  {month:1,day:26,name:"Magha Purnima",icon:"🌕",color:"#FDD835",type:"purnima",source:"observance",desc:"Sacred full moon associated with snana, dana, and mantra japa."},
  {month:4,day:31,name:"Vat Savitri Vrat",icon:"🌳",color:"#66BB6A",type:"vrat",source:"observance",desc:"Traditional vrata observed by many married women with banyan tree worship."},
  {month:7,day:16,name:"Krishna Janmashtami Prep Day",icon:"🎶",color:"#7E57C2",type:"observance",source:"observance",desc:"Useful planning day for bhajans, fasting prep, and puja samagri."},
  {month:10,day:10,name:"Govardhan Puja",icon:"⛰️",color:"#8BC34A",type:"festival",source:"observance",desc:"Festival honoring Govardhan and Krishna’s protection."},
  {month:10,day:11,name:"Bhai Dooj",icon:"👫",color:"#FF8A65",type:"festival",source:"observance",desc:"Celebrates the bond between brothers and sisters after Deepavali."},
  ...FESTIVALS.map(f=>({month:f.month,day:f.day,name:f.name,icon:f.icon,color:f.color,type:f.type,source:"festival",festivalId:f.id,region:f.region,desc:f.desc}))
];
const IMPORTANT_DATE_MAP={};
IMPORTANT_DATES.forEach(item=>{
  const key=item.month+"-"+item.day;
  if(!IMPORTANT_DATE_MAP[key]) IMPORTANT_DATE_MAP[key]=[];
  if(!IMPORTANT_DATE_MAP[key].some(x=>x.name===item.name)) IMPORTANT_DATE_MAP[key].push(item);
});
Object.keys(IMPORTANT_DATE_MAP).forEach(key=>IMPORTANT_DATE_MAP[key].sort((a,b)=>(a.source==="festival"?-1:1)-(b.source==="festival"?-1:1)||a.name.localeCompare(b.name)));
const MONTH_MAP={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"};
function getCalDays(year,month){ const f=new Date(year,month,1).getDay(), tot=new Date(year,month+1,0).getDate(), cells=[]; for(let i=0;i<f;i++)cells.push(null); for(let d=1;d<=tot;d++)cells.push(d); return cells; }
function parseFestDate(ds){ const [mon,day]=ds.split(" "); return{mm:MONTH_MAP[mon]||"01",dd:String(parseInt(day)).padStart(2,"0")}; }
function addToGoogleCal(f){ const{mm,dd}=parseFestDate(f.date); const s=`2026${mm}${dd}`, e=`2026${mm}${String(parseInt(dd)+1).padStart(2,"0")}`; window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(f.name+" "+f.icon)}&dates=${s}/${e}&details=${encodeURIComponent(f.desc+"\n\nHow to celebrate: "+f.howTo)}&location=India`,"_blank"); }
function downloadICS(f){ const{mm,dd}=parseFestDate(f.date); const s=`2026${mm}${dd}`, e=`2026${mm}${String(parseInt(dd)+1).padStart(2,"0")}`; const ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Vedanta Calendar AI//EN","BEGIN:VEVENT",`SUMMARY:${f.name} ${f.icon}`,`DTSTART;VALUE=DATE:${s}`,`DTEND;VALUE=DATE:${e}`,`DESCRIPTION:${f.desc.replace(/,/g,"\\,")}\\nHow to celebrate: ${f.howTo.replace(/,/g,"\\,")}`,`UID:vedanta-${f.id}-2026@dharma-ai`,"END:VEVENT","END:VCALENDAR"].join("\r\n"); const blob=new Blob([ics],{type:"text/calendar"}), url=URL.createObjectURL(blob), a=document.createElement("a"); a.href=url; a.download=`${f.name.replace(/\s+/g,"-")}.ics`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }

function normalizeCalendarEvent(item){
  if(!item) return null;
  if(item.date) return item;
  const monthName=MONTH_NAMES[item.month] || "January";
  const shortMonth=monthName.slice(0,3);
  return {
    id: item.id || `${item.month}-${item.day}-${item.name}`.replace(/\s+/g,"-").toLowerCase(),
    name: item.name,
    date: `${shortMonth} ${String(item.day).padStart(2,"0")}`,
    month: item.month,
    day: item.day,
    icon: item.icon || "🪔",
    color: item.color || "#FFB300",
    desc: item.desc || "Important Hindu observance.",
    howTo: item.howTo || item.desc || "Observe with prayer, reflection, and the appropriate vrata or puja.",
    region: item.region || "Location-aware",
    type: item.type || "observance",
    source: item.source || "observance",
  };
}
function getUniqueCalendarEvents(items){
  const seen=new Set();
  return (items||[]).map(normalizeCalendarEvent).filter(Boolean).filter(ev=>{
    const key=`${ev.month}-${ev.day}-${ev.name}`;
    if(seen.has(key)) return false
    seen.add(key);
    return true;
  }).sort((a,b)=>(a.month-b.month)||(a.day-b.day)||a.name.localeCompare(b.name));
}
/* Toast helper — shows a brief "✓ Copied!" snack at bottom of screen */
function showShareToast(msg){
  const id="dc-share-toast";
  let el=document.getElementById(id);
  if(!el){
    el=document.createElement("div");
    el.id=id;
    Object.assign(el.style,{
      position:"fixed",bottom:"90px",left:"50%",transform:"translateX(-50%) translateY(20px)",
      background:"rgba(30,20,60,0.96)",border:"1px solid rgba(136,85,255,0.6)",
      color:"#EEE",fontSize:"14px",fontWeight:"700",padding:"10px 22px",borderRadius:"24px",
      zIndex:"99999",transition:"opacity 0.3s,transform 0.3s",opacity:"0",pointerEvents:"none",
      boxShadow:"0 4px 24px rgba(0,0,0,0.5)",whiteSpace:"nowrap"
    });
    document.body.appendChild(el);
  }
  el.textContent=msg||"✓ Link copied to clipboard!";
  el.style.opacity="1"; el.style.transform="translateX(-50%) translateY(0)";
  clearTimeout(el._t);
  el._t=setTimeout(()=>{el.style.opacity="0";el.style.transform="translateX(-50%) translateY(20px)";},2400);
}

function shareText(text,url){
  const shareUrl=url||window.location.href;
  if(navigator.share){
    navigator.share({title:"Vedanta Calendar AI",text,url:shareUrl}).catch(()=>{});
  } else {
    navigator.clipboard?.writeText(text+"\n\n"+shareUrl)
      .then(()=>showShareToast("✓ Link copied to clipboard!"))
      .catch(()=>showShareToast("✓ Copied!"));
  }
}
function shareFestival(fest){
  const url=window.location.origin+window.location.pathname+"?festival="+encodeURIComponent(fest.name);
  const text=fest.icon+" "+fest.name+" — "+fest.date+" 2026\n"+fest.desc+"\nHow to celebrate: "+fest.howTo;
  shareText(text,url);
}

function buildManyICS(events){
  const rows=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Vedanta Calendar AI//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH"];
  getUniqueCalendarEvents(events).forEach((evt,idx)=>{
    const {mm,dd}=parseFestDate(evt.date);
    const nextDay=String(parseInt(dd,10)+1).padStart(2,"0");
    rows.push("BEGIN:VEVENT");
    rows.push(`SUMMARY:${String(evt.name||"Sacred Date").replace(/,/g,"\\,")} ${evt.icon||""}`.trim());
    rows.push(`DTSTART;VALUE=DATE:2026${mm}${dd}`);
    rows.push(`DTEND;VALUE=DATE:2026${mm}${nextDay}`);
    rows.push(`DESCRIPTION:${String((evt.desc||"Important Hindu observance.")+"\\nHow to celebrate: "+(evt.howTo||evt.desc||"Observe mindfully.")).replace(/,/g,"\\,")}`);
    rows.push(`UID:vedanta-pack-${idx}-${evt.month}-${evt.day}@vedanta-ai`);
    rows.push("END:VEVENT");
  });
  rows.push("END:VCALENDAR");
  return rows.join("\r\n");
}
function downloadManyICS(events, filename="vedanta-sacred-dates.ics"){
  const normalized=getUniqueCalendarEvents(events);
  if(!normalized.length){ showShareToast("No calendar dates available to export."); return; }
  const blob=new Blob([buildManyICS(normalized)],{type:"text/calendar"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showShareToast("✓ Calendar file downloaded");
}
function addManyToGoogleCal(events, filename="vedanta-google-import.ics"){
  const normalized=getUniqueCalendarEvents(events);
  if(!normalized.length){ showShareToast("No important dates available right now."); return; }
  downloadManyICS(normalized, filename);
  window.open("https://calendar.google.com/calendar/u/0/r/settings/export", "_blank");
  showShareToast("✓ Downloaded calendar pack. Import the .ics file into Google Calendar.");
}

/* ══════════════════════════════════════════════════════
   CALENDAR MODAL
══════════════════════════════════════════════════════ */
function CalModal({fest,onClose,S,T}){
  if(!fest)return null;
  const opts=[
    {label:"Google Calendar",icon:"📅",sub:"Opens in browser",action:()=>{addToGoogleCal(fest);onClose();}},
    {label:"Apple Calendar (.ics)",icon:"🍎",sub:"Download file, double-click to add",action:()=>{downloadICS(fest);onClose();}},
    {label:"Outlook / Other (.ics)",icon:"📧",sub:"Works with any calendar app",action:()=>{downloadICS(fest);onClose();}},
  ];
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",zIndex:9999,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0 0 20px"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:S.card,borderRadius:"22px 22px 16px 16px",padding:22,width:"100%",maxWidth:440,border:`1px solid ${S.border}`,boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:40,marginBottom:7}}>{fest.icon}</div>
          <h3 style={{color:S.text,fontSize:18,fontWeight:800,margin:"0 0 4px"}}>{T.addToCal}</h3>
          <p style={{color:S.muted,fontSize:13,margin:0}}>{fest.name} — {fest.date} 2026</p>
        </div>
        {opts.map(o=>(
          <button key={o.label} onClick={o.action} style={{width:"100%",display:"flex",alignItems:"center",gap:14,padding:"13px 16px",borderRadius:14,border:`1px solid ${S.border}`,background:"transparent",color:S.text,fontSize:14,fontWeight:600,cursor:"pointer",marginBottom:9,textAlign:"left"}}>
            <span style={{fontSize:26,flexShrink:0}}>{o.icon}</span>
            <div><div style={{fontWeight:700,marginBottom:2}}>{o.label}</div><div style={{color:S.muted,fontSize:13}}>{o.sub}</div></div>
          </button>
        ))}
        <button onClick={onClose} style={{width:"100%",padding:"11px",borderRadius:12,border:"none",background:S.border,color:S.muted,fontSize:14,cursor:"pointer",fontWeight:600,marginTop:2}}>Cancel</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════════ */
function Card({children,style={},onClick,S}){
  const[hov,setHov]=useState(false);
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov&&onClick?S.cardHover:S.card,border:`1px solid ${hov&&onClick?S.saffron+"66":S.border}`,borderRadius:16,padding:18,marginBottom:14,cursor:onClick?"pointer":"default",transition:"all 0.18s",...style}}>
      {children}
    </div>
  );
}
function Badge({label,color}){
  return <span style={{background:color+"25",color,border:`1px solid ${color}55`,borderRadius:20,padding:"3px 10px",fontSize:13,fontWeight:700,display:"inline-block"}}>{label}</span>;
}
function SecTitle({emoji,title,action,onAction,S}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <span style={{color:S.gold,fontSize:12,fontWeight:800,letterSpacing:1,textTransform:"uppercase"}}>{emoji&&emoji+" "}{title}</span>
      {action&&<span onClick={onAction} style={{color:S.saffron,fontSize:12,cursor:"pointer",fontWeight:600}}>{action}</span>}
    </div>
  );
}
function Tog({on,onClick,S}){
  return(
    <div onClick={onClick} style={{width:46,height:25,borderRadius:13,background:on?S.saffron:"#353565",display:"flex",alignItems:"center",padding:"0 3px",justifyContent:on?"flex-end":"flex-start",transition:"all 0.25s",cursor:"pointer",flexShrink:0,border:`1px solid ${on?S.saffron+"80":"#454580"}`}}>
      <div style={{width:19,height:19,borderRadius:"50%",background:"#FFFFFF",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TODAY SCREEN
══════════════════════════════════════════════════════ */
const THEME_PRESETS=[
  {id:"dark",emoji:"🌑",label:"Dark"},
  {id:"light",emoji:"☀️",label:"Light"},
  {id:"warm",emoji:"🌅",label:"Warm"},
  {id:"forest",emoji:"🌿",label:"Forest"},
];

function TodayScreen({goTo,S,bp,T,theme,setTheme,lang,setLang,selectedLocation,setSelectedLocation}){
  const[verseIdx,setVerseIdx]=useState(new Date().getDay()%VERSES.length);
  const[calFest,setCalFest]=useState(null);
  const[showAllMonthsInCalendarMap,setShowAllMonthsInCalendarMap]=useState(false);
  const[showLang,setShowLang]=useState(false);
  const[showAllMonthDates,setShowAllMonthDates]=useState(false);
  const now=useCurrentTime();
  const todayKey=getLocalDateKeyForLocation(selectedLocation);
  const panchang=getLocationPanchang(todayKey,selectedLocation);
  const locationMeta=getLocationMeta(selectedLocation);
  const activeMuh=getActiveMuhurat(now);
  const verse=VERSES[verseIdx];
  const isWide=bp==="desktop";
  const timeStr=now.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true,timeZone:locationMeta.tz});

  const QuickSettings=()=>(
    <div style={{background:S.card,border:"1px solid "+S.border,borderRadius:16,padding:"12px 16px",marginBottom:14}}>
      {/* Theme swatches */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:showLang?10:0}}><div style={{display:"flex",gap:7,flex:1}}>
          {THEME_PRESETS.map(p=>(
            <button key={p.id} onClick={()=>setTheme(p.id)}
              style={{flex:1,padding:"7px 4px",borderRadius:10,border:theme===p.id?"2px solid "+S.saffron:"1px solid "+S.border,
                background:theme===p.id?S.saffron+"22":"transparent",color:theme===p.id?S.saffron:S.muted,
                fontSize:isWide?13:11,fontWeight:theme===p.id?800:500,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}}>
              {p.emoji}<br/><span style={{fontSize:12}}>{p.label}</span>
            </button>
          ))}
        </div>
        <button onClick={()=>setShowLang(v=>!v)}
          style={{padding:"7px 12px",borderRadius:10,border:"1px solid "+S.border,background:showLang?S.sacred+"22":"transparent",
            color:showLang?S.sacred:S.muted,fontSize:12,fontWeight:600,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>
          🌐 {lang} {showLang?"▲":"▼"}
        </button>
      </div>
      {showLang&&(
        <div style={{display:"flex",gap:6,flexWrap:"wrap",paddingTop:4,borderTop:"1px solid "+S.border}}>
          {Object.keys(TRANSLATIONS).map(l=>(
            <button key={l} onClick={()=>{setLang(l);setShowLang(false);}}
              style={{padding:"5px 12px",borderRadius:20,border:lang===l?"none":"1px solid "+S.border,
                background:lang===l?S.sacred:"transparent",color:lang===l?"#FFFFFF":S.muted,
                fontSize:12,fontWeight:lang===l?700:500,cursor:"pointer"}}>
              {l}
            </button>
          ))}
        </div>
      )}
      <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid "+S.border}}>
        <div style={{color:S.muted,fontSize:12,fontWeight:700,marginBottom:7}}>📍 Panchang location</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {LOCATION_OPTIONS.map(loc=>(
            <button key={loc.key} onClick={()=>setSelectedLocation(loc.key)}
              style={{padding:"5px 10px",borderRadius:16,border:selectedLocation===loc.key?"none":"1px solid "+S.border,
                background:selectedLocation===loc.key?S.saffron:"transparent",color:selectedLocation===loc.key?"#FFFFFF":S.muted,
                fontSize:12,fontWeight:selectedLocation===loc.key?700:500,cursor:"pointer"}}>
              {loc.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const Panchang=()=>(
    <>
      <QuickSettings/>
      <Card S={S} style={{marginBottom:14,background:"linear-gradient(135deg,rgba(255,192,64,0.10),rgba(61,220,132,0.08))"}}>
        <SecTitle emoji="📅" title="Calendar Quick Add" S={S}/>
        <div style={{display:"grid",gridTemplateColumns:bp==="mobile"?"1fr":"repeat(2,1fr)",gap:10}}>
          <button onClick={()=>addManyToGoogleCal(getUniqueCalendarEvents([...FESTIVALS.filter(f=>f.month===currentMonth), ...IMPORTANT_DATES.filter(d=>d.month===currentMonth)]), `vedanta-${MONTH_NAMES[currentMonth].toLowerCase()}-google-import.ics`)} style={{padding:"12px 14px",borderRadius:12,border:"none",background:S.saffron,color:"#FFFFFF",fontSize:13,fontWeight:800,cursor:"pointer",textAlign:"left"}}>📅 Add this month’s important dates to Google Calendar<br/><span style={{fontSize:11,fontWeight:600,opacity:0.9}}>Festivals + marked sacred days in one tap</span></button>
          <button onClick={()=>goTo("calendar")} style={{padding:"12px 14px",borderRadius:12,border:"1px solid "+S.border,background:"transparent",color:S.text,fontSize:13,fontWeight:800,cursor:"pointer",textAlign:"left"}}>🪔 View all calendar options<br/><span style={{fontSize:11,fontWeight:600,color:S.muted}}>Open Calendar tab for Google / Apple / Outlook packs</span></button>
        </div>
      </Card>

      <Card S={S} style={{marginBottom:14}}>
        <SecTitle emoji="🗓️" title="Recommended Today" S={S}/>
        <div style={{display:"grid",gridTemplateColumns:bp==="mobile"?"1fr":"repeat(2,1fr)",gap:10}}>
          {[
            {k:"Best for prayer",v:`${panchang.brahmaMuhurat} · ${panchang.amritKaal}`,c:S.green},
            {k:"Best for starting work",v:panchang.abhijit||"Use a clean midday window after checking Rahu Kaal",c:S.blue},
            {k:"Best for travel",v:`Avoid ${panchang.rahuKaal} and ${panchang.yamaganda}`,c:S.gold},
            {k:"Suggested seva",v:panchang.locationMode==="india"?"Offer Ram or Devi bhajans, support mandir seva, donate fruits, or feed birds today":"Temple donation, food seva, call elders, or feed birds today",c:S.saffron},
          ].map(item=>(<div key={item.k} style={{background:S.surface,borderRadius:12,padding:"12px 14px",borderLeft:"3px solid "+item.c}}><p style={{color:S.muted,fontSize:12,margin:0,fontWeight:700}}>{item.k}</p><p style={{color:item.c,fontSize:13,fontWeight:800,margin:"5px 0 0",lineHeight:1.5}}>{item.v}</p></div>))}
        </div>
      </Card>
      <CityExplorerPanel S={S} selectedLocation={selectedLocation} bp={bp}/>

      {/* Hero */}
      <div style={{background:S.heroGrad,borderRadius:22,padding:"22px 20px 20px",marginBottom:16,position:"relative",overflow:"hidden",border:"1px solid rgba(140,80,255,0.3)"}}>
        <div style={{position:"absolute",top:-10,right:-10,fontSize:130,opacity:0.05,userSelect:"none"}}>🕉️</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <p style={{color:"rgba(255,255,255,0.55)",fontSize:13,margin:0,letterSpacing:1.5,fontWeight:700}}>{T.auspicious}</p>
            <h1 style={{color:"#FFFFFF",fontSize:isWide?30:24,fontWeight:900,margin:"6px 0 4px",lineHeight:1.2}}><>{panchang.hindu}</></h1>
            <p style={{color:S.gold,fontSize:13,margin:0,fontWeight:700}}>{panchang.samvat} — {panchang.weekday}</p>
            <p style={{color:"rgba(255,255,255,0.55)",fontSize:12,margin:"3px 0 6px"}}>{panchang.gregorian}</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
              {getTodayObservances(selectedLocation).slice(0,3).map(obs=>(<span key={obs} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",color:"#FFFFFF",fontSize:11,fontWeight:700,borderRadius:999,padding:"4px 9px"}}>{obs}</span>))}
            </div>
            {/* Live clock */}
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <span style={{color:"#FFFFFF",fontSize:15,fontWeight:800,fontVariantNumeric:"tabular-nums",fontFamily:"monospace"}}>🕐 {timeStr} {locationMeta.region==="India"?"IST":locationMeta.label}</span>
              {activeMuh&&(
                <span style={{background:activeMuh.good?"rgba(61,220,132,0.2)":"rgba(255,68,68,0.2)",color:activeMuh.c,border:`1px solid ${activeMuh.c}55`,borderRadius:20,padding:"3px 10px",fontSize:13,fontWeight:700}}>
                  {activeMuh.good?"✨":"⚠️"} {activeMuh.name} Active
                </span>
              )}
            </div>
          </div>
          <div style={{textAlign:"center",flexShrink:0}}>
            <div style={{fontSize:54,lineHeight:1,marginBottom:6}}>🌛</div>
            <Badge label={panchang.nakshatra.name+" ★"} color={S.gold}/>
          </div>
        </div>
        {/* Today's astrological info */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
          {[
            {k:"Rashi",v:panchang.rashi,ico:"♊"},
            {k:"Lucky Color",v:panchang.luckyColor,ico:"🎨"},
            {k:"Weekday Ruler",v:panchang.weekdayRuler,ico:"♂"},
            {k:"Lucky Number",v:panchang.luckyNumber,ico:"🔢"},
          ].map(x=>(
            <div key={x.k} style={{background:"rgba(0,0,0,0.2)",borderRadius:10,padding:"7px 10px",display:"flex",alignItems:"center",gap:7}}>
              <span style={{fontSize:14}}>{x.ico}</span>
              <div>
                <div style={{color:"rgba(255,255,255,0.55)",fontSize:12,fontWeight:600}}>{x.k}</div>
                <div style={{color:"#FFFFFF",fontSize:12,fontWeight:700}}>{x.v}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Daily verse */}
        <div style={{marginTop:14,padding:"12px 16px",background:"rgba(255,192,64,0.1)",borderRadius:12,borderLeft:"3px solid "+S.gold}}>
          <p style={{color:S.gold,fontSize:isWide?17:15,margin:0,fontStyle:"italic",lineHeight:1.5}}>"{verse.t}"</p>
          <p style={{color:"rgba(255,255,255,0.6)",fontSize:13,margin:"5px 0 8px"}}>{verse.devnagari} — {verse.src}</p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",gap:7}}>
              {VERSES.map((_,i)=><div key={i} onClick={()=>setVerseIdx(i)} style={{width:7,height:7,borderRadius:"50%",background:i===verseIdx?S.gold:"rgba(255,255,255,0.35)",cursor:"pointer"}}/>)}
            </div>
            <button onClick={()=>shareText(`"${verse.t}" — ${verse.devnagari}\n\n${verse.src}\n\nShared from Vedanta Calendar AI`)} style={{background:"none",border:"1px solid "+S.gold+"55",borderRadius:20,color:S.gold,fontSize:13,cursor:"pointer",padding:"3px 10px",fontWeight:600}}>Share 🔗</button>
          </div>
        </div>
        {/* Sun/Moon row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:14,background:"rgba(0,0,0,0.3)",borderRadius:12,padding:"11px 8px"}}>
          {[{icon:"🌅",label:T.sunrise,v:panchang.sunrise},{icon:"🌇",label:T.sunset,v:panchang.sunset},{icon:"🌝",label:T.moonrise,v:panchang.moonrise},{icon:"🌚",label:T.moonset,v:panchang.moonset}].map(x=>(
            <div key={x.label} style={{textAlign:"center"}}>
              <div style={{fontSize:20}}>{x.icon}</div>
              <div style={{color:"#FFFFFF",fontSize:12,fontWeight:700}}>{x.v}</div>
              <div style={{color:"rgba(255,255,255,0.55)",fontSize:12,marginTop:2}}>{x.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Panchang 4-box */}
      <Card S={S}>
        <SecTitle emoji="📅" title={T.panchang} S={S}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
          {[
            {k:T.tithi,v:panchang.tithi.name,sub:"Ends "+panchang.tithi.ends,c:S.saffron,ico:"🌙"},
            {k:T.nakshatra,v:panchang.nakshatra.name,sub:"Deity: "+panchang.nakshatra.deity,c:S.sacred,ico:"⭐"},
            {k:T.yoga,v:panchang.yoga.name,sub:"Ends "+panchang.yoga.ends,c:S.lotus,ico:"🔮"},
            {k:T.karana,v:panchang.karana.evening||"Bava",sub:panchang.karana.morning,c:S.green,ico:"🕐"},
          ].map(item=>(
            <div key={item.k} style={{background:S.surface,borderRadius:12,padding:"12px 14px",borderLeft:"3px solid "+item.c}}>
              <p style={{color:S.muted,fontSize:13,margin:0,textTransform:"uppercase",letterSpacing:0.8,fontWeight:600}}>{item.ico} {item.k}</p>
              <p style={{color:item.c,fontSize:16,fontWeight:800,margin:"4px 0 3px"}}>{item.v}</p>
              <p style={{color:S.muted,fontSize:13,margin:0,lineHeight:1.4}}>{item.sub}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Muhurats */}
      <Card S={S}>
        <SecTitle emoji="⏰" title={T.muhurats} S={S}/>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            {g:true,icon:"⭐",label:"Abhijit Muhurat",sub:"Best for all activities",time:panchang.abhijit,c:S.green},
            {g:true,icon:"🌸",label:"Amrit Kaal",sub:"Excellent for spiritual work",time:panchang.amritKaal,c:S.green},
            {g:true,icon:"🌅",label:"Brahma Muhurat",sub:"Ideal for meditation",time:panchang.brahmaMuhurat,c:S.blue},
            {g:false,icon:"⚠️",label:"Rahu Kaal",sub:"Avoid all important activities",time:panchang.rahuKaal,c:"#FF4444"},
            {g:false,icon:"🔶",label:"Gulika Kaal",sub:"Moderately inauspicious",time:panchang.gulikaKaal,c:"#E67E22"},
            {g:false,icon:"🔸",label:"Yamaganda",sub:"Avoid new starts",time:panchang.yamaganda,c:"#E67E22"},
          ].map(m=>{
            const am=activeMuh&&activeMuh.name===m.label;
            return(
              <div key={m.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:am?S.surface:m.g?"rgba(61,220,132,0.06)":"rgba(255,68,68,0.06)",borderRadius:10,border:"1px solid "+(am?"rgba(255,255,255,0.3)":m.c+"30"),boxShadow:am?"0 0 12px "+m.c+"30":undefined}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:16}}>{m.icon}</span>
                  <div>
                    <p style={{color:m.c,fontSize:13,fontWeight:700,margin:0}}>{m.label}</p>
                    <p style={{color:S.muted,fontSize:13,margin:0}}>{m.sub}</p>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <span style={{color:m.c,fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{m.time}</span>
                  {am&&<div style={{color:m.c,fontSize:12,fontWeight:700,marginTop:2}}>● NOW</div>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );

  const SidePanel=()=>{
    const currentMonth=new Date(todayKey).getMonth();
    const currentDay=new Date(todayKey).getDate();
    const monthEntries=IMPORTANT_DATES
      .filter(item=>item.month===currentMonth && item.day>=currentDay)
      .sort((a,b)=>a.day-b.day || a.name.localeCompare(b.name));
    const visibleEntries=(showAllMonthDates?monthEntries:monthEntries.slice(0,5));
    return(
    <>
      <Card S={S}>
        <SecTitle emoji="🗓" title={`Upcoming sacred dates — ${MONTH_NAMES[currentMonth]}`} action="View more" onAction={()=>goTo("calendar")} S={S}/>
        <p style={{color:S.muted,fontSize:12,margin:"0 0 12px"}}>Showing only the remaining important Hindu dates for this month so the home screen stays clean.</p>
        {visibleEntries.length?visibleEntries.map((sd,idx)=>(
          <div key={sd.name+idx} style={{display:"flex",alignItems:"center",gap:11,marginBottom:12}}>
            <div style={{width:38,height:38,borderRadius:11,background:sd.color+"25",border:"1px solid "+sd.color+"50",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{sd.icon}</div>
            <div style={{flex:1}}>
              <p style={{color:S.text,fontSize:13,fontWeight:700,margin:0}}>{sd.name}</p>
              <p style={{color:S.muted,fontSize:13,margin:"2px 0 0"}}>{MONTH_NAMES[currentMonth].slice(0,3)} {String(sd.day).padStart(2,"0")}</p>
            </div>
            <Badge label={(sd.day-currentDay)+"d"} color={sd.color||S.gold}/>
          </div>
        )):(<p style={{color:S.muted,fontSize:13,margin:0}}>No more mapped sacred dates this month.</p>)}
        {monthEntries.length>5&&(
          <button onClick={()=>setShowAllMonthDates(v=>!v)} style={{marginTop:4,width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid "+S.border,background:"transparent",color:S.text,fontSize:13,fontWeight:700,cursor:"pointer"}}>
            {showAllMonthDates?"Show fewer":"View more results"}
          </button>
        )}
      </Card>
      <Card onClick={()=>goTo("ai")} S={S} style={{background:"linear-gradient(135deg,#180440,#220A3A)",border:"1px solid "+S.sacred+"55"}}>
        <div style={{display:"flex",gap:12}}>
          <div style={{width:48,height:48,borderRadius:14,background:S.sacred+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>🤖</div>
          <div>
            <p style={{color:S.sacred,fontSize:13,fontWeight:800,margin:"0 0 5px",letterSpacing:1}}>{T.aiInsight}</p>
            <p style={{color:S.text,fontSize:13,margin:"0 0 7px",lineHeight:1.55}}>{`Today for ${locationMeta.label}: ${panchang.hindu}, ${panchang.nakshatra.name} Nakshatra. Avoid Rahu Kaal (${panchang.rahuKaal}).`}</p>
            <span style={{color:S.sacred,fontSize:13,fontWeight:600}}>{T.askAI}</span>
          </div>
        </div>
      </Card>
      {calFest&&<CalModal fest={calFest} onClose={()=>setCalFest(null)} S={S} T={T}/>}
    </>
  );
  };

  return isWide
    ?<div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:26}}><div><Panchang/></div><div><SidePanel/></div></div>
    :<div><Panchang/><SidePanel/></div>;
}

/* ══════════════════════════════════════════════════════
   CALENDAR SCREEN
══════════════════════════════════════════════════════ */
function SelDayDetail({selDay,month,year,S,T,setCalFest,getEntries}){
  const entries=getEntries(selDay);
  const MONTH_NAMES_LOCAL=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return(
    <div style={{marginTop:16,padding:14,background:"rgba(255,112,64,0.09)",borderRadius:14,border:"1px solid "+S.saffron+"40"}}>
      <p style={{color:S.saffron,fontSize:13,fontWeight:700,margin:"0 0 10px"}}>📅 {MONTH_NAMES_LOCAL[month]} {selDay}, {year}</p>
      {entries.length?(
        <>
          <div style={{display:"grid",gap:10}}>
            {entries.map((entry,idx)=>{
              const calEntry=normalizeCalendarEvent(FESTIVALS.find(f=>f.id===entry.festivalId)||entry);
              return (
              <div key={entry.name+idx} style={{background:S.surface,borderRadius:12,padding:12,border:"1px solid "+(entry.color||S.border)+"55"}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{fontSize:20}}>{entry.icon}</span>
                  <p style={{color:S.text,fontSize:14,fontWeight:800,margin:0}}>{entry.name}</p>
                  <Badge label={entry.source==="festival"?(entry.region||"Festival"):(entry.type||"Observance")} color={entry.color||S.gold}/>
                </div>
                {entry.desc&&<p style={{color:S.muted,fontSize:12,margin:"0 0 10px",lineHeight:1.55}}>{entry.desc}</p>}
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button onClick={()=>setCalFest(calEntry)} style={{flex:"1 1 160px",padding:"10px 0",borderRadius:10,border:"none",background:entry.color||S.saffron,color:"#FFFFFF",fontSize:13,fontWeight:700,cursor:"pointer"}}>📅 {T.addToCal}</button>
                  <button onClick={()=>downloadICS(calEntry)} style={{flex:"1 1 150px",padding:"10px 0",borderRadius:10,border:"1px solid "+(entry.color||S.saffron),background:"transparent",color:entry.color||S.saffron,fontSize:13,fontWeight:700,cursor:"pointer"}}>📱 Phone / .ics</button>
                  <button onClick={()=>shareFestival(calEntry)} style={{padding:"10px 14px",borderRadius:10,border:"1px solid "+S.border,background:"transparent",color:S.muted,fontSize:15,cursor:"pointer"}} title="Share">🔗</button>
                </div>
              </div>
            )})}
          </div>
        </>
      ):(
        <p style={{color:S.muted,fontSize:13,margin:0}}>No major festival on this day.</p>
      )}
    </div>
  );
}

function CalendarScreen({S,bp,T,sharedFestivalName,onSharedFestivalHandled}){
  const[view,setView]=useState("grid");
  const[year,setYear]=useState(2026);
  const[month,setMonth]=useState(2);
  const[selDay,setSelDay]=useState(null);
  const[showYearMap,setShowYearMap]=useState(false);
  const[showAllYear,setShowAllYear]=useState(false);
  const[showDayMapMore,setShowDayMapMore]=useState(false);
  const[openF,setOpenF]=useState(null);
  const[filter,setFilter]=useState("all");
  const[calFest,setCalFest]=useState(null);
  const days=getCalDays(year,month);
  const prevMonth=()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1);setSelDay(null);};
  const nextMonth=()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1);setSelDay(null);};
  const getFest=d=>d?FESTIVAL_MAP[month+"-"+d]:null;
  const getEntries=d=>d?(IMPORTANT_DATE_MAP[month+"-"+d]||[]):[];
  const filtered=(filter==="all"?FESTIVALS:FESTIVALS.filter(f=>f.type===filter)).filter(f=>showAllYear||f.month===month);
  useEffect(()=>{
    if(!sharedFestivalName) return;
    const match=FESTIVALS.find(f=>f.name.toLowerCase()===sharedFestivalName.toLowerCase());
    if(match){
      setView("list");
      setFilter("all");
      setOpenF(match.id);
      setMonth(match.month);
      setYear(2026);
      setSelDay(match.day);
      setTimeout(()=>{
        const el=document.getElementById(`festival-card-${match.id}`);
        el?.scrollIntoView?.({behavior:"smooth",block:"center"});
      },120);
    }
    onSharedFestivalHandled?.();
  },[sharedFestivalName,onSharedFestivalHandled]);
  return(
    <div>
      {calFest&&<CalModal fest={calFest} onClose={()=>setCalFest(null)} S={S} T={T}/>}
      <div style={{background:"linear-gradient(135deg,#061A0C,#0D2818)",borderRadius:20,padding:"20px 18px",marginBottom:16,border:"1px solid "+S.green+"30"}}>
        <h2 style={{color:"#FFFFFF",fontSize:20,fontWeight:900,margin:"0 0 5px"}}>Vedanta Sacred Calendar 2026</h2>
        <p style={{color:"rgba(255,255,255,0.65)",fontSize:13,margin:0}}>Add important festivals, vrats, Ekadashi, Purnima, Amavasya, Sankranti, Pradosh, and more to your personal calendar</p>
        <div style={{display:"flex",gap:8,marginTop:11,flexWrap:"wrap"}}><Badge label={FESTIVALS.length+" Festivals"} color={S.green}/><Badge label="All India + Regional" color={S.blue}/><Badge label={Object.keys(IMPORTANT_DATE_MAP).length+" marked sacred days"} color={S.gold}/></div>
        <p style={{color:"rgba(255,255,255,0.75)",fontSize:12,margin:"10px 0 0"}}>Use the calendar pack below to add all important dates to Google Calendar or download a full .ics file for Apple / Outlook.</p>
      </div>
      <Card S={S} style={{marginBottom:14,background:"linear-gradient(135deg,rgba(255,192,64,0.08),rgba(91,164,245,0.08))"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:12}}>
          <div>
            <h3 style={{color:S.text,fontSize:16,fontWeight:900,margin:"0 0 4px"}}>One-tap calendar pack</h3>
            <p style={{color:S.muted,fontSize:12,margin:0}}>Add all important festivals and marked sacred days to your calendar without opening each one separately.</p>
          </div>
          <Badge label="Restored" color={S.saffron}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:bp==="mobile"?"1fr":"repeat(2,1fr)",gap:10}}>
          <button onClick={()=>addManyToGoogleCal(getUniqueCalendarEvents([...FESTIVALS.filter(f=>f.month===month), ...IMPORTANT_DATES.filter(d=>d.month===month)]), `vedanta-${MONTH_NAMES[month].toLowerCase()}-google-import.ics`)} style={{padding:"12px 14px",borderRadius:12,border:"none",background:S.saffron,color:"#FFFFFF",fontSize:13,fontWeight:800,cursor:"pointer",textAlign:"left"}}>📅 Add this month's marked days to Google Calendar<br/><span style={{fontSize:11,fontWeight:600,opacity:0.9}}>Includes festivals + observances for {MONTH_NAMES[month]}</span></button>
          <button onClick={()=>downloadManyICS(getUniqueCalendarEvents([...FESTIVALS.filter(f=>f.month===month), ...IMPORTANT_DATES.filter(d=>d.month===month)]), `vedanta-${MONTH_NAMES[month].toLowerCase()}-2026.ics`)} style={{padding:"12px 14px",borderRadius:12,border:"1px solid "+S.border,background:"transparent",color:S.text,fontSize:13,fontWeight:800,cursor:"pointer",textAlign:"left"}}>🍎 Download this month for Apple / Outlook<br/><span style={{fontSize:11,fontWeight:600,color:S.muted}}>Single .ics file for marked days in {MONTH_NAMES[month]}</span></button>
          <button onClick={()=>addManyToGoogleCal(getUniqueCalendarEvents([...FESTIVALS, ...IMPORTANT_DATES]))} style={{padding:"12px 14px",borderRadius:12,border:"none",background:S.green,color:"#FFFFFF",fontSize:13,fontWeight:800,cursor:"pointer",textAlign:"left"}}>🪔 Add full 2026 sacred calendar to Google<br/><span style={{fontSize:11,fontWeight:600,opacity:0.92}}>Major festivals + important marked observances</span></button>
          <button onClick={()=>downloadManyICS(getUniqueCalendarEvents([...FESTIVALS, ...IMPORTANT_DATES]), 'vedanta-full-sacred-calendar-2026.ics')} style={{padding:"12px 14px",borderRadius:12,border:"1px solid "+S.border,background:"transparent",color:S.text,fontSize:13,fontWeight:800,cursor:"pointer",textAlign:"left"}}>📥 Download full sacred calendar (.ics)<br/><span style={{fontSize:11,fontWeight:600,color:S.muted}}>Use with Apple Calendar, Outlook, or any calendar app</span></button>
        </div>
      </Card>
      <Card S={S} style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:10,flexWrap:"wrap"}}>
          <div>
            <h3 style={{color:S.text,fontSize:16,fontWeight:900,margin:"0 0 4px"}}>Monthly Hindu day map</h3>
            <p style={{color:S.muted,fontSize:12,margin:0}}>View one month at a time for a cleaner, easier-to-scan sacred day list.</p>
          </div>
          <button onClick={()=>setShowYearMap(v=>!v)} style={{padding:"8px 12px",borderRadius:12,border:"1px solid "+S.border,background:"transparent",color:S.text,fontSize:12,fontWeight:700,cursor:"pointer"}}>{showYearMap?"Show selected month":"View full year"}</button>
        </div>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:6,marginBottom:12}}>
          {MONTH_NAMES.map((m,idx)=>(
            <button key={m} onClick={()=>{setMonth(idx);setView("grid");setSelDay(null);setShowDayMapMore(false);}} style={{padding:"8px 12px",borderRadius:999,border:"1px solid "+(month===idx?S.saffron:S.border),background:month===idx?S.saffron:"transparent",color:month===idx?"#FFFFFF":S.text,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{m}</button>
          ))}
        </div>
        {showYearMap?(
          <div style={{display:"grid",gridTemplateColumns:bp==="desktop"?"repeat(3,1fr)":"1fr",gap:10}}>
            {MONTH_NAMES.map((m,idx)=>{
              const monthEntries=IMPORTANT_DATES.filter(f=>f.month===idx).sort((a,b)=>a.day-b.day).slice(0,8);
              return(
                <button key={m} onClick={()=>{setMonth(idx);setView("grid");setSelDay(null);setShowYearMap(false);}} style={{textAlign:"left",padding:12,borderRadius:14,border:"1px solid "+(month===idx?S.saffron:S.border),background:month===idx?S.saffron+"12":"transparent",cursor:"pointer"}}>
                  <p style={{color:month===idx?S.saffron:S.text,fontSize:13,fontWeight:800,margin:"0 0 8px"}}>{m}</p>
                  {monthEntries.length?monthEntries.map((f,i)=><p key={f.name+i} style={{color:S.muted,fontSize:11,lineHeight:1.5,margin:0}}>{String(f.day).padStart(2,"0")} · {f.name}</p>):<p style={{color:S.muted,fontSize:11,margin:0}}>No mapped highlights yet</p>}
                </button>
              );
            })}
          </div>
        ):(()=>{
          const monthEntries=IMPORTANT_DATES.filter(f=>f.month===month).sort((a,b)=>a.day-b.day);
          const DAY_MAP_LIMIT=5;
          const visibleEntries=showDayMapMore?monthEntries:monthEntries.slice(0,DAY_MAP_LIMIT);
          return (
            <div style={{display:"grid",gap:10}}>
              <div style={{padding:14,borderRadius:16,border:"1px solid "+S.border,background:S.surface}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:10}}>
                  <div>
                    <p style={{color:S.text,fontSize:15,fontWeight:900,margin:"0 0 4px"}}>{MONTH_NAMES[month]} {year}</p>
                    <p style={{color:S.muted,fontSize:12,margin:0}}>{monthEntries.length} marked sacred days {showDayMapMore?"":"— showing top "+Math.min(DAY_MAP_LIMIT,monthEntries.length)}</p>
                  </div>
                  <button onClick={()=>{setView("grid");setSelDay(null);}} style={{padding:"8px 12px",borderRadius:12,border:"1px solid "+S.border,background:"transparent",color:S.text,fontSize:12,fontWeight:700,cursor:"pointer"}}>Open calendar</button>
                </div>
                {monthEntries.length?(
                  <>
                    <div style={{display:"grid",gridTemplateColumns:bp==="desktop"?"repeat(2,1fr)":"1fr",gap:8}}>
                      {visibleEntries.map((f,i)=>(
                        <button key={f.name+i} onClick={()=>{setView("grid");setSelDay(f.day);}} style={{textAlign:"left",padding:"10px 12px",borderRadius:12,border:"1px solid "+S.border,background:S.card,cursor:"pointer"}}>
                          <p style={{color:S.saffron,fontSize:12,fontWeight:800,margin:"0 0 3px"}}>{String(f.day).padStart(2,"0")} {MONTH_NAMES[month]}</p>
                          <p style={{color:S.text,fontSize:13,fontWeight:700,margin:0}}>{f.name}</p>
                          {f.desc&&<p style={{color:S.muted,fontSize:11,margin:"4px 0 0",lineHeight:1.45}}>{f.desc}</p>}
                        </button>
                      ))}
                    </div>
                    {monthEntries.length>DAY_MAP_LIMIT&&(
                      <button onClick={()=>setShowDayMapMore(v=>!v)} style={{marginTop:10,width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid "+S.saffron+"60",background:"transparent",color:S.saffron,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                        {showDayMapMore?"Show fewer ▲":"View all "+monthEntries.length+" sacred days ▼"}
                      </button>
                    )}
                  </>
                ):(<p style={{color:S.muted,fontSize:12,margin:0}}>No mapped highlights yet for this month.</p>)}
              </div>
            </div>
          );
        })()}
      </Card>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[["grid","📆 Calendar"],["list","📋 All Festivals"]].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{flex:1,padding:"10px 0",borderRadius:12,border:"1px solid "+(view===v?S.saffron:S.border),background:view===v?S.saffron:"transparent",color:view===v?"#FFFFFF":S.muted,fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.2s"}}>{l}</button>
        ))}
      </div>
      {view==="grid"?(
        <Card S={S}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <button onClick={prevMonth} style={{background:S.border,border:"none",color:S.text,fontSize:22,cursor:"pointer",padding:"6px 14px",borderRadius:10}}>‹</button>
            <span style={{color:S.text,fontSize:17,fontWeight:800}}>{MONTH_NAMES[month]} {year}</span>
            <button onClick={nextMonth} style={{background:S.border,border:"none",color:S.text,fontSize:22,cursor:"pointer",padding:"6px 14px",borderRadius:10}}>›</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:6}}>
            {DAY_NAMES.map(d=><div key={d} style={{textAlign:"center",color:S.muted,fontSize:13,fontWeight:700,padding:"5px 0"}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
            {days.map((d,i)=>{
              const entries=getEntries(d), primary=entries[0], extraCount=Math.max(0,entries.length-1), isTod=d===24&&month===2&&year===2026,isSel=d===selDay;
              return(
                <div key={i} onClick={()=>d&&setSelDay(isSel?null:d)}
                  style={{minHeight:bp==="desktop"?74:58,borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",cursor:d?"pointer":"default",
                    background:isSel?S.saffron:isTod?"rgba(255,112,64,0.18)":entries.length?"rgba(255,255,255,0.05)":"transparent",
                    border:isTod?"2px solid "+S.saffron:"1px solid "+(d?S.border+"80":"transparent"),transition:"all 0.15s",padding:"6px 3px"}}>
                  {d&&<>
                    <span style={{color:isSel?"#FFFFFF":isTod?S.saffron:S.text,fontSize:bp==="desktop"?14:12,fontWeight:isTod||isSel?800:500}}>{d}</span>
                    {primary&&<span style={{fontSize:13,marginTop:2}}>{primary.icon}</span>}
                    {primary&&bp!=="mobile"&&<span style={{fontSize:9,color:isSel?"#FFFFFF":S.muted,marginTop:1,textAlign:"center",lineHeight:1.2,maxWidth:"95%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{primary.name}</span>}
                    {extraCount>0&&<span style={{marginTop:2,padding:"1px 6px",borderRadius:10,background:isSel?"rgba(255,255,255,0.2)":S.surface,color:isSel?"#FFFFFF":S.gold,fontSize:9,fontWeight:800}}>+{extraCount}</span>}
                  </>}
                </div>
              );
            })}
          </div>
          {selDay&&<SelDayDetail selDay={selDay} month={month} year={year} S={S} T={T} setCalFest={setCalFest} getEntries={getEntries}/>}
        </Card>
      ):(
        <>
          <div style={{display:"flex",gap:8,marginBottom:8,overflowX:"auto",paddingBottom:2,alignItems:"center"}}>
            {[["all","All"],["major","Major"],["purnima","Purnima"],["regional","Regional"]].map(([val,lbl])=>(
              <button key={val} onClick={()=>setFilter(val)} style={{padding:"7px 16px",borderRadius:20,whiteSpace:"nowrap",border:filter===val?"none":"1px solid "+S.border,background:filter===val?S.saffron:"transparent",color:filter===val?"#FFFFFF":S.muted,fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0}}>{lbl}</button>
            ))}
            <button onClick={()=>setShowAllYear(v=>!v)} style={{flexShrink:0,marginLeft:"auto",padding:"7px 13px",borderRadius:20,border:"1px solid "+(showAllYear?S.green:S.border),background:showAllYear?S.green+"18":"transparent",color:showAllYear?S.green:S.muted,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
              {showAllYear?"📅 All Year ✓":"📅 All Year"}
            </button>
          </div>
          <p style={{color:S.muted,fontSize:12,margin:"0 0 12px",fontWeight:600}}>
            {showAllYear?"Showing all "+filtered.length+" festivals across 2026":"Showing "+filtered.length+" festival(s) in "+MONTH_NAMES[month]+(filtered.length===0?" — try 'All Year' above":"")}
          </p>
          {filtered.map(f=>(
            <div key={f.id} id={`festival-card-${f.id}`}>
            <Card onClick={()=>setOpenF(openF===f.id?null:f.id)} S={S}>
              <div style={{display:"flex",alignItems:"center",gap:13}}>
                <div style={{width:54,height:54,borderRadius:14,background:f.color+"25",border:"2px solid "+f.color+"55",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>{f.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><p style={{color:S.text,fontSize:15,fontWeight:800,margin:0}}>{f.name}</p><Badge label={f.type==="major"?"Major":f.type==="purnima"?"Purnima":"Regional"} color={f.color}/></div>
                  <p style={{color:f.color,fontSize:13,fontWeight:700,margin:"3px 0 0"}}>{f.date} 2026 — {f.vedic}</p>
                  <p style={{color:S.muted,fontSize:12,margin:"2px 0 0"}}>{f.region}</p>
                </div>
                <span style={{color:S.muted,fontSize:16}}>{openF===f.id?"▲":"▼"}</span>
              </div>
              {openF===f.id&&(
                <div style={{marginTop:14,padding:16,background:S.inputBg,borderRadius:12,borderTop:"1px solid "+S.border}}>
                  <p style={{color:S.text,fontSize:13,lineHeight:1.65,margin:"0 0 10px"}}>{f.desc}</p>
                  <div style={{background:S.surface,borderRadius:10,padding:12,marginBottom:14,borderLeft:"3px solid "+f.color}}>
                    <p style={{color:f.color,fontSize:13,fontWeight:700,margin:"0 0 5px",textTransform:"uppercase"}}>{T.howTo}</p>
                    <p style={{color:S.muted,fontSize:13,margin:0,lineHeight:1.6}}>{f.howTo}</p>
                  </div>
                  <div style={{background:S.surface,borderRadius:10,padding:10,marginBottom:12,borderLeft:"3px solid "+S.blue}}>
                    <p style={{color:S.blue,fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:0.7,margin:"0 0 4px"}}>Accuracy note</p>
                    <p style={{color:S.muted,fontSize:12,margin:0,lineHeight:1.55}}>Festival dates can vary by locality, sunrise, and sampradaya. This app now flags that explicitly instead of assuming a single date is universal.</p>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={e=>{e.stopPropagation();setCalFest(f);}} style={{flex:1,padding:"11px 0",borderRadius:10,border:"none",background:f.color,color:"#FFFFFF",fontSize:13,fontWeight:700,cursor:"pointer"}}>📅 {T.addToCal}</button>
                    <button onClick={e=>{e.stopPropagation();setCalFest(f);}} style={{flex:1,padding:"11px 0",borderRadius:10,border:"1px solid "+f.color,background:"transparent",color:f.color,fontSize:13,fontWeight:700,cursor:"pointer"}}>🔔 {T.reminder}</button>
                    <button onClick={e=>{e.stopPropagation();shareFestival(f);}} style={{padding:"11px 14px",borderRadius:10,border:"1px solid "+S.border,background:"transparent",color:S.muted,fontSize:15,cursor:"pointer"}} title="Share this festival">🔗</button>
                  </div>
                </div>
              )}
            </Card>
            </div>
          ))}
        </>
      )}
    </div>
  );
}


function getTemplePhotoSearchUrl(placeName, locationLabel){
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(placeName+" "+locationLabel)}`;
}

/* City emoji fallback icons (shown as background layer always) */
const CITY_BG_ICONS={
  austin:"🏛️",chicago:"🌆",newyork:"🗽",houston:"🌃",toronto:"🍁",
  london:"💂",dubai:"🌇",singapore:"🦁",sydney:"🌉",kathmandu:"⛰️",
  delhi:"🕌",agra:"🕌",jaipur:"🏰",ahmedabad:"🕍",varanasi:"🛕",
  mumbai:"🌊",chennai:"🌊",hyderabad:"🏙️",bengaluru:"🌳",kolkata:"🎨",
  pune:"🏯",prayagraj:"🙏",tirupati:"🛕",haridwar:"🙏",rishikesh:"🧘",
  ayodhya:"🛕",mathura:"🙏",nashik:"🛕",dwarka:"🌊",amritsar:"✨",
  vrindavan:"🌸",ujjain:"🔱",mysuru:"👑",
};

// Wikipedia page fallback chains — first page with a thumbnail wins
const WIKI_CITY_PAGES={
  austin:["Texas_State_Capitol","Austin,_Texas"],
  chicago:["Willis_Tower","Chicago"],
  newyork:["Times_Square","New_York_City"],
  houston:["Houston","Space_Center_Houston"],
  toronto:["CN_Tower","Toronto"],
  london:["Tower_Bridge","London"],
  dubai:["Burj_Khalifa","Dubai"],
  singapore:["Marina_Bay_Sands","Singapore"],
  sydney:["Sydney_Opera_House","Sydney"],
  kathmandu:["Swayambhunath","Kathmandu"],
  delhi:["India_Gate,_New_Delhi","New_Delhi"],
  agra:["Taj_Mahal","Agra"],
  jaipur:["Hawa_Mahal","Jaipur"],
  ahmedabad:["Adalaj_stepwell","Ahmedabad"],
  varanasi:["Varanasi","Kashi_Vishwanath_Temple"],
  mumbai:["Gateway_of_India","Mumbai"],
  chennai:["Marina_Beach","Chennai"],
  hyderabad:["Charminar","Hyderabad"],
  bengaluru:["Vidhana_Soudha","Bangalore"],
  kolkata:["Victoria_Memorial,_Kolkata","Kolkata"],
  pune:["Shaniwar_Wada","Pune"],
  prayagraj:["Triveni_Sangam,_Prayagraj","Prayagraj"],
  tirupati:["Tirumala_Venkateswara_Temple","Tirupati"],
  haridwar:["Har_ki_Pauri","Haridwar"],
  rishikesh:["Laxman_Jhula","Rishikesh"],
  ayodhya:["Ram_Mandir,_Ayodhya","Ayodhya"],
  mathura:["Krishna_Janmabhoomi","Mathura"],
  nashik:["Trimbakeshwar_Shiva_temple","Nashik"],
  dwarka:["Dwarkadhish_Temple","Dwarka,_Gujarat"],
  amritsar:["Golden_Temple","Amritsar"],
  vrindavan:["Prem_Mandir","Vrindavan"],
  ujjain:["Mahakaleshwar_Jyotirlinga","Ujjain"],
  mysuru:["Mysore_Palace","Mysuru"],
};

// Module-level cache — survives component unmounts/remounts and tab switches
const _wikiImgCache={};

// Memoized city image panel — Wikipedia API + DOM ref (no state, no flicker loop)
const CityImagePanel=memo(function CityImagePanel({cityKey,bg,icon,landmark,minH,radius,onExplore}){
  // layerA = permanent base (always visible)
  // layerB = temporary overlay (fades in on top, promoted to layerA after fade)
  const layerARef=useRef(null);
  const layerBRef=useRef(null);

  // useLayoutEffect runs SYNCHRONOUSLY before the browser paints.
  // This means React's re-render never produces a visible "opacity:0" frame —
  // we correct the DOM state before the user ever sees it.
  useLayoutEffect(()=>{
    const la=layerARef.current;
    const lb=layerBRef.current;
    if(!la||!lb) return;
    // Kill any in-progress overlay before browser paints
    lb.style.transition="none";
    lb.style.opacity="0";
    lb.style.backgroundImage="";
    lb.style.zIndex="2";
    la.style.zIndex="2";
    // Cached: show instantly — happens before paint, zero flash
    if(_wikiImgCache[cityKey]){
      la.style.backgroundImage="url("+_wikiImgCache[cityKey]+")";
      la.style.opacity="1";
    }
    // Not cached: layerA keeps whatever it was showing (previous city or transparent)
  },[cityKey]);

  // useEffect handles the async image fetch (runs after paint — fine for background loading)
  useEffect(()=>{
    if(_wikiImgCache[cityKey]) return; // Already handled synchronously in useLayoutEffect
    const la=layerARef.current;
    const lb=layerBRef.current;
    if(!la||!lb) return;
    const pages=WIKI_CITY_PAGES[cityKey]||[];
    let alive=true;
    const tryPage=(idx)=>{
      if(!alive||idx>=pages.length) return;
      fetch("https://en.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(pages[idx]))
        .then(r=>r.ok?r.json():Promise.reject())
        .then(data=>{
          if(!alive) return;
          const src=data.originalimage?.source||data.thumbnail?.source;
          if(src){
            const img=new Image();
            img.onload=()=>{
              if(!alive) return;
              _wikiImgCache[cityKey]=src;
              // Fade overlay in on top — base stays fully visible throughout
              lb.style.transition="none";
              lb.style.opacity="0";
              lb.style.backgroundImage="url("+src+")";
              lb.style.zIndex="3";
              la.style.zIndex="2";
              requestAnimationFrame(()=>{
                requestAnimationFrame(()=>{
                  if(!alive) return;
                  lb.style.transition="opacity 0.5s ease";
                  lb.style.opacity="1";
                  // Promote overlay to base after fade completes
                  setTimeout(()=>{
                    if(!alive) return;
                    la.style.transition="none";
                    la.style.backgroundImage="url("+src+")";
                    la.style.opacity="1";
                    lb.style.transition="none";
                    lb.style.opacity="0";
                    lb.style.backgroundImage="";
                    la.style.zIndex="2";
                    lb.style.zIndex="2";
                  },520);
                });
              });
            };
            img.onerror=()=>tryPage(idx+1);
            img.src=src;
          } else { tryPage(idx+1); }
        })
        .catch(()=>tryPage(idx+1));
    };
    tryPage(0);
    return()=>{alive=false;};
  },[cityKey]);

  return(
    <div
      onClick={onExplore?(e)=>{e.stopPropagation();onExplore();}:undefined}
      style={{position:"relative",minHeight:minH,background:"linear-gradient("+bg+")",
        borderRadius:radius,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",
        cursor:onExplore?"pointer":"default"}}>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
        justifyContent:"center",flexDirection:"column",gap:8,pointerEvents:"none",zIndex:1}}>
        <span style={{fontSize:60,opacity:0.35}}>{icon}</span>
      </div>
      {/* NO opacity in JSX — React must never overwrite our direct DOM opacity changes */}
      <div ref={layerARef} style={{position:"absolute",inset:0,zIndex:2,
        backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"}} />
      <div ref={layerBRef} style={{position:"absolute",inset:0,zIndex:2,
        backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"}} />
      {/* Bottom gradient + landmark + explore CTA — always visible, pointer-events none so click bubbles to container */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,
        background:"linear-gradient(transparent,rgba(0,0,0,0.88))",
        padding:"28px 12px 10px",zIndex:5,pointerEvents:"none"}}>
        {landmark&&(
          <p style={{color:"rgba(255,255,255,0.92)",fontSize:11,fontWeight:700,margin:"0 0 5px"}}>📍 {landmark}</p>
        )}
        {onExplore&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{color:"rgba(255,200,100,0.9)",fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>TAP IMAGE TO EXPLORE</span>
            <span style={{background:"rgba(255,150,30,0.85)",borderRadius:20,padding:"3px 10px",
              color:"#fff",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",gap:4,
              backdropFilter:"blur(4px)"}}>🗺️ City Guide →</span>
          </div>
        )}
      </div>
    </div>
  );
});

/* ── City Detail Data ── */
const CITY_DETAIL_DATA={
  varanasi:{weather:"Hot summers (Apr–Jun, 40°C+), pleasant winters (Dec–Feb, 10–20°C), monsoon July–Sept. Best time: Oct–Mar.",food:["Kashi Chaat (tamatar chaat)","Malaiyyo (winter-only frothy milk dessert)","Baati Chokha (roasted wheat balls)","Thandai (spiced milk drink)","Litti Chokha (on ghats)","Rabri Jalebi (morning breakfast)"],temples:["Kashi Vishwanath — one of 12 Jyotirlinga","Sankat Mochan Hanuman Temple","Tulsi Manas Mandir — Ramayana inscribed on walls","Durga Kund Mandir (Bhavani Mata)","Mrityunjaya Mahadev — Trailokya Nath","Sarnath Buddhist Stupa (6 km away)"],culture:"Home to 84 ghats on River Ganga. Ganga Aarti at Dashashwamedh Ghat daily at sunset is a divine spectacle. Sanskrit has been taught here for 3000+ years. The city of moksha — Hindus believe dying here grants liberation.",funFacts:["Oldest living city in the world (~3,000 years)","Mark Twain called it 'older than history, older than tradition'","Has 3,000+ temples in the city","Silk weaving (Banarasi silk) is a 500-year tradition","Kabir Das was born here; so was Tulsidas"],travelTips:["Book Ganga Aarti viewing boat in advance","Avoid leather items — sacred city rules","Morning boat ride on Ganga is unmissable","Carry cash — many ghat shops don't accept cards"]},
  ayodhya:{weather:"Hot summers (40–45°C), cool winters (5–15°C). Best time: Oct–March (Ram Navami in April is peak pilgrimage).",food:["Pedha & Laddoo (temple prasad)","Aloo Kachori","Mango (renowned Langra & Dasheri)","Chura Matar (winter special)","Rabri","Makhan Mishri (Krishna prasad style)"],temples:["Ram Janmabhoomi (Naya Ram Mandir)","Hanuman Garhi — main Hanuman temple","Kanak Bhawan — gifted by Kaikeyi to Sita","Nageshwarnath Temple — ancient Shiva temple","Dashrath Mahal — birthplace of Dasharatha","Guptar Ghat — where Ram took Jal Samadhi"],culture:"Birthplace of Lord Rama — one of the 7 sacred cities (Sapta Puri). The entire city celebrates Deepotsav (Diwali) with lakhs of diyas on the Saryu riverbank. Ram Navami brings millions of pilgrims.",funFacts:["Ram Navami celebration here rivals Kumbh in scale","The new Ram Mandir consecrated in January 2024","Saryu River is considered as sacred as Ganga","200+ temples within 3 km radius","Diwali here holds Guinness record for most diyas lit"],travelTips:["Strictly vegetarian city — no non-veg/alcohol","Barefoot in temple premises required","Ram Navami (March/April) — book months in advance","Take a sunrise aarti at Saryu Ghat"]},
  vrindavan:{weather:"Similar to Mathura. Best: Oct–Mar. Holi in March is absolutely unmissable.",food:["Peda (milk sweet — world famous)","Rabri","Makhan (white butter — Krishna's favourite)","Kesar Burfi","Panchamrit (temple prasad)","Govardhan Parikrama food stalls"],temples:["Banke Bihari Mandir — most visited","ISKCON Vrindavan (Krishna Balaram Mandir)","Radha Raman Temple (16th century)","Prem Mandir (illuminated at night)","Govind Dev Ji — Jaipur Royal family temple","Nidhivan — forest where Krishna dances at night"],culture:"The land of Krishna's childhood leelas. 5,000+ temples in a small town. ISKCON presence draws international devotees. Holi in Vrindavan (Lathmar Holi at Nandgaon, Barsana) is India's most famous. Widows' Holi is a beautiful tradition.",funFacts:["Nidhivan: gates locked at night — legend says Krishna dances here","Braj Holi begins 45 days before Holi — Lathmar Holi (women beat men with sticks)","Every molecule of dust here is considered sacred (Braj Raj)","Has more temples per sq km than any city in India"],travelTips:["Very crowded on Ekadashi, Janmashtami, Holi","Monkeys are sacred but can snatch items","Parikrama of Vrindavan (10 km) is very auspicious","Wear dhoti/salwar — western clothes discouraged in temples"]},
  mathura:{weather:"Hot summers, pleasant winters. Janmashtami (Aug-Sep) is THE time to visit — though extremely crowded.",food:["Mathura ke Pede (famous throughout India)","Rabri Jalebi","Khurchan (thick milk sweet)","Lassi","Alu Poori"],temples:["Shri Krishna Janmabhoomi","Dwarkadhish Temple (grand architecture)","Vishram Ghat — Krishna rested here after killing Kansa","Govardhan Hill — lifted by Krishna (25 km)","Gokul — where Krishna spent childhood"],culture:"Birthplace of Lord Krishna. The twin city of Vrindavan. Mathura-Vrindavan is the Braj Bhumi. Janmashtami here is celebrated with jhankis (tableaux), matki phod, and midnight abhishek.",funFacts:["Krishna was born in a prison cell here around 3228 BCE","Yamuna River here has special significance","Braj 84 Kos Parikrama covers 252 km and takes ~1 month","Holi lasts a full month in Braj culture"],travelTips:["Strictly vegetarian city","Combine with Vrindavan/Govardhan in one trip","Janmashtami bookings open months in advance","Mathura-Vrindavan expressway makes Delhi day trip easy"]},
  prayagraj:{weather:"Hot summers, cool winters. Kumbh Mela 2025 was Jan-Feb. Next Maha Kumbh 2037. Magh Mela: Jan-Feb annually.",food:["Aloo Tikki","Chaat","Imarti (orange jalebi)","Kadhi Bhat","Tehri (spiced rice)","Dum Aloo"],temples:["Triveni Sangam — confluence of Ganga, Yamuna, Saraswati","Allopanishad Prayagraj Mandir","Hanuman Mandir (Bade Hanuman ji) — lying idol","Mankameshwar Shiva Temple","Shankara Vimana Mandapam","Kamla Devi Temple"],culture:"The Tirthraj — King of Pilgrimage sites. The Sangam where three sacred rivers meet. Kumbh Mela (every 12 years) brings 100+ million pilgrims — the largest human gathering on earth. Allahabad was the center of India's freedom movement.",funFacts:["Sangam is believed to wash sins of many lifetimes","Akbar built Allahabad Fort here in 1583 (now Army property)","Jawaharlal Nehru, Amitabh Bachchan, Priyanka Chopra are from here","During Kumbh, satellite imagery shows the crowd from space"],travelTips:["Take Sangam boat at dawn for spiritual experience","Wash clothes and possessions in Sangam water","Magh Mela (January) is annual mini-Kumbh","Triveni Sangam entry is free"]},
  haridwar:{weather:"Pleasant year-round. Oct–April ideal. Kumbh every 12 years, Ardh Kumbh every 6 years. Monsoon June–Sep.",food:["Aloo Poori","Kachori Sabji","Rabri","Khichdi Prasad (Bharat Mata Temple)","Chaat","Lassi"],temples:["Har Ki Pauri — holiest ghat, Ganga Aarti at sunset","Mansa Devi Temple (cable car available)","Chandi Devi Temple (rope way)","Maya Devi Mandir — Shakti Peetha","Sapt Rishi Ashram","Daksha Mahadev Temple"],culture:"Gateway to the Himalayas. 'Hari Ka Dwar' — door to God. Ganga Aarti at Har Ki Pauri every evening is one of India's most iconic spiritual events. 7 rishis meditated at Sapt Rishi Ghat.",funFacts:["Ganga descends from Himalayas to plains at Haridwar","Kumbh Mela here is held every 12 years — next 2034","Haridwar exports ayurvedic medicines worldwide","Town has 2,000+ ashrams and 100+ yoga centres"],travelTips:["Non-vegetarian food/alcohol strictly banned in Haridwar","Purchasing plastic bottles adds to Ganga pollution — bring reusable","Ganga Aarti at Har Ki Pauri: be there 30 mins early","Combine with Rishikesh (25 km away)"]},
  rishikesh:{weather:"Pleasant year-round. March–June best for yoga/rafting. Monsoon (Jul–Sep) — avoid rafting. Dec–Feb: cold (5°C nights).",food:["The Beatles Café (German Bakery)","Chotiwala Restaurant (since 1958)","Madras Café (South Indian)","Organic cafes near ashrams","Rajma Chawal","Momos (Tibetan)"],temples:["Triveni Ghat — sunrise aarti is spectacular","Neelkanth Mahadev Temple (trekking trail)","Ram Jhula temples","Swarg Ashram complex","Parmarth Niketan — huge evening aarti","Bharat Mandir — oldest in Rishikesh (12th cent.)"],culture:"World Yoga Capital. Beatles stayed at Maharishi Mahesh Yogi's ashram here in 1968 (now Beatles Ashram open to visitors). International Yoga Festival every March draws global practitioners.",funFacts:["Ganga here is clear blue-green — pollution enters downstream","Rishikesh is India's adventure sports capital (rafting, bungee, zip-line)","The Beatles wrote 48 songs during their stay here in 1968","Entire town is vegetarian — alcohol banned","Lakshman Jhula footbridge (now closed) was built in 1929"],travelTips:["Book yoga/meditation retreats weeks in advance","River rafting: Grade 4-5 rapids — highly recommended","Travel light — steep stairs at many ashrams","Laptops/work-friendly cafes for digital nomads"]},
  tirupati:{weather:"Hot and humid year-round. Oct–Mar is best. Brahmotsavam (Sep–Oct) is peak festival.",food:["Tirupati Laddu — famous prasad (GI-tagged)","Pulihora (tamarind rice prasad)","Daddojanam (curd rice)","Vada (given at token counter)","Pesarattu (green moong dosa)","Gongura Pachadi"],temples:["Sri Venkateswara (Balaji) Temple — richest temple","Govindaraja Swamy Temple","Sri Padmavathi Devi Temple (Tiruchanur)","ISKCON Tirupati","Sri Kapileswara Swamy Temple","Sri Kodeswara Swamy (Srikalahasti nearby)"],culture:"Tirumala temple on 7th hill draws 50,000–100,000 devotees daily — the most visited religious site in the world. Annual revenue exceeds ₹4,000 crore. Hair tonsure (head shaving) is a major vow offering.",funFacts:["Temple earns ₹4,000 crore+ annually — wealthiest Hindu temple","Laddu prasad given since 300 years — 100,000 laddus made daily","Elephant Lakshmi carries out daily procession","Head tonsure here — 600+ barbers working round the clock","Temple has 1 tonne gold in its treasury"],travelTips:["Book darshan tokens online — otherwise 12–20 hr queue","Darshan: Rs 300 for special entry (2-4 hrs wait)","No leather items allowed inside temple","Stay: TTDC accommodation or private hotels in Tirupati city (26 km)"]},
  delhi:{weather:"Extreme summers (45°C, Apr–Jun) and cold winters (2°C, Dec–Jan). Best: Oct–Mar. Monsoon: Jul–Sep.",food:["Chole Bhature (Sitaram Diwan Chand)","Paranthe Wali Gali (Old Delhi)","Butter Chicken (Moti Mahal — birthplace)","Dahi Bhalle","Jalebi at Jalebi Wala","Nihari (Old Delhi)","Mangola & Shakkar Para (Dilli 6 snacks)"],temples:["Akshardham Temple — world's largest Hindu temple complex","Lotus Temple (Bahai)","Birla Mandir","Chattarpur Temple (Durga)","Kalkaji Devi Mandir","ISKCON Delhi","Bangla Sahib Gurudwara"],culture:"India's capital for 700+ years under different rulers. Blend of Mughal grandeur, British colonial architecture, and modern India. Red Fort, Qutub Minar, Humayun's Tomb are UNESCO sites.",funFacts:["Delhi has been capital city 8 different times in history","Qutub Minar took 15 years to build (1193–1220 AD)","Akshardham Temple spans 100 acres — Guinness record","Khan Market is Asia's most expensive retail street","Delhi has the world's largest road network after Shanghai"],travelTips:["Metro is the best way to travel (huge city)","Old Delhi by auto-rickshaw is an experience","Avoid travelling during Holi/Diwali — most shops closed","Winter mornings: fog delays flights regularly"]},
  mumbai:{weather:"Tropical — humid year-round. Best: Nov–Feb (25–30°C). Monsoon (Jun–Sep) brings very heavy rain. Summers (Mar–May) are hot and humid.",food:["Vada Pav (Kirti College, Anand Stall)","Pav Bhaji (Juhu Beach)","Bhelpuri/Sev Puri (Chowpatty)","Bombay Sandwich (Bandra)","Misal Pav","Modak (Ganesh Chaturthi special)","Caramel Custard (Irani cafes)"],temples:["Siddhivinayak Temple (Prabhadevi) — Ganesha","Mahalakshmi Temple","Haji Ali Dargah (floating on sea)","ISKCON Mumbai (Juhu)","Banganga Tank complex","Mount Mary Basilica (Bandra)"],culture:"India's financial and film capital. Bollywood, fashion, and business converge here. Ganesh Chaturthi is Mumbai's biggest festival — 10 days of devotion with Lalbaug Cha Raja drawing 1.5 million on first day.",funFacts:["Dharavi is one of the world's most productive slums (₹700 crore annual GDP)","Mumbai's dabbawalas have Six Sigma logistics accuracy","Ganesh Chaturthi immersion: 2,50,000+ idols in one day","CST railway station is a UNESCO World Heritage Site","Film City (Goregaon) produces 50+ films annually"],travelTips:["Local trains are fast but extremely crowded at rush hour","Monsoon: carry umbrella always — it rains heavily","Marine Drive evening walk is free and beautiful","Book Siddhivinayak darshan online to skip queue"]},
  kolkata:{weather:"Hot humid summers, mild winters (15–20°C Dec–Feb). Best: Oct–Mar. Durga Puja (October) — the biggest festival.",food:["Rosogolla (Nobin Chandra Das — inventor)","Sandesh","Kathi Roll (Nizam's — original)","Luchi Alur Dom (puffed bread)","Jhaal Muri","Doi Maach (fish in yogurt)","Mishti Doi"],temples:["Kalighat Kali Temple — one of 51 Shakti Peetha","Dakshineswar Kali Temple (Ramakrishna's temple)","Belur Math (Ramakrishna Math HQ)","ISKCON Kolkata","Birla Mandir","Kali Temple at Dakshineshwar"],culture:"Cultural capital of India. Nobel laureates, films (Ray, Ghatak), literature, music, football. Durga Puja here is a UNESCO Intangible Cultural Heritage — entire city transforms into an open-air art gallery.",funFacts:["Only Indian city with hand-pulled rickshaws (being phased out)","Howrah Bridge: 1943, no nuts/bolts — all rivets (26,500 tonnes)","Rabindranath Tagore wrote National Anthem here","Rosogolla origin debate: Kolkata vs Odisha — Kolkata officially won GI tag","Mother Teresa established her mission here in 1950"],travelTips:["Durga Puja (October) — pandal hopping is a must","Yellow taxi is iconic but meter often 'broken' — negotiate","Tram rides (last running trams in India) — take one","Victoria Memorial is stunning at sunset"]},
  london:{weather:"Mild and rainy year-round. Summers (Jun–Aug): 18–22°C. Winters: 3–8°C with little daylight. Bring layers always.",food:["Chicken Tikka Masala (invented in UK)","Fish & Chips","Full English Breakfast","Afternoon Tea","Masala Dosa at South Indian restaurants","Brick Lane curry house experience"],temples:["BAPS Shri Swaminarayan Mandir (Neasden) — Europe's largest Hindu temple","Sri Murugan Temple (East Ham)","Shri Venkateswara Temple (Tividale)","Arya Samaj Mandir (Tooting)","London Hindu Temple (Ealing)","Bhaktivedanta Manor ISKCON (Watford, 45 min)"],culture:"Britain's largest Hindu community (~1 million) concentrated in Leicester, London (Wembley, Tooting, Harrow). Diwali on Trafalgar Square draws 30,000 people. Navratri at Wembley Arena hosts 10,000+.",funFacts:["NHS employs the most Indian-origin doctors globally","Leicester celebrates Diwali on Belgrave Road — larger than India","Bhaktivedanta Manor was gifted to ISKCON by George Harrison (Beatles)","British Museum holds India's Koh-i-Noor diamond (disputed)","10 Downing Street: Rishi Sunak — first Hindu UK PM"],travelTips:["Oyster Card for unlimited Tube/Bus travel","Book museum entries in advance (British Museum free)","Bhaktivedanta Manor: go on Janmashtami (Aug)","Southall for authentic Indian groceries and restaurants"]},
  dubai:{weather:"Very hot summers (45°C, Jun–Sep). Perfect winters (20–25°C, Nov–Mar). Diwali here is celebrated by 3 million+ NRIs.",food:["Shawarma","Mandi (rice + meat)","Machboos","Biryani (Pak/Indian restaurants)","Indian vegetarian restaurants in Bur Dubai/Karama","Kerala restaurants in Deira"],temples:["Shiva temple (Bur Dubai) — oldest Hindu temple in UAE","Krishna Haveli (Jebel Ali)","Sindhi Gurudwara (Al Quoz)","Hindu Mandir complex (under construction — Al Wasl)","Sikh Gurudwara","Universal Heritage site"],culture:"City of superlatives — tallest building, largest mall, biggest indoor ski slope. 30% of Dubai's population is Indian — second-largest expat community. Diwali, Navratri, Onam, and Eid are all major celebrations.",funFacts:["Burj Khalifa shadow falls 60 km at sunrise","Dubai Creek divides the old and new city","Gold Souk has more gold on display than any other place on earth","Emirates has 5,000+ Indian crew members","Indians form the single largest expat community in UAE"],travelTips:["Dress modestly at public places and souks","Diwali (Oct/Nov): Karama, Meena Bazaar area glows","Ramadan hours: restaurants closed daytime — book Indian/Western","Metro + Tram + Bus Day Pass = excellent value"]},
  singapore:{weather:"Hot and humid year-round (28–32°C). Rainy season: Nov–Jan. Best time: Feb–April and June–August.",food:["Chicken Rice (Tian Tian at Maxwell)","Laksa","Char Kway Teow","Chilli Crab","Roti Prata","Little India: Banana Leaf Curry","Tekka Market: Indian food hawkers"],temples:["Sri Veeramakaliamman Temple (Little India — 1881)","Sri Mariamman Temple (Chinatown — oldest, 1827)","Sri Srinivasa Perumal Temple","Sri Thendayuthapani Temple","Arulmigu Rajiv Loganadhasamy","Lian Shan Shuang Lin Monastery"],culture:"Little India (Serangoon Road) is a vibrant hub — Deepavali street lighting is world-famous. Thaipusam festival with kavadi bearers is a stunning spectacle. Singapore's Tamil community has been here since 1800s.",funFacts:["Singapore has 4 official languages — Malay, Mandarin, Tamil, English","Little India: 24-hr Mustafa Centre is a shopping institution","Sentosa Island — Singapore's resort/theme park island","No chewing gum allowed (law)","Hawker centres: cheapest Michelin-star food in the world"],travelTips:["MRT (subway) covers entire island — buy EZ-link card","Deepavali street lights (Oct-Nov) in Little India — beautiful for photos","Hawker centres for cheap authentic food","Thaipusam: book viewing spot at Sri Perumal Temple early"]},
  kathmandu:{weather:"Pleasant spring (Mar–May) and autumn (Sep–Nov) — best for trekking. Monsoon Jun–Aug: heavy rain. Winter Dec–Feb: cold, clear skies. Perfect for temples.",food:["Momos (buffalo or veg)","Dal Bhat Tarkari (national dish)","Thukpa (noodle soup)","Sel Roti (sweet rice bread)","Yomari (sweet dumpling)","Newari Bhoj (traditional feast)"],temples:["Pashupatinath Temple — most sacred Shiva temple outside India","Boudhanath Stupa — largest Buddhist stupa in world","Swayambhunath (Monkey Temple)","Changu Narayan — oldest Vishnu temple (4th cent AD)","Dakshinkali — Kali temple (live sacrifice)","Manakamana — accessible by cable car"],culture:"Living goddess (Kumari) tradition. Newari culture with 13th century art, carved wood temples, and festivals like Indra Jatra. Nepal is the only Hindu kingdom — officially secular since 2008.",funFacts:["Only country with a non-rectangular flag","Pashupatinath Temple: entry only for Hindus","Living Kumari — a pre-pubescent girl chosen as goddess","8 of world's 10 tallest mountains in Nepal","Sanskrit was Nepal's official language until 18th century"],travelTips:["Entry to some temples Hindu-only — carry ID","Pashupatinath: arrive at dawn for Shiva aarti","Cremation at Pashupatinath ghat — respectful viewing allowed","Altitude awareness: Kathmandu is at 1,400m — acclimatize"]},
  amritsar:{weather:"Hot summers (40°C, May–Jun), cold winters (2°C, Dec–Jan). Best: Oct–March. Diwali and Baisakhi are peak times.",food:["Langar at Golden Temple (free, for all)","Amritsari Kulcha","Lassi (kesar, makhana)","Amritsari Fish","Pinni (winter sweet)","Sarson da Saag + Makki di Roti"],temples:["Sri Harmandir Sahib (Golden Temple) — most sacred Sikh shrine","Durgiana Temple (Lakshmi Narayan)","Ram Tirath — where Sita gave birth to Lava-Kusha","Valmiki Ashram","Jallianwala Bagh (memorial)","Wagah Border (Attari) — 30 km away"],culture:"Heart of Sikhism and Punjab culture. The Golden Temple serves free langar (community meal) 24/7 to 100,000+ people daily. Baisakhi here is a massive celebration — Khalsa Panth was founded at Anandpur Sahib nearby.",funFacts:["Golden Temple: the pool (Amrit Sarovar) gives the city its name","Langar serves 100,000 people daily — all free, run by volunteers","Wagah Border Ceremony: world's most theatrical military changing of guard","Golden Temple is coated with 750 kg of pure gold","Jallianwala Bagh massacre 1919: bullet marks still visible on walls"],travelTips:["Cover head at Golden Temple (scarves provided free)","Remove shoes — free cloak room available","Visit at dawn for the most peaceful darshan","Wagah Border ceremony: arrive 2 hrs early for seats"]},
};

function CityDetailModal({S,cityKey,locationLabel,onClose}){
  const d=CITY_DETAIL_DATA[cityKey];
  const[tab,setTab]=useState("temples");
  // Prevent tap-through: the same tap that opened the modal must not
  // immediately close it by hitting the backdrop. readyRef goes true
  // after 400 ms so the backdrop ignores the ghost click.
  const readyRef=useRef(false);
  useEffect(()=>{
    readyRef.current=false;
    const t=setTimeout(()=>{readyRef.current=true;},400);
    return()=>clearTimeout(t);
  },[]);
  const safeClose=()=>{if(readyRef.current)onClose();};
  if(!d){return(
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={safeClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:560,background:"#0A0010",borderRadius:"20px 20px 0 0",border:"1px solid rgba(255,255,255,0.12)",padding:"24px 20px 32px",textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:10}}>🗺️</div>
        <h3 style={{color:"#fff",fontSize:16,fontWeight:900,margin:"0 0 8px"}}>{locationLabel}</h3>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,margin:"0 0 18px",lineHeight:1.6}}>Rich city guide coming soon! Explore online in the meantime:</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[["🗺️ Google Travel Guide","https://www.google.com/travel/things-to-do?q="+encodeURIComponent(locationLabel)],["🛕 Wikipedia","https://en.wikipedia.org/wiki/"+encodeURIComponent(locationLabel)],["📸 Google Photos","https://www.google.com/search?tbm=isch&q="+encodeURIComponent(locationLabel+" India")]].map(([label,url])=>(
            <a key={label} href={url} target="_blank" rel="noreferrer" style={{display:"block",padding:"11px",borderRadius:10,background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.7)",fontSize:13,textDecoration:"none",fontWeight:600}}>{label} ↗</a>
          ))}
        </div>
        <button onClick={onClose} style={{marginTop:14,background:"transparent",border:"none",color:"rgba(255,255,255,0.4)",fontSize:12,cursor:"pointer"}}>Close</button>
      </div>
    </div>
  );}
  const tabs=[{id:"temples",icon:"🛕",label:"Temples"},{id:"food",icon:"🍽️",label:"Food"},{id:"culture",icon:"🎭",label:"Culture"},{id:"facts",icon:"✨",label:"Facts"},{id:"tips",icon:"💡",label:"Tips"}];
  return(
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={safeClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:560,maxHeight:"88vh",background:"#0A0010",borderRadius:"20px 20px 0 0",border:"1px solid rgba(255,255,255,0.12)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#1A0438,#0D0124)",padding:"16px 18px 12px",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
            <h3 style={{color:"#fff",fontSize:17,fontWeight:900,margin:0}}>🗺️ {locationLabel}</h3>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",borderRadius:"50%",width:28,height:28,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          <p style={{color:"rgba(255,255,255,0.55)",fontSize:11,margin:0}}>🌤️ {d.weather}</p>
        </div>
        {/* Tab Bar */}
        <div style={{display:"flex",gap:4,padding:"8px 14px",background:"#0D001C",flexShrink:0,borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"6px 2px",borderRadius:8,border:"none",background:tab===t.id?"rgba(255,150,50,0.25)":"transparent",color:tab===t.id?"#FFB347":"rgba(255,255,255,0.5)",fontSize:9,fontWeight:tab===t.id?800:600,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <span style={{fontSize:13}}>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </div>
        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
          {tab==="temples"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {d.temples.map((t,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"11px 13px",border:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{color:"#FFB347",fontSize:16,flexShrink:0,marginTop:1}}>🛕</span>
                  <span style={{color:"rgba(255,255,255,0.85)",fontSize:12,lineHeight:1.5}}>{t}</span>
                </div>
              ))}
            </div>
          )}
          {tab==="food"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {d.food.map((f,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"11px 13px",border:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{color:"#22C55E",fontSize:16,flexShrink:0}}>🍽️</span>
                  <span style={{color:"rgba(255,255,255,0.85)",fontSize:12,lineHeight:1.5}}>{f}</span>
                </div>
              ))}
            </div>
          )}
          {tab==="culture"&&(
            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"14px 15px",border:"1px solid rgba(255,255,255,0.08)"}}>
              <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,lineHeight:1.8,margin:0}}>{d.culture}</p>
            </div>
          )}
          {tab==="facts"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {d.funFacts.map((f,i)=>(
                <div key={i} style={{background:"rgba(107,79,255,0.12)",borderRadius:12,padding:"11px 13px",border:"1px solid rgba(107,79,255,0.2)",display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{color:"#A78BFA",fontSize:14,flexShrink:0,marginTop:1}}>✨</span>
                  <span style={{color:"rgba(255,255,255,0.85)",fontSize:12,lineHeight:1.5}}>{f}</span>
                </div>
              ))}
            </div>
          )}
          {tab==="tips"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {d.travelTips.map((t,i)=>(
                <div key={i} style={{background:"rgba(255,192,64,0.08)",borderRadius:12,padding:"11px 13px",border:"1px solid rgba(255,192,64,0.2)",display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{color:"#FFB300",fontWeight:900,fontSize:13,flexShrink:0,marginTop:1}}>{i+1}.</span>
                  <span style={{color:"rgba(255,255,255,0.85)",fontSize:12,lineHeight:1.5}}>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Footer */}
        <div style={{padding:"10px 16px",flexShrink:0,background:"#0D001C",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          <a href={"https://www.google.com/search?q="+encodeURIComponent(locationLabel+" India travel guide")} target="_blank" rel="noreferrer" style={{display:"block",textAlign:"center",padding:"10px",borderRadius:10,background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.6)",fontSize:12,textDecoration:"none",fontWeight:600}}>🌐 Open Full Travel Guide ↗</a>
        </div>
      </div>
    </div>
  );
}

function CityExplorerPanel({S,selectedLocation,bp}){
  const[showCityDetail,setShowCityDetail]=useState(false);
  const guide=CITY_GUIDES[selectedLocation];
  const locationMeta=getLocationMeta(selectedLocation);
  const hasCityDetail=!!CITY_DETAIL_DATA[selectedLocation];
  const cityBgColors={
    austin:"135deg,#1a2a1a,#0d1a0d",chicago:"135deg,#0d1a2e,#0a0f1a",
    newyork:"135deg,#1a0d0d,#2e1515",houston:"135deg,#1a1400,#2e2200",
    toronto:"135deg,#1a0d0d,#2e0d0d",london:"135deg,#0d1220,#141e30",
    dubai:"135deg,#1a1400,#2e2810",singapore:"135deg,#0d1a1a,#0a1a14",
    sydney:"135deg,#0d1a2e,#10203a",kathmandu:"135deg,#1a1420,#221a30",
    delhi:"135deg,#1a0d00,#2e1800",agra:"135deg,#1a1000,#2e1e00",
    jaipur:"135deg,#1a0800,#2e1400",ahmedabad:"135deg,#1a0e00,#2e1800",
    varanasi:"135deg,#1a0e00,#2e1c00",mumbai:"135deg,#001a2e,#00102e",
    chennai:"135deg,#001a1a,#00141e",hyderabad:"135deg,#1a0e00,#2e1800",
    bengaluru:"135deg,#0a1a00,#141e00",kolkata:"135deg,#1a001a,#200020",
    pune:"135deg,#1a0800,#2e1000",prayagraj:"135deg,#1a0e00,#2e1c00",
    tirupati:"135deg,#1a0800,#2a1000",haridwar:"135deg,#001a0d,#001a0a",
    rishikesh:"135deg,#001a0d,#002e14",ayodhya:"135deg,#1a0800,#2e1200",
    mathura:"135deg,#1a0800,#2e1200",nashik:"135deg,#1a0800,#2a1200",
    dwarka:"135deg,#001a1a,#00102e",amritsar:"135deg,#1a1200,#2e2000",
    vrindavan:"135deg,#1a001a,#200020",ujjain:"135deg,#1a0800,#2e1000",
    mysuru:"135deg,#1a0e00,#2e1800",
  };
  const bg = cityBgColors[selectedLocation] || "135deg,#1a0a2e,#0d1a3a";

  if(!guide) return(
    <Card S={S} style={{marginBottom:14,padding:24,textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:10}}>🏙️</div>
      <h3 style={{color:S.text,fontSize:15,fontWeight:800,margin:"0 0 6px"}}>Explore {locationMeta.label}</h3>
      <p style={{color:S.muted,fontSize:13,margin:0}}>City guide coming soon.</p>
    </Card>
  );

  return(
    <>
    {showCityDetail&&<CityDetailModal S={S} cityKey={selectedLocation} locationLabel={locationMeta.label} onClose={()=>setShowCityDetail(false)}/>}
    <Card S={S} style={{marginBottom:14,overflow:"hidden",padding:0}}>
      <div style={{display:"grid",gridTemplateColumns:bp==="mobile"?"1fr":"minmax(0,1.1fr) minmax(0,1fr)"}}>

        {/* City image — onExplore button rendered inside at z-index:10 */}
        <CityImagePanel
          cityKey={selectedLocation}
          bg={bg}
          icon={CITY_BG_ICONS[selectedLocation]||"🏛️"}
          landmark={guide.landmark||""}
          minH={bp==="mobile"?200:240}
          radius={bp==="mobile"?"14px 14px 0 0":"14px 0 0 14px"}
          onExplore={()=>setShowCityDetail(true)}
        />

        {/* Info panel */}
        <div style={{padding:"16px 14px",display:"flex",flexDirection:"column",gap:10}}>
          <div>
            <h3 style={{color:S.text,fontSize:15,fontWeight:900,margin:"0 0 4px"}}>Explore {locationMeta.label}</h3>
            <p style={{color:S.muted,fontSize:12,lineHeight:1.6,margin:0}}>{guide.summary}</p>
          </div>
          <div style={{display:"grid",gap:8}}>
            {guide.places.map(place=>(
              <div key={place.name} style={{background:S.surface,border:"1px solid "+S.border,borderRadius:12,padding:"10px 12px"}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"flex-start"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{color:S.text,fontSize:12,fontWeight:800,margin:"0 0 2px"}}>{place.name}</p>
                    <p style={{color:S.muted,fontSize:11,lineHeight:1.5,margin:0}}>{place.note}</p>
                  </div>
                  <div style={{display:"flex",gap:5,flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}>
                    <a href={place.map} target="_blank" rel="noreferrer" style={{padding:"6px 10px",borderRadius:9,background:S.saffron,color:"#fff",fontSize:11,fontWeight:800,textDecoration:"none",whiteSpace:"nowrap"}}>Map ↗</a>
                    <a href={"https://www.google.com/search?tbm=isch&q="+encodeURIComponent(place.name+" "+locationMeta.label)} target="_blank" rel="noreferrer" style={{padding:"6px 10px",borderRadius:9,border:"1px solid "+S.border,background:"transparent",color:S.text,fontSize:11,fontWeight:800,textDecoration:"none",whiteSpace:"nowrap"}}>Photos ↗</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
    </>
  );
}
/* ══════════════════════════════════════════════════════
   PREMIUM FEATURES — DATA & COMPONENTS
══════════════════════════════════════════════════════ */
const PANDITS=[
  /* ── Uttar Pradesh ── */
  {id:1,name:"Pt. Ramesh Sharma",emoji:"🕉️",city:"Varanasi, UP",phone:"+91 98392 11045",email:"ramesh.sharma.kashi@gmail.com",tags:["Vivah Muhurat","Griha Pravesh","Rudrabhishek"],langs:["Hindi","Sanskrit","English"],rating:4.9,sessions:1240,price:500,exp:18,available:true,bio:"18 years of traditional Kashi shastra practice. Expert in all 16 Vedic samskaras, Muhurat and Rudrabhishek."},
  {id:6,name:"Pt. Deepak Trivedi",emoji:"🌙",city:"Ayodhya, UP",phone:"+91 97734 22167",email:"deepak.trivedi.ayodhya@gmail.com",tags:["Ram Katha","Sundarkand Path","Hanuman Puja"],langs:["Hindi","Sanskrit","Awadhi"],rating:4.9,sessions:3200,price:600,exp:30,available:true,bio:"30 years in Ayodhya traditions. Expert in Ram Katha, Vaishnav rituals and Navratri anusthan."},
  {id:7,name:"Pt. Anand Mishra",emoji:"🔔",city:"Vrindavan, UP",phone:"+91 96503 33278",email:"anand.mishra.vrindavan@gmail.com",tags:["Krishna Janmotsav","Tulsi Vivah","Ekadashi Vrat"],langs:["Hindi","Braj Bhasha","Sanskrit"],rating:4.8,sessions:980,price:550,exp:16,available:true,bio:"Expert in Vaishnav bhakti traditions, Radha-Krishna puja and Vrindavan-style festival ceremonies."},
  {id:9,name:"Pt. Rajendra Pathak",emoji:"🪷",city:"Mathura, UP",phone:"+91 95614 44389",email:"rajendra.pathak.mathura@gmail.com",tags:["Janmashtami Puja","Govardhan Puja","Yagya"],langs:["Hindi","Braj Bhasha","Sanskrit"],rating:4.8,sessions:870,price:500,exp:19,available:true,bio:"Mathura-born priest specializing in Krishnaite rituals, Govardhan Puja and large-scale yagyas."},
  {id:10,name:"Pt. Vivek Dubey",emoji:"🌊",city:"Prayagraj, UP",phone:"+91 94725 55490",email:"vivek.dubey.prayagraj@gmail.com",tags:["Kumbh Rituals","Pitru Tarpan","Ganga Snan"],langs:["Hindi","Sanskrit"],rating:4.7,sessions:1100,price:450,exp:20,available:true,bio:"Specializes in Triveni Sangam rituals, Kumbh Mela ceremonies and ancestral tarpan."},
  /* ── Uttarakhand ── */
  {id:4,name:"Pt. Mahesh Pandey",emoji:"🔱",city:"Haridwar, UK",phone:"+91 93836 66501",email:"mahesh.pandey.haridwar@gmail.com",tags:["Pitru Tarpan","Asthi Visarjan","Shraddha"],langs:["Hindi","Sanskrit","Bengali"],rating:4.7,sessions:670,price:400,exp:15,available:false,bio:"Expert in ancestral rites, Pitru Paksha ceremonies and Ganga-based rituals at Haridwar."},
  {id:11,name:"Pt. Narayan Semwal",emoji:"🏔️",city:"Rishikesh, UK",phone:"+91 92947 77612",email:"narayan.semwal.rishikesh@gmail.com",tags:["Yoga Puja","Ganga Aarti","Rudrabhishek"],langs:["Hindi","Sanskrit","English"],rating:4.9,sessions:2300,price:600,exp:24,available:true,bio:"Expert in Ganga aarti, Shiva rituals and yoga-integrated puja. Certified by Parmarth Niketan."},
  {id:12,name:"Pt. Bharat Uniyal",emoji:"⛰️",city:"Kedarnath, UK",phone:"+91 91058 88723",email:"bharat.uniyal.kedarnath@gmail.com",tags:["Kedarnath Puja","Badrinath Rituals","Char Dham"],langs:["Hindi","Garhwali","Sanskrit"],rating:4.9,sessions:1560,price:700,exp:28,available:false,bio:"Hereditary pujari family of Kedarnath Dham. Expert in Char Dham rituals and pilgrimage guidance."},
  /* ── Madhya Pradesh ── */
  {id:2,name:"Pt. Suresh Joshi",emoji:"☀️",city:"Ujjain, MP",phone:"+91 90169 99834",email:"suresh.joshi.ujjain@gmail.com",tags:["Kundali Reading","Navgraha Puja","Jyotish"],langs:["Hindi","Gujarati","Marathi"],rating:4.8,sessions:890,price:700,exp:22,available:true,bio:"Senior Jyotish from Ujjain. Expert in Navgraha shanti, Mahakal puja vidhi and detailed kundali consultation."},
  {id:13,name:"Pt. Dinesh Shukla",emoji:"🌟",city:"Bhopal, MP",phone:"+91 89270 10945",email:"dinesh.shukla.bhopal@gmail.com",tags:["Griha Pravesh","Vastu Puja","Navgraha"],langs:["Hindi","Sanskrit"],rating:4.7,sessions:580,price:400,exp:13,available:true,bio:"Expert in Vastu shastra-based puja, Griha Pravesh ceremonies and Navgraha shanti rituals."},
  /* ── Rajasthan ── */
  {id:14,name:"Pt. Gopal Sharma",emoji:"🎠",city:"Jaipur, RJ",phone:"+91 88381 21056",email:"gopal.sharma.jaipur@gmail.com",tags:["Vivah Puja","Mundan","Upanayana"],langs:["Hindi","Rajasthani","Sanskrit"],rating:4.8,sessions:1020,price:500,exp:17,available:true,bio:"Expert in Rajasthani Vedic traditions, vivah (wedding) ceremonies and all 16 samskaras."},
  {id:15,name:"Pt. Harish Vyas",emoji:"🏜️",city:"Pushkar, RJ",phone:"+91 87492 32167",email:"harish.vyas.pushkar@gmail.com",tags:["Pushkar Puja","Brahma Puja","Ancestral Rites"],langs:["Hindi","English","Sanskrit"],rating:4.9,sessions:1890,price:650,exp:21,available:true,bio:"Pushkar-based priest. Specializes in Brahma temple puja, sacred lake rituals and ancestral ceremonies."},
  /* ── Gujarat ── */
  {id:16,name:"Pt. Hemang Dave",emoji:"🐚",city:"Dwarka, GJ",phone:"+91 86503 43278",email:"hemang.dave.dwarka@gmail.com",tags:["Dwarkadhish Puja","Janmashtami","Kundali"],langs:["Gujarati","Hindi","Sanskrit"],rating:4.8,sessions:1340,price:550,exp:19,available:true,bio:"Expert in Dwarkadhish temple traditions, Vaishnav puja and Janmashtami celebrations."},
  {id:17,name:"Pt. Dilip Shastri",emoji:"🌿",city:"Somnath, GJ",phone:"+91 85614 54389",email:"dilip.shastri.somnath@gmail.com",tags:["Somnath Puja","Shiva Abhishek","Jyotirlinga"],langs:["Gujarati","Hindi","Sanskrit"],rating:4.9,sessions:2010,price:700,exp:26,available:true,bio:"Somnath temple-trained priest. Expert in Jyotirlinga puja, Shiva Abhishek and auspicious remedies."},
  /* ── Maharashtra ── */
  {id:8,name:"Pt. Ganesh Bhatt",emoji:"🐘",city:"Pune, MH",phone:"+91 84725 65490",email:"ganesh.bhatt.pune@gmail.com",tags:["Ganesh Puja","Satyanarayan Katha","Griha Shanti"],langs:["Marathi","Hindi","Sanskrit"],rating:4.7,sessions:760,price:450,exp:14,available:true,bio:"Expert in Maharashtrian Vedic traditions, Ganesh puja and all domestic ritual ceremonies."},
  {id:18,name:"Pt. Pramod Kulkarni",emoji:"🔯",city:"Nashik, MH",phone:"+91 83836 76501",email:"pramod.kulkarni.nashik@gmail.com",tags:["Kumbh Rituals","Ramkund Puja","Trimbakeshwar"],langs:["Marathi","Hindi","Sanskrit"],rating:4.8,sessions:940,price:500,exp:16,available:true,bio:"Nashik-based priest. Expert in Trimbakeshwar Shiva puja, Kumbh rituals and Godavari river ceremonies."},
  {id:19,name:"Pt. Sadashiv Deshpande",emoji:"🟠",city:"Shirdi, MH",phone:"+91 82947 87612",email:"sadashiv.deshpande.shirdi@gmail.com",tags:["Sai Baba Puja","Abhishek","Maha Aarti"],langs:["Marathi","Hindi","English"],rating:4.9,sessions:2780,price:600,exp:22,available:true,bio:"Shirdi sai tradition expert. Specializes in Sai Baba puja, Maha Aarti participation and devotional ceremonies."},
  /* ── Tamil Nadu ── */
  {id:5,name:"Pt. Venkata Rao",emoji:"🌺",city:"Chennai, TN",phone:"+91 81058 98723",email:"venkata.rao.chennai@gmail.com",tags:["Navagraha Homam","Ganapati Puja","Thread Ceremony"],langs:["Tamil","Telugu","Sanskrit"],rating:4.8,sessions:1450,price:650,exp:20,available:true,bio:"Senior Agama priest specializing in South Indian homams, brahmin samskara rituals and temple-style puja."},
  {id:20,name:"Pt. Shankar Iyer",emoji:"🛕",city:"Madurai, TN",phone:"+91 80169 09834",email:"shankar.iyer.madurai@gmail.com",tags:["Meenakshi Puja","Ashtabhuja Puja","Homam"],langs:["Tamil","Sanskrit","English"],rating:4.9,sessions:1670,price:700,exp:23,available:true,bio:"Madurai Meenakshi temple tradition. Expert in Shakti puja, Ashtabhuja homam and Tamil Vedic ceremonies."},
  {id:21,name:"Pt. Ravi Namboothiri",emoji:"🏛️",city:"Kanchipuram, TN",phone:"+91 79280 10945",email:"ravi.namboothiri.kanchi@gmail.com",tags:["Kamakshi Puja","Vishnu Sahasranama","Ekadashi"],langs:["Tamil","Sanskrit","Malayalam"],rating:4.8,sessions:1120,price:600,exp:18,available:false,bio:"Kanchipuram-trained in Shaiva and Vaishnava traditions. Expert in thousand-name puja and Ekadashi vrat rituals."},
  /* ── Andhra Pradesh & Telangana ── */
  {id:3,name:"Pt. Krishna Iyer",emoji:"🪔",city:"Tirupati, AP",phone:"+91 78391 21056",email:"krishna.iyer.tirupati@gmail.com",tags:["Satyanarayana Puja","Homam","Ashtottara"],langs:["Telugu","Tamil","Sanskrit","English"],rating:4.9,sessions:2100,price:800,exp:25,available:true,bio:"25 years of Agama Shastra experience. Expert in Tirupati-style puja, Vedic homam and South Indian rituals."},
  {id:22,name:"Pt. Srinivas Achary",emoji:"🌸",city:"Hyderabad, TG",phone:"+91 77402 32167",email:"srinivas.achary.hyderabad@gmail.com",tags:["Lakshmi Puja","Satyanarayana Katha","Aksharabhyasam"],langs:["Telugu","Hindi","Sanskrit"],rating:4.7,sessions:830,price:500,exp:15,available:true,bio:"Hyderabad-based Vaishnav priest. Expert in Telugu-style Lakshmi puja, Aksharabhyasam and wedding rituals."},
  /* ── Karnataka ── */
  {id:23,name:"Pt. Subrahmanya Bhat",emoji:"🌴",city:"Udupi, KA",phone:"+91 76513 43278",email:"subrahmanya.bhat.udupi@gmail.com",tags:["Krishna Puja","Ashtami Rohini","Udupi Style"],langs:["Kannada","Sanskrit","Tulu"],rating:4.9,sessions:1780,price:600,exp:21,available:true,bio:"Udupi Krishna temple tradition. Expert in Madhva sampradaya puja, Ashtami Rohini and Dvaita-style rituals."},
  {id:24,name:"Pt. Manjunath Hegde",emoji:"🏰",city:"Mysuru, KA",phone:"+91 75624 54389",email:"manjunath.hegde.mysuru@gmail.com",tags:["Chamundeshwari Puja","Dasara Puja","Shakti"],langs:["Kannada","Hindi","Sanskrit"],rating:4.8,sessions:1010,price:500,exp:17,available:true,bio:"Mysore-based Shakta priest. Expert in Chamundeshwari and Durga puja in the Mysore royal tradition."},
  /* ── Kerala ── */
  {id:25,name:"Pt. Govindan Namboothiri",emoji:"🌾",city:"Guruvayur, KL",phone:"+91 74735 65490",email:"govindan.namboothiri.guruvayur@gmail.com",tags:["Guruvayur Puja","Ashthottara","Archana"],langs:["Malayalam","Sanskrit"],rating:4.9,sessions:2200,price:750,exp:27,available:true,bio:"Guruvayur-trained Namboothiri priest. Expert in Kerala-style Krishna puja, Archana and Ashtottara."},
  /* ── West Bengal & Odisha ── */
  {id:26,name:"Pt. Amarnath Mukhopadhyay",emoji:"🌼",city:"Kolkata, WB",phone:"+91 73846 76501",email:"amarnath.mukherjee.kolkata@gmail.com",tags:["Durga Puja","Kali Puja","Lakshmi Puja"],langs:["Bengali","Hindi","Sanskrit"],rating:4.8,sessions:1560,price:550,exp:20,available:true,bio:"Expert in Bengali Shakta traditions, Durga and Kali puja ceremonies and Navratri anusthan."},
  {id:27,name:"Pt. Biswajit Mohapatra",emoji:"🎠",city:"Puri, OD",phone:"+91 72957 87612",email:"biswajit.mohapatra.puri@gmail.com",tags:["Jagannath Puja","Rath Yatra","Mahaprasad"],langs:["Odia","Hindi","Sanskrit"],rating:4.9,sessions:1890,price:650,exp:24,available:true,bio:"Puri Jagannath temple tradition. Expert in Odia Vaishnav puja, Rath Yatra rituals and Mahaprasad distribution."},
  /* ── Punjab & Haryana ── */
  {id:28,name:"Pt. Gurpreet Singh Nanda",emoji:"🙏",city:"Amritsar, PB",phone:"+91 71068 98723",email:"gurpreet.nanda.amritsar@gmail.com",tags:["Sikh-Hindu Bridge Puja","Vivah","Griha Pravesh"],langs:["Punjabi","Hindi","Sanskrit"],rating:4.7,sessions:690,price:450,exp:13,available:true,bio:"Expert in Punjabi Hindu traditions, bridging Vedic and Sikh customs for multicultural families."},
  /* ── Bihar & Jharkhand ── */
  {id:29,name:"Pt. Shiv Narayan Jha",emoji:"🌊",city:"Patna, BR",phone:"+91 70179 09834",email:"shivnarayan.jha.patna@gmail.com",tags:["Chhath Puja","Saraswati Puja","Griha Shanti"],langs:["Hindi","Maithili","Sanskrit"],rating:4.8,sessions:970,price:400,exp:16,available:true,bio:"Expert in Bihari traditions, Chhath Puja (Sun worship), Saraswati puja and auspicious ceremonies."},
  /* ── Himachal Pradesh ── */
  {id:30,name:"Pt. Mohan Thakur",emoji:"🏔️",city:"Shimla, HP",phone:"+91 69280 10945",email:"mohan.thakur.shimla@gmail.com",tags:["Himalayan Puja","Kuldevi Puja","Devi Sthanam"],langs:["Hindi","Pahari","Sanskrit"],rating:4.7,sessions:440,price:350,exp:12,available:true,bio:"Specializes in Himalayan Devi traditions, Kuldevi puja and local pahari temple rituals."},
  /* ── Assam & North-East ── */
  {id:31,name:"Pt. Prodyut Sarma",emoji:"🌿",city:"Guwahati, AS",phone:"+91 68391 21056",email:"prodyut.sarma.guwahati@gmail.com",tags:["Kamakhya Puja","Shakti Rituals","Bihu Puja"],langs:["Assamese","Bengali","Hindi","Sanskrit"],rating:4.8,sessions:810,price:500,exp:17,available:true,bio:"Kamakhya temple tradition. Expert in Tantric Shakti puja, Kamakhya rituals and Assamese Hindu ceremonies."},
];
const NAKSHATRA_LIST=[
  {name:"Ashwini",lord:"Ketu",yrs:7},{name:"Bharani",lord:"Venus",yrs:20},{name:"Krittika",lord:"Sun",yrs:6},
  {name:"Rohini",lord:"Moon",yrs:10},{name:"Mrigashira",lord:"Mars",yrs:7},{name:"Ardra",lord:"Rahu",yrs:18},
  {name:"Punarvasu",lord:"Jupiter",yrs:16},{name:"Pushya",lord:"Saturn",yrs:19},{name:"Ashlesha",lord:"Mercury",yrs:17},
  {name:"Magha",lord:"Ketu",yrs:7},{name:"Purva Phalguni",lord:"Venus",yrs:20},{name:"Uttara Phalguni",lord:"Sun",yrs:6},
  {name:"Hasta",lord:"Moon",yrs:10},{name:"Chitra",lord:"Mars",yrs:7},{name:"Swati",lord:"Rahu",yrs:18},
  {name:"Vishakha",lord:"Jupiter",yrs:16},{name:"Anuradha",lord:"Saturn",yrs:19},{name:"Jyeshtha",lord:"Mercury",yrs:17},
  {name:"Mula",lord:"Ketu",yrs:7},{name:"Purva Ashadha",lord:"Venus",yrs:20},{name:"Uttara Ashadha",lord:"Sun",yrs:6},
  {name:"Shravana",lord:"Moon",yrs:10},{name:"Dhanishtha",lord:"Mars",yrs:7},{name:"Shatabhisha",lord:"Rahu",yrs:18},
  {name:"Purva Bhadrapada",lord:"Jupiter",yrs:16},{name:"Uttara Bhadrapada",lord:"Saturn",yrs:19},{name:"Revati",lord:"Mercury",yrs:17},
];
const DASHA_SEQ=["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
const DASHA_YRS={Ketu:7,Venus:20,Sun:6,Moon:10,Mars:7,Rahu:18,Jupiter:16,Saturn:19,Mercury:17};
const DASHA_EMJ={Ketu:"🐉",Venus:"💎",Sun:"☀️",Moon:"🌙",Mars:"🔴",Rahu:"🌑",Jupiter:"⚡",Saturn:"💫",Mercury:"🌿"};
function calcMoonNakshatra2(dateStr){
  const ref=new Date("2000-01-01"),birth=new Date(dateStr);
  const days=(birth-ref)/86400000;
  let deg=((218+days*13.1764)%360+360)%360;
  const nIdx=Math.min(Math.floor(deg/13.3333),26);
  return{nIdx,frac:(deg%13.3333)/13.3333,deg};
}
function calcVimshottariDasha(dateStr,nIdx,frac){
  const lord=NAKSHATRA_LIST[nIdx].lord;
  const startIdx=DASHA_SEQ.indexOf(lord);
  const yrsConsumed=frac*DASHA_YRS[lord];
  const birth=new Date(dateStr),today=new Date();
  const ageYrs=(today-birth)/(365.25*86400000);
  let cursor=-yrsConsumed,idx=startIdx;
  const periods=[];
  for(let i=0;i<9;i++){const lrd=DASHA_SEQ[idx%9];const dur=DASHA_YRS[lrd];periods.push({lord:lrd,start:cursor,end:cursor+dur,dur});cursor+=dur;idx++;}
  const current=periods.find(p=>p.start<=ageYrs&&p.end>ageYrs)||periods[8];
  return{current,remaining:Math.max(0,current.end-ageYrs).toFixed(1),periods,ageYrs};
}
function getSunSign(m,d){
  if((m===3&&d>=21)||(m===4&&d<=19))return"Aries ♈";if((m===4&&d>=20)||(m===5&&d<=20))return"Taurus ♉";
  if((m===5&&d>=21)||(m===6&&d<=20))return"Gemini ♊";if((m===6&&d>=21)||(m===7&&d<=22))return"Cancer ♋";
  if((m===7&&d>=23)||(m===8&&d<=22))return"Leo ♌";if((m===8&&d>=23)||(m===9&&d<=22))return"Virgo ♍";
  if((m===9&&d>=23)||(m===10&&d<=22))return"Libra ♎";if((m===10&&d>=23)||(m===11&&d<=21))return"Scorpio ♏";
  if((m===11&&d>=22)||(m===12&&d<=21))return"Sagittarius ♐";if((m===12&&d>=22)||(m===1&&d<=19))return"Capricorn ♑";
  if((m===1&&d>=20)||(m===2&&d<=18))return"Aquarius ♒";return"Pisces ♓";
}
const PUJA_GUIDES={
  ganesh:{name:"Ganesh Puja",icon:"🐘",duration:"45-60 min",desc:"Invoke Lord Ganesh for removing obstacles, wisdom and new beginnings.",
    ingredients:["Ganesh idol or image","Red/saffron cloth for altar","Modak (21 pieces)","Red flowers (hibiscus preferred)","Durva grass (21 blades)","Sindoor","Panchamrit (milk, curd, ghee, honey, sugar)","Incense sticks","Camphor","Red sandalwood paste","Coconut"],
    steps:[{n:"Sankalp & Purification",d:"Sprinkle water (achaman) and take sankalp — state your intention clearly. Ring the bell three times to invite divine presence.",t:5},{n:"Invoke Lord Ganesh",d:"Place the idol on the altar. Apply sindoor to forehead. Chant 'Om Gam Ganapataye Namaha' 108 times with full devotion.",t:10},{n:"Panchamrit Abhishek",d:"Bathe the idol with panchamrit — milk, curd, ghee, honey, sugar — one by one while chanting Om Ganapataye Namah.",t:10},{n:"Offer Flowers & Durva",d:"Offer 21 flowers and 21 durva grass blades to Ganesh. Each offering with 'Om Ganapataye Namah'.",t:8},{n:"Dhoop, Deepa & Naivedya",d:"Light incense and oil lamp. Offer modak and sweets as bhog. Pray sincerely for blessings.",t:7},{n:"Aarti",d:"Perform Ganesh aarti with camphor. Sing 'Jai Ganesh Jai Ganesh Deva' three times.",t:5},{n:"Pradakshina & Visarjan",d:"Circumambulate the idol 3 times. Seek blessings for your sankalp. Close with Om Shanti Shanti Shanti.",t:5}],
    mantras:["Om Gam Ganapataye Namaha","Vakratunda Mahakaya, Surya Koti Sama Prabha","Om Shri Ganeshaya Namah"]},
  lakshmi:{name:"Lakshmi Puja",icon:"🌸",duration:"60-75 min",desc:"Invoke Goddess Lakshmi for prosperity, abundance and auspiciousness in your home.",
    ingredients:["Lakshmi idol or image","Yellow/gold cloth for altar","Pink lotus or pink flowers","Sweets and kheer","Cow milk","Kumkum and turmeric","Gold/silver coin","11 betel leaves","Uncooked rice","Incense sticks","Ghee lamp"],
    steps:[{n:"Altar Setup & Sankalp",d:"Lay yellow cloth. Place Lakshmi idol with Ganesh. Draw rangoli at entrance. Take sankalp with family.",t:8},{n:"Kalash Sthapana",d:"Fill copper pot with water, mango leaves, and coconut. This is the sacred Kalash holding divine energy.",t:5},{n:"Invoke Mother Lakshmi",d:"Chant 'Om Shrim Mahalakshmiyei Namaha' 108 times. Light incense and lamp.",t:12},{n:"Panchamrit & Flower Offering",d:"Offer panchamrit abhishek. Then offer lotus flowers, rose petals and pink flowers.",t:10},{n:"Kheer & Sweet Bhog",d:"Offer kheer, sweets, and fruits as naivedya. Place gold/silver coin near the feet of the goddess.",t:8},{n:"Lakshmi Aarti",d:"Perform aarti. Sing 'Om Jai Lakshmi Mata' with full devotion. Clap and ring the bell.",t:7},{n:"Prasad & Closing Prayer",d:"Distribute prasad. Place a coin in locker or wallet. Pray for family prosperity and well-being.",t:5}],
    mantras:["Om Shrim Mahalakshmiyei Namaha","Om Hreem Shreem Kleem Namaha","Om Jai Lakshmi Mata"]},
  shiv:{name:"Shiva Abhishek",icon:"🔱",duration:"60 min",desc:"Rudrabhishek of Lord Shiva for blessings, protection and removal of all obstacles.",
    ingredients:["Shivling (or Shiva image)","Raw milk","Pure water (Gangajal preferred)","Bel patra (3 or 5 leaves)","White flowers","Panchamrit","Vibhuti (sacred ash)","Blue/white cloth","Dhoop/incense","Rudraksha mala"],
    steps:[{n:"Purification & Sankalp",d:"Bathe and wear clean clothes. Sprinkle Gangajal on yourself. Take sankalp before the Shivling.",t:5},{n:"Jal Abhishek",d:"Pour fresh water or Gangajal over the Shivling slowly, chanting 'Om Namah Shivaya'. This is the primary offering.",t:10},{n:"Panchamrit Abhishek",d:"Pour milk, curd, ghee, honey, sugar each separately while chanting Om Namah Shivaya.",t:12},{n:"Bel Patra & Flowers",d:"Offer bel patra (in threes, green side up). Offer white flowers. Each with 'Om Namah Shivaya'.",t:8},{n:"Vibhuti & Chandan",d:"Apply vibhuti (sacred ash) to the Shivling. Apply sandalwood paste. Light a ghee lamp.",t:8},{n:"Dhoop & Deepa",d:"Light incense and ghee lamp. Offer prasad (sweets, fruits). Ring the bell continuously.",t:7},{n:"Shiv Aarti & Pradakshina",d:"Perform Shiv aarti. Circumambulate Shivling 3 or 7 times (half-circle, not full). Seek blessings.",t:10}],
    mantras:["Om Namah Shivaya","Om Tryambakam Yajamahe, Sugandhim Pushtivardhanam","Mahamrityunjaya Mantra"]},
  durga:{name:"Durga / Navratri Puja",icon:"🌺",duration:"75 min",desc:"Worship Goddess Durga during Navratri for strength, protection and victory over negativity.",
    ingredients:["Red cloth","Durga idol or Kalasha","Red flowers (rose, hibiscus)","Marigold garland","Sindoor","Kumkum","Coconut","Fruits and sweets","Panchamrit","Ghee lamp","Incense"],
    steps:[{n:"Kalasha Sthapana",d:"Establish the sacred Kalasha representing Goddess. Plant barley seeds in pot (traditional Navratri practice).",t:10},{n:"Invoke Goddess Durga",d:"Chant 'Aim Hreem Kleem Chamundayei Vichhe Namaha' and invite the Goddess into the kalasha.",t:10},{n:"Offer Red Flowers & Sindoor",d:"Offer red flowers, sindoor and kumkum to the Goddess. Decorate with marigold garlands.",t:10},{n:"Panchamrit & Abhishek",d:"Perform panchamrit abhishek on the Goddess image or Kalasha. Offer coconut and seasonal fruits.",t:10},{n:"Durga Saptashati Path",d:"Read or listen to Durga Saptashati (700 verses). Even 1 chapter recited with devotion is highly auspicious.",t:20},{n:"Aarti & Kanya Puja",d:"Perform Durga Aarti. On Ashtami/Navami: invite 9 young girls, wash their feet, feed them and offer gifts.",t:10},{n:"Havan & Visarjan",d:"Perform a small havan if possible. Close the ritual with pranams and seek divine protection for your family.",t:5}],
    mantras:["Aim Hreem Kleem Chamundayei Vichhe","Om Dum Durgayei Namaha","Ya Devi Sarva Bhuteshu..."]},
  satyanarayan:{name:"Satyanarayan Katha",icon:"🙏",duration:"90-120 min",desc:"The sacred Katha of Lord Vishnu as Satyanarayan — performed for wish-fulfillment and thanksgiving.",
    ingredients:["Banana leaves (5)","Yellow cloth","Satyanarayan photo or Vishnu idol","Panchamrit","Yellow flowers","Tulsi leaves","Banana, coconut","Panchamewa (5 dry fruits)","Wheat flour for prasad","Ghee","Jaggery","Sugar","Incense and lamp"],
    steps:[{n:"Sankalp & Setup",d:"Set up altar on banana leaves. Invoke Ganesh first. Take sankalp with your spouse and family.",t:10},{n:"Kalash Puja",d:"Establish sacred Kalash. Offer flowers and tulsi. Invoke all devatas into the Kalash.",t:10},{n:"Invite Lord Satyanarayan",d:"Chant 'Om Namo Bhagavate Vasudevaya'. Offer yellow flowers, tulsi, panchamrit.",t:15},{n:"Katha Recitation",d:"Read or listen to all 5 chapters of Satyanarayan Katha. Stay attentive and devotional throughout.",t:45},{n:"Prepare Prasad",d:"While katha proceeds, prepare the satyanarayan prasad (wheat, milk, banana, sugar, ghee mixture).",t:10},{n:"Aarti & Distribution",d:"Perform Satyanarayan aarti. Distribute panchamrit as tirth. Share prasad to all present.",t:10},{n:"Closing Prayer",d:"Pray for fulfillment of your vow or wish. Thank the Lord. Seek blessings for the entire family.",t:10}],
    mantras:["Om Namo Bhagavate Vasudevaya","Om Shri Satyanarayanaya Namah","Vishnu Sahasranama"]},
};
const PUJA_GUIDE_LIST=[
  {key:"ganesh",name:"Ganesh Puja",icon:"🐘",occasion:"Before any new beginning, Ganesh Chaturthi, Wednesday",color:"#FF6B00"},
  {key:"lakshmi",name:"Lakshmi Puja",icon:"🌸",occasion:"Diwali, Friday, new business launch",color:"#FFB800"},
  {key:"shiv",name:"Shiva Abhishek",icon:"🔱",occasion:"Mahashivratri, Monday, Shravan month",color:"#6B4FFF"},
  {key:"durga",name:"Durga / Navratri Puja",icon:"🌺",occasion:"Navratri (twice yearly), Ashtami, Tuesday",color:"#E8003D"},
  {key:"satyanarayan",name:"Satyanarayan Katha",icon:"🙏",occasion:"Full Moon, new home, fulfillment of wishes",color:"#00A86B"},
];

/* — Pandit Connect — */
function PanditConnectPanel({S,bp,isPremium,onPremium}){
  const[filter,setFilter]=useState("All");
  const[regionFilter,setRegionFilter]=useState("All");
  const[search,setSearch]=useState("");
  const[selected,setSelected]=useState(null);
  const[booked,setBooked]=useState(null);
  const specs=["All","Muhurat","Jyotish","Homam","Katha","Pitru","Shakti","Vaishnav","Shraddha"];
  const regions=["All","North India","South India","West India","East India"];
  const regionMap={"North India":["UP","UK","RJ","PB","HP","BR","HR"],"South India":["AP","TG","TN","KA","KL"],"West India":["MH","GJ"],"East India":["WB","OD","AS"]};
  const getRegion=(city)=>{const st=city.split(", ")[1];for(const[r,sts]of Object.entries(regionMap)){if(sts.includes(st))return r;}return"Other";};
  const filtered=PANDITS.filter(p=>{
    const matchSpec=filter==="All"||p.tags.some(t=>t.toLowerCase().includes(filter.toLowerCase()));
    const matchRegion=regionFilter==="All"||getRegion(p.city)===regionFilter;
    const matchSearch=!search||p.name.toLowerCase().includes(search.toLowerCase())||p.city.toLowerCase().includes(search.toLowerCase())||p.tags.some(t=>t.toLowerCase().includes(search.toLowerCase()));
    return matchSpec&&matchRegion&&matchSearch;
  });
  if(booked){return(
    <div style={{textAlign:"center",padding:"30px 20px"}}>
      <div style={{fontSize:64,marginBottom:12}}>✅</div>
      <h3 style={{color:"#22C55E",fontSize:18,fontWeight:900,margin:"0 0 8px"}}>Session Requested!</h3>
      <p style={{color:S.muted,fontSize:13,marginBottom:16,lineHeight:1.6}}>Your request has been sent to <strong style={{color:S.text}}>{booked.name}</strong>. They will contact you on WhatsApp within 2 hours.</p>
      <div style={{background:S.card,borderRadius:14,padding:"14px 18px",marginBottom:18,border:"1px solid "+S.border,textAlign:"left"}}>
        {["Pandit will call/WhatsApp to confirm","Agree on date, time & puja requirements","Pay securely after confirmation","Pandit performs puja or consultation"].map((s,i)=>(
          <div key={i} style={{display:"flex",gap:8,margin:"6px 0"}}><span style={{color:S.saffron,fontWeight:900,flexShrink:0}}>{i+1}.</span><span style={{color:S.text,fontSize:12}}>{s}</span></div>
        ))}
      </div>
      <button onClick={()=>setBooked(null)} style={{padding:"10px 24px",borderRadius:12,border:"none",background:"linear-gradient(90deg,"+S.saffron+","+S.gold+")",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>Back to Pandits</button>
    </div>
  );}
  if(selected){return(
    <div>
      <button onClick={()=>setSelected(null)} style={{background:S.card,border:"1px solid "+S.border,color:S.saffron,padding:"7px 14px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:14}}>← Back</button>
      <div style={{background:"linear-gradient(135deg,#1A0438,#0D0124)",borderRadius:18,padding:20,border:"1px solid "+S.sacred+"44",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
          <div style={{width:64,height:64,borderRadius:18,background:"linear-gradient(135deg,"+S.sacred+"40,"+S.saffron+"30)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0}}>{selected.emoji}</div>
          <div style={{flex:1}}>
            <h3 style={{color:"#fff",fontSize:16,fontWeight:900,margin:"0 0 3px"}}>{selected.name}</h3>
            <p style={{color:S.saffron,fontSize:12,fontWeight:700,margin:"0 0 4px"}}>📍 {selected.city} · {selected.exp} yrs exp</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <span style={{color:S.gold,fontSize:13,fontWeight:800}}>⭐ {selected.rating}</span>
              <span style={{color:S.muted,fontSize:11}}>({selected.sessions} sessions)</span>
              {selected.available?<span style={{background:"#22C55E22",color:"#22C55E",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>✅ Available</span>:<span style={{background:"#EF444422",color:"#EF4444",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>⏳ Busy</span>}
            </div>
          </div>
        </div>
        <p style={{color:S.muted,fontSize:13,lineHeight:1.6,margin:"0 0 14px"}}>{selected.bio}</p>
        {/* ── Contact Details ── */}
        <div style={{background:"rgba(255,153,0,0.08)",border:"1px solid "+S.gold+"44",borderRadius:14,padding:"12px 14px",marginBottom:14}}>
          <p style={{color:S.gold,fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.05em",margin:"0 0 10px"}}>📞 Contact Information</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {/* Phone */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>📱</span>
                <div>
                  <p style={{color:S.muted,fontSize:10,fontWeight:700,margin:0,textTransform:"uppercase"}}>Phone</p>
                  <p style={{color:S.text,fontSize:13,fontWeight:700,margin:0}}>{selected.phone}</p>
                </div>
              </div>
              <a href={"tel:"+selected.phone.replace(/\s/g,"")} style={{background:"rgba(34,197,94,0.15)",border:"1px solid #22C55E66",borderRadius:20,padding:"5px 13px",color:"#22C55E",fontSize:11,fontWeight:800,textDecoration:"none",whiteSpace:"nowrap"}}>📞 Call</a>
            </div>
            {/* Email */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>✉️</span>
                <div>
                  <p style={{color:S.muted,fontSize:10,fontWeight:700,margin:0,textTransform:"uppercase"}}>Email</p>
                  <p style={{color:S.text,fontSize:12,fontWeight:700,margin:0}}>{selected.email}</p>
                </div>
              </div>
              <a href={"mailto:"+selected.email} style={{background:"rgba(99,102,241,0.15)",border:"1px solid #6366F166",borderRadius:20,padding:"5px 13px",color:"#A5B4FC",fontSize:11,fontWeight:800,textDecoration:"none",whiteSpace:"nowrap"}}>✉️ Email</a>
            </div>
            {/* WhatsApp */}
            <a href={"https://wa.me/"+selected.phone.replace(/[\s+\-()]/g,"")+"?text="+encodeURIComponent("Namaste "+selected.name+"ji 🙏\n\nI found your profile on Vedanta App. I would like to book a puja/consultation session with you.\n\nPlease let me know your availability.\n\nThank you 🙏")}
              target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"10px",borderRadius:12,background:"linear-gradient(90deg,#25D36622,#128C7E22)",border:"1px solid #25D36666",color:"#25D366",fontSize:13,fontWeight:800,textDecoration:"none",marginTop:4}}>
              <span style={{fontSize:16}}>💬</span> WhatsApp for Booking
            </a>
          </div>
        </div>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
          {selected.tags.map(t=><span key={t} style={{background:S.sacred+"22",color:S.sacred,fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,border:"1px solid "+S.sacred+"44"}}>{t}</span>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
          <div style={{background:S.card,borderRadius:12,padding:"11px 13px",border:"1px solid "+S.border}}>
            <p style={{color:S.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",margin:"0 0 3px"}}>Session Fee</p>
            <p style={{color:S.gold,fontSize:16,fontWeight:900,margin:0}}>₹{selected.price}<span style={{fontSize:11,color:S.muted,fontWeight:400}}>/session</span></p>
          </div>
          <div style={{background:S.card,borderRadius:12,padding:"11px 13px",border:"1px solid "+S.border}}>
            <p style={{color:S.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",margin:"0 0 3px"}}>Languages</p>
            <p style={{color:S.text,fontSize:12,fontWeight:700,margin:0}}>{selected.langs.join(", ")}</p>
          </div>
        </div>
        {isPremium
          ?<button onClick={()=>{if(selected.available)setBooked(selected);else alert("This pandit is currently unavailable. Try again tomorrow.");}} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:selected.available?"linear-gradient(90deg,"+S.saffron+","+S.gold+")":"rgba(255,255,255,0.1)",color:"#fff",fontSize:14,fontWeight:800,cursor:selected.available?"pointer":"not-allowed"}}>{selected.available?"🙏 Book This Pandit":"⏳ Currently Unavailable"}</button>
          :<button onClick={onPremium} style={{width:"100%",padding:"13px",borderRadius:12,border:"1px solid "+S.gold+"66",background:"linear-gradient(90deg,"+S.gold+"22,"+S.saffron+"22)",color:S.gold,fontSize:14,fontWeight:800,cursor:"pointer"}}>⭐ Upgrade to Premium to Book · ₹{selected.price}/session</button>}
      </div>
    </div>
  );}
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#1A0438,#0D0124)",borderRadius:18,padding:"16px 18px",marginBottom:14,border:"1px solid "+S.sacred+"44"}}>
        <h3 style={{color:"#fff",fontSize:15,fontWeight:900,margin:"0 0 4px"}}>🙏 Connect with Verified Pandits</h3>
        <p style={{color:S.muted,fontSize:12,margin:0}}>Book a personal session — puja guidance, muhurat, kundali reading, ritual assistance</p>
      </div>
      {/* Search Bar */}
      <div style={{position:"relative",marginBottom:10}}>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none"}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, city or speciality..." style={{width:"100%",padding:"9px 12px 9px 34px",borderRadius:12,border:"1px solid "+S.border,background:"rgba(255,255,255,0.06)",color:S.text,fontSize:13,boxSizing:"border-box",outline:"none"}}/>
      </div>
      {/* Region Filter */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
        {regions.map(r=><button key={r} onClick={()=>setRegionFilter(r)} style={{padding:"5px 11px",borderRadius:20,border:"1px solid "+(regionFilter===r?S.saffron:S.border),background:regionFilter===r?S.saffron+"22":"transparent",color:regionFilter===r?S.saffron:S.muted,fontSize:11,fontWeight:700,cursor:"pointer"}}>{r==="All"?"🗺️ All Regions":r}</button>)}
      </div>
      {/* Specialty Filter */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {specs.map(s=><button key={s} onClick={()=>setFilter(s)} style={{padding:"5px 11px",borderRadius:20,border:"1px solid "+(filter===s?S.sacred:S.border),background:filter===s?S.sacred+"22":"transparent",color:filter===s?S.sacred:S.muted,fontSize:11,fontWeight:700,cursor:"pointer"}}>{s}</button>)}
      </div>
      {/* Results count */}
      <p style={{color:S.muted,fontSize:11,fontWeight:600,marginBottom:10}}>{filtered.length} pandit{filtered.length!==1?"s":""} found</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.length===0&&(
          <div style={{textAlign:"center",padding:"30px 20px",color:S.muted}}>
            <div style={{fontSize:40,marginBottom:8}}>🙏</div>
            <p style={{fontSize:13}}>No pandits found matching your filters. Try a different region or speciality.</p>
          </div>
        )}
        {filtered.map(p=>(
          <div key={p.id} onClick={()=>setSelected(p)} style={{background:S.card,borderRadius:16,padding:"14px 16px",border:"1px solid "+S.border,cursor:"pointer",transition:"border-color 0.2s"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,"+S.sacred+"30,"+S.saffron+"20)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{p.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
                  <h4 style={{color:"#fff",fontSize:13,fontWeight:800,margin:0}}>{p.name}</h4>
                  <span style={{color:S.gold,fontSize:12,fontWeight:800}}>⭐ {p.rating}</span>
                </div>
                <p style={{color:S.saffron,fontSize:11,fontWeight:700,margin:"0 0 4px"}}>📍 {p.city} · {p.exp}y exp</p>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:5}}>
                  {p.tags.slice(0,3).map(t=><span key={t} style={{background:S.sacred+"18",color:S.sacred,fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:10}}>{t}</span>)}
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{color:S.gold,fontSize:13,fontWeight:800}}>₹{p.price}/session</span>
                  <span style={{background:p.available?"#22C55E22":"#EF444422",color:p.available?"#22C55E":"#EF4444",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{p.available?"✅ Available":"⏳ Busy"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* — Kundali Panel — */
function KundaliPanel({S,bp,isPremium,onPremium}){
  const[form,setForm]=useState({dob:"",tob:"",place:""});
  const[result,setResult]=useState(null);
  const[loading,setLoading]=useState(false);
  const generate=()=>{
    if(!form.dob){alert("Please enter your date of birth");return;}
    if(!isPremium){onPremium();return;}
    setLoading(true);
    setTimeout(()=>{
      const{nIdx,frac,deg}=calcMoonNakshatra2(form.dob);
      const nk=NAKSHATRA_LIST[nIdx];
      const dasha=calcVimshottariDasha(form.dob,nIdx,frac);
      const bd=new Date(form.dob);
      const moonSign=["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"][Math.floor(deg/30)];
      const sunSign=getSunSign(bd.getMonth()+1,bd.getDate());
      setResult({nk,dasha,moonSign,sunSign});setLoading(false);
    },900);
  };
  const houseNums=[12,1,2,3,11,"c","c",4,10,"c","c",5,9,8,7,6];
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#0A0220,#180634)",borderRadius:18,padding:"16px 18px",marginBottom:14,border:"1px solid #6B4FFF44"}}>
        <h3 style={{color:"#fff",fontSize:15,fontWeight:900,margin:"0 0 3px"}}>🔮 Vedic Kundali (Birth Chart)</h3>
        <p style={{color:S.muted,fontSize:12,margin:0}}>Enter your birth details for your North Indian Kundali with Vimshottari Dasha</p>
      </div>
      <div style={{background:S.card,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+S.border}}>
        <div style={{display:"grid",gridTemplateColumns:bp==="mobile"?"1fr":"1fr 1fr",gap:10,marginBottom:12}}>
          <div><label style={{color:S.muted,fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>DATE OF BIRTH *</label>
            <input type="date" value={form.dob} onChange={e=>setForm(p=>({...p,dob:e.target.value}))} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid "+S.border,background:"rgba(255,255,255,0.06)",color:S.text,fontSize:13,boxSizing:"border-box"}}/></div>
          <div><label style={{color:S.muted,fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>TIME OF BIRTH</label>
            <input type="time" value={form.tob} onChange={e=>setForm(p=>({...p,tob:e.target.value}))} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid "+S.border,background:"rgba(255,255,255,0.06)",color:S.text,fontSize:13,boxSizing:"border-box"}}/></div>
        </div>
        <div style={{marginBottom:12}}><label style={{color:S.muted,fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>BIRTHPLACE (CITY)</label>
          <input type="text" placeholder="e.g. Delhi, Mumbai, Varanasi..." value={form.place} onChange={e=>setForm(p=>({...p,place:e.target.value}))} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid "+S.border,background:"rgba(255,255,255,0.06)",color:S.text,fontSize:13,boxSizing:"border-box"}}/></div>
        <button onClick={generate} disabled={loading} style={{width:"100%",padding:"11px",borderRadius:12,border:"none",background:isPremium?"linear-gradient(90deg,#6B4FFF,#9C6FFF)":"linear-gradient(90deg,"+S.gold+"44,"+S.saffron+"44)",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer"}}>
          {loading?"⏳ Calculating Kundali...":isPremium?"🔮 Generate My Kundali":"⭐ Premium Feature — Upgrade to Generate"}</button>
        {!isPremium&&<p style={{color:S.muted,fontSize:11,textAlign:"center",marginTop:6,margin:0}}>Kundali generation requires Premium</p>}
      </div>
      {result&&(
        <>
          <div style={{background:"linear-gradient(135deg,#0A0220,#180634)",borderRadius:18,padding:16,marginBottom:14,border:"1px solid #6B4FFF55"}}>
            <h4 style={{color:"#fff",fontSize:13,fontWeight:800,margin:"0 0 12px",textAlign:"center"}}>🔮 North Indian Kundali Chart</h4>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"#6B4FFF22",borderRadius:12,overflow:"hidden",maxWidth:280,margin:"0 auto 16px",border:"1px solid #6B4FFF33"}}>
              {houseNums.map((h,i)=>{
                if(h==="c"){if(i===5)return<div key={i} style={{gridColumn:"2/4",gridRow:"2/4",background:"#0A0220",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,color:"#6B4FFF",minHeight:100}}>ॐ</div>;return null;}
                return(<div key={i} style={{background:"#0A0220",padding:6,minHeight:65,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",borderRadius:2}}>
                  <span style={{color:"#6B4FFF88",fontSize:10,fontWeight:700,lineHeight:1}}>{h}</span>
                </div>);
              })}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{k:"Moon Nakshatra",v:result.nk.name,c:"#9C6FFF"},{k:"Nakshatra Lord",v:result.nk.lord,c:S.gold},{k:"Moon Rashi",v:result.moonSign,c:S.saffron},{k:"Sun Sign",v:result.sunSign,c:"#FFB800"}].map(x=>(
                <div key={x.k} style={{background:"rgba(107,79,255,0.12)",borderRadius:10,padding:"10px 12px",border:"1px solid #6B4FFF33"}}>
                  <p style={{color:S.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",margin:"0 0 2px"}}>{x.k}</p>
                  <p style={{color:x.c,fontSize:13,fontWeight:900,margin:0}}>{x.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:S.card,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+S.border}}>
            <h4 style={{color:"#fff",fontSize:13,fontWeight:800,margin:"0 0 10px"}}>📅 Vimshottari Dasha Periods</h4>
            <div style={{background:"linear-gradient(135deg,"+S.saffron+"22,"+S.gold+"22)",borderRadius:12,padding:"12px 14px",marginBottom:10,border:"1px solid "+S.saffron+"44"}}>
              <p style={{color:S.muted,fontSize:11,fontWeight:700,margin:"0 0 3px"}}>CURRENT MAHADASHA</p>
              <p style={{color:S.gold,fontSize:18,fontWeight:900,margin:"0 0 2px"}}>{DASHA_EMJ[result.dasha.current.lord]} {result.dasha.current.lord} Dasha</p>
              <p style={{color:S.muted,fontSize:12,margin:0}}>⏳ {result.dasha.remaining} years remaining</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {result.dasha.periods.map((p,i)=>{
                const isCur=p.lord===result.dasha.current.lord;
                return(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",borderRadius:10,background:isCur?S.saffron+"22":"transparent",border:isCur?"1px solid "+S.saffron+"44":"1px solid transparent"}}>
                  <span style={{fontSize:16,flexShrink:0}}>{DASHA_EMJ[p.lord]}</span>
                  <span style={{color:isCur?S.gold:S.text,fontSize:13,fontWeight:isCur?800:600,flex:1}}>{p.lord} Dasha</span>
                  <span style={{color:S.muted,fontSize:11}}>{p.dur} yrs</span>
                  {isCur&&<span style={{background:S.saffron,color:"#fff",fontSize:9,fontWeight:800,padding:"2px 6px",borderRadius:8}}>NOW</span>}
                </div>);
              })}
            </div>
          </div>
          <div style={{background:"rgba(255,192,64,0.08)",borderRadius:12,padding:"12px 14px",border:"1px solid "+S.gold+"33"}}>
            <p style={{color:S.muted,fontSize:11,margin:0,lineHeight:1.6}}>⚠️ Uses simplified astronomical calculation. For a precise chart with exact planetary positions and Lagna, consult a verified Jyotishi via Pandit Connect.</p>
          </div>
        </>
      )}
    </div>
  );
}

/* — Family Sacred Calendar — */
function FamilyCalendarPanel({S,bp,isPremium,onPremium}){
  const[members,setMembers]=useState(()=>{try{return JSON.parse(localStorage.getItem("vedanta_family")||"[]")}catch{return[];}});
  const[form,setForm]=useState({name:"",relation:"",dob:"",note:""});
  const[showAdd,setShowAdd]=useState(false);
  const RELS=["Spouse","Father","Mother","Son","Daughter","Brother","Sister","Grandfather","Grandmother","Uncle","Aunt","Other"];
  const save=(list)=>{setMembers(list);try{localStorage.setItem("vedanta_family",JSON.stringify(list))}catch{}};
  const addMember=()=>{
    if(!form.name||!form.dob){alert("Name and date of birth are required");return;}
    if(!isPremium){onPremium();return;}
    const{nIdx}=calcMoonNakshatra2(form.dob);
    const nk=NAKSHATRA_LIST[nIdx];
    save([...members,{id:Date.now(),...form,nakshatraName:nk.name,nakshatraLord:nk.lord}]);
    setForm({name:"",relation:"",dob:"",note:""});setShowAdd(false);
  };
  const removeMember=(id)=>save(members.filter(m=>m.id!==id));
  const getNextBd=(dobStr)=>{
    const dob=new Date(dobStr),today=new Date();
    const thisYr=new Date(today.getFullYear(),dob.getMonth(),dob.getDate());
    const nextBd=thisYr<=today?new Date(today.getFullYear()+1,dob.getMonth(),dob.getDate()):thisYr;
    const days=Math.round((nextBd-today)/86400000);
    return{days,date:nextBd.toLocaleDateString("en-IN",{day:"numeric",month:"short"})};
  };
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#001A0A,#002614)",borderRadius:18,padding:"16px 18px",marginBottom:14,border:"1px solid #22C55E44"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <div><h3 style={{color:"#fff",fontSize:15,fontWeight:900,margin:"0 0 3px"}}>👨‍👩‍👧 Family Sacred Calendar</h3>
            <p style={{color:S.muted,fontSize:12,margin:0}}>Track lunar birthdays and sacred days for your family</p></div>
          <button onClick={()=>{if(!isPremium){onPremium();return;}setShowAdd(p=>!p);}} style={{padding:"8px 14px",borderRadius:10,border:"none",background:"linear-gradient(90deg,#22C55E,#16A34A)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>+ Add</button>
        </div>
      </div>
      {showAdd&&(
        <div style={{background:S.card,borderRadius:16,padding:16,marginBottom:14,border:"1px solid #22C55E44"}}>
          <h4 style={{color:"#fff",fontSize:13,fontWeight:800,margin:"0 0 12px"}}>Add Family Member</h4>
          <div style={{display:"grid",gridTemplateColumns:bp==="mobile"?"1fr":"1fr 1fr",gap:10,marginBottom:10}}>
            <div><label style={{color:S.muted,fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>NAME *</label>
              <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Full name" style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid "+S.border,background:"rgba(255,255,255,0.06)",color:S.text,fontSize:13,boxSizing:"border-box"}}/></div>
            <div><label style={{color:S.muted,fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>RELATION</label>
              <select value={form.relation} onChange={e=>setForm(p=>({...p,relation:e.target.value}))} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid "+S.border,background:"#1A1A2E",color:S.text,fontSize:13,boxSizing:"border-box"}}>
                <option value="">Select...</option>{RELS.map(r=><option key={r} value={r}>{r}</option>)}
              </select></div>
            <div><label style={{color:S.muted,fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>DATE OF BIRTH *</label>
              <input type="date" value={form.dob} onChange={e=>setForm(p=>({...p,dob:e.target.value}))} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid "+S.border,background:"rgba(255,255,255,0.06)",color:S.text,fontSize:13,boxSizing:"border-box"}}/></div>
            <div><label style={{color:S.muted,fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>NOTE (optional)</label>
              <input value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} placeholder="e.g. Perform Nakshatri Shanti yearly" style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid "+S.border,background:"rgba(255,255,255,0.06)",color:S.text,fontSize:13,boxSizing:"border-box"}}/></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={addMember} style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:"linear-gradient(90deg,#22C55E,#16A34A)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>✓ Save Member</button>
            <button onClick={()=>setShowAdd(false)} style={{padding:"10px 16px",borderRadius:10,border:"1px solid "+S.border,background:"transparent",color:S.muted,fontSize:13,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}
      {members.length===0?(
        <div style={{border:"2px dashed "+S.border,borderRadius:14,padding:"30px 20px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:8}}>👨‍👩‍👧</div>
          <p style={{color:S.text,fontSize:13,fontWeight:700,margin:"0 0 4px"}}>No family members added yet</p>
          <p style={{color:S.muted,fontSize:12,margin:"0 0 12px"}}>Track lunar birthdays, nakshatras and sacred days for your family</p>
          {!isPremium&&<button onClick={onPremium} style={{padding:"9px 20px",borderRadius:10,border:"none",background:"linear-gradient(90deg,"+S.saffron+","+S.gold+")",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>⭐ Upgrade to Add Family</button>}
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {members.map(m=>{
            const bd=getNextBd(m.dob);
            return(
              <div key={m.id} style={{background:S.card,borderRadius:16,padding:"14px 16px",border:"1px solid "+S.border}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
                  <div><h4 style={{color:"#fff",fontSize:14,fontWeight:800,margin:"0 0 2px"}}>{m.name}</h4>
                    <p style={{color:S.saffron,fontSize:11,fontWeight:700,margin:0}}>{m.relation} · Born {new Date(m.dob).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p></div>
                  <button onClick={()=>removeMember(m.id)} style={{background:"transparent",border:"none",color:S.muted,fontSize:16,cursor:"pointer",padding:0}}>✕</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <div style={{background:"rgba(255,184,0,0.1)",borderRadius:10,padding:"8px 10px",border:"1px solid rgba(255,184,0,0.2)"}}>
                    <p style={{color:S.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",margin:"0 0 2px"}}>Next Birthday</p>
                    <p style={{color:S.gold,fontSize:13,fontWeight:900,margin:0}}>🎂 {bd.days===0?"Today! 🎉":bd.days===1?"Tomorrow":bd.days+" days"}</p>
                    <p style={{color:S.muted,fontSize:10,margin:0}}>{bd.date}</p>
                  </div>
                  <div style={{background:"rgba(107,79,255,0.12)",borderRadius:10,padding:"8px 10px",border:"1px solid rgba(107,79,255,0.2)"}}>
                    <p style={{color:S.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",margin:"0 0 2px"}}>Nakshatra</p>
                    <p style={{color:"#9C6FFF",fontSize:13,fontWeight:900,margin:0}}>✨ {m.nakshatraName}</p>
                    <p style={{color:S.muted,fontSize:10,margin:0}}>Lord: {m.nakshatraLord}</p>
                  </div>
                </div>
                {m.note&&<p style={{color:S.muted,fontSize:11,margin:"8px 0 0",fontStyle:"italic"}}>📌 {m.note}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* — Puja Guide Panel — */
function PujaGuidePanel({S,bp,isPremium,onPremium}){
  const[selected,setSelected]=useState(null);
  const[activeStep,setActiveStep]=useState(0);
  const[showIng,setShowIng]=useState(false);
  if(selected){
    const g=PUJA_GUIDES[selected];
    return(
      <div>
        <button onClick={()=>{setSelected(null);setActiveStep(0);setShowIng(false);}} style={{background:S.card,border:"1px solid "+S.border,color:S.saffron,padding:"7px 14px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:14}}>← Back to Guides</button>
        <div style={{background:"linear-gradient(135deg,#0D0D00,#1A1500)",borderRadius:18,padding:"16px 18px",marginBottom:14,border:"1px solid "+S.gold+"44"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
            <span style={{fontSize:36}}>{g.icon}</span>
            <div><h3 style={{color:"#fff",fontSize:16,fontWeight:900,margin:"0 0 2px"}}>{g.name}</h3>
              <p style={{color:S.muted,fontSize:12,margin:0}}>⏱️ {g.duration} · {g.steps.length} steps</p></div>
          </div>
          <p style={{color:S.muted,fontSize:12,lineHeight:1.6,margin:0}}>{g.desc}</p>
        </div>
        <div style={{background:S.card,borderRadius:16,padding:16,marginBottom:12,border:"1px solid "+S.border}}>
          <button onClick={()=>setShowIng(p=>!p)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",background:"transparent",border:"none",cursor:"pointer",padding:0}}>
            <h4 style={{color:"#fff",fontSize:13,fontWeight:800,margin:0}}>🛒 Required Items ({g.ingredients.length})</h4>
            <span style={{color:S.muted,fontSize:14}}>{showIng?"▲":"▼"}</span>
          </button>
          {showIng&&<div style={{marginTop:10}}>
            {g.ingredients.map((ing,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:i<g.ingredients.length-1?"1px solid "+S.border+"55":"none"}}>
                <span style={{color:S.saffron,fontSize:13}}>•</span><span style={{color:S.text,fontSize:12}}>{ing}</span>
              </div>
            ))}
          </div>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
          {g.steps.map((step,i)=>{
            const done=i<activeStep,cur=i===activeStep;
            return(
              <div key={i} onClick={()=>setActiveStep(i)} style={{background:cur?"linear-gradient(135deg,"+S.saffron+"18,"+S.gold+"12)":done?"rgba(34,197,94,0.06)":S.card,borderRadius:14,padding:"12px 14px",border:"1px solid "+(cur?S.saffron+"44":done?"#22C55E33":S.border),cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:done?"#22C55E":cur?"linear-gradient(135deg,"+S.saffron+","+S.gold+")":S.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",flexShrink:0}}>{done?"✓":i+1}</div>
                  <div style={{flex:1}}>
                    <p style={{color:cur?S.gold:done?"#22C55E":S.text,fontSize:13,fontWeight:700,margin:"0 0 3px"}}>{step.n}</p>
                    {cur&&<p style={{color:S.muted,fontSize:12,lineHeight:1.6,margin:"0 0 6px"}}>{step.d}</p>}
                    {cur&&<span style={{color:S.muted,fontSize:11}}>⏱️ ~{step.t} min</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {activeStep>0&&<button onClick={()=>setActiveStep(p=>p-1)} style={{flex:1,padding:"10px",borderRadius:10,border:"1px solid "+S.border,background:"transparent",color:S.text,fontSize:13,fontWeight:600,cursor:"pointer"}}>← Previous</button>}
          {activeStep<g.steps.length-1
            ?<button onClick={()=>setActiveStep(p=>p+1)} style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:"linear-gradient(90deg,"+S.saffron+","+S.gold+")",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>Next Step →</button>
            :<button onClick={()=>setActiveStep(0)} style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:"linear-gradient(90deg,#22C55E,#16A34A)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>✓ Puja Complete! Restart</button>}
        </div>
        <div style={{background:S.card,borderRadius:14,padding:14,border:"1px solid "+S.border}}>
          <h4 style={{color:S.gold,fontSize:12,fontWeight:800,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:0.5}}>Key Mantras</h4>
          {g.mantras.map((m,i)=><p key={i} style={{color:S.text,fontSize:13,margin:"0 0 5px",lineHeight:1.5}}>{m}</p>)}
        </div>
      </div>
    );
  }
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#0D0D00,#1A1500)",borderRadius:18,padding:"16px 18px",marginBottom:14,border:"1px solid "+S.gold+"44"}}>
        <h3 style={{color:"#fff",fontSize:15,fontWeight:900,margin:"0 0 3px"}}>📿 Puja Planner & Ritual Guide</h3>
        <p style={{color:S.muted,fontSize:12,margin:0}}>Step-by-step puja guides with ingredients, mantras and timing</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {PUJA_GUIDE_LIST.map(g=>(
          <div key={g.key} onClick={()=>{if(!isPremium&&g.key!=="ganesh"){onPremium();return;}setSelected(g.key);setActiveStep(0);setShowIng(false);}} style={{background:S.card,borderRadius:16,padding:"14px 16px",border:"1px solid "+S.border,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:52,height:52,borderRadius:14,background:g.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,border:"1px solid "+g.color+"44"}}>{g.icon}</div>
            <div style={{flex:1}}>
              <h4 style={{color:"#fff",fontSize:13,fontWeight:800,margin:"0 0 2px"}}>{g.name}</h4>
              <p style={{color:S.muted,fontSize:11,margin:0}}>{g.occasion}</p>
            </div>
            <div style={{flexShrink:0}}>{!isPremium&&g.key!=="ganesh"?<span style={{background:S.gold+"22",color:S.gold,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,border:"1px solid "+S.gold+"44"}}>⭐ Premium</span>:<span style={{color:S.muted,fontSize:18}}>›</span>}</div>
          </div>
        ))}
      </div>
      {!isPremium&&<div style={{marginTop:12,background:"rgba(255,192,64,0.08)",borderRadius:12,padding:"12px 14px",border:"1px solid "+S.gold+"33",textAlign:"center"}}>
        <p style={{color:S.gold,fontSize:12,fontWeight:700,margin:"0 0 4px"}}>⭐ Unlock all 5 Puja Guides with Premium</p>
        <p style={{color:S.muted,fontSize:11,margin:0}}>Ganesh Puja is free for all users</p>
      </div>}
    </div>
  );
}

/* — Fasting Guide Panel — */
const FASTING_VRATAS=[
  {key:"ekadashi",icon:"🌙",name:"Ekadashi",freq:"Twice monthly",color:"#6B4FFF",
   desc:"Observed on the 11th day of each lunar fortnight. Highly auspicious for spiritual cleansing and devotion to Lord Vishnu.",
   allowed:["Fruits (bananas, apples, mangoes, pomegranate)","Milk, curd, buttermilk, paneer","Sabudana (tapioca pearls)","Singhare ki atta (water chestnut flour)","Sendha namak (rock salt)","Nuts and dry fruits","Kuttu flour (buckwheat)","Sweet potatoes, yam"],
   avoid:["All grains and lentils","Common salt (sea salt)","Non-vegetarian food","Garlic, onion, ginger","Alcohol, tobacco","Eating at night (Nirjala Ekadashi — no water too)"],
   parana:"Next day after sunrise during Dwadashi tithi, before Dwadashi ends",
   mantra:"ॐ नमो भगवते वासुदेवाय",
   benefit:"Destroys sins, purifies mind, grants liberation. Observing 24 Ekadashis in a year equals the merit of Ashwamedha Yagna.",
   tips:["Start fast after sunset on Dashami","Ideal to stay awake at night singing bhajans","Visit Vishnu temple in the morning","Break fast (parana) with Tulsi leaf + water"]},
  {key:"navratri",icon:"🔱",name:"Navratri",freq:"4 times/year",color:"#E11D48",
   desc:"Nine nights of fasting and worship of Goddess Durga in her nine forms. Most celebrated are Chaitra and Sharad Navratri.",
   allowed:["All fruits","Milk and dairy products","Sabudana dishes (khichdi, vada, kheer)","Kuttu atta rotis and poori","Singhare atta items","Sendha namak","Sama ke chawal (barnyard millet)","Rajgira (amaranth) ladoo"],
   avoid:["Wheat, rice, regular flour","Table salt","Onion and garlic","Lentils and pulses","Non-vegetarian food","Alcohol"],
   parana:"After Navami puja — Kanya Puja first, then prasad",
   mantra:"ॐ दुं दुर्गायै नमः",
   benefit:"Invokes divine feminine energy, grants strength, prosperity and protection. Removes obstacles and negative energies.",
   tips:["Wear color for each day (according to Devi's form)","Perform Ghat Sthapana on Day 1","Light akhand diya throughout","Kanya Puja on Ashtami or Navami"]},
  {key:"pradosh",icon:"🌅",name:"Pradosh Vrat",freq:"Twice monthly",color:"#0EA5E9",
   desc:"Observed on Trayodashi (13th lunar day). Dedicated to Lord Shiva and Parvati. Pradosh means 'removal of sins at dusk'.",
   allowed:["Fruits and milk","Paneer and curd","Sabudana","Rock salt items","Dry fruits","Coconut water"],
   avoid:["Grains","Regular salt","Meat, fish, eggs","Alcohol","Onion, garlic"],
   parana:"Next morning after sunrise",
   mantra:"ॐ नमः शिवाय",
   benefit:"Removes all sins, grants good health, long life, wealth and fulfillment of desires. Shiva and Parvati together bless devotees.",
   tips:["Fast and visit Shiva temple during Pradosh period (1.5 hrs before/after sunset)","Perform abhishek with milk, honey, Gangajal","Offer bel patra (wood apple leaves)","Recite Maha Mrityunjaya Mantra 108 times"]},
  {key:"somvar",icon:"🕉️",name:"Somvar Vrat",freq:"Every Monday",color:"#64748B",
   desc:"Monday fasts dedicated to Lord Shiva. Especially powerful during Shravan month when every Somvar is highly sacred.",
   allowed:["One meal a day (Vrat food)","Fruits throughout the day","Milk, curd, paneer","Sabudana khichdi","Rock salt preparations"],
   avoid:["Regular meals","Grains (for strict fast)","Onion, garlic","Non-veg, alcohol"],
   parana:"After evening puja (for day fast) or next morning",
   mantra:"ॐ नमः शिवाय | ॐ त्र्यम्बकं यजामहे...",
   benefit:"Grants good health, removes doshas, bestows happiness in family life. Unmarried girls observe for ideal husband.",
   tips:["Visit Shiva temple in morning and evening","Offer milk, Gangajal, bel patra","Read Shiv Chalisa or Shiv Puran","Wear white or light-coloured clothes"]},
  {key:"chaturthi",icon:"🐘",name:"Ganesh Chaturthi",freq:"Monthly / Annual",color:"#F59E0B",
   desc:"The 4th day of lunar fortnight dedicated to Lord Ganesha. Sankat Chaturthi (Krishnapaksha) and Vinayak Chaturthi (Shuklapaksha) both observed.",
   allowed:["Fruits","Milk and dairy","Modak (sweet dumplings — Ganesha's favourite)","Laddoo","Coconut items","Rock salt snacks"],
   avoid:["Grains","Looking at the moon on Bhadrapada Chaturthi","Garlic, onion","Non-vegetarian"],
   parana:"After moonrise on Chaturthi evening (after seeing the moon)",
   mantra:"ॐ गं गणपतये नमः | वक्रतुण्ड महाकाय...",
   benefit:"Removes all obstacles (Vighnaharta), grants wisdom, success in new ventures and good beginnings.",
   tips:["Do not look at moon on Ganesh Chaturthi (Bhadrapada)","Offer 21 modaks or laddoos","Recite Atharvashirsha","Ganesh Visarjan after 1, 3, 5, 7 or 11 days"]},
  {key:"purnima",icon:"🌕",name:"Purnima Vrat",freq:"Monthly",color:"#FCD34D",
   desc:"Full moon day fasting dedicated to Lord Vishnu and Satyanarayan. Highly auspicious for all spiritual activities.",
   allowed:["Fruits","Milk, curd, paneer","Sabudana","Kuttu flour items","Rock salt","Dry fruits"],
   avoid:["Grains for strict fast","Onion, garlic","Alcohol","Non-veg"],
   parana:"Next morning",
   mantra:"ॐ नमो नारायणाय | ॐ सत्यनारायणाय नमः",
   benefit:"Grants peace, prosperity and spiritual merit. Ideal for Satyanarayan Katha, charity and ancestor prayers.",
   tips:["Take early morning bath","Donate food or clothes","Offer kheer/prasad to Lord Vishnu","Light lamp at evening (Sandhya diya)"]},
  {key:"shivratri",icon:"🔱",name:"Maha Shivratri",freq:"Annually (Phalguna)",color:"#7C3AED",
   desc:"The great night of Lord Shiva — observed by staying awake all night, fasting and performing four puja sessions (prahar).",
   allowed:["Fruits all day","Milk, thandai (without bhang for regular fast)","Panchamrit","Rock salt snacks","Bhaang (traditional in some regions — optional)"],
   avoid:["All grains","Regular meals","Onion, garlic","Alcohol"],
   parana:"Next morning after sunrise, after completing Parana puja",
   mantra:"ॐ नमः शिवाय | ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्...",
   benefit:"Destroys accumulated sins of many lifetimes. Grants moksha, removes Kaal Sarp dosha effects, bestows divine blessings.",
   tips:["Perform 4 prahar puja (every 3 hrs through the night)","Abhishek with milk, honey, curd, ghee, sugar (Panchamrit)","Offer bel patra, dhatura, blue lotus","Stay awake (Jaagaran) singing Shiv bhajans"]},
];

function FastingGuidePanel({S,bp,isPremium,onPremium}){
  const[selected,setSelected]=useState(null);
  const[showAllowed,setShowAllowed]=useState(true);
  if(selected){
    const v=FASTING_VRATAS.find(x=>x.key===selected);
    return(
      <div>
        <button onClick={()=>setSelected(null)} style={{background:S.card,border:"1px solid "+S.border,color:S.saffron,padding:"7px 14px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:14}}>← All Vratas</button>
        <div style={{background:"linear-gradient(135deg,#0A001A,#15002E)",borderRadius:18,padding:"16px 18px",marginBottom:12,border:"1px solid "+v.color+"44"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
            <span style={{fontSize:36}}>{v.icon}</span>
            <div>
              <h3 style={{color:"#fff",fontSize:16,fontWeight:900,margin:"0 0 2px"}}>{v.name}</h3>
              <span style={{background:v.color+"22",color:v.color,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,border:"1px solid "+v.color+"44"}}>{v.freq}</span>
            </div>
          </div>
          <p style={{color:S.muted,fontSize:12,lineHeight:1.7,margin:0}}>{v.desc}</p>
        </div>
        {/* Mantra */}
        <div style={{background:"linear-gradient(135deg,"+v.color+"18,"+v.color+"08)",borderRadius:14,padding:"12px 16px",marginBottom:12,border:"1px solid "+v.color+"33",textAlign:"center"}}>
          <p style={{color:S.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",margin:"0 0 4px",letterSpacing:1}}>Key Mantra</p>
          <p style={{color:v.color,fontSize:14,fontWeight:800,margin:0,lineHeight:1.8}}>{v.mantra}</p>
        </div>
        {/* Allowed / Avoid Toggle */}
        <div style={{display:"flex",gap:6,marginBottom:10}}>
          <button onClick={()=>setShowAllowed(true)} style={{flex:1,padding:"8px",borderRadius:10,border:"1px solid "+(showAllowed?"#22C55E":S.border),background:showAllowed?"#22C55E22":"transparent",color:showAllowed?"#22C55E":S.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>✅ Allowed Foods</button>
          <button onClick={()=>setShowAllowed(false)} style={{flex:1,padding:"8px",borderRadius:10,border:"1px solid "+(!showAllowed?"#EF4444":S.border),background:!showAllowed?"#EF444422":"transparent",color:!showAllowed?"#EF4444":S.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>❌ Avoid</button>
        </div>
        <div style={{background:S.card,borderRadius:14,padding:"12px 16px",marginBottom:12,border:"1px solid "+S.border}}>
          {(showAllowed?v.allowed:v.avoid).map((item,i)=>(
            <div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:i<(showAllowed?v.allowed:v.avoid).length-1?"1px solid "+S.border+"44":"none"}}>
              <span style={{color:showAllowed?"#22C55E":"#EF4444",fontSize:12,flexShrink:0}}>{showAllowed?"✓":"✗"}</span>
              <span style={{color:S.text,fontSize:12,lineHeight:1.5}}>{item}</span>
            </div>
          ))}
        </div>
        {/* Parana */}
        <div style={{background:"rgba(255,192,64,0.08)",borderRadius:14,padding:"12px 16px",marginBottom:12,border:"1px solid "+S.gold+"33"}}>
          <p style={{color:S.gold,fontSize:11,fontWeight:800,textTransform:"uppercase",margin:"0 0 4px",letterSpacing:0.8}}>🌅 Parana (Break Fast)</p>
          <p style={{color:S.text,fontSize:12,lineHeight:1.6,margin:0}}>{v.parana}</p>
        </div>
        {/* Tips */}
        <div style={{background:S.card,borderRadius:14,padding:"12px 16px",marginBottom:12,border:"1px solid "+S.border}}>
          <p style={{color:"#fff",fontSize:12,fontWeight:800,margin:"0 0 8px"}}>💡 Observance Tips</p>
          {v.tips.map((t,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:5}}>
              <span style={{color:v.color,fontWeight:800,fontSize:12,flexShrink:0}}>{i+1}.</span>
              <span style={{color:S.muted,fontSize:12,lineHeight:1.5}}>{t}</span>
            </div>
          ))}
        </div>
        {/* Benefit */}
        <div style={{background:"linear-gradient(135deg,"+v.color+"12,transparent)",borderRadius:14,padding:"12px 16px",border:"1px solid "+v.color+"22"}}>
          <p style={{color:v.color,fontSize:11,fontWeight:800,textTransform:"uppercase",margin:"0 0 4px",letterSpacing:0.8}}>🌟 Spiritual Benefit</p>
          <p style={{color:S.muted,fontSize:12,lineHeight:1.6,margin:0}}>{v.benefit}</p>
        </div>
      </div>
    );
  }
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#0A001A,#15002E)",borderRadius:18,padding:"16px 18px",marginBottom:14,border:"1px solid #6B4FFF44"}}>
        <h3 style={{color:"#fff",fontSize:15,fontWeight:900,margin:"0 0 3px"}}>🌙 Fasting Guide & Vrata Companion</h3>
        <p style={{color:S.muted,fontSize:12,margin:0}}>Complete food rules, mantras, tips and parana time for all major vratas</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {FASTING_VRATAS.map((v,i)=>(
          <div key={v.key} onClick={()=>{if(!isPremium&&i>1){onPremium();return;}setSelected(v.key);setShowAllowed(true);}} style={{background:S.card,borderRadius:16,padding:"14px 16px",border:"1px solid "+S.border,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:52,height:52,borderRadius:14,background:v.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,border:"1px solid "+v.color+"33"}}>{v.icon}</div>
            <div style={{flex:1}}>
              <h4 style={{color:"#fff",fontSize:13,fontWeight:800,margin:"0 0 2px"}}>{v.name}</h4>
              <p style={{color:S.muted,fontSize:11,margin:0}}>{v.freq}</p>
            </div>
            <div style={{flexShrink:0}}>{!isPremium&&i>1?<span style={{background:S.gold+"22",color:S.gold,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,border:"1px solid "+S.gold+"44"}}>⭐ Premium</span>:<span style={{color:v.color,fontSize:18}}>›</span>}</div>
          </div>
        ))}
      </div>
      {!isPremium&&<div style={{marginTop:12,background:"rgba(255,192,64,0.08)",borderRadius:12,padding:"12px 14px",border:"1px solid "+S.gold+"33",textAlign:"center"}}>
        <p style={{color:S.gold,fontSize:12,fontWeight:700,margin:"0 0 4px"}}>⭐ Unlock all 7 Vrata Guides with Premium</p>
        <p style={{color:S.muted,fontSize:11,margin:0}}>Ekadashi & Navratri guides are free for all users</p>
      </div>}
    </div>
  );
}

/* — Pilgrimage Tracker Panel — */
const PILGRIMAGE_SITES=[
  {id:"badrinath",name:"Badrinath",region:"Uttarakhand",type:"Char Dham",deity:"Vishnu",icon:"🏔️",state:"UK"},
  {id:"kedarnath",name:"Kedarnath",region:"Uttarakhand",type:"Char Dham",deity:"Shiva",icon:"🗻",state:"UK"},
  {id:"gangotri",name:"Gangotri",region:"Uttarakhand",type:"Char Dham",deity:"Ganga Mata",icon:"💧",state:"UK"},
  {id:"yamunotri",name:"Yamunotri",region:"Uttarakhand",type:"Char Dham",deity:"Yamuna Mata",icon:"🌊",state:"UK"},
  {id:"varanasi",name:"Varanasi (Kashi)",region:"Uttar Pradesh",type:"Sacred City",deity:"Shiva",icon:"🪔",state:"UP"},
  {id:"prayagraj",name:"Prayagraj (Sangam)",region:"Uttar Pradesh",type:"Tirth",deity:"Triveni Sangam",icon:"🌀",state:"UP"},
  {id:"ayodhya",name:"Ayodhya",region:"Uttar Pradesh",type:"Sapta Puri",deity:"Rama",icon:"🏹",state:"UP"},
  {id:"mathura",name:"Mathura-Vrindavan",region:"Uttar Pradesh",type:"Sapta Puri",deity:"Krishna",icon:"🪈",state:"UP"},
  {id:"dwarka",name:"Dwarka",region:"Gujarat",type:"Char Dham + Sapta Puri",deity:"Krishna",icon:"🐚",state:"GJ"},
  {id:"somnath",name:"Somnath",region:"Gujarat",type:"Jyotirlinga",deity:"Shiva",icon:"🌙",state:"GJ"},
  {id:"tirupati",name:"Tirupati Balaji",region:"Andhra Pradesh",type:"108 Divya Desam",deity:"Venkateswara",icon:"🔔",state:"AP"},
  {id:"shirdi",name:"Shirdi Sai Baba",region:"Maharashtra",type:"Pilgrimage",deity:"Sai Baba",icon:"✨",state:"MH"},
  {id:"nashik_tryambakeshwar",name:"Trimbakeshwar",region:"Maharashtra",type:"Jyotirlinga",deity:"Shiva",icon:"🕉️",state:"MH"},
  {id:"shirdi",name:"Pandharpur",region:"Maharashtra",type:"Varkari",deity:"Vitthal-Rukmini",icon:"🟡",state:"MH"},
  {id:"ujjain",name:"Ujjain (Mahakal)",region:"Madhya Pradesh",type:"Jyotirlinga",deity:"Mahakala Shiva",icon:"🌑",state:"MP"},
  {id:"omkareshwar",name:"Omkareshwar",region:"Madhya Pradesh",type:"Jyotirlinga",deity:"Shiva",icon:"ॐ",state:"MP"},
  {id:"rameshwaram",name:"Rameshwaram",region:"Tamil Nadu",type:"Char Dham + Jyotirlinga",deity:"Shiva-Rama",icon:"🌊",state:"TN"},
  {id:"madurai",name:"Madurai Meenakshi",region:"Tamil Nadu",type:"Shakti Peeth",deity:"Meenakshi Devi",icon:"🐟",state:"TN"},
  {id:"guruvayur",name:"Guruvayur",region:"Kerala",type:"Divya Desam",deity:"Krishna",icon:"🐘",state:"KL"},
  {id:"sabarimala",name:"Sabarimala",region:"Kerala",type:"Pilgrimage",deity:"Ayyappa",icon:"🌿",state:"KL"},
  {id:"udupi",name:"Udupi Krishna",region:"Karnataka",type:"Divya Kshetra",deity:"Krishna",icon:"💛",state:"KA"},
  {id:"kukke",name:"Kukke Subramanya",region:"Karnataka",type:"Pilgrimage",deity:"Subramanya",icon:"🐍",state:"KA"},
  {id:"puri",name:"Puri Jagannath",region:"Odisha",type:"Char Dham",deity:"Jagannath",icon:"🎠",state:"OD"},
  {id:"konark",name:"Konark Sun Temple",region:"Odisha",type:"Heritage Temple",deity:"Surya",icon:"☀️",state:"OD"},
  {id:"kamakhya",name:"Kamakhya Devi",region:"Assam",type:"Shakti Peeth",deity:"Shakti",icon:"🔴",state:"AS"},
  {id:"vaishno_devi",name:"Vaishno Devi",region:"Jammu & Kashmir",type:"Shakti Peeth",deity:"Vaishno Devi",icon:"🏔️",state:"JK"},
  {id:"amritsar",name:"Golden Temple",region:"Punjab",type:"Sikh Pilgrimage",deity:"Waheguru",icon:"🟡",state:"PB"},
  {id:"haridwar",name:"Haridwar",region:"Uttarakhand",type:"Sacred City",deity:"Ganga",icon:"🌸",state:"UK"},
  {id:"rishikesh",name:"Rishikesh",region:"Uttarakhand",type:"Yoga Capital",deity:"Ganga + Ashrams",icon:"🧘",state:"UK"},
  {id:"pushkar",name:"Pushkar",region:"Rajasthan",type:"Brahma Temple",deity:"Brahma",icon:"🪷",state:"RJ"},
];
const PTYPE_COLORS={"Char Dham":"#FF6B35","Jyotirlinga":"#6B4FFF","Shakti Peeth":"#E11D48","Sapta Puri":"#F59E0B","Sacred City":"#0EA5E9","Divya Desam":"#10B981","Pilgrimage":"#64748B","Varkari":"#F97316","Heritage Temple":"#8B5CF6","Sikh Pilgrimage":"#EAB308","Yoga Capital":"#34D399","Brahma Temple":"#FB7185","108 Divya Desam":"#22D3EE","Tirth":"#A78BFA","Divya Kshetra":"#FCD34D","Char Dham + Sapta Puri":"#FF6B35","Char Dham + Jyotirlinga":"#FF6B35"};

function PilgrimageTrackerPanel({S,bp,isPremium,onPremium}){
  const[visited,setVisited]=useState(()=>{try{return JSON.parse(localStorage.getItem("vedanta_pilgrimage")||"[]")}catch{return[];}});
  const[wishlist,setWishlist]=useState(()=>{try{return JSON.parse(localStorage.getItem("vedanta_pilgrimage_wish")||"[]")}catch{return[];}});
  const[filterType,setFilterType]=useState("All");
  const[viewMode,setViewMode]=useState("all");
  const saveV=(list)=>{setVisited(list);try{localStorage.setItem("vedanta_pilgrimage",JSON.stringify(list))}catch{}};
  const saveW=(list)=>{setWishlist(list);try{localStorage.setItem("vedanta_pilgrimage_wish",JSON.stringify(list))}catch{}};
  const toggleVisited=(id)=>{
    if(!isPremium){onPremium();return;}
    const newV=visited.includes(id)?visited.filter(x=>x!==id):[...visited,id];
    saveV(newV);
    if(newV.includes(id)&&wishlist.includes(id)) saveW(wishlist.filter(x=>x!==id));
  };
  const toggleWish=(id,e)=>{
    e.stopPropagation();
    if(!isPremium){onPremium();return;}
    saveW(wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id]);
  };
  const types=["All",...[...new Set(PILGRIMAGE_SITES.map(s=>s.type.split(" + ")[0]))]];
  const displayed=PILGRIMAGE_SITES.filter(s=>{
    const matchType=filterType==="All"||s.type.includes(filterType);
    const matchView=viewMode==="all"||(viewMode==="visited"&&visited.includes(s.id))||(viewMode==="wishlist"&&wishlist.includes(s.id));
    return matchType&&matchView;
  });
  const pct=Math.round((visited.length/PILGRIMAGE_SITES.length)*100);
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#001A0A,#002E14)",borderRadius:18,padding:"16px 18px",marginBottom:14,border:"1px solid #10B98144"}}>
        <h3 style={{color:"#fff",fontSize:15,fontWeight:900,margin:"0 0 3px"}}>🗺️ Pilgrimage Tracker</h3>
        <p style={{color:S.muted,fontSize:12,margin:0}}>Track your sacred journeys across India — {PILGRIMAGE_SITES.length} holy sites</p>
      </div>
      {/* Progress */}
      <div style={{background:S.card,borderRadius:16,padding:"14px 16px",marginBottom:14,border:"1px solid "+S.border}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{color:"#fff",fontSize:13,fontWeight:800}}>Your Journey Progress</span>
          <span style={{color:"#10B981",fontSize:14,fontWeight:900}}>{visited.length}/{PILGRIMAGE_SITES.length}</span>
        </div>
        <div style={{background:S.border,borderRadius:20,height:8,overflow:"hidden",marginBottom:6}}>
          <div style={{width:pct+"%",height:"100%",background:"linear-gradient(90deg,#10B981,#34D399)",borderRadius:20,transition:"width 0.5s ease"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <span style={{color:S.muted,fontSize:11}}>{pct}% complete</span>
          <span style={{color:"#F59E0B",fontSize:11}}>{wishlist.length} on wishlist</span>
        </div>
      </div>
      {/* View Mode */}
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        {[{id:"all",label:"All Sites"},{id:"visited",label:"✅ Visited"},{id:"wishlist",label:"⭐ Wishlist"}].map(v=>(
          <button key={v.id} onClick={()=>setViewMode(v.id)} style={{flex:1,padding:"7px 4px",borderRadius:10,border:"1px solid "+(viewMode===v.id?"#10B981":S.border),background:viewMode===v.id?"#10B98122":"transparent",color:viewMode===v.id?"#10B981":S.muted,fontSize:11,fontWeight:700,cursor:"pointer"}}>{v.label}</button>
        ))}
      </div>
      {/* Type Filter */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {["All","Char Dham","Jyotirlinga","Shakti Peeth","Sapta Puri","Sacred City"].map(t=>(
          <button key={t} onClick={()=>setFilterType(t)} style={{padding:"5px 10px",borderRadius:20,border:"1px solid "+(filterType===t?(PTYPE_COLORS[t]||S.saffron):S.border),background:filterType===t?(PTYPE_COLORS[t]||S.saffron)+"22":"transparent",color:filterType===t?(PTYPE_COLORS[t]||S.saffron):S.muted,fontSize:10,fontWeight:700,cursor:"pointer"}}>{t}</button>
        ))}
      </div>
      {displayed.length===0&&<div style={{textAlign:"center",padding:"24px",color:S.muted}}><p style={{fontSize:13}}>No sites in this view. Start marking your visits!</p></div>}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {displayed.map(site=>{
          const isVisited=visited.includes(site.id);
          const isWish=wishlist.includes(site.id);
          const typeColor=PTYPE_COLORS[site.type.split(" + ")[0]]||S.saffron;
          return(
            <div key={site.id} onClick={()=>toggleVisited(site.id)} style={{background:isVisited?"rgba(16,185,129,0.08)":S.card,borderRadius:14,padding:"12px 14px",border:"1px solid "+(isVisited?"#10B98144":S.border),cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:44,height:44,borderRadius:12,background:typeColor+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,border:"1px solid "+typeColor+"33"}}>{site.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <h4 style={{color:"#fff",fontSize:12,fontWeight:800,margin:0}}>{site.name}</h4>
                  {isVisited&&<span style={{color:"#10B981",fontSize:10}}>✓</span>}
                </div>
                <p style={{color:S.muted,fontSize:10,margin:"0 0 3px"}}>📍 {site.region}</p>
                <span style={{background:typeColor+"18",color:typeColor,fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:10,border:"1px solid "+typeColor+"22"}}>{site.type.split(" + ")[0]}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flexShrink:0}}>
                <button onClick={(e)=>toggleWish(site.id,e)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:16,color:isWish?"#F59E0B":"#444",padding:0}}>{isWish?"⭐":"☆"}</button>
                <div style={{width:22,height:22,borderRadius:"50%",border:"2px solid "+(isVisited?"#10B981":S.border),background:isVisited?"#10B981":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {isVisited&&<span style={{color:"#fff",fontSize:10,fontWeight:800}}>✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!isPremium&&<div style={{marginTop:12,background:"rgba(255,192,64,0.08)",borderRadius:12,padding:"12px 14px",border:"1px solid "+S.gold+"33",textAlign:"center"}}>
        <p style={{color:S.gold,fontSize:12,fontWeight:700,margin:"0 0 4px"}}>⭐ Upgrade to Premium to track your pilgrimages</p>
        <p style={{color:S.muted,fontSize:11,margin:0}}>Save visited sites and wishlist across sessions</p>
      </div>}
    </div>
  );
}

/* — Muhurat Finder Panel — */
const MUHURAT_TYPES=[
  {key:"vivah",icon:"💍",name:"Vivah (Marriage)",color:"#E11D48",
   goodDays:[0,3,4,5],goodNaks:[3,4,6,7,10,11,12,13,14,22,23,25,26],
   rules:"Marriage muhurats are auspicious on Monday, Wednesday, Thursday, Friday. Avoid Tuesday, Saturday. Best nakshatras: Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Mula, Uttara Ashadha, Uttara Bhadrapada, Revati.",
   tips:["Avoid Kharmas (sun in Sagittarius or Pisces)","Avoid eclipse periods","Check bride & groom Kundali matching (Ashtkoot)","Best months: Vaishakh, Jyeshtha, Magh, Phalguna"]},
  {key:"griha",icon:"🏠",name:"Griha Pravesh",color:"#10B981",
   goodDays:[0,3,4,5],goodNaks:[0,3,4,6,7,10,11,12,13,14,20,21,22,23,25,26],
   rules:"Best days: Monday, Wednesday, Thursday, Friday, Sunday. Avoid Tuesday and Saturday. Uttara nakshatras (Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada) and Rohini are ideal.",
   tips:["Enter during Shukla Paksha (waxing moon)","Perform Vastu Shanti puja before entering","Carry Kalash (water pot) and fire while entering","Best months: Vaishakh, Jyeshtha, Magh, Phalguna, Kartik"]},
  {key:"vyapar",icon:"💼",name:"Vyapar (Business Start)",color:"#F59E0B",
   goodDays:[0,3,4,5],goodNaks:[3,4,7,10,11,13,14,20,21,22,25,26],
   rules:"Thursday and Wednesday are most auspicious for new business ventures. Pushya nakshatra is considered the best for all commercial activities.",
   tips:["Pushya nakshatra Thursday is the most auspicious time","Avoid starting on Amavasya","Perform Ganesh and Lakshmi puja","Avoid Rahu Kaal on the chosen day"]},
  {key:"yatra",icon:"✈️",name:"Yatra (Travel)",color:"#0EA5E9",
   goodDays:[0,1,3,4,5],goodNaks:[0,1,3,4,7,10,11,12,13,14,20,21,22,23,25,26],
   rules:"Best days for travel: Sunday (east), Monday (north), Wednesday (north), Thursday (north/east), Friday (south). Tuesday and Saturday are inauspicious for starting journeys.",
   tips:["Avoid starting travel during Rahu Kaal","Pray to Ganesha before departure","Note: each day is best for specific directions","Avoid setting out facing south initially"]},
  {key:"naamkaran",icon:"👶",name:"Naamkaran (Naming)",color:"#8B5CF6",
   goodDays:[0,1,3,4,5],goodNaks:[3,4,6,7,10,11,12,13,14,20,21,22,25,26],
   rules:"Naming ceremony ideally on the 11th or 12th day after birth. Can be done on any auspicious day if delayed. Avoid Sundays and Tuesdays for the ceremony.",
   tips:["Traditional timing: 11th day after birth","Name should begin with the syllable from the birth nakshatra","Perform in temple or at home with family","Pandit reads jataka (horoscope) to suggest name syllable"]},
  {key:"mundan",icon:"✂️",name:"Mundan (First Haircut)",color:"#64748B",
   goodDays:[0,1,3,4,5],goodNaks:[3,4,7,10,11,12,13,14,22,23,25,26],
   rules:"Mundan (Chudakarma) is performed in odd years (1st, 3rd, 5th year). Best done at a Shiva or Vishnu temple. Avoid inauspicious days and Purnima/Amavasya.",
   tips:["Ideally in 1st or 3rd year of life","Holy places like Tirupati, Varanasi, Haridwar are popular","Perform Mundan puja with coconut and flowers","Shaved hair is offered in the river or at the temple"]},
];
const WEEKDAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const NAKSHATRA_SHORT=["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanistha","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];

function MuhuratFinderPanel({S,bp,isPremium,onPremium}){
  const[activity,setActivity]=useState(null);
  const[startDate,setStartDate]=useState("");
  const[endDate,setEndDate]=useState("");
  const[results,setResults]=useState(null);
  const[searching,setSearching]=useState(false);
  const findMuhurat=()=>{
    if(!activity){alert("Please select an activity");return;}
    if(!startDate||!endDate){alert("Please enter a date range");return;}
    if(!isPremium){onPremium();return;}
    setSearching(true);
    setTimeout(()=>{
      const m=MUHURAT_TYPES.find(x=>x.key===activity);
      const start=new Date(startDate),end=new Date(endDate);
      const slots=[];
      const cur=new Date(start);
      while(cur<=end&&slots.length<5){
        const day=cur.getDay();
        if(m.goodDays.includes(day)){
          const daysSince2000=Math.floor((cur-new Date("2000-01-01"))/(86400000));
          const moonLon=(218+(daysSince2000*13.1764))%360;
          const nakIdx=Math.floor(moonLon/13.3333)%27;
          const isGoodNak=m.goodNaks.includes(nakIdx);
          const score=isGoodNak?3:2;
          slots.push({
            date:cur.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),
            day:WEEKDAYS[day],
            nak:NAKSHATRA_SHORT[nakIdx],
            score,
            label:score===3?"⭐ Highly Auspicious":"✅ Auspicious",
            color:score===3?S.gold:"#22C55E"
          });
        }
        cur.setDate(cur.getDate()+1);
      }
      setResults({m,slots});setSearching(false);
    },800);
  };
  if(activity&&results){
    const m=MUHURAT_TYPES.find(x=>x.key===activity);
    return(
      <div>
        <button onClick={()=>{setResults(null);setActivity(null);}} style={{background:S.card,border:"1px solid "+S.border,color:S.saffron,padding:"7px 14px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:14}}>← Back</button>
        <div style={{background:"linear-gradient(135deg,#0A0010,#18002A)",borderRadius:18,padding:"16px 18px",marginBottom:14,border:"1px solid "+m.color+"44"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <span style={{fontSize:28}}>{m.icon}</span>
            <h3 style={{color:"#fff",fontSize:15,fontWeight:900,margin:0}}>Muhurat for {m.name}</h3>
          </div>
          <p style={{color:S.muted,fontSize:11,margin:0}}>📅 {startDate} → {endDate}</p>
        </div>
        {results.slots.length===0?(
          <div style={{textAlign:"center",padding:"24px",background:S.card,borderRadius:14,border:"1px solid "+S.border}}>
            <p style={{color:S.muted,fontSize:13}}>No auspicious days found in this range. Try extending the date range.</p>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
            {results.slots.map((sl,i)=>(
              <div key={i} style={{background:S.card,borderRadius:14,padding:"13px 15px",border:"1px solid "+(sl.score===3?S.gold+"44":S.border)}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{color:"#fff",fontSize:13,fontWeight:800}}>{sl.date}</span>
                  <span style={{background:sl.color+"22",color:sl.color,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,border:"1px solid "+sl.color+"44"}}>{sl.label}</span>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <span style={{color:S.muted,fontSize:11}}>📅 {sl.day}</span>
                  <span style={{color:S.muted,fontSize:11}}>🌙 Nakshatra: {sl.nak}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{background:S.card,borderRadius:14,padding:"13px 15px",marginBottom:12,border:"1px solid "+S.border}}>
          <p style={{color:"#fff",fontSize:12,fontWeight:800,margin:"0 0 6px"}}>📋 Muhurat Rules</p>
          <p style={{color:S.muted,fontSize:12,lineHeight:1.6,margin:"0 0 10px"}}>{m.rules}</p>
          <p style={{color:"#fff",fontSize:12,fontWeight:800,margin:"0 0 6px"}}>💡 Tips</p>
          {m.tips.map((t,i)=>(
            <div key={i} style={{display:"flex",gap:7,marginBottom:4}}>
              <span style={{color:m.color,flexShrink:0,fontSize:12}}>•</span>
              <span style={{color:S.muted,fontSize:12,lineHeight:1.5}}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{background:"rgba(255,192,64,0.07)",borderRadius:12,padding:"11px 14px",border:"1px solid "+S.gold+"22"}}>
          <p style={{color:S.muted,fontSize:11,margin:0,lineHeight:1.6}}>⚠️ Based on simplified weekday + nakshatra rules. For a precise muhurat with Lagna, hora and full panchang analysis, consult a verified Jyotishi via Pandit Connect.</p>
        </div>
      </div>
    );
  }
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#0A0010,#18002A)",borderRadius:18,padding:"16px 18px",marginBottom:14,border:"1px solid #8B5CF644"}}>
        <h3 style={{color:"#fff",fontSize:15,fontWeight:900,margin:"0 0 3px"}}>⭐ Muhurat Finder</h3>
        <p style={{color:S.muted,fontSize:12,margin:0}}>Find auspicious dates for your most important life events</p>
      </div>
      {/* Activity Selection */}
      <p style={{color:S.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,margin:"0 0 8px"}}>Select Activity</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {MUHURAT_TYPES.map(m=>(
          <div key={m.key} onClick={()=>setActivity(m.key)} style={{background:activity===m.key?m.color+"22":S.card,borderRadius:14,padding:"13px 12px",border:"1px solid "+(activity===m.key?m.color+"66":S.border),cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:26,marginBottom:4}}>{m.icon}</div>
            <p style={{color:activity===m.key?m.color:"#fff",fontSize:11,fontWeight:800,margin:0,lineHeight:1.3}}>{m.name}</p>
          </div>
        ))}
      </div>
      {/* Date Range */}
      <p style={{color:S.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,margin:"0 0 8px"}}>Date Range to Search</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        <div><label style={{color:S.muted,fontSize:10,fontWeight:700,display:"block",marginBottom:4}}>FROM</label>
          <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{width:"100%",padding:"9px 10px",borderRadius:10,border:"1px solid "+S.border,background:"rgba(255,255,255,0.06)",color:S.text,fontSize:12,boxSizing:"border-box"}}/></div>
        <div><label style={{color:S.muted,fontSize:10,fontWeight:700,display:"block",marginBottom:4}}>TO</label>
          <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={{width:"100%",padding:"9px 10px",borderRadius:10,border:"1px solid "+S.border,background:"rgba(255,255,255,0.06)",color:S.text,fontSize:12,boxSizing:"border-box"}}/></div>
      </div>
      <button onClick={findMuhurat} disabled={searching} style={{width:"100%",padding:"12px",borderRadius:12,border:"none",background:isPremium?"linear-gradient(90deg,#8B5CF6,#6B4FFF)":"linear-gradient(90deg,"+S.gold+"44,"+S.saffron+"44)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",opacity:searching?0.7:1}}>
        {searching?"⏳ Finding Auspicious Dates...":isPremium?"⭐ Find Muhurat":"⭐ Premium Feature — Upgrade to Find Muhurat"}</button>
    </div>
  );
}

/* — Japa Mala Counter — */
const JAPA_MANTRAS=[
  {id:"gayatri",name:"Gayatri Mantra",text:"ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्",short:"Om Bhur Bhuva Swaha...",deity:"Surya",color:"#FFD700",icon:"☀️",target:108},
  {id:"namahshivaya",name:"Om Namah Shivaya",text:"ॐ नमः शिवाय",short:"Om Namah Shivaya",deity:"Shiva",color:"#8B5CF6",icon:"🔱",target:108},
  {id:"ganesh",name:"Ganesha Mantra",text:"ॐ गं गणपतये नमः",short:"Om Gam Ganapataye Namah",deity:"Ganesha",color:"#FF7040",icon:"🐘",target:108},
  {id:"mahamrityunjaya",name:"Maha Mrityunjaya",text:"ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्",short:"Om Tryambakam...",deity:"Shiva",color:"#6B4FFF",icon:"🌿",target:108},
  {id:"hare_krishna",name:"Hare Krishna Maha Mantra",text:"हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे हरे राम हरे राम राम राम हरे हरे",short:"Hare Krishna Hare Krishna...",deity:"Krishna",color:"#1565C0",icon:"🎭",target:108},
  {id:"durga",name:"Durga Mantra",text:"ॐ दुं दुर्गायै नमः",short:"Om Dum Durgayai Namah",deity:"Durga",color:"#E11D48",icon:"⚔️",target:108},
  {id:"lakshmi",name:"Lakshmi Mantra",text:"ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः",short:"Om Shreem Hreem Kleem...",deity:"Lakshmi",color:"#F02890",icon:"🪷",target:108},
  {id:"soham",name:"So Hum (Breath Mantra)",text:"सो ऽहम्",short:"So Hum — I am That",deity:"Universal",color:"#10B981",icon:"🧘",target:108},
];
function JapaMalaPanel({S,bp,isPremium,onPremium}){
  const[selMantra,setSelMantra]=useState(null);
  const[count,setCount]=useState(0);
  const[malaCount,setMalaCount]=useState(0);
  const[isActive,setIsActive]=useState(false);
  const[totalToday,setTotalToday]=useState(()=>{
    try{const d=JSON.parse(localStorage.getItem("vedanta_japa")||"{}");const td=new Date().toDateString();return d[td]||0;}catch{return 0;}
  });
  const[allTimeTotal,setAllTimeTotal]=useState(()=>{try{return parseInt(localStorage.getItem("vedanta_japa_total")||"0");}catch{return 0;}});
  const saveCount=(n)=>{
    try{
      const td=new Date().toDateString();const d=JSON.parse(localStorage.getItem("vedanta_japa")||"{}");
      d[td]=(d[td]||0)+1;localStorage.setItem("vedanta_japa",JSON.stringify(d));
      const nt=allTimeTotal+1;setAllTimeTotal(nt);localStorage.setItem("vedanta_japa_total",String(nt));
    }catch{}
  };
  const tap=()=>{
    if(!isPremium&&allTimeTotal>=50){onPremium();return;}
    const newCount=count+1;
    setCount(newCount);
    setTotalToday(p=>p+1);
    saveCount(newCount);
    if(newCount>=108){setMalaCount(m=>m+1);setCount(0);}
  };
  const reset=()=>{setCount(0);setMalaCount(0);setIsActive(false);};
  if(!selMantra){return(
    <div>
      <div style={{background:"linear-gradient(135deg,#0A001A,#15002E)",borderRadius:18,padding:"16px 18px",marginBottom:14,border:"1px solid #8B5CF644"}}>
        <h3 style={{color:"#fff",fontSize:15,fontWeight:900,margin:"0 0 3px"}}>📿 Japa Mala Counter</h3>
        <p style={{color:S.muted,fontSize:12,margin:0}}>Digital mala — tap to count your daily mantra japa</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {JAPA_MANTRAS.map(m=>(
          <div key={m.id} onClick={()=>{setSelMantra(m);setCount(0);setMalaCount(0);setIsActive(true);}} style={{background:S.card,borderRadius:14,padding:"12px 10px",border:"1px solid "+S.border,cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:4}}>{m.icon}</div>
            <p style={{color:"#fff",fontSize:11,fontWeight:800,margin:"0 0 2px",lineHeight:1.3}}>{m.name}</p>
            <p style={{color:S.muted,fontSize:10,margin:0}}>{m.deity}</p>
          </div>
        ))}
      </div>
      <div style={{background:S.card,borderRadius:14,padding:"14px 16px",border:"1px solid "+S.border}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><p style={{color:S.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",margin:"0 0 2px"}}>Today's Japa</p>
            <p style={{color:S.gold,fontSize:22,fontWeight:900,margin:0}}>{totalToday} <span style={{fontSize:12,fontWeight:400,color:S.muted}}>chants</span></p>
          </div>
          <div style={{textAlign:"right"}}><p style={{color:S.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",margin:"0 0 2px"}}>All-Time</p>
            <p style={{color:S.saffron,fontSize:22,fontWeight:900,margin:0}}>{allTimeTotal.toLocaleString()}</p>
          </div>
        </div>
        {!isPremium&&<p style={{color:S.muted,fontSize:11,marginTop:8,marginBottom:0}}>Free: 50 taps. <span style={{color:S.gold,fontWeight:700,cursor:"pointer"}} onClick={onPremium}>Upgrade for unlimited ⭐</span></p>}
      </div>
    </div>
  );}
  const m=selMantra;
  const pct=Math.round((count/108)*100);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <button onClick={()=>{setSelMantra(null);reset();}} style={{alignSelf:"flex-start",background:S.card,border:"1px solid "+S.border,color:S.saffron,padding:"7px 14px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:14}}>← Back</button>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:40,marginBottom:6}}>{m.icon}</div>
        <h3 style={{color:"#fff",fontSize:15,fontWeight:900,margin:"0 0 4px"}}>{m.name}</h3>
        <p style={{color:m.color,fontSize:12,fontWeight:700,margin:"0 0 6px"}}>{m.deity}</p>
        <p style={{color:S.muted,fontSize:12,lineHeight:1.6,margin:0}}>{m.text}</p>
      </div>
      {/* Mala ring */}
      <div style={{position:"relative",width:220,height:220,marginBottom:20}}>
        <svg width="220" height="220" style={{position:"absolute",top:0,left:0}}>
          <circle cx="110" cy="110" r="95" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="16"/>
          <circle cx="110" cy="110" r="95" fill="none" stroke={m.color} strokeWidth="16"
            strokeDasharray={`${2*Math.PI*95}`} strokeDashoffset={`${2*Math.PI*95*(1-pct/100)}`}
            strokeLinecap="round" transform="rotate(-90 110 110)" style={{transition:"stroke-dashoffset 0.3s ease"}}/>
        </svg>
        <button onClick={tap} style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:130,height:130,borderRadius:"50%",border:"none",background:"linear-gradient(135deg,"+m.color+"40,"+m.color+"20)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:"0 0 30px "+m.color+"44",transition:"transform 0.1s"}}>
          <span style={{fontSize:40,marginBottom:4}}>{m.icon}</span>
          <span style={{color:"#fff",fontSize:28,fontWeight:900,lineHeight:1}}>{count}</span>
          <span style={{color:S.muted,fontSize:10}}>/ 108</span>
        </button>
      </div>
      {/* Stats row */}
      <div style={{display:"flex",gap:12,marginBottom:16,width:"100%",maxWidth:300}}>
        {[{label:"Malas",val:malaCount,icon:"📿"},{label:"Today",val:totalToday,icon:"☀️"},{label:"All-Time",val:allTimeTotal,icon:"🌟"}].map(s=>(
          <div key={s.label} style={{flex:1,background:S.card,borderRadius:12,padding:"10px 8px",border:"1px solid "+S.border,textAlign:"center"}}>
            <p style={{color:S.muted,fontSize:10,margin:"0 0 2px"}}>{s.icon} {s.label}</p>
            <p style={{color:"#fff",fontSize:16,fontWeight:900,margin:0}}>{s.val}</p>
          </div>
        ))}
      </div>
      <button onClick={reset} style={{padding:"9px 24px",borderRadius:10,border:"1px solid "+S.border,background:"transparent",color:S.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>Reset Mala</button>
      {!isPremium&&allTimeTotal>=40&&<p style={{color:S.gold,fontSize:11,textAlign:"center",marginTop:10}}>You've used {allTimeTotal}/50 free taps. <span style={{fontWeight:700,cursor:"pointer",textDecoration:"underline"}} onClick={onPremium}>Upgrade for unlimited ⭐</span></p>}
    </div>
  );
}

/* — Vedic Numerology Panel — */
const VED_NUM_MEANINGS={
  1:{name:"Surya (Sun)",traits:"Leadership, willpower, ambition, originality",color:"#FFD700",icon:"☀️",deity:"Surya",lucky:"Sunday, 1st, 10th, 19th, 28th",gem:"Ruby",metal:"Gold",mantra:"Om Hraam Hreem Hraum Sah Suryaya Namah"},
  2:{name:"Chandra (Moon)",traits:"Sensitivity, intuition, creativity, diplomacy",color:"#9CA3AF",icon:"🌙",deity:"Chandra",lucky:"Monday, 2nd, 11th, 20th, 29th",gem:"Pearl",metal:"Silver",mantra:"Om Shram Shreem Shraum Sah Chandraya Namah"},
  3:{name:"Guru (Jupiter)",traits:"Wisdom, optimism, abundance, philosophy",color:"#FFD700",icon:"⚡",deity:"Brihaspati",lucky:"Thursday, 3rd, 12th, 21st, 30th",gem:"Yellow Sapphire",metal:"Gold",mantra:"Om Graam Greem Graum Sah Gurave Namah"},
  4:{name:"Rahu (North Node)",traits:"Discipline, practicality, groundedness, tenacity",color:"#6B4FFF",icon:"🌑",deity:"Rahu",lucky:"Saturday, 4th, 13th, 22nd, 31st",gem:"Hessonite (Gomed)",metal:"Iron",mantra:"Om Bhram Bhreem Bhraum Sah Rahave Namah"},
  5:{name:"Budha (Mercury)",traits:"Versatility, communication, quick thinking, travel",color:"#10B981",icon:"🌿",deity:"Budha",lucky:"Wednesday, 5th, 14th, 23rd",gem:"Emerald",metal:"Bronze",mantra:"Om Braam Breem Braum Sah Budhaya Namah"},
  6:{name:"Shukra (Venus)",traits:"Beauty, love, luxury, harmony, artistic gifts",color:"#F02890",icon:"💎",deity:"Shukra",lucky:"Friday, 6th, 15th, 24th",gem:"Diamond",metal:"Silver",mantra:"Om Draam Dreem Draum Sah Shukraya Namah"},
  7:{name:"Ketu (South Node)",traits:"Spirituality, mysticism, introspection, liberation",color:"#8B5CF6",icon:"🐉",deity:"Ketu",lucky:"Monday, 7th, 16th, 25th",gem:"Cat's Eye",metal:"Gold",mantra:"Om Shraam Shreem Shraum Sah Ketave Namah"},
  8:{name:"Shani (Saturn)",traits:"Hard work, karma, discipline, ambition, endurance",color:"#64748B",icon:"💫",deity:"Shani",lucky:"Saturday, 8th, 17th, 26th",gem:"Blue Sapphire",metal:"Iron/Lead",mantra:"Om Praam Preem Praum Sah Shanaye Namah"},
  9:{name:"Mangal (Mars)",traits:"Courage, energy, assertiveness, leadership, passion",color:"#EF4444",icon:"🔴",deity:"Mangala",lucky:"Tuesday, 9th, 18th, 27th",gem:"Red Coral",metal:"Copper",mantra:"Om Kraam Kreem Kraum Sah Bhaumaya Namah"},
};
function reduceNum(n){while(n>9){n=[...String(n)].reduce((a,b)=>a+parseInt(b),0);}return n;}
function getNameNum(name){
  const map={a:1,b:2,c:3,d:4,e:5,f:8,g:3,h:5,i:1,j:1,k:2,l:3,m:4,n:5,o:7,p:8,q:1,r:2,s:3,t:4,u:6,v:6,w:6,x:5,y:1,z:7};
  const sum=[...name.toLowerCase().replace(/[^a-z]/g,"")].reduce((a,c)=>a+(map[c]||0),0);
  return reduceNum(sum);
}
function VedicNumerologyPanel({S,bp,isPremium,onPremium}){
  const[name,setName]=useState("");
  const[dob,setDob]=useState("");
  const[result,setResult]=useState(null);
  const calculate=()=>{
    if(!name||!dob){alert("Enter your full name and date of birth");return;}
    if(!isPremium){onPremium();return;}
    const d=new Date(dob);
    const lifeNum=reduceNum(d.getDate()+d.getMonth()+1+d.getFullYear());
    const birthNum=reduceNum(d.getDate());
    const nameNum=getNameNum(name);
    const destNum=reduceNum([...String(lifeNum)+String(birthNum)+String(nameNum)].reduce((a,b)=>a+parseInt(b),0));
    setResult({lifeNum,birthNum,nameNum,destNum});
  };
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#0A001A,#15002E)",borderRadius:18,padding:"16px 18px",marginBottom:14,border:"1px solid #8B5CF644"}}>
        <h3 style={{color:"#fff",fontSize:15,fontWeight:900,margin:"0 0 3px"}}>🔢 Vedic Numerology</h3>
        <p style={{color:S.muted,fontSize:12,margin:0}}>Discover your Life Path, Birth, Name & Destiny numbers based on Vedic planetary science</p>
      </div>
      <div style={{background:S.card,borderRadius:14,padding:16,marginBottom:14,border:"1px solid "+S.border}}>
        <div style={{marginBottom:10}}><label style={{color:S.muted,fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>FULL NAME</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your full name..." style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid "+S.border,background:"rgba(255,255,255,0.06)",color:S.text,fontSize:13,boxSizing:"border-box"}}/></div>
        <div style={{marginBottom:12}}><label style={{color:S.muted,fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>DATE OF BIRTH</label>
          <input type="date" value={dob} onChange={e=>setDob(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid "+S.border,background:"rgba(255,255,255,0.06)",color:S.text,fontSize:13,boxSizing:"border-box"}}/></div>
        <button onClick={calculate} style={{width:"100%",padding:"11px",borderRadius:12,border:"none",background:isPremium?"linear-gradient(90deg,#8B5CF6,#6B4FFF)":"linear-gradient(90deg,"+S.gold+"44,"+S.saffron+"44)",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer"}}>
          {isPremium?"🔢 Calculate My Numbers":"⭐ Premium Feature — Upgrade to Calculate"}</button>
      </div>
      {result&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[{label:"Life Path Number",num:result.lifeNum,desc:"Your soul's journey and life purpose"},{label:"Birth Number",num:result.birthNum,desc:"Your natural talents and personality"},{label:"Name Number",num:result.nameNum,desc:"Energy your name carries in the world"},{label:"Destiny Number",num:result.destNum,desc:"Your ultimate life mission"}].map(item=>{
            const info=VED_NUM_MEANINGS[item.num]||VED_NUM_MEANINGS[1];
            return(
              <div key={item.label} style={{background:S.card,borderRadius:14,padding:"14px 16px",border:"1px solid "+S.border}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{width:44,height:44,borderRadius:12,background:info.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,border:"1px solid "+info.color+"44",flexShrink:0}}>{item.num}</div>
                  <div>
                    <p style={{color:S.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",margin:"0 0 1px",letterSpacing:0.8}}>{item.label}</p>
                    <p style={{color:info.color,fontSize:13,fontWeight:900,margin:"0 0 1px"}}>{info.icon} {info.name}</p>
                    <p style={{color:S.muted,fontSize:10,margin:0}}>{item.desc}</p>
                  </div>
                </div>
                <p style={{color:S.text,fontSize:12,lineHeight:1.6,margin:"0 0 8px"}}>{info.traits}</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {[{k:"Lucky Days",v:info.lucky},{k:"Gemstone",v:info.gem},{k:"Deity",v:info.deity},{k:"Metal",v:info.metal}].map(x=>(
                    <div key={x.k} style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"7px 9px"}}>
                      <p style={{color:S.muted,fontSize:9,fontWeight:700,textTransform:"uppercase",margin:"0 0 1px"}}>{x.k}</p>
                      <p style={{color:S.text,fontSize:11,fontWeight:700,margin:0}}>{x.v}</p>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:8,background:info.color+"12",borderRadius:8,padding:"7px 10px",border:"1px solid "+info.color+"22"}}>
                  <p style={{color:S.muted,fontSize:9,fontWeight:700,textTransform:"uppercase",margin:"0 0 2px"}}>Recommended Mantra</p>
                  <p style={{color:info.color,fontSize:11,fontWeight:700,margin:0}}>{info.mantra}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* — Sacred Soundscape Panel — */
const SOUNDSCAPES=[
  {id:"bells",icon:"🔔",name:"Temple Bells",desc:"Sacred bell sounds — cleanse energy and awaken consciousness",color:"#FFD700",freqHz:null,loop:true},
  {id:"om",icon:"🕉️",name:"Om Chanting",desc:"108 Om chants — the primordial sound of creation",color:"#8B5CF6",loop:true},
  {id:"gayatri_chant",icon:"☀️",name:"Gayatri Chanting",desc:"Traditional Vedic chanting of the Gayatri Mantra",color:"#FFD700",loop:true},
  {id:"river",icon:"💧",name:"Ganga Soundscape",desc:"Sacred river water sounds — deeply calming and purifying",color:"#0EA5E9",loop:true},
  {id:"rain_temple",icon:"🌧️",name:"Rain on Temple",desc:"Monsoon rain falling on a stone temple — meditative and grounding",color:"#64748B",loop:true},
  {id:"forest",icon:"🌿",name:"Sacred Forest (Vrindavan)",desc:"Birds singing in the sacred forest — Krishna's divine abode",color:"#22C55E",loop:true},
  {id:"binaural_432",icon:"🎵",name:"432 Hz Healing Tone",desc:"Solfeggio 432 Hz — said to align with natural harmonics and Vedic tuning",color:"#A78BFA",freq:432},
  {id:"binaural_528",icon:"💚",name:"528 Hz Miracle Tone",desc:"528 Hz — frequency of transformation, DNA repair and miracles",color:"#10B981",freq:528},
];
const TIMER_OPTIONS=[5,10,15,20,30,45,60];
function SacredSoundscapePanel({S,bp,isPremium,onPremium}){
  const[playing,setPlaying]=useState(null);
  const[timer,setTimer]=useState(10);
  const[timeLeft,setTimeLeft]=useState(null);
  const ctxRef=useRef(null);
  const nodesRef=useRef([]);
  const timerRef=useRef(null);
  const bellTimerRef=useRef(null);

  const stopAll=useCallback(()=>{
    if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}
    if(bellTimerRef.current){clearTimeout(bellTimerRef.current);bellTimerRef.current=null;}
    nodesRef.current.forEach(n=>{try{n.stop?n.stop():n.disconnect();}catch{}});
    nodesRef.current=[];
    if(ctxRef.current){try{ctxRef.current.close();}catch{}ctxRef.current=null;}
    setPlaying(null);setTimeLeft(null);
  },[]);

  useEffect(()=>()=>stopAll(),[]);

  /* ── Audio engine: one function per soundscape ── */
  const buildAudio=(sid,ctx,durationSec)=>{
    const nodes=[];
    const t=ctx.currentTime;
    const master=ctx.createGain();
    master.gain.setValueAtTime(0,t);
    master.gain.linearRampToValueAtTime(0.7,t+1.5);
    master.gain.setValueAtTime(0.7,t+durationSec-2);
    master.gain.linearRampToValueAtTime(0,t+durationSec);
    master.connect(ctx.destination);
    nodes.push(master);

    if(sid==="binaural_432"||sid==="binaural_528"){
      /* Pure healing tone — left ear base, right ear slightly detuned for binaural */
      const freq=sid==="binaural_432"?432:528;
      [0,1.5].forEach((detune,i)=>{
        const osc=ctx.createOscillator();const g=ctx.createGain();const pan=ctx.createStereoPanner();
        osc.type="sine";osc.frequency.value=freq+detune;osc.connect(g);
        g.gain.value=0.35;g.connect(pan);pan.pan.value=i===0?-0.6:0.6;pan.connect(master);
        osc.start(t);osc.stop(t+durationSec);nodes.push(osc);
      });
      return nodes;
    }

    if(sid==="bells"){
      /* Temple bell: schedule repeating decaying sine bursts */
      const BELL_FREQS=[880,1046,1318,1568,783];
      const schedBell=(delay)=>{
        if(!ctxRef.current||ctxRef.current.state==="closed") return;
        const bt=ctxRef.current.currentTime+delay;
        const freq=BELL_FREQS[Math.floor(Math.random()*BELL_FREQS.length)];
        const osc=ctxRef.current.createOscillator();const gain=ctxRef.current.createGain();
        const osc2=ctxRef.current.createOscillator();const g2=ctxRef.current.createGain();
        osc.type="sine";osc.frequency.value=freq;
        osc2.type="sine";osc2.frequency.value=freq*2.756;
        gain.gain.setValueAtTime(0.25,bt);gain.gain.exponentialRampToValueAtTime(0.001,bt+3.5);
        g2.gain.setValueAtTime(0.12,bt);g2.gain.exponentialRampToValueAtTime(0.001,bt+2.2);
        osc.connect(gain);gain.connect(master);
        osc2.connect(g2);g2.connect(master);
        osc.start(bt);osc.stop(bt+3.6);osc2.start(bt);osc2.stop(bt+2.3);
        const nextDelay=3+Math.random()*5;
        bellTimerRef.current=setTimeout(()=>schedBell(0),nextDelay*1000);
      };
      schedBell(0.2);
      return nodes;
    }

    if(sid==="om"||sid==="gayatri_chant"){
      /* Sacred drone: 136 Hz (Om frequency) with harmonics + tremolo */
      const base=sid==="om"?136:256;
      [base,base*2,base*3,base*4].forEach((freq,i)=>{
        const osc=ctx.createOscillator();const g=ctx.createGain();
        osc.type=i===0?"sawtooth":"sine";osc.frequency.value=freq;
        g.gain.value=[0.3,0.15,0.08,0.04][i];
        osc.connect(g);g.connect(master);
        osc.start(t);osc.stop(t+durationSec);nodes.push(osc);
      });
      /* Slow tremolo / vibrato */
      const lfo=ctx.createOscillator();const lfoGain=ctx.createGain();
      lfo.frequency.value=0.25;lfoGain.gain.value=0.05;
      lfo.connect(lfoGain);lfoGain.connect(master.gain);
      lfo.start(t);lfo.stop(t+durationSec);nodes.push(lfo);
      return nodes;
    }

    if(sid==="river"||sid==="rain_temple"||sid==="forest"){
      /* Noise-based ambient: pink noise through filters */
      const bufLen=ctx.sampleRate*4;
      const buf=ctx.createBuffer(2,bufLen,ctx.sampleRate);
      for(let c=0;c<2;c++){
        const data=buf.getChannelData(c);
        let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
        for(let i=0;i<bufLen;i++){
          const w=Math.random()*2-1;
          b0=0.99886*b0+w*0.0555179;b1=0.99332*b1+w*0.0750759;
          b2=0.96900*b2+w*0.1538520;b3=0.86650*b3+w*0.3104856;
          b4=0.55000*b4+w*0.5329522;b5=-0.7616*b5-w*0.0168980;
          data[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)/7;b6=w*0.115926;
        }
      }
      const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;
      const filter=ctx.createBiquadFilter();
      if(sid==="river"){filter.type="bandpass";filter.frequency.value=600;filter.Q.value=0.4;}
      else if(sid==="rain_temple"){filter.type="highpass";filter.frequency.value=1200;filter.Q.value=0.3;}
      else{filter.type="lowpass";filter.frequency.value=800;filter.Q.value=0.5;}
      const g=ctx.createGain();g.gain.value=sid==="rain_temple"?0.5:0.4;
      src.connect(filter);filter.connect(g);g.connect(master);
      src.start(t);nodes.push(src);
      /* Forest: add occasional bird-like chirps */
      if(sid==="forest"){
        const addChirp=(delay)=>{
          if(!ctxRef.current||ctxRef.current.state==="closed") return;
          const ct2=ctxRef.current.currentTime+delay;
          const osc=ctxRef.current.createOscillator();const cg=ctxRef.current.createGain();
          osc.frequency.setValueAtTime(2200+Math.random()*800,ct2);
          osc.frequency.linearRampToValueAtTime(3200+Math.random()*600,ct2+0.1);
          cg.gain.setValueAtTime(0.12,ct2);cg.gain.exponentialRampToValueAtTime(0.001,ct2+0.3);
          osc.connect(cg);cg.connect(master);osc.start(ct2);osc.stop(ct2+0.35);
          const nd=1.5+Math.random()*4;
          bellTimerRef.current=setTimeout(()=>addChirp(0),nd*1000);
        };
        addChirp(0.5);
      }
      return nodes;
    }
    return nodes;
  };

  const startSound=(s)=>{
    if(!isPremium&&s.id!=="bells"&&s.id!=="river"){onPremium();return;}
    stopAll();
    try{
      const ctx=new(window.AudioContext||window.webkitAudioContext)();
      ctxRef.current=ctx;
      const durationSec=timer*60;
      const nodes=buildAudio(s.id,ctx,durationSec);
      nodesRef.current=nodes;
      setPlaying(s.id);
      setTimeLeft(durationSec);
      timerRef.current=setInterval(()=>{
        setTimeLeft(prev=>{if(prev===null||prev<=1){stopAll();return null;}return prev-1;});
      },1000);
    }catch(e){console.warn("Web Audio not supported",e);alert("Your browser does not support Web Audio API. Please try Chrome or Safari.");}
  };
  const fmtTime=(s)=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#0A001A,#15002E)",borderRadius:18,padding:"16px 18px",marginBottom:14,border:"1px solid #8B5CF644"}}>
        <h3 style={{color:"#fff",fontSize:15,fontWeight:900,margin:"0 0 3px"}}>🎵 Sacred Soundscapes</h3>
        <p style={{color:S.muted,fontSize:12,margin:0}}>Healing frequencies, temple bells and divine chanting for meditation and prayer</p>
      </div>
      {/* Timer */}
      <div style={{marginBottom:12}}>
        <p style={{color:S.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,margin:"0 0 7px"}}>Session Timer</p>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {TIMER_OPTIONS.map(t=>(
            <button key={t} onClick={()=>setTimer(t)} style={{padding:"6px 12px",borderRadius:20,border:"1px solid "+(timer===t?S.saffron:S.border),background:timer===t?S.saffron+"22":"transparent",color:timer===t?S.saffron:S.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>{t} min</button>
          ))}
        </div>
      </div>
      {/* Playing indicator */}
      {playing&&timeLeft!==null&&(
        <div style={{background:"linear-gradient(135deg,"+S.saffron+"22,"+S.gold+"11)",borderRadius:14,padding:"12px 16px",marginBottom:12,border:"1px solid "+S.saffron+"44",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#22C55E",animation:"pulse 1.5s infinite"}}/>
            <span style={{color:"#fff",fontSize:13,fontWeight:800}}>{SOUNDSCAPES.find(s=>s.id===playing)?.name}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{color:S.gold,fontSize:14,fontWeight:900}}>{fmtTime(timeLeft)}</span>
            <button onClick={stopAll} style={{background:"rgba(239,68,68,0.2)",border:"1px solid rgba(239,68,68,0.4)",color:"#EF4444",borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>Stop</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {SOUNDSCAPES.map((s,i)=>{
          const isPlaying=playing===s.id;
          const locked=!isPremium&&s.id!=="bells"&&s.id!=="river";
          return(
            <div key={s.id} onClick={()=>isPlaying?stopAll():startSound(s)} style={{background:isPlaying?s.color+"18":S.card,borderRadius:14,padding:"12px 14px",border:"1px solid "+(isPlaying?s.color+"44":S.border),cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:46,height:46,borderRadius:12,background:s.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:"1px solid "+s.color+"33"}}>{s.icon}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <h4 style={{color:"#fff",fontSize:12,fontWeight:800,margin:0}}>{s.name}</h4>
                  {isPlaying&&<span style={{color:"#22C55E",fontSize:10}}>▶ Playing</span>}
                </div>
                <p style={{color:S.muted,fontSize:11,margin:0,lineHeight:1.4}}>{s.desc}</p>
              </div>
              <div style={{flexShrink:0}}>{locked?<span style={{background:S.gold+"22",color:S.gold,fontSize:9,fontWeight:700,padding:"3px 7px",borderRadius:20,border:"1px solid "+S.gold+"44"}}>⭐</span>:isPlaying?<span style={{color:"#EF4444",fontSize:16}}>■</span>:<span style={{color:s.color,fontSize:16}}>▶</span>}</div>
            </div>
          );
        })}
      </div>
      {!isPremium&&<div style={{marginTop:10,background:"rgba(255,192,64,0.08)",borderRadius:12,padding:"11px 14px",border:"1px solid "+S.gold+"33",textAlign:"center"}}>
        <p style={{color:S.gold,fontSize:12,fontWeight:700,margin:"0 0 3px"}}>⭐ Temple Bells & Ganga are free</p>
        <p style={{color:S.muted,fontSize:11,margin:0}}>Upgrade Premium to unlock all 8 sacred soundscapes</p>
      </div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   AI SCREEN
══════════════════════════════════════════════════════ */
function AIScreen({S,bp,T,selectedLocation,lang,user,isPremium,onShowPremium,onRequireLogin}){
  window.__vedantaLang = lang || window.__vedantaLang || "English";
  const[aiSubTab,setAiSubTab]=useState("chat");
  const aiTodayKey=getLocalDateKeyForLocation(selectedLocation);
  const aiPanchang=getLocationPanchang(aiTodayKey,selectedLocation);
  const aiLocation=getLocationMeta(selectedLocation);
  const FREE_MSG_LIMIT=10;
  const[msgs,setMsgs]=useState([{role:"ai",text:`**${T.namaste}** 🙏

I am your Vedanta AI — trained on Vedic knowledge, Panchang, festivals, mantras, and life guidance.

📍 **${aiLocation.label}** · 📅 **${aiPanchang.gregorian}** · **${aiPanchang.hindu}**
✨ Nakshatra: **${aiPanchang.nakshatra.name}**

*Ask anything — festivals, fasting, muhurat, mantras, temple ideas...*`}]);
  const[inp,setInp]=useState("");
  const[loadingV,setLoading]=useState(false);
  const[showTopics,setShowTopics]=useState(false);
  const[qCat,setQCat]=useState("Today");
  const endRef=useRef(null);

  const userMsgCount=msgs.filter(m=>m.role==="user").length;
  const atLimit=!isPremium&&userMsgCount>=FREE_MSG_LIMIT;

  const QUICK_TOPICS={
    "Today":["Give me today's full Vedanta plan","How auspicious is today for important work?","What are today's best times for prayer?","Show me today's panchang details"],
    "Festivals":["When is the next Ekadashi?","What are upcoming sacred dates this month?","Plan my next festival with checklist and fasting rules","What is the most important festival this month?"],
    "Temple":["Suggest 3 temples to visit this weekend","Build a temple trip plan for my city","How does ISKCON observe this festival differently?","What seva opportunities are available at major temples?"],
    "Rituals":["Give me a mantra for today","Fasting companion for next Ekadashi — foods and parana time","Guided Ganesh Puja steps","Puja samagri checklist for next festival"],
    "Muhurat":["Best marriage muhurat 2026","Best dates for griha pravesh this year","Good dates for starting new work or travel","What falls on June 12, 2027? How should I use that day?"],
    "Family":["Family Sankalp plan for next 30 days","Explain the next festival for kids aged 8-12","How to prepare children for their first Navratri fast?","Personalize guidance by city and rashi"],
  };
  const catIcons={"Today":"📅","Festivals":"🪔","Temple":"🛕","Rituals":"🕉️","Muhurat":"⭐","Family":"👨‍👩‍👧"};

  const send=useCallback((text)=>{
    if(!text.trim()) return;
    if(atLimit){ onShowPremium?.(); return; }
    setMsgs(p=>[...p,{role:"user",text}]);
    setInp("");
    setLoading(true);
    setTimeout(()=>{
      const reply=safeGetAIReply(text, selectedLocation, window.__vedantaLang || "English");
      setMsgs(p=>[...p,{role:"ai",text:reply}]);
      setLoading(false);
    },450);
  },[selectedLocation,atLimit,onShowPremium]);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,loadingV]);

  return(
    <div style={{display:"flex",flexDirection:"column",maxWidth:bp==="desktop"?760:"100%",margin:"0 auto"}}>

      {/* Sub-tab navigation — Row 1 */}
      <div style={{display:"flex",gap:5,marginBottom:6,background:S.card,borderRadius:14,padding:5,border:"1px solid "+S.border}}>
        {[{id:"chat",icon:"🤖",label:"AI Chat"},{id:"pandits",icon:"🙏",label:"Pandits"},{id:"puja",icon:"📿",label:"Puja"},{id:"kundali",icon:"🔮",label:"Kundali"}].map(t=>(
          <button key={t.id} onClick={()=>setAiSubTab(t.id)} style={{flex:1,padding:"7px 3px",borderRadius:10,border:"none",background:aiSubTab===t.id?"linear-gradient(135deg,"+S.saffron+","+S.gold+")":"transparent",color:aiSubTab===t.id?"#fff":S.muted,fontSize:10,fontWeight:aiSubTab===t.id?800:600,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:13}}>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>
      {/* Sub-tab navigation — Row 2 */}
      <div style={{display:"flex",gap:5,marginBottom:6,background:S.card,borderRadius:14,padding:5,border:"1px solid "+S.border}}>
        {[{id:"fasting",icon:"🌙",label:"Fasting"},{id:"pilgrimage",icon:"🗺️",label:"Pilgrimage"},{id:"muhurat",icon:"⭐",label:"Muhurat"},{id:"japa",icon:"📿",label:"Japa"}].map(t=>(
          <button key={t.id} onClick={()=>setAiSubTab(t.id)} style={{flex:1,padding:"7px 3px",borderRadius:10,border:"none",background:aiSubTab===t.id?"linear-gradient(135deg,"+S.saffron+","+S.gold+")":"transparent",color:aiSubTab===t.id?"#fff":S.muted,fontSize:10,fontWeight:aiSubTab===t.id?800:600,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:13}}>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>
      {/* Sub-tab navigation — Row 3 */}
      <div style={{display:"flex",gap:5,marginBottom:14,background:S.card,borderRadius:14,padding:5,border:"1px solid "+S.border}}>
        {[{id:"numerology",icon:"🔢",label:"Numerology"},{id:"soundscape",icon:"🎵",label:"Sounds"}].map(t=>(
          <button key={t.id} onClick={()=>setAiSubTab(t.id)} style={{flex:1,padding:"7px 3px",borderRadius:10,border:"none",background:aiSubTab===t.id?"linear-gradient(135deg,"+S.saffron+","+S.gold+")":"transparent",color:aiSubTab===t.id?"#fff":S.muted,fontSize:10,fontWeight:aiSubTab===t.id?800:600,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:13}}>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
        <div style={{flex:3}}/>
      </div>

      {/* Pandit Connect Tab */}
      {aiSubTab==="pandits"&&<PanditConnectPanel S={S} bp={bp} isPremium={isPremium} onPremium={onShowPremium}/>}
      {/* Puja Guide Tab */}
      {aiSubTab==="puja"&&<PujaGuidePanel S={S} bp={bp} isPremium={isPremium} onPremium={onShowPremium}/>}
      {/* Kundali Tab */}
      {aiSubTab==="kundali"&&<KundaliPanel S={S} bp={bp} isPremium={isPremium} onPremium={onShowPremium}/>}
      {/* Fasting Guide Tab */}
      {aiSubTab==="fasting"&&<FastingGuidePanel S={S} bp={bp} isPremium={isPremium} onPremium={onShowPremium}/>}
      {/* Pilgrimage Tracker Tab */}
      {aiSubTab==="pilgrimage"&&<PilgrimageTrackerPanel S={S} bp={bp} isPremium={isPremium} onPremium={onShowPremium}/>}
      {/* Muhurat Finder Tab */}
      {aiSubTab==="muhurat"&&<MuhuratFinderPanel S={S} bp={bp} isPremium={isPremium} onPremium={onShowPremium}/>}
      {/* Japa Mala Counter Tab */}
      {aiSubTab==="japa"&&<JapaMalaPanel S={S} bp={bp} isPremium={isPremium} onPremium={onShowPremium}/>}
      {/* Vedic Numerology Tab */}
      {aiSubTab==="numerology"&&<VedicNumerologyPanel S={S} bp={bp} isPremium={isPremium} onPremium={onShowPremium}/>}
      {/* Sacred Soundscape Tab */}
      {aiSubTab==="soundscape"&&<SacredSoundscapePanel S={S} bp={bp} isPremium={isPremium} onPremium={onShowPremium}/>}

      {/* AI Chat Tab */}
      {aiSubTab==="chat"&&<>

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#100428,#1E0838)",borderRadius:18,padding:"14px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:12,border:"1px solid "+S.sacred+"55",flexWrap:"wrap"}}>
        <div style={{width:44,height:44,borderRadius:14,background:S.sacred+"40",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🤖</div>
        <div style={{flex:1,minWidth:160}}>
          <h2 style={{color:"#FFFFFF",fontSize:15,fontWeight:900,margin:0}}>Vedanta AI Assistant</h2>
          <p style={{color:"rgba(255,255,255,0.55)",fontSize:11,margin:"2px 0 0"}}>Panchang · Festivals · Rituals · Muhurat · Temples</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{background:"rgba(255,192,64,0.15)",borderRadius:10,padding:"5px 11px",border:"1px solid rgba(255,192,64,0.3)"}}>
            <p style={{color:"#FFC040",fontSize:11,fontWeight:800,margin:0}}>📍 {aiLocation.label}</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:S.green,boxShadow:"0 0 6px "+S.green}}/>
            <p style={{color:S.green,fontSize:9,margin:"2px 0 0",fontWeight:700}}>LIVE</p>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{minHeight:300,maxHeight:bp==="mobile"?380:480,overflowY:"auto",marginBottom:10,paddingRight:2}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10}}>
            {m.role==="ai"&&<div style={{width:30,height:30,borderRadius:"50%",background:S.sacred+"40",display:"flex",alignItems:"center",justifyContent:"center",marginRight:8,flexShrink:0,fontSize:14,marginTop:3}}>🤖</div>}
            <div style={{maxWidth:bp==="mobile"?"92%":"80%",padding:"11px 15px",lineHeight:1.65,borderRadius:m.role==="user"?"18px 18px 4px 18px":"4px 18px 18px 18px",background:m.role==="user"?"linear-gradient(135deg,"+S.saffron+",#C04020)":S.surface,border:m.role==="ai"?"1px solid "+S.border:"none",color:m.role==="user"?"#FFFFFF":S.text,fontSize:13}}>
              <div dangerouslySetInnerHTML={{__html:renderMD(m.text)}}/>
            </div>
          </div>
        ))}
        {loadingV&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:S.sacred+"40",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
          <div style={{padding:"10px 16px",background:S.surface,borderRadius:"4px 18px 18px 18px",border:"1px solid "+S.border}}>
            <span style={{color:S.muted,fontSize:22,letterSpacing:6}}>· · ·</span>
          </div>
        </div>}
        <div ref={endRef}/>
      </div>

      {/* Input or limit gate */}
      {atLimit?(
        <PremiumLock S={S} onPremium={onShowPremium} icon="🤖"
          title="You've used your 10 free AI questions"
          desc="Upgrade to Vedanta Premium for unlimited conversations, richer answers, and personalized Vedic guidance."/>
      ):(
        <>
          <div style={{display:"flex",gap:8,marginBottom:5}}>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(inp)}
              placeholder="Ask anything: festivals, mantras, panchang, muhurat, temple ideas..."
              style={{flex:1,padding:"12px 18px",borderRadius:26,border:"1px solid "+S.border,background:S.inputBg,color:S.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
            <button onClick={()=>send(inp)} style={{width:48,height:48,borderRadius:"50%",border:"none",background:"linear-gradient(135deg,"+S.saffron+","+S.gold+")",color:"#FFFFFF",fontSize:18,cursor:"pointer",flexShrink:0}}>➤</button>
          </div>
          {!isPremium&&<p style={{color:S.muted,fontSize:11,textAlign:"center",margin:"0 0 10px"}}>
            {FREE_MSG_LIMIT-userMsgCount} free questions remaining ·{" "}
            <button onClick={()=>onShowPremium?.()} style={{background:"none",border:"none",color:S.saffron,fontSize:11,fontWeight:700,cursor:"pointer",padding:0}}>Upgrade for unlimited ⭐</button>
          </p>}
        </>
      )}

      {/* Quick Topics — collapsible */}
      <div style={{borderRadius:16,border:"1px solid "+S.border,overflow:"hidden",marginTop:4}}>
        <button onClick={()=>setShowTopics(v=>!v)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:S.surface,border:"none",cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:15}}>💡</span>
            <span style={{color:S.text,fontSize:13,fontWeight:800}}>Quick Topics</span>
            <span style={{color:S.muted,fontSize:11,display:bp==="mobile"?"none":"inline"}}>— tap a category, then pick a question</span>
          </div>
          <span style={{color:S.muted,fontSize:14,fontWeight:700,transform:showTopics?"rotate(180deg)":"none",transition:"transform 0.2s",display:"inline-block"}}>▾</span>
        </button>
        {showTopics&&(
          <div style={{padding:"0 14px 14px",background:S.card}}>
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:12,marginTop:12,WebkitOverflowScrolling:"touch"}}>
              {Object.keys(QUICK_TOPICS).map(cat=>(
                <button key={cat} onClick={()=>setQCat(cat)} style={{flexShrink:0,padding:"7px 13px",borderRadius:20,border:"1px solid "+(qCat===cat?S.saffron:S.border),background:qCat===cat?S.saffron:"transparent",color:qCat===cat?"#FFFFFF":S.muted,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s"}}>
                  {catIcons[cat]} {cat}
                </button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:bp==="desktop"?"repeat(2,1fr)":"1fr",gap:7}}>
              {QUICK_TOPICS[qCat].map(q=>(
                <button key={q} onClick={()=>{send(q);setShowTopics(false);}}
                  disabled={atLimit}
                  style={{padding:"10px 14px",borderRadius:12,textAlign:"left",border:"1px solid "+S.border,background:atLimit?S.surface+"80":S.surface,color:atLimit?S.muted:S.text,fontSize:12,lineHeight:1.4,cursor:atLimit?"not-allowed":"pointer",fontWeight:600,opacity:atLimit?0.55:1}}>
                  {q}
                </button>
              ))}
            </div>
            {atLimit&&<p style={{color:S.muted,fontSize:11,textAlign:"center",margin:"10px 0 0"}}>Upgrade to Premium to continue asking questions.</p>}
          </div>
        )}
      </div>
      </>}
    </div>
  );
}
/* ══════════════════════════════════════════════════════
   RITUALS + MANTRAS SCREEN
══════════════════════════════════════════════════════ */
function RitualsScreen({S,bp,T,lang,isPremium,onPremium}){
  const[subTab,setSubTab]=useState("rituals");
  const[active,setActive]=useState(null);
  const[step,setStep]=useState(0);
  const[left,setLeft]=useState(0);
  const[going,setGoing]=useState(false);
  const[manCat,setManCat]=useState("All");
  const[manSearch,setManSearch]=useState("");
  const[copiedId,setCopiedId]=useState(null);
  const[expandedM,setExpandedM]=useState(null);
  const[speakingId,setSpeakingId]=useState(null);
  const[speakingStep,setSpeakingStep]=useState(false);
  const[japaCount,setJapaCount]=useState({});
  const ivRef=useRef(null);

  const toggleStepSpeak=(text)=>{
    if(speakingStep){stopSpeech();setSpeakingStep(false);}
    else{const ok=speakStep(text,()=>setSpeakingStep(false),lang||"English");if(ok)setSpeakingStep(true);}
  };

  const startRitual=r=>{setActive(r);setStep(0);setLeft(r.steps[0].dur);setGoing(false);setSpeakingStep(false);stopSpeech();};
  useEffect(()=>{
    clearInterval(ivRef.current);
    if(going&&left>0) ivRef.current=setInterval(()=>setLeft(t=>{if(t<=1){clearInterval(ivRef.current);return 0;}return t-1;}),1000);
    return()=>clearInterval(ivRef.current);
  },[going,step]);
  const nextStep=()=>{if(!active)return;const n=step+1;if(n<active.steps.length){setStep(n);setLeft(active.steps[n].dur);setGoing(false);stopSpeech();setSpeakingStep(false);}};
  const fmt=s=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
  const pct=active?(1-left/active.steps[step].dur)*100:0;
  const copyM=(id,txt)=>{navigator.clipboard?.writeText(txt);setCopiedId(id);setTimeout(()=>setCopiedId(null),2000);};

  const MANTRA_FREE_LIMIT=3;
  const toggleChant=(m,mIdx)=>{
    if(speakingId===m.id){stopSpeech();setSpeakingId(null);}
    else{
      if(!isPremium&&mIdx>=MANTRA_FREE_LIMIT){onPremium&&onPremium();return;}
      const result=speakMantra(m.devnagari, m.sanskrit, ()=>setSpeakingId(null), lang||"English");
      if(result?.ok) setSpeakingId(m.id);
      else if(result?.reason==="native-voice-unavailable") alert(`Native ${lang} audio voice is not available on this device yet. The app will not reuse another language voice.`);
      else alert("Speech synthesis not supported in this browser.");
    }
  };
  const incrementJapa=(id)=>setJapaCount(p=>({...p,[id]:(p[id]||0)+1}));
  const filteredM=MANTRAS.filter(m=>(manCat==="All"||m.cat===manCat)&&(m.name.toLowerCase().includes(manSearch.toLowerCase())||m.deity.toLowerCase().includes(manSearch.toLowerCase())));

  if(active){
    const s=active.steps[step];
    return(
      <div>
        <button onClick={()=>{setActive(null);setGoing(false);clearInterval(ivRef.current);stopSpeech();setSpeakingStep(false);}} style={{background:S.card,border:"1px solid "+S.border,color:S.saffron,cursor:"pointer",fontSize:14,fontWeight:600,marginBottom:14,padding:"8px 16px",borderRadius:10}}>{T.back}</button>
        <div style={{background:"linear-gradient(145deg,#091A04,#122008)",borderRadius:22,padding:22,marginBottom:14,textAlign:"center",border:"1px solid "+S.green+"40"}}>
          <div style={{fontSize:56,marginBottom:8}}>{active.icon}</div>
          <h2 style={{color:"#FFFFFF",fontSize:20,fontWeight:900,margin:"0 0 3px"}}>{active.name}</h2>
          <p style={{color:S.muted,fontSize:13,margin:"0 0 16px"}}>Step {step+1} of {active.steps.length}</p>
          <div style={{background:S.border,borderRadius:6,height:5,marginBottom:18}}>
            <div style={{width:(step/active.steps.length*100)+"%",background:"linear-gradient(90deg,"+S.saffron+","+S.gold+")",borderRadius:6,height:"100%",transition:"width 0.5s"}}/>
          </div>
          <div style={{position:"relative",width:140,height:140,margin:"0 auto 18px"}}>
            <svg width="140" height="140" style={{transform:"rotate(-90deg)"}}>
              <circle cx="70" cy="70" r="62" fill="none" stroke={S.border} strokeWidth="7"/>
              <circle cx="70" cy="70" r="62" fill="none" stroke={S.saffron} strokeWidth="7" strokeDasharray={2*Math.PI*62} strokeDashoffset={2*Math.PI*62*(1-pct/100)} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.5s"}}/>
            </svg>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
              <div style={{color:"#FFFFFF",fontSize:30,fontWeight:900}}>{fmt(left)}</div>
              <div style={{color:S.muted,fontSize:12}}>remaining</div>
            </div>
          </div>
          <div style={{display:"flex",gap:11,justifyContent:"center"}}>
            <button onClick={()=>setGoing(g=>!g)} style={{padding:"12px 30px",borderRadius:24,border:"none",background:going?S.border:"linear-gradient(90deg,"+S.saffron+","+S.gold+")",color:"#FFFFFF",fontSize:15,fontWeight:700,cursor:"pointer"}}>{going?"⏸ Pause":"▶ Start"}</button>
            {step<active.steps.length-1?<button onClick={nextStep} style={{padding:"12px 24px",borderRadius:24,border:"1px solid "+S.gold,background:"transparent",color:S.gold,fontSize:15,fontWeight:700,cursor:"pointer"}}>Next →</button>:<button onClick={()=>{setActive(null);clearInterval(ivRef.current);}} style={{padding:"12px 24px",borderRadius:24,border:"none",background:S.green,color:"#FFFFFF",fontSize:15,fontWeight:700,cursor:"pointer"}}>{T.complete}</button>}
          </div>
        </div>
        <Card S={S}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <p style={{color:S.gold,fontSize:12,fontWeight:800,margin:0,textTransform:"uppercase"}}>Step {step+1}: {s.title}</p>
            <button onClick={()=>toggleStepSpeak(s.text)} style={{padding:"5px 12px",borderRadius:20,border:"1px solid "+(speakingStep?S.green:S.border),background:speakingStep?S.green+"22":"transparent",color:speakingStep?S.green:S.muted,fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>
              {speakingStep?"⏹ Stop":"🔊 Listen"}
            </button>
          </div>
          <p style={{color:S.text,fontSize:14,lineHeight:1.7,margin:0}}>{s.text}</p>
        </Card>
        <Card S={S}>
          <SecTitle emoji="📋" title="All Steps" S={S}/>
          {active.steps.map((st,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:13,padding:"9px 0",borderBottom:i<active.steps.length-1?"1px solid "+S.border:"none",opacity:i<step?0.45:1}}>
              <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:i<step?S.green:i===step?S.saffron:S.border,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFFFFF",fontSize:12,fontWeight:700}}>{i<step?"✓":i+1}</div>
              <div><p style={{color:i===step?S.saffron:S.text,fontSize:13,fontWeight:i===step?700:500,margin:0}}>{st.title}</p><p style={{color:S.muted,fontSize:13,margin:0}}>{fmt(st.dur)}</p></div>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  return(
    <div>
      <div style={{display:"flex",gap:9,marginBottom:16}}>
        {[["rituals","🕉️ "+T.guidedRituals],["mantras","📿 "+T.mantraLib]].map(([v,l])=>(
          <button key={v} onClick={()=>setSubTab(v)} style={{flex:1,padding:"11px 0",borderRadius:12,border:"1px solid "+(subTab===v?S.saffron:S.border),background:subTab===v?S.saffron:"transparent",color:subTab===v?"#FFFFFF":S.muted,fontSize:14,fontWeight:700,cursor:"pointer"}}>{l}</button>
        ))}
      </div>
      {subTab==="rituals"?(
        <>
          <div style={{background:"linear-gradient(135deg,#06101C,#0E1C2C)",borderRadius:20,padding:"20px 18px",marginBottom:14,border:"1px solid "+S.blue+"30"}}>
            <h2 style={{color:"#FFFFFF",fontSize:20,fontWeight:900,margin:"0 0 5px"}}>Guided Ritual Library 🕉️</h2>
            <p style={{color:"rgba(255,255,255,0.65)",fontSize:13,margin:0}}>Step-by-step guidance with countdown timer</p>
          </div>
          <div style={{display:bp==="desktop"?"grid":"flex",gridTemplateColumns:"1fr 1fr",flexDirection:"column",gap:14}}>
            {RITUALS.map(r=>(
              <Card key={r.id} S={S}>
                <div style={{display:"flex",gap:14}}>
                  <div style={{fontSize:44,flexShrink:0,lineHeight:1}}>{r.icon}</div>
                  <div style={{flex:1}}>
                    <h3 style={{color:S.text,fontSize:16,fontWeight:800,margin:"0 0 3px"}}>{r.name}</h3>
                    <p style={{color:S.muted,fontSize:12,margin:"0 0 9px"}}>{r.subtitle}</p>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:9}}>
                      <Badge label={"⏱ "+r.duration} color={S.saffron}/>
                      <Badge label={"🙏 "+r.deity} color={S.sacred}/>
                      <Badge label={r.difficulty} color={S.gold}/>
                    </div>
                    <div style={{background:"rgba(61,220,132,0.08)",borderRadius:9,padding:"7px 11px",marginBottom:11,borderLeft:"2px solid "+S.green}}>
                      <p style={{color:S.green,fontSize:12,margin:0,fontWeight:600}}>✨ {r.benefits}</p>
                      <p style={{color:S.muted,fontSize:13,margin:"3px 0 0"}}>💡 {r.todayNote}</p>
                    </div>
                    <button onClick={()=>startRitual(r)} style={{width:"100%",padding:"11px 0",borderRadius:12,border:"none",background:"linear-gradient(90deg,"+S.saffron+","+S.gold+")",color:"#FFFFFF",fontSize:14,fontWeight:700,cursor:"pointer"}}>▶ {T.beginRitual} ({r.steps.length} steps)</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ):(
        <>
          <div style={{background:"linear-gradient(135deg,#0C0820,#1A0C30)",borderRadius:20,padding:"20px 18px",marginBottom:14,border:"1px solid "+S.sacred+"30"}}>
            <h2 style={{color:"#FFFFFF",fontSize:20,fontWeight:900,margin:"0 0 5px"}}>{T.mantraLib} 📿</h2>
            <p style={{color:"rgba(255,255,255,0.65)",fontSize:13,margin:0}}>{MANTRAS.length} sacred mantras with Sanskrit, sound, meaning and guidance</p>
          </div>
          <Card S={S} style={{background:"linear-gradient(135deg,rgba(91,164,245,0.10),rgba(61,220,132,0.08))",marginBottom:12}}>
            <p style={{color:S.text,fontSize:13,fontWeight:800,margin:"0 0 4px"}}>Language and audio sync</p>
            <p style={{color:S.muted,fontSize:12,lineHeight:1.6,margin:0}}>Text and chant audio now follow the selected app language. Audio label: <strong>{getAudioStatusLabel(lang)}</strong>. When a native voice is unavailable, the app stops instead of reusing the wrong language audio.</p>
          </Card>
          <div style={{position:"relative",marginBottom:12}}>
            <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:17}}>🔍</span>
            <input value={manSearch} onChange={e=>setManSearch(e.target.value)} placeholder={T.search}
              style={{width:"100%",padding:"11px 14px 11px 42px",borderRadius:24,border:"1px solid "+S.border,background:S.inputBg,color:S.text,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
          </div>
          <div style={{display:"flex",gap:7,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
            {MANTRA_CATS.map(c=><button key={c} onClick={()=>setManCat(c)} style={{padding:"6px 14px",borderRadius:20,whiteSpace:"nowrap",border:manCat===c?"none":"1px solid "+S.border,background:manCat===c?S.sacred:"transparent",color:manCat===c?"#FFFFFF":S.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{c}</button>)}
          </div>
          <div style={{display:bp==="desktop"?"grid":"flex",gridTemplateColumns:"1fr 1fr",flexDirection:"column",gap:12}}>
            {filteredM.map((m,mIdx)=>{
              const jCount=japaCount[m.id]||0;
              const speaking=speakingId===m.id;
              return(
                <Card key={m.id} S={S}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:11}}>
                    <div style={{width:46,height:46,borderRadius:13,background:m.color+"28",border:"1px solid "+m.color+"55",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{m.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                        <div><p style={{color:S.text,fontSize:14,fontWeight:800,margin:0}}>{m.name}</p><p style={{color:m.color,fontSize:12,margin:"2px 0 0",fontWeight:600}}>{m.deity}</p></div>
                        <div style={{display:"flex",gap:5,flexShrink:0}}>
                          <button onClick={()=>toggleChant(m,mIdx)} style={{padding:"5px 10px",borderRadius:8,border:"1px solid "+((!isPremium&&mIdx>=3)?S.gold:speaking?m.color:S.border),background:(!isPremium&&mIdx>=3)?"rgba(255,192,64,0.1)":speaking?m.color+"22":"transparent",color:(!isPremium&&mIdx>=3)?S.gold:speaking?m.color:S.muted,fontSize:13,cursor:"pointer",fontWeight:700}}>{(!isPremium&&mIdx>=3)?"⭐":speaking?T.stop:T.chant}</button>
                          <button onClick={()=>copyM(m.id,getMantraDisplayText(m,lang))} style={{padding:"5px 10px",borderRadius:8,border:"1px solid "+S.border,background:"transparent",color:copiedId===m.id?S.green:S.muted,fontSize:13,cursor:"pointer",fontWeight:600}}>{copiedId===m.id?T.copied:T.copy}</button>
                          <button onClick={()=>setExpandedM(expandedM===m.id?null:m.id)} style={{padding:"5px 10px",borderRadius:8,border:"1px solid "+S.border,background:"transparent",color:S.muted,fontSize:13,cursor:"pointer"}}>{expandedM===m.id?"▲":"▼"}</button>
                        </div>
                      </div>
                      <div style={{background:"rgba(255,192,64,0.08)",borderRadius:9,padding:"9px 11px",margin:"9px 0 7px",borderLeft:"2px solid "+m.color}}>
                        <p style={{color:m.color,fontSize:14,margin:0,lineHeight:1.65,fontFamily:"serif"}}>{getMantraDisplayText(m,lang)}</p>
                      </div>
                      <p style={{color:S.muted,fontSize:12,margin:"0 0 7px",fontStyle:"italic",lineHeight:1.45}}>{(lang==="English"||lang==="Tamil"||lang==="Telugu") ? m.meaning : m.sanskrit.slice(0,90)+(m.sanskrit.length>90?"...":"") }</p>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}><Badge label={m.chants+"×"} color={m.color}/><Badge label={m.bestTime} color={S.gold}/><Badge label={getAudioStatusLabel(lang)} color={S.blue}/></div>
                        {/* Japa counter */}
                        <div style={{display:"flex",alignItems:"center",gap:7,background:S.border+"66",borderRadius:20,padding:"3px 8px"}}>
                          <span style={{color:S.muted,fontSize:13}}>Japa:</span>
                          <span style={{color:m.color,fontSize:13,fontWeight:800,minWidth:24,textAlign:"center"}}>{jCount}</span>
                          <button onClick={()=>incrementJapa(m.id)} style={{width:22,height:22,borderRadius:"50%",border:"none",background:m.color,color:"#FFFFFF",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,lineHeight:1}}>+</button>
                          <button onClick={()=>setJapaCount(p=>({...p,[m.id]:0}))} style={{background:"none",border:"none",color:S.muted,fontSize:12,cursor:"pointer",padding:0}}>↺</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedM===m.id&&(
                    <div style={{marginTop:13,padding:13,background:"rgba(0,0,0,0.2)",borderRadius:11,borderTop:"1px solid "+S.border}}>
                      <p style={{color:S.gold,fontSize:13,fontWeight:800,margin:"0 0 5px",textTransform:"uppercase"}}>Full Transliteration</p>
                      <p style={{color:S.text,fontSize:13,margin:"0 0 11px",lineHeight:1.7,fontStyle:"italic"}}>{m.sanskrit}</p>
                      <p style={{color:S.gold,fontSize:13,fontWeight:800,margin:"0 0 5px",textTransform:"uppercase"}}>Meaning</p>
                      <p style={{color:S.text,fontSize:13,margin:"0 0 11px",lineHeight:1.6}}>{m.meaning}</p>
                      <p style={{color:S.gold,fontSize:13,fontWeight:800,margin:"0 0 5px",textTransform:"uppercase"}}>Benefits</p>
                      <p style={{color:S.green,fontSize:13,margin:"0 0 13px",fontWeight:600}}>{m.benefits}</p>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={()=>toggleChant(m,mIdx)} style={{flex:1,padding:"10px 0",borderRadius:10,border:"1px solid "+((!isPremium&&mIdx>=3)?S.gold:m.color),background:speaking?m.color:(!isPremium&&mIdx>=3)?"rgba(255,192,64,0.08)":"transparent",color:speaking?"#FFFFFF":(!isPremium&&mIdx>=3)?S.gold:m.color,fontSize:13,fontWeight:700,cursor:"pointer"}}>{(!isPremium&&mIdx>=3)?"⭐ Premium":speaking?T.stop:T.chant}</button>
                        <button onClick={()=>copyM(m.id,getMantraDisplayText(m,lang)+"\n\n"+m.sanskrit+"\n\nMeaning: "+m.meaning+"\nBenefits: "+m.benefits)} style={{flex:1,padding:"10px 0",borderRadius:10,border:"1px solid "+S.border,background:"transparent",color:S.muted,fontSize:13,fontWeight:700,cursor:"pointer"}}>{copiedId===m.id?T.copied:"📋 Copy All"}</button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          {filteredM.length===0&&<p style={{color:S.muted,textAlign:"center",padding:28,fontSize:14}}>No mantras found.</p>}
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TRACKER SCREEN
══════════════════════════════════════════════════════ */
function TrackerScreen({S,bp,T,user,isPremium,onPremium}){
  /* ── localStorage helpers ── */
  const habitKey  = u => u ? "dc_habits_"+u.email  : null;
  const doneKey   = u => u ? "dc_done_"+u.email+"_"+new Date().toDateString() : null;
  const metaKey   = u => u ? "dc_meta_"+u.email    : null;

  const loadHabits = u => {
    if(!u) return INIT_HABITS.map(h=>({...h}));
    try{ const s=localStorage.getItem(habitKey(u)); if(s) return JSON.parse(s); }catch(e){}
    return INIT_HABITS.map(h=>({...h}));
  };
  const loadDone = u => {
    if(!u) return new Set();
    try{ const s=localStorage.getItem(doneKey(u)); if(s) return new Set(JSON.parse(s)); }catch(e){}
    return new Set();
  };
  const loadMeta = u => {
    if(!u) return null;
    try{ const s=localStorage.getItem(metaKey(u)); if(s) return JSON.parse(s); }catch(e){}
    return null;
  };

  const[habits,setHabits]=useState(()=>loadHabits(user));
  const[done,setDone]=useState(()=>loadDone(user));
  const[adding,setAdding]=useState(false);
  const[newName,setNewName]=useState("");
  const[editingGoal,setEditingGoal]=useState(null);
  const[tempGoal,setTempGoal]=useState("");
  const[lastMeta,setLastMeta]=useState(()=>loadMeta(user));

  /* Reload when user logs in/out */
  const prevUserRef=useRef(user);
  useEffect(()=>{
    if(prevUserRef.current===user) return;
    prevUserRef.current=user;
    setHabits(loadHabits(user));
    setDone(loadDone(user));
    setLastMeta(loadMeta(user));
  },[user]);

  /* Save habits to localStorage whenever they change */
  useEffect(()=>{
    if(!user) return;
    try{
      localStorage.setItem(habitKey(user),JSON.stringify(habits));
      const total=habits.reduce((a,h)=>a+h.streak,0);
      const maxS=habits.length?Math.max(...habits.map(h=>h.streak)):0;
      localStorage.setItem(metaKey(user),JSON.stringify({
        lastDate:new Date().toDateString(),
        totalStreak:total,
        bestStreak:maxS,
        loggedCount:habits.filter(h=>h.streak>0).length,
      }));
    }catch(e){}
  },[habits,user]);

  /* Save today's done set */
  useEffect(()=>{
    if(!user) return;
    try{ localStorage.setItem(doneKey(user),JSON.stringify([...done])); }catch(e){}
  },[done,user]);

  const log=id=>{
    if(done.has(id))return;
    setDone(p=>new Set([...p,id]));
    setHabits(p=>p.map(h=>h.id===id?{...h,streak:h.streak+1,logs:[...h.logs.slice(1),1]}:h));
  };
  const resetHabit=id=>{
    setHabits(p=>p.map(h=>h.id===id?{...h,streak:0,logs:Array(12).fill(0)}:h));
    setDone(p=>{const n=new Set(p);n.delete(id);return n;});
  };
  const resetAll=()=>{setHabits(INIT_HABITS.map(h=>({...h}))); setDone(new Set());};

  const startGoalEdit=(h)=>{setEditingGoal(h.id);setTempGoal(String(h.goal));};
  const saveGoal=(id)=>{
    const v=parseInt(tempGoal);
    if(v>0)setHabits(p=>p.map(h=>h.id===id?{...h,goal:v}:h));
    setEditingGoal(null);
  };

  const addHabit=()=>{
    if(!newName.trim())return;
    const cols=["#8855FF","#FF7040","#3DDC84","#FFC040","#F02890","#5BA4F5"];
    const icons=["🧘","📿","🪔","📖","🌸","🌙","🎵","🙏"];
    setHabits(p=>[...p,{id:Date.now(),name:newName,icon:icons[p.length%icons.length],streak:0,goal:21,category:"Custom",color:cols[p.length%cols.length],logs:Array(12).fill(0)}]);
    setNewName("");setAdding(false);
  };

  const total=habits.reduce((a,h)=>a+h.streak,0);
  const maxS=habits.length?Math.max(...habits.map(h=>h.streak)):0;

  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#0C0820,#160C30)",borderRadius:20,padding:"20px 18px",marginBottom:16,border:"1px solid "+S.sacred+"30",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <h2 style={{color:"#FFFFFF",fontSize:20,fontWeight:900,margin:"0 0 5px"}}>{T.trackerTitle||T.tracker} 🔥</h2>
          <p style={{color:"rgba(255,255,255,0.65)",fontSize:13,margin:0}}>
            {user ? "Logged in as "+user.name.split(" ")[0]+" · data saved automatically" : "Build lasting dharmic habits — Track your streaks"}
          </p>
        </div>
        <button onClick={resetAll}
          style={{padding:"8px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.8)",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,marginTop:2}}>
          🔄 Reset All
        </button>
      </div>

      {/* Welcome-back banner: shown when user logs in and has previous activity */}
      {user&&lastMeta&&lastMeta.totalStreak>0&&(
        <div style={{background:"linear-gradient(90deg,rgba(61,220,132,0.12),rgba(136,85,255,0.12))",border:"1px solid "+S.green+"55",borderRadius:14,padding:"13px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:28,flexShrink:0}}>🙏</div>
          <div style={{flex:1}}>
            <p style={{color:S.green,fontSize:13,fontWeight:800,margin:"0 0 2px"}}>Welcome back, {user.name.split(" ")[0]}!</p>
            <p style={{color:S.text,fontSize:13,margin:0}}>
              Your progress has been restored — last active <strong>{lastMeta.lastDate}</strong>.
              {" "}Total streak: <strong style={{color:S.saffron}}>{lastMeta.totalStreak} days 🔥</strong>,
              best run: <strong style={{color:S.gold}}>{lastMeta.bestStreak} days ⭐</strong>
            </p>
          </div>
        </div>
      )}

      {/* Nudge to log in to save data */}
      {!user&&(
        <div style={{background:"rgba(136,85,255,0.08)",border:"1px dashed "+S.sacred+"55",borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>💾</span>
          <p style={{color:S.muted,fontSize:13,margin:0}}>
            <strong style={{color:S.sacred}}>Sign in</strong> to save your tracker progress and restore it next time you visit.
          </p>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:11,marginBottom:16}}>
        {[{label:T.totalDays,v:total,icon:"🔥",c:S.saffron},{label:T.bestStreak,v:maxS,icon:"⭐",c:S.gold},{label:T.loggedToday,v:done.size,icon:"✅",c:S.green}].map(s=>(
          <div key={s.label} style={{background:S.card,border:"1px solid "+S.border,borderRadius:15,padding:"14px 10px",textAlign:"center"}}>
            <div style={{fontSize:24}}>{s.icon}</div>
            <div style={{color:s.c,fontSize:26,fontWeight:900}}>{s.v}</div>
            <div style={{color:S.muted,fontSize:11,marginTop:3,lineHeight:1.3}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{display:bp==="desktop"?"grid":"flex",gridTemplateColumns:"1fr 1fr",flexDirection:"column",gap:12}}>
        {habits.map(h=>{
          const pct=Math.min(100,h.streak/h.goal*100),logged=done.has(h.id);
          return(
            <Card key={h.id} S={S}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{fontSize:36,flexShrink:0,marginTop:2}}>{h.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <p style={{color:S.text,fontSize:14,fontWeight:700,margin:0}}>{h.name}</p>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:3}}><span>🔥</span><span style={{color:S.saffron,fontSize:16,fontWeight:900}}>{h.streak}</span></div>
                      <button onClick={()=>resetHabit(h.id)} title="Reset this practice"
                        style={{background:"none",border:"1px solid "+S.border,borderRadius:8,color:S.muted,fontSize:11,cursor:"pointer",padding:"2px 7px",fontWeight:600,flexShrink:0}}>↺</button>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,margin:"0 0 9px"}}>
                    <Badge label={h.category} color={h.color}/>
                    {/* Editable goal */}
                    {editingGoal===h.id?(
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <span style={{color:S.muted,fontSize:12}}>{T.goal}:</span>
                        <input autoFocus value={tempGoal} onChange={e=>setTempGoal(e.target.value)}
                          onKeyDown={e=>{if(e.key==="Enter")saveGoal(h.id);if(e.key==="Escape")setEditingGoal(null);}}
                          style={{width:52,padding:"2px 6px",borderRadius:6,border:"1px solid "+S.saffron,background:S.inputBg,color:S.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                        <button onClick={()=>saveGoal(h.id)} style={{background:S.saffron,border:"none",borderRadius:6,color:"#FFF",fontSize:11,cursor:"pointer",padding:"2px 7px",fontWeight:700}}>✓</button>
                      </div>
                    ):(
                      <button onClick={()=>startGoalEdit(h)} title="Tap to edit goal"
                        style={{background:"none",border:"none",color:S.muted,fontSize:13,cursor:"pointer",padding:0,fontWeight:500,textDecoration:"underline dotted",textUnderlineOffset:3}}>
                        {T.goal}: {h.goal}
                      </button>
                    )}
                  </div>
                  {/* Progress bar */}
                  <div style={{background:S.border,borderRadius:5,height:6,marginBottom:9}}>
                    <div style={{width:pct+"%",height:"100%",borderRadius:5,background:"linear-gradient(90deg,"+h.color+","+h.color+"AA)",transition:"width 0.5s"}}/>
                  </div>
                  {/* Activity dots — last 12 + today */}
                  <div style={{display:"flex",gap:3,flexWrap:"wrap",alignItems:"center"}}>
                    {h.logs.map((l,i)=><div key={i} style={{width:13,height:13,borderRadius:"50%",background:l?h.color:S.border}}/>)}
                    <div style={{width:13,height:13,borderRadius:"50%",background:logged?h.color:"transparent",border:"2px solid "+(logged?h.color:S.saffron)}} title="Today"/>
                    <span style={{color:S.muted,fontSize:11,marginLeft:2}}>{h.streak}/{h.goal} days</span>
                  </div>
                </div>
                {/* Log button */}
                <button onClick={()=>log(h.id)} disabled={logged}
                  style={{padding:"9px 13px",borderRadius:11,flexShrink:0,border:logged?"none":"1px solid "+S.saffron,background:logged?S.green:"transparent",color:logged?"#FFFFFF":S.saffron,fontSize:12,fontWeight:700,cursor:logged?"default":"pointer",marginTop:4}}>
                  {logged?T.done:T.logHabit}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
      {adding?(
        <div style={{border:"1px solid "+S.border,borderRadius:14,padding:16,background:S.card,marginTop:4}}>
          <p style={{color:S.text,fontSize:13,fontWeight:700,margin:"0 0 10px"}}>New Spiritual Practice</p>
          <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addHabit()} placeholder="e.g. Evening Shloka, Pranayama..." autoFocus
            style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid "+S.border,background:S.inputBg,color:S.text,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit",marginBottom:10}}/>
          <div style={{display:"flex",gap:8}}>
            <button onClick={addHabit} style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:S.saffron,color:"#FFFFFF",fontSize:13,fontWeight:700,cursor:"pointer"}}>Add Practice</button>
            <button onClick={()=>setAdding(false)} style={{flex:1,padding:"10px",borderRadius:10,border:"1px solid "+S.border,background:"transparent",color:S.muted,fontSize:13,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      ):(
        habits.length>=6&&!isPremium?(
          <PremiumLock S={S} onPremium={onPremium} icon="🧘"
            title="Add unlimited custom practices"
            desc={"You have "+habits.length+" practices. Upgrade to Vedanta Premium to create unlimited custom spiritual habits and track your complete dharmic journey."}/>
        ):(
          <div onClick={()=>setAdding(true)} style={{border:"2px dashed "+S.border,borderRadius:14,padding:18,textAlign:"center",cursor:"pointer",color:S.muted,fontSize:14,marginTop:4}}>{T.addPractice}</div>
        )
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PROFILE SCREEN
══════════════════════════════════════════════════════ */
function ProfileScreen({S,bp,T,theme,setTheme,lang,setLang,user,onLogin,onLogout,onPremium,isPremium}){
  const[region,setRegion]=useState("North India");
  const[toggles,setToggles]=useState({festivalReminders:true,dailyPanchang:true,fastingAlerts:true,googleCal:false,appleCal:false});
  const[birthDate,setBirthDate]=useState("");
  const[nakshatra,setNakshatra]=useState(null);
  const[calNote,setCalNote]=useState("");
  const[selectedRashi,setSelectedRashi]=useState(null);
  const[showRashiPicker,setShowRashiPicker]=useState(false);
  const tog=k=>{
    if((k==="googleCal"||k==="appleCal")&&!toggles[k]){setCalNote("Use the Calendar tab → 'Add to Calendar' to add festivals.");setTimeout(()=>setCalNote(""),5000);}
    setToggles(p=>({...p,[k]:!p[k]}));
  };
  return(
    <div>
      <div style={{background:S.heroGrad,borderRadius:22,padding:22,marginBottom:16,textAlign:"center",border:"1px solid rgba(140,80,255,0.25)"}}>
        <div style={{width:84,height:84,borderRadius:"50%",background:"linear-gradient(135deg,"+S.saffron+","+S.gold+")",margin:"0 auto 13px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:42}}>🧘</div>
        <h2 style={{color:"#FFFFFF",fontSize:19,fontWeight:900,margin:"0 0 3px"}}>{user?user.name:"Dharmic Devotee"}</h2>
        <p style={{color:"rgba(255,255,255,0.6)",fontSize:13,margin:"0 0 8px"}}>{user?user.email:"Sign in to save your progress"}</p>
        {!user?<button onClick={onLogin} style={{padding:"9px 22px",borderRadius:20,border:"none",background:"linear-gradient(90deg,"+S.saffron+","+S.gold+")",color:"#FFFFFF",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:12}}>🔐 Sign In / Create Account</button>
        :<button onClick={onLogout} style={{padding:"9px 22px",borderRadius:20,border:"1px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.8)",fontSize:12,cursor:"pointer",marginBottom:12}}>Sign Out</button>}
        <p style={{color:"rgba(255,255,255,0.55)",fontSize:13,margin:"0 0 16px"}}>Spiritual Journey — Vikram Samvat 2082</p>
        <div style={{display:"flex",justifyContent:"center",gap:28}}>
          {[{label:"Days Active",v:"42"},{label:"Rituals Done",v:"23"},{label:"Streak",v:"12🔥"}].map(s=>(
            <div key={s.label} style={{textAlign:"center"}}><div style={{color:S.gold,fontSize:22,fontWeight:900}}>{s.v}</div><div style={{color:"rgba(255,255,255,0.6)",fontSize:13}}>{s.label}</div></div>
          ))}
        </div>
      </div>
      {calNote&&<div style={{background:"rgba(61,220,132,0.12)",border:"1px solid "+S.green+"55",borderRadius:12,padding:"12px 16px",marginBottom:14}}><p style={{color:S.green,fontSize:13,margin:0,fontWeight:600}}>✅ {calNote}</p></div>}
      {/* Rashi Widget */}
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <h3 style={{color:S.text,fontSize:16,fontWeight:800,margin:0}}>⭐ Your Rashi (Zodiac)</h3>
          <button onClick={()=>setShowRashiPicker(p=>!p)} style={{padding:"6px 14px",borderRadius:20,border:"1px solid "+S.sacred,background:"transparent",color:S.sacred,fontSize:12,fontWeight:700,cursor:"pointer"}}>{selectedRashi?"Change":"Select Rashi"}</button>
        </div>
        {showRashiPicker&&(
          <div style={{background:S.card,borderRadius:16,padding:"14px",border:"1px solid "+S.border,marginBottom:10}}>
            <p style={{color:S.muted,fontSize:12,fontWeight:700,margin:"0 0 10px",textTransform:"uppercase",letterSpacing:0.8}}>Select your Moon sign (Rashi)</p>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {RASHIS.map(r=>(
                <button key={r.id} onClick={()=>{setSelectedRashi(r);setShowRashiPicker(false);}} style={{padding:"7px 13px",borderRadius:12,border:"1px solid "+(selectedRashi?.id===r.id?S.sacred:S.border),background:selectedRashi?.id===r.id?S.sacred+"22":"transparent",color:selectedRashi?.id===r.id?S.sacred:S.text,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                  {r.symbol} {r.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {selectedRashi&&!showRashiPicker&&(
          <div style={{background:"linear-gradient(135deg,"+S.sacred+"18,"+S.sacred+"08)",borderRadius:18,padding:"18px 20px",border:"1px solid "+S.sacred+"44"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
              <div style={{width:60,height:60,borderRadius:16,background:S.sacred+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0}}>{selectedRashi.symbol}</div>
              <div>
                <h3 style={{color:S.sacred,fontSize:20,fontWeight:900,margin:"0 0 2px"}}>{selectedRashi.name} ({selectedRashi.english})</h3>
                <p style={{color:S.muted,fontSize:12,margin:0}}>Lord: {selectedRashi.lord} · {selectedRashi.element} sign · {selectedRashi.day}s</p>
              </div>
            </div>
            <div style={{background:"rgba(255,255,255,0.06)",borderRadius:13,padding:"13px 15px",marginBottom:10,borderLeft:"3px solid "+S.sacred}}>
              <p style={{color:S.gold,fontSize:12,fontWeight:800,textTransform:"uppercase",letterSpacing:0.8,margin:"0 0 5px"}}>Today's Rashi Summary</p>
              <p style={{color:S.text,fontSize:13,lineHeight:1.65,margin:0}}>{selectedRashi.daily}</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
              {[{k:"Core Traits",v:selectedRashi.quality},{k:"Lucky Colors",v:selectedRashi.lucky},{k:"Lucky Stone",v:selectedRashi.stone},{k:"Auspicious Day",v:selectedRashi.day+"s"}].map(x=>(
                <div key={x.k} style={{background:S.card,borderRadius:11,padding:"11px 13px",border:"1px solid "+S.border}}>
                  <p style={{color:S.muted,fontSize:12,fontWeight:700,textTransform:"uppercase",margin:"0 0 3px",letterSpacing:0.5}}>{x.k}</p>
                  <p style={{color:S.text,fontSize:12,fontWeight:700,margin:0}}>{x.v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {!selectedRashi&&!showRashiPicker&&(
          <div onClick={()=>setShowRashiPicker(true)} style={{border:"2px dashed "+S.border,borderRadius:14,padding:"20px",textAlign:"center",cursor:"pointer",color:S.muted}}>
            <div style={{fontSize:32,marginBottom:6}}>⭐</div>
            <p style={{fontSize:13,fontWeight:700,margin:"0 0 3px",color:S.text}}>Select Your Rashi</p>
            <p style={{fontSize:12,margin:0}}>Get daily Rashi summary, lucky colors, and guidance</p>
          </div>
        )}
      </div>
      <div style={{display:bp==="desktop"?"grid":"block",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          <Card S={S} style={{border:"1px solid "+S.sacred+"55"}}>
            <SecTitle emoji="⭐" title={T.birthCalc} S={S}/>
            <p style={{color:S.muted,fontSize:13,margin:"0 0 13px",lineHeight:1.55}}>Enter your date of birth to discover your Janma Nakshatra.</p>
            <div style={{display:"flex",gap:8,marginBottom:13}}>
              <input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)}
                style={{flex:1,padding:"11px 13px",borderRadius:11,border:"1px solid "+S.border,background:S.inputBg,color:S.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              <button onClick={()=>setNakshatra(getBirthNakshatra(birthDate))} style={{padding:"11px 18px",borderRadius:11,border:"none",background:S.sacred,color:"#FFFFFF",fontSize:14,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{T.findNakshatra}</button>
            </div>
            {nakshatra&&(
              <div style={{background:"linear-gradient(135deg,"+S.sacred+"20,"+S.sacred+"0A)",borderRadius:14,padding:16,border:"1px solid "+S.sacred+"55"}}>
                <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:12}}>
                  <div style={{fontSize:40}}>⭐</div>
                  <div><p style={{color:S.sacred,fontSize:20,fontWeight:900,margin:0}}>{nakshatra.name}</p><p style={{color:S.muted,fontSize:12,margin:"2px 0 0"}}>Your Janma Nakshatra</p></div>
                </div>
                {[{k:"Ruling Lord",v:nakshatra.lord},{k:"Deity",v:nakshatra.deity},{k:"Symbol",v:nakshatra.symbol},{k:"Core Qualities",v:nakshatra.qualities},{k:"Element",v:nakshatra.element},{k:"Lucky Stone",v:nakshatra.stone}].map(x=>(
                  <div key={x.k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid "+S.border}}>
                    <span style={{color:S.muted,fontSize:12}}>{x.k}</span>
                    <span style={{color:S.text,fontSize:12,fontWeight:700}}>{x.v}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card S={S}><SecTitle emoji="🎨" title={T.appearance} S={S}/>
            <div style={{display:"flex",gap:9}}>
              {[["dark",T.darkMode],["light",T.lightMode]].map(([v,l])=>(
                <button key={v} onClick={()=>setTheme(v)} style={{flex:1,padding:"11px 0",borderRadius:12,border:"1px solid "+(theme===v?S.saffron:S.border),background:theme===v?S.saffron:"transparent",color:theme===v?"#FFFFFF":S.muted,fontSize:13,fontWeight:700,cursor:"pointer"}}>{l}</button>
              ))}
            </div>
          </Card>
        </div>
        <div>
          <Card S={S}>
            <SecTitle emoji="🌍" title={T.region} S={S}/>
            <p style={{color:S.muted,fontSize:12,margin:"0 0 8px",fontWeight:600}}>Region</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {["North India","South India","Maharashtra","Bengal","Gujarat","Global"].map(r=>(
                <button key={r} onClick={()=>setRegion(r)} style={{padding:"6px 13px",borderRadius:16,border:region===r?"none":"1px solid "+S.border,background:region===r?S.saffron:"transparent",color:region===r?"#FFFFFF":S.muted,fontSize:12,cursor:"pointer",fontWeight:600}}>{r}</button>
              ))}
            </div>
            <p style={{color:S.muted,fontSize:12,margin:"0 0 8px",fontWeight:600}}>Language — changes all UI text</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {Object.keys(TRANSLATIONS).map(l=>(
                <button key={l} onClick={()=>setLang(l)} style={{padding:"6px 13px",borderRadius:16,border:lang===l?"none":"1px solid "+S.border,background:lang===l?S.sacred:"transparent",color:lang===l?"#FFFFFF":S.muted,fontSize:12,cursor:"pointer",fontWeight:lang===l?700:500,transition:"all 0.2s"}}>{l}</button>
              ))}
            </div>
            {lang!=="English"&&<p style={{color:S.green,fontSize:13,margin:"10px 0 0",fontWeight:600}}>✅ UI updated to {lang}</p>}
          </Card>
          <Card S={S}>
            <SecTitle emoji="🔔" title={T.notifications} S={S}/>
            {[
              {k:"festivalReminders",icon:"🎉",label:"Festival Reminders",sub:"3 days before each festival"},
              {k:"dailyPanchang",icon:"📅",label:"Daily Panchang",sub:"Tithi, Nakshatra, Muhurat at 7 AM"},
              {k:"fastingAlerts",icon:"🌙",label:"Fasting Alerts",sub:"Ekadashi, Pradosh, Purnima"},
              {k:"googleCal",icon:"📅",label:"Google Calendar",sub:"Use Calendar tab to add events"},
              {k:"appleCal",icon:"🍎",label:"Apple Calendar",sub:"Download .ics from Calendar tab"},
            ].map(s=>(
              <div key={s.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid "+S.border}}>
                <div style={{display:"flex",alignItems:"center",gap:11}}>
                  <span style={{fontSize:20}}>{s.icon}</span>
                  <div><p style={{color:S.text,fontSize:13,fontWeight:600,margin:0}}>{s.label}</p><p style={{color:S.muted,fontSize:13,margin:0}}>{s.sub}</p></div>
                </div>
                <Tog on={toggles[s.k]} onClick={()=>tog(s.k)} S={S}/>
              </div>
            ))}
          </Card>
          <Card S={S} style={{background:"linear-gradient(135deg,#120430,#1E083A)",border:"2px solid "+S.gold+"66"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:38,marginBottom:7}}>⭐</div>
              <h3 style={{color:S.gold,fontSize:19,fontWeight:900,margin:"0 0 5px"}}>{T.premium}</h3>
              <p style={{color:S.muted,fontSize:13,margin:"0 0 14px"}}>Unlock the full spiritual toolkit</p>
              {["🔮 Personalized Muhurat Calculations","🤖 Unlimited AI + Birth Chart","🎵 Voice-Guided Ritual Mode","🛍️ Puja Marketplace and Kits","👨‍💼 1-on-1 Jyotish Consultation"].map(f=>(
                <div key={f} style={{color:S.text,fontSize:13,textAlign:"left",marginBottom:6}}>{f}</div>
              ))}
              <button onClick={onPremium} style={{width:"100%",padding:"14px 0",borderRadius:13,border:"none",background:"linear-gradient(90deg,"+S.gold+","+S.saffron+")",color:"#FFFFFF",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:14}}>{isPremium?"✅ Premium Active":T.upgrade}</button>
              <p style={{color:S.muted,fontSize:13,margin:"9px 0 0"}}>7-day free trial • Cancel anytime</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Family Sacred Calendar */}
      <div style={{marginTop:16,marginBottom:8}}>
        <FamilyCalendarPanel S={S} bp={bp} isPremium={isPremium} onPremium={onPremium}/>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LOGIN MODAL
══════════════════════════════════════════════════════ */
function LoginModal({onClose,S,onLogin}){
  const[mode,setMode]=useState("choose"); // "choose" | "google" | "email"
  const[googleName,setGoogleName]=useState("");
  const[email,setEmail]=useState("");
  const[pass,setPass]=useState("");
  const[name,setName]=useState("");
  const[isSignup,setIsSignup]=useState(false);
  const[msg,setMsg]=useState("");

  const handleGoogleConfirm=()=>{
    if(!googleName.trim()){setMsg("Please enter your name to continue.");return;}
    onLogin({name:googleName.trim(),email:googleName.trim().toLowerCase().replace(/\s+/g,".")+".dharma@gmail.com",method:"google"});
    onClose();
  };
  const handleEmail=()=>{
    if(!email.trim()||!pass.trim()){setMsg("Please enter email and password.");return;}
    if(isSignup&&!name.trim()){setMsg("Please enter your name.");return;}
    onLogin({name:name||email.split("@")[0],email,method:"email"});
    onClose();
  };

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:S.card,borderRadius:24,padding:"28px 24px",width:"100%",maxWidth:400,border:"1px solid "+S.border,boxShadow:"0 20px 80px rgba(0,0,0,0.6)"}}>
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{fontSize:48,marginBottom:8}}>🕉️</div>
          <h2 style={{color:S.text,fontSize:21,fontWeight:900,margin:"0 0 4px"}}>Welcome to Vedanta AI</h2>
          <p style={{color:S.muted,fontSize:13,margin:0}}>Sign in to save your settings and preferences</p>
        </div>

        {/* Step 1: Choose method */}
        {mode==="choose"&&(
          <>
            <button onClick={()=>setMode("google")}
              style={{width:"100%",padding:"14px",borderRadius:14,border:"1px solid "+S.border,background:"transparent",color:S.text,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:12}}>
              <span style={{fontSize:20,fontWeight:900,fontFamily:"serif",color:"#4285F4"}}>G</span> Continue with Google
            </button>
            <button onClick={()=>setMode("email")}
              style={{width:"100%",padding:"14px",borderRadius:14,border:"1px solid "+S.border,background:"transparent",color:S.text,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
              <span style={{fontSize:20}}>✉️</span> Continue with Email
            </button>
            <p style={{color:S.muted,fontSize:12,textAlign:"center",margin:"16px 0 0"}}>By signing in, you agree to our Privacy Policy</p>
          </>
        )}

        {/* Step 2a: Google — ask for name */}
        {mode==="google"&&(
          <>
            <button onClick={()=>{setMode("choose");setMsg("");}} style={{background:"none",border:"none",color:S.saffron,cursor:"pointer",fontSize:13,fontWeight:700,padding:"0 0 14px",display:"block"}}>← Back</button>
            {/* Google-style prompt */}
            <div style={{background:"rgba(66,133,244,0.08)",border:"1px solid rgba(66,133,244,0.3)",borderRadius:14,padding:"16px 18px",marginBottom:16,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:6}}>
                <span style={{fontWeight:900,fontFamily:"serif",color:"#4285F4",fontSize:28}}>G</span>
              </div>
              <p style={{color:S.text,fontSize:13,fontWeight:700,margin:"0 0 2px"}}>Sign in with Google</p>
              <p style={{color:S.muted,fontSize:12,margin:0}}>Tell us your name to personalise your experience</p>
            </div>
            <input
              autoFocus
              placeholder="Your full name (e.g. Devender Singh)"
              value={googleName}
              onChange={e=>{setGoogleName(e.target.value);setMsg("");}}
              onKeyDown={e=>e.key==="Enter"&&handleGoogleConfirm()}
              style={{width:"100%",padding:"12px 14px",borderRadius:11,border:"1px solid "+S.border,background:S.inputBg,color:S.text,fontSize:14,outline:"none",marginBottom:10,boxSizing:"border-box",fontFamily:"inherit"}}/>
            {msg&&<p style={{color:"#FF6B6B",fontSize:13,margin:"0 0 10px"}}>{msg}</p>}
            <button onClick={handleGoogleConfirm}
              style={{width:"100%",padding:"14px",borderRadius:13,border:"none",background:"linear-gradient(90deg,#4285F4,#34A853)",color:"#FFFFFF",fontSize:15,fontWeight:800,cursor:"pointer"}}>
              ✓ Continue with Google
            </button>
          </>
        )}

        {/* Step 2b: Email/password */}
        {mode==="email"&&(
          <>
            <button onClick={()=>{setMode("choose");setMsg("");}} style={{background:"none",border:"none",color:S.saffron,cursor:"pointer",fontSize:13,fontWeight:700,padding:"0 0 12px",display:"block"}}>← Back</button>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {[["Sign In",false],["Create Account",true]].map(([l,v])=>(
                <button key={l} onClick={()=>setIsSignup(v)} style={{flex:1,padding:"9px",borderRadius:10,border:"1px solid "+(isSignup===v?S.saffron:S.border),background:isSignup===v?S.saffron:"transparent",color:isSignup===v?"#FFFFFF":S.muted,fontSize:13,fontWeight:700,cursor:"pointer"}}>{l}</button>
              ))}
            </div>
            {isSignup&&<input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",padding:"12px 14px",borderRadius:11,border:"1px solid "+S.border,background:S.inputBg,color:S.text,fontSize:14,outline:"none",marginBottom:10,boxSizing:"border-box",fontFamily:"inherit"}}/>}
            <input placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} type="email" style={{width:"100%",padding:"12px 14px",borderRadius:11,border:"1px solid "+S.border,background:S.inputBg,color:S.text,fontSize:14,outline:"none",marginBottom:10,boxSizing:"border-box",fontFamily:"inherit"}}/>
            <input placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} type="password" style={{width:"100%",padding:"12px 14px",borderRadius:11,border:"1px solid "+S.border,background:S.inputBg,color:S.text,fontSize:14,outline:"none",marginBottom:10,boxSizing:"border-box",fontFamily:"inherit"}}/>
            {msg&&<p style={{color:"#FF6B6B",fontSize:13,margin:"0 0 10px"}}>{msg}</p>}
            <button onClick={handleEmail} style={{width:"100%",padding:"14px",borderRadius:13,border:"none",background:"linear-gradient(90deg,"+S.saffron+","+S.gold+")",color:"#FFFFFF",fontSize:15,fontWeight:800,cursor:"pointer"}}>{isSignup?"Create Account":"Sign In"}</button>
          </>
        )}

        <button onClick={onClose} style={{width:"100%",padding:"11px",borderRadius:12,border:"none",background:"transparent",color:S.muted,fontSize:13,cursor:"pointer",marginTop:12}}>Skip for now</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PREMIUM MODAL
══════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════
   PREMIUM LOCK GATE
══════════════════════════════════════════════════════ */
function PremiumLock({S,onPremium,title,desc,icon}){
  return(
    <div style={{background:"linear-gradient(135deg,rgba(255,192,64,0.10),rgba(136,85,255,0.08))",border:"1.5px dashed rgba(255,192,64,0.45)",borderRadius:16,padding:"18px 20px",textAlign:"center",margin:"10px 0"}}>
      <div style={{fontSize:36,marginBottom:8}}>{icon||"⭐"}</div>
      <p style={{color:S.text,fontSize:14,fontWeight:800,margin:"0 0 5px"}}>{title||"Premium Feature"}</p>
      <p style={{color:S.muted,fontSize:12,margin:"0 0 14px",lineHeight:1.5}}>{desc||"Unlock with Vedanta Premium"}</p>
      <button onClick={onPremium} style={{padding:"10px 26px",borderRadius:20,border:"none",background:"linear-gradient(90deg,#FFC040,#FF7040)",color:"#FFFFFF",fontSize:13,fontWeight:800,cursor:"pointer"}}>
        ⭐ Unlock — 7 Days Free
      </button>
    </div>
  );
}


function PremiumModal({onClose,S,isPremium,onActivate,onCancel,user,onRequireLogin}){
  const[loading,setLoading]=useState(false);
  const hasStripeCheckout = Boolean(BILLING_CONFIG.monthlyLink);
  const hasPortal = Boolean(BILLING_CONFIG.customerPortalUrl);
  const startStripeCheckout=()=>{
    if(!hasStripeCheckout) return;
    window.location.href = BILLING_CONFIG.monthlyLink;
  };
  const[confirmCancel,setConfirmCancel]=useState(false);
  if(isPremium) return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:S.card,borderRadius:24,padding:28,width:"100%",maxWidth:460,border:"2px solid rgba(255,192,64,0.4)"}}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:48,marginBottom:8}}>⭐</div>
          <h2 style={{color:"#FFC040",fontSize:20,fontWeight:900,margin:"0 0 6px"}}>Vedanta Premium is active</h2>
          <p style={{color:S.muted,fontSize:13,margin:0}}>All premium features are unlocked on this device.</p>
        </div>
        <div style={{background:S.surface,borderRadius:12,padding:14,marginBottom:14,border:"1px solid "+S.border}}>
          <p style={{color:S.text,fontSize:13,fontWeight:800,margin:"0 0 8px"}}>💳 How billing works</p>
          <p style={{color:S.muted,fontSize:12,lineHeight:1.65,margin:0}}>Your premium subscription is billed at <strong>₹299/month</strong> through <strong>Stripe Secure Checkout</strong>. You are charged on your renewal date. You can cancel anytime — your premium access continues until the end of the billing period.</p>
        </div>
        {!confirmCancel?(
          <div style={{display:"grid",gap:10}}>
            {hasPortal?(
              <a href={BILLING_CONFIG.customerPortalUrl} target="_blank" rel="noreferrer" style={{display:"block",width:"100%",padding:14,borderRadius:13,border:"none",background:"linear-gradient(90deg,#FFC040,#FF7040)",color:"#FFFFFF",fontSize:14,fontWeight:800,textDecoration:"none",textAlign:"center",boxSizing:"border-box"}}>Manage billing &amp; cancel in Stripe ↗</a>
            ):(
              <button onClick={()=>setConfirmCancel(true)} style={{width:"100%",padding:12,borderRadius:13,border:"1px solid rgba(255,80,80,0.4)",background:"rgba(255,80,80,0.08)",color:"#FF5050",fontSize:14,fontWeight:700,cursor:"pointer"}}>Cancel membership</button>
            )}
            <button onClick={onClose} style={{width:"100%",padding:12,borderRadius:13,border:"1px solid "+S.border,background:"transparent",color:S.text,fontSize:14,fontWeight:700,cursor:"pointer"}}>Continue enjoying Premium ✨</button>
          </div>
        ):(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:8}}>😔</div>
            <p style={{color:S.text,fontSize:14,fontWeight:800,margin:"0 0 6px"}}>Are you sure you want to cancel?</p>
            <p style={{color:S.muted,fontSize:12,margin:"0 0 16px",lineHeight:1.6}}>You'll lose access to unlimited AI, personalized muhurats, family planning, and all premium features at the end of the billing period.</p>
            <div style={{display:"grid",gap:8}}>
              <button onClick={()=>{onCancel?.();onClose();}} style={{width:"100%",padding:12,borderRadius:12,border:"none",background:"rgba(255,80,80,0.15)",color:"#FF5050",fontSize:14,fontWeight:800,cursor:"pointer"}}>Yes, cancel my membership</button>
              <button onClick={()=>setConfirmCancel(false)} style={{width:"100%",padding:12,borderRadius:12,border:"1px solid "+S.border,background:"transparent",color:S.text,fontSize:13,fontWeight:700,cursor:"pointer"}}>Keep Premium — stay subscribed</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  if(!user) return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:S.card,borderRadius:24,padding:28,width:"100%",maxWidth:420,textAlign:"center",border:"1px solid "+S.border}}>
        <div style={{fontSize:52,marginBottom:10}}>🔐</div>
        <h2 style={{color:S.text,fontSize:21,fontWeight:900,margin:"0 0 8px"}}>Create your free Vedanta account</h2>
        <p style={{color:S.muted,fontSize:13,lineHeight:1.65,margin:"0 0 18px"}}>Start with the free plan first. Sign in to save your settings, then upgrade to Premium only if you want advanced tools.</p>
        <div style={{display:"grid",gap:10,marginBottom:16,textAlign:"left"}}>
          <div style={{padding:12,borderRadius:12,background:S.surface,border:"1px solid "+S.border}}><strong>Free membership</strong><br/><span style={{color:S.muted,fontSize:12}}>Basic calendar, Panchang, rituals, and standard AI guidance.</span></div>
          <div style={{padding:12,borderRadius:12,background:"rgba(255,192,64,0.08)",border:"1px solid rgba(255,192,64,0.28)"}}><strong style={{color:'#FFC040'}}>Premium upgrade</strong><br/><span style={{color:S.muted,fontSize:12}}>Advanced muhurat, unlimited AI, personalized planning, premium family tools, and billing managed through Stripe.</span></div>
        </div>
        <button onClick={()=>{onClose(); onRequireLogin?.();}} style={{width:"100%",padding:14,borderRadius:13,border:"none",background:"linear-gradient(90deg,"+S.saffron+","+S.gold+")",color:"#FFFFFF",fontSize:15,fontWeight:800,cursor:"pointer",marginBottom:10}}>Sign in / Register</button>
        <button onClick={onClose} style={{width:"100%",padding:11,borderRadius:12,border:"none",background:"transparent",color:S.muted,fontSize:13,cursor:"pointer"}}>Maybe later</button>
      </div>
    </div>
  );

  const features=[
    {icon:"🔮",title:"Personalized Muhurats",desc:"Daily muhurat calculations tuned to your location and ritual intent."},
    {icon:"🤖",title:"Unlimited AI Guide",desc:"More follow-up questions, richer planning, and premium Vedanta tools."},
    {icon:"👨‍👩‍👧",title:"Family Sankalp",desc:"Shared reminders, family planning, and kid-friendly guidance."},
    {icon:"🛕",title:"Temple & Seva Planner",desc:"Map-first city planning, saved sacred places, and curated outing ideas."},
    {icon:"📅",title:"Premium Calendar Packs",desc:"Full-year exports, richer observance filters, and reminder bundles."},
  ];

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:10000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:0}}>
      <div onClick={e=>e.stopPropagation()} style={{background:S.card,borderRadius:"22px 22px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:500,maxHeight:"88vh",overflowY:"auto",border:"1px solid "+S.border}}>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:44,marginBottom:8}}>⭐</div>
          <h2 style={{color:"#FFC040",fontSize:20,fontWeight:900,margin:"0 0 4px"}}>Vedanta Premium</h2>
          <p style={{color:S.muted,fontSize:13,margin:0}}>Free members can browse the core tool. Upgrade only when you want premium planning and deeper guidance.</p>
        </div>
        <div style={{display:"grid",gap:10,marginBottom:16}}>
          <div style={{padding:12,borderRadius:12,background:S.surface,border:"1px solid "+S.border}}><strong>Free plan</strong><br/><span style={{color:S.muted,fontSize:12}}>Calendar, today Panchang, mantra library, and standard AI guidance.</span></div>
          <div style={{padding:12,borderRadius:12,background:"rgba(255,192,64,0.08)",border:"1px solid rgba(255,192,64,0.28)"}}><strong style={{color:'#FFC040'}}>Premium plan</strong><br/><span style={{color:S.muted,fontSize:12}}>Advanced muhurat, unlimited AI, personalized planning, family tools, and premium calendar packs.</span></div>
        </div>
        <div style={{marginBottom:16}}>
          {features.map(f=>(
            <div key={f.title} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid "+S.border+"55"}}>
              <span style={{fontSize:22,flexShrink:0}}>{f.icon}</span>
              <div style={{flex:1}}>
                <p style={{color:S.text,fontSize:13,fontWeight:700,margin:"0 0 1px"}}>{f.title}</p>
                <p style={{color:S.muted,fontSize:12,margin:0}}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:"linear-gradient(135deg,rgba(255,192,64,0.1),rgba(255,112,64,0.05))",borderRadius:16,padding:"16px",border:"1px solid rgba(255,192,64,0.3)",marginBottom:14,textAlign:"center"}}>
          <p style={{color:"#FFC040",fontSize:24,fontWeight:900,margin:"0 0 4px"}}>₹299 <span style={{fontSize:14,fontWeight:500,color:S.muted}}>/month</span></p>
          <p style={{color:S.muted,fontSize:12,margin:"0 0 8px"}}>Starts on free membership first • Payment handled in Stripe • Cancel anytime</p>
          <p style={{color:S.muted,fontSize:11,lineHeight:1.6,margin:0}}>Set <code>VITE_STRIPE_PAYMENT_LINK_MONTHLY</code> to your Stripe Payment Link or Checkout URL, and <code>VITE_STRIPE_CUSTOMER_PORTAL_URL</code> to your Stripe customer portal URL. After payment, configure Stripe to return the user to this app with <code>?premium=success</code> in the URL so the app can unlock premium on this device.</p>
        </div>
        {hasStripeCheckout ? (
          <button onClick={startStripeCheckout} disabled={loading} style={{width:"100%",padding:"16px",borderRadius:14,border:"none",background:loading?"#666":"linear-gradient(90deg,#FFC040,#FF7040)",color:"#FFFFFF",fontSize:16,fontWeight:800,cursor:loading?"not-allowed":"pointer",marginBottom:10}}>Continue to Stripe Checkout</button>
        ) : (
          <div style={{padding:12,borderRadius:12,background:S.surface,border:"1px solid "+S.border,color:S.muted,fontSize:12,lineHeight:1.65,marginBottom:10}}>Stripe is not connected yet in this deployment. Add the Stripe environment variables in Vercel to make premium checkout active.</div>
        )}
        <button onClick={onClose} style={{width:"100%",padding:"11px",borderRadius:12,border:"none",background:"transparent",color:S.muted,fontSize:13,cursor:"pointer"}}>Not now</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   GLOBAL SEARCH OVERLAY
══════════════════════════════════════════════════════ */
const RASHIS=[
  {id:"mesh",name:"Mesha",english:"Aries",symbol:"♈",lord:"Mars",element:"Fire",quality:"Courageous, energetic, impulsive",lucky:"Red, Orange",stone:"Red Coral",day:"Tuesday",daily:"Today brings fresh energy. Good for starting new projects. Avoid conflicts in the evening. Lucky number: 9."},
  {id:"vrishabh",name:"Vrishabha",english:"Taurus",symbol:"♉",lord:"Venus",element:"Earth",quality:"Patient, reliable, stubborn",lucky:"Green, White",stone:"Diamond",day:"Friday",daily:"Stable day for finances. Creative work flourishes. Evening is good for family bonding. Lucky number: 6."},
  {id:"mithun",name:"Mithuna",english:"Gemini",symbol:"♊",lord:"Mercury",element:"Air",quality:"Curious, adaptable, indecisive",lucky:"Yellow, Green",stone:"Emerald",day:"Wednesday",daily:"Communication is key today. Good for learning and networking. Avoid making big decisions before noon. Lucky number: 5."},
  {id:"kark",name:"Karka",english:"Cancer",symbol:"♋",lord:"Moon",element:"Water",quality:"Nurturing, intuitive, moody",lucky:"White, Silver",stone:"Pearl",day:"Monday",daily:"Emotional day — trust your intuition. Family matters need attention. Good for home-based activities. Lucky number: 2."},
  {id:"singh",name:"Simha",english:"Leo",symbol:"♌",lord:"Sun",element:"Fire",quality:"Confident, generous, dramatic",lucky:"Gold, Orange",stone:"Ruby",day:"Sunday",daily:"Leadership opportunities arise. Creativity is high. Evening social activities are favored. Lucky number: 1."},
  {id:"kanya",name:"Kanya",english:"Virgo",symbol:"♍",lord:"Mercury",element:"Earth",quality:"Analytical, helpful, perfectionist",lucky:"Green, Brown",stone:"Emerald",day:"Wednesday",daily:"Focus on details and organization. Health routines benefit from attention. Avoid overthinking. Lucky number: 5."},
  {id:"tula",name:"Tula",english:"Libra",symbol:"♎",lord:"Venus",element:"Air",quality:"Balanced, diplomatic, indecisive",lucky:"Blue, Pink",stone:"Diamond",day:"Friday",daily:"Partnerships and collaborations are highlighted. Good for artistic pursuits. Seek balance in all decisions. Lucky number: 6."},
  {id:"vrishchik",name:"Vrishchika",english:"Scorpio",symbol:"♏",lord:"Mars/Ketu",element:"Water",quality:"Intense, passionate, secretive",lucky:"Red, Maroon",stone:"Red Coral",day:"Tuesday",daily:"Powerful day for transformation. Deep insights come through meditation. Avoid power struggles. Lucky number: 9."},
  {id:"dhanu",name:"Dhanu",english:"Sagittarius",symbol:"♐",lord:"Jupiter",element:"Fire",quality:"Optimistic, adventurous, blunt",lucky:"Yellow, Purple",stone:"Yellow Sapphire",day:"Thursday",daily:"Expansion and learning favored. Travel or philosophical discussions bring joy. Generosity brings rewards. Lucky number: 3."},
  {id:"makar",name:"Makara",english:"Capricorn",symbol:"♑",lord:"Saturn",element:"Earth",quality:"Disciplined, ambitious, pessimistic",lucky:"Blue, Black",stone:"Blue Sapphire",day:"Saturday",daily:"Hard work pays off today. Long-term planning is favored. Avoid shortcuts. Evening relaxation is important. Lucky number: 8."},
  {id:"kumbh",name:"Kumbha",english:"Aquarius",symbol:"♒",lord:"Saturn/Rahu",element:"Air",quality:"Innovative, humanitarian, detached",lucky:"Blue, Turquoise",stone:"Blue Sapphire",day:"Saturday",daily:"Innovative ideas flow freely. Social causes benefit from your attention. Stay grounded. Lucky number: 8."},
  {id:"meen",name:"Meena",english:"Pisces",symbol:"♓",lord:"Jupiter/Ketu",element:"Water",quality:"Compassionate, artistic, escapist",lucky:"Sea Green, Purple",stone:"Yellow Sapphire",day:"Thursday",daily:"Spiritual insights are strong. Creative and artistic work thrives. Set clear boundaries. Lucky number: 3."},
];

const TYPE_COLOR={festival:"#FF7040",mantra:"#8855FF",ritual:"#3DDC84",sacred:"#FFC040",muhurat:"#5BA4F5"};
const TYPE_LABEL={festival:"Festival",mantra:"Mantra",ritual:"Ritual",sacred:"Sacred Date",muhurat:"Knowledge"};
const QUICK_CHIPS=[
  "Diwali","Holi","Navratri","Janmashtami","Maha Shivaratri","Ganesh Chaturthi",
  "Ekadashi","Pradosh","Purnima","Amavasya","Akshaya Tritiya",
  "Gayatri","Hanuman Chalisa","Om Namah Shivaya","Maha Mrityunjaya","Hare Krishna",
  "Brahma Muhurat","Rahu Kaal","Abhijit","Amrit Kaal",
  "fasting","travel","marriage","Griha Pravesh","Shani remedy","Mangal dosha",
  "Varanasi","Tirupati","Vrindavan","karma","dharma","yoga","meditation","moksha",
];

function SearchOverlay({onClose,S,goTo,selectedLocation,lang}){
  const[q,setQ]=useState("");
  const[results,setResults]=useState([]);
  const[selected,setSelected]=useState(null);
  const[aiAnswer,setAiAnswer]=useState(null);
  const inputRef=useRef(null);
  const isQuestion=(s)=>{
    const l=s.toLowerCase().trim();
    return l.endsWith("?")||/^(what|when|how|why|where|who|which|tell me|explain|is there|give me|show me|can you|list|find)\b/.test(l)||l.includes(" when ")||l.includes(" what ")||l.includes(" how ")||l.includes("date")||l.includes("shloka")||l.includes("mantra")||l.includes("festival")||l.includes("muhurat")||l.includes("nakshatra")||l.includes("tithi")||l.includes("2027")||l.includes("2028");
  };
  useEffect(()=>{if(!selected) inputRef.current?.focus();},[selected]);
  useEffect(()=>{
    if(!q.trim()){setResults([]);setAiAnswer(null);return;}
    setResults(globalSearch(q));
    if(q.trim().length>4&&isQuestion(q)){
      const ans=safeGetAIReply(q, selectedLocation || "austin", lang || "English");
      const defaultAns="**Namaste! 🙏 I am your Vedanta Calendar AI**";
      setAiAnswer(ans.startsWith(defaultAns)?null:ans);
    } else {
      setAiAnswer(null);
    }
  },[q]);

  /* ── Detail Panel ── */
  if(selected){
    const{type,item}=selected;
    const col=TYPE_COLOR[type]||S.saffron;
    const navLabel={festival:"Open Calendar",mantra:"Open Mantra Library",ritual:"Begin Ritual",sacred:"Open Calendar",muhurat:"View Today"}[type]||"Open";
    const navDest={festival:"calendar",mantra:"rituals",ritual:"rituals",sacred:"calendar",muhurat:"today"}[type]||"today";
    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:9998,display:"flex",flexDirection:"column",paddingTop:"env(safe-area-inset-top,0)"}}>
        {/* Header */}
        <div style={{background:S.card,margin:"16px 16px 0",borderRadius:18,padding:"14px 18px",border:"1px solid "+S.border,display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:S.saffron,fontSize:20,cursor:"pointer",padding:0,lineHeight:1,fontWeight:800}}>←</button>
          <span style={{flex:1,color:S.muted,fontSize:13,fontWeight:600}}>Search results</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:S.muted,fontSize:22,cursor:"pointer",padding:0,lineHeight:1}}>✕</button>
        </div>
        {/* Detail card */}
        <div onClick={e=>e.stopPropagation()} style={{flex:1,overflowY:"auto",padding:"12px 16px 32px"}}>
          {/* Hero */}
          <div style={{background:"linear-gradient(145deg,"+col+"18,"+col+"08)",borderRadius:20,padding:"22px 20px 18px",border:"1px solid "+col+"33",marginBottom:14,textAlign:"center"}}>
            <div style={{fontSize:56,marginBottom:10}}>{item.icon||"🕉️"}</div>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:6}}>
              <h2 style={{color:S.text,fontSize:20,fontWeight:900,margin:0}}>{item.name}</h2>
              <span style={{background:col+"33",color:col,border:"1px solid "+col+"55",borderRadius:20,padding:"3px 11px",fontSize:13,fontWeight:700}}>{TYPE_LABEL[type]}</span>
            </div>
            {(item.date||item.bestTime||item.days)&&(
              <p style={{color:col,fontSize:13,fontWeight:700,margin:0}}>
                {item.date?`📅 ${item.date}${item.days?" · "+item.days+" days away":""}`:""}
                {item.bestTime&&!item.date?`⏰ ${item.bestTime}`:""}
              </p>
            )}
          </div>

          {/* Description */}
          <div style={{background:S.card,borderRadius:16,padding:"16px 18px",border:"1px solid "+S.border,marginBottom:10}}>
            <p style={{color:S.gold,fontSize:13,fontWeight:800,letterSpacing:1,textTransform:"uppercase",margin:"0 0 8px"}}>About</p>
            <p style={{color:S.text,fontSize:14,lineHeight:1.7,margin:0}}>{item.desc||item.meaning||""}</p>
          </div>

          {/* Mantra-specific fields */}
          {type==="mantra"&&(
            <>
              <div style={{background:S.card,borderRadius:16,padding:"16px 18px",border:"1px solid "+S.border,marginBottom:10}}>
                <p style={{color:S.gold,fontSize:13,fontWeight:800,letterSpacing:1,textTransform:"uppercase",margin:"0 0 10px"}}>Mantra Text</p>
                <p style={{color:col,fontSize:16,fontFamily:"serif",lineHeight:1.8,margin:"0 0 10px",fontWeight:600}}>{item.devnagari}</p>
                <p style={{color:S.muted,fontSize:13,fontStyle:"italic",lineHeight:1.6,margin:0}}>{item.sanskrit}</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div style={{background:S.card,borderRadius:14,padding:"14px",border:"1px solid "+S.border}}>
                  <p style={{color:S.muted,fontSize:13,fontWeight:700,textTransform:"uppercase",margin:"0 0 4px",letterSpacing:0.8}}>Deity</p>
                  <p style={{color:S.text,fontSize:13,fontWeight:700,margin:0}}>{item.deity}</p>
                </div>
                <div style={{background:S.card,borderRadius:14,padding:"14px",border:"1px solid "+S.border}}>
                  <p style={{color:S.muted,fontSize:13,fontWeight:700,textTransform:"uppercase",margin:"0 0 4px",letterSpacing:0.8}}>Chant Count</p>
                  <p style={{color:col,fontSize:13,fontWeight:700,margin:0}}>{item.chants}× repetitions</p>
                </div>
                <div style={{background:S.card,borderRadius:14,padding:"14px",border:"1px solid "+S.border}}>
                  <p style={{color:S.muted,fontSize:13,fontWeight:700,textTransform:"uppercase",margin:"0 0 4px",letterSpacing:0.8}}>Best Time</p>
                  <p style={{color:S.text,fontSize:13,fontWeight:700,margin:0}}>{item.bestTime}</p>
                </div>
                <div style={{background:S.card,borderRadius:14,padding:"14px",border:"1px solid "+S.border}}>
                  <p style={{color:S.muted,fontSize:13,fontWeight:700,textTransform:"uppercase",margin:"0 0 4px",letterSpacing:0.8}}>Benefits</p>
                  <p style={{color:S.green,fontSize:12,fontWeight:700,margin:0}}>{item.benefits}</p>
                </div>
              </div>
            </>
          )}

          {/* Festival-specific fields */}
          {(type==="festival")&&(
            <>
              {item.vedic&&(
                <div style={{background:S.card,borderRadius:14,padding:"14px 16px",border:"1px solid "+S.border,marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:20}}>📿</span>
                  <div>
                    <p style={{color:S.muted,fontSize:13,fontWeight:700,textTransform:"uppercase",margin:"0 0 2px",letterSpacing:0.8}}>Vedic Date</p>
                    <p style={{color:S.text,fontSize:13,fontWeight:700,margin:0}}>{item.vedic}</p>
                  </div>
                </div>
              )}
              {item.region&&(
                <div style={{background:S.card,borderRadius:14,padding:"14px 16px",border:"1px solid "+S.border,marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:20}}>🗺️</span>
                  <div>
                    <p style={{color:S.muted,fontSize:13,fontWeight:700,textTransform:"uppercase",margin:"0 0 2px",letterSpacing:0.8}}>Region</p>
                    <p style={{color:S.text,fontSize:13,fontWeight:700,margin:0}}>{item.region}</p>
                  </div>
                </div>
              )}
              {item.howTo&&(
                <div style={{background:S.card,borderRadius:16,padding:"16px 18px",border:"1px solid "+S.border,marginBottom:10}}>
                  <p style={{color:S.gold,fontSize:13,fontWeight:800,letterSpacing:1,textTransform:"uppercase",margin:"0 0 10px"}}>🙏 How to Celebrate</p>
                  {item.howTo.split(". ").filter(Boolean).map((step,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                      <span style={{background:col+"22",color:col,borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,flexShrink:0,marginTop:1}}>{i+1}</span>
                      <p style={{color:S.text,fontSize:13,lineHeight:1.6,margin:0}}>{step}.</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Ritual-specific fields */}
          {type==="ritual"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              {item.subtitle&&<div style={{background:S.card,borderRadius:14,padding:"14px",border:"1px solid "+S.border,gridColumn:"1/-1"}}>
                <p style={{color:S.muted,fontSize:13,fontWeight:700,textTransform:"uppercase",margin:"0 0 4px",letterSpacing:0.8}}>Subtitle</p>
                <p style={{color:S.text,fontSize:13,fontWeight:700,margin:0}}>{item.subtitle}</p>
              </div>}
              {item.duration&&<div style={{background:S.card,borderRadius:14,padding:"14px",border:"1px solid "+S.border}}>
                <p style={{color:S.muted,fontSize:13,fontWeight:700,textTransform:"uppercase",margin:"0 0 4px",letterSpacing:0.8}}>Duration</p>
                <p style={{color:col,fontSize:13,fontWeight:700,margin:0}}>{item.duration}</p>
              </div>}
              {item.deity&&<div style={{background:S.card,borderRadius:14,padding:"14px",border:"1px solid "+S.border}}>
                <p style={{color:S.muted,fontSize:13,fontWeight:700,textTransform:"uppercase",margin:"0 0 4px",letterSpacing:0.8}}>Deity</p>
                <p style={{color:S.text,fontSize:13,fontWeight:700,margin:0}}>{item.deity}</p>
              </div>}
              {item.benefits&&<div style={{background:S.card,borderRadius:14,padding:"14px",border:"1px solid "+S.border,gridColumn:"1/-1"}}>
                <p style={{color:S.muted,fontSize:13,fontWeight:700,textTransform:"uppercase",margin:"0 0 4px",letterSpacing:0.8}}>Benefits</p>
                <p style={{color:S.green,fontSize:13,fontWeight:700,margin:0}}>{item.benefits}</p>
              </div>}
            </div>
          )}

          {/* Muhurat / Sacred Date extra */}
          {(type==="muhurat"||type==="sacred")&&item.bestTime&&(
            <div style={{background:S.card,borderRadius:14,padding:"14px 16px",border:"1px solid "+S.border,marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:20}}>⏰</span>
              <div>
                <p style={{color:S.muted,fontSize:13,fontWeight:700,textTransform:"uppercase",margin:"0 0 2px",letterSpacing:0.8}}>Best Time / When</p>
                <p style={{color:col,fontSize:14,fontWeight:800,margin:0}}>{item.bestTime}</p>
              </div>
            </div>
          )}

          {/* Navigate CTA */}
          <button onClick={()=>{goTo(navDest);onClose();}}
            style={{width:"100%",padding:"15px",borderRadius:16,border:"none",background:"linear-gradient(90deg,"+col+","+col+"BB)",color:"#FFFFFF",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:4,letterSpacing:0.3}}>
            {navLabel} →
          </button>
        </div>
        <div onClick={onClose} style={{position:"absolute",inset:0,zIndex:-1}}/>
      </div>
    );
  }

  /* ── Results List ── */
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:9998,display:"flex",flexDirection:"column",paddingTop:"env(safe-area-inset-top,0)"}}>
      {/* Search input bar */}
      <div onClick={e=>e.stopPropagation()} style={{background:S.card,margin:"16px 16px 0",borderRadius:18,padding:"14px 18px",border:"1px solid "+S.border,boxShadow:"0 8px 40px rgba(0,0,0,0.4)"}}>
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:q?"10px":0}}>
          <span style={{fontSize:20,flexShrink:0}}>🔍</span>
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Search or ask anything Hindu..."
            style={{flex:1,background:"transparent",border:"none",outline:"none",color:S.text,fontSize:16,fontFamily:"inherit"}}/>
          <button onClick={()=>q?setQ(""):onClose()}
            style={{background:"none",border:"none",color:S.muted,fontSize:22,cursor:"pointer",padding:"0 4px",flexShrink:0,lineHeight:1}}>✕</button>
        </div>
        {!q&&(
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
            {QUICK_CHIPS.map(c=>(
              <button key={c} onClick={()=>setQ(c)}
                style={{padding:"5px 13px",borderRadius:20,border:"1px solid "+S.border,background:"transparent",color:S.muted,fontSize:12,cursor:"pointer",fontWeight:500}}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Results */}
      <div onClick={e=>e.stopPropagation()} style={{flex:1,overflowY:"auto",padding:"10px 16px 24px",display:"flex",flexDirection:"column",gap:8}}>
        {aiAnswer&&(
          <div style={{background:"linear-gradient(135deg,rgba(136,85,255,0.15),rgba(136,85,255,0.05))",borderRadius:18,padding:"16px 18px",border:"1px solid rgba(136,85,255,0.4)",marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(136,85,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>🤖</div>
              <span style={{color:"#AA88FF",fontSize:13,fontWeight:800,letterSpacing:0.5}}>AI ANSWER</span>
            </div>
            <div style={{color:S.text,fontSize:13,lineHeight:1.65}} dangerouslySetInnerHTML={{__html:renderMD(aiAnswer)}}/>
            <button onClick={()=>goTo("ai")} style={{marginTop:12,padding:"8px 18px",borderRadius:20,border:"1px solid rgba(136,85,255,0.5)",background:"transparent",color:"#AA88FF",fontSize:12,fontWeight:700,cursor:"pointer"}}>Open AI Guide for more →</button>
          </div>
        )}
        {results.map((r,i)=>{
          const{type,item}=r;
          const col=TYPE_COLOR[type]||S.saffron;
          return(
            <div key={i} onClick={()=>setSelected(r)}
              style={{background:S.card,borderRadius:16,padding:"13px 16px",border:"1px solid "+S.border,cursor:"pointer",display:"flex",gap:14,alignItems:"center"}}>
              <div style={{width:46,height:46,borderRadius:13,background:col+"22",border:"1px solid "+col+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>
                {item.icon||"🕉️"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:3}}>
                  <span style={{color:S.text,fontSize:14,fontWeight:800}}>{item.name}</span>
                  <span style={{background:col+"22",color:col,border:"1px solid "+col+"44",borderRadius:20,padding:"2px 9px",fontSize:12,fontWeight:700,flexShrink:0}}>{TYPE_LABEL[type]}</span>
                </div>
                <p style={{color:S.muted,fontSize:12,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.4}}>
                  {item.desc||item.subtitle||item.meaning||""}
                </p>
                {(item.date||item.bestTime)&&(
                  <p style={{color:col,fontSize:13,margin:"3px 0 0",fontWeight:600}}>{item.date||item.bestTime}</p>
                )}
              </div>
              <span style={{color:col,fontSize:18,fontWeight:800,flexShrink:0}}>›</span>
            </div>
          );
        })}
        {q&&results.length===0&&(
          <div style={{textAlign:"center",padding:"60px 20px",color:S.muted}}>
            <div style={{fontSize:48,marginBottom:12}}>🔎</div>
            <p style={{fontSize:15,fontWeight:700,margin:"0 0 6px",color:S.text}}>No results for "{q}"</p>
            <p style={{fontSize:13,margin:0}}>Try asking: 'When is Holi 2027?' or 'Give me a mantra' · Or search: Holi · Gayatri · Ekadashi</p>
          </div>
        )}
        {!q&&(
          <div style={{textAlign:"center",padding:"48px 20px",color:S.muted}}>
            <div style={{fontSize:40,marginBottom:10}}>🕉️</div>
            <p style={{fontSize:14,fontWeight:700,margin:"0 0 4px",color:S.text}}>Search Hindu Knowledge</p>
            <p style={{fontSize:12,margin:0,lineHeight:1.7}}>Festivals · Mantras · Muhurats · Nakshatras<br/>Deities · Sacred texts · Pilgrimage · Remedies</p>
          </div>
        )}
      </div>
      <div onClick={onClose} style={{position:"absolute",inset:0,zIndex:-1}}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════════════ */
function Sidebar({tab,setTab,S,T,theme,setTheme,user,onLogin,onLogout,onPremium,isPremium}){
  const tabs=[
    {id:"today",label:T.today,icon:"🏠"},
    {id:"calendar",label:T.calendar,icon:"📅"},
    {id:"ai",label:T.ai,icon:"🤖"},
    {id:"rituals",label:T.rituals,icon:"🕉️"},
    {id:"tracker",label:T.tracker,icon:"🔥"},
    {id:"profile",label:T.profile,icon:"👤"},
  ];
  return(
    <div style={{width:230,minHeight:"100vh",background:S.sidebar,borderRight:"1px solid "+S.border,display:"flex",flexDirection:"column",padding:"20px 12px",flexShrink:0,position:"sticky",top:0,height:"100vh",overflowY:"auto"}}>
      <div onClick={()=>setTab("today")} style={{display:"flex",alignItems:"center",gap:10,padding:"0 8px 18px",borderBottom:"1px solid "+S.border,cursor:"pointer"}}>
        <div style={{width:42,height:42,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",background:S.sacred+"22",border:"1px solid "+S.border,flexShrink:0,fontSize:24}}>🕉️</div>
        <div style={{minWidth:0,flex:1}}>
          <p style={{color:S.text,fontSize:17,fontWeight:900,margin:0,lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Vedanta <span style={{color:S.saffron}}>AI</span></p>
          <p style={{color:S.muted,fontSize:11.5,fontWeight:700,margin:"3px 0 0",letterSpacing:0.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Calendar Guide</p>
        </div>
        <button onClick={(e)=>{e.stopPropagation();setTheme(t=>t==="dark"?"light":"dark")}} style={{background:"none",border:"1px solid "+S.border,borderRadius:999,color:S.muted,fontSize:16,cursor:"pointer",padding:"6px 10px",flexShrink:0}} title="Toggle theme">{theme==="dark"?"☀️":"🌑"}</button>
      </div>
      {/* User / Login area in sidebar */}
      <div style={{padding:"14px 6px 0",borderBottom:"1px solid "+S.border,marginBottom:8,paddingBottom:14}}>
        {user?(
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            {/* Avatar with initials + green dot */}
            <div style={{position:"relative",flexShrink:0}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,"+S.saffron+","+S.gold+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#FFFFFF"}}>
                {user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div style={{position:"absolute",bottom:1,right:1,width:10,height:10,borderRadius:"50%",background:"#22C55E",border:"2px solid "+S.sidebar}}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{color:S.text,fontSize:13,fontWeight:800,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</p>
              <p style={{color:"#22C55E",fontSize:11,margin:0,fontWeight:600}}>● Online</p>
            </div>
            <button onClick={onLogout} title="Sign out" style={{background:"none",border:"none",color:S.muted,fontSize:18,cursor:"pointer",padding:2,flexShrink:0}}>↩</button>
          </div>
        ):(
          <button onClick={onLogin} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:"none",background:"linear-gradient(90deg,"+S.saffron+","+S.gold+")",color:"#FFFFFF",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            🔐 Sign In / Register
          </button>
        )}
      </div>
      <div style={{marginTop:4,flex:1}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:11,padding:"11px 13px",borderRadius:12,border:"none",background:tab===t.id?S.saffron+"28":"transparent",color:tab===t.id?S.saffron:S.muted,fontSize:14,fontWeight:tab===t.id?700:500,cursor:"pointer",marginBottom:4,textAlign:"left",borderLeft:tab===t.id?"3px solid "+S.saffron:"3px solid transparent",transition:"all 0.15s"}}>
            <span style={{fontSize:19}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
      {/* Premium CTA in sidebar */}
      {!isPremium?(
        <div style={{borderTop:"1px solid "+S.border,paddingTop:13}}>
          <button onClick={onPremium} style={{width:"100%",padding:"10px",borderRadius:12,border:"1px solid rgba(255,192,64,0.4)",background:"rgba(255,192,64,0.08)",color:"#FFC040",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:10}}>⭐ Upgrade to Premium</button>
          <p style={{color:S.muted,fontSize:13,textAlign:"center",lineHeight:1.6,margin:0}}>Vikram Samvat 2082<br/>Chaitra · Spring</p>
        </div>
      ):(
        <div style={{borderTop:"1px solid "+S.border,paddingTop:13}}>
          <div style={{padding:"8px 12px",borderRadius:12,background:"rgba(255,192,64,0.1)",border:"1px solid rgba(255,192,64,0.3)",textAlign:"center",marginBottom:10}}>
            <span style={{color:"#FFC040",fontSize:13,fontWeight:700}}>⭐ Premium Active</span>
          </div>
          <p style={{color:S.muted,fontSize:13,textAlign:"center",lineHeight:1.6,margin:0}}>Vikram Samvat 2082<br/>Chaitra · Spring</p>
        </div>
      )}
    </div>
  );
}
function BottomNav({tab,setTab,S,T,user}){
  const tabs=[
    {id:"today",label:T.today,icon:"🏠"},
    {id:"calendar",label:T.calendar,icon:"📅"},
    {id:"ai",label:T.ai,icon:"🤖"},
    {id:"rituals",label:T.rituals,icon:"🕉️"},
    {id:"tracker",label:T.tracker,icon:"🔥"},
    {id:"profile",label:T.profile,icon:"👤"},
  ];
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:S.sidebar,borderTop:"1px solid "+S.border,display:"flex",padding:"10px 0 env(safe-area-inset-bottom,8px)",zIndex:200,boxShadow:"0 -4px 20px rgba(0,0,0,0.3)"}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 2px"}}>
          <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
            {t.id==="profile"&&user?(
              /* Show initials avatar when logged in */
              <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,"+S.saffron+","+S.gold+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#FFFFFF",border:tab===t.id?"2px solid "+S.saffron:"2px solid transparent"}}>
                {user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
              </div>
            ):(
              <span style={{fontSize:tab===t.id?28:22,transition:"font-size 0.15s"}}>{t.icon}</span>
            )}
            {/* Green dot for logged-in profile */}
            {t.id==="profile"&&user&&(
              <div style={{position:"absolute",top:-1,right:-2,width:8,height:8,borderRadius:"50%",background:"#22C55E",border:"1.5px solid "+S.sidebar}}/>
            )}
          </div>
          <span style={{fontSize:13,fontWeight:tab===t.id?800:600,color:tab===t.id?S.saffron:t.id==="profile"&&user?"#22C55E":S.muted,lineHeight:1.2}}>{t.label.split(" ")[0]}</span>
          {tab===t.id&&<div style={{width:22,height:3,borderRadius:2,background:S.saffron,marginTop:1}}/>}
        </button>
      ))}
    </div>
  );
}
function TopBar({S,bp,tab,setTab,T,theme,setTheme,setShowSearch,user,onLogin,onShowPremium,isPremium,selectedLocation}){
  const tabLabel={today:T.today,calendar:T.calendar,ai:T.ai,rituals:T.rituals,tracker:T.tracker,profile:T.profile};
  return(
    <div style={{background:S.bg,padding:bp==="desktop"?"14px 26px":"12px 16px 11px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid "+S.border,position:"sticky",top:0,zIndex:100}}>
      {bp!=="desktop"&&(
        <div onClick={()=>setTab("today")} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
          <span style={{fontSize:26}}>🕉️</span>
          <div>
            <h1 style={{color:S.text,fontSize:16,fontWeight:900,margin:0}}>Vedanta<span style={{color:S.saffron}}> AI</span></h1>
            <p style={{color:S.muted,fontSize:12,margin:0,letterSpacing:0.5}}>PANCHANG · FESTIVALS · AI</p>
          </div>
        </div>
      )}
      {bp==="desktop"&&<span style={{color:S.text,fontSize:16,fontWeight:800}}>{tabLabel[tab]||"Today"}</span>}
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {/* Global Search */}
        <button onClick={()=>setShowSearch(true)}
          style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,border:"1px solid "+S.border,background:S.card,color:S.muted,fontSize:13,cursor:"pointer",fontWeight:600}}>
          🔍 <span style={{display:bp==="mobile"?"none":"inline"}}>Search</span>
        </button>
        <span style={{fontSize:12,color:S.muted,background:S.card,padding:"5px 12px",borderRadius:20,border:"1px solid "+S.border,fontWeight:600,whiteSpace:"nowrap",display:bp==="mobile"?"none":"inline"}}>📍 {getLocationMeta(selectedLocation).label} · {getLocationPanchang(getLocalDateKeyForLocation(selectedLocation),selectedLocation).tithi.name}</span>
        <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{background:S.card,border:"1px solid "+S.border,borderRadius:20,color:S.text,fontSize:15,cursor:"pointer",padding:"5px 10px",fontWeight:700}} title="Toggle theme">{theme==="dark"?"☀️":"🌑"}</button>
        {/* Login / User button — always visible */}
        {!user?(
          <button onClick={onLogin}
            style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,border:"none",background:"linear-gradient(90deg,"+S.saffron+","+S.gold+")",color:"#FFFFFF",fontSize:13,cursor:"pointer",fontWeight:700,whiteSpace:"nowrap"}}>
            🔐 <span style={{display:bp==="mobile"?"none":"inline"}}>Sign In</span>
          </button>
        ):(
          <button onClick={()=>setTab("profile")}
            style={{display:"flex",alignItems:"center",gap:7,padding:"4px 4px 4px 4px",borderRadius:24,border:"2px solid "+S.saffron,background:"linear-gradient(90deg,"+S.saffron+"22,"+S.gold+"22)",color:S.text,fontSize:13,cursor:"pointer",fontWeight:700,maxWidth:bp==="mobile"?42:180,overflow:"hidden",position:"relative"}}>
            {/* Avatar circle with initials */}
            <div style={{position:"relative",flexShrink:0}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,"+S.saffron+","+S.gold+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#FFFFFF",letterSpacing:0}}>
                {user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
              </div>
              {/* Green "online" dot */}
              <div style={{position:"absolute",bottom:0,right:0,width:9,height:9,borderRadius:"50%",background:"#22C55E",border:"2px solid "+S.bg}}/>
            </div>
            {bp!=="mobile"&&(
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:8,maxWidth:100}}>
                {user.name.split(" ")[0]}
              </span>
            )}
          </button>
        )}
        {/* Premium badge */}
        {!isPremium&&bp!=="mobile"&&(
          <button onClick={onShowPremium}
            style={{padding:"6px 12px",borderRadius:20,border:"1px solid rgba(255,192,64,0.5)",background:"rgba(255,192,64,0.1)",color:"#FFC040",fontSize:12,cursor:"pointer",fontWeight:700,whiteSpace:"nowrap"}}>
            ⭐ Premium
          </button>
        )}
        {isPremium&&(
          <span style={{padding:"5px 12px",borderRadius:20,background:"rgba(255,192,64,0.15)",color:"#FFC040",fontSize:12,fontWeight:700}}>⭐ Pro</span>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════ */
export default function App(){
  const bp=useBreakpoint();
  const[tab,setTab]=useState("today");
  const[theme,setTheme]=useState("dark");
  const[lang,setLang]=useState("English");
  const[showSearch,setShowSearch]=useState(false);
  const[showLogin,setShowLogin]=useState(false);
  const[user,setUser]=useState(()=>{
    if(typeof window==="undefined") return null;
    try{ const raw=window.localStorage.getItem("vedanta_user"); return raw?JSON.parse(raw):null; }catch(_err){ return null; }
  });
  const[showPremium,setShowPremium]=useState(false);
  const[isPremium,setIsPremium]=useState(()=>{
    if(typeof window==="undefined") return false;
    return window.localStorage.getItem("vedanta_premium")==="true";
  });
  const[sharedFestivalName,setSharedFestivalName]=useState("");
  const[selectedLocation,setSelectedLocation]=useState("austin");
  useEffect(()=>{
    if(typeof window==="undefined") return;
    const params=new URLSearchParams(window.location.search);
    const shared=params.get("festival");
    if(shared){
      setSharedFestivalName(shared);
      setTab("calendar");
    }
    if(params.get("premium")==="success"){
      setIsPremium(true);
      window.localStorage.setItem("vedanta_premium","true");
      params.delete("premium");
      const next=params.toString();
      window.history.replaceState({},"",`${window.location.pathname}${next?`?${next}`:""}`);
    }
  },[]);
  useEffect(()=>{
    if(typeof window==="undefined") return;
    if(user) window.localStorage.setItem("vedanta_user", JSON.stringify(user));
    else window.localStorage.removeItem("vedanta_user");
  },[user]);
  useEffect(()=>{
    if(typeof window==="undefined") return;
    window.localStorage.setItem("vedanta_premium", isPremium?"true":"false");
  },[isPremium]);
  const S=THEMES[theme]||DARK;
  const T=TRANSLATIONS[lang]||TRANSLATIONS.English;
  const props={S,bp,goTo:setTab,T,theme,setTheme,lang,setLang,selectedLocation,setSelectedLocation};
  const screen={
    today:<TodayScreen {...props}/>,
    calendar:<CalendarScreen {...props} sharedFestivalName={sharedFestivalName} onSharedFestivalHandled={()=>setSharedFestivalName("")}/>,
    ai:<AIScreen {...props} user={user} isPremium={isPremium} onShowPremium={()=>setShowPremium(true)} onRequireLogin={()=>setShowLogin(true)}/>,
    rituals:<RitualsScreen {...props} isPremium={isPremium} onPremium={()=>setShowPremium(true)}/>,
    tracker:<TrackerScreen {...props} user={user} isPremium={isPremium} onPremium={()=>setShowPremium(true)}/>,
    profile:<ProfileScreen {...props} user={user} onLogin={()=>setShowLogin(true)} onLogout={()=>setUser(null)} onPremium={()=>setShowPremium(true)} isPremium={isPremium}/>,
  }[tab]||<TodayScreen {...props}/>;
  return(
    <div style={{background:S.bg,minHeight:"100dvh",fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,sans-serif',color:S.text,WebkitFontSmoothing:"antialiased",MozOsxFontSmoothing:"grayscale",textRendering:"optimizeLegibility",WebkitTextSizeAdjust:"100%",fontSize:15,lineHeight:1.6,fontWeight:500}}>
      <div style={{display:"flex",minHeight:"100dvh"}}>
        {bp==="desktop"&&<Sidebar tab={tab} setTab={setTab} S={S} T={T} theme={theme} setTheme={setTheme} user={user} onLogin={()=>setShowLogin(true)} onLogout={()=>setUser(null)} onPremium={()=>setShowPremium(true)} isPremium={isPremium}/>}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,height:"100dvh",overflowY:"auto"}}>
          <TopBar S={S} bp={bp} tab={tab} setTab={setTab} T={T} theme={theme} setTheme={setTheme} setShowSearch={setShowSearch} user={user} onLogin={()=>setShowLogin(true)} onShowPremium={()=>setShowPremium(true)} isPremium={isPremium} selectedLocation={selectedLocation}/>
          <div style={{padding:bp==="desktop"?"24px 28px 48px":"16px 16px 96px",width:"100%",boxSizing:"border-box",flex:1}}>
            {screen}
          </div>
        </div>
      </div>
      {bp!=="desktop"&&<BottomNav tab={tab} setTab={setTab} S={S} T={T} user={user}/>}
      {showSearch&&<SearchOverlay onClose={()=>setShowSearch(false)} S={S} goTo={id=>{setTab(id);setShowSearch(false);}} selectedLocation={selectedLocation} lang={lang}/>}
      {showLogin&&<LoginModal onClose={()=>setShowLogin(false)} S={S} onLogin={u=>setUser(u)}/>}
      {showPremium&&<PremiumModal onClose={()=>setShowPremium(false)} S={S} isPremium={isPremium} user={user} onRequireLogin={()=>setShowLogin(true)} onActivate={()=>setIsPremium(true)} onCancel={()=>setIsPremium(false)}/>}
    </div>
  );
}
