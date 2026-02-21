import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Code2, Terminal, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
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
      toast({ title: "Welcome", description: "Successfully logged in." });
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
              Manage Hackathons <br />
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
              <CardTitle className="text-2xl font-bold font-display">Welcome</CardTitle>
              <CardDescription>Sign in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full h-11" disabled={isLoggingIn}>
                      {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Sign In
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          required
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          required
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regEmail">Email</Label>
                      <Input
                        id="regEmail"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regPassword">Password</Label>
                      <Input
                        id="regPassword"
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full h-11" disabled={isRegistering}>
                      {isRegistering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full h-11"
                onClick={() => window.location.href = "/api/auth/google"}
              >
                <FaGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>

              <div className="mt-6 text-center text-xs text-muted-foreground">
                For demo access use: <span className="font-semibold">admin@example.com / admin123</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
