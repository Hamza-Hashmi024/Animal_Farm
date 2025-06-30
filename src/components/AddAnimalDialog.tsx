
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddAnimalDialogProps {
  onAddAnimal: (animal: any) => void;
}

export function AddAnimalDialog({ onAddAnimal }: AddAnimalDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    tag: "",
    breed: "",
    weight: "",
    adg: "",
    status: "Active",
    farm: "",
    pen: "",
    investor: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tag || !formData.breed || !formData.weight || !formData.farm || !formData.pen) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newAnimal = {
      tag: formData.tag,
      breed: formData.breed,
      weight: parseFloat(formData.weight),
      adg: parseFloat(formData.adg) || 0,
      status: formData.status,
      farm: formData.farm,
      pen: formData.pen,
      investor: formData.investor || undefined
    };

    onAddAnimal(newAnimal);
    setFormData({
      tag: "",
      breed: "",
      weight: "",
      adg: "",
      status: "Active",
      farm: "",
      pen: "",
      investor: ""
    });
    setOpen(false);
    
    toast({
      title: "Success",
      description: "Animal added successfully"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Animal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Animal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tag">Tag Number *</Label>
              <Input
                id="tag"
                value={formData.tag}
                onChange={(e) => setFormData({...formData, tag: e.target.value})}
                placeholder="TAG-001"
                required
              />
            </div>
            <div>
              <Label htmlFor="breed">Breed *</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => setFormData({...formData, breed: e.target.value})}
                placeholder="Holstein"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                placeholder="450"
                required
              />
            </div>
            <div>
              <Label htmlFor="adg">ADG</Label>
              <Input
                id="adg"
                type="number"
                step="0.1"
                value={formData.adg}
                onChange={(e) => setFormData({...formData, adg: e.target.value})}
                placeholder="1.2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Quarantine">Quarantine</SelectItem>
                <SelectItem value="Transferred">Transferred</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="farm">Farm *</Label>
              <Input
                id="farm"
                value={formData.farm}
                onChange={(e) => setFormData({...formData, farm: e.target.value})}
                placeholder="Farm A"
                required
              />
            </div>
            <div>
              <Label htmlFor="pen">Pen *</Label>
              <Input
                id="pen"
                value={formData.pen}
                onChange={(e) => setFormData({...formData, pen: e.target.value})}
                placeholder="Pen 1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="investor">Investor (Optional)</Label>
            <Input
              id="investor"
              value={formData.investor}
              onChange={(e) => setFormData({...formData, investor: e.target.value})}
              placeholder="John Smith"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Animal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
