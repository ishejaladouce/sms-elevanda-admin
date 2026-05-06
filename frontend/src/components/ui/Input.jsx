import { forwardRef } from "react";

const Input = forwardRef(function Input({ label, error, className = "", ...props }, ref) {
  return (
    <div>
      {label ? <label className="text-sm text-muted">{label}</label> : null}
      <input
        ref={ref}
        className={[
          "mt-1 w-full rounded-control border border-border bg-surface2 px-3 py-2 outline-none transition duration-200 ease-smooth",
          "focus:ring-2 focus:ring-accent/40",
          error ? "border-danger" : "",
          className,
        ].join(" ")}
        {...props}
      />
      {error ? <div className="text-danger text-sm mt-1">{error}</div> : null}
    </div>
  );
});

export default Input;

