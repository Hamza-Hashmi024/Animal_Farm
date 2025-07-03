import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface WeightUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animalTag: string;
  currentWeight: number;
  onWeightUpdate: (newWeight: number) => void;
}

export function WeightUpdateDialog({
  open,
  onOpenChange,
  animalTag,
  currentWeight,
  onWeightUpdate
}: WeightUpdateDialogProps) {
  const [newWeight, setNewWeight] = useState(currentWeight.toString());
  const { toast } = useToast();

  const handleSave = () => {
    const weight = parseFloat(newWeight);
    
    if (isNaN(weight) || weight <= 0) {
      toast({
        title: "Invalid Weight",
        description: "Please enter a valid weight greater than 0",
        variant: "destructive"
      });
      return;
    }

    onWeightUpdate(weight);
    toast({
      title: "Weight Updated",
      description: `Weight for ${animalTag} updated to ${weight} kg`
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setNewWeight(currentWeight.toString());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Weight - {animalTag}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-weight" className="text-sm font-medium text-gray-600">
              Current Weight
            </Label>
            <p className="text-lg font-semibold">{currentWeight} kg</p>
          </div>
          
          <div>
            <Label htmlFor="new-weight">New Weight (kg)</Label>
            <Input
              id="new-weight"
              type="number"
              step="0.1"
              min="0"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Enter new weight"
              className="mt-1"
            />
          </div>
          
          <p className="text-xs text-gray-500">
            This will update the animal's current weight. For comprehensive health tracking including vaccines and medicines, use the Health Check feature.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Update Weight
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
