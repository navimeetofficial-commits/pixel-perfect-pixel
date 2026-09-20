import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Teacher, type TeacherState } from "@/components/classroom/Teacher";
import { Blackboard } from "@/components/classroom/Blackboard";
import { LessonSidebar } from "@/components/classroom/LessonSidebar";
import { NoPeekHand } from "@/components/classroom/NoPeekHand";
import { lesson, parseQuery } from "@/lib/lesson-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chalkmate — Living NCERT Classroom" },
      {
        name: "description",
        content:
          "An immersive NCERT Class 4-10 classroom with an animated AI teacher, a blackboard canvas and 3D lesson moments.",
      },
      { property: "og:title", content: "Chalkmate — Living NCERT Classroom" },
      {
        property: "og:description",
        content:
          "Search a chapter and step into a classroom where an animated teacher explains, quizzes and celebrates with you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [phase, setPhase] = useState<"search" | "classroom">("search");
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [teacher, setTeacher] = useState<TeacherState>("idle");
  const [in3d, setIn3d] = useState(false);
  const [fullscreen3d, setFullscreen3d] = useState(false);
  const [noPeek, setNoPeek] = useState(false);

  const slide = lesson.slides[index]!;

  useEffect(() => {
    if (phase !== "classroom" || noPeek) return;
    setIn3d(slide.kind === "3d");
    setTeacher(slide.kind === "3d" ? "listening" : "teaching");
  }, [index, phase, slide.kind, noPeek]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parseQuery(query)) {
      toast("We are expanding!", {
        description: "For now, try typing: NCERT [class] [subject] [chapter no]",
      });
      return;
    }
    setPhase("classroom");
    setIndex(0);
    setTeacher("teaching");
  };

  const triggerNoPeek = useCallback(() => {
    setFullscreen3d(false);
    setTeacher("nopeek");
    setNoPeek(true);
  }, []);

  const endNoPeek = () => {
    setNoPeek(false);
    setTeacher("celebrating");
    setTimeout(() => setTeacher("teaching"), 2200);
  };

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-wall">
      {/* classroom wall detail */}
      <AnimatePresence>
        {phase === "classroom" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(oklch(0.62_0.09_63/0.18)_1px,transparent_1px),linear-gradient(90deg,oklch(0.62_0.09_63/0.12)_1px,transparent_1px)] [background-size:56px_56px]" />
            <div className="absolute bottom-0 h-16 w-full bg-wood-dark/80" />
            <div className="absolute bottom-16 h-3 w-full bg-wood" />
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative z-20 flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary font-display text-primary-foreground">
            C
          </span>
          <span className="truncate font-display text-lg font-semibold">Chalkmate</span>
        </div>
        {phase === "classroom" && (
          <span className="hidden truncate text-sm text-muted-foreground sm:block">
            {lesson.chapter}
          </span>
        )}
      </header>

      <main className="relative z-10 min-h-0 flex-1">
        <AnimatePresence mode="wait">
          {phase === "search" ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-6 px-4"
            >
              <h1 className="text-center text-3xl font-semibold leading-tight sm:text-5xl">
                What shall we learn today?
              </h1>
              <p className="text-center text-sm text-muted-foreground">
                NCERT Class 4–10 · taught live by your AI teacher
              </p>
              <motion.form
                onSubmit={submit}
                className="flex w-full items-center gap-2 rounded-3xl border border-border bg-card p-2 shadow-soft"
              >
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="NCERT class 10 science chapter 1"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Start
                </button>
              </motion.form>
            </motion.div>
          ) : (
            <motion.div
              key="classroom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid h-full min-h-0 grid-cols-1 gap-3 px-3 pb-20 sm:grid-cols-[230px_minmax(0,1fr)] sm:gap-4 sm:px-5 sm:pb-24 landscape:max-sm:grid-cols-[190px_minmax(0,1fr)]"
            >
              <div className="hidden min-h-0 sm:block landscape:max-sm:block">
                <LessonSidebar
                  index={index}
                  onSelect={setIndex}
                  onRestart={() => setPhase("search")}
                />
              </div>

              <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-2 sm:grid-cols-[minmax(0,1fr)_200px] sm:grid-rows-1 sm:items-stretch sm:gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  className="h-full min-h-0"
                >
                  <Blackboard
                    slide={slide}
                    in3d={in3d}
                    fullscreen3d={fullscreen3d}
                    onEnter3d={() => setFullscreen3d(true)}
                    onClose3d={() => setFullscreen3d(false)}
                  />
                </motion.div>
                <div className="flex h-24 items-end justify-center sm:h-full sm:pb-2">
                  <Teacher state={teacher} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {noPeek && <NoPeekHand prompt={slide.recallPrompt} onAnswer={endNoPeek} />}
      </AnimatePresence>

      {/* Dev controls */}
      <div className="fixed bottom-3 left-1/2 z-[60] flex max-w-[95vw] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/90 px-2 py-1.5 shadow-soft backdrop-blur">
        {[
          {
            label: "Start Lesson",
            fn: () => {
              setPhase("classroom");
              setIndex(0);
              setTeacher("teaching");
            },
          },
          {
            label: "Show 3D Prompt",
            fn: () => {
              setPhase("classroom");
              setIndex(lesson.slides.findIndex((s) => s.kind === "3d"));
            },
          },
          { label: "Play No-Peek", fn: triggerNoPeek },
          { label: "Celebrate", fn: () => setTeacher("celebrating") },
          { label: "Next", fn: () => setIndex((i) => (i + 1) % lesson.slides.length) },
        ].map((b) => (
          <button
            key={b.label}
            onClick={b.fn}
            className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium hover:bg-secondary"
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
