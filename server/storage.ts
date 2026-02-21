import { db } from "./db";
import { users } from "@shared/models/auth";
import { hackathons, registrations, type InsertHackathon, type UpdateHackathonRequest, type Hackathon, type HackathonWithCounts, type Registration } from "@shared/schema";
import { eq, and, sql, desc, count } from "drizzle-orm";

export interface IStorage {
  // Hackathons
  getHackathons(userId?: string): Promise<HackathonWithCounts[]>;
  getHackathon(id: number): Promise<Hackathon | undefined>;
  createHackathon(hackathon: InsertHackathon & { createdBy: string }): Promise<Hackathon>;
  updateHackathon(id: number, updates: UpdateHackathonRequest): Promise<Hackathon>;
  deleteHackathon(id: number): Promise<void>;
  
  // Registrations
  getRegistrationsForHackathon(hackathonId: number): Promise<any[]>;
  getStudentRegistrations(studentId: string): Promise<Hackathon[]>;
  registerForHackathon(studentId: string, hackathonId: number): Promise<Registration>;
  unregisterFromHackathon(studentId: string, hackathonId: number): Promise<void>;
  
  // Stats
  getAdminStats(): Promise<any>;
  getStudentStats(studentId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getHackathons(userId?: string): Promise<HackathonWithCounts[]> {
    const allHackathons = await db.select().from(hackathons).orderBy(desc(hackathons.registrationDeadline));
    
    // Get counts and user registration status
    return Promise.all(allHackathons.map(async (h) => {
      const [regCount] = await db.select({ count: count() }).from(registrations).where(eq(registrations.hackathonId, h.id));
      
      let isRegistered = false;
      if (userId) {
        const [reg] = await db.select().from(registrations).where(and(eq(registrations.hackathonId, h.id), eq(registrations.studentId, userId)));
        isRegistered = !!reg;
      }
      
      return {
        ...h,
        registrationCount: Number(regCount.count),
        isRegistered
      };
    }));
  }

  async getHackathon(id: number): Promise<Hackathon | undefined> {
    const [h] = await db.select().from(hackathons).where(eq(hackathons.id, id));
    return h;
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
      studentEmail: users.email
    })
    .from(registrations)
    .innerJoin(users, eq(registrations.studentId, users.id))
    .where(eq(registrations.hackathonId, hackathonId));
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

  async getAdminStats(): Promise<any> {
    const [hCount] = await db.select({ count: count() }).from(hackathons);
    const [sCount] = await db.select({ count: count() }).from(users).where(eq(users.role, 'student'));
    const [rCount] = await db.select({ count: count() }).from(registrations);
    
    return {
      totalHackathons: Number(hCount.count),
      totalStudents: Number(sCount.count),
      totalRegistrations: Number(rCount.count)
    };
  }

  async getStudentStats(studentId: string): Promise<any> {
    const regs = await this.getStudentRegistrations(studentId);
    return {
      registeredCount: regs.length,
      upcomingSubmissions: regs.filter(r => new Date(r.submissionDeadline) > new Date()).length
    };
  }
}

export const storage = new DatabaseStorage();