import { cva, type VariantProps } from "class-variance-authority";

/** Pill buttons. Server-safe (no "use client") so server components can use it. */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold whitespace-nowrap transition-colors duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500 active:scale-98 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /** brand green */
        primary:
          "bg-brand text-brand-fg hover:bg-forest-700 dark:hover:bg-cream-200",
        /** on dark/photo backgrounds */
        light: "bg-cream-50 text-forest-900 hover:bg-white",
        /** outline in current colour (Starbucks style) */
        outline: "border-2 border-current hover:bg-current/10",
        ghost: "hover:bg-current/10",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
