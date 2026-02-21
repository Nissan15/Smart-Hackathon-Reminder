import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useRegisterForHackathon, useUnregisterFromHackathon } from "@/hooks/use-hackathons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, Users, ArrowLeft, Trophy, Info, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function HackathonDetails() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const hackathonId = Number(id);

    const { data: hackathon, isLoading, error } = useQuery({
        queryKey: ["/api/hackathons", hackathonId],
        queryFn: async () => {
            const res = await fetch(`/api/hackathons/${hackathonId}`, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch hackathon details");
            return await res.json();
        },
    });

    const register = useRegisterForHackathon();
    const unregister = useUnregisterFromHackathon();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !hackathon) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold text-destructive mb-2">Not Found</h2>
                <p className="text-muted-foreground mb-4">The hackathon you're looking for doesn't exist.</p>
                <Link href="/hackathons">
                    <Button variant="outline">Back to Hackathons</Button>
                </Link>
            </div>
        );
    }

    const registrationDeadline = new Date(hackathon.registrationDeadline);
    const submissionDeadline = new Date(hackathon.submissionDeadline);
    const now = new Date();
    const isExpired = registrationDeadline < now;
    const isRegistered = hackathon.isRegistered;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />
            <main className="container max-w-4xl py-12 px-6">
                <Link href="/hackathons">
                    <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Events
                    </Button>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant={isRegistered ? "default" : "secondary"} className={isRegistered ? "bg-green-500" : ""}>
                                    {isRegistered ? "Registered" : isExpired ? "Closed" : "Open"}
                                </Badge>
                                {isRegistered && (
                                    <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                        <CheckCircle2 className="h-4 w-4" />
                                        You're in!
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">
                                {hackathon.title}
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl">
                                Elevate your skills and build something amazing.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[200px]">
                            {isRegistered ? (
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full border-red-200 hover:bg-red-50 hover:text-red-600 h-14 text-lg font-semibold"
                                    onClick={() => unregister.mutate(hackathon.id)}
                                    disabled={unregister.isPending || isExpired}
                                >
                                    {unregister.isPending ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
                                    Unregister from Event
                                </Button>
                            ) : (
                                <Button
                                    size="lg"
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 h-14 text-lg font-semibold"
                                    onClick={() => register.mutate(hackathon.id)}
                                    disabled={register.isPending || isExpired}
                                >
                                    {isExpired ? "Registration Closed" : register.isPending ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Complete Registration"}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-none shadow-md bg-white dark:bg-zinc-900">
                            <CardHeader className="pb-2">
                                <Calendar className="h-5 w-5 text-primary mb-2" />
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Registration Ends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold font-display">{format(registrationDeadline, 'MMMM d, yyyy')}</div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md bg-white dark:bg-zinc-900">
                            <CardHeader className="pb-2">
                                <Clock className="h-5 w-5 text-primary mb-2" />
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Final Submission</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold font-display">{format(submissionDeadline, 'MMMM d, yyyy')}</div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md bg-white dark:bg-zinc-900">
                            <CardHeader className="pb-2">
                                <Users className="h-5 w-5 text-primary mb-2" />
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Participants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold font-display">{hackathon.registrationCount || 0} Students</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border-none shadow-md overflow-hidden">
                                <CardHeader className="bg-primary/5 border-b">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-xl font-bold">About this Hackathon</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {hackathon.description}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md overflow-hidden">
                                <CardHeader className="bg-primary/5 border-b">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-xl font-bold">Rules & Guidelines</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex gap-3">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                            Projects must be submitted before the submission deadline.
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                            Individual or team participation allowed (check specific event rules).
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                            Plagiarism will result in immediate disqualification.
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="border-none shadow-md bg-primary text-primary-foreground">
                                <CardHeader>
                                    <CardTitle>Ready to Innovate?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-primary-foreground/80 mb-6">
                                        Join hundreds of other students and push your boundaries. Registering takes less than a minute.
                                    </p>
                                    <div className="p-4 bg-white/10 rounded-xl space-y-2">
                                        <div className="text-xs uppercase tracking-widest font-bold opacity-60">Status</div>
                                        <div className="font-semibold">{isExpired ? "Closed" : isRegistered ? "You're Registered" : "Accepting Applications"}</div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    {!isRegistered && !isExpired && (
                                        <Button
                                            className="w-full bg-white text-primary hover:bg-zinc-100 h-12 font-bold"
                                            onClick={() => register.mutate(hackathon.id)}
                                        >
                                            {register.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Register Now"}
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>

                            <div className="p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                <h4 className="font-bold mb-3 flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Need Help?
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    If you have questions about this event, please reach out to the organizing team through the campus portal.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
