
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    text: "Hello! I'm AnswerGenie, your medical assistant. How can I help you today?",
    isBot: true,
    timestamp: new Date(),
  },
];

// These are pre-programmed responses for emergency-related queries
const EMERGENCY_RESPONSES: Record<string, string> = {
  "emergency": "To request emergency services, please press the red EMERGENCY button on the main screen. This will immediately alert our system to send help to your location.",
  "ambulance": "Need an ambulance? Press the red EMERGENCY button on the home page. Our system will dispatch the nearest available ambulance to your location.",
  "hospital": "Looking for hospital information? You can click on 'Find Hospitals' in the navigation bar to see nearby medical facilities.",
  "chest pain": "Chest pain could be serious. Please press the EMERGENCY button immediately. While waiting: 1) Sit down and rest 2) Take aspirin if available and not allergic 3) Loosen tight clothing.",
  "stroke": "If you suspect a stroke, remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services. Press the EMERGENCY button now.",
  "bleeding": "For severe bleeding: 1) Apply direct pressure to the wound 2) Use a clean cloth if possible 3) Press the EMERGENCY button immediately for professional help.",
  "heartattack": "If experiencing heart attack symptoms, press the EMERGENCY button now. Sit or lie down, loosen tight clothing, and try to stay calm until help arrives.",
  "accident": "For accident emergencies, press the EMERGENCY button immediately. If safe to do so, try not to move injured persons until professional help arrives.",
  "help": "For medical emergencies, press the red EMERGENCY button on the main screen. For information about hospitals, click on 'Find Hospitals' in the navigation menu.",
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
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
      const botResponse = generateResponse(input.toLowerCase());
      
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

  const generateResponse = (query: string): string => {
    // Check for emergency keywords
    for (const [keyword, response] of Object.entries(EMERGENCY_RESPONSES)) {
      if (query.includes(keyword)) {
        return response;
      }
    }

    // Generic responses for common questions
    if (query.includes("location")) {
      return "I can see your current location is being tracked on the map. This helps us send emergency services to you precisely when needed.";
    } else if (query.includes("what can you do") || query.includes("help me")) {
      return "I can assist with medical information, guide you through emergency procedures, or help you find hospitals. For immediate medical assistance, please press the red EMERGENCY button.";
    } else if (query.includes("thank")) {
      return "You're welcome! I'm here to help with any medical questions or emergencies.";
    } else if (query.includes("hello") || query.includes("hi")) {
      return "Hello! I'm here to assist you with medical information and emergency guidance. How can I help you today?";
    } else {
      return "I understand you need assistance. For immediate medical emergencies, please press the red EMERGENCY button. If you need information about hospitals or have medical questions, I'm here to help.";
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
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

  return (
    <div 
      className={cn(
        "fixed right-4 z-50 transition-all duration-300 ease-in-out",
        isMinimized ? "bottom-4 w-64" : "bottom-4 w-80 md:w-96"
      )}
    >
      <Card className="shadow-xl border-ambulance-blue border-t-4">
        <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-ambulance-blue" />
            <h3 className="font-medium text-sm">AnswerGenie Assistant</h3>
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
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
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
