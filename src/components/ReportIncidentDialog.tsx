
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

interface IncidentFormData {
  animalTag: string;
  incidentType: string;
  farm: string;
  pen: string;
  description: string;
  priority: string;
}

export function ReportIncidentDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<IncidentFormData>({
    defaultValues: {
      animalTag: "",
      incidentType: "",
      farm: "",
      pen: "",
      description: "",
      priority: "",
    },
  });

  const onSubmit = (data: IncidentFormData) => {
    // In a real app, this would save to a database
    console.log("New incident reported:", data);
    
    toast({
      title: "Incident Reported",
      description: `Incident for animal ${data.animalTag} has been successfully reported.`,
    });
    
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Report Incident
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report New Incident</DialogTitle>
          <DialogDescription>
            Fill out the details of the incident below. All fields are required.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="incidentType"
              rules={{ required: "Incident type is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="injury">Injury</SelectItem>
                      <SelectItem value="illness">Illness</SelectItem>
                      <SelectItem value="death">Death</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="transport-stress">Transport Stress</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="farm"
                rules={{ required: "Farm is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Farm A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pen"
                rules={{ required: "Pen is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pen</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pen 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="priority"
              rules={{ required: "Priority is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the incident in detail..."
                      className="min-h-[80px]"
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
                Report Incident
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
