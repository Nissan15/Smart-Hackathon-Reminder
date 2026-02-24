import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateHackathon } from "@/hooks/use-hackathons";
import { Plus, Rocket, Link as LinkIcon, Calendar, Info, Loader2 } from "lucide-react";
import { insertHackathonSchema } from "@shared/schema";
import { cn } from "@/lib/utils";

const formSchema = insertHackathonSchema.extend({
  registrationDeadline: z.string().transform(str => new Date(str)),
  submissionDeadline: z.string().transform(str => new Date(str)),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateHackathonDialog() {
  const [open, setOpen] = useState(false);
  const createHackathon = useCreateHackathon();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      registrationDeadline: new Date().toISOString().split('T')[0] as any,
      submissionDeadline: new Date().toISOString().split('T')[0] as any,
    },
  });

  function onSubmit(values: FormValues) {
    createHackathon.mutate(values as any, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-gradient rounded-xl px-6 h-11 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
          <Plus className="w-5 h-5 mr-2" />
          Add Hackathon
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-background">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Rocket size={120} />
          </div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-3xl font-heading font-extrabold mb-2">Launch New Event</DialogTitle>
            <DialogDescription className="text-indigo-100/80 font-medium text-base">
              Establish a new hackathon and start accepting student registrations.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-8 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Rocket className="w-4 h-4" /> Professional Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Global Tech Challenge 2024"
                        {...field}
                        className="rounded-xl h-12 border-2 focus:border-primary transition-all font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Info className="w-4 h-4" /> Event Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Define the scope, goals, and prizes of your event..."
                        className="resize-none rounded-xl border-2 min-h-[120px] focus:border-primary transition-all font-medium"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" /> Registration Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://your-platform.com/event"
                        {...field}
                        className="rounded-xl h-12 border-2 focus:border-primary transition-all font-medium"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="registrationDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Signup Deadline
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="rounded-xl h-12 border-2 focus:border-primary transition-all font-medium"
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="submissionDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Submission End
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="rounded-xl h-12 border-2 focus:border-primary transition-all font-medium"
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-6">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-bold h-12 px-6">
                  Dismiss
                </Button>
                <Button
                  type="submit"
                  disabled={createHackathon.isPending}
                  className="btn-gradient rounded-xl font-bold h-12 px-10 shadow-lg shadow-primary/20"
                >
                  {createHackathon.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finalizing...
                    </>
                  ) : "Publish Event"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog >
  );
}
