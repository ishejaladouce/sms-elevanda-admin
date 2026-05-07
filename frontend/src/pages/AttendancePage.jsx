import { useEffect, useMemo, useState } from "react";
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

  const columns = useMemo(
    () => [
      { key: "date", header: "Date", render: (r) => <span className="text-sm">{formatDate(r.date)}</span> },
      { key: "status", header: "Status", render: (r) => badgeForStatus(r.status) },
      { key: "admissionNumber", header: "Adm No", render: (r) => <span className="font-mono">{r.admissionNumber}</span> },
      { key: "studentName", header: "Student" },
      { key: "className", header: "Class", render: (r) => r.className || <span className="text-muted">—</span> },
    ],
    []
  );

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl">Attendance</h1>
        <p className="text-muted mt-1">Attendance records across all students</p>

        {pageError ? <div className="mt-4 text-danger text-sm">{pageError}</div> : null}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            label="Status (optional)"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="PRESENT / ABSENT / LATE"
          />
          <Input label="Class ID (optional)" value={classId} onChange={(e) => setClassId(e.target.value)} placeholder="Paste classId" />
          <Input label="From (optional)" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="To (optional)" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-muted text-sm">{loading ? "Loading..." : `${items.length} record(s)`}</div>
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

        <div className="mt-3">
          <Card>
            <Table columns={columns} rows={items} rowKey={(r) => r.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}

