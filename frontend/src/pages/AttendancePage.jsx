import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Table from "../components/ui/Table.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { api } from "../services/api.js";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function badgeForStatus(status) {
  if (status === "PRESENT") return <Badge variant="success">Present</Badge>;
  if (status === "LATE") return <Badge variant="warning">Late</Badge>;
  if (status === "ABSENT") return <Badge variant="danger">Absent</Badge>;
  return <Badge variant="neutral">{status || "—"}</Badge>;
}

function handleTileMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

// Themed select to match input styling.
function Select({ label, value, onChange, children }) {
  return (
    <div className="w-full">
      {label ? (
        <label className="block text-xs font-medium text-muted mb-2 tracking-wide uppercase">
          {label}
        </label>
      ) : null}
      <select
        value={value}
        onChange={onChange}
        className="w-full h-12 px-4 rounded-control bg-surface ring-1 ring-border hover:ring-borderStrong focus:ring-2 focus:ring-accent/60 outline-none transition-all duration-200 ease-smooth text-text"
      >
        {children}
      </select>
    </div>
  );
}

export default function AttendancePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [status, setStatus] = useState("");
  const [classId, setClassId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  async function loadAttendance() {
    setLoading(true);
    setPageError("");
    try {
      const params = new URLSearchParams();
      if (status.trim()) params.set("status", status.trim());
      if (classId.trim()) params.set("classId", classId.trim());
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const qs = params.toString();
      const res = await api.get(`/api/admin/attendance${qs ? `?${qs}` : ""}`);
      setItems(res.data?.data?.items ?? []);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  const summary = useMemo(() => {
    let p = 0, a = 0, l = 0;
    for (const r of items) {
      if (r.status === "PRESENT") p++;
      else if (r.status === "ABSENT") a++;
      else if (r.status === "LATE") l++;
    }
    return { p, a, l };
  }, [items]);

  const columns = useMemo(
    () => [
      {
        key: "date",
        header: "Date",
        render: (r) => <span className="text-xs text-muted">{formatDate(r.date)}</span>,
      },
      { key: "status", header: "Status", render: (r) => badgeForStatus(r.status) },
      {
        key: "admissionNumber",
        header: "Adm No",
        render: (r) => <span className="font-mono text-xs">{r.admissionNumber}</span>,
      },
      { key: "studentName", header: "Student" },
      {
        key: "className",
        header: "Class",
        render: (r) => r.className || <span className="text-muted">—</span>,
      },
    ],
    []
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Attendance"
          subtitle="Daily presence at a glance, filterable by class and date."
          pill="Daily presence"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={loadAttendance}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 fade-up fade-up-delay-1">
          <CountTile label="Present" value={summary.p} tone="success" />
          <CountTile label="Late" value={summary.l} tone="warning" />
          <CountTile label="Absent" value={summary.a} tone="danger" />
        </div>

        <div className="fade-up fade-up-delay-2 mb-4">
          <Card title="Filters" subtitle="Narrow the list to what matters">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="PRESENT">Present</option>
                <option value="LATE">Late</option>
                <option value="ABSENT">Absent</option>
              </Select>
              <Input
                label="Class ID (optional)"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                placeholder="Paste classId"
              />
              <Input
                label="From"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <Input
                label="To"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-muted text-xs">
                {loading ? "Loading…" : `${items.length} record(s) found`}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setStatus("");
                    setClassId("");
                    setDateFrom("");
                    setDateTo("");
                  }}
                >
                  Clear
                </Button>
                <Button size="sm" onClick={loadAttendance} disabled={loading}>
                  Apply
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="fade-up fade-up-delay-3">
          <Card title="Records" subtitle="Newest first">
            <Table columns={columns} rows={items} rowKey={(r) => r.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function CountTile({ label, value, tone = "neutral" }) {
  const toneText =
    tone === "success"
      ? "text-success"
      : tone === "warning"
      ? "text-accent"
      : tone === "danger"
      ? "text-danger"
      : "text-text";
  return (
    <div onMouseMove={handleTileMouseMove} className="tile p-5">
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className={`mt-2 text-3xl font-semibold tabular-nums ${toneText}`}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}
