
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
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const navigate = useNavigate();

  // Mock data for demonstration
  const stats = {
    totalAnimals: 1247,
    activeAnimals: 1180,
    quarantined: 12,
    recentIncidents: 5,
    avgWeight: 425,
    avgDailyGain: 1.2,
    totalInvestors: 4,
    totalInvestment: 340000
  };

  const alerts = [
    { id: 1, animal: "Tag-001", type: "Weight Check Due", farm: "Farm A", pen: "Pen 3", priority: "medium" },
    { id: 2, animal: "Tag-043", type: "Vaccination Due", farm: "Farm B", pen: "Pen 1", priority: "high" },
    { id: 3, animal: "Tag-127", type: "Low ADG Alert", farm: "Farm A", pen: "Pen 5", priority: "high" },
  ];

  const quickActions = [
    { label: "Register New Animal", action: () => navigate("/register-animal"), color: "bg-green-600 hover:bg-green-700" },
    { label: "Record Weight", action: () => navigate("/weights-vaccination"), color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Find Animals", action: () => navigate("/find-animals"), color: "bg-purple-600 hover:bg-purple-700" },
    { label: "Report Incident", action: () => navigate("/incidents"), color: "bg-red-600 hover:bg-red-700" },
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
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/register-animal")}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Total Animals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAnimals}</div>
                  <p className="text-xs opacity-75 mt-1">Active livestock count</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/performance")}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Avg Weight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgWeight} kg</div>
                  <p className="text-xs opacity-75 mt-1">Current average</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/performance")}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Daily Gain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgDailyGain} kg</div>
                  <p className="text-xs opacity-75 mt-1">Average per animal</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/quarantine")}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Quarantined</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.quarantined}</div>
                  <p className="text-xs opacity-75 mt-1">Animals in quarantine</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={action.action}
                      className={`${action.color} h-16 text-white font-medium`}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="health">Health</TabsTrigger>
                <TabsTrigger value="investors">Investors</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FarmOverview />
                  <HealthAlerts alerts={alerts} />
                  <RecentIncidents />
                  <Card>
                    <CardHeader>
                      <CardTitle>System Status</CardTitle>
                      <CardDescription>Current system health</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Database Status</span>
                        <Badge className="bg-green-100 text-green-800">Online</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Last Sync</span>
                        <span className="text-sm text-gray-600">2 minutes ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Active Connections</span>
                        <span className="text-sm text-gray-600">12</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PerformanceChart />
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Summary</CardTitle>
                      <CardDescription>Key performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Best Performing Farm</span>
                        <span className="text-sm font-bold text-green-600">Farm B</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Highest ADG</span>
                        <span className="text-sm font-bold">1.8 kg/day</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Low Performers</span>
                        <span className="text-sm text-red-600">8 animals</span>
                      </div>
                      <Button onClick={() => navigate("/performance")} className="w-full mt-4">
                        View Detailed Performance
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="health" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <HealthAlerts alerts={alerts} />
                  <Card>
                    <CardHeader>
                      <CardTitle>Health Summary</CardTitle>
                      <CardDescription>Overall health status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Healthy Animals</span>
                        <span className="text-sm font-bold text-green-600">{stats.activeAnimals}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">In Quarantine</span>
                        <span className="text-sm font-bold text-orange-600">{stats.quarantined}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Vaccination Due</span>
                        <span className="text-sm text-blue-600">23 animals</span>
                      </div>
                      <Button onClick={() => navigate("/weights-vaccination")} className="w-full mt-4">
                        Manage Health Records
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="investors" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Investor Overview</CardTitle>
                      <CardDescription>Investment summary</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Investors</span>
                        <span className="text-sm font-bold">{stats.totalInvestors}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Investment</span>
                        <span className="text-sm font-bold text-green-600">${stats.totalInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Average ROI</span>
                        <span className="text-sm font-bold text-green-600">8.1%</span>
                      </div>
                      <Button onClick={() => navigate("/investors")} className="w-full mt-4">
                        Manage Investors
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest investor activities</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <p className="font-medium">Ahmed Ali Khan</p>
                        <p className="text-gray-600">Added 2 new animals</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Fatima Sheikh</p>
                        <p className="text-gray-600">Portfolio valuation updated</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Muhammad Hassan</p>
                        <p className="text-gray-600">Weight milestone achieved</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
