import { AnimatePresence, motion } from "motion/react";
import type { Slide } from "@/lib/lesson-data";

type Props = {
  slide: Slide;
  in3d: boolean;
  fullscreen3d: boolean;
  onEnter3d: () => void;
  onClose3d: () => void;
};

export function Blackboard({ slide, in3d, fullscreen3d, onEnter3d, onClose3d }: Props) {
  const blurred = in3d && !fullscreen3d;

  return (
    <motion.div
      layout
      className={
        fullscreen3d
          ? "fixed inset-3 z-40 overflow-hidden rounded-3xl border-8 border-wood bg-chalkboard-deep shadow-board"
          : "relative h-full w-full overflow-hidden rounded-3xl border-8 border-wood bg-chalkboard shadow-board"
      }
      transition={{ type: "spring", stiffness: 160, damping: 22 }}
    >
      {/* chalk dust texture */}
      <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_20%_20%,white_0%,transparent_45%),radial-gradient(circle_at_80%_70%,white_0%,transparent_40%)]" />

      <AnimatePresence mode="wait">
        {fullscreen3d ? (
          <motion.div
            key="3d"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex h-full w-full items-center justify-center"
          >
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              className="grid h-40 w-40 place-items-center rounded-2xl border-2 border-chalk-muted/60 bg-chalk/10 text-chalkwrite text-2xl [transform-style:preserve-3d] sm:h-56 sm:w-56"
            >
              CaO + H₂O
            </motion.div>
            <p className="absolute bottom-6 text-chalkwrite text-xl">
              Drag, spin and explore the reaction chamber
            </p>
            <button
              onClick={onClose3d}
              className="absolute right-4 top-4 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-soft"
            >
              Close 3D
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0, filter: blurred ? "blur(8px)" : "blur(0px)" }}
            exit={{ opacity: 0, y: -14 }}
            className="flex h-full flex-col gap-3 p-5 sm:gap-4 sm:p-8"
          >
            <span className="w-fit rounded-full border border-chalk-muted/40 px-3 py-1 text-[11px] uppercase tracking-widest text-chalk-muted">
              {slide.module}
            </span>
            <h2 className="text-chalkwrite text-3xl leading-tight sm:text-5xl">
              {slide.title}
            </h2>
            <div className="space-y-2 overflow-y-auto pr-1">
              {slide.body.map((line) => (
                <p key={line} className="text-chalkwrite text-lg sm:text-2xl">
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {blurred && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 grid place-items-center"
          >
            <button
              onClick={onEnter3d}
              className="rounded-full bg-accent px-6 py-3 font-display text-base font-semibold text-accent-foreground shadow-soft transition-transform hover:scale-105 sm:text-lg"
            >
              Enter 3D Experience
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
