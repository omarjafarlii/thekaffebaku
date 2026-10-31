"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { info } from "@/data/info";
import { INTRO_KEY } from "@/components/intro/intro-script";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Short first-visit intro (~2.4 s): a cup is drawn line by line, steam
 * rises, the name and slogan appear, then the green curtain slides up.
 * The page is already rendered underneath, so nothing is delayed.
 * Reduced motion: a simple fade. Skip button + Esc supported.
 */
export function Intro() {
  const t = useTranslations("intro");
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {}
    setShow(false);
  }, []);

  useEffect(() => {
    if (document.documentElement.dataset.intro !== "show") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- decided before paint by IntroScript
      setShow(false);
      return;
    }
    const id = window.setTimeout(finish, reduce ? 1200 : 2400);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [finish, reduce]);

  return (
    <AnimatePresence
      onExitComplete={() => (document.documentElement.dataset.intro = "none")}
    >
      {show && (
        <motion.div
          id="intro-overlay"
          aria-hidden="true"
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-forest-800 text-cream-50"
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: reduce ? 0.4 : 0.8, ease: [0.7, 0, 0.2, 1] }}
        >
          <svg
            viewBox="0 0 120 110"
            className="w-24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {[44, 60, 76].map((x, i) => (
              <motion.path
                key={x}
                d={`M${x} 34 C ${x - 7} 26, ${x + 7} 18, ${x} 8`}
                className="text-caramel-400"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.7 + i * 0.12,
                  ease: "easeOut",
                }}
              />
            ))}
            <motion.path
              d="M22 44 H98 L92 86 C90 97 81 104 70 104 H50 C39 104 30 97 28 86 Z"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
            <motion.path
              d="M96 54 C 114 54, 114 78, 93 78"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
            />
          </svg>
          <motion.p
            className="mt-6 text-3xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          >
            {info.fullName}
          </motion.p>
          <motion.p
            className="mt-1 font-hand text-2xl text-caramel-400"
            lang="en"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {info.slogan}
          </motion.p>
          <button
            type="button"
            onClick={finish}
            className="absolute right-5 bottom-6 rounded-pill border border-cream-50/30 px-4 py-1.5 text-xs font-bold tracking-wider uppercase transition hover:bg-cream-50/10"
          >
            {t("skip")}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
