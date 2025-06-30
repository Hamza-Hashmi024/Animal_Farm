import { useState } from "react";
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

const WeightsVaccination = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overdue");
  const { toast } = useToast();

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

  // Mock data with CORRECTED 2025 dates and Pakistani names
  const [animals, setAnimals] = useState(() => {
    const animalsData = [
      // Overdue animals - each has ONLY ONE overdue checkpoint
      { 
        tag: "TAG-001", 
        srNo: "001",
        breed: "Holstein", 
        coatColor: "Black & White",
        age: 18,
        weight: 450, 
        arrivalWeight: 400,
        adg: 1.3, 
        status: "Active", 
        farm: "Farm A", 
        pen: "Pen 3", 
        investor: "Muhammad Ali Khan",
        doctor: "Dr. Ahmed Hassan",
        price: 45000,
        ratePerKg: 112.5,
        mandi: "Central Market",
        purchaser: "Farm Manager",
        targetStatus: 'overdue' as const,
        targetDay: 21
      },
      { 
        tag: "TAG-004", 
        srNo: "004",
        breed: "Jersey", 
        coatColor: "Brown",
        age: 16,
        weight: 320, 
        arrivalWeight: 290,
        adg: 1.0, 
        status: "Active", 
        farm: "Farm C", 
        pen: "Pen 1", 
        investor: "Fatima Sheikh",
        doctor: "Dr. Zafar Iqbal",
        price: 32000,
        ratePerKg: 110,
        mandi: "Local Market",
        purchaser: "Farm Manager",
        targetStatus: 'overdue' as const,
        targetDay: 7
      },
      { 
        tag: "TAG-007", 
        srNo: "007",
        breed: "Simmental", 
        coatColor: "Red & White",
        age: 20,
        weight: 520, 
        arrivalWeight: 480,
        adg: 1.4, 
        status: "Active", 
        farm: "Farm B", 
        pen: "Pen 4", 
        investor: "Asad Rahman",
        doctor: "Dr. Sana Malik",
        price: 52000,
        ratePerKg: 108,
        mandi: "Premium Market",
        purchaser: "Hassan Ahmed",
        targetStatus: 'overdue' as const,
        targetDay: 3
      },
      // Due today animals - each has ONLY ONE checkpoint due today
      { 
        tag: "TAG-002", 
        srNo: "002",
        breed: "Angus", 
        coatColor: "Black",
        age: 15,
        weight: 387, 
        arrivalWeight: 350,
        adg: 1.1, 
        status: "Active", 
        farm: "Farm B", 
        pen: "Pen 1", 
        investor: "Zainab Hussain",
        doctor: "Dr. Tariq Mahmood",
        price: 38500,
        ratePerKg: 110,
        mandi: "Livestock Market",
        purchaser: "Hassan Ahmed",
        targetStatus: 'due-today' as const,
        targetDay: 21
      },
      { 
        tag: "TAG-005", 
        srNo: "005",
        breed: "Charolais", 
        coatColor: "Cream",
        age: 14,
        weight: 395, 
        arrivalWeight: 360,
        adg: 1.2, 
        status: "Active", 
        farm: "Farm A", 
        pen: "Pen 5", 
        investor: "Usman Malik",
        doctor: "Dr. Ahmed Hassan",
        price: 39500,
        ratePerKg: 109,
        mandi: "Central Market",
        purchaser: "Farm Manager",
        targetStatus: 'due-today' as const,
        targetDay: 3
      },
      { 
        tag: "TAG-008", 
        srNo: "008",
        breed: "Limousin", 
        coatColor: "Golden",
        age: 17,
        weight: 430, 
        arrivalWeight: 400,
        adg: 1.0, 
        status: "Active", 
        farm: "Farm C", 
        pen: "Pen 2", 
        investor: "Khadija Awan",
        doctor: "Dr. Zafar Iqbal",
        price: 43000,
        ratePerKg: 107,
        mandi: "Regional Market",
        purchaser: "Hassan Ahmed",
        targetStatus: 'due-today' as const,
        targetDay: 50
      },
      // Due tomorrow animals - each has ONLY ONE checkpoint due tomorrow
      { 
        tag: "TAG-003", 
        srNo: "003",
        breed: "Hereford", 
        coatColor: "Red & White",
        age: 12,
        weight: 298, 
        arrivalWeight: 280,
        adg: 0.9, 
        status: "Active", 
        farm: "Farm A", 
        pen: "Pen 2",
        doctor: "Dr. Ahmed Hassan",
        price: 30800,
        ratePerKg: 110,
        mandi: "Regional Market",
        purchaser: "Farm Manager",
        targetStatus: 'due-tomorrow' as const,
        targetDay: 7
      },
      { 
        tag: "TAG-006", 
        srNo: "006",
        breed: "Brahman", 
        coatColor: "Gray",
        age: 19,
        weight: 465, 
        arrivalWeight: 430,
        adg: 1.1, 
        status: "Active", 
        farm: "Farm B", 
        pen: "Pen 3", 
        investor: "Naveed Siddiqui",
        doctor: "Dr. Sana Malik",
        price: 46500,
        ratePerKg: 108,
        mandi: "Livestock Market",
        purchaser: "Hassan Ahmed",
        targetStatus: 'due-tomorrow' as const,
        targetDay: 21
      },
      { 
        tag: "TAG-009", 
        srNo: "009",
        breed: "Shorthorn", 
        coatColor: "Roan",
        age: 13,
        weight: 310, 
        arrivalWeight: 285,
        adg: 0.8, 
        status: "Active", 
        farm: "Farm C", 
        pen: "Pen 6", 
        investor: "Ayesha Nasir",
        doctor: "Dr. Zafar Iqbal",
        price: 31000,
        ratePerKg: 109,
        mandi: "Local Market",
        purchaser: "Farm Manager",
        targetStatus: 'due-tomorrow' as const,
        targetDay: 3
      }
    ];

    // Generate checkpoints and arrival dates for each animal
    return animalsData.map(animal => {
      const { checkpoints, arrivalDate } = createCheckpointSchedule(
        animal.tag, 
        animal.targetStatus, 
        animal.targetDay
      );
      
      return {
        ...animal,
        arrivalDate,
        purchaseDate: arrivalDate,
        checkpoints
      };
    });
  });

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
