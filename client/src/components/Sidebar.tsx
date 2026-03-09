import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
    LayoutDashboard,
    Calendar,
    ClipboardCheck,
    Clock,
    User,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Terminal,
    Menu,
    X,
    Users as UsersIcon,
    Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useUsers } from "@/hooks/use-users";

export function Sidebar() {
    const [location] = useLocation();
    const { user, logout } = useAuth();
    const { data: users } = useUsers();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close mobile sidebar on navigation
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location]);

    const isAdmin = user?.role === 'admin';

    const baseItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/" },
        { icon: Calendar, label: "Hackathons", href: "/hackathons" },
        { icon: Archive, label: "Past Hackathons", href: "/past-hackathons" },
        { icon: User, label: "Profile", href: "/profile" },
    ];

    const studentItems = [
        { icon: ClipboardCheck, label: "My Registrations", href: "/registered" },
        { icon: Clock, label: "Deadlines", href: "/deadlines" },
    ];

    const adminItems = [
        {
            icon: UsersIcon,
            label: "Users",
            href: "/admin/users",
            badge: users?.length
        },
    ];

    const menuItems = isAdmin
        ? [...baseItems, ...adminItems]
        : [baseItems[0], baseItems[1], baseItems[2], ...studentItems, baseItems[3]];

    const sidebarContent = (
        <div className="flex flex-col h-full bg-slate-900 text-slate-300 py-6">
            {/* Logo */}
            <div className={cn(
                "px-6 mb-10 flex items-center transition-all duration-300",
                isCollapsed ? "justify-center px-0" : "gap-3"
            )}>
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                    <Terminal className="w-6 h-6 text-white" />
                </div>
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-heading font-bold text-xl tracking-tight text-white"
                    >
                        HackManager
                    </motion.span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20"
                                        : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                                )}
                            >
                                <div className={cn(
                                    "flex items-center transition-transform duration-300 group-hover:scale-110 z-10",
                                    isCollapsed ? "mx-auto" : ""
                                )}>
                                    <Icon size={20} />
                                </div>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="font-medium text-sm z-10 flex-1"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                                {!isCollapsed && (item as any).badge !== undefined && (
                                    <span className="ml-auto bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                                        {(item as any).badge}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>


            {/* Logout & Collapse */}

            <div className="px-4 space-y-4">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl px-3 h-11 transition-all",
                        isCollapsed && "justify-center px-0"
                    )}
                    onClick={() => logout()}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex mx-auto rounded-full hover:bg-slate-800 transition-colors border border-slate-800 shadow-sm h-8 w-8 text-slate-500"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Hamburger */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl bg-slate-900 border-slate-800 text-white shadow-lg"
                    onClick={() => setIsMobileOpen(true)}
                >
                    <Menu className="w-5 h-5" />
                </Button>
            </div>

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden lg:flex flex-col h-screen sticky top-0 bg-slate-900 border-r border-slate-800 transition-all duration-300 z-40 shadow-2xl",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-72 bg-slate-900 z-[60] lg:hidden border-r border-slate-800 shadow-2xl"
                        >
                            <div className="absolute top-4 right-4 text-slate-400">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full h-8 w-8 hover:bg-slate-800"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
