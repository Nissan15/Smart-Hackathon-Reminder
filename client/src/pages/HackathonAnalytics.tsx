import { useParams } from "wouter";
import { useHackathonAnalytics } from "@/hooks/use-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Users, Eye, UserMinus, Mail, MapPin, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { format } from "date-fns";

export default function HackathonAnalytics() {
    const { id } = useParams<{ id: string }>();
    const hackathonId = Number(id);
    const { data: analytics, isLoading, error } = useHackathonAnalytics(hackathonId);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
                <p className="text-muted-foreground mb-4">{error instanceof Error ? error.message : "Failed to load analytics"}</p>
                <Link href="/">
                    <Button variant="outline">Return to Dashboard</Button>
                </Link>
            </div>
        );
    }

    const { hackathon, stats, users } = analytics;

    const statCards = [
        { title: "Visited", value: stats.visited, icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Registered", value: stats.registered, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { title: "Not Registered", value: stats.notRegistered, icon: UserMinus, color: "text-orange-500", bg: "bg-orange-500/10" },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />
            <main className="container py-8 px-6">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-primary">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
                            {hackathon.title}
                        </h1>
                        <p className="text-muted-foreground mt-1">Detailed registration analytics and insights.</p>
                    </div>
                    <Badge className="text-lg px-4 py-1.5" variant="secondary">
                        {stats.registered} Registrations
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {statCards.map((card, idx) => (
                        <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-all">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    {card.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${card.bg}`}>
                                    <card.icon className={`h-5 w-5 ${card.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold font-display">{card.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="border-none shadow-md overflow-hidden">
                    <CardHeader className="bg-white dark:bg-zinc-900 border-b">
                        <CardTitle className="text-xl font-bold font-display">Registered Students</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            {users.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>No students registered yet for this hackathon.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-[80px]">Student</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Reg Number</TableHead>
                                            <TableHead className="text-right">Applied On</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((reg: any) => (
                                            <TableRow key={reg.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell>
                                                    <Avatar className="h-9 w-9 border">
                                                        <AvatarImage src={reg.profileImageUrl} />
                                                        <AvatarFallback className="bg-primary/5 text-primary text-xs">
                                                            {reg.studentName?.[0] || "?"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell className="font-medium">{reg.studentName}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Mail className="h-3 w-3" />
                                                        {reg.studentEmail}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{reg.department || "N/A"}</TableCell>
                                                <TableCell className="font-mono text-xs">{reg.registerNumber || "N/A"}</TableCell>
                                                <TableCell className="text-right text-muted-foreground text-sm">
                                                    {format(new Date(reg.timestamp), "MMM d, yyyy")}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
