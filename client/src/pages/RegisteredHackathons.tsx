import { useHackathons } from "@/hooks/use-hackathons";
import { HackathonCard } from "@/components/HackathonCard";
import { Loader2, Calendar, ClipboardCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisteredHackathons() {
    const { data: hackathons, isLoading } = useHackathons();

    const registeredHackathons = hackathons?.filter(h => h.isRegistered);

    registeredHackathons?.sort((a, b) => new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime());

    return (
        <div className="space-y-10 animate-enter">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-extrabold tracking-tight">
                        My <span className="text-gradient">Registrations</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">Hackathons you have successfully registered for.</p>
                </div>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Retrieving your registrations...</p>
                </div>
            ) : registeredHackathons?.length === 0 ? (
                <div className="text-center py-32 bg-card rounded-[3rem] border-2 border-dashed border-muted relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                    <div className="bg-muted p-6 rounded-3xl w-fit mx-auto mb-6">
                        <ClipboardCheck className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-2">No registrations found</h3>
                    <p className="text-muted-foreground font-medium max-w-sm mx-auto">You haven't registered for any hackathons yet. Head over to the Explore tab to find your next challenge!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {registeredHackathons?.map((hackathon, idx) => (
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
