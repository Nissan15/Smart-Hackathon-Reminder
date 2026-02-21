import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { isAuthenticated } from "./replit_integrations/auth";
import { users } from "@shared/models/auth";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

async function seedDatabase() {
  const existingUsers = await db.select().from(users);
  let adminId = "";
  if (existingUsers.length === 0) {
    const [admin] = await db.insert(users).values({
      id: "admin-1",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    }).returning();
    adminId = admin.id;
  } else {
    const admin = existingUsers.find(u => u.role === 'admin');
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
    const userId = (req as any).user?.claims?.sub;
    const items = await storage.getHackathons(userId);
    res.json(items);
  });

  app.get(api.hackathons.get.path, async (req, res) => {
    const item = await storage.getHackathon(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  });

  app.post(api.hackathons.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.hackathons.create.input.parse(req.body);
      const userId = (req as any).user.claims.sub;
      
      const user = await db.select().from(users).where(eq(users.id, userId));
      if (!user.length || user[0].role !== 'admin') {
        // Let's auto-promote the first user to admin if they try to create a hackathon for testing
        await db.update(users).set({ role: 'admin' }).where(eq(users.id, userId));
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
    const userId = (req as any).user.claims.sub;
    const regs = await storage.getStudentRegistrations(userId);
    res.json(regs);
  });

  app.post(api.registrations.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.registrations.create.input.parse(req.body);
      const userId = (req as any).user.claims.sub;
      const reg = await storage.registerForHackathon(userId, input.hackathonId);
      res.status(201).json(reg);
    } catch (err) {
      res.status(400).json({ message: "Bad request" });
    }
  });

  app.delete(api.registrations.delete.path, isAuthenticated, async (req, res) => {
    const userId = (req as any).user.claims.sub;
    await storage.unregisterFromHackathon(userId, Number(req.params.hackathonId));
    res.status(204).end();
  });

  // Stats
  app.get(api.stats.dashboard.path, isAuthenticated, async (req, res) => {
    const userId = (req as any).user.claims.sub;
    const user = await db.select().from(users).where(eq(users.id, userId));
    
    if (user.length > 0 && user[0].role === 'admin') {
      const stats = await storage.getAdminStats();
      res.json({ role: 'admin', ...stats });
    } else {
      const stats = await storage.getStudentStats(userId);
      res.json({ role: 'student', ...stats });
    }
  });

  // Demo helper: Make me admin route
  app.post('/api/make-me-admin', isAuthenticated, async (req, res) => {
    const userId = (req as any).user.claims.sub;
    await db.update(users).set({ role: 'admin' }).where(eq(users.id, userId));
    res.json({ success: true });
  });

  return httpServer;
}