import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const name = str(body.name, 100);
  const email = str(body.email, 200);
  const phone = str(body.phone, 40);
  const message = str(body.message, 4000);
  const type = ["safari", "stay", "both"].includes(String(body.type)) ? String(body.type) : "both";
  const date = str(body.date, 20);
  const guests = str(body.guests, 5);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide your name, a valid email and a message." }, { status: 400 });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error("[contact] Resend env vars are not configured.");
    return NextResponse.json({ error: "Email is not configured yet. Please contact us on WhatsApp." }, { status: 503 });
  }

  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: CONTACT_FROM_EMAIL,
    to: CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `${type === "stay" ? "Stay" : type === "safari" ? "Safari" : "Stay + safari"} enquiry from ${name.replace(/[\r\n]+/g, " ")}`,
    html: `<h2>New enquiry (${esc(type)})</h2>
      <p><b>Name:</b> ${esc(name)}</p>
      <p><b>Email:</b> ${esc(email)}</p>
      <p><b>Phone:</b> ${esc(phone) || "-"}</p>
      <p><b>Preferred date:</b> ${esc(date) || "-"} &nbsp; <b>Guests:</b> ${esc(guests) || "-"}</p>
      <p><b>Message:</b></p><p>${esc(message).replace(/\n/g, "<br>")}</p>`,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json({ error: "Could not send your message. Please try WhatsApp." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
