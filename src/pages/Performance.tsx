
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TrendingUp, Target, BarChart3 } from "lucide-react";

const Performance = () => {
  const [customCriteria, setCustomCriteria] = useState("");

  const lowPerformers05 = [
    { tag: "TAG-234", breed: "Holstein", adg: 0.4, weight: 287, farm: "Farm C" },
    { tag: "TAG-156", breed: "Hereford", adg: 0.3, weight: 301, farm: "Farm B" },
    { tag: "TAG-098", breed: "Charolais", adg: 0.5, weight: 298, farm: "Farm A" },
  ];

  const lowPerformers08 = [
    { tag: "TAG-234", breed: "Holstein", adg: 0.6, weight: 287, farm: "Farm C" },
    { tag: "TAG-156", breed: "Hereford", adg: 0.7, weight: 301, farm: "Farm B" },
    { tag: "TAG-098", breed: "Charolais", adg: 0.8, weight: 298, farm: "Farm A" },
    { tag: "TAG-321", breed: "Angus", adg: 0.7, weight: 315, farm: "Farm A" },
  ];

  const topPerformers = [
    { tag: "TAG-045", breed: "Charolais", adg: 1.8, weight: 512, farm: "Farm B" },
    { tag: "TAG-123", breed: "Limousin", adg: 1.7, weight: 487, farm: "Farm A" },
    { tag: "TAG-089", breed: "Angus", adg: 1.6, weight: 445, farm: "Farm C" },
    { tag: "TAG-167", breed: "Simmental", adg: 1.5, weight: 423, farm: "Farm A" },
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
                <h1 className="text-3xl font-bold text-gray-900">Weight Performance</h1>
                <p className="text-gray-600 mt-1">Monitor livestock weight performance and ADG criteria</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>

            {/* Low Performers Section */}
            <Card>
              <CardHeader>
                <CardTitle>Low Performers</CardTitle>
                <CardDescription>Animals below performance thresholds</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="0.5kg" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="0.5kg">ADG ≤ 0.5 kg</TabsTrigger>
                    <TabsTrigger value="0.8kg">ADG ≤ 0.8 kg</TabsTrigger>
                    <TabsTrigger value="custom">Set Custom Criteria</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="0.5kg" className="space-y-3 mt-4">
                    {lowPerformers05.map((animal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium">{animal.tag}</p>
                          <p className="text-sm text-gray-600">{animal.breed} • {animal.farm}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-700">{animal.adg} kg/day</p>
                          <p className="text-sm text-gray-600">{animal.weight} kg</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="0.8kg" className="space-y-3 mt-4">
                    {lowPerformers08.map((animal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium">{animal.tag}</p>
                          <p className="text-sm text-gray-600">{animal.breed} • {animal.farm}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-700">{animal.adg} kg/day</p>
                          <p className="text-sm text-gray-600">{animal.weight} kg</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="custom" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label htmlFor="custom-criteria" className="text-sm font-medium">
                          Custom ADG Threshold (kg/day):
                        </label>
                        <Input
                          id="custom-criteria"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 1.0"
                          value={customCriteria}
                          onChange={(e) => setCustomCriteria(e.target.value)}
                          className="w-32"
                        />
                        <Button size="sm">Apply Filter</Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Enter a custom ADG threshold to filter animals below this performance level.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Top Performers Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Top Performers
                </CardTitle>
                <CardDescription>Animals with highest average daily gain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.map((animal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium">{animal.tag}</p>
                        <p className="text-sm text-gray-600">{animal.breed} • {animal.farm}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-700">{animal.adg} kg/day</p>
                        <p className="text-sm text-gray-600">{animal.weight} kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Performance;
