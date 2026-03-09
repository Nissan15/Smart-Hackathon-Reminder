import { useState } from "react";
import { useHackathons } from "@/hooks/use-hackathons";
import { HackathonCard } from "@/components/HackathonCard";
import { CreateHackathonDialog } from "@/components/CreateHackathonDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { Search, Loader2, Calendar, Filter, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hackathons() {
  const { data: hackathons, isLoading } = useHackathons();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const isAdmin = user?.role === 'admin' || (user as any)?.isAdmin;
  const now = new Date();

  const filteredHackathons = hackathons?.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(search.toLowerCase());
    const isFuture = new Date(h.registrationDeadline) > now;
    return matchesSearch && isFuture;
  });

  filteredHackathons?.sort((a, b) => new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime());

  return (
    <div className="space-y-10 animate-enter">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-extrabold tracking-tight">
            Ecosystem <span className="text-gradient">Events</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Discover future opportunities to build and collaborate.</p>
        </div>

        {isAdmin && <CreateHackathonDialog />}
      </header>

      <div className="bg-card p-6 rounded-[2rem] shadow-xl border-none flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search events by title or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 bg-muted/50 border-none h-14 rounded-2xl text-base font-medium focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Synchronizing Ecosystem...</p>
        </div>
      ) : filteredHackathons?.length === 0 ? (
        <div className="text-center py-32 bg-card rounded-[3rem] border-2 border-dashed border-muted relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="bg-muted p-6 rounded-3xl w-fit mx-auto mb-6">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-heading font-bold mb-2">No upcoming events found</h3>
          <p className="text-muted-foreground font-medium max-w-sm mx-auto">Check back later for new opportunities or browse past hackathons.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredHackathons?.map((hackathon, idx) => (
              <motion.div
                key={hackathon.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <HackathonCard hackathon={hackathon} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
