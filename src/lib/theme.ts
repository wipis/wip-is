/**
 * Theme handling, replacing next-themes.
 *
 * The initial class is applied by a blocking inline script in Base.astro so
 * there is no flash of the wrong theme. That script is deliberately duplicated
 * (it cannot import — it has to run before this module is fetched); everything
 * after first paint lives here.
 *
 * The storage key and values match next-themes exactly, so anyone who set a
 * preference on the old site keeps it.
 */

export const THEME_STORAGE_KEY = "theme";

export type ResolvedTheme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/** Reads the stored preference, or null when following the system. */
function storedTheme(): ResolvedTheme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    // Safari private browsing throws on localStorage access.
    return null;
  }
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/** The theme currently painted, read off the class the inline script applied. */
export function resolvedTheme(): ResolvedTheme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * next-themes' `disableTransitionOnChange`. Without this every element with
 * `transition-colors` animates its way to the new palette, which reads as lag.
 */
function withoutTransitions(apply: () => void) {
  const style = document.createElement("style");
  // The palette must snap (no laggy color fade), but the mode toggle's icons
  // are a deliberate cross-fade driven by the same class change — exempt them
  // so that one micro-interaction still plays.
  style.append(
    document.createTextNode(
      "*:not(.mode-icon),*::before,*::after{transition:none!important;animation:none!important}"
    )
  );
  document.head.append(style);

  apply();

  // Force a reflow so the new colors are committed while transitions are off.
  window.getComputedStyle(document.body).transition;
  requestAnimationFrame(() => style.remove());
}

function paint(theme: ResolvedTheme) {
  const root = document.documentElement;
  withoutTransitions(() => {
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  });
  syncToggles(theme);
}

/** Keeps every mode toggle's accessible label pointing at the *next* theme. */
function syncToggles(theme: ResolvedTheme) {
  const label =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  for (const toggle of document.querySelectorAll("[data-mode-toggle]")) {
    toggle.setAttribute("aria-label", label);
  }
}

export function setTheme(theme: ResolvedTheme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Preference is not persisted, but the page still switches.
  }
  paint(theme);
}

export function toggleTheme() {
  setTheme(resolvedTheme() === "dark" ? "light" : "dark");
}

/** Wires up system-preference tracking and the initial toggle labels. */
export function initTheme() {
  syncToggles(resolvedTheme());

  window.matchMedia(DARK_QUERY).addEventListener("change", () => {
    // An explicit choice wins over the OS.
    if (storedTheme() === null) paint(systemTheme());
  });
}
