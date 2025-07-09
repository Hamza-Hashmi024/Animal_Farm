import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NewDeathFormProps = {
  onSubmit: (data: Omit<DeathRecord, "id" | "status">) => void;
  onClose: () => void;
};

type DeathRecord = {
  animalId: string;
  cause: string;
  date: string;
  location: string;
};

export const NewDeathForm = ({ onSubmit, onClose }: NewDeathFormProps) => {
  const [formData, setFormData] = useState({
    animalId: "",
    cause: "",
    causeOfDeath: "",
    date: "",
    pen: "",
    farm: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const location = `Pen ${formData.pen}, Farm ${formData.farm}`;
    onSubmit({
      animalId: formData.animalId,
      cause: formData.cause,
      date: new Date(formData.date).toISOString(),
      location,
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white border rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium mb-1">Animal ID</label>
        <Input name="animalId" value={formData.animalId} onChange={handleChange} required />
      </div>

        {/* Death Cause  Selector */}
     <div className="mt-4">
  <label className="block text-sm font-medium mb-1">Type Majur Cause Of Death</label>
  <Select
    value={formData.causeOfDeath}
    onValueChange={(value) => setFormData({ ...formData, causeOfDeath: value })}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select Cause" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Disease">Disease</SelectItem>
      <SelectItem value="Injury">Injury</SelectItem>
      <SelectItem value="Unknown">Unknown</SelectItem>
    </SelectContent>
  </Select>
</div>








      <div>
        <label className="block text-sm font-medium mb-1">Cause of Death</label>
        <Textarea name="cause" value={formData.cause} onChange={handleChange} required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
      </div>

      {/* Pen Selector */}
      <div>
        <label className="block text-sm font-medium mb-1">Pen</label>
        <Select
          value={formData.pen}
          onValueChange={(value) => setFormData({ ...formData, pen: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Pen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Pen 1</SelectItem>
            <SelectItem value="2">Pen 2</SelectItem>
            <SelectItem value="3">Pen 3</SelectItem>
            <SelectItem value="4">Pen 4</SelectItem>
            <SelectItem value="5">Pen 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Farm Selector */}
      <div>
        <label className="block text-sm font-medium mb-1">Farm</label>
        <Select
          value={formData.farm}
          onValueChange={(value) => setFormData({ ...formData, farm: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Farm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">Farm A</SelectItem>
            <SelectItem value="B">Farm B</SelectItem>
            <SelectItem value="C">Farm C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700">
          Submit
        </Button>
      </div>
    </form>
  );
};
