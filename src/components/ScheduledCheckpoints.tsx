
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Checkpoint } from "@/types/checkpoint";
import { HealthCheckpoint } from "./HealthCheckpoint";

interface ScheduledCheckpointsProps {
  checkpoints: Checkpoint[];
  onCheckpointUpdate: (checkpoint: Checkpoint) => void;
}

export function ScheduledCheckpoints({ checkpoints, onCheckpointUpdate }: ScheduledCheckpointsProps) {
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  
  const today = new Date().toISOString().split('T')[0];
  const sortedCheckpoints = [...checkpoints].sort((a, b) => a.day - b.day);
  
  const getCheckpointStatus = (checkpoint: Checkpoint) => {
    if (checkpoint.completed) return 'completed';
    if (checkpoint.scheduledDate < today) return 'overdue';
    if (checkpoint.scheduledDate === today) return 'due-today';
    return 'upcoming';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'due-today':
        return <Badge className="bg-amber-100 text-amber-800">Due Today</Badge>;
      default:
        return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'due-today':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Calendar className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleConductCheckpoint = (checkpoint: Checkpoint) => {
    setSelectedCheckpoint(checkpoint);
  };

  const handleCheckpointSave = (updatedCheckpoint: Checkpoint) => {
    onCheckpointUpdate(updatedCheckpoint);
    setSelectedCheckpoint(null);
  };

  const getPreviousWeight = (currentCheckpoint: Checkpoint) => {
    const previousCheckpoints = sortedCheckpoints
      .filter(cp => cp.day < currentCheckpoint.day && cp.completed && cp.weight)
      .sort((a, b) => b.day - a.day);
    
    return previousCheckpoints[0]?.weight;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Scheduled Checkpoints</span>
          </CardTitle>
          <CardDescription>Health and weight monitoring schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedCheckpoints.map((checkpoint) => {
              const status = getCheckpointStatus(checkpoint);
              const canConduct = !checkpoint.completed;
              
              return (
                <div key={checkpoint.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{checkpoint.name}</p>
                        {getStatusBadge(status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Day {checkpoint.day} • Scheduled: {new Date(checkpoint.scheduledDate).toLocaleDateString()}
                        {checkpoint.completed && checkpoint.actualDate && (
                          <span> • Completed: {new Date(checkpoint.actualDate).toLocaleDateString()}</span>
                        )}
                      </p>
                      {checkpoint.completed && checkpoint.weight && (
                        <p className="text-sm text-gray-500">
                          Weight: {checkpoint.weight} kg
                          {checkpoint.adg && ` • ADG: ${checkpoint.adg} kg/day`}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {canConduct && (
                      <Button 
                        size="sm" 
                        onClick={() => handleConductCheckpoint(checkpoint)}
                        variant={status === 'overdue' ? 'destructive' : status === 'due-today' ? 'default' : 'outline'}
                      >
                        {status === 'overdue' ? 'Overdue' : status === 'due-today' ? 'Conduct Now' : 'Conduct'}
                      </Button>
                    )}
                    {checkpoint.completed && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleConductCheckpoint(checkpoint)}
                      >
                        View/Edit
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedCheckpoint && (
        <HealthCheckpoint
          checkpoint={selectedCheckpoint}
          previousWeight={getPreviousWeight(selectedCheckpoint)}
          onSave={handleCheckpointSave}
          onCancel={() => setSelectedCheckpoint(null)}
          open={!!selectedCheckpoint}
        />
      )}
    </>
  );
}
