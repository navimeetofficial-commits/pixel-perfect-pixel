import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Teacher, type TeacherPose } from "@/components/classroom/Teacher";
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
          "An immersive NCERT Class 4-10 classroom with an animated AI teacher, a lesson screen, videos and 3D moments.",
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
  const [pose, setPose] = useState<TeacherPose>("waving");
  const [speech, setSpeech] = useState<string | null>("Hi! Ask me any NCERT chapter.");
  const [in3d, setIn3d] = useState(false);
  const [fullscreen3d, setFullscreen3d] = useState(false);
  const [noPeek, setNoPeek] = useState(false);
  const [menu, setMenu] = useState(false);

  const slide = lesson.slides[index]!;
  const basePoseRef = useRef<TeacherPose>("waving");
  const pokeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const setBase = (p: TeacherPose) => {
    basePoseRef.current = p;
    setPose(p);
  };

  // greeting settles into idle
  useEffect(() => {
    if (phase !== "search") return;
    const id = setTimeout(() => setBase("idle"), 3200);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "classroom" || noPeek) return;
    const is3d = slide.kind === "3d";
    setIn3d(is3d);
    setSpeech(slide.say);
    setBase(is3d ? "explaining" : slide.kind === "video" ? "listening" : "teaching");
    const id = setTimeout(
      () => setBase(is3d ? "pointing" : "explaining"),
      5000,
    );
    return () => clearTimeout(id);
  }, [index, phase, slide, noPeek]);

  // tapping the teacher gets a fun reaction
  const poke = () => {
    const reactions: Array<[TeacherPose, string]> = [
      ["waving", "Hello hello! Great to see you!"],
      ["celebrating", "Hey, you poked me! Hehe!"],
      ["explaining", "Any questions? Ask away!"],
      ["thinking", "Hmm… what shall we explore next?"],
      ["listening", "I'm all ears — tell me!"],
    ];
    const [p, s] = reactions[Math.floor(Math.random() * reactions.length)]!;
    setPose(p);
    setSpeech(s);
    clearTimeout(pokeTimer.current);
    pokeTimer.current = setTimeout(() => setPose(basePoseRef.current), 2800);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parseQuery(query)) {
      setPose("thinking");
      setSpeech("Hmm, I don't know that one yet.");
      toast("We are expanding!", {
        description: "For now, try typing: NCERT [class] [subject] [chapter no]",
      });
      return;
    }
    setPhase("classroom");
    setIndex(0);
    setBase("teaching");
  };

  const triggerNoPeek = useCallback(() => {
    setFullscreen3d(false);
    setPose("nopeek");
    setSpeech("Cover the board — answer from memory!");
    setNoPeek(true);
  }, []);

  const endNoPeek = () => {
    setNoPeek(false);
    setPose("celebrating");
    setSpeech("Brilliant! Let's keep going.");
    setTimeout(() => setBase("teaching"), 2400);
  };

  const teacherSize =
    "w-[156px] sm:w-[224px] lg:w-[336px] 2xl:w-[384px] [@media(max-height:520px)]:w-[118px]";

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-wall">
      <header className="relative z-20 flex items-center justify-between gap-2 px-3 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          {phase === "classroom" && (
            <button
              onClick={() => setMenu(true)}
              className="rounded-lg border border-border px-2.5 py-1.5 text-sm sm:hidden"
              aria-label="Open lesson menu"
            >
              ☰
            </button>
          )}
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            C
          </span>
          <span className="truncate text-base font-semibold">Chalkmate</span>
        </div>
        {phase === "classroom" && (
          <span className="hidden truncate text-sm text-muted-foreground md:block">
            {lesson.chapter}
          </span>
        )}
      </header>

      <main className="relative z-10 min-h-0 flex-1">
        <AnimatePresence mode="wait">
          {phase === "search" ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center gap-5 px-4 pb-[26vh] landscape:max-sm:gap-3 landscape:max-sm:pb-[18vh]"
            >
              <h1 className="text-center text-2xl font-semibold leading-tight sm:text-4xl">
                What shall we learn today?
              </h1>
              <p className="text-center text-xs text-muted-foreground sm:text-sm">
                NCERT Class 4–10 · taught live by your AI teacher
              </p>
              <form
                onSubmit={submit}
                className="flex w-full items-center gap-2 rounded-[28px] border border-border bg-card p-1.5 shadow-soft focus-within:border-foreground/25"
              >
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    setPose("listening");
                    setSpeech("I'm listening… type a chapter!");
                  }}
                  onBlur={() => setPose(basePoseRef.current)}
                  placeholder="NCERT class 10 science chapter 1"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground sm:text-base"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Ask
                </button>
              </form>
              <div className="flex flex-wrap justify-center gap-2">
                {["NCERT class 10 science chapter 1", "NCERT class 7 maths chapter 2"].map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
                    >
                      {s}
                    </button>
                  ),
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="classroom"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 130, damping: 20 }}
              className="flex h-full min-h-0 gap-3 px-3 pb-3 sm:gap-4 sm:px-5 sm:pb-5"
            >
              <div className="hidden min-h-0 w-[240px] shrink-0 sm:block">
                <LessonSidebar
                  index={index}
                  onSelect={setIndex}
                  onRestart={() => setPhase("search")}
                />
              </div>

              <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
                <div className="min-h-0 flex-1 pr-0 sm:pr-[clamp(0px,26vw,380px)]">
                  <Blackboard
                    slide={slide}
                    in3d={in3d}
                    fullscreen3d={fullscreen3d}
                    onEnter3d={() => setFullscreen3d(true)}
                    onClose3d={() => setFullscreen3d(false)}
                  />
                </div>
                <div className="flex shrink-0 items-center gap-2 overflow-x-auto pb-[24vh] sm:pb-0 landscape:max-sm:pb-[8vh]">
                  <button
                    onClick={() => setIndex((i) => Math.max(0, i - 1))}
                    className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={triggerNoPeek}
                    className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
                  >
                    Quiz me
                  </button>
                  <button
                    onClick={() =>
                      setIndex((i) => Math.min(lesson.slides.length - 1, i + 1))
                    }
                    className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* mobile lesson drawer */}
      <AnimatePresence>
        {menu && phase === "classroom" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenu(false)}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm sm:hidden"
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-[82vw] max-w-[300px] p-3"
            >
              <LessonSidebar
                index={index}
                onSelect={(i) => {
                  setIndex(i);
                  setMenu(false);
                }}
                onRestart={() => {
                  setMenu(false);
                  setPhase("search");
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* the teacher lives here from the very first screen — drag her anywhere */}
      <div className="pointer-events-none fixed bottom-2 right-2 z-[55] sm:bottom-4 sm:right-4">
        <Teacher
          pose={pose}
          speech={noPeek ? null : speech}
          onPoke={poke}
          className={teacherSize}
        />
      </div>

      <AnimatePresence>
        {noPeek && <NoPeekHand prompt={slide.recallPrompt} onAnswer={endNoPeek} />}
      </AnimatePresence>
    </div>
  );
}
