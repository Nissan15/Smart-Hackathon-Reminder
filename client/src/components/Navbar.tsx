import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User, LayoutDashboard, Calendar as CalendarIcon, Shield } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin' || (user as any)?.isAdmin;

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl hidden sm:inline-block">
              HackMatch
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 mr-4">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                Dashboard
              </Button>
            </Link>
            <Link href="/hackathons">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                Browse Events
              </Button>
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={(user as any).profileImageUrl} alt={user.email || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {(user as any).firstName?.[0] || user.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{(user as any).firstName} {(user as any).lastName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {(user as any).email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/hackathons" className="cursor-pointer">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Hackathons</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>



              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-600 focus:text-red-700">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
