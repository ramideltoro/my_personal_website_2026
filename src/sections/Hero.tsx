"use client";

import { FormEvent, KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";
import { Send } from "lucide-react";

type AvatarState = "idle" | "thinking" | "speaking";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type SuggestedPrompt = {
  label: string;
  autofill: string;
};

const suggestedPrompts: SuggestedPrompt[] = [
  { label: "Work", autofill: "What do you do and how can you help me?" },
  { label: "About me", autofill: "Tell me more about yourself." },
  { label: "Skills", autofill: "Tell me more about your skills and projects." },
  { label: "Contact", autofill: "How can I contact you?" },
];

const cannedResponses: Record<string, string> = {
  "what do you do and how can you help me?":
    "I’m here to help you turn your ideas into reality! Whether you need a website, a mobile app, or want to automate some processes, I can provide end-to-end solutions tailored to your needs. Let's chat about what you have in mind—book a free consultation in the top right corner!",
  "tell me more about yourself.":
    "I’m Paweł Szostak, a 21-year-old Computer Science and Intelligent Systems student at AGH University in Kraków, Poland. As a developer, I enjoy creating websites and mobile apps, and I’m passionate about automating processes to make your life easier. I love collaborating on exciting projects, so if you have an idea, let’s chat!",
  "tell me more about your skills and projects.":
    "I have skills in full-stack development, with experience in Flutter, Python, C++, React, and Java. Some of my key projects include:\n\n1. **Cube Solver**: An app that uses computer vision to solve a Rubik's Cube in real-time.\n2. **Guess Who**: A mobile multiplayer game adaptation of the classic board game with custom boards.\n3. **Self-Improvement Tree**: A gamified app for tracking personal development and habits.\n4. **KaucjApp**: A marketplace for deposit bottles, where I contributed as a frontend developer.\n\nI love tackling both solo and team projects, so I’m always open to new opportunities!",
  "how can i contact you?":
    'You can reach me by booking a free consultation through the "book a call" option in the top right corner of the website. Alternatively, feel free to email me at pszostak.contact@gmail.com. I\'m looking forward to connecting!',
};

const defaultResponse =
  "I'm only Paweł's portfolio assistant and can help with his work, skills, projects, or contact details. Try one of the prompts below or ask about a project.";

const avatarGlowVariants: Variants = {
  idle: { opacity: 0.1, scale: 0.8 },
  thinking: {
    opacity: [0.15, 0.3, 0.15],
    scale: [1, 1.05, 1],
    transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
  },
  speaking: {
    opacity: [0.2, 0.4, 0.2],
    scale: [1, 1.1, 1],
    transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
  },
};

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
};

function normalizePrompt(prompt: string) {
  return prompt.trim().toLowerCase();
}

function getResponse(prompt: string) {
  return cannedResponses[normalizePrompt(prompt)] ?? defaultResponse;
}

function Avatar({ state, className = "" }: { state: AvatarState; className?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    window.requestAnimationFrame(() => setMounted(true));
    const iOS =
      /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1);
    window.requestAnimationFrame(() => setIsIos(iOS));
  }, []);

  useLayoutEffect(() => {
    if (!mounted || isIos) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [mounted, isIos]);

  useEffect(() => {
    if (!mounted || isIos) return;

    const video = videoRef.current;
    if (!video || !loaded || !introReady) return;

    if (state === "idle" || shouldAnimate) {
      if (state === "idle") {
        window.requestAnimationFrame(() => setShouldAnimate(false));
      }
      return;
    }

    window.requestAnimationFrame(() => setShouldAnimate(true));
    video.currentTime = 2.35;
    video.play().catch(() => {});
  }, [state, loaded, introReady, shouldAnimate, mounted, isIos]);

  useEffect(() => {
    if (!mounted || isIos) return;

    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      const time = video.currentTime;

      if (!introReady) {
        if (time >= 2.35) {
          video.currentTime = 2.35;
          video.pause();
          setIntroReady(true);
        }
        return;
      }

      if (time > 2.35) {
        if (time >= 5.2) {
          video.currentTime = 2.35;
          video.pause();
        }
      } else if (state === "idle" && Math.abs(time - 2.35) > 0.05) {
        video.currentTime = 2.35;
        video.pause();
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [state, introReady, mounted, isIos]);

  if (!mounted) {
    return (
      <div className={`relative z-0 flex items-center justify-center ${className}`}>
        <div className="relative flex h-36 w-36 items-center justify-center sm:h-52 sm:w-52" />
      </div>
    );
  }

  return (
    <div className={`relative z-0 flex items-center justify-center ${className}`}>
      <motion.div
        className="absolute -z-10 h-32 w-32 rounded-full bg-violet-600/10 blur-[35px] sm:h-44 sm:w-44"
        variants={avatarGlowVariants}
        animate={state}
      />
      <div className="relative flex h-36 w-36 items-center justify-center sm:h-52 sm:w-52">
        {isIos ? (
          <Image
            src="/hero/avatar.png"
            alt="Avatar"
            width={208}
            height={208}
            className="h-full w-full object-contain pointer-events-none"
            priority
          />
        ) : (
          <>
            {!loaded ? <div className="absolute inset-0 bg-transparent" /> : null}
            <video
              ref={videoRef}
              muted
              playsInline
              autoPlay
              preload="auto"
              controls={false}
              onLoadedData={() => setLoaded(true)}
              className={`h-full w-full object-contain pointer-events-none transition-opacity duration-500 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src="/hero/avatar.mp4" type='video/mp4; codecs="hvc1"' />
              <source src="/hero/avatar.webm" type="video/webm" />
            </video>
          </>
        )}
      </div>
    </div>
  );
}

function TypingIndicator({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="flex items-center gap-2"
      style={{ padding: "8px 16px" }}
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="h-2 w-2 rounded-full"
            style={{ background: "var(--accent)" }}
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 * index }}
          />
        ))}
      </div>
      <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
        {text}
      </span>
    </motion.div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`mb-2 flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[90%] rounded-2xl ${
          isUser ? "rounded-br-none shadow-md" : "rounded-bl-none backdrop-blur-sm"
        }`}
        style={{
          padding: "10px 16px",
          background: isUser ? "var(--accent)" : "var(--card)",
          color: isUser ? "white" : "var(--foreground)",
          border: isUser ? "none" : "1px solid var(--card-border)",
        }}
      >
        <p className="whitespace-pre-wrap leading-snug" style={{ fontSize: "0.9rem" }}>
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}

function ChatWindow({
  messages,
  isLoading,
}: {
  messages: ChatMessage[];
  isLoading: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="scrollbar-hide flex h-72 flex-col gap-1 overflow-y-auto sm:h-[17.5rem]"
      style={{ padding: "12px 8px" }}
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading ? <TypingIndicator key="typing" text="AI is thinking..." /> : null}
      </AnimatePresence>

      {messages.length === 0 && !isLoading ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 items-center justify-center">
          <p className="text-center text-xs" style={{ color: "var(--muted)", opacity: 0.5 }}>
            Ask me anything about Paweł...
          </p>
        </motion.div>
      ) : null}
    </div>
  );
}

function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  onSuggestedClick,
}: {
  input: string;
  setInput: (input: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onSuggestedClick: (prompt: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (window.matchMedia("(hover: hover)").matches) {
        textareaRef.current?.focus();
      }
    }, 100);

    return () => window.clearTimeout(timeout);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && input.trim()) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex flex-wrap justify-center gap-1.5">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt.label}
            type="button"
            onClick={() => {
              setInput(prompt.autofill);
              onSuggestedClick(prompt.autofill);
              textareaRef.current?.focus();
            }}
            disabled={isLoading}
            className="rounded-full border px-3 py-1 text-xs transition-transform hover:border-[var(--accent)] hover:text-[var(--foreground)] active:scale-95 disabled:opacity-50"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--card-border)",
              color: "var(--muted)",
            }}
          >
            {prompt.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="relative">
        <div
          className="flex items-center gap-2 rounded-full border px-4 py-1.5"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--card-border)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            onInput={(event) => {
              const textarea = event.currentTarget;
              textarea.style.height = "auto";
              textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
            }}
            rows={1}
            placeholder="Ask anything about Paweł..."
            disabled={isLoading}
            className="flex-1 resize-none overflow-hidden bg-transparent py-2 text-sm leading-tight outline-none placeholder:opacity-50"
            style={{ color: "var(--foreground)", caretColor: "var(--accent)" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105 hover:opacity-90 disabled:scale-90 disabled:opacity-0"
            style={{ backgroundColor: "var(--accent)" }}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export function Hero() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const responseTimeoutRef = useRef<number | null>(null);
  const speakingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (responseTimeoutRef.current) window.clearTimeout(responseTimeoutRef.current);
      if (speakingTimeoutRef.current) window.clearTimeout(speakingTimeoutRef.current);
    };
  }, []);

  const sendPrompt = (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || isLoading) return;

    if (responseTimeoutRef.current) window.clearTimeout(responseTimeoutRef.current);
    if (speakingTimeoutRef.current) window.clearTimeout(speakingTimeoutRef.current);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);
    setAvatarState("thinking");

    responseTimeoutRef.current = window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: getResponse(trimmed),
      };

      setMessages((current) => [...current, assistantMessage]);
      setIsLoading(false);
      setAvatarState("speaking");

      speakingTimeoutRef.current = window.setTimeout(() => {
        setAvatarState("idle");
      }, 1200);
    }, 1450);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(input);
  };

  const busy = isLoading;

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center px-4"
      style={{ scrollMarginTop: "120px", paddingTop: "6rem", paddingBottom: "8rem" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-violet-950/20 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto w-full max-w-3xl"
      >
        <div className="mb-4 text-center">
          <div className="mb-2 flex justify-center">
            <Avatar state={avatarState} />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-1 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            style={{ fontSize: "200%", color: "var(--foreground)" }}
          >
            <span className="sm:hidden">
              Hi, I&apos;m <span className="text-gradient-shimmer">Paweł Szostak</span>
            </span>
            <span className="hidden sm:inline">
              Hi, I&apos;m <span className="text-gradient-shimmer">Paweł Szostak</span>
            </span>
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/2 shadow-2xl shadow-black/20 backdrop-blur-xl"
        >
          <ChatWindow messages={messages} isLoading={busy} />
          <div className="h-px" style={{ backgroundColor: "var(--border-color)" }} />
          <div style={{ padding: "16px" }}>
            <ChatInput
              input={input}
              setInput={setInput}
              onSubmit={onSubmit}
              isLoading={busy}
              onSuggestedClick={sendPrompt}
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-6 flex justify-center">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-1 text-white/30"
          >
            <span className="text-xs">Scroll to explore</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
