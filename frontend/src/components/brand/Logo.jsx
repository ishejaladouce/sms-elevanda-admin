// Wordmark logo for the admin app.
// We keep it text-only so it stays sharp and adapts to the active theme.
export default function Logo({ size = "md", className = "" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl sm:text-4xl",
  };
  return (
    <span
      className={[
        "font-display font-semibold tracking-tight",
        sizes[size] || sizes.md,
        className,
      ].join(" ")}
    >
      <span className="text-text">SMS</span>{" "}
      <span className="text-accent">Elevanda</span>{" "}
      <span className="text-muted font-sans font-medium text-[0.7em] tracking-wider uppercase ml-1">
        Admin
      </span>
    </span>
  );
}
