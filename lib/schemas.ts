import { z } from "zod";

/**
 * Shared validation for client (React Hook Form) and server (Server Actions).
 * Error messages are translation keys under "errors.*".
 */

const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

export const feedbackSchema = z.object({
  name: z.string().trim().min(2, "name").max(80, "name"),
  email: z.email("email"),
  rating: z.number("rating").int().min(1, "rating").max(5, "rating"),
  message: z.string().trim().min(10, "message").max(2000, "message"),
  /** honeypot — must stay empty */
  company: z.string().max(0).optional(),
});
export type FeedbackInput = z.infer<typeof feedbackSchema>;

/** Today's date in Baku as YYYY-MM-DD */
export function bakuToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Baku" }).format(
    new Date(),
  );
}

export const reservationSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date")
    .refine((d) => d >= bakuToday(), "date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "time"),
  guests: z.number("guests").int().min(1, "guests").max(12, "guests"),
  name: z.string().trim().min(2, "name").max(80, "name"),
  phone: z.string().trim().regex(phoneRegex, "phone"),
  note: z.string().trim().max(500).optional(),
  company: z.string().max(0).optional(),
});
export type ReservationInput = z.infer<typeof reservationSchema>;

export type ActionResult =
  { ok: true } | { ok: false; error: "validation" | "server" };

export const PAYMENT_METHODS = ["card", "cash"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Masterclass ticket checkout. Price is never trusted from the client. */
export const bookingSchema = z.object({
  slug: z.string().min(1).max(80),
  quantity: z.number("quantity").int().min(1, "quantity").max(6, "quantity"),
  name: z.string().trim().min(2, "name").max(80, "name"),
  phone: z.string().trim().regex(phoneRegex, "phone"),
  email: z.email("email"),
  payment: z.enum(PAYMENT_METHODS, "payment"),
  note: z.string().trim().max(500).optional(),
  agree: z.literal(true, "agree"),
  /** language of the receipt e-mail / WhatsApp message */
  locale: z.enum(["az", "en", "ru"]),
  company: z.string().max(0).optional(),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export type BookingResult =
  | {
      ok: true;
      code: string;
      total: number;
      /** which receipt channels went out */
      sent: { email: boolean; whatsapp: boolean };
      /** printable receipt (same design as the e-mail) */
      receiptHtml: string;
    }
  | { ok: false; error: "validation" | "server" | "soldOut" | "notFound" };
