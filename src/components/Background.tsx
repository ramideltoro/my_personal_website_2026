"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useTheme } from "@/components/ThemeProvider";

type BackgroundStyle = CSSProperties & {
  "--mouse-x"?: string;
  "--mouse-y"?: string;
};

const darkGradient =
  "radial-gradient(circle at 0% 0%, rgba(76, 29, 149, 0.2), transparent 60%), radial-gradient(circle at 100% 0%, rgba(124, 58, 237, 0.15), transparent 50%), radial-gradient(circle at 50% 100%, rgba(79, 70, 229, 0.15), transparent 60%)";

const lightGradient =
  "radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.15), transparent 50%), radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15), transparent 50%)";

const pointerMask =
  "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 0%), black, transparent)";
const pointerDotMask =
  "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 0%), black, transparent)";

export function Background() {
  const { theme } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";
  const dotColor = isDark ? "#ffffff" : "#000000";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const updateMousePosition = (event: MouseEvent | PointerEvent) => {
      root.style.setProperty("--mouse-x", `${event.clientX}px`);
      root.style.setProperty("--mouse-y", `${event.clientY}px`);
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("pointermove", updateMousePosition, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("pointermove", updateMousePosition);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full transition-colors duration-500 ease-in-out"
      style={
        {
          backgroundColor: isDark ? "#0a0a0f" : "#ffffff",
          "--mouse-x": "50%",
          "--mouse-y": "0%",
        } as BackgroundStyle
      }
    >
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
        style={{ background: lightGradient, opacity: isDark ? 0 : 1 }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
        style={{ background: darkGradient, opacity: isDark ? 1 : 0 }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: isDark ? 0.05 : 0.08,
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, rgba(124, 58, 237, 0.15), transparent 50%)"
            : "radial-gradient(circle at center, rgba(0, 0, 0, 0.03), transparent 40%)",
          WebkitMaskImage: pointerMask,
          maskImage: pointerMask,
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: isDark ? 0.4 : 0.3,
          WebkitMaskImage: pointerDotMask,
          maskImage: pointerDotMask,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, transparent 40%, #0a0a0f 100%)"
            : "radial-gradient(circle at center, transparent 40%, #ffffff 100%)",
          opacity: 0.6,
        }}
      />
    </div>
  );
}
