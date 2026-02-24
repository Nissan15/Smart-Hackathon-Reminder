import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
    Terminal,
    Rocket,
    Target,
    Users,
    Zap,
    Shield,
    Globe,
    ArrowRight,
    ChevronRight
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-float" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-secondary/20 rounded-full blur-[100px] animate-float delay-500" />
                <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[150px] animate-float delay-300" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 glass">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-1.5 rounded-lg">
                            <Terminal className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-heading font-bold text-xl tracking-tight">HackMatch</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
                        <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>

                        <ThemeToggle />

                        <Link href="/login">
                            <Button variant="ghost" className="text-sm">Login</Button>
                        </Link>
                        <Link href="/login">
                            <Button className="btn-gradient rounded-full px-6">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 animate-enter">
                            <Rocket className="w-3 h-3" />
                            <span>THE ALL-IN-ONE HACKATHON PLATFORM</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 tracking-tight">
                            Manage Hackathons <br />
                            <span className="text-gradient">Like a Pro.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            The ultimate platform for universities and organizations to manage hackathon registrations, submissions, and student engagement in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/login">
                                <Button size="lg" className="btn-gradient rounded-2xl px-10 h-14 text-lg">
                                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="outline" className="rounded-2xl px-10 h-14 text-lg border-2">
                                    View Demo
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="mt-20 relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                        <div className="glass-card p-4 mx-auto max-w-5xl aspect-video relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <img
                                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
                                alt="Dashboard Mockup"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>

                        {/* Floating Stats */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute -top-10 -left-10 glass-card p-6 hidden lg:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-green-500/20 p-2 rounded-lg">
                                    <Users className="w-6 h-6 text-green-500" />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl font-bold font-heading">10k+</div>
                                    <div className="text-xs text-muted-foreground">Active Participants</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 5 }}
                            className="absolute top-1/2 -right-10 glass-card p-6 hidden lg:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-500/20 p-2 rounded-lg">
                                    <Zap className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl font-bold font-heading">500+</div>
                                    <div className="text-xs text-muted-foreground">Event Managed</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 px-6 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-heading font-bold mb-4">Everything you need to <span className="text-primary">Succeed</span></h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Built with the latest technology to ensure your hackathon runs smoothly from start to finish.
                        </p>
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: <Target className="w-8 h-8 text-indigo-500" />,
                                title: "Smart Registration",
                                desc: "Customizable forms with automated validation and student profile integration.",
                                gradient: "from-indigo-500/10 to-purple-500/10"
                            },
                            {
                                icon: <Shield className="w-8 h-8 text-cyan-500" />,
                                title: "Secure Submissions",
                                desc: "Encrypted project uploads with version control and plagiarism detection.",
                                gradient: "from-cyan-500/10 to-blue-500/10"
                            },
                            {
                                icon: <Globe className="w-8 h-8 text-pink-500" />,
                                title: "Global Analytics",
                                desc: "Real-time data visualization and participation metrics for all your events.",
                                gradient: "from-pink-500/10 to-rose-500/10"
                            },
                        ].map((feature, idx) => (
                            <motion.div key={idx} variants={item}>
                                <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    <CardContent className="p-8 relative">
                                        <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm w-fit group-hover:scale-110 transition-transform duration-300">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-heading font-bold mb-3">{feature.title}</h3>
                                        <p className="text-muted-foreground mb-6 leading-relaxed">
                                            {feature.desc}
                                        </p>
                                        <Link href="/login" className="flex items-center gap-2 text-primary font-bold text-sm group/btn">
                                            Learn more <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="relative rounded-[2.5rem] overflow-hidden bg-zinc-900 text-white p-12 md:p-20">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/30 to-transparent pointer-events-none" />
                        <div className="relative z-10 text-center md:text-left md:flex items-center justify-between gap-12">
                            <div className="mb-8 md:mb-0">
                                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 italic">Ready to host your next <span className="text-primary italic">Big Event?</span></h2>
                                <p className="text-zinc-400 text-lg mb-0 max-w-xl">
                                    Join thousands of organizers already using HackMatch to power their ecosystems.
                                </p>
                            </div>
                            <div className="shrink-0">
                                <Link href="/login">
                                    <Button size="lg" className="btn-gradient rounded-2xl px-12 h-16 text-xl">
                                        Get Started Free
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t bg-muted/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="bg-primary p-1.5 rounded-lg">
                                    <Terminal className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-heading font-bold text-xl tracking-tight">HackMatch</span>
                            </div>
                            <p className="text-muted-foreground max-w-sm mb-6">
                                The most powerful platform for managing registration and projects for hackathons globally.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Product</h4>
                            <ul className="space-y-4 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Company</h4>
                            <ul className="space-y-4 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                        <p>© 2024 HackMatch Inc. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
