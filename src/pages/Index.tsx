
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmergencyButton from "@/components/EmergencyButton";
import LocationDisplay from "@/components/LocationDisplay";
import ChatBot from "@/components/ChatBot";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [location, setLocation] = useState({
    latitude: 19.076722,
    longitude: 72.909870,
  });
  const [emergencyRequested, setEmergencyRequested] = useState(false);
  const { toast } = useToast();

  const handleEmergencyRequest = () => {
    setEmergencyRequested(true);
    
    // Simulate emergency request processing
    setTimeout(() => {
      toast({
        title: "Update: Ambulance Dispatched",
        description: "Estimated arrival time: 8 minutes",
      });
    }, 5000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-ambulance-red">Smart</span> Ambulance System
              </h1>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Emergency Medical Assistance
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Press the emergency button to request immediate medical assistance. 
                Our system will locate the nearest available ambulance and hospital.
              </p>
            </div>
            
            <div className="max-w-md mx-auto mb-10">
              <LocationDisplay 
                latitude={location.latitude} 
                longitude={location.longitude} 
              />
            </div>
            
            <div className="mt-8 flex justify-center">
              <EmergencyButton onEmergencyRequest={handleEmergencyRequest} />
            </div>
            
            {emergencyRequested && (
              <div className="mt-12 max-w-md mx-auto">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <h3 className="text-amber-800 font-medium text-center mb-2">
                    Emergency Status
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-amber-700">
                      Emergency request initiated. Help is on the way.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
