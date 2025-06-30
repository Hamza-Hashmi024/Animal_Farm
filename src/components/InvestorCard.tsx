
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TrendingUp, TrendingDown, Mail, Phone } from "lucide-react";

interface InvestorCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalInvestment: number;
  animalsOwned: number;
  currentValue: number;
  roi: number;
  joinDate: string;
  status: string;
}

export function InvestorCard({ 
  id, 
  name, 
  email, 
  phone, 
  totalInvestment, 
  animalsOwned, 
  currentValue, 
  roi, 
  joinDate, 
  status 
}: InvestorCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isProfitable = roi >= 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-lg">{name}</h3>
            <Badge className={getStatusColor(status)}>
              {status}
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">{id}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Investment</p>
            <p className="text-lg font-bold">${totalInvestment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Current Value</p>
            <p className="text-lg font-bold">${currentValue.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Animals Owned</p>
            <p className="text-xl font-bold">{animalsOwned}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">ROI</p>
            <div className="flex items-center space-x-1">
              <p className={`text-xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                {roi.toFixed(1)}%
              </p>
              {isProfitable ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100 space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <span className="truncate">{email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span>{phone}</span>
          </div>
          <p className="text-xs text-gray-500">
            Joined: {new Date(joinDate).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Portfolio
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Assign Animals
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
