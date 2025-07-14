import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { InvestorCard } from "@/components/InvestorCard";
import { Search, Filter, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { InvestorRegistrationApi, GetAllInvester } from "@/Apis/Api";

const Investors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [investors, setInvestors] = useState<any[]>([]);
  const [newInvestor, setNewInvestor] = useState({
    name: "",
    email: "",
    phone: "",
    totalInvestment: 0,
  });

  // Fetch investors using useEffect
  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await GetAllInvester();
        setInvestors(response);
        console.log("Fetched investors:", response);
      } catch (error) {
        console.error("Error fetching investors:", error);
      }
    };
    fetchInvestors();
  }, []);

  const filteredInvestors = investors.filter((investor) =>
    investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInvestment = investors.reduce((sum, inv) => sum + parseFloat(inv.total_investment), 0);
  const totalAnimals = 13; 
  const avgROI = investors.length > 0 ? investors.reduce((sum, inv) => sum + (inv.roi || 0), 0) / investors.length : 0;

  const handleAddInvestor = async () => {
    try {
      const payload = {
        name: newInvestor.name,
        email: newInvestor.email,
        phone: newInvestor.phone,
        total_investment: newInvestor.totalInvestment,
      };

      await InvestorRegistrationApi(payload);

      setShowAddDialog(false);
      setNewInvestor({ name: "", email: "", phone: "", totalInvestment: 0 });

      // Refresh the list
      const updatedList = await GetAllInvester();
      setInvestors(updatedList);
    } catch (error) {
      console.error("Error adding investor:", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />

        <main className="flex-1 overflow-hidden">
          <DashboardHeader />

          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Investor Management</h1>
                <p className="text-gray-600 mt-1">Manage investor portfolios and track performance</p>
              </div>

              {/* Add Investor Dialog */}
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Investor
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Investor</DialogTitle>
                    <DialogDescription>Enter the details for the new investor.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input id="name" value={newInvestor.name} onChange={(e) => setNewInvestor({ ...newInvestor, name: e.target.value })} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input id="email" type="email" value={newInvestor.email} onChange={(e) => setNewInvestor({ ...newInvestor, email: e.target.value })} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">Phone</Label>
                      <Input id="phone" value={newInvestor.phone} onChange={(e) => setNewInvestor({ ...newInvestor, phone: e.target.value })} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="investment" className="text-right">Investment</Label>
                      <Input id="investment" type="number" value={newInvestor.totalInvestment} onChange={(e) => setNewInvestor({ ...newInvestor, totalInvestment: Number(e.target.value) })} className="col-span-3" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddInvestor} className="bg-green-600 hover:bg-green-700">Add Investor</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Total Investors</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{investors.length}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Total Investment</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${totalInvestment.toLocaleString()}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Animals Owned</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalAnimals}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Average ROI</CardTitle></CardHeader><CardContent><div className={`text-2xl font-bold ${avgROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>{avgROI.toFixed(1)}%</div></CardContent></Card>
            </div>

            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" /> Search & Filter Investors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Search by name, ID, or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
                  <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filters</Button>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">Total: {investors.length}</Badge>
                  <Badge variant="secondary">Active: {investors.filter(i => i.status === "Active").length}</Badge>
                  <Badge variant="secondary">Profitable: {investors.filter(i => i.roi > 0).length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Investor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvestors.map((inv) => (
                <InvestorCard
                  key={inv.id}
                  id={String(inv.id)}
                  name={inv.name}
                  email={inv.email}
                  phone={inv.phone}
                  totalInvestment={parseFloat(inv.total_investment)}
                  currentValue={parseFloat(inv.total_investment)} // Adjust if available
                  animalsOwned={inv.animalsOwned || 0}
                  roi={inv.roi || 0}
                  joinDate={inv.created_at}
                  status={inv.status || "Active"}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredInvestors.length === 0 && (
              <Card><CardContent className="text-center py-8"><p className="text-gray-500">No investors found matching your search criteria.</p></CardContent></Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Investors;




