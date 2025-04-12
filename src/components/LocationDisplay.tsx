
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LocationDisplayProps {
  latitude: number;
  longitude: number;
}

const LocationDisplay = ({ latitude, longitude }: LocationDisplayProps) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <h3 className="text-md font-medium text-center">Your Current Location</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-end gap-1">
              <span className="font-semibold">Lat:</span>
            </div>
            <div>{latitude.toFixed(6)}</div>
            <div className="flex items-center justify-end gap-1">
              <span className="font-semibold">Lng:</span>
            </div>
            <div>{longitude.toFixed(6)}</div>
          </div>
          <div className="flex items-center justify-center mt-2">
            <MapPin className="h-4 w-4 text-ambulance-red mr-1" />
            <span className="text-xs text-muted-foreground">Location services active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationDisplay;
