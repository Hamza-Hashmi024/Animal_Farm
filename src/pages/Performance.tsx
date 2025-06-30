
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PerformanceChart } from "@/components/PerformanceChart";
import { TrendingUp, TrendingDown, BarChart3, Target } from "lucide-react";

const Performance = () => {
  const performanceMetrics = [
    { title: "Average Daily Gain", value: "1.2 kg", change: "+5.2%", trend: "up" },
    { title: "Feed Conversion Ratio", value: "6.8:1", change: "-2.1%", trend: "down" },
    { title: "Mortality Rate", value: "0.8%", change: "-0.3%", trend: "down" },
    { title: "Average Weight", value: "425 kg", change: "+12.5%", trend: "up" },
  ];

  const topPerformers = [
    { tag: "TAG-045", breed: "Charolais", adg: 1.8, weight: 512, farm: "Farm B" },
    { tag: "TAG-123", breed: "Limousin", adg: 1.7, weight: 487, farm: "Farm A" },
    { tag: "TAG-089", breed: "Angus", adg: 1.6, weight: 445, farm: "Farm C" },
    { tag: "TAG-167", breed: "Simmental", adg: 1.5, weight: 423, farm: "Farm A" },
  ];

  const underPerformers = [
    { tag: "TAG-234", breed: "Holstein", adg: 0.6, weight: 287, farm: "Farm C" },
    { tag: "TAG-156", breed: "Hereford", adg: 0.7, weight: 301, farm: "Farm B" },
    { tag: "TAG-098", breed: "Charolais", adg: 0.8, weight: 298, farm: "Farm A" },
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
                <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
                <p className="text-gray-600 mt-1">Monitor growth trends and livestock performance</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{metric.value}</span>
                      <div className={`flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {metric.change}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Performance Chart */}
            <PerformanceChart />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performers */}
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
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
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

              {/* Under Performers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    Needs Attention
                  </CardTitle>
                  <CardDescription>Animals with below-average performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {underPerformers.map((animal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
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

export default Performance;
