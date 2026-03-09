import { db } from "./db";
import { users } from "@shared/models/auth";
import { hackathons, registrations, hackathonSubmissions, type InsertHackathon, type UpdateHackathonRequest, type Hackathon, type HackathonWithCounts, type Registration, type HackathonSubmission } from "@shared/schema";
import { eq, and, sql, desc, asc, count } from "drizzle-orm";

export interface IStorage {
  // Hackathons
  getHackathons(userId?: string): Promise<HackathonWithCounts[]>;
  getHackathon(id: number, userId?: string): Promise<HackathonWithCounts | undefined>;
  createHackathon(hackathon: InsertHackathon & { createdBy: string }): Promise<Hackathon>;
  updateHackathon(id: number, updates: UpdateHackathonRequest): Promise<Hackathon>;
  deleteHackathon(id: number): Promise<void>;

  // Registrations
  getRegistrationsForHackathon(hackathonId: number): Promise<any[]>;
  getStudentRegistrations(studentId: string): Promise<Hackathon[]>;
  registerForHackathon(studentId: string, hackathonId: number): Promise<Registration>;
  unregisterFromHackathon(studentId: string, hackathonId: number): Promise<void>;

  // Submissions
  getSubmission(userId: string, hackathonId: number): Promise<HackathonSubmission | undefined>;
  submitIdea(userId: string, hackathonId: number): Promise<HackathonSubmission>;

  // Stats
  getAdminStats(): Promise<any>;
  getStudentStats(studentId: string): Promise<any>;
  getNotifications(userId: string): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getHackathons(userId?: string): Promise<HackathonWithCounts[]> {
    const allHackathons = await db.select().from(hackathons).orderBy(asc(hackathons.registrationDeadline));

    // Get counts and user registration/submission status
    return Promise.all(allHackathons.map(async (h) => {
      const [regCount] = await db.select({ count: count() }).from(registrations).where(eq(registrations.hackathonId, h.id));

      let isRegistered = false;
      let isSubmitted = false;
      if (userId) {
        const [reg] = await db.select().from(registrations).where(and(eq(registrations.hackathonId, h.id), eq(registrations.studentId, userId)));
        isRegistered = !!reg;

        const [sub] = await db.select().from(hackathonSubmissions).where(and(eq(hackathonSubmissions.hackathonId, h.id), eq(hackathonSubmissions.userId, userId)));
        isSubmitted = !!sub;
      }

      return {
        ...h,
        registrationCount: Number(regCount.count),
        isRegistered,
        isSubmitted
      };
    }));
  }

  async getHackathon(id: number, userId?: string): Promise<HackathonWithCounts | undefined> {
    const [h] = await db.select().from(hackathons).where(eq(hackathons.id, id));
    if (!h) return undefined;

    const [regCount] = await db.select({ count: count() }).from(registrations).where(eq(registrations.hackathonId, h.id));

    let isRegistered = false;
    let isSubmitted = false;
    if (userId) {
      const [reg] = await db.select().from(registrations).where(and(eq(registrations.hackathonId, h.id), eq(registrations.studentId, userId)));
      isRegistered = !!reg;

      const [sub] = await db.select().from(hackathonSubmissions).where(and(eq(hackathonSubmissions.hackathonId, h.id), eq(hackathonSubmissions.userId, userId)));
      isSubmitted = !!sub;
    }

    return {
      ...h,
      registrationCount: Number(regCount.count),
      isRegistered,
      isSubmitted
    };
  }

  async createHackathon(hackathon: InsertHackathon & { createdBy: string }): Promise<Hackathon> {
    const [h] = await db.insert(hackathons).values(hackathon).returning();
    return h;
  }

  async updateHackathon(id: number, updates: UpdateHackathonRequest): Promise<Hackathon> {
    const [h] = await db.update(hackathons).set(updates).where(eq(hackathons.id, id)).returning();
    return h;
  }

  async deleteHackathon(id: number): Promise<void> {
    await db.delete(hackathons).where(eq(hackathons.id, id));
  }

  async getRegistrationsForHackathon(hackathonId: number): Promise<any[]> {
    return await db.select({
      id: registrations.id,
      timestamp: registrations.timestamp,
      studentId: users.id,
      studentName: sql<string>`concat(${users.firstName}, ' ', ${users.lastName})`,
      studentEmail: users.email,
      department: users.department,
      registerNumber: users.registerNumber,
      profileImageUrl: users.profileImageUrl
    })
      .from(registrations)
      .innerJoin(users, eq(registrations.studentId, users.id))
      .where(eq(registrations.hackathonId, hackathonId));
  }

  async incrementHackathonViews(id: number): Promise<void> {
    await db.update(hackathons)
      .set({ views: sql`${hackathons.views} + 1` })
      .where(eq(hackathons.id, id));
  }

  async getStudentRegistrations(studentId: string): Promise<Hackathon[]> {
    const regs = await db.select()
      .from(registrations)
      .innerJoin(hackathons, eq(registrations.hackathonId, hackathons.id))
      .where(eq(registrations.studentId, studentId));

    return regs.map(r => r.hackathons);
  }

  async registerForHackathon(studentId: string, hackathonId: number): Promise<Registration> {
    // Prevent duplicate registrations
    const [existing] = await db.select().from(registrations).where(and(eq(registrations.studentId, studentId), eq(registrations.hackathonId, hackathonId)));
    if (existing) return existing;

    const [reg] = await db.insert(registrations).values({ studentId, hackathonId }).returning();
    return reg;
  }

  async unregisterFromHackathon(studentId: string, hackathonId: number): Promise<void> {
    await db.delete(registrations).where(and(eq(registrations.studentId, studentId), eq(registrations.hackathonId, hackathonId)));
  }

  async getSubmission(userId: string, hackathonId: number): Promise<HackathonSubmission | undefined> {
    const [sub] = await db.select().from(hackathonSubmissions).where(and(eq(hackathonSubmissions.userId, userId), eq(hackathonSubmissions.hackathonId, hackathonId)));
    return sub;
  }

  async submitIdea(userId: string, hackathonId: number): Promise<HackathonSubmission> {
    const [sub] = await db.insert(hackathonSubmissions).values({ userId, hackathonId }).returning();
    return sub;
  }

  async getAdminStats(): Promise<any> {
    const [hCount] = await db.select({ count: count() }).from(hackathons);
    const [sCount] = await db.select({ count: count() }).from(users).where(eq(users.role, 'student'));
    const [rCount] = await db.select({ count: count() }).from(registrations);
    const [uCount] = await db.select({ count: count() }).from(users);

    return {
      totalHackathons: Number(hCount.count),
      totalStudents: Number(sCount.count),
      totalRegistrations: Number(rCount.count),
      totalUsers: Number(uCount.count)
    };
  }

  async getStudentStats(studentId: string): Promise<any> {
    const regs = await this.getStudentRegistrations(studentId);
    const [hCount] = await db.select({ count: count() }).from(hackathons);
    const now = new Date();

    return {
      registeredCount: regs.length,
      upcomingDeadlines: regs.filter(r => new Date(r.submissionDeadline) > now).length,
      totalHackathons: Number(hCount.count),
      missedDeadlines: regs.filter(r => new Date(r.submissionDeadline) < now).length
    };
  }

  async getNotifications(userId: string): Promise<any[]> {
    const notifications: any[] = [];

    // 1. Newly posted hackathons (last 7 days)
    const recentHackathons = await db.select()
      .from(hackathons)
      .where(sql`${hackathons.createdAt} > now() - interval '7 days'`)
      .orderBy(desc(hackathons.createdAt));

    recentHackathons.forEach(h => {
      notifications.push({
        id: `hackathon-${h.id}`,
        type: 'new_hackathon',
        title: 'New Hackathon Posted',
        message: `"${h.title}" is now open for registration!`,
        timestamp: h.createdAt,
        data: { hackathonId: h.id }
      });
    });

    // 2. User's registrations
    const userRegistrations = await db.select()
      .from(registrations)
      .innerJoin(hackathons, eq(registrations.hackathonId, hackathons.id))
      .where(eq(registrations.studentId, userId))
      .orderBy(desc(registrations.timestamp));

    userRegistrations.forEach(r => {
      notifications.push({
        id: `reg-${r.registrations.id}`,
        type: 'registration_success',
        title: 'Registration Confirmed',
        message: `You have successfully registered for "${r.hackathons.title}".`,
        timestamp: r.registrations.timestamp,
        data: { hackathonId: r.hackathons.id }
      });
    });

    // Sort all notifications by timestamp descending
    return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export const storage = new DatabaseStorage();