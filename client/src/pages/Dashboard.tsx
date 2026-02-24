import { StatCard } from "@/components/StatCard";
import {
  Trophy,
  Users,
  Clock,
  AlertCircle,
  ArrowRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useStats, useHackathons } from "@/hooks/use-hackathons";
import { CreateHackathonDialog } from "@/components/CreateHackathonDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: hackathons, isLoading: hackathonsLoading } = useHackathons();

  const isAdmin = user?.role === 'admin' || (user as any)?.isAdmin;

  if (statsLoading || hackathonsLoading) {
    return (
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const adminStats = [
    {
      label: "Total Hackathons",
      value: stats?.totalHackathons || 0,
      icon: Trophy,
      delay: 0.1
    },
    {
      label: "Global Registrations",
      value: stats?.totalRegistrations || 0,
      icon: Users,
      delay: 0.2
    },
    {
      label: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Clock,
      delay: 0.3
    },
    {
      label: "Platform Users",
      value: stats?.totalUsers || 0,
      icon: AlertCircle,
      delay: 0.4
    }
  ];

  const studentStats = [
    {
      label: "My Hackathons",
      value: stats?.registeredCount || 0,
      icon: Trophy,
      delay: 0.1
    },
    {
      label: "Upcoming Deadlines",
      value: stats?.upcomingDeadlines || 0,
      icon: Clock,
      delay: 0.2
    },
    {
      label: "Available Events",
      value: stats?.totalHackathons || 0,
      icon: Users,
      delay: 0.3
    },
    {
      label: "Missed Deadlines",
      value: "0", // Could be calculated if needed
      icon: AlertCircle,
      delay: 0.4
    }
  ];

  const dashboardStats = isAdmin ? adminStats : studentStats;
  const displayedHackathons = isAdmin
    ? hackathons
    : hackathons?.filter(h => h.isRegistered);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, <span className="text-gradient">{(user as any)?.firstName || "Innovator"}</span>! 👋
          </h2>
          <p className="text-slate-500 mt-1">
            {isAdmin
              ? "You're in control of the hackathon ecosystem."
              : "Here's a quick overview of your hackathon journey."}
          </p>
        </div>
        {isAdmin && <CreateHackathonDialog />}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isAdmin ? "Hackathon Performance" : "Active Registrations"}
            </h3>
            <p className="text-sm text-slate-500">
              {isAdmin
                ? "Monitoring participation across all live events."
                : "Your current participation status and deadlines."}
            </p>
          </div>
          <Button variant="ghost" className="text-sm rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 font-bold group">
            View All <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Hackathon Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {isAdmin ? "Registrations" : "Deadline"}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {isAdmin ? "Status" : "Registration Status"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedHackathons?.slice(0, 5).map((hackathon) => {
                const now = new Date();
                const deadline = new Date(hackathon.registrationDeadline);
                const isPast = now > deadline;

                return (
                  <tr key={hackathon.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform overflow-hidden">
                          <img
                            src={`https://api.dicebear.com/7.x/shapes/svg?seed=${hackathon.id}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {hackathon.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-700 dark:text-slate-300">
                      {isAdmin
                        ? <span className="text-lg">{hackathon.registrationCount}</span>
                        : format(new Date(hackathon.submissionDeadline), "MMM dd, yyyy")
                      }
                    </td>
                    <td className="px-6 py-5">
                      {isAdmin ? (
                        <Badge variant="outline" className={cn(
                          "rounded-lg px-2.5 py-1 font-bold border",
                          isPast
                            ? "bg-slate-500/10 text-slate-500 border-slate-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}>
                          {isPast ? "Completed" : "Active"}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className={cn(
                          "rounded-lg px-2.5 py-1 font-bold border",
                          hackathon.isRegistered
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}>
                          {hackathon.isRegistered ? "Participating" : "Waitlisted"}
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
              {(!displayedHackathons || displayedHackathons.length === 0) && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-500 font-medium">
                    No active hackathons to display.
                    {isAdmin ? " Start by creating a new one!" : " Browse and register for events."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
