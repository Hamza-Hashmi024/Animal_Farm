
import { useState , useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Shield, Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuarantineAnimalDialog } from "@/components/QuarantineAnimalDialog";
import { GetQuarantineRecord } from "@/Apis/Api";
const Quarantine = () => {
  const { toast } = useToast();
  const [tag, setTag] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quarantineRecords, setQuarantineRecords] = useState([]);
const [loading, setLoading] = useState(true);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tag || !date || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Quarantine Entry Added",
      description: `Animal ${tag} has been added to quarantine`,
    });

    // Reset form
    setTag("");
    setDate("");
    setReason("");
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await GetQuarantineRecord();
      setQuarantineRecords(response.data); // Correct: response.data contains the array
    } catch (error: any) {
      toast({
        title: "Failed to fetch quarantine records",
        description: error?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <DashboardHeader />
          
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quarantine Management</h1>
              <p className="text-gray-600 mt-1">Manage animals in quarantine and add new entries</p>
            </div>



{/* Render the dialog outside the button */}
<QuarantineAnimalDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

            {/* Quarantine Records List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  Quarantine Records
                </CardTitle>
                <CardDescription>
                  Current and past quarantine entries ({quarantineRecords.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                 {quarantineRecords.map((record, index) => (
  <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
        <Shield className="h-5 w-5 text-orange-600" />
      </div>
      <div>
        <p className="font-semibold text-orange-900">{record.animal_tag}</p>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          Start: {new Date(record.quarantine_start_date).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          End: {new Date(record.quarantine_end_date).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-700 mt-1">{record.notes}</p>
      </div>
    </div>
    <div className="text-right">
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
      
      </span>
    </div>
  </div>
))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Quarantine;
