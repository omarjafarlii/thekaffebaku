# The Kaffe — Bakı · veb sayt

> **Coffee. Brunch. Sweet Moments.** — İçərişəhər, Bakı ([@thekaffe.baku](https://www.instagram.com/thekaffe.baku/))

Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Framer Motion (`motion`) · next-intl (az / en / ru) · next-themes · React Hook Form + Zod · Server Actions + Resend.

---

## 1. Quraşdırma və işə salma

```bash
npm install
cp .env.example .env.local   # dəyişənləri doldurun (aşağıya baxın)
npm run dev                  # http://localhost:3000  → /az-a yönləndirir
```

| Əmr              | Nə edir                                   |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | İnkişaf serveri                           |
| `npm run build`  | Production build                          |
| `npm run start`  | Build-i işə salır                         |
| `npm run lint`   | ESLint                                    |
| `npm run format` | Prettier + Tailwind class sıralaması      |

Node.js 20.9+ tələb olunur.

## 2. `.env` dəyişənləri

| Dəyişən                           | Məcburi? | Təsvir                                                                                        |
| --------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`            | Bəli (prod) | Saytın son domeni, məs. `https://thekaffe.az`. Metadata, sitemap, OG üçün.                  |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Xeyr     | Brend rənglərində stilizə edilmiş Google Maps. Yoxdursa, açarsız rənglənmiş embed istifadə olunur. Açarı domeninizlə məhdudlaşdırın (HTTP referrer). |
| `RESEND_API_KEY`                  | Xeyr     | Rəy və rezervasiya formalarının e-poçtla göndərilməsi ([resend.com](https://resend.com)).     |
| `CONTACT_EMAIL_TO`                | Xeyr     | Formaların gələcəyi e-poçt ünvanı.                                                            |
| `CONTACT_EMAIL_FROM`              | Xeyr     | Resend-də təsdiqlənmiş göndərici, məs. `The Kaffe <hello@thekaffe.az>`.                       |

Resend açarı yoxdursa, formalar işləyir, amma göndərişlər yalnız server loguna yazılır.

## 3. Vercel-ə deploy

1. Layihəni GitHub-a yükləyin (`git add . && git commit -m "init" && git push`).
2. [vercel.com/new](https://vercel.com/new) → repozitoriyanı seçin (Framework: Next.js avtomatik tanınır).
3. **Environment Variables** bölməsinə yuxarıdakı dəyişənləri əlavə edin.
4. **Deploy**. Sonra **Settings → Domains**-dən domeni bağlayın və `NEXT_PUBLIC_SITE_URL`-i yeniləyin.

## 4. Məzmunu redaktə etmək (kod bilmədən)

Bütün məzmun `data/` qovluğundadır. Hər faylın başında izah var.

| Fayl               | Nə saxlayır                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| `data/info.ts`     | Ünvan, telefon, WhatsApp, e-poçt, iş saatları, reytinqlər, sosial şəbəkələr |
| `data/menu.ts`     | Menyu: ad, təsvir, qiymət (AZN), ölçülər, tərkib, nişanlar, şəkil           |
| `data/reviews.ts`  | Müştəri rəyləri (ad, ulduz, tarix, mətn, mənbə)                             |
| `data/media.ts`    | Bütün fotolar (Instagram və Google Maps-dən)                                |
| `data/brand.ts`    | Orijinal loqo fayllarının yolları                                           |
| `messages/*.json`  | Bütün interfeys mətnləri (az / en / ru)                                     |

`null` olan hər dəyər saytda aydın placeholder kimi görünür (`[TELEFON]`, `[QİYMƏT]`, `[FOTO]` …). Real dəyəri yazan kimi placeholder yox olur.

**Fotolar:** faylı `public/media/` qovluğuna qoyun (məs. `public/media/tiramisu.jpg`) və müvafiq `src` / `image` sahəsinə `"/media/tiramisu.jpg"` yazın.

**Loqo:** hazırda Instagram profil şəkli (150×150 px) istifadə olunur — yalnız kiçik ölçüdə. Orijinal vektor loqonu `public/brand/logo.svg` kimi qoyun və `data/brand.ts`-də `logoSvg` yolunu yazın.

## 5. Dizayn sistemi

### Rəng palitrası (`app/globals.css` → `@theme`)

Rənglər orijinal brenddən götürülüb: Instagram loqosunun fonu, krem hərflər, kafenin divarları və taxta.

| Token          | HEX       | Rol                                             |
| -------------- | --------- | ----------------------------------------------- |
| `forest-800`   | `#2C4236` | **Əsas brend rəngi** (loqo fonu), düymələr, footer |
| `forest-900`   | `#1D2C24` | Dark rejim səthi                                |
| `forest-950`   | `#141F19` | Dark rejim fonu                                 |
| `forest-100`   | `#E6ECE4` | Açıq yaşıl fon, nişanlar                        |
| `cream-100`    | `#F5F1E8` | **Light rejim fonu**                            |
| `cream-50`     | `#FBF9F4` | Loqo hərfləri, açıq düymələr                    |
| `cream-200`    | `#EBE4D5` | İkinci fon                                      |
| `caramel-500`  | `#C08A4E` | **Aksent** — ulduzlar, "Yeni" nişanı            |
| `caramel-600`  | `#9C6B35` | Aksent mətn (WCAG AA)                           |
| `ink-900`      | `#1B201D` | Əsas mətn                                       |

### Şriftlər (`next/font`)

- **Manrope** — bütün başlıqlar və mətn (təmiz, müasir sans-serif).
- **Caveat** — əl yazısı aksent (kiçik başlıq üstü yazılar, şüar lenti).

Hər ikisi Azərbaycan hərflərini (ə, ğ, ı, ö, ü, ç, ş) və kiril əlifbasını dəstəkləyir.

## 6. Struktur

```
app/
  [locale]/            layout (şriftlər, provider-lər), page, 404, OG şəkli
  actions.ts           Server Actions (rəy, rezervasiya → Resend)
  sitemap.ts robots.ts icon.svg globals.css (dizayn tokenləri)
components/
  intro/               kinematik intro + pre-paint skript
  layout/              header, mobil menyu, footer, dil/tema dəyişdirici, sosial
  sections/            hero, news, marquee, split-features, menu, why-us, about, reviews, rewards, contact, visit, instagram
  forms/               formalar, sahələr, təşəkkür animasiyası
  ui/                  button (CVA), dialog (Radix), cover, reveal, stars
  effects/             provider-lər (tema, bildirişlər)
  seo/json-ld.tsx      CafeOrCoffeeShop schema
data/                  bütün redaktə edilə bilən məzmun
i18n/  messages/       next-intl konfiqurasiyası və tərcümələr
lib/                   cn(), iş saatları məntiqi (Bakı vaxtı), Zod sxemləri, formatlama
proxy.ts               dil yönləndirməsi (Next 16-da middleware-in yeni adı)
```

## 7. Qeydlər

- **Intro:** yalnız ilk ziyarətdə (~2.4 s), "Keç" düyməsi və `Esc` işləyir; `prefers-reduced-motion` üçün sadə fade.
- **"İndi açıqdır" indikatoru** Bakı vaxtı ilə (hər gün 07:00–23:00, Google Maps) işləyir.
- **Lighthouse** hələ ölçülməyib; deploy-dan sonra yoxlamaq tövsiyə olunur.
