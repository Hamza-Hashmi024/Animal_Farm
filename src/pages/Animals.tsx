
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AnimalCard } from "@/components/AnimalCard";
import { Search, Filter, Plus } from "lucide-react";

const Animals = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for animals
  const animals = [
    { tag: "TAG-001", breed: "Holstein", weight: 450, adg: 1.3, status: "Active", farm: "Farm A", pen: "Pen 3" },
    { tag: "TAG-002", breed: "Angus", weight: 387, adg: 1.1, status: "Active", farm: "Farm B", pen: "Pen 1" },
    { tag: "TAG-003", breed: "Hereford", weight: 298, adg: 0.9, status: "Quarantine", farm: "Farm A", pen: "Quarantine" },
    { tag: "TAG-004", breed: "Charolais", weight: 523, adg: 1.4, status: "Active", farm: "Farm C", pen: "Pen 2" },
    { tag: "TAG-005", breed: "Limousin", weight: 412, adg: 1.2, status: "Active", farm: "Farm B", pen: "Pen 4" },
    { tag: "TAG-006", breed: "Simmental", weight: 335, adg: 1.0, status: "Active", farm: "Farm A", pen: "Pen 1" },
  ];

  const filteredAnimals = animals.filter(animal =>
    animal.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <p className="text-gray-600 mt-1">Manage and monitor all livestock across farms</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Animal
              </Button>
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
                      placeholder="Search by tag number, breed..."
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
                </div>
              </CardContent>
            </Card>

            {/* Animals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnimals.map((animal) => (
                <AnimalCard
                  key={animal.tag}
                  tag={animal.tag}
                  breed={animal.breed}
                  weight={animal.weight}
                  adg={animal.adg}
                  status={animal.status}
                  farm={animal.farm}
                  pen={animal.pen}
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
