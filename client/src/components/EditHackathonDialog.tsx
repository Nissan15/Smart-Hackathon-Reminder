import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUpdateHackathon } from "@/hooks/use-hackathons";
import { Hackathon, insertHackathonSchema } from "@shared/schema";
import { format } from "date-fns";

interface EditHackathonDialogProps {
  hackathon: Hackathon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = insertHackathonSchema.extend({
  registrationDeadline: z.string().transform(str => new Date(str)),
  submissionDeadline: z.string().transform(str => new Date(str)),
});

type FormValues = z.infer<typeof formSchema>;

export function EditHackathonDialog({ hackathon, open, onOpenChange }: EditHackathonDialogProps) {
  const updateHackathon = useUpdateHackathon();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: hackathon.title,
      description: hackathon.description,
      link: hackathon.link || "",
      registrationDeadline: format(new Date(hackathon.registrationDeadline), 'yyyy-MM-dd') as any,
      submissionDeadline: format(new Date(hackathon.submissionDeadline), 'yyyy-MM-dd') as any,
    },
  });

  function onSubmit(values: FormValues) {
    updateHackathon.mutate({
      id: hackathon.id,
      ...values,
    } as any, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Hackathon</DialogTitle>
          <DialogDescription>
            Update details for {hackathon.title}.
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
                    <Input {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
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
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="mr-2">
                Cancel
              </Button>
              <Button type="submit" disabled={updateHackathon.isPending} className="bg-primary">
                {updateHackathon.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
