import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
    Terminal,
    Rocket,
    Users,
    Zap,
    ArrowRight,
    ClipboardCheck,
    FileUp,
    Cpu,
    Trophy,
    PieChart,
    ChevronRight,
    Star,
    CheckCircle,
    Twitter,
    Linkedin,
    Github
} from "lucide-react";

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-primary/20 selection:text-primary">
            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-sm h-16" : "bg-transparent h-20"}`}>
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-1.5 rounded-xl shadow-lg shadow-primary/20">
                            <Terminal className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">HackManager</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Features</a>
                        <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Pricing</a>
                        <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">About</a>
                        <Link href="/login">
                            <span className="text-sm font-semibold text-slate-600 hover:text-primary cursor-pointer transition-colors">Login</span>
                        </Link>
                        <Link href="/login">
                            <Button className="rounded-full px-6 bg-primary text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/25">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 lg:pt-48 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-grid -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-bold mb-8 uppercase tracking-widest">
                            <Rocket className="w-3.5 h-3.5" />
                            <span>The Premium Hackathon Suite</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-heading font-extrabold mb-8 leading-[1.1] tracking-tight text-slate-900">
                            Run Hackathons<br />
                            <span className="text-primary italic">Like a Pro</span>
                        </h1>
                        <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl mb-12">
                            Manage registrations, submissions, judging, and analytics in one powerful, unified platform built for excellence.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-5 mb-12">
                            <Link href="/login">
                                <Button size="lg" className="rounded-[20px] px-10 h-16 text-lg font-bold bg-primary hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20">
                                    Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="outline" className="rounded-[20px] px-10 h-16 text-lg font-bold border-2 border-slate-200 hover:bg-slate-50 transition-all">
                                    View Demo
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm font-bold text-slate-500">10,000+ Participants</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm font-bold text-slate-500">500+ Events Managed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm font-bold text-slate-500">Trusted by Universities</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative shadow-2xl rounded-[32px] border-4 border-white overflow-hidden bg-white group">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <img
                                src="/dashboard_mockup.png"
                                alt="HackManager Dashboard Mockup"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Floating Glass Stats */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -top-8 -left-8 glass-card p-6 hidden xl:block z-10"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-emerald-500/10 p-2.5 rounded-xl">
                                    <Users className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold font-heading text-slate-900">4,281</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter mt-1">Total Users</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="absolute -bottom-10 -right-10 glass-card p-6 hidden xl:block z-10"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-2.5 rounded-xl">
                                    <Trophy className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold font-heading text-slate-900">$50k</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter mt-1">Prizes Managed</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Section 1 – Social Proof */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm font-bold text-slate-400 mb-12 uppercase tracking-widest">Powering elite institutions worldwide</p>
                    <div className="flex justify-center opacity-60 hover:opacity-100 transition-opacity mb-24">
                        <img src="/university_logos.png" alt="University Partners" className="max-h-16 w-auto grayscale" />
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <Card className="border-none bg-slate-50 rounded-[28px] p-8 md:p-12 relative shadow-sm">
                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <blockquote className="text-2xl md:text-3xl font-heading font-semibold text-slate-800 mb-8 leading-tight italic">
                                "HackManager transformed how we run our annual hackathon. The automated judging and submission portal saved us hundreds of hours in manual work."
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">DR</div>
                                <div>
                                    <div className="font-bold text-slate-900 text-lg">Dr. Sarah Johnson</div>
                                    <div className="text-slate-500 font-medium">Head of CS, Stanford University</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Section 2 – Features Grid */}
            <section id="features" className="py-32 bg-slate-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl lg:text-5xl font-heading font-extrabold mb-6 text-slate-900">Feature-Rich Infrastructure</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                            Everything you need to orchestrate high-stakes innovation events from a single, intuitive interface.
                        </p>
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: <ClipboardCheck className="w-8 h-8 text-primary" />,
                                title: "Smart Registration",
                                desc: "Customizable dynamic forms with real-time validation and waitlist management."
                            },
                            {
                                icon: <FileUp className="w-8 h-8 text-emerald-500" />,
                                title: "Submission Portal",
                                desc: "Secure environment for project assets, documentation, and source code uploads."
                            },
                            {
                                icon: <Cpu className="w-8 h-8 text-indigo-500" />,
                                title: "Automated Judging",
                                desc: "Sophisticated scoring algorithms with rubrics designed for fairness and speed."
                            },
                            {
                                icon: <Trophy className="w-8 h-8 text-amber-500" />,
                                title: "Live Leaderboard",
                                desc: "Dynamic real-time rankings and score visualizations to build event hype."
                            },
                            {
                                icon: <Users className="w-8 h-8 text-sky-500" />,
                                title: "Team Management",
                                desc: "Integrated tools for team formation, chat, and collaborative workspace allocation."
                            },
                            {
                                icon: <PieChart className="w-8 h-8 text-primary" />,
                                title: "Analytics Dashboard",
                                desc: "Deep insights into participant demographics, engagement metrics, and ROI."
                            },
                        ].map((feature, idx) => (
                            <motion.div key={idx} variants={item}>
                                <Card className="h-full border-none shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group rounded-[24px] bg-white p-2">
                                    <CardContent className="p-8">
                                        <div className="mb-6 w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-300">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-heading font-bold mb-4 text-slate-900">{feature.title}</h3>
                                        <p className="text-slate-500 leading-relaxed font-medium mb-6">
                                            {feature.desc}
                                        </p>
                                        <Link href="/login">
                                            <span className="inline-flex items-center gap-2 text-primary font-bold text-sm cursor-pointer group-hover:gap-3 transition-all">
                                                Discover functionality <ChevronRight className="w-4 h-4" />
                                            </span>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Section 3 – How It Works */}
            <section className="py-32 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl lg:text-5xl font-heading font-extrabold mb-6 text-slate-900">Seamless Orchestration</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                            Set up and execute your event in three simplified steps designed for maximum efficiency.
                        </p>
                    </div>

                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[28%] left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-slate-200 -z-10" />

                        {[
                            { step: "01", title: "Create Event", desc: "Define rules, timelines, and custom requirements in minutes.", icon: <Zap className="w-7 h-7" /> },
                            { step: "02", title: "Manage Participants", desc: "Automate communication and approve applicants at scale.", icon: <Users className="w-7 h-7" /> },
                            { step: "03", title: "Track & Announce", desc: "Real-time monitoring and high-impact winner announcements.", icon: <Trophy className="w-7 h-7" /> }
                        ].map((s, i) => (
                            <div key={i} className="text-center relative">
                                <div className="mb-8 mx-auto w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 relative">
                                    {s.icon}
                                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white text-primary text-xs font-black flex items-center justify-center shadow-md border-2 border-slate-50">
                                        {s.step}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-heading font-extrabold mb-4 text-slate-900">{s.title}</h3>
                                <p className="text-slate-500 font-medium max-w-[250px] mx-auto leading-relaxed">
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4 – Call To Action */}
            <section className="py-24 px-6 mb-12">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.5 }}
                        className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-12 md:p-24 text-center shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-grid opacity-10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-8 leading-tight tracking-tight">
                                Ready to Host Your Next <br className="hidden md:block" />
                                <span className="text-primary italic">Big Hackathon?</span>
                            </h2>
                            <p className="text-indigo-200 text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                                Join the world's leading organizations using HackManager to drive innovation and engagement.
                            </p>
                            <Link href="/login">
                                <Button size="lg" className="rounded-full px-12 h-20 text-xl font-bold bg-primary hover:bg-white hover:text-primary transition-all shadow-2xl shadow-primary/40 relative group overflow-hidden">
                                    <span className="relative z-10">Start Free Now</span>
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                                    {/* Subtle Glow Animation */}
                                    <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="pt-32 pb-16 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="bg-primary p-1.5 rounded-xl">
                                    <Terminal className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-900">HackManager</span>
                            </div>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-xs">
                                The gold standard for modern hackathon management and participant engagement.
                            </p>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
                                    <Twitter className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
                                    <Linkedin className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
                                    <Github className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-heading font-extrabold text-slate-900 mb-8 uppercase tracking-widest text-xs">Product</h4>
                            <ul className="space-y-4 text-slate-500 font-semibold text-sm">
                                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-heading font-extrabold text-slate-900 mb-8 uppercase tracking-widest text-xs">Company</h4>
                            <ul className="space-y-4 text-slate-500 font-semibold text-sm">
                                <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-heading font-extrabold text-slate-900 mb-8 uppercase tracking-widest text-xs">Resources</h4>
                            <ul className="space-y-4 text-slate-500 font-semibold text-sm">
                                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Support Center</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">System Status</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-slate-100 flex flex-col md:row items-center justify-between gap-6 text-sm font-bold text-slate-400">
                        <p>© 2026 HackManager Platform. All rights reserved.</p>
                        <div className="flex gap-10">
                            <span className="hover:text-slate-600 transition-colors cursor-pointer">Status</span>
                            <span className="hover:text-slate-600 transition-colors cursor-pointer">Security</span>
                            <span className="hover:text-slate-600 transition-colors cursor-pointer">Cookies</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
