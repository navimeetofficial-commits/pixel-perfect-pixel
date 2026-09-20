import { motion } from "motion/react";

export type TeacherState =
  | "idle"
  | "teaching"
  | "listening"
  | "celebrating"
  | "correcting"
  | "nopeek";

const bodyAnim: Record<TeacherState, Record<string, unknown>> = {
  idle: { y: [0, -3, 0], scaleY: [1, 1.015, 1], rotate: 0 },
  teaching: { y: [0, -4, 0], scaleY: [1, 1.02, 1], rotate: -2 },
  listening: { y: [0, -2, 0], scaleY: [1, 1.01, 1], rotate: 2 },
  celebrating: { y: [0, -14, 0], scaleY: 1, rotate: 0 },
  correcting: { y: [0, -2, 0], scaleY: [1, 1.01, 1], rotate: 0 },
  nopeek: { y: 0, scaleY: 1, rotate: 0 },
};

const headAnim: Record<TeacherState, Record<string, unknown>> = {
  idle: { rotate: [-3, 3, -3], x: [0, 2, 0] },
  teaching: { rotate: [-6, -2, -6], x: 0 },
  listening: { rotate: [10, 8, 10], x: 0 },
  celebrating: { rotate: [-8, 8, -8], x: 0 },
  correcting: { rotate: [4, -4, 4], x: 0 },
  nopeek: { rotate: 0, x: 0 },
};

const rightArmAnim: Record<TeacherState, Record<string, unknown>> = {
  idle: { rotate: [4, -4, 4] },
  teaching: { rotate: [-58, -48, -58] },
  listening: { rotate: 10 },
  celebrating: { rotate: [-140, -155, -140] },
  correcting: { rotate: -20 },
  nopeek: { rotate: -95 },
};

const leftArmAnim: Record<TeacherState, Record<string, unknown>> = {
  idle: { rotate: [-4, 4, -4] },
  teaching: { rotate: [14, 4, 14] },
  listening: { rotate: -8 },
  celebrating: { rotate: [140, 155, 140] },
  correcting: { rotate: 12 },
  nopeek: { rotate: 8 },
};

const loop = (duration: number) => ({
  duration,
  repeat: Infinity,
  ease: "easeInOut" as const,
});

export function Teacher({ state }: { state: TeacherState }) {
  const talking = state === "teaching";
  const happy = state === "celebrating";
  const gentle = state === "correcting";

  return (
    <svg
      viewBox="0 0 220 360"
      className="h-full w-full max-h-[62vh] drop-shadow-[0_18px_24px_rgba(60,40,20,0.25)]"
      aria-label="AI teacher character"
    >
      {/* Layer 1 — body */}
      <motion.g
        style={{ originX: "110px", originY: "340px" }}
        animate={bodyAnim[state]}
        transition={loop(state === "celebrating" ? 0.7 : 3.4)}
      >
        <ellipse cx="110" cy="348" rx="62" ry="9" fill="oklch(0.45 0.05 60 / 0.25)" />
        {/* legs */}
        <rect x="86" y="250" width="20" height="92" rx="10" fill="oklch(0.34 0.04 250)" />
        <rect x="114" y="250" width="20" height="92" rx="10" fill="oklch(0.3 0.04 250)" />
        <rect x="78" y="332" width="34" height="14" rx="7" fill="oklch(0.28 0.02 60)" />
        <rect x="110" y="332" width="34" height="14" rx="7" fill="oklch(0.24 0.02 60)" />
        {/* torso */}
        <path
          d="M72 150 q38 -16 76 0 l12 108 q-50 14 -100 0 Z"
          fill="oklch(0.55 0.13 235)"
        />
        <path d="M104 148 l6 44 l6 -44 z" fill="oklch(0.78 0.15 65)" />
        <path
          d="M72 150 q38 -16 76 0 l-8 18 q-30 -12 -60 0 Z"
          fill="oklch(0.66 0.11 235)"
        />
      </motion.g>

      {/* Layer 3 — left arm */}
      <motion.g
        style={{ originX: "78px", originY: "160px" }}
        animate={leftArmAnim[state]}
        transition={loop(2.2)}
      >
        <rect x="58" y="158" width="20" height="82" rx="10" fill="oklch(0.55 0.13 235)" />
        <circle cx="68" cy="246" r="13" fill="var(--skin)" />
      </motion.g>

      {/* Layer 3 — right arm (pointing / raising) */}
      <motion.g
        style={{ originX: "144px", originY: "160px" }}
        animate={rightArmAnim[state]}
        transition={loop(state === "celebrating" ? 0.7 : 2.4)}
      >
        <rect
          x="142"
          y="158"
          width="20"
          height="82"
          rx="10"
          fill="oklch(0.55 0.13 235)"
        />
        <circle cx="152" cy="246" r="13" fill="var(--skin)" />
        {state === "teaching" && (
          <rect x="160" y="240" width="18" height="7" rx="3.5" fill="var(--skin)" />
        )}
      </motion.g>

      {/* Layer 2 — head */}
      <motion.g
        style={{ originX: "110px", originY: "150px" }}
        animate={headAnim[state]}
        transition={loop(state === "listening" ? 2.6 : 4)}
      >
        <rect x="100" y="132" width="20" height="22" rx="8" fill="var(--skin-shade)" />
        <circle cx="110" cy="92" r="44" fill="var(--skin)" />
        {/* hair */}
        <path
          d="M66 86 q6 -46 44 -46 q38 0 44 46 q-14 -20 -44 -20 q-30 0 -44 20z"
          fill="oklch(0.3 0.03 50)"
        />
        {/* ears */}
        <circle cx="66" cy="96" r="8" fill="var(--skin-shade)" />
        <circle cx="154" cy="96" r="8" fill="var(--skin-shade)" />
        {/* eyebrows */}
        <motion.g
          animate={{ y: happy ? -5 : gentle ? 2 : 0, rotate: gentle ? -4 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <rect x="82" y="74" width="22" height="5" rx="2.5" fill="oklch(0.3 0.03 50)" />
          <rect x="116" y="74" width="22" height="5" rx="2.5" fill="oklch(0.3 0.03 50)" />
        </motion.g>
        {/* eyes with blinking */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.08, 1] }}
          transition={{ duration: 0.34, repeat: Infinity, repeatDelay: 3.1 }}
          style={{ originY: "92px" }}
        >
          <ellipse cx="93" cy="92" rx="9" ry="10" fill="white" />
          <ellipse cx="127" cy="92" rx="9" ry="10" fill="white" />
          <motion.g
            animate={
              state === "listening"
                ? { x: 0 }
                : state === "idle"
                  ? { x: [-3, 3, -3] }
                  : { x: -3 }
            }
            transition={loop(4.5)}
          >
            <circle cx="93" cy="93" r="4.5" fill="oklch(0.25 0.04 250)" />
            <circle cx="127" cy="93" r="4.5" fill="oklch(0.25 0.04 250)" />
          </motion.g>
        </motion.g>
        {/* mouth */}
        {talking ? (
          <motion.ellipse
            cx="110"
            cy="116"
            rx="11"
            fill="oklch(0.38 0.09 25)"
            animate={{ ry: [2, 8, 3, 7, 2] }}
            transition={loop(0.6)}
          />
        ) : happy ? (
          <path
            d="M92 110 q18 22 36 0 q-18 10 -36 0z"
            fill="oklch(0.38 0.09 25)"
          />
        ) : (
          <path
            d={gentle ? "M96 116 q14 6 28 0" : "M96 114 q14 10 28 0"}
            stroke="oklch(0.38 0.09 25)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {/* glasses */}
        <g stroke="oklch(0.35 0.03 60)" strokeWidth="3" fill="none">
          <circle cx="93" cy="92" r="14" />
          <circle cx="127" cy="92" r="14" />
          <path d="M107 92 h6" />
        </g>
      </motion.g>
    </svg>
  );
}
