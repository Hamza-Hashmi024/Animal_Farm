
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Weight, TrendingUp, Syringe, Pill, FileText } from "lucide-react";
import { Checkpoint } from "@/types/checkpoint";

interface CheckpointHistoryProps {
  checkpoints: Checkpoint[];
  onEditCheckpoint?: (checkpoint: Checkpoint) => void;
}

export function CheckpointHistory({ checkpoints, onEditCheckpoint }: CheckpointHistoryProps) {
  const completedCheckpoints = checkpoints.filter(cp => cp.completed).sort((a, b) => a.day - b.day);

  if (completedCheckpoints.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Checkpoint History</span>
          </CardTitle>
          <CardDescription>No checkpoints completed yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Complete your first checkpoint to see history here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Checkpoint History</span>
        </CardTitle>
        <CardDescription>Completed health and weight monitoring checkpoints</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {completedCheckpoints.map((checkpoint, index) => (
            <div key={checkpoint.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">Day {checkpoint.day}</Badge>
                  <h3 className="font-semibold">{checkpoint.name}</h3>
                  <span className="text-sm text-gray-500">
                    {checkpoint.actualDate ? new Date(checkpoint.actualDate).toLocaleDateString() : 'Date not recorded'}
                  </span>
                </div>
                {onEditCheckpoint && (
                  <Button variant="ghost" size="sm" onClick={() => onEditCheckpoint(checkpoint)}>
                    Edit
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <Weight className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-semibold">{checkpoint.weight || 'N/A'} kg</p>
                  </div>
                </div>
                
                {checkpoint.weightGain !== undefined && (
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Weight Gain</p>
                      <p className="font-semibold">{checkpoint.weightGain.toFixed(1)} kg</p>
                    </div>
                  </div>
                )}

                {checkpoint.adg !== undefined && (
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm text-gray-600">ADG</p>
                      <p className="font-semibold">{checkpoint.adg.toFixed(2)} kg/day</p>
                    </div>
                  </div>
                )}

                {checkpoint.daysSinceLastCheck !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Days Since Last</p>
                    <p className="font-semibold">{checkpoint.daysSinceLastCheck} days</p>
                  </div>
                )}
              </div>

              {/* Treatment Information */}
              <div className="space-y-2">
                {checkpoint.vaccine?.name && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Syringe className="h-3 w-3 text-purple-500" />
                    <span className="text-gray-600">Vaccine:</span>
                    <span>{checkpoint.vaccine.name} (Batch: {checkpoint.vaccine.batch}, Dose: {checkpoint.vaccine.dose})</span>
                  </div>
                )}

                {checkpoint.dewormer?.name && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Pill className="h-3 w-3 text-orange-500" />
                    <span className="text-gray-600">Dewormer:</span>
                    <span>{checkpoint.dewormer.name} ({checkpoint.dewormer.dose})</span>
                  </div>
                )}

                {checkpoint.medicines?.some(m => m.name) && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Pill className="h-3 w-3 text-red-500" />
                    <span className="text-gray-600">Medicines:</span>
                    <span>{checkpoint.medicines.filter(m => m.name).map(m => `${m.name} (${m.dose})`).join(', ')}</span>
                  </div>
                )}

                {checkpoint.notes && (
                  <div className="flex items-start space-x-2 text-sm">
                    <FileText className="h-3 w-3 text-gray-500 mt-0.5" />
                    <span className="text-gray-600">Notes:</span>
                    <span className="text-gray-700">{checkpoint.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
