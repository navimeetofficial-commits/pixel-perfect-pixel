import { motion } from "motion/react";
import { lesson } from "@/lib/lesson-data";

type Props = {
  index: number;
  onSelect: (i: number) => void;
  onRestart: () => void;
};

export function LessonSidebar({ index, onSelect, onRestart }: Props) {
  const progress = Math.round(((index + 1) / lesson.slides.length) * 100);

  return (
    <motion.aside
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 140, damping: 20 }}
      className="flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto rounded-3xl border border-border bg-card/80 p-4 backdrop-blur-sm shadow-soft"
    >
      <div className="min-w-0">
        <p className="truncate text-xs uppercase tracking-widest text-muted-foreground">
          {lesson.heading}
        </p>
        <h3 className="mt-1 text-base font-semibold leading-snug">{lesson.chapter}</h3>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {lesson.slides.map((s, i) => (
          <li key={s.id}>
            <button
              onClick={() => onSelect(i)}
              className={`flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                i === index
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              <span
                className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                  s.module === "Understanding" ? "bg-accent" : "bg-foreground/40"
                }`}
              />
              <span className="min-w-0">
                <span className="block truncate font-medium">{s.title}</span>
                <span className="block text-[11px] opacity-70">{s.module}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={onRestart}
        className="mt-auto rounded-xl border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
      >
        New search
      </button>
    </motion.aside>
  );
}
