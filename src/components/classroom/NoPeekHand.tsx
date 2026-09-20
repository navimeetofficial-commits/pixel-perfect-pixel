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
      className="fixed inset-0 z-50 grid place-items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute"
        initial={{ scale: 0.35, x: "22vw", y: "18vh", rotate: -20, opacity: 0 }}
        animate={{ scale: 1, x: 0, y: 0, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.3, x: "22vw", y: "18vh", rotate: -20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
      >
        <svg viewBox="0 0 200 220" className="h-[86vh] w-[86vw] max-w-[900px]">
          <g fill="var(--skin)" stroke="var(--skin-shade)" strokeWidth="3">
            <rect x="78" y="18" width="26" height="92" rx="13" />
            <rect x="106" y="10" width="26" height="100" rx="13" />
            <rect x="134" y="26" width="26" height="86" rx="13" />
            <rect x="50" y="32" width="26" height="80" rx="13" />
            <rect x="24" y="78" width="30" height="24" rx="12" />
            <path d="M40 92 q60 -14 120 0 l6 66 q-12 44 -66 44 q-54 0 -66 -44 z" />
          </g>
          <g fill="var(--skin-shade)" opacity="0.5">
            <ellipse cx="100" cy="160" rx="42" ry="32" />
          </g>
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="relative z-10 mx-4 max-w-md rounded-3xl bg-card/95 p-5 text-center shadow-soft backdrop-blur"
      >
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          No peeking!
        </p>
        <p className="mt-2 font-display text-lg leading-snug">{prompt}</p>
        <button
          onClick={onAnswer}
          className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          I answered it
        </button>
      </motion.div>
    </motion.div>
  );
}
