import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { DashboardStats } from "@/components/DashboardStats";
import { useHackathons } from "@/hooks/use-hackathons";
import { HackathonCard } from "@/components/HackathonCard";
import { UserList } from "@/components/UserList";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Download } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: hackathons, isLoading } = useHackathons();

  const isAdmin = user?.role === 'admin' || (user as any)?.isAdmin;

  // For admins, download CSV logic
  const handleExportCSV = () => {
    if (!hackathons) return;

    // Convert data to CSV string
    const headers = ["ID", "Title", "Registrations", "Reg Deadline", "Sub Deadline", "Created By"];
    const rows = hackathons.map(h => [
      h.id,
      `"${h.title}"`,
      h.registrationCount,
      new Date(h.registrationDeadline).toLocaleDateString(),
      new Date(h.submissionDeadline).toLocaleDateString(),
      h.createdBy
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hackathon_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter hackathons for display
  // Admin sees all recent ones, Students see their registered ones
  const displayedHackathons = isAdmin
    ? hackathons
    : hackathons?.filter(h => h.isRegistered);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950">
      <Navbar />

      <main className="container py-8 space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
              Hello, {(user as any).firstName || user?.email || "User"}!
            </h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your hackathons today.</p>
          </div>
          {isAdmin && (
            <Button variant="outline" onClick={handleExportCSV} className="hidden sm:flex">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          )}
        </header>

        <DashboardStats />

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display">
              {isAdmin ? "All Active Hackathons" : "Your Registered Events"}
            </h2>
            <Link href="/hackathons">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : displayedHackathons?.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-border shadow-sm">
              <p className="text-muted-foreground mb-4">
                {isAdmin ? "No hackathons created yet." : "You haven't registered for any hackathons yet."}
              </p>
              <Link href="/hackathons">
                <Button className="bg-primary hover:bg-primary/90">
                  Browse Hackathons
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedHackathons?.slice(0, 3).map((hackathon, idx) => (
                <motion.div
                  key={hackathon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <HackathonCard hackathon={hackathon} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {isAdmin && (
          <section className="mt-12">
            <UserList />
          </section>
        )}
      </main>
    </div>
  );
}
