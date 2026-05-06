import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Table from "../components/ui/Table.jsx";
import Badge from "../components/ui/Badge.jsx";
import { api } from "../services/api.js";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  async function loadTeachers() {
    setLoading(true);
    setPageError("");
    try {
      const res = await api.get("/api/admin/teachers");
      setTeachers(res.data?.data?.items ?? []);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeachers();
  }, []);

  const columns = useMemo(
    () => [
      { key: "name", header: "Name" },
      { key: "email", header: "Email", render: (r) => (r.email ? <span className="font-mono">{r.email}</span> : "—") },
      {
        key: "classes",
        header: "Assigned classes",
        render: (r) =>
          r.classes?.length ? (
            <div className="flex gap-2 flex-wrap">
              {r.classes.map((c) => (
                <Badge key={c.id}>{c.name}</Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted">—</span>
          ),
      },
    ],
    []
  );

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl">Teachers</h1>
        <p className="text-muted mt-1">All teachers</p>

        {pageError ? <div className="mt-4 text-danger text-sm">{pageError}</div> : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-muted text-sm">{loading ? "Loading..." : `${teachers.length} teacher(s)`}</div>
          <Button variant="secondary" size="sm" onClick={loadTeachers} disabled={loading}>
            Refresh
          </Button>
        </div>

        <div className="mt-3">
          <Card>
            <Table columns={columns} rows={teachers} rowKey={(r) => r.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}

