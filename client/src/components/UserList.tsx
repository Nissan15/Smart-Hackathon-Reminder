import { useUsers, useUpdateUserRole, useDeleteUser } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Mail, Shield, User as UserIcon, Trash2, UserCog, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function UserList() {
    const { user: currUser } = useAuth();
    const { data: users, isLoading, error } = useUsers();
    const updateRole = useUpdateUserRole();
    const deleteUser = useDeleteUser();
    const { toast } = useToast();

    const handleUpdateRole = async (userId: string, newRole: string) => {
        try {
            await updateRole.mutateAsync({ userId, role: newRole });
            toast({ title: "Success", description: `User role updated to ${newRole}` });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            await deleteUser.mutateAsync(userId);
            toast({ title: "Success", description: "User deleted successfully" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-destructive">
                {error instanceof Error ? error.message : "An error occurred"}
            </div>
        );
    }

    return (
        <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-white dark:bg-zinc-900 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold font-display flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-primary" />
                        User Management
                    </CardTitle>
                    <Badge variant="secondary" className="px-3 py-1">
                        {users?.length || 0} Total Users
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[80px]">User</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Reg Number</TableHead>
                                <TableHead>Joined Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <Avatar className="h-9 w-9 border">
                                            <AvatarImage src={user.profileImageUrl || ""} />
                                            <AvatarFallback className="bg-primary/5 text-primary text-xs">
                                                {user.firstName?.[0] || user.email?.[0] || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium font-display">
                                        {user.firstName} {user.lastName}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-3 w-3" />
                                            {user.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.role === 'admin' ? "default" : "outline"}
                                            className={user.role === 'admin' ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                                        >
                                            {user.role === 'admin' ? <Shield className="h-3 w-3 mr-1" /> : null}
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {user.department || <span className="text-muted-foreground italic text-xs">N/A</span>}
                                    </TableCell>
                                    <TableCell className="text-sm font-mono text-xs">
                                        {user.registerNumber || <span className="text-muted-foreground italic text-xs">N/A</span>}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0" disabled={user.id === currUser?.id}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleUpdateRole(user.id, user.role === 'admin' ? 'student' : 'admin')}
                                                >
                                                    <UserCog className="mr-2 h-4 w-4" />
                                                    {user.role === 'admin' ? 'Make Student' : 'Make Admin'}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
