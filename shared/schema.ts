import { pgTable, text, serial, integer, timestamp, boolean, varchar, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

export * from "./models/auth";

export const hackathons = pgTable("hackathons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  registrationDeadline: timestamp("registration_deadline").notNull(),
  submissionDeadline: timestamp("submission_deadline").notNull(),
  views: integer("views").notNull().default(0),
  link: text("link"),
  createdBy: varchar("created_by").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  hackathonId: integer("hackathon_id").notNull().references(() => hackathons.id, { onDelete: 'cascade' }),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const hackathonSubmissions = pgTable("hackathon_submissions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  hackathonId: integer("hackathon_id").notNull().references(() => hackathons.id, { onDelete: 'cascade' }),
  submittedAt: timestamp("submitted_at").defaultNow(),
}, (table) => [
  unique("submission_user_hackathon_unique").on(table.userId, table.hackathonId),
]);

export const hackathonsRelations = relations(hackathons, ({ one, many }) => ({
  creator: one(users, { fields: [hackathons.createdBy], references: [users.id] }),
  registrations: many(registrations),
  submissions: many(hackathonSubmissions),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  student: one(users, { fields: [registrations.studentId], references: [users.id] }),
  hackathon: one(hackathons, { fields: [registrations.hackathonId], references: [hackathons.id] }),
}));

export const hackathonSubmissionsRelations = relations(hackathonSubmissions, ({ one }) => ({
  user: one(users, { fields: [hackathonSubmissions.userId], references: [users.id] }),
  hackathon: one(hackathons, { fields: [hackathonSubmissions.hackathonId], references: [hackathons.id] }),
}));

export const insertHackathonSchema = createInsertSchema(hackathons).omit({
  id: true,
  createdBy: true,
  createdAt: true
}).extend({
  registrationDeadline: z.coerce.date(),
  submissionDeadline: z.coerce.date(),
  link: z.string().url().optional().or(z.literal("")),
});

export type InsertHackathon = z.infer<typeof insertHackathonSchema>;
export type Hackathon = typeof hackathons.$inferSelect;

export type InsertRegistration = { hackathonId: number };
export type Registration = typeof registrations.$inferSelect;

export type HackathonSubmission = typeof hackathonSubmissions.$inferSelect;
export type InsertHackathonSubmission = typeof hackathonSubmissions.$inferInsert;

export type HackathonWithCounts = Hackathon & {
  registrationCount: number;
  isRegistered?: boolean;
  isSubmitted?: boolean;
};

export type HackathonRequest = InsertHackathon;
export type UpdateHackathonRequest = Partial<InsertHackathon>;