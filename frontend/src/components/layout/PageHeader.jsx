// Standard page header used across admin pages.
// Pill is a small status capsule (e.g. "Live overview"); action is right-aligned controls.
export default function PageHeader({ title, subtitle, pill, action, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 fade-up">
      <div>
        {pill ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-surface ring-1 ring-border px-3 py-1 text-xs text-muted mb-3">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-accent" />
            {pill}
          </div>
        ) : null}
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-text">
          {title}
        </h1>
        {subtitle ? <p className="text-muted mt-2">{subtitle}</p> : null}
      </div>
      {action || children ? (
        <div className="flex flex-wrap items-center gap-2">{action || children}</div>
      ) : null}
    </div>
  );
}
