
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Ambulance, Phone } from "lucide-react";

const Emergency = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [emergencyInitiated, setEmergencyInitiated] = useState(true);
  
  useEffect(() => {
    if (countdown > 0 && emergencyInitiated) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setEmergencyInitiated(false);
    }
  }, [countdown, emergencyInitiated]);

  const cancelEmergency = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        <section className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto border-red-200 shadow-md">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-ambulance-red mb-2">
                  Emergency Assistance
                </h1>
                <p className="text-gray-600">
                  Help is on the way. Please stay calm and follow instructions.
                </p>
              </div>
              
              {emergencyInitiated ? (
                <div className="text-center p-8 border rounded-md bg-red-50 border-red-200">
                  <div className="text-3xl font-bold text-ambulance-red mb-4">
                    {countdown}
                  </div>
                  <p className="text-gray-700 mb-4">
                    Dispatching emergency services to your location in {countdown} seconds
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-ambulance-red text-ambulance-red hover:bg-red-50"
                    onClick={cancelEmergency}
                  >
                    Cancel Request
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                    <h3 className="text-green-700 font-medium mb-1">
                      Emergency Services Dispatched
                    </h3>
                    <p className="text-green-600 text-sm">
                      Ambulance #A-482 is on the way
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 bg-white">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-ambulance-red shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-800">Your Location</h3>
                          <p className="text-sm text-gray-600">
                            123 Main Street, Mumbai
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Lat: 19.076722, Lng: 72.909870
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-white">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-ambulance-red shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-800">Estimated Arrival</h3>
                          <p className="text-sm text-gray-600">
                            8 minutes
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Dispatched at {new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-white">
                      <div className="flex items-start gap-3">
                        <Ambulance className="h-5 w-5 text-ambulance-red shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-800">Ambulance Details</h3>
                          <p className="text-sm text-gray-600">
                            ID: A-482
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Type: Advanced Life Support
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-white">
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-ambulance-red shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-800">Emergency Contact</h3>
                          <p className="text-sm text-gray-600">
                            +91 1234567890
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Available 24/7
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={cancelEmergency}
                      variant="outline"
                      className="border-ambulance-red text-ambulance-red hover:bg-red-50"
                    >
                      Cancel Emergency
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Emergency;
