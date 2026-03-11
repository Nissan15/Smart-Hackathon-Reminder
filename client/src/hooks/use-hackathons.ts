import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { Hackathon, InsertHackathon, HackathonWithCounts } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useHackathons() {
  return useQuery({
    queryKey: [api.hackathons.list.path],
    select: (data: any) => data as (Hackathon & { registrationCount: number; isRegistered: boolean })[],
  });
}

export function useHackathon(id: number) {
  return useQuery({
    queryKey: [buildUrl(api.hackathons.get.path, { id })],
    enabled: !!id,
    select: (data: any) => data as HackathonWithCounts,
  });
}

export function useCreateHackathon() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertHackathon) => {
      const res = await apiRequest(api.hackathons.create.method, api.hackathons.create.path, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.hackathons.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.dashboard.path] });
      toast({ title: "Success", description: "Hackathon created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateHackathon() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<InsertHackathon> & { id: number }) => {
      const url = buildUrl(api.hackathons.update.path, { id });
      const res = await apiRequest(api.hackathons.update.method, url, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.hackathons.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.dashboard.path] });
      toast({ title: "Success", description: "Hackathon updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteHackathon() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.hackathons.delete.path, { id });
      await apiRequest(api.hackathons.delete.method, url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.hackathons.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.dashboard.path] });
      toast({ title: "Success", description: "Hackathon deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useRegisterForHackathon() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (hackathonId: number) => {
      const res = await apiRequest(api.registrations.create.method, api.registrations.create.path, { hackathonId });
      return await res.json();
    },
    onSuccess: (_, hackathonId) => {
      queryClient.invalidateQueries({ queryKey: [api.hackathons.list.path] });
      queryClient.invalidateQueries({ queryKey: [buildUrl(api.hackathons.get.path, { id: hackathonId })] });
      queryClient.invalidateQueries({ queryKey: [api.registrations.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.dashboard.path] });
      queryClient.invalidateQueries({ queryKey: [api.notifications.list.path] });
      toast({ title: "Registered!", description: "You are now participating in this hackathon." });
    },
    onError: (error: Error) => {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: [api.stats.dashboard.path],
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: [api.notifications.list.path],
    refetchInterval: 30000,
  });
}

export function useSubmitIdea() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (hackathonId: number) => {
      const res = await apiRequest(api.submissions.create.method, api.submissions.create.path, { hackathonId });
      return await res.json();
    },
    onSuccess: (_, hackathonId) => {
      queryClient.invalidateQueries({ queryKey: [buildUrl(api.hackathons.get.path, { id: hackathonId })] });
      toast({ title: "Success", description: "Your idea has been submitted!" });
    },
    onError: (error: Error) => {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    },
  });
}
