import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { RecentIncidents } from "@/components/RecentIncidents";
import { ReportIncidentDialog } from "@/components/ReportIncidentDialog";
import { AlertTriangle, FileText, Clock } from "lucide-react";
import { GetRecentInjury  } from "@/Apis/Api";
import {  useState,  useEffect } from "react";

const Incidents = () => {
  // const recentIncidents = [
  //   {
  //     id: 1,
  //     tag: "TAG-127",
  //     type: "Injury",
  //     farm: "Farm A",
  //     pen: "Pen 5",
  //     description: "Minor leg injury observed during routine check",
  //     priority: "High",
  //     date: "2025-06-29",
  //     status: "Under Treatment"
  //   },
  //   {
  //     id: 2,
  //     tag: "TAG-089",
  //     type: "Illness",
  //     farm: "Farm B",
  //     pen: "Pen 3",
  //     description: "Showing signs of respiratory distress",
  //     priority: "Medium",
  //     date: "2025-06-28",
  //     status: "Monitoring"
  //   },
  //   {
  //     id: 3,
  //     tag: "TAG-156",
  //     type: "Behavioral",
  //     farm: "Farm C",
  //     pen: "Pen 1",
  //     description: "Aggressive behavior towards other animals",
  //     priority: "Medium",
  //     date: "2025-06-27",
  //     status: "Isolated"
  //   },
  //   {
  //     id: 4,
  //     tag: "TAG-234",
  //     type: "Transport Stress",
  //     farm: "Farm A",
  //     pen: "Quarantine",
  //     description: "Stress symptoms after transport from auction",
  //     priority: "Low",
  //     date: "2025-06-26",
  //     status: "Recovered"
  //   },
  // ];


   const [recentIncidents, setRecentIncidents] = useState([]);


    useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await GetRecentInjury();
        if (Array.isArray(response)) {
          setRecentIncidents(response);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
      }
    };

    fetchIncidents();
  }, []);

    const incidentStats = {
    total: recentIncidents.length,
    high: recentIncidents.filter(i => i.priority?.toLowerCase() === 'high').length,
    medium: recentIncidents.filter(i => i.priority?.toLowerCase() === 'medium').length,
    low: recentIncidents.filter(i => i.priority?.toLowerCase() === 'low').length,
    resolved: recentIncidents.filter(i => i.status?.toLowerCase() === 'recovered').length,
  };


  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <DashboardHeader />
          
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Incident Management</h1>
                <p className="text-gray-600 mt-1">Track and manage animal incidents and emergencies</p>
              </div>
              <ReportIncidentDialog />
            </div>

            {/* Incident Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-2xl font-bold">{incidentStats.total}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">High Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-2xl font-bold">{incidentStats.high}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Medium Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-2xl font-bold">{incidentStats.medium}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Low Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold">{incidentStats.low}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <span className="h-5 w-5 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-2xl font-bold">{incidentStats.resolved}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Incidents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentIncidents data={recentIncidents} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Incident Log</CardTitle>
                  <CardDescription>Complete history of all reported incidents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentIncidents.map((incident) => (
                      <div key={incident.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{incident.tag} - {incident.type}</h4>
                            <p className="text-sm text-gray-600">{incident.farm}, {incident.pen}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant={incident.priority === 'High' ? 'destructive' : incident.priority === 'Medium' ? 'secondary' : 'outline'}>
                              {incident.priority}
                            </Badge>
                            <span className="text-xs text-gray-500">{incident.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{incident.description}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-xs">
                            {incident.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
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

export default Incidents;
