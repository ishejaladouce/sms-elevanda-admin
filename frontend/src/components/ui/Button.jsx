export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-control font-medium transition duration-200 ease-smooth focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-accent text-bg hover:bg-accentHover",
    secondary: "border border-border bg-transparent text-text hover:bg-surface2",
    danger: "bg-danger text-white hover:brightness-110",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
  };

  return (
    <button
      className={[base, variants[variant], sizes[size], className].join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
          <span>Loading</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

