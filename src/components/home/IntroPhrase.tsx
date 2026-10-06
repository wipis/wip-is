import { useEffect, useRef, useState } from "react";
import { useScramble } from "use-scramble";

const PHRASES = [
  "a design studio",
  "making internet products",
  "shipping open source",
  "a founding partner",
  "a state of mind",
  "brand, product, and web",
  "still in progress",
  "trusting the process",
  "practicing kaizen",
];

const HOLD_MS = 2400;

// Temporary: pick a variant with ?intro=scramble|type|fade|slide|blur to
// compare them. Delete the losers once one is chosen.
const VARIANTS = ["scramble", "type", "fade", "slide", "blur"] as const;
type Variant = (typeof VARIANTS)[number];

const next = (index: number) => (index + 1) % PHRASES.length;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function IntroPhrase() {
  // SSR always renders the scramble markup; the param is read after hydration.
  const [variant, setVariant] = useState<Variant>("scramble");

  useEffect(() => {
    const param = new URLSearchParams(location.search).get("intro");
    if (VARIANTS.includes(param as Variant)) setVariant(param as Variant);
  }, []);

  if (variant === "type") return <TypePhrase />;
  if (variant === "fade") return <FadePhrase motion="fade" />;
  if (variant === "slide") return <FadePhrase motion="slide" />;
  if (variant === "blur") return <FadePhrase motion="blur" />;
  return <ScramblePhrase />;
}

function ScramblePhrase() {
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
    speed: 0.8,
    tick: 1,
    step: 1,
    scramble: 3,
    seed: 1,
    // Lowercase letters only, and no underscore "overdrive" fill, so the
    // in-between frames read as text rather than glitch noise.
    range: [97, 122],
    overdrive: false,
    ignore: [" ", ","],
    onAnimationEnd() {
      if (labelRef.current) labelRef.current.textContent = phraseRef.current;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIndex(next);
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

/** Backspaces the phrase, then types the next one, with a blinking caret. */
function TypePhrase() {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(PHRASES[0]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let i = 0;
      while (!cancelled) {
        await wait(HOLD_MS);
        const from = PHRASES[i];
        for (let n = from.length; n >= 0 && !cancelled; n--) {
          setShown(from.slice(0, n));
          await wait(28);
        }
        i = next(i);
        const to = PHRASES[i];
        await wait(160);
        for (let n = 1; n <= to.length && !cancelled; n++) {
          setShown(to.slice(0, n));
          await wait(55);
        }
        if (!cancelled) setIndex(i);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <span className="contents">
      <span className="sr-only">{PHRASES[index]}</span>
      <span aria-hidden="true" className="whitespace-nowrap">
        {shown}
        <span className="ms-px inline-block w-px h-[1em] translate-y-[0.15em] bg-current animate-pulse" />
      </span>
    </span>
  );
}

const OUT_STYLES = {
  fade: { opacity: 0 },
  slide: { opacity: 0, transform: "translateY(-0.4em)" },
  blur: { opacity: 0, filter: "blur(4px)" },
} as const;

const ENTER_FROM = {
  fade: { opacity: 0 },
  slide: { opacity: 0, transform: "translateY(0.4em)" },
  blur: { opacity: 0, filter: "blur(4px)" },
} as const;

const SHOWN = { opacity: 1, transform: "translateY(0)", filter: "blur(0)" };

/** Swaps whole phrases with a fade, a vertical slide, or a blur. */
function FadePhrase({ motion }: { motion: keyof typeof OUT_STYLES }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"shown" | "out" | "from">("shown");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let i = 0;
      while (!cancelled) {
        await wait(HOLD_MS);
        if (cancelled) break;
        setPhase("out");
        await wait(250);
        if (cancelled) break;
        i = next(i);
        setIndex(i);
        setPhase("from");
        // Let the "from" position paint before transitioning in.
        await wait(30);
        if (!cancelled) setPhase("shown");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const style =
    phase === "out"
      ? OUT_STYLES[motion]
      : phase === "from"
        ? { ...ENTER_FROM[motion], transition: "none" }
        : SHOWN;

  return (
    <span className="contents">
      <span className="sr-only">{PHRASES[index]}</span>
      <span
        aria-hidden="true"
        className="inline-block whitespace-nowrap transition-[opacity,transform,filter] duration-250 ease-out"
        style={style}
      >
        {PHRASES[index]}
      </span>
    </span>
  );
}
