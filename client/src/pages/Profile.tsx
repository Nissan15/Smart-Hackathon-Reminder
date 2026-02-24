import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User as UserIcon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DEPARTMENTS, SECTIONS, GRADUATION_YEARS } from "@shared/constants";

export default function Profile() {
    const { user, completeProfile, isCompletingProfile } = useAuth();
    const { toast } = useToast();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [department, setDepartment] = useState("");
    const [customDepartment, setCustomDepartment] = useState("");
    const [section, setSection] = useState("");
    const [yearOfGraduation, setYearOfGraduation] = useState("");
    const [registerNumber, setRegisterNumber] = useState("");

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setRegisterNumber(user.registerNumber || "");
            setSection(user.section || "");
            setYearOfGraduation(user.yearOfGraduation?.toString() || "");

            if (user.department) {
                if (DEPARTMENTS.includes(user.department as any)) {
                    setDepartment(user.department);
                } else {
                    setDepartment("Others");
                    setCustomDepartment(user.department);
                }
            }
        }
    }, [user]);

    if (!user) return <Redirect to="/login" />;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const finalDepartment = department === "Others" ? customDepartment : department;
            if (department === "Others" && !customDepartment) {
                throw new Error("Please enter your department");
            }

            await completeProfile({
                firstName,
                lastName,
                department: finalDepartment,
                registerNumber,
                section,
                yearOfGraduation: parseInt(yearOfGraduation)
            });
            toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />
            <main className="container max-w-2xl py-12 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="shadow-xl border-none">
                        <CardHeader>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <UserIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold font-display">My Profile</CardTitle>
                                    <CardDescription>
                                        Update your personal and academic information below.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            placeholder="Enter your first name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            className="bg-zinc-50/50 dark:bg-zinc-900/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Enter your last name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                            className="bg-zinc-50/50 dark:bg-zinc-900/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        value={user.email || ""}
                                        disabled
                                        className="bg-muted text-muted-foreground"
                                    />
                                    <p className="text-xs text-muted-foreground italic">Email cannot be changed.</p>
                                </div>

                                <div className="space-y-4 pt-4 border-t">
                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Academic Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <Select value={department} onValueChange={setDepartment} required>
                                                <SelectTrigger id="department" className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                                    <SelectValue placeholder="Select Department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DEPARTMENTS.map((dept) => (
                                                        <SelectItem key={dept} value={dept}>
                                                            {dept}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="regNumber">Register Number</Label>
                                            <Input
                                                id="regNumber"
                                                placeholder="e.g. 21CS001"
                                                value={registerNumber}
                                                onChange={(e) => setRegisterNumber(e.target.value)}
                                                required
                                                className="bg-zinc-50/50 dark:bg-zinc-900/50"
                                            />
                                        </div>
                                    </div>

                                    {department === "Others" && (
                                        <div className="space-y-2">
                                            <Label htmlFor="customDepartment">Enter Your Department</Label>
                                            <Input
                                                id="customDepartment"
                                                placeholder="e.g. Mechanical Engineering"
                                                value={customDepartment}
                                                onChange={(e) => setCustomDepartment(e.target.value)}
                                                required
                                                className="bg-zinc-50/50 dark:bg-zinc-900/50"
                                            />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="section">Section</Label>
                                            <Select value={section} onValueChange={setSection} required>
                                                <SelectTrigger id="section" className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                                    <SelectValue placeholder="Select Section" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SECTIONS.map((sec) => (
                                                        <SelectItem key={sec} value={sec}>
                                                            {sec}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="yearOfGraduation">Graduation Year</Label>
                                            <Select value={yearOfGraduation} onValueChange={setYearOfGraduation} required>
                                                <SelectTrigger id="yearOfGraduation" className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                                    <SelectValue placeholder="Select Year" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {GRADUATION_YEARS.map((year) => (
                                                        <SelectItem key={year} value={year}>
                                                            {year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="bg-zinc-50/50 dark:bg-zinc-900/50 border-t px-6 py-4">
                            <Button
                                type="submit"
                                form="profile-form"
                                className="ml-auto min-w-[140px]"
                                disabled={isCompletingProfile}
                            >
                                {isCompletingProfile ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
