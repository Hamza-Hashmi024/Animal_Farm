
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function FarmOverview() {
  const farms = [
    { name: "Farm A", animals: 487, capacity: 600, pens: 12 },
    { name: "Farm B", animals: 523, capacity: 650, pens: 15 },
    { name: "Farm C", animals: 237, capacity: 400, pens: 8 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farm Overview</CardTitle>
        <CardDescription>Current occupancy across all farms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {farms.map((farm, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{farm.name}</h4>
                <p className="text-sm text-gray-600">{farm.pens} pens</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{farm.animals}/{farm.capacity}</p>
                <p className="text-sm text-gray-600">
                  {Math.round((farm.animals / farm.capacity) * 100)}% full
                </p>
              </div>
            </div>
            <Progress 
              value={(farm.animals / farm.capacity) * 100} 
              className="h-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
