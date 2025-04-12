
import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceControlProps {
  onSpeechResult: (text: string) => void;
  language: string;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  onSpeechResult,
  language,
  isListening,
  setIsListening,
}) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Map language codes to SpeechRecognition language codes
  const getRecognitionLanguage = (lang: string): string => {
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN'
    };
    return langMap[lang] || 'en-US';
  };

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onSpeechResult(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onSpeechResult, setIsListening]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = getRecognitionLanguage(language);
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  };

  return (
    <Button
      onClick={toggleListening}
      size="icon"
      variant={isListening ? "destructive" : "outline"}
      className="rounded-full"
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};

export default VoiceControl;
