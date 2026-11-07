import { Resend } from "resend";
import type { Masterclass } from "@/data/masterclasses";
import { info } from "@/data/info";
import { formatDate, formatPrice, parseIsoDate } from "@/lib/format";
import { t as tr } from "@/lib/i18n-data";
import type { PaymentMethod } from "@/lib/schemas";
import { calendarUrl } from "@/lib/masterclass";

/**
 * Customer receipts for masterclass tickets — sent by e-mail (Resend) and
 * WhatsApp (Meta WhatsApp Business Cloud API). Each channel is optional:
 * without its env vars it is skipped and the receipt is logged instead.
 *
 * When an online payment provider is connected, call `sendReceipts` again
 * from its "payment succeeded" webhook with `status: "paid"`.
 */

export type ReceiptStatus = "paid" | "pending" | "atVenue";

export type Receipt = {
  code: string;
  mc: Masterclass;
  quantity: number;
  total: number;
  payment: PaymentMethod;
  status: ReceiptStatus;
  name: string;
  phone: string;
  email: string;
  locale: "az" | "en" | "ru";
  createdAt: Date;
};

const STR = {
  az: {
    subject: "Biletiniz: {title} — {code}",
    hello: "Salam, {name}!",
    intro: "Masterklas biletiniz rezerv olundu. Qəbziniz aşağıdadır.",
    receipt: "Qəbz",
    order: "Sifariş kodu",
    masterclass: "Masterklas",
    date: "Tarix",
    time: "Vaxt",
    tickets: "Bilet",
    total: "Cəmi",
    payment: "Ödəniş",
    status: {
      paid: "Ödənilib ✓",
      pending: "Ödəniş gözlənilir — link göndəriləcək",
      atVenue: "Kafedə ödəniləcək",
    },
    method: { card: "Kartla onlayn", cash: "Kafedə" },
    where: "Məkan",
    maps: "Google Maps-də aç",
    directions: "Yol tarifi",
    calendar: "Təqvimə əlavə et",
    call: "Zəng et",
    policy:
      "Masterklasdan 48 saat əvvələdək pulsuz ləğv edə bilərsiniz. Girişdə sifariş kodunu göstərin.",
    issued: "Verilib",
    bye: "Görüşənədək! ☕",
  },
  en: {
    subject: "Your ticket: {title} — {code}",
    hello: "Hi {name}!",
    intro: "Your masterclass ticket is reserved. Here is your receipt.",
    receipt: "Receipt",
    order: "Order code",
    masterclass: "Masterclass",
    date: "Date",
    time: "Time",
    tickets: "Tickets",
    total: "Total",
    payment: "Payment",
    status: {
      paid: "Paid ✓",
      pending: "Payment pending — link on its way",
      atVenue: "To be paid at the café",
    },
    method: { card: "Card online", cash: "At the café" },
    where: "Venue",
    maps: "Open in Google Maps",
    directions: "Directions",
    calendar: "Add to calendar",
    call: "Call us",
    policy:
      "Free cancellation up to 48 hours before the class. Show your order code at the door.",
    issued: "Issued",
    bye: "See you soon! ☕",
  },
  ru: {
    subject: "Ваш билет: {title} — {code}",
    hello: "Здравствуйте, {name}!",
    intro: "Ваш билет на мастер-класс забронирован. Ниже — ваш чек.",
    receipt: "Чек",
    order: "Код заказа",
    masterclass: "Мастер-класс",
    date: "Дата",
    time: "Время",
    tickets: "Билеты",
    total: "Итого",
    payment: "Оплата",
    status: {
      paid: "Оплачено ✓",
      pending: "Ожидает оплаты — ссылка придёт",
      atVenue: "Оплата в кафе",
    },
    method: { card: "Картой онлайн", cash: "В кафе" },
    where: "Место",
    maps: "Открыть в Google Maps",
    directions: "Маршрут",
    calendar: "Добавить в календарь",
    call: "Позвонить",
    policy:
      "Бесплатная отмена за 48 часов до мастер-класса. Покажите код заказа на входе.",
    issued: "Выдан",
    bye: "До встречи! ☕",
  },
} as const;

const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

function facts(r: Receipt) {
  const s = STR[r.locale];
  const address = `${info.fullName}, ${tr(info.address.street, r.locale)}, ${tr(info.address.city, r.locale)}`;
  return {
    s,
    title: tr(r.mc.title, r.locale),
    date: formatDate(parseIsoDate(r.mc.date), r.locale, { weekday: true }),
    time: `${r.mc.start}–${r.mc.end}`,
    line: `${r.quantity} × ${formatPrice(r.mc.price, r.locale)}`,
    total: formatPrice(r.total, r.locale),
    status: s.status[r.status],
    address,
    area: tr(info.address.area, r.locale),
  };
}

/* ------------------------------------------------------------------ e-mail */

export function receiptEmail(r: Receipt) {
  const f = facts(r);
  const { s } = f;
  const row = (k: string, v: string, strong = false) =>
    `<tr><td style="padding:8px 0;color:#59615b;font-size:14px">${esc(k)}</td><td style="padding:8px 0;text-align:right;font-size:14px;${strong ? "font-weight:800;font-size:18px;color:#1b201d" : "color:#1b201d;font-weight:600"}">${esc(v)}</td></tr>`;
  const btn = (href: string, label: string, primary = false) =>
    `<a href="${esc(href)}" style="display:inline-block;margin:4px 6px 4px 0;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:700;font-size:14px;${primary ? "background:#2c4236;color:#fbf9f4" : "border:2px solid #2c4236;color:#2c4236"}">${esc(label)}</a>`;
  const statusColor = r.status === "paid" ? "#2c4236" : "#9c6b35";

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(`${info.fullName} — ${s.receipt} ${r.code}`)}</title><style>@page{size:A4;margin:12mm}@media print{body{background:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.outer{padding:0!important;background:#fff!important}}</style></head><body style="margin:0;background:#f5f1e8;font-family:Manrope,Segoe UI,Arial,sans-serif;color:#1b201d">
<table role="presentation" class="outer" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1e8;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden">
  <tr><td style="background:#2c4236;padding:28px 28px 24px;color:#fbf9f4">
    <div style="font-size:20px;font-weight:800">${esc(info.fullName)}</div>
    <div style="font-family:Georgia,serif;font-style:italic;color:#d6a066;font-size:15px;margin-top:4px">${esc(info.slogan)}</div>
  </td></tr>
  <tr><td style="padding:28px">
    <p style="margin:0 0 6px;font-size:18px;font-weight:700">${esc(fill(s.hello, { name: r.name }))}</p>
    <p style="margin:0 0 22px;color:#59615b">${esc(s.intro)}</p>

    <div style="border:2px dashed #d9cfbb;border-radius:18px;padding:18px 20px">
      <div style="display:flex;justify-content:space-between;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#59615b">${esc(s.receipt)}</div>
      <div style="font-size:26px;font-weight:800;letter-spacing:.06em;margin:4px 0 2px">${esc(r.code)}</div>
      <div style="font-size:13px;font-weight:700;color:${statusColor}">${esc(f.status)}</div>
      <table role="presentation" width="100%" style="margin-top:14px;border-top:1px solid #ebe4d5">
        ${row(s.masterclass, f.title)}
        ${row(s.date, f.date)}
        ${row(s.time, f.time)}
        ${row(s.tickets, f.line)}
        ${row(s.payment, s.method[r.payment])}
        ${row(s.total, f.total, true)}
      </table>
    </div>

    <h3 style="margin:26px 0 6px;font-size:15px">📍 ${esc(s.where)}</h3>
    <p style="margin:0 0 10px;color:#1b201d">${esc(f.address)}<br><span style="color:#59615b;font-size:13px">${esc(f.area)}</span></p>
    <div>
      ${btn(info.links.googleMaps, s.maps, true)}
      ${btn(info.links.directions, s.directions)}
      ${btn(calendarUrl(r.mc, r.locale), s.calendar)}
      ${info.phone ? btn(`tel:${info.phone.replace(/\s/g, "")}`, `${s.call} ${info.phone}`) : ""}
    </div>

    <p style="margin:24px 0 0;font-size:13px;color:#59615b">${esc(s.policy)}</p>
    <p style="margin:18px 0 0;font-weight:700">${esc(s.bye)}</p>
  </td></tr>
  <tr><td style="padding:16px 28px;background:#fbf9f4;font-size:12px;color:#59615b">
    ${esc(s.issued)}: ${esc(r.createdAt.toISOString().slice(0, 16).replace("T", " "))} UTC · ${esc(info.fullName)} · ${esc(f.address)}${info.phone ? ` · ${esc(info.phone)}` : ""} · <a href="${esc(info.social.instagram)}" style="color:#9c6b35">@${esc(info.instagramHandle)}</a>
  </td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    fill(s.hello, { name: r.name }),
    s.intro,
    "",
    `${s.order}: ${r.code} (${f.status})`,
    `${s.masterclass}: ${f.title}`,
    `${s.date}: ${f.date}, ${f.time}`,
    `${s.tickets}: ${f.line}`,
    `${s.total}: ${f.total}`,
    "",
    `${s.where}: ${f.address}`,
    `${s.maps}: ${info.links.googleMaps}`,
    `${s.calendar}: ${calendarUrl(r.mc, r.locale)}`,
    info.phone ? `${s.call}: ${info.phone}` : "",
    "",
    s.policy,
  ].join("\n");

  return {
    subject: fill(s.subject, { title: f.title, code: r.code }),
    html,
    text,
  };
}

/** true = sent, false = channel not configured (only logged) */
async function sendEmail(r: Receipt): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from =
    process.env.CONTACT_EMAIL_FROM ?? "The Kaffe <onboarding@resend.dev>";
  const mail = receiptEmail(r);
  if (!key) {
    console.info(`[receipt:email] would send to ${r.email}: ${mail.subject}`);
    return false;
  }
  const { error } = await new Resend(key).emails.send({
    from,
    to: r.email,
    // the café keeps a copy of every receipt
    bcc: process.env.CONTACT_EMAIL_TO || undefined,
    replyTo: process.env.CONTACT_EMAIL_TO || undefined,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });
  if (error) throw new Error(error.message);
  return true;
}

/* ---------------------------------------------------------------- WhatsApp */

/** "+994 (50) 123-45-67" / "050 123 45 67" -> "994501234567" */
export function toWhatsAppNumber(phone: string) {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0") && d.length === 10) d = `994${d.slice(1)}`;
  if (d.length === 9) d = `994${d}`;
  return d;
}

/**
 * Business-initiated WhatsApp messages must use a template approved in
 * Meta Business Manager. Create a template (category "Utility") whose body
 * has 7 variables, e.g.:
 *
 *   Salam {{1}}! Biletiniz təsdiqləndi ✅
 *   Sifariş: {{2}}
 *   Masterklas: {{3}}
 *   Tarix: {{4}}
 *   Cəmi: {{5}} ({{6}})
 *   📍 {{7}}
 *
 * and put its name in WHATSAPP_TEMPLATE (one template per language; the
 * language code comes from the receipt locale: az / en / ru).
 */
async function sendWhatsApp(r: Receipt): Promise<boolean> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const template = process.env.WHATSAPP_TEMPLATE;
  const to = toWhatsAppNumber(r.phone);
  const f = facts(r);

  if (!token || !phoneId || !template) {
    console.info(`[receipt:whatsapp] would send to +${to}: ${r.code}`);
    return false;
  }

  const params = [
    r.name,
    r.code,
    f.title,
    `${f.date}, ${f.time}`,
    f.total,
    f.status,
    `${f.address} — ${info.links.googleMaps}`,
  ].map((text) => ({ type: "text", text }));

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${phoneId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: r.locale },
          components: [{ type: "body", parameters: params }],
        },
      }),
    },
  );
  if (!res.ok) throw new Error(`WhatsApp ${res.status}: ${await res.text()}`);
  return true;
}

/**
 * Send the receipt on every configured channel. A failing channel is logged
 * but never cancels the booking (the café also gets a copy by e-mail).
 */
export async function sendReceipts(r: Receipt) {
  const results = await Promise.allSettled([sendEmail(r), sendWhatsApp(r)]);
  const [email, whatsapp] = results.map(
    (x) => x.status === "fulfilled" && x.value,
  );
  results.forEach((x, i) => {
    if (x.status === "rejected")
      console.error(`[receipt:${i ? "whatsapp" : "email"}]`, x.reason);
  });
  return { email, whatsapp };
}
