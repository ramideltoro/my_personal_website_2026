"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Send } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type SuggestedPrompt = {
  label: string;
  autofill: string;
  response: string;
  keywords: string[];
};

const suggestedPrompts: SuggestedPrompt[] = [
  {
    label: "What I Build",
    autofill: "What kind of software do you build?",
    keywords: ["build", "work", "software", "apps", "systems"],
    response:
      "I’m a software engineer with over a decade of experience building secure, scalable software. Most of my work sits where product ideas meet real systems: APIs, cloud-ready apps, distributed services, automation, and clean web experiences.\n\nI like building software that is useful, easy to reason about, and still maintainable after the first launch. The fun part for me is taking a rough idea and turning it into something real without making the system harder than it needs to be.",
  },
  {
    label: "NutsNews",
    autofill: "What is NutsNews and what did you build there?",
    keywords: ["nutsnews", "positive news", "news", "project", "product"],
    response:
      "NutsNews is my positive news platform. It is built around a simple idea: staying informed should not always leave you drained. It gathers uplifting stories from trusted RSS feeds, uses AI to help review and summarize them, and points readers back to the original publishers.\n\nThe part I’m proud of is the full system behind it: web app, Cloudflare Worker ingestion, Supabase, local AI with OpenAI fallback, iOS work, admin tools, caching, monitoring, backups, and docs. It is the kind of project where product taste and engineering discipline both matter.",
  },
  {
    label: "Tech Stack",
    autofill: "What technologies do you work with most?",
    keywords: ["tech", "stack", "skills", "tools", "languages"],
    response:
      "I spend most of my time with Java, Spring, React, TypeScript, JavaScript, CSS, Python, APIs, microservices, and distributed systems. I also work with cloud and product infrastructure like Cloudflare Workers, Supabase, GitHub workflows, and iOS/Swift when the product needs it.\n\nI try not to chase tools just because they are loud that month. I care about picking the stack that gives the team reliability, security, clear ownership, and enough room to grow.",
  },
  {
    label: "AI",
    autofill: "How do you use AI in your work?",
    keywords: ["ai", "artificial intelligence", "llm", "openai", "automation", "machine learning"],
    response:
      "I use AI in two ways: inside products and in my own engineering workflow. In NutsNews, AI helps review, classify, and summarize positive news while keeping the original publishers central. I’ve also worked with local AI flows and OpenAI fallback, which forces practical questions about cost, privacy, reliability, and graceful failure.\n\nDay to day, I use AI to explore ideas, write tests, inspect unfamiliar code, draft documentation, and speed up debugging. I still own the architecture, security, correctness, and taste. AI helps me move faster, but judgment is still the job.",
  },
  {
    label: "How I Work",
    autofill: "What is it like to work with you?",
    keywords: ["process", "collaborate", "work with you", "style", "team"],
    response:
      "I care about fundamentals, clear tradeoffs, and keeping complexity honest. I like to understand the problem first, design APIs with care, write testable code, and document the parts people will need later.\n\nI’m ambitious about impact and humble about the process. I ask questions early, take feedback seriously, and expect the design to improve as the system gets more real. My GitHub bio says, “Life would be much easier if I had the source code,” and that still feels accurate: curious, practical, and always trying to understand how things really work.",
  },
  {
    label: "Writing",
    autofill: "Do you write or teach about software?",
    keywords: ["writing", "teach", "articles", "showalgo", "algorithms"],
    response:
      "Yes. I like learning in public and explaining technical ideas without making them sound mysterious. Through ShowAlgo, I’ve written about graphs, linked lists, MergeSort, interval merging, and array problems.\n\nTeaching is a good test of understanding. If I can explain a concept clearly, I can usually build with it more calmly. It also keeps software fun because there is always another layer to learn, simplify, and share.",
  },
  {
    label: "Contact",
    autofill: "How can I contact you?",
    keywords: ["contact", "email", "linkedin", "github", "reach"],
    response:
      "The best places to reach me are LinkedIn at linkedin.com/in/ramideltoro and GitHub at github.com/ramideltoro. You can also start from ramideltoro.com.\n\nI’m always open to thoughtful conversations about software engineering, product ideas, cloud/API architecture, AI, or work that helps people.",
  },
];

const defaultResponse =
  "I can help with what Rami builds, NutsNews, his tech stack, AI work, how he works, writing, or contact details.";

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
  const normalized = normalizePrompt(prompt);
  const exactMatch = suggestedPrompts.find((suggestion) => normalizePrompt(suggestion.autofill) === normalized);
  const keywordMatch = suggestedPrompts.find((suggestion) =>
    suggestion.keywords.some((keyword) => normalized.includes(keyword)),
  );

  return exactMatch?.response ?? keywordMatch?.response ?? defaultResponse;
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
        {isLoading ? <TypingIndicator key="typing" text="Thinking..." /> : null}
      </AnimatePresence>

      {messages.length === 0 && !isLoading ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 items-center justify-center">
          <p className="text-center text-xs" style={{ color: "var(--muted)", opacity: 0.5 }}>
            Ask me anything about Rami...
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
            id="hero-chat-input"
            name="message"
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
            placeholder="Ask anything about Rami..."
            aria-label="Ask anything about Rami"
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
  const responseTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (responseTimeoutRef.current) window.clearTimeout(responseTimeoutRef.current);
    };
  }, []);

  const sendPrompt = (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || isLoading) return;

    if (responseTimeoutRef.current) window.clearTimeout(responseTimeoutRef.current);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    responseTimeoutRef.current = window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: getResponse(trimmed),
      };

      setMessages((current) => [...current, assistantMessage]);
      setIsLoading(false);
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
      style={{ scrollMarginTop: "120px", paddingTop: "6rem", paddingBottom: "3rem" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-violet-950/20 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto w-full max-w-3xl"
      >
        <div className="mb-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-1 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            style={{ fontSize: "200%", color: "var(--foreground)" }}
          >
            <span className="sm:hidden">
              Hi, I&apos;m <span className="text-gradient-shimmer">Rami Del Toro</span>
            </span>
            <span className="hidden sm:inline">
              Hi, I&apos;m <span className="text-gradient-shimmer">Rami Del Toro</span>
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
