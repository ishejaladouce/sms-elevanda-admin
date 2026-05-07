import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import Logo from "../components/brand/Logo.jsx";
import { api } from "../services/api.js";
import { deviceId } from "../utils/device.js";
import { useAuthStore } from "../store/authStore.js";
import { useCountUp } from "../hooks/useCountUp.js";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// Updates the page-wide spotlight position so it follows the cursor.
function handleMouseMove(e) {
  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  target.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

// Updates a single tile's spotlight position.
function handleTileMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export default function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();
  const flashNotice = location.state?.notice;
  const setUser = useAuthStore((s) => s.setUser);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    try {
      form.clearErrors("root");
      const res = await api.post("/api/auth/login", {
        ...values,
        deviceId: deviceId(),
      });
      setUser(res.data?.data?.user ?? null);
      nav("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      form.setError("root", { type: "server", message });
    }
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen relative overflow-hidden bg-bg text-text flex flex-col"
    >
      {/* Background atmosphere: aurora blobs, grid pattern, grain, mouse spotlight */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="aurora-blob absolute -top-40 -left-20 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-accent), transparent 60%)" }}
        />
        <div
          className="aurora-blob absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-accent-strong), transparent 60%)", animationDelay: "-8s" }}
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
              Staff portal
            </span>
            <ThemeToggle size="sm" />
          </div>
        </div>
      </header>

      {/* Split content: hero left, form right */}
      <div className="relative z-10 flex-1 px-5 sm:px-8 lg:px-12 pb-10 lg:pb-12 pt-8 lg:pt-12">
        <div className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-12 xl:gap-16 max-w-7xl mx-auto h-full">
          {/* LEFT — content + bento metrics */}
          <aside className="flex flex-col justify-center gap-8 lg:gap-10 mb-10 lg:mb-0">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-surface ring-1 ring-border px-3 py-1 text-xs text-muted fade-up">
                <span className="status-dot h-1.5 w-1.5 rounded-full bg-accent" />
                Operations control room
              </div>

              <h1
                className="font-display tracking-tighter leading-[1.02] text-text fade-up fade-up-delay-1"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
              >
                Run the school,{" "}
                <span className="text-gradient italic">at a glance.</span>
              </h1>

              <p className="text-muted text-base sm:text-lg max-w-[52ch] fade-up fade-up-delay-2">
                Verify devices, manage classes, and watch fees, attendance and
                grades flow in real time. One quiet console for every moving
                part of your school.
              </p>
            </div>

            {/* Bento metric tiles */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl">
              <div onMouseMove={handleTileMouseMove} className="tile p-5 fade-up fade-up-delay-3">
                <div className="text-[11px] uppercase tracking-wider text-muted">
                  Students
                </div>
                <CountStat value={1284} className="mt-2 text-3xl sm:text-4xl font-semibold text-text tabular-nums" />
                <MiniBars />
              </div>

              <div onMouseMove={handleTileMouseMove} className="tile p-5 fade-up fade-up-delay-4">
                <div className="text-[11px] uppercase tracking-wider text-muted">
                  Fees collected
                </div>
                <div className="mt-2 text-3xl sm:text-4xl font-semibold text-text tabular-nums">
                  <CountStat value={42} suffix="M" />
                  <span className="text-base text-muted ml-1.5 align-middle">RWF</span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-surface2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-accentHover"
                    style={{ width: "78%" }}
                  />
                </div>
                <div className="mt-2 text-[11px] text-muted">78% of term target</div>
              </div>

              <div onMouseMove={handleTileMouseMove} className="tile p-5 fade-up fade-up-delay-5">
                <div className="text-[11px] uppercase tracking-wider text-muted">
                  Attendance today
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <RingChart percent={94} />
                  <div>
                    <div className="text-text text-2xl font-semibold tabular-nums">
                      94<span className="text-muted text-base">%</span>
                    </div>
                    <div className="text-[11px] text-muted">Across 32 classes</div>
                  </div>
                </div>
              </div>

              <div onMouseMove={handleTileMouseMove} className="tile p-5 fade-up fade-up-delay-6">
                <div className="text-[11px] uppercase tracking-wider text-muted">
                  Pending verifications
                </div>
                <CountStat value={7} className="mt-2 text-3xl sm:text-4xl font-semibold text-text tabular-nums" />
                <div className="mt-3 flex items-center gap-2 text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="status-dot h-1.5 w-1.5 rounded-full bg-warning" />
                    Awaiting your action
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT — sign-in card */}
          <main className="flex items-center">
            <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto fade-up fade-up-delay-2">
              <div className="relative">
                {/* Subtle accent gradient hairline on top */}
                <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
                <div className="glass rounded-2xl p-7 sm:p-8 shadow-card">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] uppercase tracking-wider text-muted">
                      Welcome back
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-[28px] tracking-tight text-text">
                    Sign in to continue
                  </h2>
                  <p className="text-muted text-sm mt-1.5">
                    Verified staff devices only. Sessions clear when the
                    browser closes.
                  </p>

                  {flashNotice ? (
                    <div className="mt-5 rounded-control bg-success/10 ring-1 ring-success/30 px-3 py-2.5 text-success text-xs">
                      {flashNotice}
                    </div>
                  ) : null}

                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-6 space-y-4"
                  >
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
                      placeholder="Enter your password"
                      icon={<LockIcon />}
                      error={form.formState.errors.password?.message}
                      {...form.register("password")}
                    />

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
                      Sign in
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
                  New here?{" "}
                  <Link
                    to="/register"
                    className="text-accent hover:underline underline-offset-4"
                  >
                    Create a staff account
                  </Link>
                  . An admin will verify your device.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Animated counter for stat tiles.
function CountStat({ value, suffix = "", className = "" }) {
  const v = useCountUp(value, { duration: 1400, delay: 250 });
  return (
    <span className={className}>
      {Math.round(v).toLocaleString()}
      {suffix}
    </span>
  );
}

// Small animated bar chart used in the Students tile.
function MiniBars() {
  const bars = [38, 56, 44, 72, 60, 84, 70];
  return (
    <div className="mt-3 flex items-end gap-1 h-10">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-gradient-to-t from-accent/30 to-accent bar-grow"
          style={{ "--h": h / 100, animationDelay: `${300 + i * 60}ms`, height: `${h}%` }}
        />
      ))}
    </div>
  );
}

// Animated ring chart for attendance percentage.
function RingChart({ percent = 0 }) {
  const radius = 22;
  const circ = 2 * Math.PI * radius;
  const off = circ - (percent / 100) * circ;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="rotate-[-90deg]">
      <circle
        cx="28"
        cy="28"
        r={radius}
        stroke="var(--color-border-strong)"
        strokeWidth="5"
        fill="none"
      />
      <circle
        cx="28"
        cy="28"
        r={radius}
        stroke="var(--color-accent)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        style={{ "--circ": circ, "--off": off }}
        className="ring-anim"
      />
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
