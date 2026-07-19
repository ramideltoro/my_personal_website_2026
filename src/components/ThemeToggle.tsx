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
      <div className="flex h-14 w-14 items-center justify-center rounded-full glass-strong">
        <Moon size={20} className="text-(--muted)" />
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
      className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full glass-strong transition-transform duration-300 hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ scale: isDark ? 1 : 0, opacity: isDark ? 1 : 0, rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon size={20} className="text-white" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ scale: isDark ? 0 : 1, opacity: isDark ? 0 : 1, rotate: isDark ? -180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun size={20} className="text-amber-500" />
      </motion.div>
    </button>
  );
}
