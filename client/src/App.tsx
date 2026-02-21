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
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
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

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/complete-profile" component={CompleteProfile} />

      {/* Protected Routes */}
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/hackathons">
        <ProtectedRoute component={Hackathons} />
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

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
