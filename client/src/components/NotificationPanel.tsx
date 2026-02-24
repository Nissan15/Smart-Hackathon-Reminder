import { Bell, Trophy, UserCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/use-hackathons";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function NotificationPanel() {
    const { data: notifications, isLoading } = useNotifications();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl relative group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                    {notifications && notifications.length > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96 p-0 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden" align="end">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Notifications
                        <span className="text-[10px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                            {notifications?.length || 0}
                        </span>
                    </h3>
                </div>
                <ScrollArea className="h-[400px]">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
                    ) : notifications && notifications.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <div className="flex gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                            notif.type === 'new_hackathon' ? "bg-amber-100 dark:bg-amber-500/10 text-amber-600" : "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600"
                                        )}>
                                            {notif.type === 'new_hackathon' ? <Trophy size={18} /> : <UserCheck size={18} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-2 flex items-center gap-1">
                                                <Calendar size={10} />
                                                {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 px-6 text-center">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell size={20} className="text-slate-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">All caught up!</p>
                            <p className="text-xs text-slate-500 mt-1">No new notifications for you right now.</p>
                        </div>
                    )}
                </ScrollArea>
                {notifications && notifications.length > 0 && (
                    <div className="p-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                        <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                            Mark all as read
                        </button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
