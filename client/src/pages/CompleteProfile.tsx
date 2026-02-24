import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DEPARTMENTS, SECTIONS, GRADUATION_YEARS } from "@shared/constants";

export default function CompleteProfile() {
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
        if (user?.firstName) setFirstName(user.firstName);
        if (user?.lastName) setLastName(user.lastName);
    }, [user]);

    if (!user) return <Redirect to="/login" />;
    if (user.profileCompleted) return <Redirect to="/" />;


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
            toast({ title: "Profile Completed", description: "Welcome to the platform!" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                            <UserPlus className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold font-display">Complete Your Profile</CardTitle>
                        <CardDescription>
                            Please provide your details to access the dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

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

                            {department === "Others" && (
                                <div className="space-y-2">
                                    <Label htmlFor="customDepartment">Enter Your Department</Label>
                                    <Input
                                        id="customDepartment"
                                        placeholder="e.g. Mechanical Engineering"
                                        value={customDepartment}
                                        onChange={(e) => setCustomDepartment(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="section">Section</Label>
                                    <Select value={section} onValueChange={setSection} required>
                                        <SelectTrigger id="section" className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                            <SelectValue placeholder="Select" />
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
                                            <SelectValue placeholder="Select" />
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

                            <div className="space-y-2">
                                <Label htmlFor="regNumber">Register Number</Label>
                                <Input
                                    id="regNumber"
                                    placeholder="e.g. 21CS001"
                                    value={registerNumber}
                                    onChange={(e) => setRegisterNumber(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full h-11" disabled={isCompletingProfile}>
                                {isCompletingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Finish Setup
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
