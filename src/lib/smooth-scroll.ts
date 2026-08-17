import Lenis from "lenis";

/**
 * Safari reports a 1px (sometimes more) gap between scrollHeight and the
 * visible viewport even when the page fits, which is enough for Lenis to
 * animate a bounce. Treat anything at or under that slack as "no overflow".
 */
const OVERFLOW_SLACK_PX = 1;

function viewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function pageOverflows() {
  return document.documentElement.scrollHeight - viewportHeight() > OVERFLOW_SLACK_PX;
}

/**
 * Smooth scroll when the document is actually taller than the viewport;
 * otherwise stop Lenis so Safari cannot rubber-band an empty page.
 */
export function initSmoothScroll() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const lenis = new Lenis({
    autoRaf: true,
    duration: prefersReducedMotion ? 0 : 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !prefersReducedMotion,
    touchMultiplier: 1.5,
    syncTouch: false,
    anchors: true,
    infinite: false,
    overscroll: false,
  });

  const syncScrollLock = () => {
    if (pageOverflows()) {
      lenis.start();
      return;
    }

    lenis.scrollTo(0, { immediate: true });
    lenis.stop();
  };

  syncScrollLock();

  const onResize = () => {
    lenis.resize();
    syncScrollLock();
  };

  window.addEventListener("resize", onResize);
  window.visualViewport?.addEventListener("resize", onResize);
}
