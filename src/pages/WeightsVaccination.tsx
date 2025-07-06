import { useState , useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AnimalCard } from "@/components/AnimalCard";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkpoint } from "@/types/checkpoint";
import { GetAnimalWithcheckPoints } from "@/Apis/Api";

const WeightsVaccination = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overdue");
  const { toast } = useToast();
  const [animals, setAnimals] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  // Helper function to create realistic checkpoint schedule for 2025
  const createCheckpointSchedule = (animalTag: string, targetStatus: 'overdue' | 'due-today' | 'due-tomorrow', targetDay: number) => {
    const today = new Date('2025-06-30'); // Today is June 30th, 2025
    const todayStr = today.toISOString().split('T')[0];
    const tomorrow = new Date('2025-07-01');
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    // Calculate arrival date based on target checkpoint and status
    let targetDate: Date;
    if (targetStatus === 'overdue') {
      targetDate = new Date('2025-06-28'); // Make target checkpoint 2 days overdue
    } else if (targetStatus === 'due-today') {
      targetDate = today;
    } else { // due-tomorrow
      targetDate = tomorrow;
    }
    
    // Calculate arrival date by subtracting target day from target date
    const arrivalDate = new Date(targetDate);
    arrivalDate.setDate(targetDate.getDate() - targetDay);
    const arrivalDateStr = arrivalDate.toISOString().split('T')[0];
    
    const checkpoints: Checkpoint[] = [];
    const days = [0, 3, 7, 21, 50, 75];
    const names = ["Arrival", "Day 3 Check", "Day 7 Check", "Day 21 Check", "Day 50 Check", "Day 75 Check"];
    
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const scheduledDate = new Date(arrivalDate);
      scheduledDate.setDate(arrivalDate.getDate() + day);
      const scheduledDateStr = scheduledDate.toISOString().split('T')[0];
      
      let completed = false;
      let actualDate = undefined;
      let weight = undefined;
      
      // Day 0 (arrival) is ALWAYS completed
      if (day === 0) {
        completed = true;
        actualDate = arrivalDateStr;
        weight = 400;
      }
      // Complete all checkpoints BEFORE the target day
      else if (day < targetDay) {
        completed = true;
        actualDate = scheduledDateStr;
        weight = 400 + (day * 10);
      }
      // The target day - this is the one that should be overdue/due today/due tomorrow
      else if (day === targetDay) {
        completed = false;
        // scheduledDateStr is already calculated correctly above
      }
      // All days AFTER the target day remain upcoming (not completed, future dates)
      else {
        completed = false;
        // Future checkpoints keep their calculated future dates
      }
      
      checkpoints.push({
        id: `${animalTag}-day-${day}`,
        animalTag,
        day,
        name: names[i],
        scheduledDate: scheduledDateStr,
        completed,
        actualDate,
        weight,
        // Add sample data for completed checkpoints only
        ...(completed && day > 0 ? {
          vaccine: {
            name: `Vaccine-${day}`,
            batch: `BATCH-${day}-2025`,
            dose: "2ml"
          },
          dewormer: {
            name: "Ivermectin",
            dose: "10ml"
          },
          notes: `Day ${day} check completed successfully. Animal healthy.`
        } : {})
      });
    }

    return { checkpoints, arrivalDate: arrivalDateStr };
  };


  // Helper function to get status counts based on checkpoints
  const getStatusCounts = () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const overdue = animals.filter(animal => 
      animal.checkpoints.some(cp => !cp.completed && cp.scheduledDate < today)
    ).length;
    
    const dueToday = animals.filter(animal => 
      animal.checkpoints.some(cp => !cp.completed && cp.scheduledDate === today)
    ).length;
    
    const dueTomorrow = animals.filter(animal => 
      animal.checkpoints.some(cp => !cp.completed && cp.scheduledDate === tomorrow)
    ).length;
    
    return { overdue, dueToday, dueTomorrow };
  };

  // Helper function to filter animals based on their checkpoint status
  const getFilteredAnimals = (status: string) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return animals.filter(animal => {
      switch (status) {
        case 'overdue':
          return animal.checkpoints.some(cp => !cp.completed && cp.scheduledDate < today);
        case 'due-today':
          return animal.checkpoints.some(cp => !cp.completed && cp.scheduledDate === today);
        case 'due-tomorrow':
          return animal.checkpoints.some(cp => !cp.completed && cp.scheduledDate === tomorrow);
        default:
          return false;
      }
    });
  };

  const handleWeightUpdate = (tag: string, newWeight: number) => {
    setAnimals(prev => prev.map(animal => 
      animal.tag === tag 
        ? { ...animal, weight: newWeight }
        : animal
    ));
  };

  const handleCheckpointUpdate = (animalTag: string, updatedCheckpoint: Checkpoint) => {
    setAnimals(prev => prev.map(animal => 
      animal.tag === animalTag 
        ? { 
            ...animal, 
            checkpoints: animal.checkpoints.map(cp => 
              cp.id === updatedCheckpoint.id ? updatedCheckpoint : cp
            )
          }
        : animal
    ));
  };

  const { overdue, dueToday, dueTomorrow } = getStatusCounts();



useEffect(() => {
  const fetchAnimals = async () => {
    try {
      const data = await GetAnimalWithcheckPoints();

      const formattedData = data.map(animal => ({
        ...animal,
        checkpoints: animal.checkpoints.map(cp => ({
          id: `cp-${cp.checkpoint_id}`,
          animalTag: animal.tag,
          day: cp.day_offset ?? 0,
          name: cp.checkpoint_label,
          scheduledDate: cp.scheduled_date?.split('T')[0],
          completed: !!cp.completed_at,
          actualDate: cp.check_date ?? undefined,
          weight: cp.weight_kg ?? undefined,
          vaccine: cp.record_notes?.includes("vaccine") ? {
            name: "Example Vaccine",
            batch: "BATCH-001",
            dose: "2ml"
          } : undefined,
          dewormer: cp.record_notes?.includes("deworm") ? {
            name: "Ivermectin",
            dose: "10ml"
          } : undefined,
          notes: cp.record_notes ?? ""
        }))
      }));

      setAnimals(formattedData);
    } catch (err) {
      setError("Failed to load animal data");
    } finally {
      setLoading(false);
    }
  };

  fetchAnimals();
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
                <h1 className="text-3xl font-bold text-gray-900">Weights & Vaccination</h1>
                <p className="text-gray-600 mt-1">Monitor and update animal health data</p>
              </div>
            </div>

            {/* Tabs Section */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger 
                  value="overdue" 
                  className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800"
                >
                  Overdue ({overdue})
                </TabsTrigger>
                <TabsTrigger 
                  value="due-today"
                  className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
                >
                  Due Today ({dueToday})
                </TabsTrigger>
                <TabsTrigger 
                  value="due-tomorrow"
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                >
                  Due Tomorrow ({dueTomorrow})
                </TabsTrigger>
              </TabsList>

              {/* Tab Content */}
              <TabsContent value="overdue" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {getFilteredAnimals("overdue").map((animal) => (
                    <AnimalCard
                      key={animal.tag}
                      {...animal}
                      onWeightUpdate={handleWeightUpdate}
                      onCheckpointUpdate={handleCheckpointUpdate}
                    />
                  ))}
                </div>
                {getFilteredAnimals("overdue").length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No overdue animals found.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="due-today" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {getFilteredAnimals("due-today").map((animal) => (
                    <AnimalCard
                      key={animal.tag}
                      {...animal}
                      onWeightUpdate={handleWeightUpdate}
                      onCheckpointUpdate={handleCheckpointUpdate}
                    />
                  ))}
                </div>
                {getFilteredAnimals("due-today").length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No animals due today.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="due-tomorrow" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {getFilteredAnimals("due-tomorrow").map((animal) => (
                    <AnimalCard
                      key={animal.tag}
                      {...animal}
                      onWeightUpdate={handleWeightUpdate}
                      onCheckpointUpdate={handleCheckpointUpdate}
                    />
                  ))}
                </div>
                {getFilteredAnimals("due-tomorrow").length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No animals due tomorrow.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default WeightsVaccination;
