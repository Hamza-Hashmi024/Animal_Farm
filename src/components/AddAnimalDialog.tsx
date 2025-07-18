import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AnimalRegistrationApi,
  FarmNumbersApi,
  InvestorNamesApi,
  GetAllBreedsApi,
} from "@/Apis/Api";
interface AddAnimalDialogProps {
  onAddAnimal: (animal: any) => void;
}

export function AddAnimalDialog({ onAddAnimal }: AddAnimalDialogProps) {
  const [open, setOpen] = useState(false);
  const [investors, setInvestors] = useState([]);
  const [farms, setFarms] = useState([]);
  const [formData, setFormData] = useState({
    tag: "",
    srNo: "",
    breed: "",
    coatColor: "",
    age: "",
    purchaseDate: "",
    price: "",
    mandi: "",
    purchaser: "",
    farm: "",
    pen: "",
    investor: "",
    doctor: "",
  });
  const [breeds, setBreeds] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFarmsAndInvestors = async () => {
      try {
        const farmData = await FarmNumbersApi();
        const investorData = await InvestorNamesApi();
        const breedData = await GetAllBreedsApi();

        setBreeds(breedData);
        setFarms(farmData);
        setInvestors(investorData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchFarmsAndInvestors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.tag ||
      !formData.srNo ||
      !formData.breed ||
      !formData.purchaseDate ||
      !formData.price ||
      !formData.farm ||
      !formData.pen
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newAnimal = {
      tag: formData.tag,
      srNo: formData.srNo,
      breed: formData.breed,
      coatColor: formData.coatColor || null,
      age: parseInt(formData.age) || 0,
      purchaseDate: formData.purchaseDate,
      price: parseFloat(formData.price),
      mandi: formData.mandi || null,
      purchaser: formData.purchaser || null,
      farm: formData.farm,
      pen: formData.pen,
      investor: formData.investor || null,
      doctor: formData.doctor || null,
    };

    try {
      const result = await AnimalRegistrationApi(newAnimal);
      onAddAnimal(result); // Optional: Update parent state if needed

      setFormData({
        tag: "",
        srNo: "",
        breed: "",
        coatColor: "",
        age: "",
        arrivalWeight: "",
        purchaseDate: "",
        price: "",
        ratePerKg: "",
        mandi: "",
        purchaser: "",
        farm: "",
        pen: "",
        investor: "",
        doctor: "",
        status: "Active",
      });
      setOpen(false);

      toast({
        title: "Success",
        description: "Animal registered successfully",
      });
    } catch (err) {
      toast({
        title: "API Error",
        description: "Failed to register animal",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Register Animal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Animal Registration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identification */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-700 border-b pb-1">
              Identification
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tag">Tag Number *</Label>
                <Input
                  id="tag"
                  value={formData.tag}
                  onChange={(e) =>
                    setFormData({ ...formData, tag: e.target.value })
                  }
                  placeholder="TAG-001"
                  required
                />
              </div>
              <div>
                <Label htmlFor="srNo">Sr. No. *</Label>
                <Input
                  id="srNo"
                  value={formData.srNo}
                  onChange={(e) =>
                    setFormData({ ...formData, srNo: e.target.value })
                  }
                  placeholder="001"
                  required
                />
              </div>
            </div>
          </div>

          {/* Physical Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-700 border-b pb-1">
              Physical Details
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="breed">Breed *</Label>
                <Select
                  value={formData.breed}
                  onValueChange={(value) =>
                    setFormData({ ...formData, breed: value })
                  }
                >
                  <SelectTrigger id="breed" className="w-full">
                    <SelectValue placeholder="Select a breed" />
                  </SelectTrigger>
                  <SelectContent>
                    {breeds.map((breed: any) => (
                      <SelectItem key={breed.breed_id} value={breed.name}>
                        {breed.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="coatColor">Coat Color</Label>
                <Input
                  id="coatColor"
                  value={formData.coatColor}
                  onChange={(e) =>
                    setFormData({ ...formData, coatColor: e.target.value })
                  }
                  placeholder="Black & White"
                />
              </div>
              <div>
                <Label htmlFor="age">Age (months)</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="12"
                />
              </div>
            </div>
          </div>

          {/* Purchase Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-700 border-b pb-1">
              Purchase Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchaseDate">Purchase Date *</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="50000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="mandi">Mandi</Label>
                <Input
                  id="mandi"
                  value={formData.mandi}
                  onChange={(e) =>
                    setFormData({ ...formData, mandi: e.target.value })
                  }
                  placeholder="Central Market"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="purchaser">Purchaser</Label>
              <Input
                id="purchaser"
                value={formData.purchaser}
                onChange={(e) =>
                  setFormData({ ...formData, purchaser: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Assignment */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-700 border-b pb-1">
              Assignment
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="farm">Assigned Farm *</Label>
                <Select
                  value={formData.farm}
                  onValueChange={(value) =>
                    setFormData({ ...formData, farm: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Farm" />
                  </SelectTrigger>
                  <SelectContent>
                    {farms.map((farm: { farm_number: string }) => (
                      <SelectItem
                        key={farm.farm_number}
                        value={farm.farm_number}
                      >
                        {farm.farm_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pen">Assigned Pen *</Label>
                <Input
                  id="pen"
                  value={formData.pen}
                  onChange={(e) =>
                    setFormData({ ...formData, pen: e.target.value })
                  }
                  placeholder="Pen 1"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="investor">Assigned Investor</Label>
                <Select
                  value={formData.investor}
                  onValueChange={(value) =>
                    setFormData({ ...formData, investor: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Investor" />
                  </SelectTrigger>
                  <SelectContent>
                    {investors.map((inv: { name: string }) => (
                      <SelectItem key={inv.name} value={inv.name}>
                        {inv.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="doctor">Assigned Doctor</Label>
                <Input
                  id="doctor"
                  value={formData.doctor}
                  onChange={(e) =>
                    setFormData({ ...formData, doctor: e.target.value })
                  }
                  placeholder="Dr. Johnson"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Register Animal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
