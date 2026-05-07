// Small pill-shaped status badge.
export default function Badge({ children, variant = "neutral", className = "" }) {
  const variants = {
    success: "bg-success/15 text-success ring-success/25",
    warning: "bg-accent/15 text-accent ring-accent/25",
    danger: "bg-danger/15 text-danger ring-danger/25",
    neutral: "bg-surface2 text-muted ring-border",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
