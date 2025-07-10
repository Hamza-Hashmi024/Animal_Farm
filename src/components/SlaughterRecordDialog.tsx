
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { RecordSlaughter } from "@/Apis/Api";

interface SlaughterFormData {
  animalTag: string;
  slaughterDate: string;
  weightBeforeSlaughter: string;
  finalWeightGain: string;
  carcassWeight: string;
  carcassRatio: string;
  carcassQuality: string;
  qualityNotes: string;
  customerFeedback: string;
}

export function SlaughterRecordDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SlaughterFormData>({
    defaultValues: {
      animalTag: "",
      slaughterDate: "",
      weightBeforeSlaughter: "",
      finalWeightGain: "",
      carcassWeight: "",
      carcassRatio: "",
      carcassQuality: "",
      qualityNotes: "",
      customerFeedback: "",
    },
  });

 const onSubmit = async (data: SlaughterFormData) => {
  try {
    const ratio = data.carcassRatio ||
      ((parseFloat(data.carcassWeight) / parseFloat(data.weightBeforeSlaughter)) * 100).toFixed(1);

    const recordData = { ...data, carcassRatio: ratio };

    const result = await  RecordSlaughter(recordData);

    toast({
      title: "Slaughter Record Added",
      description: `Animal ${data.animalTag} processed successfully.`,
    });

    form.reset();
    setOpen(false);
  } catch (error: any) {
    toast({
      title: "Error",
      description: error?.response?.data?.message || "Failed to record slaughter",
      variant: "destructive",
    });
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Record Slaughter Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Slaughter & Carcass Data</DialogTitle>
          <DialogDescription>
            Capture final stage data for animals sent for processing. All fields are required.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="animalTag"
                rules={{ required: "Animal tag is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Animal Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TAG-127" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slaughterDate"
                rules={{ required: "Slaughter date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slaughter Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weightBeforeSlaughter"
                rules={{ required: "Weight before slaughter is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight Before Slaughter (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 450" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="finalWeightGain"
                rules={{ required: "Final weight gain is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Final Weight Gain (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 125" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="carcassWeight"
                rules={{ required: "Carcass weight is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carcass Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 285" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="carcassRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carcass Ratio (%) - Optional</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="Auto-calculated" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="carcassQuality"
              rules={{ required: "Carcass quality is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carcass Quality Grade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality grade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="grade-a">Grade A - Premium</SelectItem>
                      <SelectItem value="grade-b">Grade B - Standard</SelectItem>
                      <SelectItem value="grade-c">Grade C - Commercial</SelectItem>
                      <SelectItem value="grade-d">Grade D - Utility</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="qualityNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quality Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about carcass quality..."
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerFeedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Feedback (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Feedback from the processing facility or end customer..."
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                Record Data
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
