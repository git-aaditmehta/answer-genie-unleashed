import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, Maximize2, Minimize2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

type LanguageCode = "en" | "hi" | "mr" | "gu" | "es" | "fr" | "ar";

// Translations for key messages
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    welcome: "Hello! I'm AnswerGenie, your medical assistant. How can I help you today?",
    inputPlaceholder: "Type your message...",
    emergency: "To request emergency services, please press the red EMERGENCY button on the main screen. This will immediately alert our system to send help to your location.",
    ambulance: "Need an ambulance? Press the red EMERGENCY button on the home page. Our system will dispatch the nearest available ambulance to your location.",
    hospital: "Looking for hospital information? You can click on 'Find Hospitals' in the navigation bar to see nearby medical facilities.",
    typing: "Typing...",
    selectLanguage: "Select language",
    assistantTitle: "AnswerGenie Assistant"
  },
  hi: {
    welcome: "नमस्ते! मैं AnswerGenie हूँ, आपका मेडिकल सहायक। आज मैं आपकी कैसे मदद कर सकता हूँ?",
    inputPlaceholder: "अपना संदेश टाइप करें...",
    emergency: "आपातकालीन सेवाओं का अनुरोध करने के लिए, कृपया मुख्य स्क्रीन पर लाल EMERGENCY बटन दबाएं। यह तुरंत हमारी प्रणाली को आपके स्थान पर मदद भेजने के लिए सतर्क करेगा।",
    ambulance: "एम्बुलेंस चाहिए? होम पेज पर लाल EMERGENCY बटन दबाएं। हमारी प्रणाली आपके स्थान पर निकटतम उपलब्ध एम्बुलेंस भेजेगी।",
    hospital: "अस्पताल की जानकारी की तलाश है? आप नेविगेशन बार में 'Find Hospitals' पर क्लिक करके आस-पास के मेडिकल सुविधाओं को देख सकते हैं।",
    typing: "टाइप कर रहा है...",
    selectLanguage: "भाषा चुनें",
    assistantTitle: "AnswerGenie सहायक"
  },
  mr: {
    welcome: "नमस्कार! मी AnswerGenie आहे, तुमचा वैद्यकीय सहाय्यक. आज मी तुम्हाला कशी मदत करू शकतो?",
    inputPlaceholder: "तुमचा संदेश टाइप करा...",
    emergency: "आपत्कालीन सेवांची विनंती करण्यासाठी, कृपया मुख्य स्क्रीनवरील लाल EMERGENCY बटन दाबा. हे आमच्या प्रणालीला तुमच्या स्थानावर मदत पाठवण्यासाठी त्वरीत सूचित करेल.",
    ambulance: "रुग्णवाहिका हवी आहे? मुख्यपृष्ठावरील लाल EMERGENCY बटन दाबा. आमची प्रणाली तुमच्या स्थानाजवळील उपलब्ध रुग्णवाहिका पाठवेल.",
    hospital: "रुग्णालयाची माहिती शोधत आहात? आपण जवळील वैद्यकीय सुविधा पाहण्यासाठी नेव्हिगेशन बारमध्ये 'Find Hospitals' वर क्लिक करू शकता.",
    typing: "टाइप करत आहे...",
    selectLanguage: "भाषा निवडा",
    assistantTitle: "AnswerGenie सहाय्यक"
  },
  gu: {
    welcome: "નમસ્તે! હું AnswerGenie છું, તમારો મેડિકલ સહાયક. આજે હું તમને કેવી રીતે મદદ કરી શકું?",
    inputPlaceholder: "તમારો સંદેશ ટાઇપ કરો...",
    emergency: "ઇમરજન્સી સેવાઓની વિનંતી કરવા માટે, કૃપા કરીને મુખ્ય સ્ક્રીન પર લાલ EMERGENCY બટન દબાવો. આ તરત જ અમારી સિસ્ટમને તમારા સ્થાન પર મદદ મોકલવા માટે સતર્ક કરશે.",
    ambulance: "એમ્બ્યુલન્સની જરૂર છે? હોમ પેજ પર લાલ EMERGENCY બટન દબાવો. અમારી સિસ્ટમ તમારા સ્થાન પર નજીકની ઉપલબ્ધ એમ્બ્યુલન્સ મોકલશે.",
    hospital: "હોસ્પિટલની માહિતી શોધી રહ્યા છો? નજીકની મેડિકલ સુવિધાઓ જોવા માટે તમે નેવિગેશન બારમાં 'Find Hospitals' પર ક્લિક કરી શકો છો.",
    typing: "ટાઇપ કરી રહ્યું છે...",
    selectLanguage: "ભાષા પસંદ કરો",
    assistantTitle: "AnswerGenie સહાયક"
  },
  es: {
    welcome: "¡Hola! Soy AnswerGenie, tu asistente médico. ¿Cómo puedo ayudarte hoy?",
    inputPlaceholder: "Escribe tu mensaje...",
    emergency: "Para solicitar servicios de emergencia, presiona el botón rojo EMERGENCY en la pantalla principal. Esto alertará inmediatamente a nuestro sistema para enviar ayuda a tu ubicación.",
    ambulance: "¿Necesitas una ambulancia? Presiona el botón rojo EMERGENCY en la página principal. Nuestro sistema enviará la ambulancia disponible más cercana a tu ubicación.",
    hospital: "¿Buscas información sobre hospitales? Puedes hacer clic en 'Find Hospitals' en la barra de navegación para ver centros médicos cercanos.",
    typing: "Escribiendo...",
    selectLanguage: "Seleccionar idioma",
    assistantTitle: "Asistente AnswerGenie"
  },
  fr: {
    welcome: "Bonjour! Je suis AnswerGenie, votre assistant médical. Comment puis-je vous aider aujourd'hui?",
    inputPlaceholder: "Tapez votre message...",
    emergency: "Pour demander des services d'urgence, veuillez appuyer sur le bouton rouge EMERGENCY sur l'écran principal. Cela alertera immédiatement notre système pour envoyer de l'aide à votre emplacement.",
    ambulance: "Besoin d'une ambulance? Appuyez sur le bouton rouge EMERGENCY sur la page d'accueil. Notre système enverra l'ambulance disponible la plus proche à votre emplacement.",
    hospital: "Vous cherchez des informations sur les hôpitaux? Vous pouvez cliquer sur 'Find Hospitals' dans la barre de navigation pour voir les établissements médicaux à proximité.",
    typing: "En train d'écrire...",
    selectLanguage: "Sélectionner la langue",
    assistantTitle: "Assistant AnswerGenie"
  },
  ar: {
    welcome: "مرحباً! أنا AnswerGenie، مساعدك الطبي. كيف يمكنني مساعدتك اليوم؟",
    inputPlaceholder: "اكتب رسالتك...",
    emergency: "لطلب خدمات الطوارئ، يرجى الضغط على زر الطوارئ الأحمر في الشاشة الرئيسية. سيقوم هذا بتنبيه نظامنا فوراً لإرسال المساعدة إلى موقعك.",
    ambulance: "هل تحتاج إلى سيارة إسعاف؟ اضغط على زر الطوارئ الأحمر في الصفحة الرئيسية. سيقوم نظامنا بإرسال أقرب سيارة إسعاف متاحة إلى موقعك.",
    hospital: "هل تبحث عن معلومات المستشفى؟ يمكنك النقر على 'Find Hospitals' في شريط التنقل لرؤية المرافق الطبية القريبة.",
    typing: "يكتب...",
    selectLanguage: "اختر اللغة",
    assistantTitle: "مساعد AnswerGenie"
  }
};

// Additional translations for emergency responses
const EMERGENCY_RESPONSES: Record<LanguageCode, Record<string, string>> = {
  en: {
    "emergency": "To request emergency services, please press the red EMERGENCY button on the main screen. This will immediately alert our system to send help to your location.",
    "ambulance": "Need an ambulance? Press the red EMERGENCY button on the home page. Our system will dispatch the nearest available ambulance to your location.",
    "hospital": "Looking for hospital information? You can click on 'Find Hospitals' in the navigation bar to see nearby medical facilities.",
    "chest pain": "Chest pain could be serious. Please press the EMERGENCY button immediately. While waiting: 1) Sit down and rest 2) Take aspirin if available and not allergic 3) Loosen tight clothing.",
    "stroke": "If you suspect a stroke, remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services. Press the EMERGENCY button now.",
    "bleeding": "For severe bleeding: 1) Apply direct pressure to the wound 2) Use a clean cloth if possible 3) Press the EMERGENCY button immediately for professional help.",
    "heartattack": "If experiencing heart attack symptoms, press the EMERGENCY button now. Sit or lie down, loosen tight clothing, and try to stay calm until help arrives.",
    "accident": "For accident emergencies, press the EMERGENCY button immediately. If safe to do so, try not to move injured persons until professional help arrives.",
    "help": "For medical emergencies, press the red EMERGENCY button on the main screen. For information about hospitals, click on 'Find Hospitals' in the navigation menu.",
  },
  hi: {
    "emergency": "आपातकालीन सेवाओं का अनुरोध करने के लिए, कृपया मुख्य स्क्रीन पर लाल EMERGENCY बटन दबाएं। यह तुरंत हमारी प्रणाली को आपके स्थान पर मदद भेजने के लिए सतर्क करेगा।",
    "ambulance": "एम्बुलेंस चाहिए? होम पेज पर लाल EMERGENCY बटन दबाएं। हमारी प्रणाली आपके स्थान पर निकटतम उपलब्ध एम्बुलेंस भेजेगी।",
    "hospital": "अस्पताल की जानकारी की तलाश है? आप नेविगेशन बार में 'Find Hospitals' पर क्लिक करके आस-पास के मेडिकल सुविधाओं को देख सकते हैं।",
    "chest pain": "सीने में दर्द गंभीर हो सकता है। कृपया तुरंत EMERGENCY बटन दबाएं। इंतजार करते समय: 1) बैठ जाएं और आराम करें 2) अगर उपलब्ध है और एलर्जी नहीं है तो एस्पिरिन लें 3) तंग कपड़े ढीले करें।",
    "stroke": "अगर आपको स्ट्रोक का संदेह है, तो FAST याद रखें: चेहरे का लटकना, बांह की कमजोरी, बोलने में कठिनाई, आपातकालीन सेवाओं को कॉल करने का समय। अभी EMERGENCY बटन दबाएं।",
    "bleeding": "गंभीर रक्तस्राव के लिए: 1) घाव पर सीधा दबाव डालें 2) अगर संभव हो तो साफ कपड़े का उपयोग करें 3) पेशेवर सहायता के लिए तुरंत EMERGENCY बटन दबाएं।",
    "heartattack": "अगर हृदय दौरे के लक्षण अनुभव हो रहे हैं, तो अभी EMERGENCY बटन दबाएं। बैठ जाएं या लेट जाएं, तंग कपड़े ढीले करें, और सहायता आने तक शांत रहने की कोशिश करें।",
    "accident": "दुर्घटना आपात स्थिति के लिए, तुरंत EMERGENCY बटन दबाएं। अगर ऐसा करना सुरक्षित है, तो पेशेवर सहायता आने तक घायल व्यक्तियों को हिलाने-डुलाने की कोशिश न करें।",
    "help": "चिकित्सा आपात स्थिति के लिए, मुख्य स्क्रीन पर लाल EMERGENCY बटन दबाएं। अस्पतालों के बारे में जानकारी के लिए, नेविगेशन मेनू में 'Find Hospitals' पर क्लिक करें।",
  },
  mr: {
    "emergency": "आपत्कालीन सेवांची विनंती करण्यासाठी, कृपया मुख्य स्क्रीनवरील लाल EMERGENCY बटन दाबा. हे आमच्या प���रणालीला तुमच्या स्थानावर मदत पाठवण्यासाठी त्वरीत सूचित करेल.",
    "ambulance": "रुग्णवाहिका हवी आहे? मुख्यपृष्ठावरील लाल EMERGENCY बटन दाबा. आमची प्रणाली तुमच्या स्थानाजवळील उपलब्ध रुग्णवाहिका पाठवेल.",
    "hospital": "रुग्णालयाची माहिती शोधत आहात? आपण जवळील वैद्यकीय सुविधा पाहण्यासाठी नेव्हिगेशन बारमध्ये 'Find Hospitals' वर क्लिक करू शकता.",
    "chest pain": "छातीतील वेदना गंभीर असू शकते. कृपया त्वरित EMERGENCY बटन दाबा. वाट पाहताना: 1) बसा आणि आराम करा 2) जर उपलब्ध असेल आणि अॅलर्जी नसेल तર अॅस्पिरिन घ्या 3) कपडे सैल करा.",
    "stroke": "तुम्हाला स्ट्रોકची शંકा असल्यास, FAST लક्षात ठेवा: चेहरा लोंबकळणे, बाहू कमजोरी, बोलण्यात अडचण, आपत्कालीन सेवांना कॉल करण्याची वेळ. आता EMERGENCY बटन दाबा.",
    "bleeding": "गंभीर रक्तસ્રાવासाठी: 1) ઘા પર સીધો દબાણ લાગુ કરો 2) શક્ય અसल्यास સ્વચ્છ કાપડ વापરा 3) વ્યાવસાયિક મદદ માટે તરત જ EMERGENCY બટન દબાવો.",
    "heartattack": "હૃદયવિકારના લક્ષણો અનુભવત अસल्यास, આતा EMERGENCY બટન દબાવો. બસा किंवा ઝોપा, કપડे सैલ कરा, અને મદદ આવે ત્યાં શાંત રહેવાનો પ્રયાસ કરો.",
    "accident": "अपaghात આપત૕ालीन पરिस्थितीसाठी, તત्काळ EMERGENCY બટન દબાવો. જર તसे कરणे सુરક્ષિત असेल तર, વ્યાવસાયિક મદદ આવે ત્યાં સુધી ઘાયલ વ્યક્તિઓને ખસેડવાનો પ્રયાસ ન કરો.",
    "help": "वैद्यकीय આપત૕ालीन परिस्थितीसाठी, મુખ્ય સ્ક્રીનવરील लाल EMERGENCY બટન દબાવો. હોસ્પિટલો વિશે માહિતીસाठी, નેવિગેશન મેનૂમાં 'Find Hospitals' પર ક્લિક કરा.",
  },
  gu: {
    "emergency": "ઇમરજન્સી સેવાઓની વિનંતી કરવા માટે, કૃપા કરીને મુખ્ય સ્ક્રીન પર લાલ EMERGENCY બટન દબાવો. આ તરત જ અમારી સિસ્ટમને તમારા સ્થાન પર મદદ મોકલવા માટે સતર્ક કરશે.",
    "ambulance": "એમ્બ્યુલન્સની જરૂર છે? હોમ પેજ પર લાલ EMERGENCY બટન દબાવો. અમારી સિસ્ટમ તમારા સ્થાન પર નજીકની ઉપલબ્ધ એમ્બ્યુલન્સ મોકલશે.",
    "hospital": "હોસ્પિટલની માહિતી શોધી રહ્યા છો? નજીકની મેડિકલ સુવિધાઓ જોવા માટે તમે નેવિગેશન બારમાં 'Find Hospitals' પર ક્લિક કરી શકો છો.",
    "chest pain": "છાતીમાં દુખાવો ગંભીર હોઈ શકે છે. કૃપા કરીને તરત જ EMERGENCY બટન દબાવો. રાહ જોતી વખતે: 1) બેસો અને આરામ કરો 2) જો ઉપલब્ધ હોય અને એલર્જી ન હોય તો એસ્પિરિન લો 3) ચુસ્ત કપડાં ઢીલા કરો.",
    "stroke": "જો તમને સ્ટ્રોકની શંકા હોય, તો FAST યાદ રાખો: ચહેરો લટકવો, હાથમાં નબળાઈ, બોલવામાં તકલીફ, ઇમરજન્સી સેવાઓને કૉલ કરવાનો સમય. હવે EMERGENCY બટન દબાવો.",
    "bleeding": "ગંભીર રક્તસ્રાવ માટે: 1) ઘા પર સીધો દબાણ લાગુ કરો 2) શક્ય હોય તો સ્વચ્છ કપડાનો ઉપયોગ કરો 3) વ્યાવસાયિક મદદ માટે તરત જ EMERGENCY બટન દબાવો.",
    "heartattack": "જો હૃદય રોગના લક્ષણો અનુભવી રહ્યા છો, તો હવે EMERGENCY બટન દબાવો. બેસો અથવા સૂઈ જાઓ, ચુસ્ત કપડાં ઢીલા કરો, અને મદદ આવે ત્યાં સુધી શાંત રહેવાનો પ્રયાસ કરો.",
    "accident": "અકસ્માતની કટોકટી માટે, તરત જ EMERGENCY બટન દબાવો. જર તसे कરणे સુરક્ષિત અसે હોય, તો વ્યાવસાયિક મદદ આવે ત્યાં સુધી ઘાયલ વ્યક્તિઓને ખસેડવાનો પ્રયાસ ન કરો.",
    "help": "તબીબી કટોકટી માટે, મુખ્ય સ્ક્રીન પર લાલ EMERGENCY બટન દબાવો. હોસ્પિટલો વિશે માહિતી માટે, નેવિગેશન મેનૂમાં 'Find Hospitals' પર ક્લિક કરો.",
  },
  es: {
    "emergency": "Para solicitar servicios de emergencia, presiona el botón rojo EMERGENCY en la pantalla principal. Esto alertará inmediatamente a nuestro sistema para enviar ayuda a tu ubicación.",
    "ambulance": "¿Necesitas una ambulancia? Presiona el botón rojo EMERGENCY en la página principal. Nuestro sistema enviará la ambulancia disponible más cercana a tu ubicación.",
    "hospital": "¿Buscas información sobre hospitales? Puedes hacer clic en 'Find Hospitals' en la barra de navegación para ver centros médicos cercanos.",
    "chest pain": "El dolor en el pecho podría ser grave. Presiona el botón EMERGENCY de inmediato. Mientras esperas: 1) Siéntate y descansa 2) Toma aspirina si está disponible y no eres alérgico 3) Afloja la ropa ajustada.",
    "stroke": "Si sospechas de un derrame cerebral, recuerda RÁPIDO: Rostro caído, Alteración en brazos, Problemas de habla, Instante para llamar a servicios de emergencia. Presiona el botón EMERGENCY ahora.",
    "bleeding": "Para sangrado severo: 1) Aplica presión directa sobre la herida 2) Usa un paño limpio si es posible 3) Presiona el botón EMERGENCY inmediatamente para ayuda profesional.",
    "heartattack": "Si experimentas síntomas de ataque cardíaco, presiona el botón EMERGENCY ahora. Siéntate o acuéstate, afloja la ropa ajustada e intenta mantener la calma hasta que llegue la ayuda.",
    "accident": "Para emergencias por accidentes, presiona el botón EMERGENCY inmediatamente. Si es seguro hacerlo, trata de no mover a las personas heridas hasta que llegue ayuda profesional.",
    "help": "Para emergencias médicas, presiona el botón rojo EMERGENCY en la pantalla principal. Para información sobre hospitales, haz clic en 'Find Hospitals' en el menú de navegación.",
  },
  fr: {
    "emergency": "Pour demander des services d'urgence, veuillez appuyer sur le bouton rouge EMERGENCY sur l'écran principal. Cela alertera immédiatement notre système pour envoyer de l'aide à votre emplacement.",
    "ambulance": "Besoin d'une ambulance? Appuyez sur le bouton rouge EMERGENCY sur la page d'accueil. Notre système enverra l'ambulance disponible la plus proche à votre emplacement.",
    "hospital": "Vous cherchez des informations sur les hôpitaux? Vous pouvez cliquer sur 'Find Hospitals' dans la barre de navigation pour voir les établissements médicaux à proximité.",
    "chest pain": "La douleur thoracique peut être grave. Veuillez appuyer immédiatement sur le bouton EMERGENCY. En attendant: 1) Asseyez-vous et reposez-vous 2) Prenez de l'aspirine si disponible et non allergique 3) Desserrez les vêtements serrés.",
    "stroke": "Si vous soupçonnez de un AVC, souvenez-vous de VITE: Visage tombant, Inaptitude des bras, Trouble de la parole, Extrême urgence d'appeler les services d'urgence. Appuyez maintenant sur le bouton EMERGENCY.",
    "bleeding": "Pour les saignements graves: 1) Appliquez une pression directe sur la plaie 2) Utilisez un chiffon propre si possible 3) Appuyez immédiatement sur le bouton EMERGENCY pour une aide professionnelle.",
    "heartattack": "Si vous ressentez des symptômes de crise cardiaque, appuyez maintenant sur le bouton EMERGENCY. Asseyez-vous ou allongez-vous, desserrez les vêtements serrés et essayez de rester calme jusqu'à l'arrivée des secours.",
    "accident": "Pour les urgences liées aux accidents, appuyez immédiatement sur le bouton EMERGENCY. Si cela est sûr, essayez de ne pas déplacer les personnes blessées jusqu'à l'arrivée d'une aide professionnelle.",
    "help": "Pour les urgences médicales, appuyez sur le bouton rouge EMERGENCY sur l'écran principal. Pour des informations sur les hôpitaux, cliquez sur 'Find Hospitals' dans le menu de navigation.",
  },
  ar: {
    "emergency": "لطلب خدمات الطوارئ، يرجى الضغط على زر الطوارئ الأحمر في الشاشة الرئيسية. سيقوم هذا بتنبيه نظامنا فوراً لإرسال المساعدة إلى موقعك.",
    "ambulance": "هل تحتاج إلى سيارة إسعاف؟ اضغط على زر الطوارئ الأحمر في الصفحة الرئيسية. سيقوم نظامنا بإرسال أقرب سيارة إسعاف متاحة إلى موقعك.",
    "hospital": "هل تبحث عن معلومات المستشفى؟ يمكنك النقر على 'Find Hospitals' في شريط التنقل لرؤية المرافق الطبية القريبة.",
    "chest pain": "قد يكون ألم الصدر خطيرًا. يرجى الضغط على زر الطوارئ فوراً. أثناء الانتظار: 1) اجلس واسترح 2) تناول الأسبرين إذا كان متاحًا ولست مصابًا بالحساسية 3) قم بإرخاء الملابس الضيقة.",
    "stroke": "إذا كنت تشك في حدوث سكتة دماغية، تذكر FAST: تدلي الوجه، ضعف الذراع، صعوبة في الكلام، وقت لاستدعاء خدمات الطوارئ. اضغط على زر الطوارئ الآن.",
    "bleeding": "للنزيف الشديد: 1) ضع ضغطًا مباشرًا على الجرح 2) استخدم قطعة قماش نظيفة إذا كان ذلك ممكنًا 3) اضغط على زر الطوارئ فوراً للحصول على مساعدة احترافية.",
    "heartattack": "إذا كنت تعاني من أعراض نوبة قلبية، اضغط على زر الطوارئ الآن. اجلس أو استلقِ، قم بإرخاء الملابس الضيقة، وحاول البقاء هادئًا حتى وصول المساعدة.",
    "accident": "لحالات طوارئ الحوادث، اضغط على زر الطوارئ فوراً. إذا كان آمنًا القيام بذلك، حاول عدم تحريك المصابين حتى وصول المساعدة المهنية.",
    "help": "للطوارئ الطبية، اضغط على زر الطوارئ الأحمر في الشاشة الرئيسية. للحصول على معلومات حول المستشفيات، انقر على 'Find Hospitals' في قائمة التنقل.",
  }
};

const INITIAL_MESSAGES: Record<LanguageCode, Message[]> = {
  en: [
    {
      id: 1,
      text: translations.en.welcome,
      isBot: true,
      timestamp: new Date(),
    },
  ],
  hi: [
    {
      id: 1,
      text: translations.hi.welcome,
      isBot: true,
      timestamp: new Date(),
    },
  ],
  mr: [
    {
      id: 1,
      text: translations.mr.welcome,
      isBot: true,
      timestamp: new Date(),
    },
  ],
  gu: [
    {
      id: 1,
      text: translations.gu.welcome,
      isBot: true,
      timestamp: new Date(),
    },
  ],
  es: [
    {
      id: 1,
      text: translations.es.welcome,
      isBot: true,
      timestamp: new Date(),
    },
  ],
  fr: [
    {
      id: 1,
      text: translations.fr.welcome,
      isBot: true,
      timestamp: new Date(),
    },
  ],
  ar: [
    {
      id: 1,
      text: translations.ar.welcome,
      isBot: true,
      timestamp: new Date(),
    },
  ],
};

// Language names for the dropdown
const languageNames: Record<LanguageCode, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
  gu: "ગુજરાતી",
  es: "Español",
  fr: "Français",
  ar: "العربية"
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES[language]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Handle opening the chatbot after a short delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update messages when language changes
  useEffect(() => {
    setMessages(INITIAL_MESSAGES[language]);
  }, [language]);

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as LanguageCode);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isBot: false,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = generateResponse(input.toLowerCase(), language);
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (query: string, lang: LanguageCode): string => {
    // Check for emergency keywords in current language's emergency responses
    for (const [keyword, response] of Object.entries(EMERGENCY_RESPONSES[lang])) {
      if (query.includes(keyword)) {
        return response;
      }
    }

    // Generic responses for common questions based on language
    if (query.includes("location")) {
      return lang === "en" 
        ? "I can see your current location is being tracked on the map. This helps us send emergency services to you precisely when needed."
        : lang === "hi" 
        ? "मैं देख सकता हूं कि आपका वर्तमान स्थान मानचित्र पर ट्रैक किया जा रहा है। यह हमें आपातकालीन सेवाओं को आवश्यकता पड़ने पर सटीक रूप से आपके पास भेजने में मदद करता है।"
        : lang === "es"
        ? "Puedo ver que tu ubicación actual está siendo rastreada en el mapa. Esto nos ayuda a enviarte servicios de emergencia con precisión cuando sea necesario."
        : lang === "fr"
        ? "Je peux voir que votre position actuelle est suivie sur la carte. Cela nous aide à vous envoyer des services d'urgence avec précision en cas de besoin."
        : "يمكنني رؤية أن موقعك الحالي يتم تتبعه على الخريطة. هذا يساعدنا على إرسال خدمات الطوارئ إليك بدقة عند الحاجة.";
    } else if (query.includes("what can you do") || query.includes("help me")) {
      return lang === "en"
        ? "I can assist with medical information, guide you through emergency procedures, or help you find hospitals. For immediate medical assistance, please press the red EMERGENCY button."
        : lang === "hi"
        ? "मैं चिकित्सा जानकारी के साथ सहायता कर सकता हूं, आपातकालीन प्रक्रियाओं के माध्यम से आपका मार्गदर्शन कर सकता हूं, या आपको अस्पताल खोजने में मदद कर सकता हूं। तत्काल चिकित्सा सहायता के लिए, कृपया लाल EMERGENCY बटन दबाएं।"
        : lang === "es"
        ? "Puedo ayudarte con información médica, guiarte a través de procedimientos de emergencia o ayudarte a encontrar hospitales. Para asistencia médica inmediata, presiona el botón rojo EMERGENCY."
        : lang === "fr"
        ? "Je peux vous aider avec des informations médicales, vous guider à travers des procédures d'urgence ou vous aider à trouver des hôpitaux. Pour une assistance médicale immédiate, veuillez appuyer sur le bouton rouge EMERGENCY."
        : "يمكنني المساعدة في المعلومات الطبية، وإرشادك خلال إجراءات الطوارئ، أو مساعدتك في العثور على المستشفيات. للحصول على مساعدة طبية فورية، يرجى الضغط على زر الطوارئ الأحمر.";
    } else if (query.includes("thank")) {
      return lang === "en"
        ? "You're welcome! I'm here to help with any medical questions or emergencies."
        : lang === "hi"
        ? "स्वागत है! मैं किसी भी चिकित्सा प्रश्नों या आपात स्थितियों में मदद करने के लिए यहां हूँ।"
        : lang === "es"
        ? "¡De nada! Estoy aquí para ayudarte con cualquier pregunta médica o emergencia."
        : lang === "fr"
        ? "Je vous en prie! Je suis là pour vous aider avec toutes questions médicales ou urgences."
        : "على الرحب وا��سعة! أنا هنا للمساعدة في أي أسئلة طبية أو حالات طوارئ.";
    } else if (query.includes("hello") || query.includes("hi")) {
      return lang === "en"
        ? "Hello! I'm here to assist you with medical information and emergency guidance. How can I help you today?"
        : lang === "hi"
        ? "नमस्ते! मैं आपको चिकित्सा जानकारी और आपातकालीन मार्गदर्शन के साथ सहायता करने के लिए यहां हूं। आज मैं आपकी कैसे मदद कर सकता हूँ?"
        : lang === "es"
        ? "¡Hola! Estoy aquí para asistirte con información médica y orientación de emergencia. ¿Cómo puedo ayudarte hoy?"
        : lang === "fr"
        ? "Bonjour! Je suis là pour vous aider avec des informations médicales et des conseils d'urgence. Comment puis-je vous aider aujourd'hui?"
        : "مرحبًا! أنا هنا لمساعدتك بالمعلومات الطبية وإرشادات الطوارئ. كيف يمكنني مساعدتك اليوم؟";
    } else {
      return lang === "en"
        ? "I understand you need assistance. For immediate medical emergencies, please press the red EMERGENCY button. If you need information about hospitals or have medical questions, I'm here to help."
        : lang === "hi"
        ? "मैं समझता हूं कि आपको सहायता की आवश्यकता है। तत्काल चिकित्सा आपात स्थितियों के लिए, कृपया लाल EMERGENCY बटन दबाएं। यदि आपको अस्पतालों के बारे में जानकारी चाहिए या आपके कोई चिकित्सा प्रश्न हैं, तो मैं मदद करने के लिए यहां हूं।"
        : lang === "es"
        ? "Entiendo que necesitas ayuda. Para emergencias médicas inmediatas, presiona el botón rojo EMERGENCY. Si necesitas información sobre hospitales o tienes preguntas médicas, estoy aquí para ayudarte."
        : lang === "fr"
        ? "Je comprends que vous avez besoin d'aide. Pour les urgences médicales immédiates, veuillez appuyer sur le bouton rouge EMERGENCY. Si vous avez besoin d'informations sur les hôpitaux ou avez des questions médicales, je suis là pour vous aider."
        : "أفهم أنك بحاجة إلى المساعدة. للطوارئ الطبية الفورية، يرجى الضغط على زر الطوارئ الأحمر. إذا كنت بحاجة إلى معلومات حول المستشفيات أو لديك أسئلة طبية، فأنا هنا للمساعدة.";
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const getTypingText = () => {
    return translations[language].typing || "Typing...";
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={toggleOpen}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 bg-ambulance-blue hover:bg-ambulance-lightBlue shadow-lg flex items-center justify-center"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  const cardClassName = lang => {
    return cn(
      "shadow-xl border-ambulance-blue border-t-4",
      lang === "ar" ? "text-right" : ""
    );
  };

  return (
    <div 
      className={cn(
        "fixed right-4 z-50 transition-all duration-300 ease-in-out",
        isMinimized ? "bottom-4 w-64" : "bottom-4 w-80 md:w-96"
      )}
    >
      <Card className={cardClassName(language)}>
        <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-ambulance-blue" />
            <h3 className="font-medium text-sm">{translations[language].assistantTitle}</h3>
          </div>
          <div className="flex items-center space-x-1">
            {isMinimized ? (
              <Maximize2 
                className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700" 
                onClick={toggleMinimize}
              />
            ) : (
              <Minimize2 
                className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700" 
                onClick={toggleMinimize}
              />
            )}
            <X 
              className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700" 
              onClick={toggleOpen}
            />
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <>
            <CardContent className="p-3 h-80 overflow-y-auto">
              {/* Language selector */}
              <div className="mb-3">
                <Select 
                  value={language} 
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="w-full h-8 text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    <SelectValue placeholder={translations[language].selectLanguage} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languageNames).map(([code, name]) => (
                      <SelectItem key={code} value={code} className="text-xs">
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.isBot ? "justify-start" : "justify-end"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 max-w-[80%] text-sm",
                        message.isBot
                          ? "bg-ambulance-gray text-gray-800"
                          : "bg-ambulance-blue text-white"
                      )}
                    >
                      <div className={cn(
                        "flex items-start gap-2",
                        language === "ar" ? "flex-row-reverse" : ""
                      )}>
                        {message.isBot && (
                          <Bot className="h-4 w-4 mt-0.5 text-ambulance-red shrink-0" />
                        )}
                        <p dir={language === "ar" ? "rtl" : "ltr"}>{message.text}</p>
                        {!message.isBot && (
                          <User className="h-4 w-4 mt-0.5 text-white shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-ambulance-gray rounded-lg px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-ambulance-red" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75" />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messageEndRef} />
              </div>
            </CardContent>
            
            <CardFooter className="p-3 pt-0">
              <form
                className="flex w-full gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input
                  placeholder={translations[language].inputPlaceholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                  dir={language === "ar" ? "rtl" : "ltr"}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  className="bg-ambulance-blue hover:bg-ambulance-lightBlue"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default ChatBot;
