import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL")
  }
  return createClient(url, key)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { event_id, name, amount, message, payment_method, turnstile_token, guests_self, guests_spouse, guests_child_under12, guests_child_over12, guests_other } = body

  // Validate turnstile token
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
  if (!turnstile_token || !turnstileSecret) {
    return NextResponse.json({ error: "CAPTCHA verification required." }, { status: 400 })
  }

  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: turnstileSecret,
      response: turnstile_token,
    }),
  })

  const verifyData = await verifyRes.json()
  if (!verifyData.success) {
    return NextResponse.json({ error: "CAPTCHA verification failed." }, { status: 403 })
  }

  // Validate inputs server-side
  if (!name || typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
    return NextResponse.json({ error: "Invalid name." }, { status: 400 })
  }
  if (typeof amount !== "number" || amount <= 0 || amount > 10_000_000) {
    return NextResponse.json({ error: "Invalid amount." }, { status: 400 })
  }
  if (message && (typeof message !== "string" || message.length > 500)) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 })
  }

  const validMethods = ["bkash", "nagad", "cash", "bank_transfer", "other"]
  if (!validMethods.includes(payment_method)) {
    return NextResponse.json({ error: "Invalid payment method." }, { status: 400 })
  }

  // Validate guest fields (optional, default 0)
  const guestFields = { guests_self, guests_spouse, guests_child_under12, guests_child_over12, guests_other }
  for (const [key, val] of Object.entries(guestFields)) {
    if (val !== undefined && val !== null) {
      if (typeof val !== "number" || val < 0 || val > 10000 || !Number.isInteger(val)) {
        return NextResponse.json({ error: `Invalid ${key}.` }, { status: 400 })
      }
    }
  }

  // Insert contribution
  const supabaseAdmin = getSupabaseAdmin()
  const { error } = await supabaseAdmin
    .from("contributions")
    .insert({
      event_id,
      name: name.trim(),
      amount,
      message: message ?? "",
      payment_method,
      payment_status: "pending",
      guests_self: guests_self ?? 0,
      guests_spouse: guests_spouse ?? 0,
      guests_child_under12: guests_child_under12 ?? 0,
      guests_child_over12: guests_child_over12 ?? 0,
      guests_other: guests_other ?? 0,
    })

  if (error) {
    return NextResponse.json({ error: "Failed to save contribution." }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
