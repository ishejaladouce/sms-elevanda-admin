import { useEffect, useState } from "react";
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
  const [notice, setNotice] = useState("");
  const [deviceMismatchHint, setDeviceMismatchHint] = useState(null);
  const setUser = useAuthStore((s) => s.setUser);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    const incoming = typeof flashNotice === "string" ? flashNotice : "";
    if (incoming) {
      setNotice(incoming);
      try {
        sessionStorage.setItem("sms_admin_flash_notice", incoming);
      } catch {
        // ignore
      }
      nav(location.pathname, { replace: true, state: {} });
      return;
    }
    try {
      const stored = sessionStorage.getItem("sms_admin_flash_notice");
      if (stored) setNotice(stored);
    } catch {
      // ignore
    }
  }, [flashNotice, location.pathname, nav]);

  async function onSubmit(values) {
    try {
      form.clearErrors("root");
      setDeviceMismatchHint(null);
      const res = await api.post("/api/auth/login", {
        ...values,
        deviceId: deviceId(),
      });
      setUser(res.data?.data?.user ?? null);
      nav("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      form.setError("root", { type: "server", message });
      const hint = err?.response?.data?.data;
      if (hint && typeof hint === "object") setDeviceMismatchHint(hint);
      else setDeviceMismatchHint(null);
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

            {/* Feature tiles — what this console does */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl">
              <FeatureTile
                icon={<ShieldIcon />}
                title="Verify devices"
                body="One tap unlocks a teacher's or parent's account on their device — secure by default."
                delay="fade-up-delay-3"
              />
              <FeatureTile
                icon={<CapIcon />}
                title="Classes & teachers"
                body="Build classes, assign teachers and keep schedules tidy without spreadsheets."
                delay="fade-up-delay-4"
              />
              <FeatureTile
                icon={<CalendarIcon />}
                title="Attendance pulse"
                body="See daily presence across every class in one calm, filterable view."
                delay="fade-up-delay-5"
              />
              <FeatureTile
                icon={<CoinsIcon />}
                title="Money flow"
                body="Every deposit, refund and balance — transparent across the whole school."
                delay="fade-up-delay-6"
              />
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

                  {notice ? (
                    <div className="mt-5 rounded-control bg-success/10 ring-1 ring-success/30 px-4 py-3 text-success text-sm flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-wider text-success/80">
                          Success
                        </div>
                        <div className="mt-1">{notice}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNotice("");
                          try {
                            sessionStorage.removeItem("sms_admin_flash_notice");
                          } catch {
                            // ignore
                          }
                        }}
                        className="flex-shrink-0 text-xs text-success/80 hover:text-success underline underline-offset-4"
                      >
                        Dismiss
                      </button>
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
                      <div className="rounded-control bg-danger/10 ring-1 ring-danger/30 px-3 py-2.5 text-danger text-xs space-y-2">
                        <p>{form.formState.errors.root.message}</p>
                        {deviceMismatchHint ? (
                          <p className="font-mono text-[10px] text-muted leading-relaxed break-all">
                            Dev check: stored length {deviceMismatchHint.storedLength}, sent length{" "}
                            {deviceMismatchHint.incomingLength}; stored starts{" "}
                            {deviceMismatchHint.storedStartsWith || "?"}, sent starts{" "}
                            {deviceMismatchHint.incomingStartsWith || "?"}. If lengths differ, the ID
                            in the database is not the one this page is sending. Use the same site
                            address (including port) when you copy the Device ID into Prisma.
                          </p>
                        ) : null}
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

                  <div className="mt-5 flex flex-col items-center gap-1">
                    <div className="inline-flex items-center gap-2 text-[11px] text-muted bg-surface2/60 ring-1 ring-border rounded-full px-3 py-1.5 max-w-full">
                      <span className="status-dot h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                      <span>Device ID</span>
                      <span className="font-mono text-text/80 truncate min-w-0">
                        {deviceId()}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted text-center px-2 max-w-md">
                      Tied to this address only:{" "}
                      <span className="font-mono text-text/80">
                        {typeof window !== "undefined" ? window.location.origin : ""}
                      </span>
                      . A different port = a different ID. Update the user in Prisma to match this exact
                      ID, or run{" "}
                      <span className="font-mono text-text/70">node scripts/set-device.cjs</span> from{" "}
                      <span className="font-mono text-text/70">admin/backend</span>.
                    </p>
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

// Feature tile shown on the marketing side of the login layout.
function FeatureTile({ icon, title, body, delay = "" }) {
  return (
    <div
      onMouseMove={handleTileMouseMove}
      className={`tile p-5 fade-up ${delay}`}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 ring-1 ring-accent/25 text-accent">
        {icon}
      </span>
      <div className="mt-4 font-display text-lg sm:text-xl tracking-tight text-text">
        {title}
      </div>
      <p className="mt-1.5 text-xs sm:text-sm text-muted leading-relaxed">
        {body}
      </p>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="m8 14 2 2 4-4" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
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
