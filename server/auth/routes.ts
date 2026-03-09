import type { Express } from "express";
import passport from "passport";
import { authStorage } from "./storage";
import { isAuthenticated } from "./passport";
import bcrypt from "bcryptjs";
import { storage } from "../storage";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user
  app.get("/api/auth/user", (req: any, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  // Login
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Login failed" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        return res.json(user);
      });
    })(req, res, next);
  });

  // Google OAuth
  app.get("/api/auth/google", (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({ message: "Google OAuth is not configured" });
    }
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  });

  app.get("/api/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login",
    })(req, res, next);
  });

  // Register
  app.post("/api/register", async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const existingUser = await authStorage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await authStorage.upsertUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "student", // Default role
      });

      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  // Logout
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ success: true });
    });
  });

  // Admin: List Users
  app.get("/api/admin/users", isAuthenticated, async (req: any, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    try {
      const allUsers = await authStorage.listUsers();
      res.json(allUsers);
    } catch (error) {
      console.error("Error listing users:", error);
      res.status(500).json({ message: "Failed to list users" });
    }
  });

  // Admin: Update User Role
  app.patch("/api/admin/users/:id/role", isAuthenticated, async (req: any, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    try {
      const { id } = req.params;
      const { role } = req.body;
      if (!['admin', 'student'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await authStorage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await authStorage.upsertUser({
        ...user,
        role: role as any,
      } as any);

      res.json({ message: "User role updated" });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Admin: Delete User
  app.delete("/api/admin/users/:id", isAuthenticated, async (req: any, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    try {
      const { id } = req.params;
      if (req.user.id === id) {
        return res.status(400).json({ message: "Cannot delete yourself" });
      }

      await authStorage.deleteUser(id);
      res.json({ message: "User deleted" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Admin: Get User Registrations
  app.get("/api/admin/users/:id/registrations", isAuthenticated, async (req: any, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    try {
      const { id } = req.params;
      const regs = await storage.getStudentRegistrations(id);
      res.json(regs);
    } catch (error) {
      console.error("Error fetching user registrations:", error);
      res.status(500).json({ message: "Failed to fetch user registrations" });
    }
  });

  // Student/Admin: Complete Profile
  app.post("/api/user/profile", isAuthenticated, async (req: any, res) => {
    try {
      const { firstName, lastName, department, registerNumber, section, yearOfGraduation, profileImageUrl } = req.body;
      const isStudent = req.user.role === 'student';

      if (!firstName || !lastName || !department) {
        return res.status(400).json({ message: "Name and department are required" });
      }

      if (isStudent && (!registerNumber || !section || !yearOfGraduation)) {
        return res.status(400).json({ message: "Academic details are required for students" });
      }

      const updatedUser = await authStorage.upsertUser({
        ...req.user,
        firstName,
        lastName,
        department,
        registerNumber: isStudent ? registerNumber : "",
        section: isStudent ? section : "",
        yearOfGraduation: isStudent ? yearOfGraduation : 0,
        profileImageUrl: profileImageUrl !== undefined ? profileImageUrl : (req.user.profileImageUrl || ""),
        profileCompleted: true,
      } as any);

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
}
