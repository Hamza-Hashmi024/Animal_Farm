import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import  { RegisterBreedApi } from "@/Apis/Api"; // Adjust the import path as necessary


export const AddBreedDialog = ({ onBreedAdded }: { onBreedAdded?: () => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !description) return;
    setLoading(true);
    try {
      const payload = { name, description };
      await RegisterBreedApi(payload);
      if (onBreedAdded) onBreedAdded();
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Failed to register breed:", error);
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
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? "Adding..." : "Add Breed"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};