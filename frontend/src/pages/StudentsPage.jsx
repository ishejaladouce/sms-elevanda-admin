import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Table from "../components/ui/Table.jsx";
import { api } from "../services/api.js";

function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full h-10 px-3 rounded-control bg-surface ring-1 ring-border hover:ring-borderStrong focus:ring-2 focus:ring-accent/60 outline-none transition-all duration-200 ease-smooth text-text text-sm"
    >
      {children}
    </select>
  );
}

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  async function loadStudents() {
    setLoading(true);
    setPageError("");
    try {
      const [sRes, cRes] = await Promise.all([
        api.get("/api/admin/students"),
        api.get("/api/admin/classes"),
      ]);
      setStudents(sRes.data?.data?.items ?? []);
      setClasses(cRes.data?.data?.items ?? []);
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
      {
        key: "admissionNumber",
        header: "Admission #",
        render: (r) => <span className="font-mono text-xs">{r.admissionNumber}</span>,
      },
      {
        key: "studentName",
        header: "Student",
        render: (r) => <span className="text-text">{r.studentName}</span>,
      },
      {
        key: "className",
        header: "Class",
        render: (r) => (
          <div className="min-w-[220px]">
            <Select
              value={r.classId || ""}
              onChange={async (e) => {
                const next = e.target.value || null;
                try {
                  setPageError("");
                  await api.patch(`/api/admin/students/${r.id}/class`, { classId: next });
                  await loadStudents();
                } catch (err) {
                  setPageError(err?.response?.data?.message || "Failed to assign class");
                }
              }}
            >
              <option value="">Unassigned</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        ),
      },
      {
        key: "parentName",
        header: "Parent",
        render: (r) => (
          <span className="text-text">
            {r.parentName || <span className="text-muted">—</span>}
          </span>
        ),
      },
      {
        key: "parentEmail",
        header: "Parent email",
        render: (r) =>
          r.parentEmail ? (
            <span className="font-mono text-xs">{r.parentEmail}</span>
          ) : (
            <span className="text-muted">—</span>
          ),
      },
    ],
    [classes]
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Students"
          subtitle="Every learner enrolled in the school."
          pill="School roll"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={loadStudents}
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

        <div className="fade-up fade-up-delay-1">
          <Card
            title="All students"
            subtitle={loading ? "Loading…" : `${students.length} total`}
          >
            <Table columns={columns} rows={students} rowKey={(r) => r.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}
