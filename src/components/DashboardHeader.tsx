
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Plus } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900">Livestock Performance Management</h1>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Live System
        </Badge>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search animals, tags..." 
            className="pl-10 w-64"
          />
        </div>
        
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
    </header>
  );
}
