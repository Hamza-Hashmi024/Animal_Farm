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
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Centralized date (today) for consistency across all logic
  const today = new Date(); // use current system date
  const todayStr = today.toISOString().split("T")[0];
  const tomorrowStr = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Count checkpoints by status
  const getStatusCounts = () => {
    const overdue = animals.filter(animal =>
      animal.checkpoints.some(cp => !cp.completed && cp.scheduledDate < todayStr)
    ).length;

    const dueToday = animals.filter(animal =>
      animal.checkpoints.some(cp => !cp.completed && cp.scheduledDate === todayStr)
    ).length;

    const dueTomorrow = animals.filter(animal =>
      animal.checkpoints.some(cp => !cp.completed && cp.scheduledDate === tomorrowStr)
    ).length;

    return { overdue, dueToday, dueTomorrow };
  };


console.log("Today:", todayStr);
console.log("Animals:", animals);

  // Filter animals based on tab (status)
  const getFilteredAnimals = (status: string) => {
    return animals.filter(animal => {
      return animal.checkpoints.some(cp => {
        if (cp.completed) return false;
        if (status === "overdue") return cp.scheduledDate < todayStr;
        if (status === "due-today") return cp.scheduledDate === todayStr;
        if (status === "due-tomorrow") return cp.scheduledDate === tomorrowStr;
        return false;
      });
    });
  };

  const handleWeightUpdate = (tag: string, newWeight: number) => {
    setAnimals(prev =>
      prev.map(animal =>
        animal.tag === tag ? { ...animal, weight: newWeight } : animal
      )
    );
  };

  const handleCheckpointUpdate = (animalTag: string, updatedCheckpoint: Checkpoint) => {
    setAnimals(prev =>
      prev.map(animal =>
        animal.tag === animalTag
          ? {
              ...animal,
              checkpoints: animal.checkpoints.map(cp =>
                cp.id === updatedCheckpoint.id ? updatedCheckpoint : cp
              )
            }
          : animal
      )
    );
  };

useEffect(() => {
  const fetchAnimals = async () => {
    try {
      const data = await GetAnimalWithcheckPoints();

      const formattedData = data.map(animal => {
        const checkpoints = animal.checkpoints.map(cp => {
          // Safely extract date string in 'YYYY-MM-DD' format
          const rawDate = cp.scheduled_date;
          const scheduledDate = rawDate
            ? new Date(rawDate).toLocaleDateString("en-CA") // handles timezones better
            : undefined;

          // Debug log to verify matching
          console.log(
            `Animal: ${animal.tag}, Checkpoint: ${cp.checkpoint_label}, Scheduled: ${scheduledDate}, Today: ${today.toLocaleDateString("en-CA")}`
          );

          return {
            id: `cp-${cp.checkpoint_id}`,
            animalTag: animal.tag,
            day: cp.day_offset ?? 0,
            name: cp.checkpoint_label,
            scheduledDate,
            completed: !!cp.completed_at,
            actualDate: cp.check_date ?? undefined,
            weight: cp.weight_kg ?? undefined,
            vaccine: cp.record_notes?.includes("vaccine")
              ? {
                  name: "Example Vaccine",
                  batch: "BATCH-001",
                  dose: "2ml"
                }
              : undefined,
            dewormer: cp.record_notes?.includes("deworm")
              ? {
                  name: "Ivermectin",
                  dose: "10ml"
                }
              : undefined,
            notes: cp.record_notes ?? ""
          };
        });

        return { ...animal, checkpoints };
      });

      setAnimals(formattedData);
    } catch (err) {
      setError("Failed to load animal data");
    } finally {
      setLoading(false);
    }
  };

  fetchAnimals();
}, []);


  const { overdue, dueToday, dueTomorrow } = getStatusCounts();

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
