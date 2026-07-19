"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, type Variants } from "framer-motion";
import Image from "next/image";

type InfoCard = {
  title: string;
  short: string;
  long: string;
};

type MindsetSlide = {
  label: string;
  src: string;
  objectPosition?: string;
};

const infoCards: InfoCard[] = [
  {
    title: "Force for Good",
    short: "Technical architecture work for nonprofit teams trying to do more with less.",
    long: "I served as a Technical Architect for nonprofit organizations, helping mission-driven teams turn messy needs into practical systems their volunteers and staff could actually use.",
  },
  {
    title: "Inventor",
    short: "I like taking rough ideas seriously enough to build them.",
    long: "I enjoy the path from rough idea to working system. One design around efficient health checking became patented, which still reminds me that practical ideas can become real IP when the details are good.",
  },
  {
    title: "Hackathons",
    short: "I use hackathons to test ideas, move fast, and learn with a team.",
    long: "I take every chance I can to jump into hackathons. In 2021, my team won first place for a custom ecosystem around Bitbucket, Jira, and Confluence.",
  },
];

const mindsetSlides: MindsetSlide[] = [
  { label: "Painting", src: "/about/painting.jpg" },
  { label: "AI Agents", src: "/about/ai-agents.png", objectPosition: "left center" },
  { label: "Driving", src: "/about/driving.jpg" },
  { label: "Pilot", src: "/about/pilot.jpg" },
  { label: "Travel", src: "/about/travel.jpg" },
  { label: "Flying", src: "/about/flying.jpg" },
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
          : "md:hidden min-h-[13rem] sm:min-h-[15rem]",
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
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-(--card-border) sm:aspect-[16/10] md:hidden"
    >
      <Image
        src="/about/rami-profile.jpeg"
        alt="Rami portrait"
        fill
        className="object-cover"
        sizes="(max-width: 768px) calc(100vw - 1.5rem), 33vw"
        priority
      />
    </motion.div>
  );
}

function InfoStrip({ isInView }: { isInView: boolean }) {
  const [forceForGood, inventor, hackathons] = infoCards;
  const [activeMobileCard, setActiveMobileCard] = useState(0);
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollToMobileCard = (index: number) => {
    const scroller = mobileScrollerRef.current;
    if (!scroller) {
      return;
    }

    scroller.scrollTo({
      left: index * scroller.clientWidth,
      behavior: "smooth",
    });
  };

  const onMobileScroll = () => {
    const scroller = mobileScrollerRef.current;
    if (!scroller) {
      return;
    }

    const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
    setActiveMobileCard(Math.min(Math.max(nextIndex, 0), infoCards.length - 1));
  };

  return (
    <motion.div
      custom={2}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="group relative col-span-1 h-auto w-full overflow-hidden rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) backdrop-blur-md [--y-mid:70px] [--y-side:60px] md:col-start-2 md:col-span-2 md:row-start-1 md:h-full md:[--y-mid:100px] md:[--y-side:100px]"
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
      <div className="relative z-10 p-3 md:hidden">
        <div
          ref={mobileScrollerRef}
          onScroll={onMobileScroll}
          className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-xl border border-(--foreground)/10 bg-(--card) shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
          aria-label="About highlights"
        >
          {infoCards.map((card) => (
            <article
              key={card.title}
              className="flex min-h-[15.5rem] min-w-full snap-center flex-col justify-center p-5"
              aria-label={card.title}
            >
              <h3 className="text-base font-black uppercase leading-tight tracking-tight text-(--foreground)">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-(--muted)">
                {card.long}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-3 flex justify-center gap-2">
          {infoCards.map((card, index) => (
            <button
              key={card.title}
              type="button"
              onClick={() => scrollToMobileCard(index)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: activeMobileCard === index ? "1.5rem" : "0.5rem",
                backgroundColor: activeMobileCard === index ? "var(--accent)" : "var(--card-border)",
              }}
              aria-label={`Show ${card.title}`}
            />
          ))}
        </div>
      </div>
      <div className="relative z-10 hidden h-full w-full items-end justify-center overflow-hidden rounded-2xl px-2 md:flex">
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

function CraftCard({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      custom={4}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="group col-span-1 hidden min-h-[24rem] w-full flex-col overflow-hidden rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 md:col-start-3 md:row-span-2 md:row-start-2 md:flex md:h-full md:min-h-0"
    >
      <div className="shrink-0 p-3 pb-0 md:p-4 md:pb-0">
        <h3 className="text-[22px] font-bold leading-[1.15] tracking-tight text-(--foreground) md:text-4xl md:leading-[1.2]">
          In Motion
        </h3>
        <div className="mt-1 h-0.5 w-16 rounded-full bg-purple-500/80 md:mt-3" />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-5 p-3 pt-4 md:gap-8 md:p-4">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-(--foreground)/75 md:text-xs">
            Flight
          </h4>
          <p className="mt-1 text-xs leading-[1.45] text-(--muted) md:text-base md:leading-[1.6]">
            Flying keeps me sharp: prepare well, stay calm, and adjust when the situation changes.
            I like the mix of discipline, freedom, and responsibility.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-(--foreground)/75 md:text-xs">
            Roads
          </h4>
          <p className="mt-1 text-xs leading-[1.45] text-(--muted) md:text-base md:leading-[1.6]">
            Long drives help me reset and think. Some of my best technical decisions start as quiet
            time on the road with a problem in the background.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-(--foreground)/75 md:text-xs">
            AI Agents
          </h4>
          <p className="mt-1 text-xs leading-[1.45] text-(--muted) md:text-base md:leading-[1.6]">
            I like building AI agents because they make software feel like a teammate. The best ones
            handle busywork, surface context, and leave people with better decisions to make.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function MobileMindsetPanel({ isInView }: { isInView: boolean }) {
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
    <div className="flex h-full min-w-full snap-center flex-col">
      <div className="z-20 shrink-0 p-4 pb-2">
        <h3 className="text-[22px] font-bold leading-[1.15] tracking-tight text-(--foreground)">
          About Me
        </h3>
        <div className="mt-1 h-0.5 w-16 rounded-full bg-purple-500/80" />
        <p className="mt-4 hyphens-auto text-pretty text-sm leading-[1.55] text-(--muted)">
          I&apos;m a software engineer who likes turning complex ideas into products people can
          actually use.
        </p>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 py-1">
        <div className="relative flex h-full w-full items-center justify-center" style={{ perspective: "1000px" }}>
          <motion.button
            type="button"
            className="absolute aspect-3/4 w-[45%] cursor-pointer overflow-hidden rounded-xl border border-(--card-border)/50 shadow-lg"
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
              style={{ objectPosition: mindsetSlides[getIndex(-1)].objectPosition }}
              sizes="40vw"
            />
          </motion.button>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={`mobile-center-${activeIndex}`}
              className="relative aspect-3/4 w-[55%] cursor-pointer overflow-hidden rounded-xl border-2 border-purple-500/30 shadow-2xl"
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
                style={{ objectPosition: mindsetSlides[activeIndex].objectPosition }}
                sizes="50vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 via-black/30 to-transparent p-2 pt-8">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                  {mindsetSlides[activeIndex].label}
                </span>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          </AnimatePresence>

          <motion.button
            type="button"
            className="absolute aspect-3/4 w-[45%] cursor-pointer overflow-hidden rounded-xl border border-(--card-border)/50 shadow-lg"
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
              style={{ objectPosition: mindsetSlides[getIndex(1)].objectPosition }}
              sizes="40vw"
            />
          </motion.button>
        </div>
      </div>

      <div className="z-20 shrink-0 border-t border-(--card-border)/30 p-4 pt-3">
        <p className="text-pretty text-sm leading-[1.55] text-(--muted)">
          Most days I&apos;m somewhere between code, flight lessons, long drives, and experiments
          with AI.
        </p>
      </div>
    </div>
  );
}

function MobileInMotionPanel() {
  return (
    <div className="flex h-full min-w-full snap-center flex-col">
      <div className="shrink-0 p-4 pb-0">
        <h3 className="text-[22px] font-bold leading-[1.15] tracking-tight text-(--foreground)">
          In Motion
        </h3>
        <div className="mt-1 h-0.5 w-16 rounded-full bg-purple-500/80" />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-8 p-4 pt-5">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-(--foreground)/75">
            Flight
          </h4>
          <p className="mt-2 text-sm leading-[1.55] text-(--muted)">
            Flying keeps me sharp: prepare well, stay calm, and adjust when the situation changes.
            I like the mix of discipline, freedom, and responsibility.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-(--foreground)/75">
            Roads
          </h4>
          <p className="mt-2 text-sm leading-[1.55] text-(--muted)">
            Long drives help me reset and think. Some of my best technical decisions start as quiet
            time on the road with a problem in the background.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-(--foreground)/75">
            AI Agents
          </h4>
          <p className="mt-2 text-sm leading-[1.55] text-(--muted)">
            I like building AI agents because they make software feel like a teammate. The best ones
            handle busywork, surface context, and leave people with better decisions to make.
          </p>
        </div>
      </div>
    </div>
  );
}

function MobileAboutMotionCarousel({ isInView }: { isInView: boolean }) {
  const [activePanel, setActivePanel] = useState(0);
  const mobileCarouselRef = useRef<HTMLDivElement | null>(null);
  const panels = ["About Me", "In Motion"];

  const scrollToPanel = (index: number) => {
    const scroller = mobileCarouselRef.current;
    if (!scroller) {
      return;
    }

    scroller.scrollTo({
      left: index * scroller.clientWidth,
      behavior: "smooth",
    });
  };

  const onPanelScroll = () => {
    const scroller = mobileCarouselRef.current;
    if (!scroller) {
      return;
    }

    const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
    setActivePanel(Math.min(Math.max(nextIndex, 0), panels.length - 1));
  };

  return (
    <motion.div
      custom={4}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="col-span-1 md:hidden"
    >
      <div
        ref={mobileCarouselRef}
        onScroll={onPanelScroll}
        className="scrollbar-hide flex h-[38rem] snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) backdrop-blur-sm sm:h-[40rem]"
        aria-label="About and In Motion"
      >
        <MobileMindsetPanel isInView={isInView} />
        <MobileInMotionPanel />
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {panels.map((panel, index) => (
          <button
            key={panel}
            type="button"
            onClick={() => scrollToPanel(index)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: activePanel === index ? "1.5rem" : "0.5rem",
              backgroundColor: activePanel === index ? "var(--accent)" : "var(--card-border)",
            }}
            aria-label={`Show ${panel}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

function LocationCard({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      custom={3}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative col-span-1 aspect-[4/3] overflow-hidden rounded-2xl border border-(--card-border) bg-(--card) backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 md:col-start-2 md:row-start-3 md:aspect-auto md:h-full"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/about/map.jpg"
          alt="Map Background"
          fill
          className="scale-125 translate-y-4 object-cover opacity-50 grayscale mix-blend-luminosity"
          sizes="(max-width: 768px) 100vw, 33vw"
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

function MindsetCard({ isInView }: { isInView: boolean }) {
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
      className="group relative col-span-1 hidden h-[36rem] min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 sm:h-[38rem] md:col-start-1 md:row-span-2 md:row-start-2 md:flex md:h-full"
    >
      <div className="z-20 shrink-0 p-3 pb-2 md:p-4 md:pb-0">
        <div>
          <h3 className="text-[22px] font-bold leading-[1.15] tracking-tight text-(--foreground) md:text-4xl md:leading-[1.2]">
            About Me
          </h3>
          <div className="mt-1 h-0.5 w-16 rounded-full bg-purple-500/80 md:mt-3" />
        </div>
        <p className="mt-4 hyphens-auto text-pretty text-xs leading-[1.45] text-(--muted) md:text-base md:leading-[1.6]">
          I&apos;m a software engineer who likes turning complex ideas into products people can
          actually use.
        </p>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 py-0 pb-3 md:pb-0">
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
              style={{ objectPosition: mindsetSlides[getIndex(-1)].objectPosition }}
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
                style={{ objectPosition: mindsetSlides[activeIndex].objectPosition }}
                sizes="(max-width: 768px) 40vw, 25vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 via-black/30 to-transparent p-1 pt-6 md:p-3 md:pt-8">
                <span className="text-[8px] font-bold uppercase tracking-wider text-white md:text-xs">
                  {mindsetSlides[activeIndex].label}
                </span>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
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
              style={{ objectPosition: mindsetSlides[getIndex(1)].objectPosition }}
              sizes="(max-width: 768px) 25vw, 18vw"
            />
          </motion.button>
        </div>
      </div>

      <div className="z-20 shrink-0 border-t border-(--card-border)/30 p-3 pt-3 md:block md:p-3.5 md:pt-0">
        <p className="text-pretty text-sm leading-[1.55] text-(--muted) md:text-base md:leading-[1.6]">
          Most days I&apos;m somewhere between code, flight lessons, long drives, and experiments
          with AI.
        </p>
      </div>
    </motion.div>
  );
}

function CenterPortrait({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      custom={6}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative col-start-2 row-start-2 hidden aspect-square h-full w-full overflow-hidden rounded-2xl border border-(--card-border) bg-black md:block"
    >
      <Image
        src="/about/rami-profile.jpeg"
        alt="Rami portrait"
        fill
        className="object-cover"
        sizes="(min-width: 768px) 33vw"
        priority
      />
    </motion.div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="mx-auto max-w-6xl px-3 md:px-4"
      style={{ scrollMarginTop: "120px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14 text-center"
      >
        <h2 className="px-2 text-3xl font-bold tracking-tight text-pretty sm:text-5xl md:text-6xl">
          <span className="text-gradient-shimmer">About</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:grid-rows-[9rem_auto_9rem] md:gap-3">
        <NameCard isInView={isInView} />
        <NameCard isInView={isInView} desktop />
        <PortraitTile isInView={isInView} />
        <InfoStrip isInView={isInView} />
        <MobileAboutMotionCarousel isInView={isInView} />
        <CraftCard isInView={isInView} />
        <LocationCard isInView={isInView} />
        <MindsetCard isInView={isInView} />
        <CenterPortrait isInView={isInView} />
      </div>
    </section>
  );
}
