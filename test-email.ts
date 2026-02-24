import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";

// Load .env explicitly
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function testEmail() {
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.replace(/\s/g, "");
    const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "587");
    const secure = process.env.SMTP_SECURE === "true";

    console.log("--- SMTP DIAGNOSTICS ---");
    console.log(`User: ${user}`);
    console.log(`Pass Length: ${pass?.length || 0}`);
    console.log(`Host: ${host}`);
    console.log(`Port: ${port}`);
    console.log(`Secure: ${secure}`);
    console.log("-----------------------");

    if (!user || !pass) {
        console.error("Error: SMTP_USER or SMTP_PASS is missing in .env");
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
    });

    try {
        console.log("Verifying connection...");
        await transporter.verify();
        console.log("Connection verified successfully!");

        console.log("Sending test email...");
        const info = await transporter.sendMail({
            from: `"SmartHack Test" <${user}>`,
            to: user, // Send to yourself
            subject: "SMTP configuration test",
            text: "If you received this, your SMTP settings are correct.",
        });

        console.log(`Message sent: ${info.messageId}`);
        console.log("SUCCESS!");
    } catch (error) {
        console.error("FAILED to send email:");
        console.error(error);
    }
}

testEmail();
