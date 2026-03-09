import { useHackathons } from "@/hooks/use-hackathons";
import { HackathonCard } from "@/components/HackathonCard";
import { Loader2, Clock, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function Deadlines() {
    const { data: hackathons, isLoading } = useHackathons();

    // Show registered hackathons that haven't passed their submission deadline yet
    const now = new Date();
    const upcomingDeadlines = hackathons
        ?.filter(h => h.isRegistered)
        ?.filter(h => new Date(h.submissionDeadline) > now)
        ?.sort((a, b) => new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime());

    return (
        <div className="space-y-10 animate-enter">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-extrabold tracking-tight">
                        Upcoming <span className="text-gradient">Deadlines</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">Keep track of your submission dates and stay ahead.</p>
                </div>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Tracking deadlines...</p>
                </div>
            ) : upcomingDeadlines?.length === 0 ? (
                <div className="text-center py-32 bg-card rounded-[3rem] border-2 border-dashed border-muted relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                    <div className="bg-muted p-6 rounded-3xl w-fit mx-auto mb-6">
                        <Clock className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-2">No active deadlines</h3>
                    <p className="text-muted-foreground font-medium max-w-sm mx-auto">You don't have any upcoming submission deadlines. Register for more events to see them here!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {upcomingDeadlines?.map((hackathon, idx) => (
                            <motion.div
                                key={hackathon.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                            >
                                <HackathonCard hackathon={hackathon} />
                                <div className="mt-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-bold">
                                    <Clock size={16} />
                                    Submission: {format(new Date(hackathon.submissionDeadline), "PPP")}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
