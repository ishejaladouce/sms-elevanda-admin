// Tracks the mouse over a tile so the radial spotlight (.tile::before) can follow it.
function handleTileMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

// Reusable card. Interactive by default (mouse-follow spotlight, lift on hover).
export default function Card({
  title,
  subtitle,
  action,
  children,
  className = "",
  padded = true,
  interactive = true,
}) {
  return (
    <div
      onMouseMove={interactive ? handleTileMouseMove : undefined}
      className={[
        interactive
          ? "tile"
          : "rounded-card bg-surface ring-1 ring-border shadow-card",
        padded ? "p-6" : "",
        className,
      ].join(" ")}
    >
      {title || action ? (
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            {title ? (
              <h3 className="text-xs uppercase tracking-wider font-medium text-muted">
                {title}
              </h3>
            ) : null}
            {subtitle ? (
              <p className="text-sm text-text mt-1">{subtitle}</p>
            ) : null}
          </div>
          {action ? <div className="flex-shrink-0">{action}</div> : null}
        </div>
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
