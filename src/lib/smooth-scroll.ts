import Lenis from "lenis";

/**
 * Safari rubber-bands the *document* (html/body), and window-level Lenis
 * makes that worse: it puts `.lenis` on <html>, whose CSS sets
 * `html, body { height: auto }`, which undoes any viewport-height lock.
 *
 * Scroll lives on <main> instead. The document is overflow-hidden in CSS
 * and never moves. Lenis is bound to that inner scroller and only starts
 * when the scroller's own content is actually taller than it.
 */
const OVERFLOW_SLACK_PX = 1;

function overflows(scroller: HTMLElement) {
  return scroller.scrollHeight - scroller.clientHeight > OVERFLOW_SLACK_PX;
}

export function initSmoothScroll() {
  const wrapper = document.getElementById("main");
  if (!(wrapper instanceof HTMLElement)) return;

  const article = wrapper.querySelector("article");
  const content = article instanceof HTMLElement ? article : wrapper;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const lenis = new Lenis({
    wrapper,
    content,
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
    if (overflows(wrapper)) {
      wrapper.style.overflowY = "auto";
      lenis.resize();
      lenis.start();
      return;
    }

    lenis.scrollTo(0, { immediate: true });
    lenis.stop();
    wrapper.style.overflowY = "hidden";
  };

  syncScrollLock();

  const observer = new ResizeObserver(syncScrollLock);
  observer.observe(wrapper);
  observer.observe(content);
  window.visualViewport?.addEventListener("resize", syncScrollLock);
}
