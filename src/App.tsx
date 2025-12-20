import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Report from "./pages/Report";
import QuestDetail from "./pages/QuestDetail";
import FaceScan from "./pages/FaceScan";
import Tasks from "./pages/Tasks";
import Guide from "./pages/Guide";
import GuideFace from "./pages/guide/GuideFace";
import GuideHygiene from "./pages/guide/GuideHygiene";
import GuideStyle from "./pages/guide/GuideStyle";
import GuideBody from "./pages/guide/GuideBody";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/report" element={<Report />} />
              <Route path="/quest/:id" element={<QuestDetail />} />
              <Route path="/face-scan" element={<FaceScan />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/guide/face" element={<GuideFace />} />
              <Route path="/guide/hygiene" element={<GuideHygiene />} />
              <Route path="/guide/style" element={<GuideStyle />} />
              <Route path="/guide/body" element={<GuideBody />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
