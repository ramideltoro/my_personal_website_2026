"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiCplusplus,
  SiCss,
  SiDocker,
  SiExpo,
  SiFigma,
  SiGit,
  SiGithub,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";

type Vec3 = {
  x: number;
  y: number;
  z: number;
};

type Skill = {
  name: string;
  icon: IconType;
  color?: string;
};

type SkillPoint = Skill & {
  start: Vec3;
  target: Vec3;
};

type ProjectedSkill = Skill & {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  grayscale: number;
  showText: boolean;
  zIndex: number;
  pointerEvents: "auto" | "none";
};

const SPHERE_RADIUS = 3;
const CAMERA_DISTANCE = 14;
const LERP_FACTOR = 0.07;

const skills: Skill[] = [
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "CSS", icon: SiCss, color: "#1572B6" },
  { name: "C++", icon: SiCplusplus, color: "#00599C" },
  { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
  { name: "Expo", icon: SiExpo },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "GitHub", icon: SiGithub, color: "#ffffff" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  { name: "Vercel", icon: SiVercel, color: "#ffffff" },
];

const skillNames = skills.map((skill) => skill.name).join(", ");

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const progress = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return progress * progress * (3 - 2 * progress);
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function listenToMediaQuery(media: MediaQueryList, listener: () => void) {
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }

  media.addListener(listener);
  return () => media.removeListener(listener);
}

function deterministicSpread(index: number, axis: number) {
  const value = Math.sin((index + 1) * (axis * 35.713 + 91.33)) * 10000;
  return value - Math.floor(value);
}

function createSkillPoints() {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  return skills.map((skill, index) => {
    const y = 1 - (2 / skills.length) * (index + 0.5);
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * index;

    return {
      ...skill,
      target: {
        x: Math.cos(theta) * radiusAtY * SPHERE_RADIUS,
        y: y * SPHERE_RADIUS,
        z: Math.sin(theta) * radiusAtY * SPHERE_RADIUS,
      },
      start: {
        x: (deterministicSpread(index, 1) - 0.5) * 18,
        y: (deterministicSpread(index, 2) - 0.5) * 18,
        z: (deterministicSpread(index, 3) - 0.5) * 18,
      },
    };
  });
}

function rotatePoint(point: Vec3, rotationX: number, rotationY: number) {
  const cosY = Math.cos(rotationY);
  const sinY = Math.sin(rotationY);
  const cosX = Math.cos(rotationX);
  const sinX = Math.sin(rotationX);

  const x = point.x * cosY + point.z * sinY;
  const z = -point.x * sinY + point.z * cosY;
  const y = point.y * cosX - z * sinX;

  return {
    x,
    y,
    z: point.y * sinX + z * cosX,
  };
}

function getProjectedPoint(point: Vec3, width: number, height: number, rotationX: number, rotationY: number) {
  const rotated = rotatePoint(point, rotationX, rotationY);
  const radiusPixels = Math.min(width, height) * 0.35;
  const scale = radiusPixels / SPHERE_RADIUS;
  const perspective = CAMERA_DISTANCE / (CAMERA_DISTANCE - rotated.z);

  return {
    ...rotated,
    x: width / 2 + rotated.x * scale * perspective,
    y: height / 2 + rotated.y * scale * perspective,
    perspective,
  };
}

function drawWireframe(
  canvas: HTMLCanvasElement,
  points: SkillPoint[],
  currentPositions: Vec3[],
  rotationX: number,
  rotationY: number,
) {
  const context = canvas.getContext("2d");
  const bounds = canvas.getBoundingClientRect();

  if (!context || bounds.width === 0 || bounds.height === 0) {
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = bounds.width;
  const height = bounds.height;

  if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  const radiusPixels = Math.min(width, height) * 0.35;
  const centerX = width / 2;
  const centerY = height / 2;

  const glow = context.createRadialGradient(centerX, centerY, radiusPixels * 0.05, centerX, centerY, radiusPixels * 1.15);
  glow.addColorStop(0, "rgba(99, 102, 241, 0.08)");
  glow.addColorStop(0.58, "rgba(139, 92, 246, 0.025)");
  glow.addColorStop(1, "rgba(10, 10, 15, 0)");
  context.fillStyle = glow;
  context.beginPath();
  context.arc(centerX, centerY, radiusPixels * 1.2, 0, Math.PI * 2);
  context.fill();

  context.lineWidth = 1;
  context.strokeStyle = "rgba(99, 102, 241, 0.07)";

  const drawPath = (path: Vec3[]) => {
    context.beginPath();

    path.forEach((point, index) => {
      const projected = getProjectedPoint(point, width, height, rotationX, rotationY);

      if (index === 0) {
        context.moveTo(projected.x, projected.y);
      } else {
        context.lineTo(projected.x, projected.y);
      }
    });

    context.stroke();
  };

  for (let latitude = -60; latitude <= 60; latitude += 20) {
    const latitudeRadians = (latitude * Math.PI) / 180;
    const y = Math.sin(latitudeRadians) * SPHERE_RADIUS;
    const ringRadius = Math.cos(latitudeRadians) * SPHERE_RADIUS;
    const path: Vec3[] = [];

    for (let index = 0; index <= 96; index += 1) {
      const angle = (index / 96) * Math.PI * 2;
      path.push({
        x: Math.cos(angle) * ringRadius,
        y,
        z: Math.sin(angle) * ringRadius,
      });
    }

    drawPath(path);
  }

  for (let longitude = 0; longitude < 12; longitude += 1) {
    const offset = (longitude / 12) * Math.PI * 2;
    const path: Vec3[] = [];

    for (let index = 0; index <= 96; index += 1) {
      const angle = -Math.PI / 2 + (index / 96) * Math.PI;
      const ringRadius = Math.cos(angle) * SPHERE_RADIUS;

      path.push({
        x: Math.cos(offset) * ringRadius,
        y: Math.sin(angle) * SPHERE_RADIUS,
        z: Math.sin(offset) * ringRadius,
      });
    }

    drawPath(path);
  }

  context.strokeStyle = "rgba(139, 92, 246, 0.16)";
  context.beginPath();
  context.arc(centerX, centerY, radiusPixels * 1.02, 0, Math.PI * 2);
  context.stroke();

  currentPositions.forEach((point, index) => {
    const projected = getProjectedPoint(point, width, height, rotationX, rotationY);
    const depth = clamp((projected.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2), 0, 1);

    context.fillStyle = points[index].color
      ? `rgba(139, 92, 246, ${0.04 + depth * 0.13})`
      : `rgba(255, 255, 255, ${0.04 + depth * 0.08})`;
    context.beginPath();
    context.arc(projected.x, projected.y, 2.2 + depth * 1.8, 0, Math.PI * 2);
    context.fill();
  });
}

function SkillsGlobe({ isInView }: { isInView: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const points = useMemo(createSkillPoints, []);
  const currentPositions = useRef(points.map((point) => ({ ...point.start })));
  const rotation = useRef({ x: 0.08, y: 0 });
  const scrollVelocity = useRef(0);
  const lastScrollY = useRef(0);
  const dragging = useRef({ active: false, x: 0, y: 0 });
  const reduceMotion = useRef(false);
  const isMobileGlobeRef = useRef(false);
  const [isMobileGlobe, setIsMobileGlobe] = useState(false);
  const [isAssembled, setIsAssembled] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const hoveredSkillRef = useRef<string | null>(null);
  const isAssembledRef = useRef(false);
  const [projectedSkills, setProjectedSkills] = useState<ProjectedSkill[]>([]);

  useEffect(() => {
    hoveredSkillRef.current = hoveredSkill;
  }, [hoveredSkill]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      reduceMotion.current = media.matches;
    };

    syncPreference();
    return listenToMediaQuery(media, syncPreference);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => {
      isMobileGlobeRef.current = media.matches;
      setIsMobileGlobe(media.matches);
    };

    syncViewport();
    return listenToMediaQuery(media, syncViewport);
  }, []);

  useEffect(() => {
    if (!isInView || isAssembled) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsAssembled(true);
      isAssembledRef.current = true;
    }, 100);

    return () => window.clearTimeout(timeout);
  }, [isAssembled, isInView]);

  useEffect(() => {
    isAssembledRef.current = isAssembled;
  }, [isAssembled]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const updateScrollVelocity = () => {
      const nextScrollY = window.scrollY;

      if (isMobileGlobeRef.current) {
        scrollVelocity.current = 0;
        lastScrollY.current = nextScrollY;
        return;
      }

      const delta = nextScrollY - lastScrollY.current;
      scrollVelocity.current = Math.abs(delta) > 120 ? 0 : delta * 0.001;
      lastScrollY.current = nextScrollY;
    };

    window.addEventListener("scroll", updateScrollVelocity, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollVelocity);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastRenderTime: number | null = null;

    const tick = (timestamp: number) => {
      const canvas = canvasRef.current;
      const root = rootRef.current;
      const mobileMode = isMobileGlobeRef.current;

      if (mobileMode && lastRenderTime !== null && timestamp - lastRenderTime < 1000 / 30) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      const elapsed = lastRenderTime === null ? 1000 / 60 : Math.min(timestamp - lastRenderTime, 100);
      const frameScale = mobileMode ? elapsed / (1000 / 60) : 1;
      const positionLerpFactor = mobileMode ? 1 - Math.pow(1 - LERP_FACTOR, frameScale) : LERP_FACTOR;
      lastRenderTime = timestamp;

      if (canvas && root) {
        const { width, height } = root.getBoundingClientRect();

        if (width > 0 && height > 0) {
          if (isAssembledRef.current && !reduceMotion.current && !dragging.current.active) {
            rotation.current.y += (0.0005 + scrollVelocity.current) * frameScale;
            scrollVelocity.current *= 0.95;
          }

          const nextProjected: ProjectedSkill[] = points.map((point, index) => {
            const current = currentPositions.current[index];
            const target = isAssembledRef.current || reduceMotion.current ? point.target : point.start;

            current.x = reduceMotion.current ? target.x : lerp(current.x, target.x, positionLerpFactor);
            current.y = reduceMotion.current ? target.y : lerp(current.y, target.y, positionLerpFactor);
            current.z = reduceMotion.current ? target.z : lerp(current.z, target.z, positionLerpFactor);

            const projected = getProjectedPoint(current, width, height, rotation.current.x, rotation.current.y);
            const cameraAlignment = clamp(projected.z / SPHERE_RADIUS, -1, 1);
            const visibility = smoothstep(0, 0.7, cameraAlignment);
            const isHovered = hoveredSkillRef.current === point.name;
            const opacity = isHovered ? 1 : lerp(0.15, 1, visibility);
            const scale = isHovered ? 1.4 : lerp(0.6, 1.1, visibility);
            const grayscale = isHovered ? 0 : 1 - visibility;

            return {
              name: point.name,
              icon: point.icon,
              color: point.color,
              x: projected.x,
              y: projected.y,
              opacity: isAssembledRef.current || reduceMotion.current ? opacity : 0,
              scale,
              grayscale,
              showText: isHovered || cameraAlignment > 0.85,
              zIndex: Math.floor((CAMERA_DISTANCE + projected.z) * 10),
              pointerEvents: opacity > 0.4 ? "auto" : "none",
            };
          });

          drawWireframe(canvas, points, currentPositions.current, rotation.current.x, rotation.current.y);
          setProjectedSkills(nextProjected);
        }
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [points]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isMobileGlobeRef.current && event.pointerType === "touch") {
      return;
    }

    dragging.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isMobileGlobeRef.current && event.pointerType === "touch") {
      return;
    }

    if (!dragging.current.active) {
      return;
    }

    const deltaX = event.clientX - dragging.current.x;
    const deltaY = event.clientY - dragging.current.y;

    rotation.current.y += deltaX * 0.006;
    rotation.current.x = clamp(rotation.current.x - deltaY * 0.004, -0.9, 0.9);
    dragging.current.x = event.clientX;
    dragging.current.y = event.clientY;
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current.active) {
      return;
    }

    dragging.current.active = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={`Animated sphere of technology skills: ${skillNames}`}
      className="relative z-0 h-[37.5rem] w-full touch-pan-y select-none sm:h-[37.5rem] md:h-[50rem] md:touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden="true" />

      {projectedSkills.map((skill) => {
        const Icon = skill.icon;
        const color = skill.color ?? "#ffffff";
        const isHovered = hoveredSkill === skill.name;

        return (
          <div
            key={skill.name}
            className="absolute left-0 top-0 flex cursor-pointer flex-col items-center justify-center will-change-transform md:transition-transform md:duration-300 md:ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
            style={{
              opacity: skill.opacity,
              pointerEvents: skill.pointerEvents,
              transform: isMobileGlobe
                ? `translate(${skill.x}px, ${skill.y}px) translate(-50%, -50%) scale(${skill.scale})`
                : `translate3d(${skill.x}px, ${skill.y}px, 0) translate(-50%, -50%) scale(${skill.scale})`,
              zIndex: skill.zIndex,
            }}
            onMouseEnter={() => setHoveredSkill(skill.name)}
            onMouseLeave={() => setHoveredSkill(null)}
            aria-hidden="true"
          >
            <div className="relative z-10 drop-shadow-md transition-all duration-300">
              <Icon
                className="h-8 w-8 sm:h-[42px] sm:w-[42px]"
                style={{
                  color: isHovered ? "#ffffff" : color,
                  filter: isHovered
                    ? `drop-shadow(0 0 20px ${color})`
                    : isMobileGlobe
                      ? `grayscale(${skill.grayscale * 80}%) brightness(${0.62 + (1 - skill.grayscale) * 0.38})`
                    : `grayscale(${skill.grayscale * 100}%) brightness(${0.5 + (1 - skill.grayscale) * 0.5}) blur(${
                        skill.grayscale * 0.5
                      }px)`,
                  transition: isMobileGlobe ? "color 0.2s ease" : "filter 0.3s ease, color 0.3s ease",
                }}
              />
            </div>
            <span
              className="mt-2 whitespace-nowrap rounded-full px-2 py-0.5 text-center text-[10px] font-bold uppercase tracking-widest"
              style={{
                color: isHovered ? "#ffffff" : "#71717a",
                background: isHovered ? `${color}90` : "transparent",
                opacity: skill.showText ? 1 : 0,
                transform: isHovered ? "translateY(4px) scale(1.05)" : "translateY(0) scale(1)",
                transition: isMobileGlobe
                  ? "opacity 0.2s ease, color 0.2s ease, background-color 0.2s ease"
                  : "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              {skill.name}
            </span>
          </div>
        );
      })}

      <ul className="sr-only">
        {skills.map((skill) => (
          <li key={skill.name}>{skill.name}</li>
        ))}
      </ul>
    </div>
  );
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative overflow-hidden pt-0 pb-32"
      style={{ scrollMarginTop: "100px" }}
    >
      <div className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="px-2 text-3xl font-bold tracking-tight text-pretty sm:text-5xl md:text-6xl"
          >
            <span className="text-gradient-shimmer">Skills</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="relative w-full -mt-8 sm:-mt-14 md:-mt-[7.5rem]"
        >
          <SkillsGlobe isInView={isInView} />
        </motion.div>
      </div>
    </section>
  );
}
