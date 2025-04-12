import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

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

  const initializeRecognition = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition not supported",
        description: "Your browser does not support speech recognition.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = getRecognitionLanguage(language);
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onSpeechResult(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      return true;
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      toast({
        title: "Initialization Error",
        description: "Failed to initialize speech recognition.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    const initialized = initializeRecognition();
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error('Error cleaning up speech recognition:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = getRecognitionLanguage(language);
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      const initialized = initializeRecognition();
      if (!initialized) return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.abort();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
        toast({
          title: "Error",
          description: "Failed to stop speech recognition.",
          variant: "destructive",
        });
      }
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast({
          title: "Error",
          description: "Failed to start speech recognition. Please try again.",
          variant: "destructive",
        });
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
