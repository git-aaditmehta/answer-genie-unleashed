
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Phone, Clock, Star } from "lucide-react";

interface Hospital {
  id: number;
  name: string;
  address: string;
  distance: number;
  rating: number;
  phone: string;
  hours: string;
  emergency: boolean;
}

// Mock data for hospitals
const hospitalData: Hospital[] = [
  {
    id: 1,
    name: "Mumbai General Hospital",
    address: "123 Healthcare St, Mumbai",
    distance: 1.2,
    rating: 4.5,
    phone: "+91 9876543210",
    hours: "Open 24/7",
    emergency: true,
  },
  {
    id: 2,
    name: "Apex Medical Center",
    address: "456 Wellness Ave, Mumbai",
    distance: 2.5,
    rating: 4.2,
    phone: "+91 9876543211",
    hours: "Open 24/7",
    emergency: true,
  },
  {
    id: 3,
    name: "Thane Community Hospital",
    address: "789 Health Blvd, Thane",
    distance: 4.7,
    rating: 3.9,
    phone: "+91 9876543212",
    hours: "8:00 AM - 10:00 PM",
    emergency: false,
  },
  {
    id: 4,
    name: "Sunshine Medical Clinic",
    address: "101 Care Lane, Mumbai",
    distance: 3.1,
    rating: 4.1,
    phone: "+91 9876543213",
    hours: "9:00 AM - 9:00 PM",
    emergency: false,
  },
  {
    id: 5,
    name: "City Emergency Center",
    address: "202 Urgent St, Mumbai",
    distance: 1.8,
    rating: 4.7,
    phone: "+91 9876543214",
    hours: "Open 24/7",
    emergency: true,
  },
];

const Hospitals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitals, setHospitals] = useState(hospitalData);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setHospitals(hospitalData);
      return;
    }
    
    const filtered = hospitalData.filter((hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setHospitals(filtered);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-2">Find Hospitals</h1>
            <p className="text-gray-600 text-center mb-6">
              Locate nearby hospitals and emergency medical facilities
            </p>
            
            <div className="mb-8">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search hospitals by name or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-ambulance-blue hover:bg-ambulance-lightBlue">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>
            
            <div className="space-y-4">
              {hospitals.length > 0 ? (
                hospitals.map((hospital) => (
                  <Card key={hospital.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className={`p-4 md:w-2/3 ${hospital.emergency ? 'border-l-4 border-ambulance-red' : ''}`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <h2 className="text-lg font-semibold">{hospital.name}</h2>
                              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{hospital.address}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {hospital.distance} km away
                              </div>
                              <div className="flex items-center justify-end mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${
                                      i < Math.floor(hospital.rating)
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-xs text-gray-600 ml-1">
                                  {hospital.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="h-3.5 w-3.5" />
                              <span>{hospital.phone}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{hospital.hours}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 md:w-1/3 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l">
                          {hospital.emergency ? (
                            <>
                              <div className="text-ambulance-red font-semibold mb-2">
                                Emergency Services Available
                              </div>
                              <Button className="w-full bg-ambulance-red hover:bg-ambulance-darkRed">
                                Request Ambulance
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="text-gray-600 font-medium mb-2">
                                No Emergency Services
                              </div>
                              <Button variant="outline" className="w-full">
                                Get Directions
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center p-8 bg-white rounded-md shadow">
                  <p className="text-gray-600">No hospitals found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Hospitals;
