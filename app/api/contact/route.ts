import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const CONTACT_EMAIL = "slano@lanovin.cz";
const messagesPath = path.join(process.cwd(), "data", "messages.json");

interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  date: string;
}

async function saveMessage(msg: ContactMessage) {
  await mkdir(path.dirname(messagesPath), { recursive: true });
  let messages: ContactMessage[] = [];
  try {
    const raw = await readFile(messagesPath, "utf8");
    messages = JSON.parse(raw);
  } catch {
    // file doesn't exist yet
  }
  messages.push(msg);
  await writeFile(messagesPath, JSON.stringify(messages, null, 2) + "\n", "utf8");
}

async function sendEmail(msg: ContactMessage) {
  const sourceLabel = msg.source === "vykup"
    ? "Ocenění vozu"
    : msg.source === "poptavka"
      ? "Poptávka vozu"
      : "Kontaktní formulář";

  const subject = `[${sourceLabel}] Nová zpráva od ${msg.name}`;
  const text = [
    `Jméno: ${msg.name}`,
    `Email: ${msg.email}`,
    `Telefon: ${msg.phone || "neuvedeno"}`,
    `Zdroj: ${sourceLabel}`,
    "",
    "Zpráva:",
    msg.message,
  ].join("\n");

  // 1) Try Resend first
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resend = new Resend(resendKey);
    const fromAddress = process.env.RESEND_FROM || "Mika Auto Web <onboarding@resend.dev>";
    await resend.emails.send({
      from: fromAddress,
      replyTo: msg.email,
      to: [CONTACT_EMAIL],
      subject,
      text,
    });
    return;
  }

  // 2) Fallback to SMTP / nodemailer
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("[contact] No email provider configured (set RESEND_API_KEY or SMTP_HOST/USER/PASS). Message saved to file only.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Mika Auto Web" <${user}>`,
    replyTo: msg.email,
    to: CONTACT_EMAIL,
    subject,
    text,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const message = String(body.message ?? "").trim();
    const source = String(body.source ?? "contact").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const contactMessage: ContactMessage = {
      name,
      email,
      phone,
      message,
      source,
      date: new Date().toISOString(),
    };

    // Save to file (always) and try to send email
    await saveMessage(contactMessage);
    await sendEmail(contactMessage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
