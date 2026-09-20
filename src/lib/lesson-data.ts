export type Slide = {
  id: string;
  module: "Understanding" | "Learning";
  title: string;
  body: string[];
  kind: "text" | "video" | "3d";
  say: string;
  recallPrompt: string;
};

export const lesson = {
  heading: "NCERT Class 10 · Science",
  chapter: "Chapter 1 — Chemical Reactions and Equations",
  slides: [
    {
      id: "s1",
      module: "Understanding",
      title: "What is a chemical reaction?",
      body: [
        "When substances change into new substances with new properties, a chemical reaction has happened.",
        "Clues: colour change, gas bubbles, temperature change, smell, or a solid forming.",
      ],
      kind: "text",
      say: "Look here — every clue on the board tells us a new substance was born.",
      recallPrompt: "Name any two signs that tell you a chemical reaction took place.",
    },
    {
      id: "s2",
      module: "Understanding",
      title: "Balancing an equation",
      body: [
        "Fe + H₂O → Fe₃O₄ + H₂",
        "Atoms are never lost. Balance both sides: 3Fe + 4H₂O → Fe₃O₄ + 4H₂",
      ],
      kind: "text",
      say: "Count the atoms with me, one element at a time.",
      recallPrompt: "Why must the number of atoms be equal on both sides?",
    },
    {
      id: "s3",
      module: "Learning",
      title: "Watch the reaction happen",
      body: ["A short clip: quicklime meeting water, heat and all."],
      kind: "video",
      say: "Eyes on the clip — notice the steam the moment water touches the lime.",
      recallPrompt: "What did you see forming right after the water was added?",
    },
    {
      id: "s4",
      module: "Learning",
      title: "Inside a combination reaction",
      body: ["Step into the lab and watch quicklime meet water, particle by particle."],
      kind: "3d",
      say: "Now step inside — you can spin the reaction chamber yourself.",
      recallPrompt: "What did the calcium oxide turn into after water was added?",
    },
    {
      id: "s5",
      module: "Learning",
      title: "Corrosion and rancidity",
      body: [
        "Iron rusts, silver blackens, copper turns green — that is corrosion.",
        "Fats and oils turning stale in air is rancidity; antioxidants slow it down.",
      ],
      kind: "text",
      say: "Last one! Rust and stale chips are the same idea — oxygen at work.",
      recallPrompt: "Which gas in air is mainly responsible for rancidity?",
    },
  ] as Slide[],
};

const pattern = /ncert\s+class\s*([4-9]|10)\s+([a-z\s]+?)\s+chapter\s*(\d+)/i;

export function parseQuery(q: string) {
  const m = q.trim().match(pattern);
  if (!m) return null;
  return { klass: m[1] ?? "", subject: (m[2] ?? "").trim(), chapter: m[3] ?? "" };
}
