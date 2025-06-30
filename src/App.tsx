
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RegisterAnimal from "./pages/RegisterAnimal";
import WeightsVaccination from "./pages/WeightsVaccination";
import Investors from "./pages/Investors";
import Health from "./pages/Health";
import Incidents from "./pages/Incidents";
import Performance from "./pages/Performance";
import Settings from "./pages/Settings";
import SlaughterRecording from "./pages/SlaughterRecording";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register-animal" element={<RegisterAnimal />} />
          <Route path="/weights-vaccination" element={<WeightsVaccination />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/health" element={<Health />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/slaughter-recording" element={<SlaughterRecording />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
