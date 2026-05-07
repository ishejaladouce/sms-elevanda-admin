import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/layout/PageHeader.jsx";
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
      {
        key: "name",
        header: "Name",
        render: (r) => <span className="text-text">{r.name || "—"}</span>,
      },
      {
        key: "email",
        header: "Email",
        render: (r) =>
          r.email ? (
            <span className="font-mono text-xs">{r.email}</span>
          ) : (
            <span className="text-muted">—</span>
          ),
      },
      {
        key: "classes",
        header: "Assigned classes",
        render: (r) =>
          r.classes?.length ? (
            <div className="flex gap-1.5 flex-wrap">
              {r.classes.map((c) => (
                <Badge key={c.id}>{c.name}</Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted text-xs">No classes yet</span>
          ),
      },
    ],
    []
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Teachers"
          subtitle="The people guiding every classroom."
          pill="Staff directory"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={loadTeachers}
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
            title="All teachers"
            subtitle={loading ? "Loading…" : `${teachers.length} total`}
          >
            <Table columns={columns} rows={teachers} rowKey={(r) => r.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}
