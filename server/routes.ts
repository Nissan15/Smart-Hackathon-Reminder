import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { isAuthenticated } from "./auth";
import { users } from "@shared/models/auth";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { setupAuth, registerAuthRoutes } from "./auth";
import bcrypt from "bcryptjs";
import { sendEmail } from "./email";

async function seedDatabase() {
  const existingUsers = await db.select().from(users);
  let adminId = "";
  if (existingUsers.length === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const [admin] = await db.insert(users).values({
      id: "admin-1",
      email: "admin@example.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    }).returning();
    adminId = admin.id;
  } else {
    const admin = existingUsers.find(u => u.role === 'admin');
    if (admin && !admin.password) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await db.update(users).set({ password: hashedPassword }).where(eq(users.id, admin.id));
    }
    adminId = admin ? admin.id : existingUsers[0].id;
  }

  const existingHackathons = await storage.getHackathons();
  if (existingHackathons.length === 0) {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    await storage.createHackathon({
      title: "Spring AI Hackathon",
      description: "Build innovative AI applications over the weekend. Open for all students globally.",
      registrationDeadline: nextWeek,
      submissionDeadline: nextMonth,
      createdBy: adminId
    });

    await storage.createHackathon({
      title: "Blockchain for Good",
      description: "Create decentralized solutions for social impact and sustainability.",
      registrationDeadline: tomorrow,
      submissionDeadline: nextWeek,
      createdBy: adminId
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  await setupAuth(app);
  registerAuthRoutes(app);

  // Call seed database
  seedDatabase().catch(console.error);

  // Hackathons
  app.get(api.hackathons.list.path, async (req, res) => {
    const userId = (req as any).user?.id;
    const items = await storage.getHackathons(userId);
    res.json(items);
  });

  app.get(api.hackathons.get.path, async (req, res) => {
    const hackathonId = Number(req.params.id);
    const userId = (req as any).user?.id;
    const item = await storage.getHackathon(hackathonId, userId);
    if (!item) return res.status(404).json({ message: "Not found" });

    // Increment views if it's a student (not an admin or unauthorized is fine too, but let's be specific)
    const userRole = (req as any).user?.role;
    if (userRole !== 'admin') {
      await storage.incrementHackathonViews(hackathonId);
    }

    res.json(item);
  });

  app.get("/api/admin/hackathons/:id/analytics", isAuthenticated, async (req: any, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    try {
      const hackathonId = Number(req.params.id);
      const hackathon = await storage.getHackathon(hackathonId);
      if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

      const registrations = await storage.getRegistrationsForHackathon(hackathonId);

      // Get total students
      const [studentCountResult] = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, 'student'));
      const totalStudents = Number(studentCountResult?.count || 0);

      const registeredCount = registrations.length;
      const notRegisteredCount = Math.max(0, totalStudents - registeredCount);

      res.json({
        hackathon,
        stats: {
          visited: hackathon.views || 0,
          registered: registeredCount,
          notRegistered: notRegisteredCount
        },
        users: registrations
      });
    } catch (error) {
      console.error("Error fetching hackathon analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.post(api.hackathons.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.hackathons.create.input.parse(req.body);
      const userId = (req as any).user.id;

      const user = await db.select().from(users).where(eq(users.id, userId));
      if (!user.length || user[0].role !== 'admin') {
        return res.status(403).json({ message: "Only admins can create hackathons" });
      }

      const item = await storage.createHackathon({ ...input, createdBy: userId });
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.put(api.hackathons.update.path, isAuthenticated, async (req, res) => {
    try {
      const bodySchema = api.hackathons.update.input;
      const input = bodySchema.parse(req.body);
      const item = await storage.updateHackathon(Number(req.params.id), input);
      res.json(item);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.delete(api.hackathons.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteHackathon(Number(req.params.id));
    res.status(204).end();
  });

  app.get(api.hackathons.registrations.path, isAuthenticated, async (req, res) => {
    const regs = await storage.getRegistrationsForHackathon(Number(req.params.id));
    res.json(regs);
  });

  // Registrations
  app.get(api.registrations.list.path, isAuthenticated, async (req, res) => {
    const userId = (req as any).user.id;
    const regs = await storage.getStudentRegistrations(userId);
    res.json(regs);
  });

  app.post(api.registrations.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.registrations.create.input.parse(req.body);
      const userId = (req as any).user.id;
      const reg = await storage.registerForHackathon(userId, input.hackathonId);

      // Send confirmation email
      try {
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        const hackathon = await storage.getHackathon(input.hackathonId);

        console.log(`[Registration] Processing email for student: ${user?.email || 'N/A'}, hackathon: ${hackathon?.title || 'N/A'}`);

        if (user && user.email && hackathon) {
          console.log(`[Registration] Sending confirmation for ${hackathon.title} to ${user.email}`);
          await sendEmail(
            user.email,
            `Registration Confirmed: ${hackathon.title}`,
            `
            <div class="badge">Success</div>
            <h2>Registration Confirmed!</h2>
            <p>Hi <strong>${user.firstName || 'Student'}</strong>,</p>
            <p>Great news! You have successfully registered for <strong>${hackathon.title}</strong>. We've reserved your spot in this event.</p>
            
            <div class="divider"></div>
            
            <p style="margin-bottom: 8px;"><strong>Event Details:</strong></p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Registration Deadline:</td>
                <td style="padding: 8px 0; font-weight: 600; text-align: right;">${new Date(hackathon.registrationDeadline).toLocaleDateString(undefined, { dateStyle: 'long' })}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Submission Deadline:</td>
                <td style="padding: 8px 0; font-weight: 600; text-align: right;">${new Date(hackathon.submissionDeadline).toLocaleDateString(undefined, { dateStyle: 'long' })}</td>
              </tr>
            </table>
            
            <div class="divider"></div>
            
            <p>Ready to start building? Check the dashboard for more details and guidelines.</p>
            <div style="text-align: center;">
              <a href="${process.env.APP_URL || 'http://localhost:5000'}/hackathons/${hackathon.id}" class="button">View Hackathon Details</a>
            </div>
            
            <p style="margin-top: 32px; font-size: 14px;">Good luck with your project! We can't wait to see what you create.</p>
            `
          );
        } else {
          console.warn(`[Registration] Missing required data for email. User found: ${!!user}, Email: ${user?.email}, Hackathon: ${!!hackathon}`);
        }
      } catch (emailError) {
        console.error("[Registration] Email notification failed:", emailError);
      }

      res.status(201).json(reg);
    } catch (err) {
      res.status(400).json({ message: "Bad request" });
    }
  });

  app.delete(api.registrations.delete.path, isAuthenticated, async (req, res) => {
    const userId = (req as any).user.id;
    await storage.unregisterFromHackathon(userId, Number(req.params.hackathonId));
    res.status(204).end();
  });

  // Submissions
  app.post("/api/submissions", isAuthenticated, async (req, res) => {
    try {
      const { hackathonId } = req.body;
      const userId = (req as any).user.id;

      if (!hackathonId) {
        return res.status(400).json({ message: "Hackathon ID is required" });
      }

      const hackathon = await storage.getHackathon(Number(hackathonId), userId);
      if (!hackathon) {
        return res.status(404).json({ message: "Hackathon not found" });
      }

      if (!hackathon.isRegistered) {
        return res.status(403).json({ message: "You must be registered to submit an idea." });
      }

      // Check if current time is within submission window (assume before submissionDeadline)
      const now = new Date();
      if (now > new Date(hackathon.submissionDeadline)) {
        return res.status(400).json({ message: "Submission deadline has passed" });
      }

      // Check if already submitted
      const existing = await storage.getSubmission(userId, Number(hackathonId));
      if (existing) {
        return res.status(400).json({ message: "You have already submitted your idea." });
      }

      const sub = await storage.submitIdea(userId, Number(hackathonId));
      res.status(201).json(sub);
    } catch (err) {
      console.error("Submission error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Stats
  app.get(api.stats.dashboard.path, isAuthenticated, async (req, res) => {
    const userId = (req as any).user.id;
    const user = await db.select().from(users).where(eq(users.id, userId));

    if (user.length > 0 && user[0].role === 'admin') {
      const stats = await storage.getAdminStats();
      res.json({ role: 'admin', ...stats });
    } else {
      const stats = await storage.getStudentStats(userId);
      res.json({ role: 'student', ...stats });
    }
  });



  app.post("/api/admin/hackathons/:id/remind", isAuthenticated, async (req: any, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    try {
      const hackathonId = Number(req.params.id);
      const hackathon = await storage.getHackathon(hackathonId);
      if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

      const { sendHackathonReminders } = await import("./cron");
      // Trigger reminders asynchronously
      sendHackathonReminders(hackathonId).catch(err => console.error("Manual reminder error:", err));

      res.json({ message: "Reminders are being sent to relevant students" });
    } catch (error) {
      console.error("Error triggering reminders:", error);
      res.status(500).json({ message: "Failed to trigger reminders" });
    }
  });

  app.get(api.notifications.list.path, isAuthenticated, async (req, res) => {
    const userId = (req as any).user.id;
    const notifications = await storage.getNotifications(userId);
    res.json(notifications);
  });

  return httpServer;
}