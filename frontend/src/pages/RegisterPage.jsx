import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import Logo from "../components/brand/Logo.jsx";
import { api } from "../services/api.js";
import { deviceId } from "../utils/device.js";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  role: z.enum(["TEACHER", "ADMIN"]),
});

// Page-level spotlight follows the cursor.
function handleMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

// Per-tile spotlight follows the cursor inside one card.
function handleTileMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export default function RegisterPage() {
  const nav = useNavigate();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", role: "TEACHER" },
  });

  const role = form.watch("role");

  async function onSubmit(values) {
    try {
      form.clearErrors("root");
      await api.post("/api/auth/register", {
        ...values,
        deviceId: deviceId(),
      });
      // After registering, the device is unverified — admin must verify before login.
      nav("/login", {
        state: {
          notice:
            "Account created. An existing admin will verify your device before you can sign in.",
        },
      });
    } catch (err) {
      const message = err?.response?.data?.message || "Could not create account";
      form.setError("root", { type: "server", message });
    }
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen relative overflow-hidden bg-bg text-text flex flex-col"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="aurora-blob absolute -top-40 -left-20 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-accent), transparent 60%)" }}
        />
        <div
          className="aurora-blob absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--color-accent-strong), transparent 60%)",
            animationDelay: "-8s",
          }}
        />
        <div className="absolute inset-0 bg-grid opacity-[0.5]" />
        <div className="grain-overlay" />
        <div className="spotlight" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-surface ring-1 ring-border px-3 py-1.5 text-xs text-muted">
              <span className="status-dot h-1.5 w-1.5 rounded-full bg-accent" />
              Staff sign-up
            </span>
            <ThemeToggle size="sm" />
          </div>
        </div>
      </header>

      {/* Split content */}
      <div className="relative z-10 flex-1 px-5 sm:px-8 lg:px-12 pb-10 lg:pb-12 pt-8 lg:pt-12">
        <div className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-12 xl:gap-16 max-w-7xl mx-auto h-full">
          {/* LEFT — content + 3-step bento */}
          <aside className="flex flex-col justify-center gap-8 lg:gap-10 mb-10 lg:mb-0">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-surface ring-1 ring-border px-3 py-1 text-xs text-muted fade-up">
                <span className="status-dot h-1.5 w-1.5 rounded-full bg-accent" />
                For teachers and administrators
              </div>

              <h1
                className="font-display tracking-tighter leading-[1.02] text-text fade-up fade-up-delay-1"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
              >
                Join the team that{" "}
                <span className="text-gradient italic">runs the school.</span>
              </h1>

              <p className="text-muted text-base sm:text-lg max-w-[52ch] fade-up fade-up-delay-2">
                Create your staff account in a minute. An existing admin will
                verify your device, then you'll have everything you need to
                manage your classes, students and records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl">
              <StepTile
                step="01"
                title="Fill your details"
                body="Name, work email, password and role."
                delay="fade-up-delay-3"
              />
              <StepTile
                step="02"
                title="Get verified"
                body="An admin reviews and verifies your device."
                delay="fade-up-delay-4"
              />
              <StepTile
                step="03"
                title="You're in"
                body="Sign in and run things at a glance."
                delay="fade-up-delay-5"
              />
            </div>
          </aside>

          {/* RIGHT — register card */}
          <main className="flex items-center">
            <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto fade-up fade-up-delay-2">
              <div className="relative">
                <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
                <div className="glass rounded-2xl p-7 sm:p-8 shadow-card">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] uppercase tracking-wider text-muted">
                      Create staff account
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-[28px] tracking-tight text-text">
                    Get started
                  </h2>
                  <p className="text-muted text-sm mt-1.5">
                    A device check keeps things safe. Verification is quick.
                  </p>

                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-6 space-y-4"
                  >
                    <Input
                      label="Full name"
                      placeholder="e.g. Aline U."
                      icon={<UserIcon />}
                      error={form.formState.errors.name?.message}
                      {...form.register("name")}
                    />
                    <Input
                      label="Work email"
                      type="email"
                      placeholder="you@school.rw"
                      icon={<MailIcon />}
                      error={form.formState.errors.email?.message}
                      {...form.register("email")}
                    />
                    <Input
                      label="Password"
                      type="password"
                      placeholder="At least 6 characters"
                      icon={<LockIcon />}
                      error={form.formState.errors.password?.message}
                      {...form.register("password")}
                    />

                    <div>
                      <span className="block text-xs font-medium text-muted mb-2 tracking-wide uppercase">
                        I am a
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <RoleOption
                          label="Teacher"
                          description="Update grades & attendance"
                          active={role === "TEACHER"}
                          onClick={() =>
                            form.setValue("role", "TEACHER", { shouldValidate: true })
                          }
                          icon={<CapIcon />}
                        />
                        <RoleOption
                          label="Admin"
                          description="Run the whole school"
                          active={role === "ADMIN"}
                          onClick={() =>
                            form.setValue("role", "ADMIN", { shouldValidate: true })
                          }
                          icon={<ShieldIcon />}
                        />
                      </div>
                      <input type="hidden" {...form.register("role")} />
                    </div>

                    {form.formState.errors.root?.message ? (
                      <div className="rounded-control bg-danger/10 ring-1 ring-danger/30 px-3 py-2.5 text-danger text-xs">
                        {form.formState.errors.root.message}
                      </div>
                    ) : null}

                    <Button
                      type="submit"
                      loading={form.formState.isSubmitting}
                      className="w-full"
                      size="lg"
                    >
                      Create account
                    </Button>
                  </form>

                  <div className="mt-5 flex items-center justify-center">
                    <div className="inline-flex items-center gap-2 text-[11px] text-muted bg-surface2/60 ring-1 ring-border rounded-full px-3 py-1.5">
                      <span className="status-dot h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>Device ID</span>
                      <span className="font-mono text-text/80 truncate max-w-[160px]">
                        {deviceId()}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-muted mt-5">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-accent hover:underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );

  function StepTile({ step, title, body, delay }) {
    return (
      <div
        onMouseMove={handleTileMouseMove}
        className={`tile p-5 fade-up ${delay}`}
      >
        <div className="text-[11px] uppercase tracking-wider text-muted">
          Step {step}
        </div>
        <div className="mt-2 text-text font-medium">{title}</div>
        <div className="mt-1 text-xs text-muted leading-relaxed">{body}</div>
      </div>
    );
  }
}

function RoleOption({ label, description, active, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "text-left rounded-control p-3.5 transition-all duration-200 ease-smooth",
        "ring-1",
        active
          ? "ring-accent bg-accent/5"
          : "ring-border bg-surface hover:ring-borderStrong hover:bg-surface2",
      ].join(" ")}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={[
            "h-7 w-7 rounded-full inline-flex items-center justify-center flex-shrink-0",
            active ? "bg-accent text-bg" : "bg-surface2 text-muted",
          ].join(" ")}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-sm font-medium text-text">{label}</div>
          <div className="text-[11px] text-muted leading-snug mt-0.5">
            {description}
          </div>
        </div>
      </div>
    </button>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
