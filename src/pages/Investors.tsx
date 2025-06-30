
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

const Investors = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for investors
  const investors = [
    { 
      id: "INV-001", 
      name: "John Smith", 
      email: "john.smith@email.com", 
      phone: "+1-555-0123",
      totalInvestment: 75000, 
      animalsOwned: 8, 
      currentValue: 82500,
      roi: 10.0,
      joinDate: "2024-01-15",
      status: "Active"
    },
    { 
      id: "INV-002", 
      name: "Sarah Johnson", 
      email: "sarah.j@email.com", 
      phone: "+1-555-0456",
      totalInvestment: 120000, 
      animalsOwned: 12, 
      currentValue: 135000,
      roi: 12.5,
      joinDate: "2023-11-20",
      status: "Active"
    },
    { 
      id: "INV-003", 
      name: "Michael Chen", 
      email: "m.chen@email.com", 
      phone: "+1-555-0789",
      totalInvestment: 50000, 
      animalsOwned: 5, 
      currentValue: 48000,
      roi: -4.0,
      joinDate: "2024-03-10",
      status: "Active"
    },
    { 
      id: "INV-004", 
      name: "Emily Davis", 
      email: "emily.davis@email.com", 
      phone: "+1-555-0321",
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
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Investor
              </Button>
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
