import { useEffect, useState } from "react";
import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Table from "../components/ui/Table.jsx";
import Button from "../components/ui/Button.jsx";
import { api } from "../services/api.js";

export default function TeacherDashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  async function load() {
    setLoading(true);
    setPageError("");
    try {
      const res = await api.get("/api/teacher/classes");
      setItems(res.data?.data?.items ?? []);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const rows = items.flatMap((c) =>
    (c.students || []).map((s) => ({
      className: c.name,
      student: s.name || "—",
      admissionNumber: s.admissionNumber || "—",
    }))
  );

  const columns = [
    { key: "className", header: "Class" },
    { key: "student", header: "Student" },
    { key: "admissionNumber", header: "Adm No" },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="My classes"
          subtitle="Students assigned to you."
          pill="Teacher"
          action={
            <Button variant="secondary" size="sm" onClick={load} disabled={loading}>
              {loading ? "Refreshing" : "Refresh"}
            </Button>
          }
        />

        {pageError ? (
          <div className="mb-6 rounded-control bg-danger/10 ring-1 ring-danger/30 px-4 py-3 text-danger text-sm fade-up">
            {pageError}
          </div>
        ) : null}

        <div className="fade-up fade-up-delay-1">
          <Card title="Students" subtitle={loading ? "Loading…" : `${rows.length} total`}>
            <Table columns={columns} rows={rows} rowKey={(r) => `${r.className}-${r.admissionNumber}`} />
          </Card>
        </div>
      </div>
    </div>
  );
}

