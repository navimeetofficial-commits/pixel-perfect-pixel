import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type TeacherPose =
  | "idle"
  | "waving"
  | "teaching"
  | "pointing"
  | "explaining"
  | "listening"
  | "thinking"
  | "celebrating"
  | "nopeek";

type Expression = "neutral" | "smile" | "big" | "curious" | "focused";

const expressionFor: Record<TeacherPose, Expression> = {
  idle: "smile",
  waving: "big",
  teaching: "focused",
  pointing: "focused",
  explaining: "smile",
  listening: "curious",
  thinking: "curious",
  celebrating: "big",
  nopeek: "focused",
};

const loop = (duration: number, delay = 0) => ({
  duration,
  delay,
  repeat: Infinity,
  ease: "easeInOut" as const,
});

const body: Record<TeacherPose, TargetAndTransition> = {
  idle: { y: [0, -3, 0], scaleY: [1, 1.015, 1], rotate: 0 },
  waving: { y: [0, -5, 0], scaleY: 1, rotate: -2 },
  teaching: { y: [0, -4, 0], scaleY: [1, 1.02, 1], rotate: -3 },
  pointing: { y: [0, -3, 0], scaleY: 1, rotate: -5 },
  explaining: { y: [0, -4, 0], scaleY: [1, 1.02, 1], rotate: [2, -2, 2] },
  listening: { y: [0, -2, 0], scaleY: [1, 1.01, 1], rotate: 3 },
  thinking: { y: [0, -2, 0], scaleY: 1, rotate: -2 },
  celebrating: { y: [0, -16, 0], scaleY: 1, rotate: [-3, 3, -3] },
  nopeek: { y: [0, -2, 0], scaleY: 1, rotate: 0 },
};

const head: Record<TeacherPose, TargetAndTransition> = {
  idle: { rotate: [-3, 3, -3], x: [0, 2, 0] },
  waving: { rotate: [-6, 2, -6], x: 0 },
  teaching: { rotate: [-7, -2, -7], x: 0 },
  pointing: { rotate: [-10, -6, -10], x: 0 },
  explaining: { rotate: [4, -4, 4], x: [0, -2, 0] },
  listening: { rotate: [11, 8, 11], x: 0 },
  thinking: { rotate: [-12, -9, -12], x: 0 },
  celebrating: { rotate: [-9, 9, -9], x: 0 },
  nopeek: { rotate: [2, -2, 2], x: 0 },
};

const rightArm: Record<TeacherPose, TargetAndTransition> = {
  idle: { rotate: [4, -4, 4] },
  waving: { rotate: [-140, -170, -140] },
  teaching: { rotate: [-58, -44, -58] },
  pointing: { rotate: [-78, -72, -78] },
  explaining: { rotate: [-40, -70, -40] },
  listening: { rotate: 10 },
  thinking: { rotate: -118 },
  celebrating: { rotate: [-142, -162, -142] },
  nopeek: { rotate: -96 },
};

const leftArm: Record<TeacherPose, TargetAndTransition> = {
  idle: { rotate: [-4, 4, -4] },
  waving: { rotate: [8, 2, 8] },
  teaching: { rotate: [14, 4, 14] },
  pointing: { rotate: 10 },
  explaining: { rotate: [60, 34, 60] },
  listening: { rotate: -8 },
  thinking: { rotate: 6 },
  celebrating: { rotate: [142, 162, 142] },
  nopeek: { rotate: 8 },
};

// where the eyes rest for each pose (before cursor tracking is added on top)
const gazeFor: Record<TeacherPose, [number, number]> = {
  idle: [0, 0],
  waving: [0, -1],
  teaching: [-3, 0],
  pointing: [-4, 0],
  explaining: [0, 0],
  listening: [0, 1],
  thinking: [3, -3],
  celebrating: [0, -2],
  nopeek: [0, 0],
};

const speed: Record<TeacherPose, number> = {
  idle: 3.4,
  waving: 0.7,
  teaching: 2.2,
  pointing: 2,
  explaining: 1.6,
  listening: 2.8,
  thinking: 3,
  celebrating: 0.7,
  nopeek: 2.4,
};

export function Teacher({
  pose = "idle",
  speech,
  draggable = true,
  onPoke,
  className = "",
}: {
  pose?: TeacherPose;
  speech?: string | null;
  draggable?: boolean;
  onPoke?: () => void;
  className?: string;
}) {
  const expression = expressionFor[pose];
  const talking = pose === "teaching" || pose === "explaining";
  const t = speed[pose];
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dragged, setDragged] = useState(false);
  const movedRef = useRef(false);
  const rafRef = useRef(0);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!dragged) return;
    const id = setTimeout(() => setDragged(false), 1200);
    return () => clearTimeout(id);
  }, [dragged]);

  // eyes follow the cursor around the page
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.28;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const d = Math.hypot(dx, dy) || 1;
        const m = Math.min(1, d / 320);
        setGaze({ x: (dx / d) * 4.5 * m, y: (dy / d) * 3.5 * m });
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const g = gazeFor[pose];

  return (
    <motion.div
      ref={wrapRef}
      drag={draggable}
      dragMomentum={false}
      dragElastic={0.12}
      onDragStart={() => {
        setDragged(true);
        movedRef.current = true;
      }}
      onDragEnd={() => setTimeout(() => (movedRef.current = false), 120)}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      whileHover={{ scale: 1.04, y: -5 }}
      onTap={() => {
        if (!movedRef.current) onPoke?.();
      }}
      className={`pointer-events-auto flex select-none flex-col items-end justify-end ${
        draggable ? "cursor-grab touch-none" : ""
      } ${className}`}
    >
      <AnimatePresence>
        {speech && (
          <motion.div
            key={speech}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mb-1 w-[min(250px,60vw)] rounded-2xl rounded-br-sm border border-border bg-card px-3 py-2 text-xs leading-snug text-foreground shadow-soft sm:text-sm"
          >
            {speech}
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        viewBox="0 0 220 360"
        className="h-auto w-full drop-shadow-[0_14px_20px_rgba(0,0,0,0.18)]"
        aria-label="Animated AI teacher"
      >
        {/* Layer 1 — body */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          animate={body[pose]}
          transition={loop(t)}
        >
          <ellipse cx="110" cy="348" rx="58" ry="8" fill="oklch(0.2 0 0 / 0.16)" />
          <rect x="86" y="250" width="20" height="92" rx="10" fill="oklch(0.36 0.02 260)" />
          <rect x="114" y="250" width="20" height="92" rx="10" fill="oklch(0.3 0.02 260)" />
          <rect x="78" y="332" width="34" height="14" rx="7" fill="oklch(0.25 0.01 260)" />
          <rect x="110" y="332" width="34" height="14" rx="7" fill="oklch(0.21 0.01 260)" />
          <path d="M72 150 q38 -16 76 0 l12 108 q-50 14 -100 0 Z" fill="var(--teach-shirt)" />
          <path
            d="M72 150 q38 -16 76 0 l-8 18 q-30 -12 -60 0 Z"
            fill="var(--teach-shirt-light)"
          />
          <path d="M104 148 l6 44 l6 -44 z" fill="oklch(0.98 0 0 / 0.85)" />
        </motion.g>

        {/* Layer 3 — left arm */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "50% 4%" }}
          animate={leftArm[pose]}
          transition={loop(t + 0.3)}
        >
          <rect x="58" y="158" width="20" height="82" rx="10" fill="var(--teach-shirt)" />
          <circle cx="68" cy="246" r="13" fill="var(--skin)" />
        </motion.g>

        {/* Layer 3 — right arm */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "50% 4%" }}
          animate={rightArm[pose]}
          transition={loop(t)}
        >
          <rect x="142" y="158" width="20" height="82" rx="10" fill="var(--teach-shirt)" />
          <circle cx="152" cy="246" r="13" fill="var(--skin)" />
          {(pose === "pointing" || pose === "teaching") && (
            <rect x="160" y="240" width="18" height="7" rx="3.5" fill="var(--skin)" />
          )}
        </motion.g>

        {/* Layer 2 — head */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          animate={head[pose]}
          transition={loop(t + 0.8)}
        >
          <rect x="100" y="132" width="20" height="22" rx="8" fill="var(--skin-shade)" />
          <circle cx="110" cy="92" r="44" fill="var(--skin)" />
          <path
            d="M66 86 q6 -46 44 -46 q38 0 44 46 q-14 -20 -44 -20 q-30 0 -44 20z"
            fill="oklch(0.28 0.02 40)"
          />
          <circle cx="66" cy="96" r="8" fill="var(--skin-shade)" />
          <circle cx="154" cy="96" r="8" fill="var(--skin-shade)" />

          {/* eyebrows */}
          <motion.g
            animate={{
              y: expression === "big" ? -6 : expression === "curious" ? -3 : 0,
              rotate: expression === "focused" ? -3 : 0,
            }}
            transition={{ duration: 0.35 }}
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
          >
            <rect x="82" y="74" width="22" height="5" rx="2.5" fill="oklch(0.28 0.02 40)" />
            <rect x="116" y="74" width="22" height="5" rx="2.5" fill="oklch(0.28 0.02 40)" />
          </motion.g>

          {/* eyes + blink + cursor tracking */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.08, 1] }}
            transition={{ duration: 0.34, repeat: Infinity, repeatDelay: 2.9 }}
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
          >
            <ellipse cx="93" cy="92" rx="9" ry="10" fill="white" />
            <ellipse cx="127" cy="92" rx="9" ry="10" fill="white" />
            <motion.g
              animate={{ x: gaze.x + g[0], y: gaze.y + g[1] }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
            >
              <circle cx="93" cy="93" r="4.5" fill="oklch(0.2 0.02 260)" />
              <circle cx="127" cy="93" r="4.5" fill="oklch(0.2 0.02 260)" />
            </motion.g>
          </motion.g>

          {/* mouth */}
          {talking ? (
            <motion.ellipse
              cx="110"
              cy="116"
              rx="11"
              ry={6}
              fill="oklch(0.36 0.08 25)"
              style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
              animate={{ scaleY: [0.3, 1.3, 0.5, 1.1, 0.3], scaleX: [1, 0.85, 1, 0.9, 1] }}
              transition={loop(0.55)}
            />
          ) : expression === "big" ? (
            <path d="M92 110 q18 22 36 0 q-18 10 -36 0z" fill="oklch(0.36 0.08 25)" />
          ) : expression === "curious" ? (
            <circle cx="110" cy="115" r="5" fill="oklch(0.36 0.08 25)" />
          ) : (
            <path
              d={expression === "focused" ? "M97 115 q13 5 26 0" : "M96 113 q14 10 28 0"}
              stroke="oklch(0.36 0.08 25)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* glasses */}
          <g stroke="oklch(0.3 0.01 260)" strokeWidth="3" fill="none">
            <circle cx="93" cy="92" r="14" />
            <circle cx="127" cy="92" r="14" />
            <path d="M107 92 h6" />
          </g>

          {/* thinking bubbles */}
          {pose === "thinking" && (
            <motion.g
              animate={{ opacity: [0.2, 1, 0.2], y: [0, -6, 0] }}
              transition={loop(1.8)}
              fill="var(--muted-foreground)"
            >
              <circle cx="168" cy="52" r="4" />
              <circle cx="180" cy="38" r="6" />
            </motion.g>
          )}
        </motion.g>
      </svg>
    </motion.div>
  );
}
