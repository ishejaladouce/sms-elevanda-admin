import { useAuthStore } from "../store/authStore.js";
import { useThemeStore } from "../store/themeStore.js";
import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/ui/Card.jsx";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="Settings"
          subtitle="Your admin profile and personal preferences."
          pill="Profile"
        />

        <div className="space-y-4">
          <div className="fade-up fade-up-delay-1">
            <Card title="Account" subtitle="Read-only details from your record">
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Name" value={user?.name || "—"} />
                <Field label="Email" value={user?.email || "—"} mono />
                <Field label="Role" value={user?.role || "—"} mono />
              </dl>
            </Card>
          </div>

          <div className="fade-up fade-up-delay-2">
            <Card
              title="Appearance"
              subtitle="Pick a look that's easier on your eyes"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <ThemeOption
                  label="Dark"
                  description="Default. Soft on the eyes at night."
                  active={theme === "dark"}
                  onClick={() => setTheme("dark")}
                  icon={<MoonIcon />}
                />
                <ThemeOption
                  label="Light"
                  description="Crisp and bright for daytime."
                  active={theme === "light"}
                  onClick={() => setTheme("light")}
                  icon={<SunIcon />}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono = false }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-muted">{label}</dt>
      <dd className={`mt-1 text-text ${mono ? "font-mono text-sm" : ""}`}>{value}</dd>
    </div>
  );
}

function ThemeOption({ label, description, active, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex-1 text-left rounded-control p-4 transition-all duration-200 ease-smooth",
        "ring-1",
        active
          ? "ring-accent bg-accent/5"
          : "ring-border bg-surface hover:ring-borderStrong hover:bg-surface2",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <span
          className={[
            "h-9 w-9 rounded-full inline-flex items-center justify-center flex-shrink-0",
            active ? "bg-accent text-bg" : "bg-surface2 text-muted",
          ].join(" ")}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-sm font-medium text-text">{label}</div>
          <div className="text-xs text-muted mt-0.5">{description}</div>
        </div>
      </div>
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
