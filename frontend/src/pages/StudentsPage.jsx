import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Table from "../components/ui/Table.jsx";
import { api } from "../services/api.js";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  async function loadStudents() {
    setLoading(true);
    setPageError("");
    try {
      const res = await api.get("/api/admin/students");
      setStudents(res.data?.data?.items ?? []);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const columns = useMemo(
    () => [
      { key: "admissionNumber", header: "Admission #" },
      { key: "studentName", header: "Student" },
      { key: "className", header: "Class", render: (r) => <span className="text-muted">{r.className || "—"}</span> },
      { key: "parentName", header: "Parent", render: (r) => <span className="text-muted">{r.parentName || "—"}</span> },
      { key: "parentEmail", header: "Parent email", render: (r) => (r.parentEmail ? <span className="font-mono">{r.parentEmail}</span> : "—") },
    ],
    []
  );

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl">Students</h1>
        <p className="text-muted mt-1">All students</p>

        {pageError ? <div className="mt-4 text-danger text-sm">{pageError}</div> : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-muted text-sm">{loading ? "Loading..." : `${students.length} student(s)`}</div>
          <Button variant="secondary" size="sm" onClick={loadStudents} disabled={loading}>
            Refresh
          </Button>
        </div>

        <div className="mt-3">
          <Card>
            <Table columns={columns} rows={students} rowKey={(r) => r.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}

