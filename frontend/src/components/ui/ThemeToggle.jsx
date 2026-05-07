import { useThemeStore } from "../../store/themeStore.js";

export default function ThemeToggle({ className = "", size = "md" }) {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);

  const dims = size === "sm" ? "h-9 w-9" : "h-10 w-10";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={[
        dims,
        "inline-flex items-center justify-center rounded-full",
        "bg-surface ring-1 ring-border hover:ring-borderStrong",
        "text-muted hover:text-text",
        "transition-all duration-200 ease-out",
        "hover:bg-surface2",
        className,
      ].join(" ")}
    >
      <span className="relative inline-block h-5 w-5">
        <SunIcon
          className={[
            "absolute inset-0 transition-all duration-300",
            theme === "dark"
              ? "opacity-0 scale-75 rotate-90"
              : "opacity-100 scale-100 rotate-0",
          ].join(" ")}
        />
        <MoonIcon
          className={[
            "absolute inset-0 transition-all duration-300",
            theme === "dark"
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-75 -rotate-90",
          ].join(" ")}
        />
      </span>
    </button>
  );
}

function SunIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
