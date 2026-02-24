import { useStats } from "@/hooks/use-hackathons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Calendar, AlertCircle, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function DashboardStats() {
  const { data: stats, isLoading } = useStats();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || (user as any)?.isAdmin;

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
    </div>;
  }

  // Fallback if stats fail
  if (!stats) return null;

  const cards = isAdmin ? [
    { title: "Total Hackathons", value: stats.totalHackathons || 0, icon: Trophy, gradient: "from-indigo-500 to-purple-600" },
    { title: "Active Students", value: stats.totalStudents || 0, icon: Users, gradient: "from-cyan-500 to-blue-600" },
    { title: "Platform Users", value: stats.totalUsers || 0, icon: Shield, gradient: "from-pink-500 to-rose-600" },
    { title: "Registrations", value: stats.totalRegistrations || 0, icon: Calendar, gradient: "from-orange-500 to-yellow-600" },
  ] : [
    { title: "My Hackathons", value: stats.registeredCount || 0, icon: Trophy, gradient: "from-indigo-500 to-purple-600" },
    { title: "Upcoming Deadlines", value: stats.upcomingDeadlines || 0, icon: AlertCircle, gradient: "from-orange-500 to-rose-600" },
    { title: "Available Events", value: stats.totalHackathons || 0, icon: Calendar, gradient: "from-cyan-500 to-blue-600" },
    { title: "Completion Rate", value: "92%", icon: Users, gradient: "from-emerald-500 to-teal-600" },
  ];

  return (
    <div className="space-y-8 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <Card className={cn(
              "border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group",
              "bg-gradient-to-br transition-all duration-300",
              card.gradient
            )}>
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-300">
                <card.icon size={80} />
              </div>
              <CardHeader className="pb-2 relative z-10 text-white/80">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider">{card.title}</span>
                  <card.icon size={18} className="text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-extrabold text-white tracking-tight">{card.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {isAdmin && stats.registrationsByHackathon && (
        <Card className="border-none shadow-xl bg-card transition-all duration-300 hover:shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-heading font-bold">Event Participation Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] pt-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.registrationsByHackathon}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="title"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    backgroundColor: 'hsl(var(--card))',
                    fontFamily: 'var(--font-heading)'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="url(#barGradient)">
                  {stats.registrationsByHackathon.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
