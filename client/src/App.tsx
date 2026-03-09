import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Hackathons from "@/pages/Hackathons";
import CompleteProfile from "@/pages/CompleteProfile";
import Profile from "@/pages/Profile";
import HackathonAnalytics from "@/pages/HackathonAnalytics";
import HackathonDetails from "@/pages/HackathonDetails";
import AdminUsers from "@/pages/AdminUsers";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import RegisteredHackathons from "@/pages/RegisteredHackathons";
import Deadlines from "@/pages/Deadlines";
import PastHackathons from "@/pages/PastHackathons";
import { DashboardLayout } from "@/components/DashboardLayout";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  // If student profile is incomplete and we aren't already on the complete profile page
  if (user.role === "student" && !user.profileCompleted && window.location.pathname !== "/complete-profile") {
    return <Redirect to="/complete-profile" />;
  }

  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {user ? <ProtectedRoute component={Dashboard} /> : <LandingPage />}
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/complete-profile" component={CompleteProfile} />

      {/* Protected Routes */}
      <Route path="/hackathons">
        <ProtectedRoute component={Hackathons} />
      </Route>
      <Route path="/past-hackathons">
        <ProtectedRoute component={PastHackathons} />
      </Route>
      <Route path="/registered">
        <ProtectedRoute component={RegisteredHackathons} />
      </Route>
      <Route path="/deadlines">
        <ProtectedRoute component={Deadlines} />
      </Route>
      <Route path="/hackathons/:id">
        <ProtectedRoute component={HackathonDetails} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      <Route path="/admin/hackathons/:id">
        <ProtectedRoute component={HackathonAnalytics} />
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute component={AdminUsers} />
      </Route>

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

import { ThemeProvider } from "./hooks/use-theme";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="asset-manager-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
