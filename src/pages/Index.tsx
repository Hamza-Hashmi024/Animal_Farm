
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AnimalCard } from "@/components/AnimalCard";
import { FarmOverview } from "@/components/FarmOverview";
import { HealthAlerts } from "@/components/HealthAlerts";
import { RecentIncidents } from "@/components/RecentIncidents";
import { PerformanceChart } from "@/components/PerformanceChart";

const Index = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");

  // Mock data for demonstration
  const stats = {
    totalAnimals: 1247,
    activeAnimals: 1180,
    quarantined: 12,
    recentIncidents: 5,
    avgWeight: 425,
    avgDailyGain: 1.2
  };

  const alerts = [
    { id: 1, animal: "Tag-001", type: "Weight Check Due", farm: "Farm A", pen: "Pen 3", priority: "medium" },
    { id: 2, animal: "Tag-043", type: "Vaccination Due", farm: "Farm B", pen: "Pen 1", priority: "high" },
    { id: 3, animal: "Tag-127", type: "Low ADG Alert", farm: "Farm A", pen: "Pen 5", priority: "high" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <DashboardHeader />
          
          <div className="p-6 space-y-6">
            {/* Key Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Total Animals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAnimals}</div>
                  <p className="text-xs opacity-75 mt-1">Active livestock count</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Avg Weight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgWeight} kg</div>
                  <p className="text-xs opacity-75 mt-1">Current average</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Daily Gain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgDailyGain} kg</div>
                  <p className="text-xs opacity-75 mt-1">Average per animal</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{alerts.length}</div>
                  <p className="text-xs opacity-75 mt-1">Require attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="animals">Animals</TabsTrigger>
                <TabsTrigger value="health">Health</TabsTrigger>
                <TabsTrigger value="incidents">Incidents</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FarmOverview />
                  <HealthAlerts alerts={alerts} />
                  <PerformanceChart />
                  <RecentIncidents />
                </div>
              </TabsContent>

              <TabsContent value="animals" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Animal Management</h2>
                  <Button className="bg-green-600 hover:bg-green-700">Add Animal</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimalCard 
                    tag="TAG-001"
                    breed="Holstein"
                    weight={450}
                    adg={1.3}
                    status="Active"
                    farm="Farm A"
                    pen="Pen 3"
                  />
                  <AnimalCard 
                    tag="TAG-002"
                    breed="Angus"
                    weight={387}
                    adg={1.1}
                    status="Active"
                    farm="Farm B"
                    pen="Pen 1"
                  />
                  <AnimalCard 
                    tag="TAG-003"
                    breed="Hereford"
                    weight={298}
                    adg={0.9}
                    status="Quarantine"
                    farm="Farm A"
                    pen="Quarantine"
                  />
                </div>
              </TabsContent>

              <TabsContent value="health" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Health Monitoring</h2>
                  <Button className="bg-blue-600 hover:bg-blue-700">Schedule Check</Button>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Health Checks</CardTitle>
                    <CardDescription>Animals due for scheduled monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {alerts.map((alert, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                              {alert.priority}
                            </Badge>
                            <div>
                              <p className="font-medium">{alert.animal}</p>
                              <p className="text-sm text-gray-600">{alert.farm} - {alert.pen}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">{alert.type}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="incidents" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Incident Management</h2>
                  <Button className="bg-red-600 hover:bg-red-700">Report Incident</Button>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Incidents</CardTitle>
                    <CardDescription>Latest animal incidents requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-red-500 pl-4 py-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">TAG-127 - Injury</h4>
                            <p className="text-sm text-gray-600">Farm A, Pen 5</p>
                            <p className="text-sm text-gray-500 mt-1">Minor leg injury observed during routine check</p>
                          </div>
                          <Badge variant="destructive">High</Badge>
                        </div>
                      </div>
                      <div className="border-l-4 border-amber-500 pl-4 py-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">TAG-089 - Illness</h4>
                            <p className="text-sm text-gray-600">Farm B, Pen 3</p>
                            <p className="text-sm text-gray-500 mt-1">Showing signs of respiratory distress</p>
                          </div>
                          <Badge variant="secondary">Medium</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
