import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AnimalCard } from "@/components/AnimalCard";
import { AddAnimalDialog } from "@/components/AddAnimalDialog";
import { Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Animals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Updated mock data with full registration details
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
      purchaser: "Farm Manager"
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
      purchaser: "John Doe"
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
      status: "Quarantine", 
      farm: "Farm A", 
      pen: "Quarantine",
      doctor: "Dr. Johnson",
      purchaseDate: "2024-03-05",
      price: 30800,
      ratePerKg: 110,
      mandi: "Regional Market",
      purchaser: "Farm Manager"
    },
    { 
      tag: "TAG-004", 
      srNo: "004",
      breed: "Charolais", 
      coatColor: "Cream",
      age: 20,
      weight: 523, 
      arrivalWeight: 480,
      adg: 1.4, 
      status: "Active", 
      farm: "Farm C", 
      pen: "Pen 2", 
      investor: "Emily Davis",
      doctor: "Dr. Brown",
      purchaseDate: "2024-01-20",
      price: 52800,
      ratePerKg: 110,
      mandi: "Central Market",
      purchaser: "livestock Agent"
    },
    { 
      tag: "TAG-005", 
      srNo: "005",
      breed: "Limousin", 
      coatColor: "Golden",
      age: 16,
      weight: 412, 
      arrivalWeight: 380,
      adg: 1.2, 
      status: "Active", 
      farm: "Farm B", 
      pen: "Pen 4", 
      investor: "Michael Chen",
      doctor: "Dr. Smith",
      purchaseDate: "2024-02-28",
      price: 41800,
      ratePerKg: 110,
      mandi: "Livestock Market",
      purchaser: "John Doe"
    },
    { 
      tag: "TAG-006", 
      srNo: "006",
      breed: "Simmental", 
      coatColor: "Red & White",
      age: 14,
      weight: 335, 
      arrivalWeight: 310,
      adg: 1.0, 
      status: "Active", 
      farm: "Farm A", 
      pen: "Pen 1", 
      investor: "John Smith",
      doctor: "Dr. Johnson",
      purchaseDate: "2024-03-15",
      price: 34100,
      ratePerKg: 110,
      mandi: "Central Market",
      purchaser: "Farm Manager"
    },
  ]);

  const filteredAnimals = animals.filter(animal =>
    animal.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.srNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (animal.investor && animal.investor.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (animal.doctor && animal.doctor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddAnimal = (newAnimal: any) => {
    setAnimals(prev => [...prev, newAnimal]);
  };

  const handleWeightUpdate = (tag: string, newWeight: number) => {
    setAnimals(prev => prev.map(animal => 
      animal.tag === tag 
        ? { ...animal, weight: newWeight }
        : animal
    ));
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
                <h1 className="text-3xl font-bold text-gray-900">Animal Management</h1>
                <p className="text-gray-600 mt-1">Register and monitor all livestock across farms</p>
              </div>
              <AddAnimalDialog onAddAnimal={handleAddAnimal} />
            </div>

            {/* Search and Filter Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search & Filter Animals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by tag, Sr. No., breed, investor, or doctor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">Total: {animals.length}</Badge>
                  <Badge variant="secondary">Active: {animals.filter(a => a.status === "Active").length}</Badge>
                  <Badge variant="destructive">Quarantine: {animals.filter(a => a.status === "Quarantine").length}</Badge>
                  <Badge variant="outline">Assigned: {animals.filter(a => a.investor).length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Animals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnimals.map((animal) => (
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

            {filteredAnimals.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No animals found matching your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Animals;
