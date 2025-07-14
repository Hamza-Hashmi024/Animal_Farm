import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewDeathForm } from "@/components/NewDeathForm";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Calendar, Skull, AlertTriangle, HeartOff } from "lucide-react";
import { useState , useEffect } from "react";
import { GetAllDeathRecord } from "@/Apis/Api";

const Death = () => {
  const [isAddDeathOpen, setIsAddDeathOpen] = useState(false);
    const [deaths, setDeaths] = useState([]);

  const handleAddDeath = (data: Omit<(typeof deaths)[0], "id" | "status">) => {
    const newDeath = {
      ...data,
      id: deaths.length + 1,
      status: "Pending",
      date: new Date(data.date),
    };
    setDeaths((prev) => [...prev, newDeath]);
  };

  const reviewedDeaths = deaths.filter((d) => d.status === "Reviewed");
  const pendingDeaths = deaths.filter((d) => d.status === "Pending");

 useEffect(() => {
    const fetchDeaths = async () => {
      try {
        const response = await GetAllDeathRecord();
        const formattedData = response.map((item: any) => ({
          id: item.death_id,
          animalId: item.animal_id,
          cause: item.major_cause,
          date: new Date(item.date),
          location: item.location,
          status: "Pending", // Set this based on actual field if available
        }));

        setDeaths(formattedData);
      } catch (error) {
        console.error("Failed to fetch death records:", error);
      }
    };

    fetchDeaths();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />

        <main className="flex-1 overflow-hidden">
          <DashboardHeader />

          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Death Report
                </h1>
                <p className="text-gray-600 mt-1">
                  Track and review livestock death records across your farms.
                </p>
              </div>

              <Button
                onClick={() => setIsAddDeathOpen(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Report New Death
              </Button>
            </div>

            <Dialog open={isAddDeathOpen} onOpenChange={setIsAddDeathOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Report New Death</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to log a new animal death.
                  </DialogDescription>
                </DialogHeader>
                <NewDeathForm
                  onSubmit={(data) => {
                    handleAddDeath(data);
                    setIsAddDeathOpen(false);
                  }}
                  onClose={() => setIsAddDeathOpen(false)}
                />
              </DialogContent>
            </Dialog>

            {/* Death Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Deaths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Skull className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-2xl font-bold">{deaths.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Reviewed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <HeartOff className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold">
                      {reviewedDeaths.length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Pending Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-2xl font-bold">
                      {pendingDeaths.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Death List */}
            <Card>
              <CardHeader>
                <CardTitle>All Death Records</CardTitle>
                <CardDescription>
                  Detailed logs of animal deaths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deaths.map((death) => (
                    <div
                      key={death.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Animal ID: {death.animalId}
                            </h3>
                            <Badge
                              variant={
                                death.status === "Reviewed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {death.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-gray-600">Cause</p>
                              <p className="font-medium">{death.cause}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Location</p>
                              <p className="font-medium">{death.location}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="font-medium flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(death.date).toLocaleDateString()}
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
    </SidebarProvider>
  );
};

export default Death;
