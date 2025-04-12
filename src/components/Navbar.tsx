
import { Link } from "react-router-dom";
import { Ambulance, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Ambulance className="h-6 w-6 text-ambulance-red" />
          <span className="text-xl font-bold text-ambulance-red">Ambulance Vibe</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="text-ambulance-blue">
            <Link to="/hospitals">Find Hospitals</Link>
          </Button>
          <Button asChild className="bg-ambulance-red hover:bg-ambulance-darkRed text-white">
            <Link to="/emergency">Emergency</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
