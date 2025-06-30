
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";

interface AddFarmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFarm: (farm: {
    farmNumber: string;
    address: string;
    numberOfPens: number;
    area: number;
    startDate: string;
  }) => void;
}

export function AddFarmDialog({ open, onOpenChange, onAddFarm }: AddFarmDialogProps) {
  const [formData, setFormData] = useState({
    farmNumber: "",
    address: "",
    numberOfPens: "",
    area: "",
    startDate: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.farmNumber || !formData.address || !formData.numberOfPens || !formData.area || !formData.startDate) {
      alert("Please fill in all fields");
      return;
    }

    onAddFarm({
      farmNumber: formData.farmNumber,
      address: formData.address,
      numberOfPens: parseInt(formData.numberOfPens),
      area: parseFloat(formData.area),
      startDate: formData.startDate
    });

    // Reset form
    setFormData({
      farmNumber: "",
      address: "",
      numberOfPens: "",
      area: "",
      startDate: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Farm</DialogTitle>
          <DialogDescription>
            Enter the details for the new farm location.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farmNumber">Farm Number</Label>
              <Input
                id="farmNumber"
                placeholder="e.g., F004"
                value={formData.farmNumber}
                onChange={(e) => handleInputChange("farmNumber", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter the complete farm address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfPens">Number of Pens</Label>
              <Input
                id="numberOfPens"
                type="number"
                placeholder="e.g., 12"
                value={formData.numberOfPens}
                onChange={(e) => handleInputChange("numberOfPens", e.target.value)}
                required
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="area">Area (acres)</Label>
              <Input
                id="area"
                type="number"
                step="0.1"
                placeholder="e.g., 50.5"
                value={formData.area}
                onChange={(e) => handleInputChange("area", e.target.value)}
                required
                min="0.1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Farm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
