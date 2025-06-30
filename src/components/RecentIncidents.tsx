
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, MapPin } from "lucide-react";

export function RecentIncidents() {
  const incidents = [
    {
      id: 1,
      animal: "TAG-127",
      type: "Injury",
      description: "Minor leg injury during transport",
      farm: "Farm A",
      pen: "Pen 5",
      time: "2 hours ago",
      severity: "Medium"
    },
    {
      id: 2,
      animal: "TAG-089",
      type: "Illness",
      description: "Respiratory distress symptoms",
      farm: "Farm B",
      pen: "Pen 3",
      time: "4 hours ago",
      severity: "High"
    },
    {
      id: 3,
      animal: "TAG-203",
      type: "Behavioral",
      description: "Aggressive behavior towards handlers",
      farm: "Farm A",
      pen: "Pen 7",
      time: "1 day ago",
      severity: "Low"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span>Recent Incidents</span>
        </CardTitle>
        <CardDescription>Latest animal incidents requiring follow-up</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {incidents.map((incident) => (
          <div key={incident.id} className="border-l-4 border-red-300 pl-4 py-3 bg-red-50 rounded-r-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{incident.animal} - {incident.type}</h4>
                <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
              </div>
              <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                {incident.severity}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{incident.farm}, {incident.pen}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{incident.time}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-7">
                View Details
              </Button>
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full">
          View All Incidents
        </Button>
      </CardContent>
    </Card>
  );
}
