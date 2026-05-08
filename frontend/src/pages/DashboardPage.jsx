import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader.jsx";
import Button from "../components/ui/Button.jsx";
import { api } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";
import { useCountUp } from "../hooks/useCountUp.js";

// Tracks the mouse over a tile so its radial spotlight can follow.
function handleTileMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

function formatRWF(value) {
  const n = Number(value) || 0;
  return `${n.toLocaleString()} RWF`;
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  async function loadStats() {
    setLoading(true);
    setPageError("");
    try {
      const res = await api.get("/api/admin/dashboard/stats");
      setStats(res.data?.data?.stats ?? null);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  const students = stats?.students ?? 0;
  const teachers = stats?.teachers ?? 0;
  const feeCollection = stats?.feeCollection ?? 0;
  const attendanceRate = stats?.attendanceRate ?? 0;

  const greeting = user?.name
    ? `Welcome back, ${user.name.split(" ")[0]}.`
    : "Welcome back.";

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title={greeting}
          subtitle="A quiet pulse on every part of your school."
          pill="Live overview"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={loadStats}
              disabled={loading}
            >
              {loading ? "Refreshing" : "Refresh"}
            </Button>
          }
        />

        {pageError ? (
          <div className="mb-6 rounded-control bg-danger/10 ring-1 ring-danger/30 px-4 py-3 text-danger text-sm fade-up">
            {pageError}
          </div>
        ) : null}

        {/* Bento stat grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 fade-up fade-up-delay-1">
          <StudentsCard count={students} loading={loading} />
          <TeachersCard count={teachers} loading={loading} />
          <FeeCollectionCard amount={feeCollection} loading={loading} />
          <AttendanceCard percent={attendanceRate} loading={loading} />
        </div>

        {/* Secondary row: snapshot + tips */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 fade-up fade-up-delay-3">
          <div
            onMouseMove={handleTileMouseMove}
            className="tile p-6 lg:col-span-2"
          >
            <div className="text-xs uppercase tracking-wider text-muted">
              Today at a glance
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Snippet label="Students" value={loading ? "—" : students.toLocaleString()} />
              <Snippet label="Teachers" value={loading ? "—" : teachers.toLocaleString()} />
              <Snippet label="Collected" value={loading ? "—" : formatRWF(feeCollection)} />
              <Snippet label="Attendance" value={loading ? "—" : `${attendanceRate}%`} />
            </div>
            <div className="mt-6 h-1 rounded-full bg-surface2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accentHover transition-[width] duration-1000 ease-smooth"
                style={{ width: `${Math.min(100, Number(attendanceRate) || 0)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-muted">
              Attendance rate sits at{" "}
              <span className="text-text">{attendanceRate}%</span> across the school.
            </p>
          </div>

          <div onMouseMove={handleTileMouseMove} className="tile p-6">
            <div className="text-xs uppercase tracking-wider text-muted">
              Quick actions
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <ActionLink to="/users" label="Verify a device" />
              <ActionLink to="/classes" label="Create a class" />
              <ActionLink to="/teachers" label="Assign a teacher" />
              <ActionLink to="/fees" label="Review fee transactions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsCard({ count, loading }) {
  const v = useCountUp(count, { duration: 1400, delay: 150 });
  return (
    <div onMouseMove={handleTileMouseMove} className="tile p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted">Students</div>
        <UsersIcon />
      </div>
      <div className="mt-3 text-3xl sm:text-4xl font-semibold text-text tabular-nums">
        {loading ? "—" : Math.round(v).toLocaleString()}
      </div>
      <div className="mt-2 text-[11px] text-muted">Total enrolled</div>
    </div>
  );
}

function TeachersCard({ count, loading }) {
  const v = useCountUp(count, { duration: 1400, delay: 220 });
  return (
    <div onMouseMove={handleTileMouseMove} className="tile p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted">Teachers</div>
        <CapIcon />
      </div>
      <div className="mt-3 text-3xl sm:text-4xl font-semibold text-text tabular-nums">
        {loading ? "—" : Math.round(v).toLocaleString()}
      </div>
      <div className="mt-2 text-[11px] text-muted">Active staff</div>
    </div>
  );
}

function FeeCollectionCard({ amount, loading }) {
  const v = useCountUp(amount, { duration: 1600, delay: 280 });
  return (
    <div onMouseMove={handleTileMouseMove} className="tile p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted">Fees collected</div>
        <CoinsIcon />
      </div>
      <div className="mt-3 text-3xl sm:text-4xl font-semibold text-text tabular-nums">
        {loading ? "—" : Math.round(v).toLocaleString()}
        <span className="text-base text-muted ml-1.5">RWF</span>
      </div>
      <div className="mt-2 text-[11px] text-muted">Across all students</div>
    </div>
  );
}

function AttendanceCard({ percent, loading }) {
  const v = useCountUp(percent, { duration: 1400, delay: 340 });
  const radius = 26;
  const circ = 2 * Math.PI * radius;
  const off = circ - ((Number(percent) || 0) / 100) * circ;
  return (
    <div onMouseMove={handleTileMouseMove} className="tile p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted">Attendance</div>
        <span className="status-dot h-1.5 w-1.5 rounded-full bg-accent" />
      </div>
      <div className="mt-3 flex items-center gap-4">
        <svg width="64" height="64" viewBox="0 0 64 64" className="rotate-[-90deg] flex-shrink-0">
          <circle cx="32" cy="32" r={radius} stroke="var(--color-border-strong)" strokeWidth="6" fill="none" />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="var(--color-accent)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            style={{ "--circ": circ, "--off": off }}
            className="ring-anim"
          />
        </svg>
        <div>
          <div className="text-3xl font-semibold text-text tabular-nums">
            {loading ? "—" : Math.round(v)}
            <span className="text-base text-muted">%</span>
          </div>
          <div className="text-[11px] text-muted">Today's rate</div>
        </div>
      </div>
    </div>
  );
}

function Snippet({ label, value }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 text-base sm:text-lg text-text font-medium tabular-nums">
        {value}
      </div>
    </div>
  );
}

function ActionLink({ to, label }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-control bg-surface2/60 ring-1 ring-border hover:ring-borderStrong hover:bg-surface2 text-sm text-text transition-all"
    >
      <span>{label}</span>
      <span className="text-muted group-hover:text-accent transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
      <circle cx="9" cy="9" r="6" />
      <path d="M19 9a6 6 0 0 1-6 6M15 17a6 6 0 0 1-6 6" />
    </svg>
  );
}
