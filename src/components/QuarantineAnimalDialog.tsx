import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { RegisterQuarantine , GetAnimalByIdApi} from "@/Apis/Api"
 

interface QuarantineFormData {
  animal_tag: string;
  reason: string;
  quarantine_start_date: string;
  quarantine_end_date?: string;
  notes?: string;
}

export function QuarantineAnimalDialog() {
  const [open, setOpen] = useState(false);
  const [pen, setPen] = useState<string>("");
  const [farm, setFarm] = useState<string>("");

  const { toast } = useToast();

  const form = useForm<QuarantineFormData>({
    defaultValues: {
      animal_tag: "",
      reason: "",
      quarantine_start_date: "",
      quarantine_end_date: "",
      notes: "",
    },
  });

  const watchTag = form.watch("animal_tag");

  // Auto-fill Pen and Farm on tag change
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (watchTag && watchTag.length >= 3) {
        try {
          const animalData = await GetAnimalByIdApi(watchTag);
          setPen(animalData.pen || "N/A");
          setFarm(animalData.farm || "N/A");
        } catch (error) {
          setPen("");
          setFarm("");
        }
      }
    }, 500); // debounce

    return () => clearTimeout(timeout);
  }, [watchTag]);

 const onSubmit = async (data: QuarantineFormData) => {
  try {
    await RegisterQuarantine(data); 

    toast({
      title: "Quarantine Recorded",
      description: `Animal ${data.animal_tag} has been quarantined.`,
    });

    form.reset();
    setPen("");
    setFarm("");
    setOpen(false);
  } catch (error: any) {
    toast({
      title: "Error",
      description: error?.message || "Failed to record quarantine.",
      variant: "destructive",
    });
  }
};
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-600 hover:bg-yellow-700">
          <Plus className="h-4 w-4 mr-2" />
          Quarantine Animal
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quarantine Animal</DialogTitle>
          <DialogDescription>
            Fill in the quarantine details for the animal.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="animal_tag"
              rules={{ required: "Animal tag is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Animal Tag</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., TAG-101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Read-only Pen */}
            <div>
              <FormLabel>Pen</FormLabel>
              <Input value={pen} readOnly disabled />
            </div>

            {/* Read-only Farm */}
            <div>
              <FormLabel>Farm</FormLabel>
              <Input value={farm} readOnly disabled />
            </div>

            <FormField
              control={form.control}
              name="reason"
              rules={{ required: "Reason is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Quarantine</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Infection, exposure, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quarantine_start_date"
              rules={{ required: "Start date is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quarantine_end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date (optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional notes..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}










// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/use-toast";
// import { Plus } from "lucide-react";
// // import { CreateQuarantineEntry } from "@/Apis/Api"; // You can connect this later

// interface QuarantineFormData {
//   animal_tag: string;
//   reason: string;
//   quarantine_start_date: string;
//   quarantine_end_date?: string;
//   location?: string;
//   notes?: string;
// }

// export function QuarantineAnimalDialog() {
//   const [open, setOpen] = useState(false);
//   const { toast } = useToast();

//   const form = useForm<QuarantineFormData>({
//     defaultValues: {
//       animal_tag: "",
//       reason: "",
//       quarantine_start_date: "",
//       quarantine_end_date: "",
//       location: "",
//       notes: "",
//     },
//   });

//   const onSubmit = async (data: QuarantineFormData) => {
//     try {
//       // await CreateQuarantineEntry(data); // Uncomment when API is ready

//       toast({
//         title: "Quarantine Recorded",
//         description: `Animal ${data.animal_tag} has been quarantined.`,
//       });

//       form.reset();
//       setOpen(false);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || "Failed to record quarantine.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="bg-yellow-600 hover:bg-yellow-700">
//           <Plus className="h-4 w-4 mr-2" />
//           Quarantine Animal
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Quarantine Animal</DialogTitle>
//           <DialogDescription>
//             Fill in the quarantine details for the animal.
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="animal_tag"
//               rules={{ required: "Animal tag is required" }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Animal Tag</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., TAG-101" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="reason"
//               rules={{ required: "Reason is required" }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Reason for Quarantine</FormLabel>
//                   <FormControl>
//                     <Textarea placeholder="Infection, exposure, etc." {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="quarantine_start_date"
//               rules={{ required: "Start date is required" }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Start Date</FormLabel>
//                   <FormControl>
//                     <Input type="date" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="quarantine_end_date"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>End Date (optional)</FormLabel>
//                   <FormControl>
//                     <Input type="date" {...field} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="location"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Location</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., Pen B2, Isolation Room" {...field} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="notes"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Notes</FormLabel>
//                   <FormControl>
//                     <Textarea placeholder="Any additional notes..." {...field} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
//                 Save
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
