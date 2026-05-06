export default function Badge({ variant = "neutral", children }) {
  const variants = {
    success: "bg-success/15 text-success border-success/30",
    warning: "bg-accent/15 text-accent border-accent/30",
    danger: "bg-danger/15 text-danger border-danger/30",
    neutral: "bg-surface2 text-muted border-border",
  };

  return (
    <span className={["inline-flex items-center rounded-control border px-2 py-0.5 text-xs", variants[variant]].join(" ")}>
      {children}
    </span>
  );
}

