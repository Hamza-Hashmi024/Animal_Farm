
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Target, Scale, TrendingUp } from "lucide-react";

const Performance = () => {
  const [customCriteria, setCustomCriteria] = useState("");
  const [selectedFarm, setSelectedFarm] = useState("all");
  const [selectedPen, setSelectedPen] = useState("all");
  const [selectedBreed, setSelectedBreed] = useState("all");

  const allAnimals = [
    { tag: "TAG-234", breed: "Holstein", adg: 0.4, weight: 287, farm: "Farm C", pen: "Pen 1" },
    { tag: "TAG-156", breed: "Hereford", adg: 0.3, weight: 301, farm: "Farm B", pen: "Pen 2" },
    { tag: "TAG-098", breed: "Charolais", adg: 0.5, weight: 298, farm: "Farm A", pen: "Pen 1" },
    { tag: "TAG-045", breed: "Charolais", adg: 1.8, weight: 512, farm: "Farm B", pen: "Pen 3" },
    { tag: "TAG-123", breed: "Limousin", adg: 1.7, weight: 487, farm: "Farm A", pen: "Pen 2" },
    { tag: "TAG-089", breed: "Angus", adg: 1.6, weight: 445, farm: "Farm C", pen: "Pen 1" },
    { tag: "TAG-167", breed: "Simmental", adg: 1.5, weight: 423, farm: "Farm A", pen: "Pen 3" },
    { tag: "TAG-321", breed: "Angus", adg: 0.7, weight: 315, farm: "Farm A", pen: "Pen 2" },
  ];

  const filterAnimals = (animals) => {
    return animals.filter(animal => {
      return (selectedFarm === "all" || animal.farm === selectedFarm) &&
             (selectedPen === "all" || animal.pen === selectedPen) &&
             (selectedBreed === "all" || animal.breed === selectedBreed);
    });
  };

  const filteredAnimals = filterAnimals(allAnimals);

  const lowPerformers05 = filteredAnimals.filter(animal => animal.adg <= 0.5);
  const lowPerformers08 = filteredAnimals.filter(animal => animal.adg <= 0.8);
  const topPerformers = filteredAnimals.filter(animal => animal.adg >= 1.5);

  // Calculate averages
  const averageWeight = filteredAnimals.length > 0 
    ? (filteredAnimals.reduce((sum, animal) => sum + animal.weight, 0) / filteredAnimals.length).toFixed(1)
    : "0";

  const averageADG = filteredAnimals.length > 0 
    ? (filteredAnimals.reduce((sum, animal) => sum + animal.adg, 0) / filteredAnimals.length).toFixed(2)
    : "0";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <DashboardHeader />
          
          <div className="p-6 space-y-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Weight Performance</h1>
              <p className="text-gray-600 mt-1">Monitor livestock weight performance and ADG criteria</p>
            </div>

            {/* Filters Section - Even more compact */}
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm">Filters</CardTitle>
                <CardDescription className="text-xs">Filter animals by farm, pen, and breed</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Farm</label>
                    <Select value={selectedFarm} onValueChange={setSelectedFarm}>
                      <SelectTrigger className="h-7 text-xs">
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

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Pen</label>
                    <Select value={selectedPen} onValueChange={setSelectedPen}>
                      <SelectTrigger className="h-7 text-xs">
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

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Breed</label>
                    <Select value={selectedBreed} onValueChange={setSelectedBreed}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Select breed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Breeds</SelectItem>
                        <SelectItem value="Holstein">Holstein</SelectItem>
                        <SelectItem value="Hereford">Hereford</SelectItem>
                        <SelectItem value="Charolais">Charolais</SelectItem>
                        <SelectItem value="Limousin">Limousin</SelectItem>
                        <SelectItem value="Angus">Angus</SelectItem>
                        <SelectItem value="Simmental">Simmental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Cards - Even more compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                  <CardTitle className="text-xs font-medium">Average Weight</CardTitle>
                  <Scale className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pb-1">
                  <div className="text-lg font-bold">{averageWeight} kg</div>
                  <p className="text-xs text-muted-foreground">
                    Based on {filteredAnimals.length} animals
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                  <CardTitle className="text-xs font-medium">Average Daily Gain</CardTitle>
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pb-1">
                  <div className="text-lg font-bold">{averageADG} kg/day</div>
                  <p className="text-xs text-muted-foreground">
                    Based on {filteredAnimals.length} animals
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Low Performers Section */}
            <Card>
              <CardHeader>
                <CardTitle>Low Performers</CardTitle>
                <CardDescription>Animals below performance thresholds</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="0.5kg" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="0.5kg">ADG ≤ 0.5 kg</TabsTrigger>
                    <TabsTrigger value="0.8kg">ADG ≤ 0.8 kg</TabsTrigger>
                    <TabsTrigger value="custom">Set Custom Criteria</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="0.5kg" className="space-y-3 mt-4">
                    {lowPerformers05.length > 0 ? (
                      lowPerformers05.map((animal, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                          <div>
                            <p className="font-medium">{animal.tag}</p>
                            <p className="text-sm text-gray-600">{animal.breed} • {animal.farm} • {animal.pen}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-red-700">{animal.adg} kg/day</p>
                            <p className="text-sm text-gray-600">{animal.weight} kg</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No animals match the criteria</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="0.8kg" className="space-y-3 mt-4">
                    {lowPerformers08.length > 0 ? (
                      lowPerformers08.map((animal, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                          <div>
                            <p className="font-medium">{animal.tag}</p>
                            <p className="text-sm text-gray-600">{animal.breed} • {animal.farm} • {animal.pen}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-red-700">{animal.adg} kg/day</p>
                            <p className="text-sm text-gray-600">{animal.weight} kg</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No animals match the criteria</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="custom" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label htmlFor="custom-criteria" className="text-sm font-medium">
                          Custom ADG Threshold (kg/day):
                        </label>
                        <Input
                          id="custom-criteria"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 1.0"
                          value={customCriteria}
                          onChange={(e) => setCustomCriteria(e.target.value)}
                          className="w-32"
                        />
                        <Button size="sm">Apply Filter</Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Enter a custom ADG threshold to filter animals below this performance level.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Top Performers Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Top Performers
                </CardTitle>
                <CardDescription>Animals with highest average daily gain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.length > 0 ? (
                    topPerformers.map((animal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <p className="font-medium">{animal.tag}</p>
                          <p className="text-sm text-gray-600">{animal.breed} • {animal.farm} • {animal.pen}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-700">{animal.adg} kg/day</p>
                          <p className="text-sm text-gray-600">{animal.weight} kg</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No animals match the criteria</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Performance;
