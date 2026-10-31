import { notFound } from "next/navigation";

/** Catch unknown paths inside a locale so the localized 404 renders. */
export default function CatchAll() {
  notFound();
}
