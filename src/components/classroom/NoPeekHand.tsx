import { motion } from "motion/react";

export function NoPeekHand({
  prompt,
  onAnswer,
}: {
  prompt: string;
  onAnswer: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/45 backdrop-blur-md"
      />

      {/* palm grows from the teacher's corner until it covers the content */}
      <motion.svg
        viewBox="0 0 200 220"
        initial={{ scale: 0.12, x: "38vw", y: "40vh", rotate: -35, opacity: 0 }}
        animate={{ scale: 1, x: 0, y: 0, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.15, x: "38vw", y: "40vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
        className="absolute h-[92vh] w-[92vw] max-w-[820px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
        aria-hidden
      >
        <g fill="var(--skin)" stroke="var(--skin-shade)" strokeWidth="3">
          <rect x="34" y="42" width="26" height="90" rx="13" />
          <rect x="66" y="26" width="26" height="106" rx="13" />
          <rect x="98" y="22" width="26" height="110" rx="13" />
          <rect x="130" y="36" width="26" height="96" rx="13" />
          <rect x="150" y="86" width="26" height="70" rx="13" transform="rotate(36 163 121)" />
          <rect x="34" y="104" width="126" height="98" rx="46" />
        </g>
        <path
          d="M56 140 q44 -14 88 0"
          stroke="var(--skin-shade)"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
      </motion.svg>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ delay: 0.28, type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-5 text-center shadow-soft sm:p-7"
      >
        <p className="font-display text-lg font-semibold sm:text-xl">No peeking!</p>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">{prompt}</p>
        <button
          onClick={onAnswer}
          className="mt-5 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          I answered it
        </button>
      </motion.div>
    </motion.div>
  );
}
