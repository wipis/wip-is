/**
 * How the page is scrolling right now, shared by everything that reacts to it
 * (the WebGL field, the hero letters) so they all move from the same numbers.
 * Call `sampleScroll` from a requestAnimationFrame callback; calls within one
 * frame share a single reading.
 */
export interface ScrollMotion {
  /** Distance scrolled, css px. Unaffected by the hero being removed. */
  position: number;
  /** Smoothed, css px per second. Positive while scrolling down. */
  velocity: number;
  /** 0 at rest, approaching 1 on a fast scroll. */
  speed: number;
  /** 1 for the last movement down, -1 for up. */
  direction: number;
}

const panes = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-pane]"));

// Base.astro removes the hero once it's scrolled past and shifts the scroll up
// by its height. Adding that back keeps the position continuous.
let shift = 0;
window.addEventListener("wip:scrollshift", (event) => {
  shift += (event as CustomEvent<number>).detail;
});

const measure = () =>
  window.scrollY + shift + panes.reduce((sum, pane) => sum + (pane.hidden ? 0 : pane.scrollTop), 0);

const motion: ScrollMotion = { position: measure(), velocity: 0, speed: 0, direction: 1 };
let lastSample = -1;

export function sampleScroll(now: number): Readonly<ScrollMotion> {
  if (now === lastSample) return motion;
  // Clamped so a return from a background tab doesn't read as a huge jump.
  const dt = lastSample < 0 ? 0 : Math.min((now - lastSample) / 1000, 0.1);
  lastSample = now;

  const position = measure();
  const raw = dt > 0 ? (position - motion.position) / dt : 0;
  motion.position = position;
  motion.velocity += (raw - motion.velocity) * (1 - Math.exp(-dt * 10));
  if (Math.abs(raw) > 1) motion.direction = Math.sign(raw);
  motion.speed = 1 - Math.exp(-Math.abs(motion.velocity) / 1800);
  return motion;
}
