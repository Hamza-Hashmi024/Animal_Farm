
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { HealthAlerts } from "@/components/HealthAlerts";
import { ScheduledCheckpoints } from "@/components/ScheduledCheckpoints";
import { CheckpointHistory } from "@/components/CheckpointHistory";
import { Calendar, Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Checkpoint, AnimalWithCheckpoints } from "@/types/checkpoint";
import { generateCheckpointSchedule, getOverdueCheckpoints, getDueCheckpoints } from "@/utils/checkpointUtils";

const Health = () => {
  // Mock data with checkpoint information
  const [mockAnimals] = useState<AnimalWithCheckpoints[]>([
    {
      tag: "TAG-001",
      srNo: "001",
      breed: "Holstein",
      weight: 450,
      arrivalWeight: 380,
      arrivalDate: "2024-06-01",
      adg: 1.3,
      status: "Active",
      farm: "Farm A",
      pen: "Pen 3",
      checkpoints: generateCheckpointSchedule("TAG-001", "2024-06-01")
    },
    {
      tag: "TAG-002", 
      srNo: "002",
      breed: "Angus",
      weight: 387,
      arrivalWeight: 320,
      arrivalDate: "2024-06-15",
      adg: 1.1,
      status: "Active",
      farm: "Farm B",
      pen: "Pen 1",
      checkpoints: generateCheckpointSchedule("TAG-002", "2024-06-15")
    }
  ]);

  const [selectedAnimal, setSelectedAnimal] = useState<AnimalWithCheckpoints | null>(mockAnimals[0]);

  // Aggregate checkpoint data
  const allCheckpoints = mockAnimals.flatMap(animal => animal.checkpoints);
  const overdueCheckpoints = getOverdueCheckpoints(allCheckpoints);
  const dueCheckpoints = getDueCheckpoints(allCheckpoints);
  const completedCheckpoints = allCheckpoints.filter(cp => cp.completed);

  // Legacy alerts for compatibility
  const alerts = [
    { id: 1, animal: "Tag-001", type: "Weight Check Due", farm: "Farm A", pen: "Pen 3", priority: "medium" },
    { id: 2, animal: "Tag-043", type: "Vaccination Due", farm: "Farm B", pen: "Pen 1", priority: "high" },
    { id: 3, animal: "Tag-127", type: "Low ADG Alert", farm: "Farm A", pen: "Pen 5", priority: "high" },
    { id: 4, animal: "Tag-089", type: "Deworming Due", farm: "Farm C", pen: "Pen 2", priority: "medium" },
  ];

  const handleCheckpointUpdate = (updatedCheckpoint: Checkpoint) => {
    if (!selectedAnimal) return;

    const updatedAnimal = {
      ...selectedAnimal,
      checkpoints: selectedAnimal.checkpoints.map(cp => 
        cp.id === updatedCheckpoint.id ? updatedCheckpoint : cp
      )
    };
    setSelectedAnimal(updatedAnimal);
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
                <h1 className="text-3xl font-bold text-gray-900">Health Monitoring</h1>
                <p className="text-gray-600 mt-1">Scheduled checkpoints and health management</p>
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
                  <CardTitle className="text-sm font-medium text-gray-600">Overdue Checkpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-2xl font-bold">{overdueCheckpoints.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Due Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-2xl font-bold">{dueCheckpoints.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold">{completedCheckpoints.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Animals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold">{mockAnimals.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Animal Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Animal</CardTitle>
                  <CardDescription>Choose an animal to view checkpoints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockAnimals.map((animal) => (
                      <div
                        key={animal.tag}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedAnimal?.tag === animal.tag ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedAnimal(animal)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{animal.tag}</p>
                            <p className="text-sm text-gray-600">{animal.breed} • {animal.farm}</p>
                          </div>
                          <Badge variant={getOverdueCheckpoints(animal.checkpoints).length > 0 ? 'destructive' : 'outline'}>
                            {getOverdueCheckpoints(animal.checkpoints).length > 0 ? 'Overdue' : 'On Track'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Health Alerts */}
              <HealthAlerts alerts={alerts} />

              {/* Quick Stats for Selected Animal */}
              {selectedAnimal && (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedAnimal.tag} Overview</CardTitle>
                    <CardDescription>Current status and key metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Weight</span>
                        <span className="font-semibold">{selectedAnimal.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Arrival Weight</span>
                        <span className="font-semibold">{selectedAnimal.arrivalWeight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Gain</span>
                        <span className="font-semibold">{selectedAnimal.weight - selectedAnimal.arrivalWeight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current ADG</span>
                        <span className="font-semibold">{selectedAnimal.adg} kg/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed Checkpoints</span>
                        <span className="font-semibold">
                          {selectedAnimal.checkpoints.filter(cp => cp.completed).length} / {selectedAnimal.checkpoints.length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Checkpoint Management */}
            {selectedAnimal && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScheduledCheckpoints 
                  checkpoints={selectedAnimal.checkpoints}
                  onCheckpointUpdate={handleCheckpointUpdate}
                />
                <CheckpointHistory 
                  checkpoints={selectedAnimal.checkpoints}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Health;
