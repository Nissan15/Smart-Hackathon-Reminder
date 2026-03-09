import { useState, useEffect } from "react";
import { Bell, Trophy, UserCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/use-hackathons";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function NotificationPanel() {
    const { user } = useAuth();
    const { data: fetchedNotifications, isLoading } = useNotifications();
    const [notifications, setNotifications] = useState<{ id: string | number; message: string; isRead: boolean; type?: string; title?: string; timestamp?: string; }[]>([]);

    // Storage key includes user ID for multi-user safety
    const READ_NOTIFICATIONS_KEY = user ? `read_notifications_${user.id}` : null;

    // Sync API notifications with local state and localStorage
    useEffect(() => {
        if (fetchedNotifications && READ_NOTIFICATIONS_KEY) {
            const stored = localStorage.getItem(READ_NOTIFICATIONS_KEY);
            const readIds = stored ? JSON.parse(stored) : [];

            setNotifications(prev => {
                return fetchedNotifications.map((fetched: any) => {
                    const existing = prev.find(p => p.id === fetched.id);
                    // A notification is read if it was read in current session OR is in localStorage
                    const alreadyRead = (existing?.isRead) || readIds.includes(fetched.id.toString());

                    return {
                        ...fetched,
                        isRead: alreadyRead
                    };
                }).sort((a: any, b: any) =>
                    new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
                );
            });
        }
    }, [fetchedNotifications, READ_NOTIFICATIONS_KEY]);

    const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

    const markAllAsRead = () => {
        if (!READ_NOTIFICATIONS_KEY) return;

        setNotifications(prev => {
            const updated = prev.map(n => ({ ...n, isRead: true }));
            // Persist all current notification IDs as read
            const allIds = updated.map(n => n.id.toString());
            localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(allIds));
            return updated;
        });
    };

    return (
        <Popover onOpenChange={(open) => open && markAllAsRead()}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl relative group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                    {unreadNotificationsCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse transition-all duration-300 transform scale-100" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96 p-0 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden" align="end">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Notifications
                        {unreadNotificationsCount > 0 && (
                            <span className="text-[10px] bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">
                                {unreadNotificationsCount} New
                            </span>
                        )}
                    </h3>
                </div>
                <ScrollArea className="h-[400px]">
                    {isLoading && notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
                    ) : notifications && notifications.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {notifications.map((notif) => (
                                <div key={notif.id} className={cn(
                                    "p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group relative",
                                    !notif.isRead && "bg-indigo-50/30 dark:bg-indigo-500/5"
                                )}>
                                    {!notif.isRead && (
                                        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-full" />
                                    )}
                                    <div className="flex gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                                            notif.type === 'new_hackathon' ? "bg-amber-100 dark:bg-amber-500/10 text-amber-600" : "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600"
                                        )}>
                                            {notif.type === 'new_hackathon' ? <Trophy size={18} /> : <UserCheck size={18} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm leading-tight transition-colors",
                                                !notif.isRead ? "font-bold text-slate-900 dark:text-white" : "font-semibold text-slate-600 dark:text-slate-300"
                                            )}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-2 flex items-center gap-1">
                                                <Calendar size={10} />
                                                {notif.timestamp ? formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true }) : 'Recently'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 px-6 text-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-850 shadow-inner">
                                <Bell size={24} className="text-slate-400" />
                            </div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">All caught up!</p>
                            <p className="text-xs text-slate-500 mt-2 max-w-[200px] mx-auto">No new notifications for you right now. We'll let you know when something comes up.</p>
                        </div>
                    )}
                </ScrollArea>
                {unreadNotificationsCount > 0 && (
                    <div className="p-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                        <button
                            onClick={markAllAsRead}
                            className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors uppercase tracking-widest"
                        >
                            Clear all as read
                        </button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}


