
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
import { Search, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkpoint } from "@/types/checkpoint";

const WeightsVaccination = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overdue");
  const { toast } = useToast();

  // Helper function to create sequential checkpoint schedule
  const createCheckpointSchedule = (animalTag: string, arrivalDate: string, overdueDay?: number, dueTodayDay?: number, dueTomorrowDay?: number) => {
    const arrival = new Date(arrivalDate);
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const checkpoints: Checkpoint[] = [];
    const days = [0, 3, 7, 21, 50, 75];
    const names = ["Arrival", "Day 3 Check", "Day 7 Check", "Day 21 Check", "Day 50 Check", "Day 75 Check"];
    
    let foundOverdue = false;
    
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const scheduledDate = new Date(arrival.getTime() + day * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      let completed = false;
      let actualDate = undefined;
      let weight = undefined;
      
      // Day 0 (arrival) is always completed
      if (day === 0) {
        completed = true;
        actualDate = arrivalDate;
        weight = day === 0 ? 400 : undefined;
      }
      // If this is the overdue day, mark it as incomplete and stop completing future ones
      else if (day === overdueDay) {
        foundOverdue = true;
        completed = false;
      }
      // If this is due today
      else if (day === dueTodayDay) {
        foundOverdue = true;
        completed = false;
      }
      // If this is due tomorrow
      else if (day === dueTomorrowDay) {
        foundOverdue = true;
        completed = false;
      }
      // If we haven't found the target day yet, mark previous ones as completed
      else if (!foundOverdue && day < (overdueDay || dueTodayDay || dueTomorrowDay || 999)) {
        completed = true;
        actualDate = scheduledDate;
        weight = 400 + (day * 10); // Progressive weight gain
      }
      
      // Adjust scheduled date for specific scenarios
      let finalScheduledDate = scheduledDate;
      if (day === overdueDay) {
        finalScheduledDate = "2024-06-25"; // Make it clearly overdue
      } else if (day === dueTodayDay) {
        finalScheduledDate = today;
      } else if (day === dueTomorrowDay) {
        finalScheduledDate = tomorrow;
      }
      
      checkpoints.push({
        id: `${animalTag}-day-${day}`,
        animalTag,
        day,
        name: names[i],
        scheduledDate: finalScheduledDate,
        completed,
        actualDate,
        weight,
        // Add sample data for completed checkpoints
        ...(completed && day > 0 ? {
          vaccine: {
            name: `Vaccine-${day}`,
            batch: `BATCH-${day}-2024`,
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

    return checkpoints;
  };

  // Mock data for animals with proper sequential checkpoint schedules
  const [animals, setAnimals] = useState([
    // Overdue animals (3) - each with 1 overdue checkpoint and properly completed previous ones
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
      investor: "John Smith",
      doctor: "Dr. Johnson",
      purchaseDate: "2024-01-15",
      price: 45000,
      ratePerKg: 112.5,
      mandi: "Central Market",
      purchaser: "Farm Manager",
      arrivalDate: "2024-01-15",
      checkpoints: createCheckpointSchedule("TAG-001", "2024-01-15", 21) // Day 21 is overdue, 0,3,7 completed
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
      investor: "Mike Wilson",
      doctor: "Dr. Brown",
      purchaseDate: "2024-02-20",
      price: 32000,
      ratePerKg: 110,
      mandi: "Local Market",
      purchaser: "Farm Manager",
      arrivalDate: "2024-02-20",
      checkpoints: createCheckpointSchedule("TAG-004", "2024-02-20", 50) // Day 50 is overdue, 0,3,7,21 completed
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
      investor: "Lisa Davis",
      doctor: "Dr. Smith",
      purchaseDate: "2024-01-10",
      price: 52000,
      ratePerKg: 108,
      mandi: "Premium Market",
      purchaser: "John Doe",
      arrivalDate: "2024-01-10",
      checkpoints: createCheckpointSchedule("TAG-007", "2024-01-10", 7) // Day 7 is overdue, 0,3 completed
    },
    // Due today animals (3) - each with 1 checkpoint due today and properly completed previous ones
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
      investor: "Sarah Johnson",
      doctor: "Dr. Smith",
      purchaseDate: "2024-02-10",
      price: 38500,
      ratePerKg: 110,
      mandi: "Livestock Market",
      purchaser: "John Doe",
      arrivalDate: "2024-02-10",
      checkpoints: createCheckpointSchedule("TAG-002", "2024-02-10", undefined, 21) // Day 21 is due today, 0,3,7 completed
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
      investor: "Tom Anderson",
      doctor: "Dr. Johnson",
      purchaseDate: "2024-03-15",
      price: 39500,
      ratePerKg: 109,
      mandi: "Central Market",
      purchaser: "Farm Manager",
      arrivalDate: "2024-03-15",
      checkpoints: createCheckpointSchedule("TAG-005", "2024-03-15", undefined, 3) // Day 3 is due today, 0 completed
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
      investor: "Emma Thompson",
      doctor: "Dr. Brown",
      purchaseDate: "2024-02-05",
      price: 43000,
      ratePerKg: 107,
      mandi: "Regional Market",
      purchaser: "John Doe",
      arrivalDate: "2024-02-05",
      checkpoints: createCheckpointSchedule("TAG-008", "2024-02-05", undefined, 50) // Day 50 is due today, 0,3,7,21 completed
    },
    // Due tomorrow animals (3) - each with 1 checkpoint due tomorrow and properly completed previous ones
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
      doctor: "Dr. Johnson",
      purchaseDate: "2024-03-05",
      price: 30800,
      ratePerKg: 110,
      mandi: "Regional Market",
      purchaser: "Farm Manager",
      arrivalDate: "2024-03-05",
      checkpoints: createCheckpointSchedule("TAG-003", "2024-03-05", undefined, undefined, 7) // Day 7 is due tomorrow, 0,3 completed
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
      investor: "Robert Lee",
      doctor: "Dr. Smith",
      purchaseDate: "2024-01-25",
      price: 46500,
      ratePerKg: 108,
      mandi: "Livestock Market",
      purchaser: "John Doe",
      arrivalDate: "2024-01-25",
      checkpoints: createCheckpointSchedule("TAG-006", "2024-01-25", undefined, undefined, 21) // Day 21 is due tomorrow, 0,3,7 completed
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
      investor: "Nancy White",
      doctor: "Dr. Brown",
      purchaseDate: "2024-03-20",
      price: 31000,
      ratePerKg: 109,
      mandi: "Local Market",
      purchaser: "Farm Manager",
      arrivalDate: "2024-03-20",
      checkpoints: createCheckpointSchedule("TAG-009", "2024-03-20", undefined, undefined, 3) // Day 3 is due tomorrow, 0 completed
    }
  ]);

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
      const matchesSearch = animal.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.srNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (animal.investor && animal.investor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (animal.doctor && animal.doctor.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (!matchesSearch) return false;
      
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

  const handleDataEntry = () => {
    toast({
      title: "Data Entry",
      description: "Opening comprehensive weights & vaccination entry form..."
    });
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
              <Button onClick={handleDataEntry} className="bg-green-600 hover:bg-green-700">
                <Calendar className="h-4 w-4 mr-2" />
                Enter Weights & Vaccination
              </Button>
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

              {/* Search Section */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search Animals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Search by tag, Sr. No., breed, investor, or doctor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Tab Content */}
              <TabsContent value="overdue" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
