import { useState } from "react";
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
import { InvestorRegistrationApi } from "@/Apis/Api"; 

const Investors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newInvestor, setNewInvestor] = useState({
    name: "",
    email: "",
    phone: "",
    totalInvestment: 0
  });

  // Mock data for investors with Pakistani names
  const investors = [
    { 
      id: "INV-001", 
      name: "Ahmed Ali Khan", 
      email: "ahmed.khan@email.com", 
      phone: "+92-300-1234567",
      totalInvestment: 75000, 
      animalsOwned: 8, 
      currentValue: 82500,
      roi: 10.0,
      joinDate: "2024-01-15",
      status: "Active"
    },
    { 
      id: "INV-002", 
      name: "Fatima Sheikh", 
      email: "fatima.sheikh@email.com", 
      phone: "+92-321-9876543",
      totalInvestment: 120000, 
      animalsOwned: 12, 
      currentValue: 135000,
      roi: 12.5,
      joinDate: "2023-11-20",
      status: "Active"
    },
    { 
      id: "INV-003", 
      name: "Muhammad Hassan", 
      email: "m.hassan@email.com", 
      phone: "+92-333-5555555",
      totalInvestment: 50000, 
      animalsOwned: 5, 
      currentValue: 48000,
      roi: -4.0,
      joinDate: "2024-03-10",
      status: "Active"
    },
    { 
      id: "INV-004", 
      name: "Ayesha Malik", 
      email: "ayesha.malik@email.com", 
      phone: "+92-345-7777777",
      totalInvestment: 95000, 
      animalsOwned: 10, 
      currentValue: 108000,
      roi: 13.7,
      joinDate: "2023-09-05",
      status: "Active"
    },
  ];

  const filteredInvestors = investors.filter(investor =>
    investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInvestment = investors.reduce((sum, inv) => sum + inv.totalInvestment, 0);
  const totalAnimals = investors.reduce((sum, inv) => sum + inv.animalsOwned, 0);
  const avgROI = investors.reduce((sum, inv) => sum + inv.roi, 0) / investors.length;

const handleAddInvestor = async () => {
  try {
    const payload = {
      name: newInvestor.name,
      email: newInvestor.email,
      phone: newInvestor.phone,
      total_investment: newInvestor.totalInvestment, // match backend key
      // Optionally add: id: `INV-${Date.now()}` — if backend doesn't auto-generate
    };

    console.log("Adding new investor:", payload);

    await InvestorRegistrationApi(payload);  

    // Optionally show a success toast here
    setShowAddDialog(false);
    setNewInvestor({ name: "", email: "", phone: "", totalInvestment: 0 });

    // If you're managing investor list via state, also update that here
    // setInvestors([...investors, { ...payload, id: generatedId, status: "Active", joinDate: today, ... }])

  } catch (error) {
    console.error("Error adding investor:", error);
    // Optionally show error toast here
  }
};

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <DashboardHeader />
          
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Investor Management</h1>
                <p className="text-gray-600 mt-1">Manage investor portfolios and track performance</p>
              </div>
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
                    <DialogDescription>
                      Enter the details for the new investor.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newInvestor.name}
                        onChange={(e) => setNewInvestor({ ...newInvestor, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newInvestor.email}
                        onChange={(e) => setNewInvestor({ ...newInvestor, email: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={newInvestor.phone}
                        onChange={(e) => setNewInvestor({ ...newInvestor, phone: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="investment" className="text-right">
                        Investment
                      </Label>
                      <Input
                        id="investment"
                        type="number"
                        value={newInvestor.totalInvestment}
                        onChange={(e) => setNewInvestor({ ...newInvestor, totalInvestment: Number(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddInvestor} className="bg-green-600 hover:bg-green-700">
                      Add Investor
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Investors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{investors.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Investment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalInvestment.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Animals Owned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAnimals}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Average ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${avgROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {avgROI.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search & Filter Investors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by name, ID, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">Total: {investors.length}</Badge>
                  <Badge variant="secondary">Active: {investors.filter(i => i.status === "Active").length}</Badge>
                  <Badge variant="secondary">Profitable: {investors.filter(i => i.roi > 0).length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Investors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvestors.map((investor) => (
                <InvestorCard key={investor.id} {...investor} />
              ))}
            </div>

            {filteredInvestors.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No investors found matching your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Investors;
