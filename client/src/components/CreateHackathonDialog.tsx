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
import { Plus } from "lucide-react";
import { insertHackathonSchema } from "@shared/schema";

// Form schema must match API input expectation
// Schema handles z.coerce.date() but form returns strings for date inputs
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
      // Date inputs need YYYY-MM-DD string format initially
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
        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Create Hackathon
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Hackathon</DialogTitle>
          <DialogDescription>
            Fill in the details for the new hackathon event.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Summer Code Fest 2024" {...field} />
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
                  <FormLabel>About the Hackathon</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What is this hackathon about?" className="resize-none" {...field} />
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
                  <FormLabel>Hackathon Link</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. https://hackathon.com" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="registrationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Deadline</FormLabel>
                    <FormControl>
                      {/* Using simple date input for robustness */}
                      <Input type="date" {...field} value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value} />
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
                    <FormLabel>Submission Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="mr-2">
                Cancel
              </Button>
              <Button type="submit" disabled={createHackathon.isPending} className="bg-primary">
                {createHackathon.isPending ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  );
}
