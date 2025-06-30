
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AddFarmDialog } from "@/components/AddFarmDialog";
import { MapPin, Plus, Calendar, Grid, BarChart3 } from "lucide-react";

interface Farm {
  id: string;
  farmNumber: string;
  address: string;
  numberOfPens: number;
  area: number;
  startDate: string;
  status: "Active" | "Inactive";
}

const Farms = () => {
  const [farms, setFarms] = useState<Farm[]>([
    {
      id: "1",
      farmNumber: "F001",
      address: "123 Ranch Road, Rural County, TX 75001",
      numberOfPens: 12,
      area: 50.5,
      startDate: "2024-01-15",
      status: "Active"
    },
    {
      id: "2", 
      farmNumber: "F002",
      address: "456 Cattle Drive, Livestock City, TX 75002",
      numberOfPens: 18,
      area: 75.2,
      startDate: "2024-02-20",
      status: "Active"
    },
    {
      id: "3",
      farmNumber: "F003", 
      address: "789 Pasture Lane, Farm Valley, TX 75003",
      numberOfPens: 8,
      area: 32.8,
      startDate: "2024-03-10",
      status: "Inactive"
    }
  ]);

  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);

  const handleAddFarm = (newFarm: Omit<Farm, "id" | "status">) => {
    const farm: Farm = {
      ...newFarm,
      id: Date.now().toString(),
      status: "Active"
    };
    setFarms([...farms, farm]);
    setIsAddFarmOpen(false);
  };

  const activeFarms = farms.filter(farm => farm.status === "Active");
  const totalPens = farms.reduce((sum, farm) => sum + farm.numberOfPens, 0);
  const totalArea = farms.reduce((sum, farm) => sum + farm.area, 0);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <DashboardHeader />
          
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Farm Management</h1>
                <p className="text-gray-600 mt-1">Manage your farm locations and properties</p>
              </div>
              <Button 
                onClick={() => setIsAddFarmOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Farm
              </Button>
            </div>

            {/* Farm Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Farms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold">{farms.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Farms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold">{activeFarms.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Pens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Grid className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-2xl font-bold">{totalPens}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-2xl font-bold">{totalArea.toFixed(1)} acres</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Farms List */}
            <Card>
              <CardHeader>
                <CardTitle>All Farms</CardTitle>
                <CardDescription>Overview of all farm locations and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farms.map((farm) => (
                    <div key={farm.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Farm {farm.farmNumber}
                            </h3>
                            <Badge variant={farm.status === "Active" ? "default" : "secondary"}>
                              {farm.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-gray-600">Address</p>
                              <p className="font-medium">{farm.address}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Number of Pens</p>
                              <p className="font-medium">{farm.numberOfPens} pens</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Area</p>
                              <p className="font-medium">{farm.area} acres</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Start Date</p>
                              <p className="font-medium flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(farm.startDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <AddFarmDialog 
        open={isAddFarmOpen}
        onOpenChange={setIsAddFarmOpen}
        onAddFarm={handleAddFarm}
      />
    </SidebarProvider>
  );
};

export default Farms;
