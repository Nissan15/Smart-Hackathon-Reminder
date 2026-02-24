import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Search, ChevronDown, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { NotificationPanel } from "./NotificationPanel";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const getTitle = (path: string) => {
    switch (path) {
      case "/": return "Dashboard";
      case "/hackathons": return "Hackathons";
      case "/registered": return "Registered";
      case "/deadlines": return "Deadlines";
      case "/profile": return "Profile";
      default: return "HackManager";
    }
  };

  return (
    <header className="h-20 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
      {/* Title & Search */}
      <div className="flex items-center gap-8 flex-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden md:block min-w-max">
          {getTitle(location)}
        </h1>

        <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 w-96 focus-within:ring-2 ring-indigo-500/20 transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Search hackathons..."
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />

        <NotificationPanel />

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer group px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user?.email?.[0].toUpperCase() || "U"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold leading-none text-slate-900 dark:text-white mb-0.5">
                  {(user as any)?.firstName || "Guest"}
                </p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider leading-none">
                  {user?.role || "Member"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl mt-2 p-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
            <DropdownMenuLabel className="font-heading px-3 py-2">Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
            <DropdownMenuItem className="rounded-xl cursor-pointer py-2 px-3 focus:bg-slate-100 dark:focus:bg-slate-800 gap-2">
              <UserIcon size={16} /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl cursor-pointer py-2 px-3 text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10 gap-2" onClick={() => logout()}>
              <LogOut size={16} /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
