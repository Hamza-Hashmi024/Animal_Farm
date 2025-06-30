import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MapPin, Search } from "lucide-react";

const FindAnimals = () => {
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [selectedFarm, setSelectedFarm] = useState("all");
  const [selectedPen, setSelectedPen] = useState("all");
  const [searchResults, setSearchResults] = useState([]);

  const allAnimals = [
    { tag: "TAG-234", breed: "Holstein", adg: 0.4, weight: 287, farm: "Farm C", pen: "Pen 1" },
    { tag: "TAG-156", breed: "Hereford", adg: 0.3, weight: 301, farm: "Farm B", pen: "Pen 2" },
    { tag: "TAG-098", breed: "Charolais", adg: 0.5, weight: 298, farm: "Farm A", pen: "Pen 1" },
    { tag: "TAG-045", breed: "Charolais", adg: 1.8, weight: 512, farm: "Farm B", pen: "Pen 3" },
    { tag: "TAG-123", breed: "Limousin", adg: 1.7, weight: 487, farm: "Farm A", pen: "Pen 2" },
    { tag: "TAG-089", breed: "Angus", adg: 1.6, weight: 445, farm: "Farm C", pen: "Pen 1" },
    { tag: "TAG-167", breed: "Simmental", adg: 1.5, weight: 423, farm: "Farm A", pen: "Pen 3" },
    { tag: "TAG-321", breed: "Angus", adg: 0.7, weight: 315, farm: "Farm A", pen: "Pen 2" },
    { tag: "TAG-456", breed: "Holstein", adg: 1.2, weight: 365, farm: "Farm B", pen: "Pen 1" },
    { tag: "TAG-789", breed: "Hereford", adg: 1.1, weight: 398, farm: "Farm C", pen: "Pen 2" },
  ];

  const handleSearch = () => {
    const min = minWeight ? parseFloat(minWeight) : 0;
    const max = maxWeight ? parseFloat(maxWeight) : Infinity;
    
    const filtered = allAnimals.filter(animal => {
      const withinWeightRange = animal.weight >= min && animal.weight <= max;
      const farmMatch = selectedFarm === "all" || animal.farm === selectedFarm;
      const penMatch = selectedPen === "all" || animal.pen === selectedPen;
      
      return withinWeightRange && farmMatch && penMatch;
    });
    
    setSearchResults(filtered);
  };

  const resetFilters = () => {
    setMinWeight("");
    setMaxWeight("");
    setSelectedFarm("all");
    setSelectedPen("all");
    setSearchResults([]);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <DashboardHeader />
          
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Animals</h1>
              <p className="text-gray-600 mt-1">Locate animals by weight range across farms and pens</p>
            </div>

            {/* Search Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Criteria
                </CardTitle>
                <CardDescription>Set weight range and location filters to find animals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min Weight (kg)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 250"
                      value={minWeight}
                      onChange={(e) => setMinWeight(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Weight (kg)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 500"
                      value={maxWeight}
                      onChange={(e) => setMaxWeight(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Farm</label>
                    <Select value={selectedFarm} onValueChange={setSelectedFarm}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select farm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Farms</SelectItem>
                        <SelectItem value="Farm A">Farm A</SelectItem>
                        <SelectItem value="Farm B">Farm B</SelectItem>
                        <SelectItem value="Farm C">Farm C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pen</label>
                    <Select value={selectedPen} onValueChange={setSelectedPen}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Pens</SelectItem>
                        <SelectItem value="Pen 1">Pen 1</SelectItem>
                        <SelectItem value="Pen 2">Pen 2</SelectItem>
                        <SelectItem value="Pen 3">Pen 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium invisible">Actions</label>
                    <div className="flex gap-2">
                      <Button onClick={handleSearch} className="flex-1">
                        Search
                      </Button>
                      <Button variant="outline" onClick={resetFilters}>
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Search Results
                  </CardTitle>
                  <CardDescription>
                    Found {searchResults.length} animal(s) matching your criteria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {searchResults.map((animal, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-blue-900">{animal.tag}</p>
                            <p className="text-sm text-gray-600">{animal.breed}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{animal.weight} kg</p>
                          <p className="text-sm text-gray-600">{animal.farm} • {animal.pen}</p>
                          <p className="text-xs text-gray-500">{animal.adg} kg/day ADG</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Results Message */}
            {searchResults.length === 0 && (minWeight || maxWeight || selectedFarm !== "all" || selectedPen !== "all") && (
              <Card>
                <CardContent className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No animals found matching your criteria</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters and search again</p>
                </CardContent>
              </Card>
            )}

            {/* Initial State */}
            {searchResults.length === 0 && !minWeight && !maxWeight && selectedFarm === "all" && selectedPen === "all" && (
              <Card>
                <CardContent className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Ready to search for animals</p>
                  <p className="text-gray-400 text-sm mt-2">Set your weight range and location filters, then click Search</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default FindAnimals;
