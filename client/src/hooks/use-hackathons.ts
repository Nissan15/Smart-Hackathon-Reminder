import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { Hackathon, InsertHackathon } from "@shared/schema";

export function useHackathons() {
  return useQuery({
    queryKey: [api.hackathons.list.path],
    queryFn: async () => {
      const res = await fetch(api.hackathons.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch hackathons");
      return await res.json() as (Hackathon & { registrationCount: number; isRegistered: boolean })[];
    },
  });
}

export function useHackathon(id: number) {
  return useQuery({
    queryKey: [api.hackathons.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.hackathons.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch hackathon");
      return await res.json() as Hackathon;
    },
    enabled: !!id,
  });
}

export function useCreateHackathon() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertHackathon) => {
      // Zod coercion happens on server, but we ensure dates are strings/dates correctly here
      const res = await fetch(api.hackathons.create.path, {
        method: api.hackathons.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create hackathon");
      }
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
      const res = await fetch(url, {
        method: api.hackathons.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update hackathon");
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
      const res = await fetch(url, {
        method: api.hackathons.delete.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete hackathon");
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
      const res = await fetch(api.registrations.create.path, {
        method: api.registrations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hackathonId }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to register");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.hackathons.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.registrations.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.dashboard.path] });
      toast({ title: "Registered!", description: "You are now participating in this hackathon." });
    },
    onError: (error: Error) => {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useUnregisterFromHackathon() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (hackathonId: number) => {
      const url = buildUrl(api.registrations.delete.path, { hackathonId });
      const res = await fetch(url, {
        method: api.registrations.delete.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to unregister");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.hackathons.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.registrations.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.dashboard.path] });
      toast({ title: "Unregistered", description: "You have been removed from this hackathon." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: [api.stats.dashboard.path],
    queryFn: async () => {
      const res = await fetch(api.stats.dashboard.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return await res.json();
    },
  });
}

// Demo helper
export function useMakeAdmin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/make-me-admin", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to upgrade role");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "You are now an Admin!", description: "Refresh or navigate to see admin controls." });
    },
  });
}
