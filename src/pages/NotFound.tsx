
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ambulance } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-ambulance-red rounded-full p-5 shadow-lg">
            <Ambulance className="h-16 w-16 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! The page you're looking for cannot be found.
        </p>
        
        <div className="space-y-3">
          <Button asChild className="bg-ambulance-blue hover:bg-ambulance-lightBlue w-full md:w-auto">
            <Link to="/">Return to Home</Link>
          </Button>
          
          <div className="mt-4">
            <p className="text-gray-500 text-sm">
              Need immediate assistance? 
              <Link to="/emergency" className="text-ambulance-red ml-1 font-medium">
                Request emergency services
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
