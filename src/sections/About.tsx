"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, type Variants } from "framer-motion";
import Image from "next/image";
import {
  SiDocker,
  SiFlutter,
  SiGit,
  SiKubernetes,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { FaAws, FaJava } from "react-icons/fa";
import type { IconType } from "react-icons";

type CenterImageKey = "main" | "agh" | "work" | "location" | "gym";

type InfoCard = {
  title: string;
  short: string;
  long: string;
  image: CenterImageKey;
};

type MindsetSlide = {
  label: string;
  src: string;
};

type StackItem = {
  label: string;
  icon: IconType;
  color: string;
};

const centerImages: Record<CenterImageKey, string> = {
  main: "/about/portrait.jpg",
  agh: "/about/agh.jpg",
  work: "/about/team.jpg",
  location: "/about/city.jpg",
  gym: "/about/hobby.jpg",
};

const infoCards: InfoCard[] = [
  {
    title: "Force for Good",
    short: "Served as a Technical Architect helping nonprofits build practical systems.",
    long: "I served as a Technical Architect for nonprofit organizations, helping mission-driven teams make smart technical decisions, design reliable systems, and turn limited resources into durable software.",
    image: "work",
  },
  {
    title: "Inventor",
    short:
      "I like building ideas end to end. A design around efficient health checking became patented.",
    long: "I like building ideas from rough concept to working system. One design around efficient health checking became patented, which reinforced how much I enjoy practical invention at the architecture level.",
    image: "main",
  },
  {
    title: "Hackathons",
    short: "I take every opportunity to join hackathons and pressure-test ideas.",
    long: "I take every opportunity to participate in hackathons. In 2021, I won first place for creating a customized ecosystem around Bitbucket, Jira, and Confluence.",
    image: "work",
  },
];

const mindsetSlides: MindsetSlide[] = [
  { label: "Calisthenics", src: "/about/calisthenics.jpg" },
  { label: "Kickboxing", src: "/about/kickboxing.jpg" },
  { label: "Snowboarding", src: "/about/snowboarding.jpg" },
  { label: "Cooking", src: "/about/cooking.jpg" },
  { label: "Wakeboarding", src: "/about/wakeboarding.jpg" },
  { label: "Running", src: "/about/run.jpg" },
];

const stackItems: StackItem[] = [
  { label: "React", icon: SiReact, color: "#61DAFB" },
  { label: "TS", icon: SiTypescript, color: "#3178C6" },
  { label: "Java", icon: FaJava, color: "#F89820" },
  { label: "AWS", icon: FaAws, color: "#FF9900" },
  { label: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
  { label: "Flutter", icon: SiFlutter, color: "#02569B" },
  { label: "Python", icon: SiPython, color: "#3776AB" },
  { label: "Node", icon: SiNodedotjs, color: "#339933" },
  { label: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  { label: "Docker", icon: SiDocker, color: "#2496ED" },
  { label: "Git", icon: SiGit, color: "#F05032" },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.3, ease: "easeOut" },
  }),
};

const letterVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] as const },
  },
};

function AnimatedWord({
  text,
  className = "",
  spacingAdjustments = {},
}: {
  text: string;
  className?: string;
  spacingAdjustments?: Record<number, string>;
}) {
  return (
    <div className={`flex justify-center ${className}`}>
      {text.split("").map((letter, index) => (
        <div key={`${letter}-${index}`} className={`inline-block ${spacingAdjustments[index] || ""}`}>
          <motion.span variants={letterVariants} className="inline-block">
            {letter === " " ? "\u00a0" : letter}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

function NameCard({
  isInView,
  desktop = false,
}: {
  isInView: boolean;
  desktop?: boolean;
}) {
  return (
    <motion.div
      custom={0}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={[
        desktop
          ? "hidden md:flex md:col-start-1 md:row-start-1 md:h-full"
          : "md:hidden col-span-1 row-span-1 aspect-square",
        "relative w-full overflow-hidden rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) p-6 backdrop-blur-md",
      ].join(" ")}
    >
      <motion.div
        variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1 text-center"
      >
        <div className="pb-2 text-3xl font-black leading-[1.1] tracking-tighter text-(--foreground) md:pb-0 md:text-4xl md:leading-[0.95]">
          <AnimatedWord text="RAMI" spacingAdjustments={{ 1: "-mr-[0.03em]" }} />
          <AnimatedWord text="DEL TORO" spacingAdjustments={{ 2: "-mr-[0.04em]", 5: "-mr-[0.03em]" }} />
        </div>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ delay: 0.75, duration: 0.45 }}
          className="mt-0 h-px w-24 origin-center bg-(--muted)/45 md:mt-4"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.85, duration: 0.45 }}
          className="mt-2 font-mono text-[10px] uppercase leading-[1.7] tracking-[0.2em] text-(--muted) md:mt-4 md:font-sans md:leading-normal md:tracking-[0.44em]"
        >
          Software
          <br className="md:hidden" /> Engineer
        </motion.p>
      </motion.div>
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
    </motion.div>
  );
}

function PortraitTile({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      custom={1}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative col-span-1 row-span-1 aspect-square w-full overflow-hidden rounded-2xl border border-(--card-border) md:hidden"
    >
      <Image
        src="/about/portrait.jpg"
        alt="Rami portrait"
        fill
        className="object-cover"
        sizes="50vw"
        priority
      />
    </motion.div>
  );
}

function InfoStrip({
  isInView,
  onImageChange,
}: {
  isInView: boolean;
  onImageChange: (image: CenterImageKey | null) => void;
}) {
  const [forceForGood, inventor, hackathons] = infoCards;

  return (
    <motion.div
      custom={2}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onMouseEnter={() => onImageChange("agh")}
      onMouseLeave={() => {
        onImageChange(null);
      }}
      className="group relative col-span-2 row-span-1 h-32 w-full overflow-hidden rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) backdrop-blur-md [--y-mid:70px] [--y-side:60px] md:col-start-2 md:col-span-2 md:row-start-1 md:h-full md:[--y-mid:100px] md:[--y-side:100px]"
    >
      <div className="pointer-events-none absolute left-0 right-0 top-4 z-30 hidden justify-center transition-opacity delay-100 duration-300 group-hover:opacity-0 md:flex">
        <span className="rounded-full border border-purple-500/10 bg-(--card)/50 px-3 py-1 text-[8px] font-medium uppercase tracking-[0.2em] text-purple-400/50 backdrop-blur-sm">
          Hover to read more
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, var(--foreground) 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>
      <div className="relative z-10 flex h-full w-full items-end justify-center overflow-hidden rounded-2xl px-2">
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: "var(--y-side)" }}
          whileHover={{ y: 50, x: -5, rotate: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="group/card relative z-10 flex h-44 w-1/3 -mr-6 flex-col justify-start overflow-hidden rounded-t-xl border border-(--foreground)/10 border-b-0 bg-(--card) p-3 pr-6 shadow-[0_-5px_30px_rgba(0,0,0,0.3)] transition-colors duration-200 hover:border-purple-500/50 hover:shadow-[0_-5px_35px_rgba(168,85,247,0.5)] md:p-4"
        >
          <div className="absolute left-1/4 right-1/4 top-0 h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover/card:opacity-100" />
          <div className="relative z-10 mt-1">
            <span className="block text-[10px] font-bold uppercase leading-tight text-(--foreground) opacity-90">
              {forceForGood.title}
            </span>
            <span className="mt-1.5 block hyphens-auto text-pretty text-[8px] leading-tight text-(--muted) opacity-70 sm:text-[9px] md:hidden">
              {forceForGood.short}
            </span>
            <span className="mt-2 hidden text-[10px] leading-snug text-(--muted) opacity-50 transition-all duration-300 [mask-image:linear-gradient(to_bottom,black_0%,black_15%,transparent_70%)] group-hover/card:opacity-100 group-hover/card:[mask-image:none] md:block">
              {forceForGood.long}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 100 }}
          animate={{ y: "var(--y-mid)" }}
          whileHover={{ y: 60 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="group/card relative z-20 flex h-48 w-2/5 flex-col justify-start overflow-hidden rounded-t-xl border border-(--foreground)/10 border-b-0 bg-(--card) p-3 shadow-[0_-5px_30px_rgba(0,0,0,0.3)] transition-colors duration-200 hover:border-purple-500/50 hover:shadow-[0_-5px_35px_rgba(168,85,247,0.5)] md:p-5"
        >
          <div className="absolute left-1/4 right-1/4 top-0 h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover/card:opacity-100" />
          <div className="relative z-10 mt-2 text-center">
            <span className="mb-1 block text-[12px] font-black uppercase leading-none tracking-tight text-(--foreground)">
              {inventor.title}
            </span>
            <span className="mt-1.5 block hyphens-auto text-pretty text-[8px] leading-tight text-(--muted) opacity-70 sm:text-[9px] md:hidden">
              {inventor.short}
            </span>
            <span className="mt-2 hidden text-[10px] leading-snug text-(--muted) opacity-50 transition-all duration-300 [mask-image:linear-gradient(to_bottom,black_0%,black_15%,transparent_80%)] group-hover/card:opacity-100 group-hover/card:[mask-image:none] md:block">
              {inventor.long}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 120 }}
          animate={{ y: "var(--y-side)" }}
          whileHover={{ y: 50, x: 5, rotate: 2 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="group/card relative z-10 -ml-6 flex h-44 w-1/3 flex-col justify-start overflow-hidden rounded-t-xl border border-(--foreground)/10 border-b-0 bg-(--card) p-3 pl-6 text-right shadow-[0_-5px_30px_rgba(0,0,0,0.3)] transition-colors duration-200 hover:border-purple-500/50 hover:shadow-[0_-5px_35px_rgba(168,85,247,0.5)] md:p-4"
        >
          <div className="absolute left-1/4 right-1/4 top-0 h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover/card:opacity-100" />
          <div className="relative z-10 mt-1">
            <span className="block text-[10px] font-bold uppercase leading-tight text-(--foreground) opacity-90">
              {hackathons.title}
            </span>
            <span className="mt-1.5 block hyphens-auto text-pretty text-[8px] leading-tight text-(--muted) opacity-70 sm:text-[9px] md:hidden">
              {hackathons.short}
            </span>
            <span className="mt-2 hidden text-[10px] leading-snug text-(--muted) opacity-50 transition-all duration-300 [mask-image:linear-gradient(to_bottom,black_0%,black_15%,transparent_70%)] group-hover/card:opacity-100 group-hover/card:[mask-image:none] md:block">
              {hackathons.long}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StackMarquee() {
  const items = [...stackItems, ...stackItems];

  return (
    <div className="relative overflow-hidden border-y border-(--card-border)/50 bg-black/10 py-2 md:py-3">
      <motion.div
        className="flex w-max items-center gap-6 whitespace-nowrap px-4 md:gap-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 22 }}
      >
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={`${item.label}-${index}`} className="flex items-center gap-2">
              <Icon size={14} style={{ color: item.color }} />
              <span className="text-[10px] font-medium uppercase tracking-widest text-(--muted)">
                {item.label}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

function CraftCard({
  isInView,
  onImageChange,
}: {
  isInView: boolean;
  onImageChange: (image: CenterImageKey | null) => void;
}) {
  return (
    <motion.div
      custom={4}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onMouseEnter={() => onImageChange("work")}
      onMouseLeave={() => onImageChange(null)}
      className="group col-span-1 row-span-2 flex h-[330px] min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 md:col-start-3 md:row-start-2 md:h-full"
    >
      <div className="shrink-0 p-3 pb-0 md:p-4 md:pb-0">
        <h3 className="text-[22px] font-bold leading-[1.15] tracking-tight text-(--foreground) md:text-4xl md:leading-[1.2]">
          Craft
        </h3>
        <div className="mt-1 h-0.5 w-16 rounded-full bg-purple-500/80 md:mt-3" />
        <p className="mt-2 text-sm font-normal leading-[1.45] text-(--muted) md:mt-7 md:text-lg md:leading-[1.75]">
          Building scalable{" "}
          <strong className="font-bold text-(--foreground)/70">apps, websites, and automations.</strong>
        </p>
        <p className="mt-5 hidden text-lg leading-[1.75] text-(--muted) md:block">
          I understand what advantages modern tech can provide, helping me advise on the solutions a
          business actually needs.
        </p>
      </div>

      <div className="mt-auto shrink-0">
        <StackMarquee />
      </div>

      <div className="shrink-0 space-y-2 p-3 md:space-y-5 md:p-4">
        <p className="text-xs leading-[1.45] text-(--muted) md:hidden">
          I find and deliver practical tech solutions.
        </p>
        <p className="hidden text-lg leading-[1.75] text-(--muted) md:block">
          Hackathon builder & nonprofit Technical Architect. Feel free to invite me to collaborate.
        </p>
        <div className="flex items-center gap-2 text-[9px] leading-tight text-(--muted) md:text-[10px]">
          <span className="h-3 w-3 shrink-0 rounded-full bg-emerald-500" />
          <span>Open to collaboration & freelance</span>
        </div>
      </div>
    </motion.div>
  );
}

function LocationCard({
  isInView,
  onImageChange,
}: {
  isInView: boolean;
  onImageChange: (image: CenterImageKey | null) => void;
}) {
  return (
    <motion.div
      custom={3}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onMouseEnter={() => onImageChange("location")}
      onMouseLeave={() => onImageChange(null)}
      className="relative col-span-1 row-span-1 aspect-square overflow-hidden rounded-2xl border border-(--card-border) bg-(--card) backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 md:col-start-2 md:row-start-3 md:aspect-auto md:h-full"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/about/map.jpg"
          alt="Map Background"
          fill
          className="scale-125 translate-y-4 object-cover opacity-50 grayscale mix-blend-luminosity"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-(--card) via-(--card)/70 to-transparent" />
      </div>
      <motion.div
        className="absolute bottom-0 top-0 z-10 w-px bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
        animate={{ left: ["-5%", "105%"] }}
        transition={{ duration: 4, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
      />
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col justify-end p-3 md:p-4">
        <h3 className="mb-1 text-[22px] font-black uppercase leading-[0.95] tracking-tight text-white sm:text-[26px] md:text-3xl">
          Tampa,
          <br />
          Florida
        </h3>
        <p className="font-mono text-[15px] uppercase leading-none tracking-tight text-white/45 md:text-base md:tracking-wider">
          27.9506° N,
          <br />
          82.4572° W
        </p>
        <p className="mt-0.5 font-mono text-[15px] font-bold leading-none text-purple-400 md:mt-1 md:text-sm md:leading-normal">
          GMT-4
        </p>
      </div>
    </motion.div>
  );
}

function MindsetCard({
  isInView,
  onImageChange,
}: {
  isInView: boolean;
  onImageChange: (image: CenterImageKey | null) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const count = mindsetSlides.length;

  const stop = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % count);
    }, 4000);
  }, [count, stop]);

  useEffect(() => {
    if (isInView) {
      start();
    }

    return stop;
  }, [isInView, start, stop]);

  const getIndex = (offset: number) => (activeIndex + offset + count) % count;
  const setSlide = (index: number) => {
    setActiveIndex(index);
    start();
  };

  return (
    <motion.div
      custom={5}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onMouseEnter={() => onImageChange("gym")}
      onMouseLeave={() => onImageChange(null)}
      className="group relative col-span-1 row-span-2 flex h-[330px] min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 md:col-start-1 md:row-start-2 md:h-full"
    >
      <div className="z-20 shrink-0 p-3 pb-2 md:p-3.5 md:pb-0">
        <h3 className="text-2xl font-bold leading-[1.2] tracking-tight text-(--foreground) md:text-4xl">
          Mindset
        </h3>
        <div className="mt-3 h-0.5 w-16 rounded-full bg-purple-500/80 md:mt-1" />
        <p className="mt-6 text-base leading-[1.75] text-(--muted) md:mt-2 md:text-lg">
          <strong className="font-bold text-(--foreground)/70">Building more than software.</strong>{" "}
          My passions provide the{" "}
          <strong className="font-bold text-(--foreground)/70">discipline and focus</strong> I need
          to grow.
        </p>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 pb-3 md:pb-0">
        <div className="relative flex h-full w-full items-center justify-center" style={{ perspective: "1000px" }}>
          <motion.button
            type="button"
            className="absolute aspect-3/4 w-[45%] cursor-pointer overflow-hidden rounded-xl border border-(--card-border)/50 shadow-lg md:w-[42%] md:rounded-2xl"
            initial={false}
            animate={{ x: "-55%", scale: 0.7, rotateY: 25, opacity: 0.5, zIndex: 1, filter: "blur(1px) grayscale(30%)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => setSlide(getIndex(-1))}
            aria-label={`Show ${mindsetSlides[getIndex(-1)].label}`}
          >
            <Image
              src={mindsetSlides[getIndex(-1)].src}
              alt={mindsetSlides[getIndex(-1)].label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 18vw"
            />
          </motion.button>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={`center-${activeIndex}`}
              className="relative aspect-3/4 w-[55%] cursor-pointer overflow-hidden rounded-xl border-2 border-purple-500/30 shadow-2xl md:w-[50%] md:rounded-2xl"
              initial={{ scale: 0.85, opacity: 0.5, rotateY: -15 }}
              animate={{ x: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 10, filter: "blur(0px) grayscale(0%)" }}
              exit={{ scale: 0.85, opacity: 0.5, rotateY: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Image
                src={mindsetSlides[activeIndex].src}
                alt={mindsetSlides[activeIndex].label}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 40vw, 25vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 via-black/30 to-transparent p-1 pt-6 md:p-3 md:pt-8">
                <span className="text-[8px] font-bold uppercase tracking-wider text-white md:text-xs">
                  {mindsetSlides[activeIndex].label}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.button
            type="button"
            className="absolute aspect-3/4 w-[45%] cursor-pointer overflow-hidden rounded-xl border border-(--card-border)/50 shadow-lg md:w-[42%] md:rounded-2xl"
            initial={false}
            animate={{ x: "55%", scale: 0.7, rotateY: -25, opacity: 0.5, zIndex: 1, filter: "blur(1px) grayscale(30%)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => setSlide(getIndex(1))}
            aria-label={`Show ${mindsetSlides[getIndex(1)].label}`}
          >
            <Image
              src={mindsetSlides[getIndex(1)].src}
              alt={mindsetSlides[getIndex(1)].label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 18vw"
            />
          </motion.button>
        </div>
      </div>

      <div className="z-20 hidden shrink-0 border-t border-(--card-border)/30 p-3 pt-0 md:block md:p-3.5">
        <p className="text-lg leading-[1.75] text-(--muted)">
          <strong>Mastering body and mind</strong> is my path to <strong>excellence</strong>.
        </p>
      </div>
    </motion.div>
  );
}

function MobileHobbyTile({
  isInView,
  onImageChange,
}: {
  isInView: boolean;
  onImageChange: (image: CenterImageKey | null) => void;
}) {
  return (
    <motion.div
      custom={6}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onMouseEnter={() => onImageChange("gym")}
      onMouseLeave={() => onImageChange(null)}
      className="relative col-span-1 row-span-1 aspect-square w-full overflow-hidden rounded-2xl border border-(--card-border) md:hidden"
    >
      <Image src="/about/hobby.jpg" alt="Gym Lifestyle" fill className="object-cover" sizes="50vw" />
    </motion.div>
  );
}

function CenterPortrait({
  activeImage,
  isInView,
}: {
  activeImage: CenterImageKey;
  isInView: boolean;
}) {
  return (
    <motion.div
      custom={6}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative col-start-2 row-start-2 hidden aspect-square h-full w-full overflow-hidden rounded-2xl border border-(--card-border) bg-black md:block"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeImage}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={centerImages[activeImage]}
            alt="Dynamic Center"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 33vw"
            priority
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [activeImage, setActiveImage] = useState<CenterImageKey>("main");

  const setCenterImage = (image: CenterImageKey | null) => {
    setActiveImage(image ?? "main");
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="mx-auto max-w-5xl px-4 pb-32 pt-0"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:grid-rows-[9rem_20.1875rem_9rem]">
        <NameCard isInView={isInView} />
        <NameCard isInView={isInView} desktop />
        <PortraitTile isInView={isInView} />
        <InfoStrip isInView={isInView} onImageChange={setCenterImage} />
        <CraftCard isInView={isInView} onImageChange={setCenterImage} />
        <LocationCard isInView={isInView} onImageChange={setCenterImage} />
        <MindsetCard isInView={isInView} onImageChange={setCenterImage} />
        <MobileHobbyTile isInView={isInView} onImageChange={setCenterImage} />
        <CenterPortrait activeImage={activeImage} isInView={isInView} />
      </div>
    </section>
  );
}
