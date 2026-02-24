import cron from "node-cron";
import { db } from "./db";
import { hackathons, registrations } from "@shared/schema";
import { users } from "@shared/models/auth";
import { eq, and, gt, lt, sql } from "drizzle-orm";
import { sendEmail } from "./email";
import { storage } from "./storage";

export function setupCronJobs() {
    // Run every day at 10:00 AM
    cron.schedule("0 10 * * *", async () => {
        console.log("Running daily reminder cron job...");
        const now = new Date();
        const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        const in72Hours = new Date(now.getTime() + 72 * 60 * 60 * 1000);

        try {
            // 1. Registration Deadline Reminders (Deadline in the next 72 hours)
            const upcomingRegDeadlines = await db.select().from(hackathons).where(
                and(
                    gt(hackathons.registrationDeadline, now),
                    lt(hackathons.registrationDeadline, in72Hours)
                )
            );

            const allStudents = await db.select().from(users).where(eq(users.role, "student"));

            for (const hackathon of upcomingRegDeadlines) {
                const diffMs = hackathon.registrationDeadline.getTime() - now.getTime();
                const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

                for (const student of allStudents) {
                    // Check if already registered
                    const [isRegistered] = await db.select().from(registrations).where(
                        and(
                            eq(registrations.hackathonId, hackathon.id),
                            eq(registrations.studentId, student.id)
                        )
                    );

                    if (!isRegistered && student.email) {
                        await sendEmail(
                            student.email,
                            `⏳ Hurry! Registration for ${hackathon.title} ends in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}!`,
                            `
                            <div class="badge">Registration Reminder</div>
                            <h2>Final Call for ${hackathon.title}!</h2>
                            <p>Hi <strong>${student.firstName || 'Student'}</strong>,</p>
                            <p>Don't miss your chance to participate in <strong>${hackathon.title}</strong>. Opportunities to showcase your skills like this don't come every day!</p>
                            
                            <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                              <p style="margin: 0; color: #9a3412; font-weight: 700;">Registration Deadline: ${hackathon.registrationDeadline.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</p>
                              <p style="margin: 4px 0 0 0; color: #c2410c; font-size: 14px;">Time remaining: Approx. ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}</p>
                            </div>
                            
                            <div style="text-align: center;">
                              <a href="${process.env.APP_URL || 'http://localhost:5000'}/hackathons/${hackathon.id}" class="button">Register Now</a>
                            </div>
                            `
                        );
                    }
                }
            }

            // 2. Submission Deadline Reminders (Deadline in the next 72 hours)
            const upcomingSubDeadlines = await db.select().from(hackathons).where(
                and(
                    gt(hackathons.submissionDeadline, now),
                    lt(hackathons.submissionDeadline, in72Hours)
                )
            );

            for (const hackathon of upcomingSubDeadlines) {
                const diffMs = hackathon.submissionDeadline.getTime() - now.getTime();
                const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

                const registeredUsers = await storage.getRegistrationsForHackathon(hackathon.id);

                for (const reg of registeredUsers) {
                    if (reg.studentEmail) {
                        await sendEmail(
                            reg.studentEmail,
                            `🚀 Final Countdown: ${hackathon.title} Submission in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}!`,
                            `
                            <div class="badge">Submission Reminder</div>
                            <h2>Submission Phase Ending Soon!</h2>
                            <p>Hi <strong>${reg.studentName || 'Student'}</strong>,</p>
                            <p>We're excited to see what you've built! The submission portal for <strong>${hackathon.title}</strong> is closing soon. Every minute counts!</p>
                            
                            <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                              <p style="margin: 0; color: #166534; font-weight: 700;">Submission Deadline: ${hackathon.submissionDeadline.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</p>
                              <p style="margin: 4px 0 0 0; color: #15803d; font-size: 14px;">Time remaining: Approx. ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}</p>
                            </div>
                            
                            <p>Make sure your code is clean, your documentation is clear, and your project is ready for the judges!</p>
                            
                            <div style="text-align: center;">
                              <a href="${process.env.APP_URL || 'http://localhost:5000'}/hackathons/${hackathon.id}" class="button">Submit Project</a>
                            </div>
                            `
                        );
                    }
                }
            }

        } catch (error) {
            console.error("Cron job error:", error);
        }
    });

    console.log("Cron jobs scheduled.");
}
