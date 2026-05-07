import { forwardRef } from "react";

// Reusable input with optional left icon, theme-aware ring, and clean error state.
const Input = forwardRef(function Input(
  { label, error, icon = null, className = "", ...props },
  ref
) {
  return (
    <div className="w-full">
      {label ? (
        <label className="block text-xs font-medium text-muted mb-2 tracking-wide uppercase">
          {label}
        </label>
      ) : null}
      <div className="relative group">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
            {icon}
          </span>
        ) : null}
        <input
          ref={ref}
          className={[
            "w-full h-12 rounded-control",
            "bg-surface placeholder:text-muted/60",
            "ring-1 ring-border",
            "hover:ring-borderStrong",
            "focus:ring-2 focus:ring-accent/60",
            "outline-none transition-all duration-200 ease-smooth",
            "text-text",
            icon ? "pl-12 pr-4" : "px-4",
            error ? "ring-2 ring-danger/60 focus:ring-danger/60" : "",
            className,
          ].join(" ")}
          {...props}
        />
      </div>
      {error ? (
        <div className="text-danger text-xs mt-2 flex items-center gap-1.5">
          <span className="inline-block h-1 w-1 rounded-full bg-danger" />
          {error}
        </div>
      ) : null}
    </div>
  );
});

export default Input;
