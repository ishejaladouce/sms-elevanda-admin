import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Table from "../components/ui/Table.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { api } from "../services/api.js";

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function scoreBadge(score) {
  const n = Number(score);
  if (Number.isNaN(n)) return <Badge variant="neutral">—</Badge>;
  if (n >= 80) return <Badge variant="success">{n}</Badge>;
  if (n >= 50) return <Badge variant="warning">{n}</Badge>;
  return <Badge variant="danger">{n}</Badge>;
}

export default function GradesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [term, setTerm] = useState("");
  const [subject, setSubject] = useState("");
  const [classId, setClassId] = useState("");

  async function loadGrades() {
    setLoading(true);
    setPageError("");
    try {
      const params = new URLSearchParams();
      if (term.trim()) params.set("term", term.trim());
      if (subject.trim()) params.set("subject", subject.trim());
      if (classId.trim()) params.set("classId", classId.trim());

      const qs = params.toString();
      const res = await api.get(`/api/admin/grades${qs ? `?${qs}` : ""}`);
      setItems(res.data?.data?.items ?? []);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to load grades");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGrades();
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "updatedAt",
        header: "Updated",
        render: (r) => <span className="text-xs text-muted">{formatDateTime(r.updatedAt)}</span>,
      },
      {
        key: "term",
        header: "Term",
        render: (r) => <span className="font-mono text-xs">{r.term}</span>,
      },
      { key: "subject", header: "Subject" },
      { key: "score", header: "Score", render: (r) => scoreBadge(r.score) },
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
      {
        key: "updatedBy",
        header: "Updated by",
        render: (r) => <span className="font-mono text-xs text-muted">{r.updatedBy}</span>,
      },
    ],
    []
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Grades"
          subtitle="Filter by term, subject, or class to spot patterns fast."
          pill="Academic results"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={loadGrades}
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

        <div className="fade-up fade-up-delay-1 mb-4">
          <Card title="Filters" subtitle="Narrow the list to what matters">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                label="Term (optional)"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. Term 1"
              />
              <Input
                label="Subject (optional)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Math"
              />
              <Input
                label="Class ID (optional)"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                placeholder="Paste classId"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-muted text-xs">
                {loading ? "Loading…" : `${items.length} grade(s) found`}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setTerm("");
                    setSubject("");
                    setClassId("");
                  }}
                >
                  Clear
                </Button>
                <Button size="sm" onClick={loadGrades} disabled={loading}>
                  Apply
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="fade-up fade-up-delay-2">
          <Card title="All grades" subtitle="Newest first">
            <Table columns={columns} rows={items} rowKey={(r) => r.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}
