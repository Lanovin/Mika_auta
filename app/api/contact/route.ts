import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import path from "node:path";
import { readStoredJson, writeStoredJson } from "@/src/lib/server-storage";

const FALLBACK_CONTACT_EMAIL = "slano@lanovin.cz";
const RESEND_ONBOARDING_FROM = "Mika Auto Web <onboarding@resend.dev>";
const messagesPath = path.join(process.cwd(), "data", "messages.json");

interface ContactMessage {
  name: string;
  email?: string;
  phone: string;
  message: string;
  source: string;
  date: string;
}

function getSourceLabel(source: string) {
  return source === "vykup"
    ? "Oceneni vozu"
    : source === "poptavka"
      ? "Poptavka vozu"
      : "Kontaktni formular";
}

function isStoragePermissionError(error: unknown) {
  return typeof error === "object"
    && error !== null
    && "code" in error
    && (
      error.code === "EROFS"
      || error.code === "EACCES"
      || error.code === "EPERM"
    );
}

async function saveMessage(msg: ContactMessage) {
  try {
    const messages = await readStoredJson<ContactMessage[]>({
      storeKey: "messages",
      filePath: messagesPath,
      defaultValue: [],
    });

    messages.push(msg);

    await writeStoredJson({
      storeKey: "messages",
      filePath: messagesPath,
      data: messages,
    });
  } catch (error) {
    if (isStoragePermissionError(error)) {
      console.warn("[contact] Message storage is read-only in this environment, skipping local persistence.");
      return;
    }

    console.warn("[contact] Failed to persist message, continuing with email delivery.", error);
  }
}

function isResendSenderError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("domain is not verified")
    || normalized.includes("add and verify your domain")
    || normalized.includes("testing emails")
    || normalized.includes("verify a domain");
}

async function sendWithResend(
  resend: Resend,
  from: string,
  msg: ContactMessage,
  contactEmail: string,
  subject: string,
  text: string,
) {
  const { error } = await resend.emails.send({
    from,
    ...(msg.email ? { replyTo: msg.email } : {}),
    to: [contactEmail],
    subject,
    text,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email with Resend.");
  }
}

async function sendEmail(msg: ContactMessage) {
  const contactEmail = process.env.KONTAKT_EMAIL || process.env.CONTACT_EMAIL || FALLBACK_CONTACT_EMAIL;
  const sourceLabel = getSourceLabel(msg.source);

  const subject = `[${sourceLabel}] Nová zpráva od ${msg.name}`;
  const text = [
    `Jméno: ${msg.name}`,
    `Email: ${msg.email || "neuvedeno"}`,
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
    const configuredFrom = process.env.RESEND_FROM?.trim();
    const fromAddress = configuredFrom || RESEND_ONBOARDING_FROM;

    try {
      await sendWithResend(resend, fromAddress, msg, contactEmail, subject, text);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const shouldRetryWithOnboarding = Boolean(
        configuredFrom
        && configuredFrom !== RESEND_ONBOARDING_FROM
        && isResendSenderError(message)
      );

      if (!shouldRetryWithOnboarding) {
        throw error;
      }

      console.warn("[contact] Custom RESEND_FROM is not verified yet, retrying with onboarding sender.");
      await sendWithResend(resend, RESEND_ONBOARDING_FROM, msg, contactEmail, subject, text);
    }

    return;
  }

  // 2) Fallback to SMTP / nodemailer
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("[contact] No email provider configured (set RESEND_API_KEY or SMTP_HOST/USER/PASS). Message delivery skipped after best-effort persistence.");
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
    ...(msg.email ? { replyTo: msg.email } : {}),
    to: contactEmail,
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

    if (!name || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Provide at least an email or phone number" },
        { status: 400 }
      );
    }

    // Basic email format validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const contactMessage: ContactMessage = {
      name,
      phone,
      message,
      source,
      date: new Date().toISOString(),
      ...(email ? { email } : {}),
    };

    // Save the message when storage is available and continue with email delivery.
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
