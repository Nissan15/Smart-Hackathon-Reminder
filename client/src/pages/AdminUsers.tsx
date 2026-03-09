import { useState, useMemo } from "react";
import { useUsers, useUpdateUserRole, useDeleteUser } from "@/hooks/use-users";
import {
    Users,
    UserPlus,
    Trash2,
    Shield,
    Mail,
    Calendar,
    Search,
    MoreVertical,
    CheckCircle2,
    UserCircle,
    Building2,
    Hash,
    GraduationCap,
    Layers,
    SlidersHorizontal,
    X,
    ArrowUpAZ,
    ArrowDownAZ,
    ChevronDown,
    MapPin,
    ExternalLink,
    AlertCircle,
    Activity,
    Clock,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useUserRegistrations } from "@/hooks/use-users";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { DEPARTMENTS, SECTIONS, GRADUATION_YEARS } from "@shared/constants";

type SortOrder = "az" | "za" | "none";
interface Filters {
    department: string;
    section: string;
    graduationYear: string;
    sortOrder: SortOrder;
}
const DEFAULT_FILTERS: Filters = { department: "", section: "", graduationYear: "", sortOrder: "none" };


export default function AdminUsers() {
    const { data: users, isLoading } = useUsers();
    const updateRole = useUpdateUserRole();
    const deleteUser = useDeleteUser();
    const { toast } = useToast();

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    const { data: userRegs, isLoading: isLoadingRegs } = useUserRegistrations(selectedUser?.id);

    const activeFilterCount = useMemo(() => {
        let n = 0;
        if (filters.department) n++;
        if (filters.section) n++;
        if (filters.graduationYear) n++;
        if (filters.sortOrder !== "none") n++;
        return n;
    }, [filters]);

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        let r = [...users];
        const q = searchQuery.toLowerCase().trim();
        if (q) r = r.filter(u => {
            const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
            return name.includes(q) || (u.email || "").toLowerCase().includes(q) || (u.department || "").toLowerCase().includes(q);
        });
        if (filters.department) r = r.filter(u => (u.department || "") === filters.department);
        if (filters.section) r = r.filter(u => (u.section || "").toUpperCase() === filters.section.toUpperCase());
        if (filters.graduationYear) r = r.filter(u => String(u.yearOfGraduation) === filters.graduationYear);
        if (filters.sortOrder === "az") r.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
        if (filters.sortOrder === "za") r.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
        return r;
    }, [users, searchQuery, filters]);

    const clearAll = () => { setFilters(DEFAULT_FILTERS); setSearchQuery(""); };

    const handleRoleUpdate = (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'student' : 'admin';
        updateRole.mutate({ userId, role: newRole }, {
            onSuccess: () => {
                toast({
                    title: "Role Updated",
                    description: `User is now a ${newRole}.`,
                });
            }
        });
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            deleteUser.mutate(userId, {
                onSuccess: () => {
                    toast({
                        title: "User Deleted",
                        description: "The user account has been permanently removed.",
                        variant: "destructive"
                    });
                }
            });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-10">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-64" />
                </div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        <Users className="text-indigo-600" />
                        User Management
                    </h2>
                    <p className="text-slate-500 mt-1">View, manage, and promote users across the platform.</p>
                </div>
            </div>

            {/* Table/List Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md"
            >
                {/* ── Search + Filter bar ── */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            id="user-search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email, or department..."
                            className="w-full pl-10 pr-9 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 ring-indigo-500/20 outline-none transition-all"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={13} /></button>
                        )}
                    </div>
                    {/* Filter toggle */}
                    <button
                        id="filter-toggle-btn"
                        onClick={() => setShowFilters(v => !v)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
                            showFilters
                                ? "bg-indigo-600 text-white border-indigo-600 shadow"
                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400"
                        )}
                    >
                        <SlidersHorizontal size={15} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className={cn("rounded-full px-1.5 py-px text-[10px] font-bold", showFilters ? "bg-white text-indigo-600" : "bg-indigo-600 text-white")}>
                                {activeFilterCount}
                            </span>
                        )}
                        <ChevronDown size={13} className={cn("transition-transform duration-200", showFilters && "rotate-180")} />
                    </button>
                    {/* Clear all */}
                    {(activeFilterCount > 0 || searchQuery) && (
                        <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-500/10 hover:text-red-700 rounded-xl border border-red-200 dark:border-red-500/20 transition-colors">
                            <X size={12} /> Clear all
                        </button>
                    )}
                </div>

                {/* ── Collapsible filter panel ── */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            key="filter-panel"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeInOut" }}
                            className="overflow-hidden border-b border-slate-200 dark:border-slate-800"
                        >
                            <div className="p-5 bg-slate-50/80 dark:bg-slate-800/40">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Filter Options</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                    {/* Department */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400"><Building2 size={12} />Department</label>
                                        <div className="relative">
                                            <select id="filter-department" value={filters.department} onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
                                                className="w-full appearance-none pl-3 pr-7 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 ring-indigo-500/20 cursor-pointer">
                                                <option value="">All Departments</option>
                                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                        {filters.department && <button onClick={() => setFilters(f => ({ ...f, department: "" }))} className="text-[10px] text-indigo-500 hover:text-indigo-700 flex items-center gap-1"><X size={9} />Clear</button>}
                                    </div>

                                    {/* Section */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400"><Layers size={12} />Section</label>
                                        <div className="relative">
                                            <select id="filter-section" value={filters.section} onChange={e => setFilters(f => ({ ...f, section: e.target.value }))}
                                                className="w-full appearance-none pl-3 pr-7 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 ring-indigo-500/20 cursor-pointer">
                                                <option value="">All Sections</option>
                                                {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                                            </select>
                                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                        {filters.section && <button onClick={() => setFilters(f => ({ ...f, section: "" }))} className="text-[10px] text-indigo-500 hover:text-indigo-700 flex items-center gap-1"><X size={9} />Clear</button>}
                                    </div>

                                    {/* Graduation Year */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400"><GraduationCap size={12} />Graduation Year</label>
                                        <div className="relative">
                                            <select id="filter-grad-year" value={filters.graduationYear} onChange={e => setFilters(f => ({ ...f, graduationYear: e.target.value }))}
                                                className="w-full appearance-none pl-3 pr-7 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 ring-indigo-500/20 cursor-pointer">
                                                <option value="">All Years</option>
                                                {GRADUATION_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                        {filters.graduationYear && <button onClick={() => setFilters(f => ({ ...f, graduationYear: "" }))} className="text-[10px] text-indigo-500 hover:text-indigo-700 flex items-center gap-1"><X size={9} />Clear</button>}
                                    </div>

                                    {/* Alphabetical Sort */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400"><ArrowUpAZ size={12} />Alphabetical Order</label>
                                        <div className="flex gap-2">
                                            <button id="sort-az"
                                                onClick={() => setFilters(f => ({ ...f, sortOrder: f.sortOrder === "az" ? "none" : "az" }))}
                                                className={cn("flex-1 flex items-center justify-center gap-1 py-2 text-xs font-semibold rounded-xl border transition-all",
                                                    filters.sortOrder === "az" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-400")}>
                                                <ArrowUpAZ size={12} /> A→Z
                                            </button>
                                            <button id="sort-za"
                                                onClick={() => setFilters(f => ({ ...f, sortOrder: f.sortOrder === "za" ? "none" : "za" }))}
                                                className={cn("flex-1 flex items-center justify-center gap-1 py-2 text-xs font-semibold rounded-xl border transition-all",
                                                    filters.sortOrder === "za" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-400")}>
                                                <ArrowDownAZ size={12} /> Z→A
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Active chips */}
                                {activeFilterCount > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                                        <span className="text-[10px] text-slate-400 self-center">Active:</span>
                                        {filters.department && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                                                <Building2 size={10} />{filters.department.split(" - ")[0]}
                                                <button onClick={() => setFilters(f => ({ ...f, department: "" }))} className="ml-0.5 hover:text-red-500"><X size={9} /></button>
                                            </span>
                                        )}
                                        {filters.section && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300">
                                                <Layers size={10} />Sec {filters.section}
                                                <button onClick={() => setFilters(f => ({ ...f, section: "" }))} className="ml-0.5 hover:text-red-500"><X size={9} /></button>
                                            </span>
                                        )}
                                        {filters.graduationYear && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                                                <GraduationCap size={10} />Batch {filters.graduationYear}
                                                <button onClick={() => setFilters(f => ({ ...f, graduationYear: "" }))} className="ml-0.5 hover:text-red-500"><X size={9} /></button>
                                            </span>
                                        )}
                                        {filters.sortOrder !== "none" && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
                                                {filters.sortOrder === "az" ? <ArrowUpAZ size={10} /> : <ArrowDownAZ size={10} />}
                                                {filters.sortOrder === "az" ? "A→Z" : "Z→A"}
                                                <button onClick={() => setFilters(f => ({ ...f, sortOrder: "none" }))} className="ml-0.5 hover:text-red-500"><X size={9} /></button>
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/30">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Academic Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredUsers.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <Search size={32} className="opacity-30" />
                                        <p className="font-semibold text-slate-500 text-sm">No users match your search or filters.</p>
                                        <button onClick={clearAll} className="mt-1 text-xs text-indigo-500 hover:text-indigo-700 underline">Clear all</button>
                                    </div>
                                </td></tr>
                            ) : filteredUsers.map((u) => (
                                <tr
                                    key={u.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                                    onClick={() => setSelectedUser(u)}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 flex items-center justify-center overflow-hidden">
                                                    {u.profileImageUrl ? (
                                                        <img src={u.profileImageUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserCircle className="w-6 h-6 text-indigo-500" />
                                                    )}
                                                </div>
                                                {u.role === 'admin' && (
                                                    <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
                                                        <Shield size={10} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white capitalize">
                                                    {u.firstName} {u.lastName}
                                                </p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Mail size={12} /> {u.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <Building2 size={14} className="text-slate-400" />
                                                {u.department || "No Department"}
                                            </p>
                                            <p className="text-xs text-slate-500 flex items-center gap-2">
                                                <Hash size={14} className="text-slate-400" />
                                                {u.registerNumber || "No Reg Number"}
                                            </p>
                                            <div className="flex gap-3 mt-1">
                                                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    <Layers size={12} />
                                                    Sec: {u.section || "N/A"}
                                                </p>
                                                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    <GraduationCap size={12} />
                                                    Batch: {u.yearOfGraduation || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant="outline" className={cn(
                                            "rounded-lg px-2.5 py-1 font-bold border capitalize",
                                            u.role === 'admin'
                                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                                        )}>
                                            {u.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                                                    <MoreVertical size={18} className="text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
                                                <DropdownMenuLabel className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">Manage User</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                                                <DropdownMenuItem
                                                    className="rounded-xl cursor-pointer py-2 px-3 focus:bg-indigo-50 dark:focus:bg-indigo-500/10 gap-2 font-medium"
                                                    onClick={() => handleRoleUpdate(u.id, u.role)}
                                                >
                                                    <Shield size={16} className="text-indigo-500" />
                                                    {u.role === 'admin' ? "Demote to Student" : "Promote to Admin"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="rounded-xl cursor-pointer py-2 px-3 text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10 gap-2 font-medium"
                                                    onClick={() => handleDeleteUser(u.id)}
                                                >
                                                    <Trash2 size={16} />
                                                    Delete User Account
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* User Detail Dialog */}
            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    {selectedUser && (
                        <div className="flex flex-col max-h-[90vh]">
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white relative">
                                <div className="relative z-10 flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center overflow-hidden shadow-inner">
                                        {selectedUser.profileImageUrl ? (
                                            <img src={selectedUser.profileImageUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCircle size={48} className="text-white/80" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-2xl font-bold capitalize">{selectedUser.firstName} {selectedUser.lastName}</h2>
                                            <Badge variant="secondary" className="bg-white/20 text-white border-white/20 hover:bg-white/30 capitalize">
                                                {selectedUser.role}
                                            </Badge>
                                        </div>
                                        <p className="text-white/70 flex items-center gap-2 text-sm">
                                            <Mail size={14} /> {selectedUser.email}
                                        </p>
                                        <div className="flex gap-4 mt-4 text-xs font-semibold uppercase tracking-wider text-indigo-100">
                                            <div className="bg-black/20 px-3 py-1 rounded-lg flex items-center gap-2">
                                                <Activity size={12} />
                                                Registrations: {userRegs?.length || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Users size={120} />
                                </div>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-8 space-y-8">
                                    {/* Detailed Info Section */}
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Details</p>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                                    <Building2 size={16} className="text-indigo-500" />
                                                    <span className="font-semibold">Dept:</span> {selectedUser.department || "N/A"}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                                    <Hash size={16} className="text-indigo-500" />
                                                    <span className="font-semibold">Reg No:</span> {selectedUser.registerNumber || "N/A"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Batch Info</p>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                                    <Layers size={16} className="text-indigo-500" />
                                                    <span className="font-semibold">Section:</span> {selectedUser.section || "N/A"}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                                    <GraduationCap size={16} className="text-indigo-500" />
                                                    <span className="font-semibold">Graduation:</span> {selectedUser.yearOfGraduation || "N/A"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hackathons Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered Hackathons</p>
                                            {userRegs && userRegs.length > 0 && <Badge variant="outline" className="text-indigo-600 border-indigo-200">{userRegs.length}</Badge>}
                                        </div>

                                        {isLoadingRegs ? (
                                            <div className="space-y-3">
                                                {[1, 2].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
                                            </div>
                                        ) : userRegs && userRegs.length > 0 ? (
                                            <div className="grid gap-3">
                                                {userRegs.map((h: any) => (
                                                    <div key={h.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600">
                                                                <Calendar size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{h.title}</p>
                                                                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                                                    <Clock size={10} />
                                                                    Ends: {new Date(h.submissionDeadline).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button size="sm" variant="ghost" className="rounded-xl h-8 text-[11px] font-bold uppercase tracking-wider text-indigo-600" asChild>
                                                            <a href={`/admin/hackathons/${h.id}`}>View Analytics</a>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                                <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                                                <p className="text-xs font-semibold text-slate-500">No active registrations found.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ScrollArea>

                            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                                <Button onClick={() => setSelectedUser(null)} variant="secondary" className="rounded-xl font-bold uppercase tracking-widest text-[10px] px-6">
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
