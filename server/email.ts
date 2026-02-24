import nodemailer from "nodemailer";

// Simple email layout template
const getEmailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 20px; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 60px 40px; text-align: center; }
    .content { padding: 40px; }
    .footer { background: #f1f5f9; padding: 30px; text-align: center; font-size: 13px; color: #64748b; }
    .badge { background: #e0e7ff; color: #4338ca; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; margin-bottom: 16px; }
    .button { background: #4f46e5; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: bold; margin-top: 24px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2); }
    h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; }
    h2 { font-size: 22px; font-weight: 700; color: #1e293b; margin-top: 0; }
    p { margin-bottom: 16px; color: #475569; }
    strong { color: #1e293b; }
    .divider { height: 1px; background: #e2e8f0; margin: 32px 0; }
  </style>
</head>
<body>
  <div class="container" style="box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
    <div class="header">
      <div style="font-size: 40px; margin-bottom: 20px;">🚀</div>
      <h1>Smart<span style="opacity: 0.8;">Hack</span></h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 8px; margin-bottom: 0; font-weight: 500;">Innovate. Build. Win.</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p style="margin-bottom: 8px;">Sent by <strong>SmartHack Platform</strong></p>
      <div style="margin: 16px 0; font-size: 11px; opacity: 0.6;">
        University Management System for Hackathons
      </div>
      © 2024 SmartHack. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

// Configure the transporter lazily to pick up .env changes
function getTransporter() {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "");
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465");
  const secure = process.env.SMTP_SECURE === "true";

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false
    }
  });
}

export async function sendEmail(to: string, subject: string, contentHtml: string) {
  try {
    const user = process.env.SMTP_USER?.trim();
    // Aggressively strip ALL spaces from the password (including middle ones)
    const pass = process.env.SMTP_PASS?.replace(/\s/g, "");

    // If no SMTP_USER is set, we log to console
    if (!user || user === "YOUR_EMAIL_HERE" || user === "" || !pass) {
      console.log("------------------- MOCK EMAIL (Missing Credentials) -------------------");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log("-------------------------------------------------------------------------");
      return false;
    }

    console.log(`[EmailService] Attempting to send to ${to}`);
    console.log(`[EmailService] Account: ${user} | Pass Length: ${pass.length}`);

    const transporter = getTransporter();

    console.log(`[EmailService] SMTP Debug: Host=${process.env.SMTP_HOST || 'smtp.gmail.com'}, Port=${process.env.SMTP_PORT || '465'}, Secure=${process.env.SMTP_SECURE || 'true'}`);
    console.log(`[EmailService] Attempting to send to ${to}...`);

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"SmartHack" <${user}>`,
      to,
      subject,
      html: getEmailTemplate(contentHtml),
    });

    console.log(`[EmailService] SUCCESS! Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[EmailService] ERROR DETAILS:");
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
      if ((error as any).code === 'EAUTH') {
        console.error("- Step: Authentication Failed.");
        console.error("- Action: Double-check your 16-character App Password in .env.");
      }
    } else {
      console.error(error);
    }
    return false;
  }
}
