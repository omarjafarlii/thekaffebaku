import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="grid min-h-svh place-items-center bg-forest-800 px-4 text-center text-cream-50">
      <div className="flex flex-col items-center gap-4">
        <p className="text-hero font-extrabold text-caramel-400">404</p>
        <h1 className="text-subtitle font-bold">{t("title")}</h1>
        <p className="text-cream-100">{t("text")}</p>
        <Link
          href="/"
          className={buttonVariants({ variant: "light", size: "lg" })}
        >
          {t("back")}
        </Link>
      </div>
    </main>
  );
}
