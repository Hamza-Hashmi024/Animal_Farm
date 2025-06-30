
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SlaughterRecordDialog } from "@/components/SlaughterRecordDialog";
import { SlaughterRecords } from "@/components/SlaughterRecords";
import { Beef, Scale, TrendingUp, Award } from "lucide-react";

const SlaughterRecording = () => {
  const slaughterStats = {
    totalProcessed: 24,
    avgCarcassWeight: 285,
    avgCarcassRatio: 58.2,
    qualityGradeA: 18,
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
                <h1 className="text-3xl font-bold text-gray-900">Slaughter & Carcass Recording</h1>
                <p className="text-gray-600 mt-1">Capture final stage data for animals sent for processing</p>
              </div>
              <SlaughterRecordDialog />
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Processed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Beef className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-2xl font-bold">{slaughterStats.totalProcessed}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Carcass Weight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Scale className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-2xl font-bold">{slaughterStats.avgCarcassWeight}kg</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Carcass Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-2xl font-bold">{slaughterStats.avgCarcassRatio}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Grade A Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-2xl font-bold">{slaughterStats.qualityGradeA}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Records */}
            <SlaughterRecords />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SlaughterRecording;
