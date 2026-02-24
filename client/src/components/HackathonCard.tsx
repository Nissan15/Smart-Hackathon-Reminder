import { format, differenceInDays, differenceInHours } from "date-fns";
import { Calendar, Clock, Trophy, Users, Eye, ArrowRight, Sparkles, Trash2, Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRegisterForHackathon, useUnregisterFromHackathon, useDeleteHackathon } from "@/hooks/use-hackathons";
import { useAuth } from "@/hooks/use-auth";
import { HackathonWithCounts } from "@shared/schema";
import { useState } from "react";
import { Link } from "wouter";
import { EditHackathonDialog } from "./EditHackathonDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface HackathonCardProps {
  hackathon: HackathonWithCounts;
}

export function HackathonCard({ hackathon }: HackathonCardProps) {
  const { user } = useAuth();
  const deleteMutation = useDeleteHackathon();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || (user as any)?.isAdmin;
  const isRegistered = hackathon.isRegistered;
  const registrationDeadline = new Date(hackathon.registrationDeadline);
  const now = new Date();

  const daysLeft = differenceInDays(registrationDeadline, now);
  const hoursLeft = differenceInHours(registrationDeadline, now);

  const getCountdownBadge = () => {
    if (daysLeft < 0) return <Badge variant="secondary" className="bg-zinc-100 text-zinc-500 border-none font-bold">Closed</Badge>;
    if (daysLeft === 0) return <Badge className="bg-rose-500 text-white border-none font-bold animate-pulse">{hoursLeft}h left</Badge>;
    if (daysLeft <= 3) return <Badge className="bg-orange-500 text-white border-none font-bold">{daysLeft}d left</Badge>;
    return <Badge className="bg-green-500/10 text-green-600 border-none font-bold whitespace-nowrap">{daysLeft} days left</Badge>;
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-none bg-card rounded-[2rem]">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent -z-10 group-hover:opacity-100 opacity-50 transition-opacity" />

      <CardHeader className="pt-8 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-2">
            {isRegistered && (
              <Badge className="bg-primary text-white border-none gap-1 font-bold">
                <Sparkles className="w-3 h-3" /> Registered
              </Badge>
            )}
            {getCountdownBadge()}
          </div>

          {isAdmin && (
            <div className="flex gap-1 bg-muted/50 p-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" onClick={() => setIsEditOpen(true)} className="h-8 w-8 rounded-lg hover:bg-white">
                <Edit3 className="w-4 h-4 text-zinc-600" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-heading">Delete Hackathon?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove "{hackathon.title}" and all its data. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate(hackathon.id)}
                      className="bg-rose-500 hover:bg-rose-600 rounded-xl font-bold"
                    >
                      Confirm Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <h3 className="text-2xl font-heading font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {hackathon.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 min-h-[40px] font-medium leading-relaxed">
          {hackathon.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <div className="p-4 bg-muted/30 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-bold uppercase tracking-wider">Registration Ends</span>
            <span className="font-bold text-foreground">{format(new Date(hackathon.registrationDeadline), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-bold uppercase tracking-wider">Submission By</span>
            <span className="font-bold text-foreground">{format(new Date(hackathon.submissionDeadline), 'MMM d, yyyy')}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground px-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>{hackathon.registrationCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Prizes</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pb-8 pt-2">
        {isAdmin ? (
          <Link href={`/admin/hackathons/${hackathon.id}`} className="w-full">
            <Button variant="outline" className="w-full h-11 rounded-xl border-2 font-bold hover:bg-muted group/btn">
              <Eye className="mr-2 h-4 w-4" />
              Analyze Participation
              <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
            </Button>
          </Link>
        ) : (
          <Link href={`/hackathons/${hackathon.id}`} className="w-full">
            <Button
              className="w-full h-11 btn-gradient rounded-xl font-bold shadow-lg shadow-primary/20 group/btn"
            >
              {isRegistered ? "View Details" : "Explore Event"}
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}
      </CardFooter>

      <EditHackathonDialog
        hackathon={hackathon}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </Card>
  );
}
