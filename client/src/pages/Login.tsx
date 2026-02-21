import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Code2, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) {
    return <Redirect to="/" />;
  }

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-emerald-500/20 p-2 rounded-lg backdrop-blur-sm border border-emerald-500/30">
              <Terminal className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">HackMatch</span>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display font-bold text-5xl leading-tight mb-6">
              Manage Hackathons <br/>
              <span className="text-emerald-400">Like a Pro.</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-md">
              The ultimate platform for universities and organizations to manage hackathon registrations, submissions, and student engagement.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex gap-4 text-sm text-zinc-500 font-medium">
          <span>© 2024 HackMatch Inc.</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700 self-center"></span>
          <span>Privacy</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700 self-center"></span>
          <span>Terms</span>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex items-center justify-center p-6 bg-background">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Card className="border-none shadow-2xl shadow-black/5">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold font-display">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button 
                onClick={handleLogin}
                className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                Log in with Replit
              </Button>
              
              <div className="mt-6 text-center text-xs text-muted-foreground">
                By clicking continue, you agree to our <a href="#" className="underline hover:text-primary">Terms of Service</a> and <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
