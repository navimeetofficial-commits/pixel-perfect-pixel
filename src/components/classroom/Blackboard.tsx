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
      className={
        fullscreen3d
          ? "fixed inset-2 z-40 overflow-hidden rounded-3xl bg-chalkboard-deep shadow-board sm:inset-4"
          : "relative flex h-full w-full min-h-0 flex-col overflow-hidden rounded-3xl bg-chalkboard shadow-board"
      }
      transition={{ type: "spring", stiffness: 160, damping: 22 }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_10%,white_0%,transparent_45%)]" />

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
              className="grid h-36 w-36 place-items-center rounded-2xl border border-chalk/30 bg-chalk/10 text-lg text-chalk [transform-style:preserve-3d] sm:h-56 sm:w-56 sm:text-2xl"
            >
              CaO + H₂O
            </motion.div>
            <p className="absolute bottom-5 px-4 text-center text-sm text-chalk-muted sm:text-base">
              Drag, spin and explore the reaction chamber
            </p>
            <button
              onClick={onClose3d}
              className="absolute right-3 top-3 rounded-full bg-chalk/15 px-4 py-2 text-sm font-medium text-chalk backdrop-blur hover:bg-chalk/25"
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
            className="flex min-h-0 flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-7"
          >
            <span className="w-fit rounded-full border border-chalk/20 px-3 py-1 text-[10px] uppercase tracking-widest text-chalk-muted sm:text-[11px]">
              {slide.module}
            </span>
            <h2 className="text-xl font-semibold leading-tight text-chalk sm:text-3xl">
              {slide.title}
            </h2>

            {slide.kind === "video" ? (
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-black/40">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.06, 1] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 [background:radial-gradient(circle_at_50%_60%,oklch(0.8_0.12_80/0.5),transparent_60%)]"
                />
                <div className="relative flex h-full flex-col items-center justify-center gap-2 text-chalk">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-chalk/20 text-lg">
                    ▶
                  </span>
                  <p className="px-4 text-center text-xs text-chalk-muted sm:text-sm">
                    {slide.body[0]}
                  </p>
                </div>
              </div>
            ) : (
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {slide.body.map((line) => (
                  <p key={line} className="text-sm leading-relaxed text-chalk sm:text-lg">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {blurred && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 grid place-items-center p-4"
          >
            <button
              onClick={onEnter3d}
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-soft transition-transform hover:scale-105 sm:text-base"
            >
              Enter 3D Experience
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
