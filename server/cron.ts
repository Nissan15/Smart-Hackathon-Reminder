import cron from "node-cron";
import { db } from "./db";
import { hackathons, registrations } from "@shared/schema";
import { users } from "@shared/models/auth";
import { eq, and, gt, lt, sql } from "drizzle-orm";
import { sendEmail } from "./email";
import { storage } from "./storage";

export async function sendHackathonReminders(hackathonId?: number) {
    console.log(`Running reminder task${hackathonId ? ` for hackathon ${hackathonId}` : ''}...`);
    const now = new Date();
    const in72Hours = new Date(now.getTime() + 72 * 60 * 60 * 1000);

    try {
        // 1. Registration Deadline Reminders
        const regWhere = [
            gt(hackathons.registrationDeadline, now),
            lt(hackathons.registrationDeadline, in72Hours)
        ];
        if (hackathonId) regWhere.push(eq(hackathons.id, hackathonId));

        const upcomingRegDeadlines = await db.select().from(hackathons).where(and(...regWhere));
        const allStudents = await db.select().from(users).where(eq(users.role, "student"));

        for (const hackathon of upcomingRegDeadlines) {
            const diffMs = hackathon.registrationDeadline.getTime() - now.getTime();
            const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
            const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

            const isUrgent = hoursLeft <= 24;
            const subject = isUrgent
                ? `🚨 URGENT: Registration for ${hackathon.title} ends in ${hoursLeft} hours!`
                : `⏳ Hurry! Registration for ${hackathon.title} ends in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}!`;

            for (const student of allStudents) {
                const [isRegistered] = await db.select().from(registrations).where(
                    and(
                        eq(registrations.hackathonId, hackathon.id),
                        eq(registrations.studentId, student.id)
                    )
                );

                if (!isRegistered && student.email) {
                    await sendEmail(
                        student.email,
                        subject,
                        `
                        <div class="badge">${isUrgent ? 'Final Call' : 'Registration Reminder'}</div>
                        <h2>${isUrgent ? 'LAST CHANCE: ' : ''}Register for ${hackathon.title}!</h2>
                        <p>Hi <strong>${student.firstName || 'Student'}</strong>,</p>
                        <p>${isUrgent
                            ? `Time is running out! You have less than <strong>${hoursLeft} hours</strong> left to register for <strong>${hackathon.title}</strong>.`
                            : `Don't miss your chance to participate in <strong>${hackathon.title}</strong>. Registration is closing soon!`
                        }</p>
                        
                        <div style="background: ${isUrgent ? '#fef2f2' : '#fff7ed'}; border-left: 4px solid ${isUrgent ? '#ef4444' : '#f97316'}; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                          <p style="margin: 0; color: ${isUrgent ? '#991b1b' : '#9a3412'}; font-weight: 700;">Registration Deadline: ${hackathon.registrationDeadline.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</p>
                          <p style="margin: 4px 0 0 0; color: ${isUrgent ? '#b91c1c' : '#c2410c'}; font-size: 14px;">Time remaining: ${isUrgent ? `${hoursLeft} hours` : `Approx. ${daysLeft} days`}</p>
                        </div>
                        
                        <div style="text-align: center;">
                          <a href="${process.env.APP_URL || 'http://localhost:5000'}/hackathons/${hackathon.id}" class="button" style="background: ${isUrgent ? '#ef4444' : '#4f46e5'}">Register Now</a>
                        </div>
                        `
                    );
                }
            }
        }

        // 2. Submission Deadline Reminders
        const subWhere = [
            gt(hackathons.submissionDeadline, now),
            lt(hackathons.submissionDeadline, in72Hours)
        ];
        if (hackathonId) subWhere.push(eq(hackathons.id, hackathonId));

        const upcomingSubDeadlines = await db.select().from(hackathons).where(and(...subWhere));

        for (const hackathon of upcomingSubDeadlines) {
            const diffMs = hackathon.submissionDeadline.getTime() - now.getTime();
            const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
            const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

            const isUrgent = hoursLeft <= 24;
            const subject = isUrgent
                ? `⚠️ FINAL HOURS: Submit your project for ${hackathon.title}!`
                : `🚀 Final Countdown: ${hackathon.title} Submission in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}!`;

            const registeredUsers = await storage.getRegistrationsForHackathon(hackathon.id);

            for (const reg of registeredUsers) {
                if (reg.studentEmail) {
                    await sendEmail(
                        reg.studentEmail,
                        subject,
                        `
                        <div class="badge">${isUrgent ? 'Action Required' : 'Submission Reminder'}</div>
                        <h2>${isUrgent ? 'Submission Phase Ending Today!' : 'Submission Phase ending soon!'}</h2>
                        <p>Hi <strong>${reg.studentName || 'Student'}</strong>,</p>
                        <p>${isUrgent
                            ? `The portal for <strong>${hackathon.title}</strong> closes in just <strong>${hoursLeft} hours</strong>. Make sure to submit your project before the clock runs out!`
                            : `We're excited to see what you've built! The submission portal for <strong>${hackathon.title}</strong> is closing soon. Every minute counts!`
                        }</p>
                        
                        <div style="background: ${isUrgent ? '#f8fafc' : '#f0fdf4'}; border-left: 4px solid ${isUrgent ? '#64748b' : '#22c55e'}; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                          <p style="margin: 0; color: ${isUrgent ? '#1e293b' : '#166534'}; font-weight: 700;">Submission Deadline: ${hackathon.submissionDeadline.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</p>
                          <p style="margin: 4px 0 0 0; color: ${isUrgent ? '#475569' : '#15803d'}; font-size: 14px;">Time remaining: ${isUrgent ? `${hoursLeft} hours` : `Approx. ${daysLeft} days`}</p>
                        </div>
                        
                        <p>Don't let your hard work go to waste. Ensure your submission is complete and works as expected!</p>
                        
                        <div style="text-align: center;">
                          <a href="${process.env.APP_URL || 'http://localhost:5000'}/hackathons/${hackathon.id}" class="button" style="background: ${isUrgent ? '#1e293b' : '#4f46e5'}">Submit Project</a>
                        </div>
                        `
                    );
                }
            }
        }

    } catch (error) {
        console.error("Reminder task error:", error);
    }
}

export function setupCronJobs() {
    // Run every day at 10:00 AM
    cron.schedule("0 10 * * *", () => {
        sendHackathonReminders().catch(console.error);
    });

    console.log("Cron jobs scheduled.");
}
