
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex flex-col justify-center px-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-900">Livestock Performance Management</h1>
          <p className="text-sm text-blue-600 font-medium">By Solutyics (Pvt) Ltd.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Demo
          </Badge>
          
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
          
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
