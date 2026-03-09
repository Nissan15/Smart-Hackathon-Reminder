import { useParams } from "wouter";
import { useHackathonAnalytics, useSendReminders } from "@/hooks/use-users";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Loader2,
    Users,
    Eye,
    UserMinus,
    Mail,
    MapPin,
    Calendar,
    ArrowLeft,
    TrendingUp,
    BarChart,
    Search,
    Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function HackathonAnalytics() {
    const { id } = useParams<{ id: string }>();
    const hackathonId = Number(id);
    const { data: analytics, isLoading, error } = useHackathonAnalytics(hackathonId);
    const remindMutation = useSendReminders();
    const { toast } = useToast();

    const handleSendReminders = () => {
        remindMutation.mutate(hackathonId, {
            onSuccess: () => {
                toast({
                    title: "Reminders Triggered",
                    description: "Emails are being sent to relevant students.",
                });
            },
            onError: (err) => {
                toast({
                    title: "Error",
                    description: err instanceof Error ? err.message : "Failed to trigger reminders",
                    variant: "destructive",
                });
            }
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground font-medium animate-pulse">Analyzing participation data...</p>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <BarChart className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-2">Analysis Failed</h2>
                <p className="text-muted-foreground mb-8 max-w-sm">{error instanceof Error ? error.message : "We couldn't retrieve the analytics for this hackathon."}</p>
                <Link href="/">
                    <Button variant="outline" className="rounded-xl font-bold border-2">
                        Return to Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    const { hackathon, stats, users } = analytics;

    const statCards = [
        { title: "Peak Exposure", value: stats.visited, label: "Total Visits", icon: Eye, gradient: "from-blue-500 to-indigo-600" },
        { title: "Conversion", value: stats.registered, label: "Registrations", icon: Users, gradient: "from-emerald-500 to-teal-600" },
        { title: "Drop-off", value: stats.notRegistered, label: "Interested only", icon: UserMinus, gradient: "from-orange-500 to-rose-600" },
    ];

    return (
        <div className="space-y-10 animate-enter">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-primary font-bold">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ecosystem
                        </Button>
                    </Link>
                    <h1 className="text-4xl font-heading font-extrabold tracking-tight">
                        {hackathon.title} <span className="text-primary italic">Insights</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">Real-time engagement metrics and student participation data.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleSendReminders}
                        disabled={remindMutation.isPending}
                        className="rounded-2xl font-bold gap-2 shadow-lg"
                    >
                        {remindMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Mail className="w-4 h-4" />
                        )}
                        Send Reminders
                    </Button>
                    <div className="bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20 flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="text-sm font-bold text-primary">{stats.registered} Applied</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                    >
                        <Card className={`border-none shadow-xl bg-gradient-to-br ${card.gradient} text-white overflow-hidden relative group`}>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <card.icon size={100} />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">{card.title}</div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-extrabold mb-1 tracking-tight">{card.value}</div>
                                <div className="text-xs font-medium text-white/60">{card.label}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="border-none shadow-xl bg-card rounded-[2rem] overflow-hidden">
                <CardHeader className="border-b bg-muted/30 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-heading font-bold">Registered Innovators</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search student..."
                                    className="pl-10 pr-4 py-2 bg-background border border-muted-border rounded-xl text-sm focus:ring-2 ring-primary/20 outline-none w-64"
                                />
                            </div>
                            <Button variant="outline" size="icon" className="rounded-xl border-2">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        {users.length === 0 ? (
                            <div className="text-center py-24 text-muted-foreground group">
                                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Users className="h-10 w-10 opacity-40" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">No registrants yet</h3>
                                <p className="max-w-xs mx-auto mt-2">When students register for this hackathon, they'll appear here with their details.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-muted/10">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="pl-8 py-5 uppercase text-[10px] font-extrabold tracking-widest">Student</TableHead>
                                        <TableHead className="uppercase text-[10px] font-extrabold tracking-widest">Identity</TableHead>
                                        <TableHead className="uppercase text-[10px] font-extrabold tracking-widest">Department</TableHead>
                                        <TableHead className="uppercase text-[10px] font-extrabold tracking-widest text-right pr-8">Applied Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((reg: any) => (
                                        <TableRow key={reg.id} className="group hover:bg-muted/20 transition-all border-b border-muted/50">
                                            <TableCell className="pl-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-12 w-12 rounded-2xl border-2 border-white shadow-sm">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reg.studentEmail}`} />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                            {reg.studentName?.[0] || "?"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-bold text-sm group-hover:text-primary transition-colors">{reg.studentName}</div>
                                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {reg.studentEmail}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5">
                                                <Badge variant="secondary" className="font-mono text-[11px] bg-muted/50 border-none px-2 rounded-lg">
                                                    {reg.registerNumber || "N/A"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-5 font-medium text-sm text-foreground/80">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                                                    {reg.department || "General"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-8 py-5">
                                                <div className="text-sm font-bold">{format(new Date(reg.timestamp), "MMM d, yyyy")}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase font-medium">{format(new Date(reg.timestamp), "HH:mm a")}</div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
