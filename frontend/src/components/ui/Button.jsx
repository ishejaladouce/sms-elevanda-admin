// Reusable button. Primary = filled accent with subtle shine sweep on hover.
export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  children,
  ...props
}) {
  const base = [
    "group relative inline-flex items-center justify-center overflow-hidden",
    "rounded-control font-medium tracking-tight",
    "transition-all duration-200 ease-smooth",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
    "select-none",
  ].join(" ");

  const variants = {
    primary: [
      "bg-accent text-bg shadow-glow",
      "hover:bg-accentHover hover:brightness-105",
      "active:scale-[0.98] focus-visible:ring-accent",
    ].join(" "),
    secondary: [
      "text-text bg-surface ring-1 ring-border",
      "hover:bg-surface2 hover:ring-borderStrong",
      "focus-visible:ring-borderStrong",
    ].join(" "),
    ghost: [
      "text-muted hover:text-text",
      "hover:bg-surface2",
      "focus-visible:ring-borderStrong",
    ].join(" "),
    danger: [
      "bg-danger/90 text-white",
      "hover:bg-danger hover:brightness-110",
      "focus-visible:ring-danger",
    ].join(" "),
  };

  const sizes = {
    sm: "h-9 px-3.5 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={[base, variants[variant], sizes[size], className].join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {variant === "primary" ? (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full pointer-events-none" />
      ) : null}
      {loading ? (
        <span className="relative inline-flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
          <span>Loading</span>
        </span>
      ) : (
        <span className="relative inline-flex items-center gap-2">{children}</span>
      )}
    </button>
  );
}
