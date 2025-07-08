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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Target, Scale, TrendingUp } from "lucide-react";
import { GetAnimalWeightHistory } from "@/Apis/Api";


const Performance = () => {
  const [animals, setAnimals] = useState([]);
  const [customCriteria, setCustomCriteria] = useState("");
  const [selectedFarm, setSelectedFarm] = useState("all");
  const [selectedPen, setSelectedPen] = useState("all");
  const [selectedBreed, setSelectedBreed] = useState("all");
  const [farmOptions, setFarmOptions] = useState<string[]>([]);
  const [penOptions, setPenOptions] = useState<string[]>([]);
  const [breedOptions, setBreedOptions] = useState<string[]>([]);

 useEffect(() => {
  const fetchAndCalculatePerformance = async () => {
    try {
      const historyList = await GetAnimalWeightHistory();

      const processed = historyList.map((entry) => {
        const { animal_id, tag, farm, pen, breed, weight_history } = entry;

        if (!weight_history || weight_history.length < 2) {
          return {
            id: animal_id,
            tag,
            farm,
            pen,
            breed,
            weight: weight_history?.[0]?.weight || 0,
            adg: 0,
          };
        }

        const sorted = weight_history.sort(
          (a, b) => new Date(a.check_date) - new Date(b.check_date)
        );

        const first = sorted[0];
        const last = sorted[sorted.length - 1];

        const days =
          (new Date(last.check_date) - new Date(first.check_date)) /
          (1000 * 60 * 60 * 24);
        const adg = days > 0 ? (last.weight - first.weight) / days : 0;

        return {
          id: animal_id,
          tag,
          farm,
          pen,
          breed,
          weight: last.weight,
          adg: parseFloat(adg.toFixed(2)),
        };
      });

      setAnimals(processed);
    } catch (err) {
      console.error("Error loading animal weight history:", err);
    }
  };

  fetchAndCalculatePerformance();
}, []);
  
  const filterAnimals = (animals) => {
    return animals.filter((animal) => {
      return (
        (selectedFarm === "all" || animal.farm === selectedFarm) &&
        (selectedPen === "all" || animal.pen === selectedPen) &&
        (selectedBreed === "all" || animal.breed === selectedBreed)
      );
    });
  };

  const filteredAnimals = filterAnimals(animals);

  const lowPerformers05 = filteredAnimals.filter((animal) => animal.adg <= 0.5);
  const lowPerformers08 = filteredAnimals.filter((animal) => animal.adg <= 0.8);
  const topPerformers = filteredAnimals.filter((animal) => animal.adg >= 1.5);

  // Calculate averages
  const averageWeight =
    filteredAnimals.length > 0
      ? (
          filteredAnimals.reduce((sum, animal) => sum + animal.weight, 0) /
          filteredAnimals.length
        ).toFixed(1)
      : "0";

  const averageADG =
    filteredAnimals.length > 0
      ? (
          filteredAnimals.reduce((sum, animal) => sum + animal.adg, 0) /
          filteredAnimals.length
        ).toFixed(2)
      : "0";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />

        <main className="flex-1 overflow-hidden">
          <DashboardHeader />

          <div className="p-6 space-y-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Weight Performance
              </h1>
              <p className="text-gray-700 mt-1 font-medium">
                Monitor livestock weight performance and ADG criteria
              </p>
            </div>

            {/* Filters Section - Improved contrast */}
            <Card className="border-gray-300">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold text-gray-900">
                  Filters
                </CardTitle>
                <CardDescription className="text-xs font-medium text-gray-700">
                  Filter animals by farm, pen, and breed
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {/* Farm */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-800">
                      Farm
                    </label>
                    <Select
                      value={selectedFarm}
                      onValueChange={setSelectedFarm}
                    >
                      <SelectTrigger className="h-7 text-xs border-gray-400 text-gray-900 font-medium">
                        <SelectValue placeholder="Select farm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Farms</SelectItem>
                        {farmOptions.map((farm) => (
                          <SelectItem key={farm} value={farm}>
                            {farm}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pen */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-800">
                      Pen
                    </label>
                    <Select value={selectedPen} onValueChange={setSelectedPen}>
                      <SelectTrigger className="h-7 text-xs border-gray-400 text-gray-900 font-medium">
                        <SelectValue placeholder="Select pen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Pens</SelectItem>
                        {penOptions.map((pen) => (
                          <SelectItem key={pen} value={pen}>
                            {pen}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Breed */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-800">
                      Breed
                    </label>
                    <Select
                      value={selectedBreed}
                      onValueChange={setSelectedBreed}
                    >
                      <SelectTrigger className="h-7 text-xs border-gray-400 text-gray-900 font-medium">
                        <SelectValue placeholder="Select breed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Breeds</SelectItem>
                        {breedOptions.map((breed) => (
                          <SelectItem key={breed} value={breed}>
                            {breed}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Cards - Improved contrast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Card className="border-gray-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                  <CardTitle className="text-xs font-semibold text-gray-900">
                    Average Weight
                  </CardTitle>
                  <Scale className="h-3 w-3 text-gray-700" />
                </CardHeader>
                <CardContent className="pb-1">
                  <div className="text-lg font-bold text-gray-900">
                    {averageWeight} kg
                  </div>
                  <p className="text-xs text-gray-700 font-medium">
                    Based on {filteredAnimals.length} animals
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                  <CardTitle className="text-xs font-semibold text-gray-900">
                    Average Daily Gain
                  </CardTitle>
                  <TrendingUp className="h-3 w-3 text-gray-700" />
                </CardHeader>
                <CardContent className="pb-1">
                  <div className="text-lg font-bold text-gray-900">
                    {averageADG} kg/day
                  </div>
                  <p className="text-xs text-gray-700 font-medium">
                    Based on {filteredAnimals.length} animals
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Low Performers Section - Improved contrast */}
            <Card className="border-gray-300">
              <CardHeader>
                <CardTitle className="text-gray-900 font-bold">
                  Low Performers
                </CardTitle>
                <CardDescription className="text-gray-700 font-medium">
                  Animals below performance thresholds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="0.5kg" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="0.5kg" className="text-xs font-medium">
                      ADG ≤ 0.5 kg
                    </TabsTrigger>
                    <TabsTrigger value="0.8kg" className="text-xs font-medium">
                      ADG ≤ 0.8 kg
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="text-xs font-medium">
                      Set Custom Criteria
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="0.5kg" className="space-y-3 mt-4">
                    {lowPerformers05.length > 0 ? (
                      lowPerformers05.map((animal, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-red-100 rounded-lg border-2 border-red-300"
                        >
                          <div>
                            <p className="font-bold text-gray-900">
                              {animal.tag}
                            </p>
                            <p className="text-sm text-gray-800 font-medium">
                              {animal.breed} • {animal.farm} • {animal.pen}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-800 text-lg">
                              {animal.adg} kg/day
                            </p>
                            <p className="text-sm text-gray-800 font-medium">
                              {animal.weight} kg
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-700 text-center py-4 font-medium">
                        No animals match the criteria
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="0.8kg" className="space-y-3 mt-4">
                    {lowPerformers08.length > 0 ? (
                      lowPerformers08.map((animal, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-red-100 rounded-lg border-2 border-red-300"
                        >
                          <div>
                            <p className="font-bold text-gray-900">
                              {animal.tag}
                            </p>
                            <p className="text-sm text-gray-800 font-medium">
                              {animal.breed} • {animal.farm} • {animal.pen}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-800 text-lg">
                              {animal.adg} kg/day
                            </p>
                            <p className="text-sm text-gray-800 font-medium">
                              {animal.weight} kg
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-700 text-center py-4 font-medium">
                        No animals match the criteria
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="custom" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label
                          htmlFor="custom-criteria"
                          className="text-sm font-semibold text-gray-900"
                        >
                          Custom ADG Threshold (kg/day):
                        </label>
                        <Input
                          id="custom-criteria"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 1.0"
                          value={customCriteria}
                          onChange={(e) => setCustomCriteria(e.target.value)}
                          className="w-32 border-gray-400 text-gray-900"
                        />
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        >
                          Apply Filter
                        </Button>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        Enter a custom ADG threshold to filter animals below
                        this performance level.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Top Performers Section - Improved contrast */}
            <Card className="border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 font-bold">
                  <Target className="h-5 w-5 text-green-700" />
                  Top Performers
                </CardTitle>
                <CardDescription className="text-gray-700 font-medium">
                  Animals with highest average daily gain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.length > 0 ? (
                    topPerformers.map((animal, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-green-100 rounded-lg border-2 border-green-300"
                      >
                        <div>
                          <p className="font-bold text-gray-900">
                            {animal.tag}
                          </p>
                          <p className="text-sm text-gray-800 font-medium">
                            {animal.breed} • {animal.farm} • {animal.pen}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-800 text-lg">
                            {animal.adg} kg/day
                          </p>
                          <p className="text-sm text-gray-800 font-medium">
                            {animal.weight} kg
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-700 text-center py-4 font-medium">
                      No animals match the criteria
                    </p>
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
