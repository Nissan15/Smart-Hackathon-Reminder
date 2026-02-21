import { useState } from "react";
import { useHackathons } from "@/hooks/use-hackathons";
import { HackathonCard } from "@/components/HackathonCard";
import { CreateHackathonDialog } from "@/components/CreateHackathonDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { Search, Loader2, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function Hackathons() {
  const { data: hackathons, isLoading } = useHackathons();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const isAdmin = user?.role === 'admin' || (user as any)?.isAdmin;

  const filteredHackathons = hackathons?.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" 
      ? true 
      : filter === "registered" 
        ? h.isRegistered 
        : !h.isRegistered;
    return matchesSearch && matchesFilter;
  });

  // Sort by deadline (soonest first)
  filteredHackathons?.sort((a, b) => new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime());

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950">
      <Navbar />
      
      <main className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Explore Hackathons</h1>
            <p className="text-muted-foreground mt-1">Discover and register for upcoming events.</p>
          </div>
          
          {isAdmin && <CreateHackathonDialog />}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card p-4 rounded-xl shadow-sm border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search hackathons..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background border-border/50 focus:border-primary focus:ring-primary/10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="registered">Registered</SelectItem>
              <SelectItem value="unregistered">Not Registered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredHackathons?.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
            <div className="bg-primary/5 p-4 rounded-full w-fit mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary/50" />
            </div>
            <h3 className="text-lg font-semibold">No hackathons found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons?.map((hackathon, idx) => (
              <motion.div
                key={hackathon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <HackathonCard hackathon={hackathon} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
