import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { api } from "../../services/api.js";
import Button from "../ui/Button.jsx";

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-control text-sm transition duration-200 ease-smooth",
          isActive ? "bg-accent text-bg" : "text-muted hover:bg-surface2 hover:text-text",
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

  const hideOnAuthPages = location.pathname === "/login";
  if (hideOnAuthPages) return null;

  async function logout() {
    await api.post("/api/auth/logout");
    clear();
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-3">
        <Link to="/dashboard" className="font-display text-lg">
          SMS Elevanda • Admin
        </Link>

        <nav className="flex items-center gap-1">
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/users" label="Users" />
          <NavItem to="/classes" label="Classes" />
          <NavItem to="/students" label="Students" />
          <NavItem to="/teachers" label="Teachers" />
          <NavItem to="/fees" label="Fees" />
          <NavItem to="/grades" label="Grades" />
          <NavItem to="/attendance" label="Attendance" />
          <NavItem to="/settings" label="Settings" />
        </nav>

        <div className="flex items-center gap-3">
          {user?.email ? <span className="hidden md:inline text-sm text-muted">{user.email}</span> : null}
          <Button variant="secondary" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

