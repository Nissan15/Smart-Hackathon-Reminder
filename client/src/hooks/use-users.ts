import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";

export function useUsers() {
    return useQuery<User[]>({
        queryKey: ["/api/admin/users"],
        queryFn: async () => {
            const res = await fetch("/api/admin/users", { credentials: "include" });
            if (!res.ok) {
                if (res.status === 403) throw new Error("Admin access only");
                throw new Error("Failed to fetch users");
            }
            return await res.json();
        },
        refetchInterval: 3000, // Poll every 3 seconds to catch new signups
    });
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
            const res = await fetch(`/api/admin/users/${userId}/role`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to update role");
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to delete user");
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
            queryClient.invalidateQueries({ queryKey: ["/api/stats/dashboard"] });
        },
    });
}

export function useHackathonAnalytics(id: number) {
    return useQuery({
        queryKey: ["/api/admin/hackathons", id, "analytics"],
        queryFn: async () => {
            const res = await fetch(`/api/admin/hackathons/${id}/analytics`, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch hackathon analytics");
            return await res.json();
        },
        enabled: !!id,
    });
}
