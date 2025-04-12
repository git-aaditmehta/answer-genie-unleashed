
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-ambulance-darkGray text-sm">
          &copy; {new Date().getFullYear()} Ambulance Vibe. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-1 mt-2 text-sm text-ambulance-darkGray">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-ambulance-red" />
          <span>for medical emergencies</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
