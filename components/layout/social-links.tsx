import { info } from "@/data/info";
import { cn } from "@/lib/utils";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/brand/social-icons";

type Social = { name: string; href: string; Icon: typeof InstagramIcon };

/** Only accounts that exist in data/info.ts are rendered. */
export function getSocials(): Social[] {
  const all = [
    { name: "Instagram", href: info.social.instagram, Icon: InstagramIcon },
    { name: "TikTok", href: info.social.tiktok, Icon: TikTokIcon },
    { name: "Facebook", href: info.social.facebook, Icon: FacebookIcon },
    {
      name: "WhatsApp",
      href: info.whatsapp ? `https://wa.me/${info.whatsapp}` : null,
      Icon: WhatsAppIcon,
    },
  ];
  return all.filter((s): s is Social => !!s.href);
}

export function SocialLinks({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {getSocials().map(({ name, href, Icon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className={cn(
              "grid place-items-center rounded-pill transition hover:-translate-y-0.5",
              size === "sm"
                ? "size-9 hover:bg-current/10"
                : "size-10 bg-current/10 hover:bg-current/20",
            )}
          >
            <Icon className="size-4.5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
