
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TrendingUp, TrendingDown, User, Stethoscope, Calendar, DollarSign } from "lucide-react";

interface AnimalCardProps {
  tag: string;
  srNo: string;
  breed: string;
  coatColor?: string;
  age?: number;
  weight: number;
  arrivalWeight?: number;
  adg: number;
  status: string;
  farm: string;
  pen: string;
  investor?: string;
  doctor?: string;
  purchaseDate?: string;
  price?: number;
  ratePerKg?: number;
  mandi?: string;
  purchaser?: string;
}

export function AnimalCard({ 
  tag, 
  srNo, 
  breed, 
  coatColor, 
  age, 
  weight, 
  arrivalWeight, 
  adg, 
  status, 
  farm, 
  pen, 
  investor, 
  doctor,
  purchaseDate,
  price,
  ratePerKg,
  mandi,
  purchaser
}: AnimalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'quarantine': return 'bg-red-100 text-red-800';
      case 'transferred': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isGoodADG = adg >= 1.0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div>
              <h3 className="font-semibold text-lg">{tag}</h3>
              <p className="text-xs text-gray-500">Sr. No: {srNo}</p>
            </div>
            <Badge className={getStatusColor(status)}>
              {status}
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">{breed}</p>
          {coatColor && <p className="text-xs text-gray-500">{coatColor}</p>}
          {age && <p className="text-xs text-gray-500">{age} months old</p>}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Current Weight</p>
            <p className="text-xl font-bold">{weight} kg</p>
            {arrivalWeight && (
              <p className="text-xs text-gray-500">From {arrivalWeight} kg</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">ADG</p>
            <div className="flex items-center space-x-1">
              <p className="text-xl font-bold">{adg}</p>
              {isGoodADG ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>

        {price && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-500">Purchase Price</p>
              <p className="text-sm font-bold">₹{price.toLocaleString()}</p>
            </div>
            {ratePerKg && (
              <div>
                <p className="text-sm font-medium text-gray-500">Rate/kg</p>
                <p className="text-sm font-bold">₹{ratePerKg}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-100 space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{farm}</span> • {pen}
          </p>
          
          {investor && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">Investor: {investor}</span>
            </div>
          )}

          {doctor && (
            <div className="flex items-center text-sm text-gray-600">
              <Stethoscope className="h-4 w-4 mr-2" />
              <span className="font-medium">Doctor: {doctor}</span>
            </div>
          )}

          {purchaseDate && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Purchased: {new Date(purchaseDate).toLocaleDateString()}</span>
            </div>
          )}

          {mandi && (
            <p className="text-xs text-gray-500">Market: {mandi}</p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Health Check
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
