
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
import VoiceControl from "./VoiceControl";
import TextToSpeech from "./TextToSpeech";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

type LanguageCode = "en" | "hi" | "mr" | "gu";

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
    "emergency": "आपत्कालीन सेवांची विनंती करण्यासाठी, कृपया मुख्य स्क्रीनवरील लाल EMERGENCY बटन दाबा. हे आमच्या प्रणालीला तुमच्या स्थानावर मदत पाठवण्यासाठी त्वरीत सूचित करेल.",
    "ambulance": "रुग्णवाहिका हवी आहे? मुख्यपृष्ठावरील लाल EMERGENCY बटन दाबा. आमची प्रणाली तुमच्या स्थानाजवळील उपलब्ध रुग्णवाहिका पाठवेल.",
    "hospital": "रुग्णालयाची माहिती शोधत आहात? आपण जवळील वैद्यकीय सुविधा पाहण्यासाठी नेव्हिगेशन बारमध्ये 'Find Hospitals' वर क्लिक करू शकता.",
    "chest pain": "छातीतील वेदना गंभीर असू शकते. कृपया त्वरित EMERGENCY बटन दाबा. वाट पाहताना: 1) बसा आणि आराम करा 2) जर उपलब्ध असेल आणि अॅलर्जी नसेल तर अॅस्पिरिन घ्या 3) कपडे सैल करा.",
    "stroke": "तुम्हाला स्ट्रोकची शंका असल्यास, FAST लक्षात ठेवा: चेहरा लोंबकळणे, बाहू कमजोरी, बोलण्यात अडचण, आपत्कालीन सेवांना कॉल करण्याची वेळ. आता EMERGENCY बटन दाबा.",
    "bleeding": "गंभीर रक्तस્રાવासाठी: 1) ઘા પર સીધો દબાણ લાગુ કરો 2) શક્ય અસल્यास સ્વચ્છ કાપડ વापરા 3) વ્યાવસાયિક મદદ માટે તરત જ EMERGENCY બટન દબાવો.",
    "heartattack": "હૃદયવિકારના લક્ષણો અનુભવત अસल्यास, આતા EMERGENCY બટન દબાવો. બસા किंवा ઝોપા, કપડે सैલ करा, અને મદદ આવે ત્યાં શાંત રહેવાનો પ્રયાસ કરો.",
    "accident": "अपaghात આપત૕ालीન पરिस्थितीसाठी, તત્કાળ EMERGENCY બટન દબાવો. જર તસે कרणे સુરક્ષિત असेल तर, વ્યાવસાયિક મદદ આવે ત્યાં સુધી ઘાયલ વ્યક્તિઓને ખસેડવાનો પ્રયાસ ન કરો.",
    "help": "वैद्यकीय આપત૕ालीन परिस्थितीसाठी, મુખ્ય સ્ક્રીનવરील લાલ EMERGENCY બટન દબાવો. હોસ્પિટલો વિશે માહિતીસાठી, નેવિગેશન મેનૂમાં 'Find Hospitals' પર ક્લિક કરા.",
  },
  gu: {
    "emergency": "ઇમરજન્સી સેવાઓની વિનંતી કરવા માટે, કૃપા કરીને મુખ્ય સ્ક્રીન પર લાલ EMERGENCY બટન દબાવો. આ તરત જ અમારી સિસ્ટમને તમારા સ્થાન પર મદદ મોકલવા માટે સતર્ક કરશે.",
    "ambulance": "એમ્બ્યુલન્સની જરૂર છે? હોમ પેજ પર લાલ EMERGENCY બટન દબાવો. અમારી સિસ્ટમ તમારા સ્થાન પર નજીકની ઉપલબ્ધ એમ્બ્યુલન્સ મોકલશે.",
    "hospital": "હોસ્પિટલની માહિતી શોધી રહ્યા છો? નજીકની મેડિકલ સુવિધાઓ જોવા માટે તમે નેવિગેશન બારમાં 'Find Hospitals' પર ક્લિક કરી શકો છો.",
    "chest pain": "છાતીમાં દુખાવો ગંભીર હોઈ શકે છે. કૃપા કરીને તરત જ EMERGENCY બટન દબાવો. રાહ જોતી વખતે: 1) બેસો અને આરામ કરો 2) જો ઉપલબ્ધ હોય અને એલર્જી ન હોય તો એસ્પિરિન લો 3) ચુસ્ત કપડાં ઢીલા કરો.",
    "stroke": "જો તમને સ્ટ્રોકની શંકા હોય, તો FAST યાદ રાખો: ચહેરો લટકવો, હાથમાં નબળાઈ, બોલવામાં તકલીફ, ઇમરજન્સી સેવાઓને કૉલ કરવાનો સમય. હવે EMERGENCY બટન દબાવો.",
    "bleeding": "ગંભીર રક્તસ્રાવ માટે: 1) ઘા પર સીધો દબાણ લાગુ કરો 2) શક્ય હોય તો સ્વચ્છ કપડાનો ઉપયોગ કરો 3) વ્યાવસાયિક મદદ માટે તરત જ EMERGENCY બટન દબાવો.",
    "heartattack": "જો હૃદય રોગના લક્ષણો અનુભવી રહ્યા છો, તો હવે EMERGENCY બટન દબાવો. બેસો અથવા સૂઈ જાઓ, ચુસ્ત કપડાં ઢીલા કરો, અને મદદ આવે ત્યાં સુધી શાંત રહેવાનો પ્રયાસ કરો.",
    "accident": "અકસ્માતની કટોકટી માટે, તરત જ EMERGENCY બટન દબાવો. જર તસે करणे સુરક્ષિત અસે હોય, તો વ્યાવસાયિક મદદ આવે ત્યાં સુધી ઘાયલ વ્યક્તિઓને ખસેડવાનો પ્રયાસ ન કરો.",
    "help": "તબીબી કટોકટી માટે, મુખ્ય સ્ક્રીન પર લાલ EMERGENCY બટન દબાવો. હોસ્પિટલો વિશે માહિતી માટે, નેવિગેશન મેનૂમાં 'Find Hospitals' પર ક્લિક કરો.",
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
  ]
};

// Language names for the dropdown
const languageNames: Record<LanguageCode, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
  gu: "ગુજરાતી"
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES[language]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const latestBotMessage = useRef<string>("");

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
    
    // Store the latest bot message for potential text-to-speech
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.isBot) {
      latestBotMessage.current = lastMessage.text;
    }
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

  const handleSpeechResult = (text: string) => {
    setInput(text);
    // Automatically send the message after voice input
    setTimeout(() => {
      if (text.trim()) {
        const userMessage: Message = {
          id: messages.length + 1,
          text,
          isBot: false,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate bot thinking
        setTimeout(() => {
          const botResponse = generateResponse(text.toLowerCase(), language);
          
          const botMessage: Message = {
            id: messages.length + 2,
            text: botResponse,
            isBot: true,
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
        }, 1000);
      }
    }, 300);
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
        : lang === "mr"
        ? "मी पाहू शकतो की तुमचे वर्तमान स्थान नकाशावर ट्रॅक केले जात आहे. यामुळे आम्हाला गरज पडल्यास आपत्कालीन सेवा तुमच्याकडे अचूकपणे पाठवण्यास मदत होते."
        : "હું જોઈ શકું છું કે તમારું વર્તમાન સ્થાન નકશા પર ટ્રૅક કરવામાં આવી રહ્યું છે. આ અમને જરૂર પડે ત્યારે આપાતકાલીન સેવાઓ તમને ચોક્કસપણે મોકલવામાં મદદ કરે છે.";
    } else if (query.includes("what can you do") || query.includes("help me")) {
      return lang === "en"
        ? "I can assist with medical information, guide you through emergency procedures, or help you find hospitals. For immediate medical assistance, please press the red EMERGENCY button."
        : lang === "hi"
        ? "मैं चिकित्सा जानकारी के साथ सहायता कर सकता हूं, आपातकालीन प्रक्रियाओं के माध्यम से आपका मार्गदर्शन कर सकता हूं, या आपको अस्पताल खोजने में मदद कर सकता हूं। तत्काल चिकित्सा सहायता के लिए, कृपया लाल EMERGENCY बटन दबाएं।"
        : lang === "mr"
        ? "मी वैद्यकीय माहितीसह मदत करू शकतो, आपत्कालीन प्रक्रियांमधून तुम्हाला मार्गदर्शन करू शकतो, किंवा तुम्हाला रुग्णालये शोधण्यात मदत करू शकतो. त्वरित वैद्यकीय मदतीसाठी, कृपया लाल EMERGENCY बटन दाबा."
        : "હું તબીબી માહિતી સાથે સહાય કરી શકું છું, તમને ઇમરજન્સી પ્રક્રિયાઓ દ્વારા માર્ગદર્શન આપી શકું છું, અથવા તમને હોસ્પિટલો શોધવામાં મદદ કરી શકું છું. તાત્કાલિક તબીબી સહાય માટે, કૃપા કરીને લાલ EMERGENCY બટન દબાવો.";
    } else if (query.includes("thank")) {
      return lang === "en"
        ? "You're welcome! I'm here to help with any medical questions or emergencies."
        : lang === "hi"
        ? "स्वागत है! मैं किसी भी चिकित्सा प्रश्नों या आपात स्थितियों में मदद करने के लिए यहां हूँ।"
        : lang === "mr"
        ? "स्वागत आहे! मी कोणत्याही वैद्यकीय प्रश्न किंवा आपत्कालीन परिस्थितीत मदत करण्यासाठी येथे आहे."
        : "તમારો આભાર! હું કોઈપણ તબીબી પ્રશ્નો અથવા કટોકટી માટે મદદ કરવા માટે અહીં છું.";
    } else if (query.includes("hello") || query.includes("hi")) {
      return lang === "en"
        ? "Hello! I'm here to assist you with medical information and emergency guidance. How can I help you today?"
        : lang === "hi"
        ? "नमस्ते! मैं आपको चिकित्सा जानकारी और आपातकालीन मार्गदर्शन के साथ सहायता करने के लिए यहां हूं। आज मैं आपकी कैसे मदद कर सकता हूँ?"
        : lang === "mr"
        ? "नमस्कार! मी तुम्हाला वैद्यकीय माहिती आणि आपत्कालीन मार्गदर्शनासह मदत करण्यासाठी येथे आहे. आज मी तुमची कशी मदत करू शकतो?"
        : "નમસ્તે! હું તમને તબીબી માહિતી અને ઇમરજન્સી માર્ગદર્શન સાથે સહાય કરવા માટે અહીં છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?";
    } else {
      return lang === "en"
        ? "I understand you need assistance. For immediate medical emergencies, please press the red EMERGENCY button. If you need information about hospitals or have medical questions, I'm here to help."
        : lang === "hi"
        ? "मैं समझता हूं कि आपको सहायता की आवश्यकता है। तत्काल चिकित्सा आपात स्थितियों के लिए, कृपया लाल EMERGENCY बटन दबाएं। यदि आपको अस्पतालों के बारे में जानकारी चाहिए या आपके कोई चिकित्सा प्रश्न हैं, तो मैं मदद करने के लिए यहां हूं।"
        : lang === "mr"
        ? "मला समजते की तुम्हाला मदतीची आवश्यकता आहे. त्वरित वैद्यकीय आपत्कालीन परिस्थितीसाठी, कृपया लाल EMERGENCY बटन दाबा. तुम्हाला रुग्णालयांबद्दल माहिती हवी असल्यास किंवा तुम्हाला वैद्यकीय प्रश्न असल्यास, मी मदत करण्यासाठी येथे आहे."
        : "હું સમજું છું કે તમને સહાયની જરૂર છે. તાત્કાલિક તબીબી કટોકટી માટે, કૃપા કરીને લાલ EMERGENCY બટન દબાવો. જો તમને હોસ્પિટલો વિશે માહિતીની જરૂર હોય અથવા તમારી પાસે તબીબી પ્રશ્નો હોય, તો હું મદદ કરવા માટે અહીં છું.";
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

  const cardClassName = () => {
    return "shadow-xl border-ambulance-blue border-t-4";
  };

  return (
    <div 
      className={cn(
        "fixed right-4 z-50 transition-all duration-300 ease-in-out",
        isMinimized ? "bottom-4 w-64" : "bottom-4 w-80 md:w-96"
      )}
    >
      <Card className={cardClassName()}>
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
                      <div className="flex items-start gap-2">
                        {message.isBot && (
                          <Bot className="h-4 w-4 mt-0.5 text-ambulance-red shrink-0" />
                        )}
                        <p>{message.text}</p>
                        {!message.isBot && (
                          <User className="h-4 w-4 mt-0.5 text-white shrink-0" />
                        )}
                      </div>
                      {message.isBot && (
                        <div className="mt-2 flex justify-end">
                          <TextToSpeech text={message.text} language={language} />
                        </div>
                      )}
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
                  disabled={isListening}
                />
                <VoiceControl 
                  onSpeechResult={handleSpeechResult}
                  language={language}
                  isListening={isListening}
                  setIsListening={setIsListening}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping || isListening}
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
