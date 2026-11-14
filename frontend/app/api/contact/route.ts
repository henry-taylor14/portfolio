// app/api/contact/route.ts
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  hp?: string; 
  topic?: string;
};

const TOPICS = ["Hiring", "Project inquiry", "Just saying hi"];

const RATE_LIMIT_WINDOW_MS = 1000 * 60 * 1;
const RATE_LIMIT_MAX = 4; 

const rateMap = new Map<string, number[]>();

function getIpFromReq(req: Request) {
  const xf = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
  if (xf) return xf.split(",")[0].trim();
  return "127.0.0.1";
}

function rateAllowed(ip: string) {
  const now = Date.now();
  const arr = rateMap.get(ip) || [];
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const filtered = arr.filter((t) => t > windowStart);
  filtered.push(now);
  rateMap.set(ip, filtered);
  return filtered.length <= RATE_LIMIT_MAX;
}

function sanitize(str = "") {
  return String(str).trim();
}

// Visitor input goes into an HTML email: escape it so a crafted name can't inject markup.
function esc(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json();

    if (body.hp && body.hp.length > 0) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const name = sanitize(body.name || "No name");
    const email = sanitize(body.email || "No email");
    const message = sanitize(body.message || "");
    const topic = TOPICS.includes(String(body.topic)) ? String(body.topic) : "General";
    if (!message || message.length < 5) {
      return NextResponse.json({ ok: false, error: "Message is too short." }, { status: 400 });
    }

    const ip = getIpFromReq(request);
    if (!rateAllowed(ip)) {
      return NextResponse.json({ ok: false, error: "That's a lot of messages in a minute. Please wait a moment and try again." }, { status: 429 });
    }

    const html = `
      <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111;">
        <h2>New contact message from ${esc(name)}</h2>
        <p><strong>Topic:</strong> ${esc(topic)}</p>
        <p><strong>From:</strong> ${esc(email)}</p>
        <p><strong>IP:</strong> ${ip}</p>
        <hr/>
        <div style="white-space: pre-wrap;">${esc(message)}</div>
        <hr/>
        <small>Sent from herotatech.com contact form</small>
      </div>
    `;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM = process.env.RESEND_FROM_EMAIL;  
    const TO = process.env.CONTACT_NOTIFY_EMAIL || FROM;

    if (!RESEND_API_KEY || !FROM || !TO) {
      console.error("Missing Resend env vars");
      return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });
    }

    const payload = {
      from: FROM,
      to: [TO],
      subject: `[${topic}] New contact form: ${name.replace(/[\r\n]+/g, " ").slice(0, 80)}`,
      html,
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Resend error:", res.status, text);
      return NextResponse.json({ ok: false, error: "Failed to send email" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact handler error:", err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
