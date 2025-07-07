import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";

export const AddBreedDialog = ({ onBreedAdded }: { onBreedAdded?: () => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddBreed = async () => {
    if (!name) return;

    try {
      setLoading(true);
      await axios.post("/api/breeds", { name, description });
      onBreedAdded?.();
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error adding breed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Register New Breed</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Breed</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input placeholder="Breed Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button onClick={handleAddBreed} disabled={loading}>
            {loading ? "Adding..." : "Add Breed"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
