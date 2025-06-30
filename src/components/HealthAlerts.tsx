
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown } from "lucide-react";

interface LowPerformer {
  id: number;
  animal: string;
  currentWeight: number;
  expectedWeight: number;
  adg: number;
  expectedAdg: number;
  farm: string;
  pen: string;
}

interface HealthAlertsProps {
  alerts?: any[]; // Keep for backward compatibility but we'll generate our own data
}

export function HealthAlerts({ alerts }: HealthAlertsProps) {
  // Generate low performer data based on realistic scenarios
  const lowPerformers: LowPerformer[] = [
    { 
      id: 1, 
      animal: "TAG-127", 
      currentWeight: 385, 
      expectedWeight: 425, 
      adg: 0.8, 
      expectedAdg: 1.2, 
      farm: "Farm A", 
      pen: "Pen 5" 
    },
    { 
      id: 2, 
      animal: "TAG-089", 
      currentWeight: 310, 
      expectedWeight: 350, 
      adg: 0.6, 
      expectedAdg: 1.0, 
      farm: "Farm B", 
      pen: "Pen 2" 
    },
    { 
      id: 3, 
      animal: "TAG-156", 
      currentWeight: 295, 
      expectedWeight: 340, 
      adg: 0.7, 
      expectedAdg: 1.1, 
      farm: "Farm C", 
      pen: "Pen 4" 
    },
  ];

  const getPerformanceLevel = (adg: number, expectedAdg: number) => {
    const ratio = adg / expectedAdg;
    if (ratio < 0.7) return { level: 'critical', color: 'destructive' };
    if (ratio < 0.85) return { level: 'low', color: 'default' };
    return { level: 'moderate', color: 'secondary' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingDown className="h-5 w-5 text-red-500" />
          <span>Low Performers</span>
        </CardTitle>
        <CardDescription>Animals underperforming expected growth rates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {lowPerformers.map((performer) => {
          const performance = getPerformanceLevel(performer.adg, performer.expectedAdg);
          const weightGap = performer.expectedWeight - performer.currentWeight;
          
          return (
            <div key={performer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="font-medium text-sm">{performer.animal}</p>
                  <p className="text-xs text-gray-600">{performer.farm} - {performer.pen}</p>
                  <p className="text-xs text-red-600">
                    -{weightGap}kg behind, ADG: {performer.adg} (exp: {performer.expectedAdg})
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={performance.color as any} className="text-xs">
                  {performance.level}
                </Badge>
                <Button variant="outline" size="sm">
                  Review
                </Button>
              </div>
            </div>
          );
        })}
        
        {lowPerformers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <TrendingDown className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No low performers at this time</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
