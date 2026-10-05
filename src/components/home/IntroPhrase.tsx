import { useEffect, useRef, useState } from "react";
import { useScramble } from "use-scramble";

const PHRASES = [
  "is a design studio",
  "is making internet products",
  "is shipping open source",
  "is a founding partner",
  "is a state of mind",
  "is brand, product, and web",
  "is still in progress",
];

const HOLD_MS = 2400;

export default function IntroPhrase() {
  const [index, setIndex] = useState(0);
  const labelRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const phrase = PHRASES[index] ?? PHRASES[0];
  const phraseRef = useRef(phrase);
  phraseRef.current = phrase;

  const { ref } = useScramble({
    text: phrase,
    // The settled phrase is already in the HTML. Scramble only when it changes.
    playOnMount: false,
    speed: 0.6,
    tick: 1,
    step: 1,
    scramble: 4,
    seed: 2,
    ignore: [" ", ","],
    onAnimationEnd() {
      if (labelRef.current) labelRef.current.textContent = phraseRef.current;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIndex((current) => (current + 1) % PHRASES.length);
      }, HOLD_MS);
    },
  });

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <span className="contents">
      <span className="sr-only" ref={labelRef}>
        {PHRASES[0]}
      </span>
      <span ref={ref} aria-hidden="true" className="whitespace-nowrap">
        {PHRASES[0]}
      </span>
    </span>
  );
}
