"use server";

import { randomUUID } from "node:crypto";
import { Resend } from "resend";
import { getMasterclass } from "@/data/masterclasses";
import { receiptEmail, sendReceipts, type Receipt } from "@/lib/receipt";
import {
  bakuToday,
  bookingSchema,
  type BookingInput,
  type BookingResult,
  feedbackSchema,
  reservationSchema,
  type ActionResult,
  type FeedbackInput,
  type ReservationInput,
} from "@/lib/schemas";

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

/**
 * Sends an email via Resend when RESEND_API_KEY + CONTACT_EMAIL_TO are set.
 * Otherwise logs to the server console (handy in development).
 */
async function deliver(
  subject: string,
  rows: [string, string][],
  replyTo?: string,
) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from =
    process.env.CONTACT_EMAIL_FROM ?? "The Kaffe <onboarding@resend.dev>";

  if (!key || !to) {
    console.info(`[form] ${subject}`, Object.fromEntries(rows));
    return;
  }

  const html = `<h2 style="font-family:Georgia,serif">${escape(subject)}</h2><table cellpadding="6">${rows
    .map(
      ([k, v]) =>
        `<tr><td><b>${escape(k)}</b></td><td>${escape(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")}</table>`;

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    replyTo,
  });
  if (error) throw new Error(error.message);
}

export async function submitFeedback(
  input: FeedbackInput,
): Promise<ActionResult> {
  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success || parsed.data.company)
    return { ok: false, error: "validation" };
  const d = parsed.data;
  try {
    await deliver(
      `Feedback ★${d.rating} — ${d.name}`,
      [
        ["Name", d.name],
        ["Email", d.email],
        ["Rating", "★".repeat(d.rating)],
        ["Message", d.message],
      ],
      d.email,
    );
    return { ok: true };
  } catch (e) {
    console.error("[feedback]", e);
    return { ok: false, error: "server" };
  }
}

/**
 * Masterclass ticket order. The total is computed here from data/masterclasses
 * (never trusted from the browser). Online card payment needs a merchant
 * account with a payment provider; until one is connected, card orders are
 * recorded and the café sends a payment link manually.
 */
export async function submitBooking(
  input: BookingInput,
): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success || parsed.data.company)
    return { ok: false, error: "validation" };
  const d = parsed.data;

  const mc = getMasterclass(d.slug);
  if (!mc || mc.date < bakuToday()) return { ok: false, error: "notFound" };
  if (d.quantity > mc.seatsLeft) return { ok: false, error: "soldOut" };

  const total = mc.price * d.quantity;
  const code = `TK-${randomUUID().slice(0, 6).toUpperCase()}`;

  try {
    await deliver(
      `Masterclass ${code} — ${mc.title.az} · ${d.quantity} × ${mc.price} AZN`,
      [
        ["Order", code],
        ["Masterclass", mc.title.az],
        ["Date", `${mc.date} ${mc.start}–${mc.end}`],
        ["Tickets", String(d.quantity)],
        ["Total", `${total} AZN`],
        [
          "Payment",
          d.payment === "card" ? "Card online (send link)" : "At the café",
        ],
        ["Name", d.name],
        ["Phone", d.phone],
        ["Email", d.email],
        ["Note", d.note || "—"],
      ],
      d.email,
    );
  } catch (e) {
    console.error("[booking]", e);
    return { ok: false, error: "server" };
  }

  // Receipt to the guest (e-mail + WhatsApp). Card orders stay "pending"
  // until a payment provider confirms them (see lib/receipt.ts).
  const receipt: Receipt = {
    code,
    mc,
    quantity: d.quantity,
    total,
    payment: d.payment,
    status: d.payment === "card" ? "pending" : "atVenue",
    name: d.name,
    phone: d.phone,
    email: d.email,
    locale: d.locale,
    createdAt: new Date(),
  };
  const sent = await sendReceipts(receipt);
  return {
    ok: true,
    code,
    total,
    sent,
    receiptHtml: receiptEmail(receipt).html,
  };
}

export async function submitReservation(
  input: ReservationInput,
): Promise<ActionResult> {
  const parsed = reservationSchema.safeParse(input);
  if (!parsed.success || parsed.data.company)
    return { ok: false, error: "validation" };
  const d = parsed.data;
  try {
    await deliver(`Reservation — ${d.date} ${d.time} · ${d.guests} guests`, [
      ["Name", d.name],
      ["Phone", d.phone],
      ["Date", d.date],
      ["Time", d.time],
      ["Guests", String(d.guests)],
      ["Note", d.note || "—"],
    ]);
    return { ok: true };
  } catch (e) {
    console.error("[reservation]", e);
    return { ok: false, error: "server" };
  }
}
