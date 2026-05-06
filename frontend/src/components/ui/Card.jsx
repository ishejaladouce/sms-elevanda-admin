export default function Card({ title, children, className = "" }) {
  return (
    <div className={["rounded-card border border-border bg-surface shadow-soft p-5", className].join(" ")}>
      {title ? <div className="text-sm text-muted">{title}</div> : null}
      <div className={title ? "mt-2" : ""}>{children}</div>
    </div>
  );
}

