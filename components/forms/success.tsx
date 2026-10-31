"use client";

import { motion } from "motion/react";

/** Thank-you state with a drawn check mark. */
export function Success({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      role="status"
      className="flex flex-col items-center gap-4 py-8 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="grid size-20 place-items-center rounded-pill bg-forest-800 text-cream-50">
        <svg
          viewBox="0 0 24 24"
          className="size-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          />
        </svg>
      </span>
      <h3 className="text-subtitle font-bold">{title}</h3>
      <p className="max-w-sm text-muted">{text}</p>
      {action}
    </motion.div>
  );
}
