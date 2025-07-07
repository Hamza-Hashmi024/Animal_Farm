
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AddAnimalDialog } from "@/components/AddAnimalDialog";
import { useToast } from "@/hooks/use-toast";
import { AddBreedDialog } from "@/components/AddBreedDialog";

const RegisterAnimal = () => {
  const { toast } = useToast();

  const handleAddAnimal = (newAnimal: any) => {
    // In a real app, this would save to a database
    console.log("New animal registered:", newAnimal);
    toast({
      title: "Animal Registered",
      description: `Animal ${newAnimal.tag} has been successfully registered.`
    });
  };

  const handleAddBreed = (newBreed: any) => {
    console.log("New breed registered:", newBreed);
    toast({
      title: "Breed Registered",
      description: `Breed ${newBreed.name} has been successfully registered.`
    });
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
                <h1 className="text-3xl font-bold text-gray-900">Register Animal</h1>
                <p className="text-gray-600 mt-1">Add new livestock to the system</p>
              </div>
            </div>

            {/* Registration Form Section */}
            <Card>
              <CardHeader>
                <CardTitle>Animal Registration Form</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center gap-4 py-8">
  <AddAnimalDialog onAddAnimal={handleAddAnimal} />
  <AddBreedDialog onBreedAdded={ handleAddBreed} />
</CardContent>
            
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Registration Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">Required Information</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Animal Tag ID</li>
                        <li>• Serial Number</li>
                        <li>• Breed and Coat Color</li>
                        <li>• Initial Weight</li>
                        <li>• Purchase Details</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-900 mb-2">Optional Information</h3>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Investor Assignment</li>
                        <li>• Assigned Doctor</li>
                        <li>• Farm and Pen Location</li>
                        <li>• Special Notes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default RegisterAnimal;
