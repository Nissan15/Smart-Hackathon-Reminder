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
        dns.lookup(hostname, { family: 4 }, (err, address, family) => {
            if (err && hostname.includes("supabase.co")) {
                console.error(`[DB ERROR] IPv4 lookup failed for ${hostname}.`);
                console.error(`[TIP] New Supabase projects are often IPv6 only. Render does NOT support IPv6.`);
                console.error(`[ACTION] Update your DATABASE_URL to use the Supavisor Pooler (use PORT 6543 instead of 5432).`);
            }
            callback(err, address, family);
        });
    }
} as any);
export const db = drizzle(pool, { schema });