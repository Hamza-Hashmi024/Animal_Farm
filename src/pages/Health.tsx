
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { HealthAlerts } from "@/components/HealthAlerts";
import { Calendar, Activity, AlertTriangle, CheckCircle } from "lucide-react";

const Health = () => {
  const alerts = [
    { id: 1, animal: "Tag-001", type: "Weight Check Due", farm: "Farm A", pen: "Pen 3", priority: "medium" },
    { id: 2, animal: "Tag-043", type: "Vaccination Due", farm: "Farm B", pen: "Pen 1", priority: "high" },
    { id: 3, animal: "Tag-127", type: "Low ADG Alert", farm: "Farm A", pen: "Pen 5", priority: "high" },
    { id: 4, animal: "Tag-089", type: "Deworming Due", farm: "Farm C", pen: "Pen 2", priority: "medium" },
  ];

  const upcomingCheckups = [
    { tag: "TAG-012", type: "Day 21 Check", dueDate: "2024-07-02", farm: "Farm A" },
    { tag: "TAG-034", type: "Day 50 Check", dueDate: "2024-07-03", farm: "Farm B" },
    { tag: "TAG-056", type: "Day 7 Check", dueDate: "2024-07-01", farm: "Farm A" },
    { tag: "TAG-078", type: "Day 75 Check", dueDate: "2024-07-04", farm: "Farm C" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <DashboardHeader />
          
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Health Monitoring</h1>
                <p className="text-gray-600 mt-1">Monitor animal health and schedule checkups</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Check
              </Button>
            </div>

            {/* Health Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-2xl font-bold">{alerts.filter(a => a.priority === 'high').length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Due Checkups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold">{upcomingCheckups.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Healthy Animals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold">1,168</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">In Treatment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-2xl font-bold">12</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Alerts */}
              <HealthAlerts alerts={alerts} />

              {/* Upcoming Checkups */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Scheduled Checkups</CardTitle>
                  <CardDescription>Animals due for routine monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingCheckups.map((checkup, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="font-medium">{checkup.tag}</p>
                            <p className="text-sm text-gray-600">{checkup.farm}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{checkup.type}</p>
                          <p className="text-xs text-gray-500">{checkup.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Health;
