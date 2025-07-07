import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MapPin, Search } from "lucide-react";
import { GetFilteredAnimalsApi ,AnimalListApi, } from "@/Apis/Api";

const FindAnimals = () => {
  const [allAnimals, setAllAnimals] = useState([]);
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [selectedFarm, setSelectedFarm] = useState("all");
  const [selectedPen, setSelectedPen] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [farms, setFarms] = useState<string[]>([]);
  const [pens, setPens] = useState<string[]>([]);

useEffect(() => {
  const fetchAnimalMeta = async () => {
    try {
      const data = await AnimalListApi();

      const farmSet = new Set<string>();
      const penSet = new Set<string>();

      data.forEach((animal) => {
        if (animal.farm) farmSet.add(animal.farm.trim());
        if (animal.pen) penSet.add(animal.pen.trim());
      });

      setFarms([...farmSet]);
      setPens([...penSet]);
    } catch (error) {
      console.error("Failed to fetch animals metadata:", error);
    }
  };

  fetchAnimalMeta();
}, []);

const handleSearch = async () => {
  try {
    const filters = {
  minWeight: parseFloat(minWeight) || 0,
  maxWeight: parseFloat(maxWeight) || 99999,
  farm: selectedFarm,
  pen: selectedPen,
};

    const filteredAnimals = await GetFilteredAnimalsApi(filters);
    setSearchResults(filteredAnimals);
  } catch (error) {
    console.error("Error fetching filtered animals:", error);
  }
};

useEffect(() => {
  handleSearch();
}, []);

const resetFilters = () => {
  setMinWeight("");
  setMaxWeight("");
  setSelectedFarm("all");
  setSelectedPen("all");
  handleSearch(); 
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
              <p className="text-gray-600 mt-1">
                Locate animals by weight range across farms and pens
              </p>
            </div>

            {/* Search Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Criteria
                </CardTitle>
                <CardDescription>
                  Set weight range and location filters to find animals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Min Weight (kg)
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g., 250"
                      value={minWeight}
                      onChange={(e) => setMinWeight(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Max Weight (kg)
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g., 500"
                      value={maxWeight}
                      onChange={(e) => setMaxWeight(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Farm</label>
                    <Select
                      value={selectedFarm}
                      onValueChange={setSelectedFarm}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select farm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Farms</SelectItem>
                        {farms.map((farm) => (
                          <SelectItem key={farm} value={farm}>
                            {farm}
                          </SelectItem>
                        ))}
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
                        {pens.map((pen) => (
                          <SelectItem key={pen} value={pen}>
                            {pen}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium invisible">
                      Actions
                    </label>
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
                    Found {searchResults.length} animal(s) matching your
                    criteria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {searchResults.map((animal, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-blue-900">
                              {animal.tag}
                            </p>
                            <p className="text-sm text-gray-600">
                              {animal.breed}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{animal.weight} kg</p>
                          <p className="text-sm text-gray-600">
                            {animal.farm} • {animal.pen}
                          </p>
                          <p className="text-xs text-gray-500">
                            {animal.adg} kg/day ADG
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Results Message */}
            {searchResults.length === 0 &&
              (minWeight ||
                maxWeight ||
                selectedFarm !== "all" ||
                selectedPen !== "all") && (
                <Card>
                  <CardContent className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      No animals found matching your criteria
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Try adjusting your search filters and search again
                    </p>
                  </CardContent>
                </Card>
              )}

            {/* Initial State */}
            {searchResults.length === 0 &&
              !minWeight &&
              !maxWeight &&
              selectedFarm === "all" &&
              selectedPen === "all" && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      Ready to search for animals
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Set your weight range and location filters, then click
                      Search
                    </p>
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
