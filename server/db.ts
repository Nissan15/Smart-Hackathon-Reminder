import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("supabase.co") ? { rejectUnauthorized: false } : false,
    // Robust fix for ENETUNREACH by forcing IPv4 
    lookup: (hostname: string, _options: any, callback: (err: any, address: string, family: number) => void) => {
        dns.lookup(hostname, { family: 4 }, callback);
    }
} as any);
export const db = drizzle(pool, { schema });