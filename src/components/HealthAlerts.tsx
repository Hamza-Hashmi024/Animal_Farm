
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Syringe } from "lucide-react";

interface Alert {
  id: number;
  animal: string;
  type: string;
  farm: string;
  pen: string;
  priority: string;
}

interface HealthAlertsProps {
  alerts: Alert[];
}

export function HealthAlerts({ alerts }: HealthAlertsProps) {
  const getIcon = (type: string) => {
    if (type.includes('Vaccination')) return <Syringe className="h-4 w-4" />;
    if (type.includes('Weight')) return <Calendar className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <span>Health Alerts</span>
        </CardTitle>
        <CardDescription>Animals requiring immediate attention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              {getIcon(alert.type)}
              <div>
                <p className="font-medium text-sm">{alert.animal}</p>
                <p className="text-xs text-gray-600">{alert.farm} - {alert.pen}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getPriorityColor(alert.priority)} className="text-xs">
                {alert.priority}
              </Badge>
              <Button variant="outline" size="sm">
                Handle
              </Button>
            </div>
          </div>
        ))}
        
        {alerts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No health alerts at this time</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
