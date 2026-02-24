import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Code2, Terminal, Loader2, Sparkles, MoveRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  const { user, isLoading, login, register, isLoggingIn, isRegistering } = useAuth();
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");

  if (!isLoading && user) {
    return <Redirect to="/" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email: loginEmail, password: loginPassword });
      toast({ title: "Welcome back!", description: "Successfully logged in." });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        email: regEmail,
        password: regPassword,
        firstName: regFirstName,
        lastName: regLastName
      });
      toast({ title: "Account created!", description: "Welcome to HackMatch." });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#020617] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-mesh opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block text-white"
        >
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <Terminal className="w-8 h-8 text-white" />
            </div>
            <span className="font-heading font-bold text-3xl tracking-tight">HackMatch</span>
          </div>

          <h1 className="text-6xl font-heading font-extrabold mb-8 tracking-tight leading-[1.1]">
            Build the <br />
            <span className="text-gradient">Next Big Thing.</span>
          </h1>

          <div className="space-y-6 max-w-lg mb-12">
            {[
              { title: "Smart Matching", desc: "Find the best teammates for your next project." },
              { title: "Event Management", desc: "Keep track of all your hackathon registrations." },
              { title: "Real-time Analytics", desc: "Monitor project progress and feedback." }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start group">
                <div className="mt-1 p-1 bg-white/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button variant="ghost" className="text-zinc-400 hover:text-white p-0 h-auto group font-bold">
            Learn more about our platform <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="glass-card border-white/10 bg-black/40 shadow-[0_0_50px_rgba(0,0,0,0.3)] border-2">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-heading font-extrabold text-white">Get Started</CardTitle>
              <CardDescription className="text-zinc-400 font-medium">Join the community of developers and innovators.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5 border border-white/10 p-1 h-12 rounded-[14px]">
                  <TabsTrigger value="login" className="rounded-[10px] font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Login</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-[10px] font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Register</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-300 font-bold ml-1">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@example.com"
                          required
                          className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-primary/20"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="password" text-zinc-300 className="font-bold ml-1 text-zinc-300">Password</Label>
                          <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot?</a>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          required
                          className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-primary/20"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full h-12 btn-gradient rounded-xl font-bold text-base shadow-lg shadow-primary/20" disabled={isLoggingIn}>
                        {isLoggingIn ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-zinc-300 font-bold ml-1">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            required
                            className="bg-white/5 border-white/10 text-white h-11 rounded-xl"
                            value={regFirstName}
                            onChange={(e) => setRegFirstName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-zinc-300 font-bold ml-1">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            required
                            className="bg-white/5 border-white/10 text-white h-11 rounded-xl"
                            value={regLastName}
                            onChange={(e) => setRegLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regEmail" className="text-zinc-300 font-bold ml-1">Email</Label>
                        <Input
                          id="regEmail"
                          type="email"
                          placeholder="john@example.com"
                          required
                          className="bg-white/5 border-white/10 text-white h-11 rounded-xl"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regPassword" className="text-zinc-300 font-bold ml-1">Password</Label>
                        <Input
                          id="regPassword"
                          type="password"
                          required
                          className="bg-white/5 border-white/10 text-white h-11 rounded-xl"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full h-12 btn-gradient rounded-xl font-bold text-base mt-2" disabled={isRegistering}>
                        {isRegistering ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#111] px-4 text-zinc-500 font-bold tracking-widest">Or continue with</span>
                </div>
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full h-12 rounded-xl bg-white/5 border-white/10 text-white font-bold hover:bg-white/10"
                onClick={() => window.location.href = "/api/auth/google"}
              >
                <FaGoogle className="mr-3 h-5 w-5 text-rose-500" />
                Continue with Google
              </Button>

              <div className="mt-8 text-center bg-primary/10 border border-primary/20 p-4 rounded-2xl">
                <p className="text-[11px] text-primary font-bold uppercase tracking-widest leading-loose">
                  Demo Access Credentials
                </p>
                <p className="text-sm font-bold text-white mt-1">
                  admin@example.com <span className="text-zinc-500 font-medium mx-2">/</span> admin123
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
