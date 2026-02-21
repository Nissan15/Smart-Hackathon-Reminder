import { format } from "date-fns";
import { Calendar, Clock, Trophy, Users, Eye, ArrowRight } from "lucide-react";
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
  const register = useRegisterForHackathon();
  const unregister = useUnregisterFromHackathon();
  const deleteMutation = useDeleteHackathon();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || (user as any)?.isAdmin;
  const isRegistered = hackathon.isRegistered;
  const registrationDeadline = new Date(hackathon.registrationDeadline);
  const submissionDeadline = new Date(hackathon.submissionDeadline);
  const now = new Date();

  // Deadline logic
  const daysToDeadline = Math.ceil((registrationDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysToDeadline < 0;
  const isUrgent = daysToDeadline <= 3 && !isExpired;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 bg-gradient-to-b from-card to-card/50">
      {/* Status Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${isRegistered ? 'bg-green-500' :
        isExpired ? 'bg-gray-300' :
          isUrgent ? 'bg-orange-500' : 'bg-primary'
        }`} />

      <CardHeader className="pt-6 pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant={isRegistered ? "default" : "secondary"} className={isRegistered ? "bg-green-500 hover:bg-green-600" : ""}>
            {isRegistered ? "Registered" : isExpired ? "Closed" : "Open"}
          </Badge>
          {isAdmin && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)} className="h-8 w-8 p-0">
                <span className="sr-only">Edit</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1464 1.14645L3.71455 8.57829C3.64584 8.647 3.58556 8.72837 3.53727 8.81794L2.07004 11.5393C1.98939 11.6889 2.05282 11.8718 2.21186 11.9515C2.3709 12.0312 2.56237 11.9757 2.6433 11.8153L4.10307 8.92089C4.15579 8.81636 4.23467 8.72477 4.33235 8.65451L11.8536 1.14645ZM11.1464 12.8536H13.8536C14.0488 12.8536 14.2071 13.0118 14.2071 13.2071C14.2071 13.4024 14.0488 13.5607 13.8536 13.5607H11.1464C10.9512 13.5607 10.7929 13.4024 10.7929 13.2071C10.7929 13.0118 10.9512 12.8536 11.1464 12.8536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                    <span className="sr-only">Delete</span>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM3.5 5C3.22386 5 3 5.22386 3 5.5V12C3 13.1046 3.89543 14 5 14H10C11.1046 14 12 13.1046 12 12V5.5C12 5.22386 11.7761 5 11.5 5H3.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the hackathon "{hackathon.title}" and remove all student registrations.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMutation.mutate(hackathon.id)} className="bg-destructive hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold font-display tracking-tight text-foreground line-clamp-1" title={hackathon.title}>
          {hackathon.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[40px]">
          {hackathon.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Registration: <span className={isUrgent ? "text-orange-500 font-medium" : ""}>{format(registrationDeadline, 'MMM d, yyyy')}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Submission: {format(submissionDeadline, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>{hackathon.registrationCount} Participants</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        {!isAdmin && (
          <Link href={`/hackathons/${hackathon.id}`} className="w-full">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              View Details & Register
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}

        {isAdmin && (
          <Link href={`/admin/hackathons/${hackathon.id}`} className="w-full">
            <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-all">
              <Eye className="mr-2 h-4 w-4" />
              View Analytics
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
