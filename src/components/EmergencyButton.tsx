
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";

interface EmergencyButtonProps {
  onEmergencyRequest: () => void;
}

const EmergencyButton = ({ onEmergencyRequest }: EmergencyButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const { toast } = useToast();

  const handleEmergencyClick = () => {
    setIsPressed(true);
    
    toast({
      title: "Emergency Request Initiated",
      description: "Help is on the way. Stay calm and wait for assistance.",
      variant: "destructive",
    });
    
    onEmergencyRequest();
    
    // Reset button after a while
    setTimeout(() => {
      setIsPressed(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        className={`w-36 h-36 rounded-full text-white uppercase font-bold text-xl shadow-lg ${
          isPressed 
            ? "bg-ambulance-darkRed" 
            : "bg-ambulance-red animate-pulse-emergency"
        }`}
        onClick={handleEmergencyClick}
      >
        Emergency
      </Button>
      <p className="mt-4 text-center text-sm text-muted-foreground max-w-sm">
        Press the emergency button to request immediate medical assistance
      </p>
    </div>
  );
};

export default EmergencyButton;
