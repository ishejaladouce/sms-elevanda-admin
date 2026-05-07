import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { api } from "../../services/api.js";
import Logo from "../brand/Logo.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";

// Single nav link entry. Active state uses subtle filled background.
function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-control text-sm transition-all duration-200 ease-smooth whitespace-nowrap",
          isActive
            ? "bg-surface2 text-text ring-1 ring-borderStrong"
            : "text-muted hover:bg-surface2 hover:text-text",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const [open, setOpen] = useState(false);

  // Hide chrome on auth pages so the marketing layout can fill the screen.
  const hideOnAuthPages =
    location.pathname === "/login" || location.pathname === "/register";
  if (hideOnAuthPages) return null;

  async function logout() {
    try {
      await api.post("/api/auth/logout");
    } catch {
      /* ignore network errors during logout */
    }
    clear();
    window.location.href = "/login";
  }

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/users", label: "Users" },
    { to: "/classes", label: "Classes" },
    { to: "/students", label: "Students" },
    { to: "/teachers", label: "Teachers" },
    { to: "/fees", label: "Fees" },
    { to: "/grades", label: "Grades" },
    { to: "/attendance", label: "Attendance" },
    { to: "/settings", label: "Settings" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/dashboard" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {links.map((l) => (
              <NavItem key={l.to} to={l.to} label={l.label} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user?.email ? (
              <span className="hidden md:inline text-xs text-muted truncate max-w-[180px]">
                {user.email}
              </span>
            ) : null}
            <ThemeToggle size="sm" className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={logout}
              className="hidden sm:inline-flex h-9 px-3.5 rounded-control text-xs font-medium text-muted hover:text-text bg-surface ring-1 ring-border hover:ring-borderStrong hover:bg-surface2 transition-all"
            >
              Logout
            </button>

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="xl:hidden h-9 w-9 inline-flex items-center justify-center rounded-control bg-surface ring-1 ring-border text-muted hover:text-text hover:bg-surface2 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {open ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="xl:hidden bg-bg border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavItem
                key={l.to}
                to={l.to}
                label={l.label}
                onClick={() => setOpen(false)}
              />
            ))}
            <div className="mt-2 flex items-center justify-between gap-2">
              <ThemeToggle size="sm" />
              <button
                type="button"
                onClick={logout}
                className="flex-1 h-9 px-3.5 rounded-control text-xs font-medium text-muted hover:text-text bg-surface ring-1 ring-border hover:ring-borderStrong hover:bg-surface2 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
