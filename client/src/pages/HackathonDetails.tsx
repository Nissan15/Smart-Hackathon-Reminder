import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useRegisterForHackathon, useSubmitIdea, useHackathon } from "@/hooks/use-hackathons";
import { api } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    Calendar,
    Clock,
    Users,
    ArrowLeft,
    Trophy,
    Info,
    CheckCircle2,
    ExternalLink,
    Sparkles,
    Zap,
    Target
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function HackathonDetails() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const hackathonId = Number(id);

    const { data: hackathon, isLoading, error } = useHackathon(hackathonId);

    const register = useRegisterForHackathon();
    const submitIdea = useSubmitIdea();

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Loading Event Data...</p>
            </div>
        );
    }

    if (error || !hackathon) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-rose-500/10 p-6 rounded-full mb-6">
                    <Info className="h-10 w-10 text-rose-500" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-2">Event Not Found</h2>
                <p className="text-muted-foreground mb-8 max-w-sm">The hackathon you are looking for has been moved or no longer exists.</p>
                <Link href="/hackathons">
                    <Button variant="outline" className="rounded-xl font-bold border-2">Return to Events</Button>
                </Link>
            </div>
        );
    }

    const registrationDeadline = new Date(hackathon.registrationDeadline);
    const submissionDeadline = new Date(hackathon.submissionDeadline);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const actualNow = new Date();
    const isExpired = registrationDeadline < actualNow;
    const isSubmissionExpired = submissionDeadline < actualNow;
    const isRegistered = hackathon.isRegistered;
    const isSubmitted = hackathon.isSubmitted;

    return (
        <div className="space-y-10 animate-enter">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link href="/hackathons">
                        <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-primary font-bold">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ecosystem
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <Badge className={isRegistered ? "bg-primary text-white" : "bg-muted text-muted-foreground"}>
                            {isRegistered ? "Active Registration" : isExpired ? "Event Closed" : "Applications Open"}
                        </Badge>
                        {isRegistered && (
                            <span className="text-sm text-green-500 font-bold flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" /> Participation Confirmed
                            </span>
                        )}
                        {isSubmitted && (
                            <span className="text-sm text-indigo-500 font-bold flex items-center gap-1">
                                <Sparkles className="h-4 w-4" /> Idea Submitted
                            </span>
                        )}
                    </div>
                    <h1 className="text-5xl font-heading font-extrabold tracking-tight">
                        {hackathon.title}
                    </h1>
                    <p className="text-xl text-muted-foreground mt-4 font-medium max-w-2xl leading-relaxed">
                        Push the boundaries of technology and compete with the brightest minds in the ecosystem.
                    </p>
                </div>

                <div className="flex flex-col sm:row gap-3 min-w-[240px]">
                    <AnimatePresence mode="wait">
                        {isRegistered ? (
                            <div className="flex flex-col gap-3">
                                {!isSubmitted && !isSubmissionExpired && (
                                    <Button
                                        size="lg"
                                        className="h-14 rounded-2xl btn-gradient font-bold text-lg shadow-xl shadow-primary/25"
                                        onClick={() => submitIdea.mutate(hackathon.id)}
                                        disabled={submitIdea.isPending}
                                    >
                                        {submitIdea.isPending ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Submit Idea"}
                                        {!submitIdea.isPending && <CheckCircle2 className="ml-2 w-5 h-5" />}
                                    </Button>
                                )}

                                {isSubmitted && (
                                    <Button
                                        disabled
                                        size="lg"
                                        className="h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 border-2 border-indigo-500/20 font-bold text-lg"
                                    >
                                        Idea Submitted
                                    </Button>
                                )}

                                {isSubmissionExpired && !isSubmitted && (
                                    <Button
                                        disabled
                                        size="lg"
                                        className="h-14 rounded-2xl bg-muted text-muted-foreground border-2 border-muted font-bold text-lg"
                                    >
                                        Submissions Closed
                                    </Button>
                                )}


                            </div>
                        ) : (
                            <Button
                                size="lg"
                                className="h-14 rounded-2xl btn-gradient font-bold text-lg shadow-xl shadow-primary/25"
                                onClick={() => register.mutate(hackathon.id)}
                                disabled={register.isPending || isExpired}
                            >
                                {isExpired ? "Registration Closed" : register.isPending ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Approve & Join"}
                                {!isExpired && !register.isPending && <Zap className="ml-2 w-5 h-5" />}
                            </Button>
                        )}
                    </AnimatePresence>

                    {hackathon.link && (
                        <a href={hackathon.link} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="lg" className="w-full h-14 rounded-2xl border-2 font-bold text-lg">
                                <ExternalLink className="mr-2 h-5 w-5" />
                                Review Site
                            </Button>
                        </a>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "Registration End", value: format(registrationDeadline, 'MMMM d, yyyy'), icon: Calendar, gradient: "from-blue-500/10 to-indigo-500/5" },
                    { title: "Final Deliverable", value: format(submissionDeadline, 'MMMM d, yyyy'), icon: Clock, gradient: "from-purple-500/10 to-pink-500/5" },
                    { title: "Community Size", value: `${hackathon.registrationCount || 0} Innovators`, icon: Users, gradient: "from-emerald-500/10 to-teal-800/5" },
                ].map((stat, idx) => (
                    <Card key={idx} className={`border-none shadow-xl bg-gradient-to-br ${stat.gradient} rounded-[2rem]`}>
                        <CardHeader className="pb-2">
                            <stat.icon className="h-6 w-6 text-primary mb-2 opacity-80" />
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-heading font-extrabold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-muted/30 px-10 py-8 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <Info className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-heading font-bold">Event Narrative</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 py-10">
                            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">
                                {hackathon.description}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-muted/30 px-10 py-8 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amber-500/10 rounded-2xl">
                                    <Trophy className="h-6 w-6 text-amber-600" />
                                </div>
                                <CardTitle className="text-2xl font-heading font-bold">Rules of Engagement</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 py-10">
                            <ul className="space-y-6">
                                {[
                                    "Synchronous delivery required by the final deadline.",
                                    "Individual or collaborative team formations (check specific guidelines).",
                                    "Zero tolerance for non-original intellectual property.",
                                    "Minimum viable prototype must be demonstrated."
                                ].map((rule, idx) => (
                                    <li key={idx} className="flex gap-4">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </div>
                                        <span className="text-lg font-medium text-muted-foreground leading-snug">{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="border-none shadow-2xl bg-zinc-900 text-white rounded-[2.5rem] overflow-hidden sticky top-28">
                        <div className="absolute top-0 right-0 p-6 opacity-20">
                            <Sparkles size={140} />
                        </div>
                        <CardHeader className="px-8 pt-10">
                            <CardTitle className="text-3xl font-heading font-extrabold">Ready to Build?</CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-10 relative z-10">
                            <p className="text-zinc-400 text-lg mb-8 leading-relaxed font-medium">
                                Join a community of developers and designers. Pushing the limits of what's possible is just the beginning.
                            </p>
                            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 mb-10">
                                <div className="text-[10px] uppercase tracking-widest font-extrabold text-primary mb-3">Next Step</div>
                                <div className="text-xl font-bold">{isExpired ? "Review Submissions" : isRegistered ? "Team Brainstorming" : "Registration Open"}</div>
                            </div>

                            {!isRegistered && !isExpired && (
                                <Button
                                    className="w-full bg-white text-black hover:bg-zinc-100 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-white/5"
                                    onClick={() => register.mutate(hackathon.id)}
                                    disabled={register.isPending}
                                >
                                    {register.isPending ? <Loader2 className="animate-spin h-6 w-6" /> : "Register with 1-Click"}
                                </Button>
                            )}

                            {isRegistered && (
                                <div className="flex items-center justify-center gap-2 p-4 bg-green-500/10 rounded-2xl border border-green-500/20 text-green-500 font-bold">
                                    <Target className="w-5 h-5" /> You are in the roster!
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="p-8 rounded-[2rem] bg-muted/30 border-2 border-dashed border-muted flex flex-col gap-4">
                        <h4 className="font-heading font-bold text-lg flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            Direct Inquiries
                        </h4>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            For technical questions or logistical support, please use the official communication channels.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
