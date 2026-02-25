# SmartHack: Smart Hackathon Management System

SmartHack is a modern, full-stack platform designed to streamline the organization of hackathons and improve student engagement. It features distinct workflows for Students and Administrators, providing a seamless experience from onboarding to registration analytics.

## 🚀 Project Overview

The platform serves as a central hub for university hackathons, allowing admins to manage events and users while providing students with a clear roadmap to discover and participate in competitive programming events.

### Key Features

#### For Students
- **Mandatory Profile Onboarding**: Clean, structured first-time setup for personal and academic details.
- **Academic Profile Management**: View and update First Name, Last Name, Department, and Register Number at any time.
- **Detailed Event Discovery**: Full event descriptions and guidelines to analyze before committing.
- **Instant Registration**: One-click registration for upcoming hackathons.
- **Dashboard Trackers**: Keep track of upcoming deadlines and active participation.

#### For Administrators
- **Comprehensive Analytics**: Track hackathon performance with metrics for **Views (Interest)**, **Registered (Conversion)**, and **Not Registered (Potential)**.
- **User Management Directory**: Real-time updated list of all registered platform users with profile details.
- **Secure Controls**: Ability to promote users to Admin or safely delete accounts with data cleanup (Cascade Deletion).
- **Event Creation & Editing**: Management suite for creating, updating, or removing hackathons.

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Shancn UI, Framer Motion.
- **Backend**: Express.js, TypeScript.
- **Database**: PostgreSQL with Drizzle ORM.
- **Authentication**: Secure Session-based authentication with Replit/Passport integration.
- **Analytics**: Custom-built tracking engine for user engagement.

## 🔑 Steps to Access the Website

### Prerequisites
- Node.js (v18 or higher)
- A running PostgreSQL database (or configured environment variables)

### Installation & Startup
1. **Navigate to the Project Directory**:
   ```powershell
   cd Asset-Manager-1
   ```
2. **Install Dependencies**:
   ```powershell
   npm install
   ```
3. **Configure Environment**:
   Ensure your `.env` file is set up with valid database credentials.
4. **Push Database Schema**:
   ```powershell
   npm run db:push
   ```
5. **Start the Development Server**:
   ```powershell
   npm run dev
   ```
   The website will typically be available at `http://localhost:5173` or as provided in the terminal output.

## 🚪 Login Instructions

### Student Login
1. Click **"Get Started"** or **"Sign Up"** on the landing page.
2. Register with your Email and Password.
3. Upon first login, you will be automatically redirected to the **Profile Completion** page.
4. Fill in your **Department** and **Register Number** to access the full platform.

### Administrator Login (Default Admin)
- **Email**: `admin@example.com`
- **Password**: `admin123`
*(Note: These credentials are seeded automatically on the first run for testing purposes. It is recommended to change the password from the profile page after the first login.)*

## 📁 Project Structure

```text
├── client/              # React frontend source code
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React Query hooks
│   │   └── pages/       # Application views (Dashboard, Analytics, Profile, etc.)
├── server/              # Express backend source code
│   ├── routes.ts        # API endpoint definitions
│   ├── storage.ts       # Database interaction logic
│   └── index.ts         # Server entry point
├── shared/              # Shared TypeScript types and Zod schemas
│   ├── schema.ts        # Database table definitions
└── package.json         # Project dependencies and scripts
```

## 🌐 Deployment (Vercel)

This project is configured for easy deployment on **Vercel**.

### Steps to Deploy

1. **Connect your Repository**: Push your code to GitHub/GitLab/Bitbucket.
2. **Create a New Project on Vercel**: Import the repository.
3. **Configure Environment Variables**: Add the following variables in the Vercel Dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `SESSION_SECRET`: A long random string for session encryption.
   - `SMTP_USER`, `SMTP_PASS`, etc.: For email notifications.
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: For Google OAuth.
4. **Build & Deploy**: Vercel will automatically detect the `vercel.json` and use the defined build command.

### Local Vercel Testing
If you have the Vercel CLI installed, you can test the deployment locally:
```powershell
npx vercel dev
```
