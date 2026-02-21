import { useStats } from "@/hooks/use-hackathons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Calendar, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { useAuth } from "@/hooks/use-auth";

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
    { title: "Total Hackathons", value: stats.totalHackathons || 0, icon: Trophy, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Students", value: stats.totalStudents || 0, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Total Registrations", value: stats.totalRegistrations || 0, icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Upcoming Deadlines", value: stats.upcomingDeadlines || 0, icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
  ] : [
    { title: "My Hackathons", value: stats.registeredCount || 0, icon: Trophy, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Upcoming Deadlines", value: stats.upcomingDeadlines || 0, icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Available Events", value: stats.totalHackathons || 0, icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Completion Rate", value: "100%", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdmin && stats.registrationsByHackathon && (
        <Card className="col-span-4 border-none shadow-md">
          <CardHeader>
            <CardTitle>Registrations per Hackathon</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.registrationsByHackathon}>
                <XAxis dataKey="title" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.registrationsByHackathon.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#3b82f6'} />
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
