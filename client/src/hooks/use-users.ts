import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";
import { apiRequest } from "@/lib/queryClient";

export function useUsers() {
    return useQuery<User[]>({
        queryKey: ["/api/admin/users"],
        refetchInterval: 3000, // Poll every 3 seconds to catch new signups
    });
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
            const res = await apiRequest("PATCH", `/api/admin/users/${userId}/role`, { role });
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
            const res = await apiRequest("DELETE", `/api/admin/users/${userId}`);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
            queryClient.invalidateQueries({ queryKey: ["/api/stats/dashboard"] });
        },
    });
}

export function useSendReminders() {
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await apiRequest("POST", `/api/admin/hackathons/${id}/remind`);
            return await res.json();
        },
    });
}

export function useHackathonAnalytics(id: number) {
    return useQuery({
        queryKey: ["/api/admin/hackathons", id, "analytics"],
        enabled: !!id,
    });
}
export function useUserRegistrations(userId: string) {
    return useQuery({
        queryKey: ["/api/admin/users", userId, "registrations"],
        enabled: !!userId,
        select: (data: any) => data as any[],
    });
}
