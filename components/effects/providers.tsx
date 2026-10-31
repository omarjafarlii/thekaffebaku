"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          className:
            "rounded-card! bg-forest-800! text-cream-50! border-0! font-sans!",
        }}
      />
    </ThemeProvider>
  );
}
