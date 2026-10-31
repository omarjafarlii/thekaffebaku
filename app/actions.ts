"use server";

import { Resend } from "resend";
import {
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
