
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Weight, Syringe, Pill, FileText } from "lucide-react";
import { Checkpoint } from "@/types/checkpoint";

interface HealthCheckpointProps {
  checkpoint: Checkpoint;
  previousWeight?: number;
  onSave: (checkpoint: Checkpoint) => void;
  onCancel: () => void;
  open: boolean;
}

export function HealthCheckpoint({ checkpoint, previousWeight, onSave, onCancel, open }: HealthCheckpointProps) {
  const [formData, setFormData] = useState<Checkpoint>({
    ...checkpoint,
    actualDate: checkpoint.actualDate || new Date().toISOString().split('T')[0]
  });

  const handleWeightChange = (weight: number) => {
    const weightGain = previousWeight ? weight - previousWeight : 0;
    const daysSinceLastCheck = checkpoint.day === 0 ? 0 : checkpoint.day - (checkpoint.day === 3 ? 0 : checkpoint.day === 7 ? 3 : checkpoint.day === 21 ? 7 : checkpoint.day === 50 ? 21 : 50);
    const adg = daysSinceLastCheck > 0 ? weightGain / daysSinceLastCheck : 0;

    setFormData(prev => ({
      ...prev,
      weight,
      weightGain,
      daysSinceLastCheck,
      adg: Number(adg.toFixed(2))
    }));
  };

  const handleSave = () => {
    onSave({ ...formData, completed: true });
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{checkpoint.name} - {checkpoint.animalTag}</span>
          </DialogTitle>
          <DialogDescription>
            Day {checkpoint.day} checkpoint scheduled for {new Date(checkpoint.scheduledDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Weight className="h-4 w-4" />
                <span>Weight & Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkDate">Check Date</Label>
                  <Input
                    id="checkDate"
                    type="date"
                    value={formData.actualDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, actualDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Current Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight || ''}
                    onChange={(e) => handleWeightChange(Number(e.target.value))}
                  />
                </div>
              </div>
              
              {formData.weight && (
                <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm text-gray-600">Weight Gain</Label>
                    <p className="font-semibold">{formData.weightGain?.toFixed(1) || 0} kg</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Days Since Last</Label>
                    <p className="font-semibold">{formData.daysSinceLastCheck || 0} days</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">ADG</Label>
                    <p className="font-semibold">{formData.adg?.toFixed(2) || 0} kg/day</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vaccination */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Syringe className="h-4 w-4" />
                <span>Vaccination</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vaccineName">Vaccine Name</Label>
                  <Input
                    id="vaccineName"
                    value={formData.vaccine?.name || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      vaccine: { ...prev.vaccine, name: e.target.value, batch: prev.vaccine?.batch || '', dose: prev.vaccine?.dose || '' }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="vaccineBatch">Batch Number</Label>
                  <Input
                    id="vaccineBatch"
                    value={formData.vaccine?.batch || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      vaccine: { ...prev.vaccine, batch: e.target.value, name: prev.vaccine?.name || '', dose: prev.vaccine?.dose || '' }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="vaccineDose">Dose</Label>
                  <Input
                    id="vaccineDose"
                    value={formData.vaccine?.dose || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      vaccine: { ...prev.vaccine, dose: e.target.value, name: prev.vaccine?.name || '', batch: prev.vaccine?.batch || '' }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deworming */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Pill className="h-4 w-4" />
                <span>Deworming</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dewormerName">Dewormer Name</Label>
                  <Input
                    id="dewormerName"
                    value={formData.dewormer?.name || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dewormer: { name: e.target.value, dose: prev.dewormer?.dose || '' }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="dewormerDose">Dose</Label>
                  <Input
                    id="dewormerDose"
                    value={formData.dewormer?.dose || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dewormer: { dose: e.target.value, name: prev.dewormer?.name || '' }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medicines */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Pill className="h-4 w-4" />
                <span>Medicines (Up to 2)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[0, 1].map((index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`medicine${index}Name`}>Medicine {index + 1} Name</Label>
                    <Input
                      id={`medicine${index}Name`}
                      value={formData.medicines?.[index]?.name || ''}
                      onChange={(e) => {
                        const newMedicines = [...(formData.medicines || [])];
                        newMedicines[index] = { 
                          name: e.target.value, 
                          dose: newMedicines[index]?.dose || '' 
                        };
                        setFormData(prev => ({ ...prev, medicines: newMedicines }));
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`medicine${index}Dose`}>Dose</Label>
                    <Input
                      id={`medicine${index}Dose`}
                      value={formData.medicines?.[index]?.dose || ''}
                      onChange={(e) => {
                        const newMedicines = [...(formData.medicines || [])];
                        newMedicines[index] = { 
                          dose: e.target.value, 
                          name: newMedicines[index]?.name || '' 
                        };
                        setFormData(prev => ({ ...prev, medicines: newMedicines }));
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Additional observations or notes..."
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave} disabled={!formData.weight}>
            Save Checkpoint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
