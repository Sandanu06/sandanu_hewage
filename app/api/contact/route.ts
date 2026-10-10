import { NextResponse } from "next/server"

export const runtime = "nodejs"

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "")

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const name = clean(body?.name, 100).replace(/[\r\n]+/g, " ")
  const email = clean(body?.email, 200)
  const message = clean(body?.message, 5000)

  // honeypot: real users never fill this
  if (clean(body?.website, 10)) return NextResponse.json({ ok: true })
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please fill in all fields with a valid email." }, { status: 400 })
  }

  const key = process.env.RESEND_API_KEY
  if (!key) return NextResponse.json({ error: "Email is not configured." }, { status: 500 })

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Portfolio <portfolio@teczos.com>",
      to: [process.env.CONTACT_TO ?? "sandanuhewage1@gmail.com"],
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  })

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text())
    return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
