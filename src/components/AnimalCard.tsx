
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";

interface AnimalCardProps {
  tag: string;
  breed: string;
  weight: number;
  adg: number;
  status: string;
  farm: string;
  pen: string;
}

export function AnimalCard({ tag, breed, weight, adg, status, farm, pen }: AnimalCardProps) {
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
            <h3 className="font-semibold text-lg">{tag}</h3>
            <Badge className={getStatusColor(status)}>
              {status}
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">{breed}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Weight</p>
            <p className="text-xl font-bold">{weight} kg</p>
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
        
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{farm}</span> • {pen}
          </p>
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
