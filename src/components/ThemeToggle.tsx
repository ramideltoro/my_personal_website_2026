"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full glass-strong sm:h-14 sm:w-14">
        <Moon className="h-[18px] w-[18px] text-(--muted) sm:h-5 sm:w-5" />
      </div>
    );
  }

  return <HydratedThemeToggle />;
}

function HydratedThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const onToggle = () => {
    document.documentElement.classList.add("disable-transitions");
    toggleTheme();
    window.setTimeout(() => {
      document.documentElement.classList.remove("disable-transitions");
    }, 10);
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full glass-strong transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)] active:scale-95 sm:h-14 sm:w-14"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ scale: isDark ? 1 : 0, opacity: isDark ? 1 : 0, rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon className="h-[18px] w-[18px] text-white sm:h-5 sm:w-5" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ scale: isDark ? 0 : 1, opacity: isDark ? 0 : 1, rotate: isDark ? -180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun className="h-[18px] w-[18px] text-amber-500 sm:h-5 sm:w-5" />
      </motion.div>
    </button>
  );
}
