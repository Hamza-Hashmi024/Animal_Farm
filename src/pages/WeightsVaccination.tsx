
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

const WeightsVaccination = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overdue");
  const { toast } = useToast();

  // Mock data for animals needing attention
  const [animals, setAnimals] = useState([
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
      lastWeightCheck: "2024-01-20",
      lastVaccination: "2024-01-10",
      dueStatus: "overdue"
    },
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
      lastWeightCheck: "2024-06-29",
      lastVaccination: "2024-06-25",
      dueStatus: "due-today"
    },
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
      lastWeightCheck: "2024-06-28",
      lastVaccination: "2024-06-20",
      dueStatus: "due-tomorrow"
    }
  ]);

  const getStatusCounts = () => {
    const overdue = animals.filter(a => a.dueStatus === "overdue").length;
    const dueToday = animals.filter(a => a.dueStatus === "due-today").length;
    const dueTomorrow = animals.filter(a => a.dueStatus === "due-tomorrow").length;
    return { overdue, dueToday, dueTomorrow };
  };

  const getFilteredAnimals = (status: string) => {
    return animals.filter(animal => 
      animal.dueStatus === status &&
      (animal.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
       animal.srNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
       animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (animal.investor && animal.investor.toLowerCase().includes(searchTerm.toLowerCase())) ||
       (animal.doctor && animal.doctor.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  };

  const handleWeightUpdate = (tag: string, newWeight: number) => {
    setAnimals(prev => prev.map(animal => 
      animal.tag === tag 
        ? { ...animal, weight: newWeight, lastWeightCheck: new Date().toISOString().split('T')[0] }
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
                      tag={animal.tag}
                      srNo={animal.srNo}
                      breed={animal.breed}
                      coatColor={animal.coatColor}
                      age={animal.age}
                      weight={animal.weight}
                      arrivalWeight={animal.arrivalWeight}
                      adg={animal.adg}
                      status={animal.status}
                      farm={animal.farm}
                      pen={animal.pen}
                      investor={animal.investor}
                      doctor={animal.doctor}
                      purchaseDate={animal.purchaseDate}
                      price={animal.price}
                      ratePerKg={animal.ratePerKg}
                      mandi={animal.mandi}
                      purchaser={animal.purchaser}
                      onWeightUpdate={handleWeightUpdate}
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
                      tag={animal.tag}
                      srNo={animal.srNo}
                      breed={animal.breed}
                      coatColor={animal.coatColor}
                      age={animal.age}
                      weight={animal.weight}
                      arrivalWeight={animal.arrivalWeight}
                      adg={animal.adg}
                      status={animal.status}
                      farm={animal.farm}
                      pen={animal.pen}
                      investor={animal.investor}
                      doctor={animal.doctor}
                      purchaseDate={animal.purchaseDate}
                      price={animal.price}
                      ratePerKg={animal.ratePerKg}
                      mandi={animal.mandi}
                      purchaser={animal.purchaser}
                      onWeightUpdate={handleWeightUpdate}
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
                      tag={animal.tag}
                      srNo={animal.srNo}
                      breed={animal.breed}
                      coatColor={animal.coatColor}
                      age={animal.age}
                      weight={animal.weight}
                      arrivalWeight={animal.arrivalWeight}
                      adg={animal.adg}
                      status={animal.status}
                      farm={animal.farm}
                      pen={animal.pen}
                      investor={animal.investor}
                      doctor={animal.doctor}
                      purchaseDate={animal.purchaseDate}
                      price={animal.price}
                      ratePerKg={animal.ratePerKg}
                      mandi={animal.mandi}
                      purchaser={animal.purchaser}
                      onWeightUpdate={handleWeightUpdate}
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
