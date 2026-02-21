import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { isAuthenticated } from "./replit_integrations/auth";
import { users } from "@shared/models/auth";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import bcrypt from "bcryptjs";

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
    const item = await storage.getHackathon(hackathonId);
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



  return httpServer;
}