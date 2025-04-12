import React, { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface TextToSpeechProps {
  text: string;
  language: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, language }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const { toast } = useToast();
  const synth = window.speechSynthesis;

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    // Load voices immediately if they're already available
    loadVoices();

    // Add event listener for when voices are loaded
    synth.addEventListener('voiceschanged', loadVoices);

    return () => {
      synth.removeEventListener('voiceschanged', loadVoices);
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, []);

  const getVoiceForLanguage = (lang: string) => {
    const voices = synth.getVoices();
    if (!voices || voices.length === 0) {
      return null;
    }

    const langCodes: Record<string, string[]> = {
      'en': ['en', 'en-US', 'en-GB'],
      'hi': ['hi', 'hi-IN'],
      'mr': ['mr', 'mr-IN'],
      'gu': ['gu', 'gu-IN']
    };

    const matchCodes = langCodes[lang] || ['en'];
    
    // Try to find a matching voice
    for (const code of matchCodes) {
      const matchedVoice = voices.find(voice => voice.lang.toLowerCase().includes(code.toLowerCase()));
      if (matchedVoice) return matchedVoice;
    }
    
    // Fallback to any available voice
    return voices[0];
  };

  const speak = () => {
    if (!synth) {
      toast({
        title: "Speech Synthesis not supported",
        description: "Your browser does not support text to speech functionality.",
        variant: "destructive",
      });
      return;
    }

    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!voicesLoaded) {
      toast({
        title: "Voices not loaded",
        description: "Please wait while voices are being loaded.",
        variant: "default",
      });
      return;
    }

    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getVoiceForLanguage(language);
      
      if (!voice) {
        toast({
          title: "No voice available",
          description: "No suitable voice was found for the selected language.",
          variant: "destructive",
        });
        return;
      }
      
      utterance.voice = voice;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        toast({
          title: "Speech Error",
          description: `There was an error while speaking the text: ${event.error}`,
          variant: "destructive",
        });
      };
      
      synth.speak(utterance);
    }
  };

  return (
    <Button
      onClick={speak}
      size="icon"
      variant="outline"
      className="rounded-full"
      title={isSpeaking ? "Stop speaking" : "Speak this message"}
      disabled={!voicesLoaded}
    >
      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </Button>
  );
};

export default TextToSpeech;
