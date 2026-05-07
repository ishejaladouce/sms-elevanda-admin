import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Table from "../components/ui/Table.jsx";
import Badge from "../components/ui/Badge.jsx";
import { api } from "../services/api.js";

function teacherLabel(t) {
  if (!t) return "Unassigned";
  return t.user?.name || t.user?.email || t.id;
}

// Reusable themed select element so it matches our inputs.
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

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [newName, setNewName] = useState("");
  const [newTeacherId, setNewTeacherId] = useState("");

  const [editingId, setEditingId] = useState("");
  const [editName, setEditName] = useState("");
  const [editTeacherId, setEditTeacherId] = useState("");

  async function loadData() {
    setLoading(true);
    setPageError("");
    try {
      const [cRes, tRes] = await Promise.all([
        api.get("/api/admin/classes"),
        api.get("/api/admin/teachers"),
      ]);
      setClasses(cRes.data?.data?.items ?? []);
      setTeachers(tRes.data?.data?.items ?? []);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createClass() {
    if (!newName.trim()) {
      setPageError("Class name is required");
      return;
    }
    setPageError("");
    try {
      await api.post("/api/admin/classes", {
        name: newName.trim(),
        teacherId: newTeacherId || undefined,
      });
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to create class");
      return;
    }
    setNewName("");
    setNewTeacherId("");
    await loadData();
  }

  function startEdit(row) {
    setEditingId(row.id);
    setEditName(row.name);
    setEditTeacherId(row.teacherId || "");
  }

  function cancelEdit() {
    setEditingId("");
    setEditName("");
    setEditTeacherId("");
  }

  async function saveEdit() {
    if (!editName.trim()) {
      setPageError("Class name is required");
      return;
    }
    setPageError("");
    try {
      await api.patch(`/api/admin/classes/${editingId}`, {
        name: editName.trim(),
        teacherId: editTeacherId || null,
      });
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to update class");
      return;
    }
    cancelEdit();
    await loadData();
  }

  async function removeClass(id) {
    const ok = window.confirm("Delete this class?");
    if (!ok) return;
    setPageError("");
    try {
      await api.delete(`/api/admin/classes/${id}`);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to delete class");
      return;
    }
    await loadData();
  }

  const columns = useMemo(
    () => [
      { key: "name", header: "Class name" },
      {
        key: "teacher",
        header: "Teacher",
        render: (r) =>
          r.teacher ? (
            <span className="text-text">{teacherLabel(r.teacher)}</span>
          ) : (
            <Badge>Unassigned</Badge>
          ),
      },
      {
        key: "actions",
        header: "Actions",
        render: (r) =>
          editingId === r.id ? (
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEdit}>
                Save
              </Button>
              <Button size="sm" variant="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => startEdit(r)}>
                Edit
              </Button>
              <Button size="sm" variant="danger" onClick={() => removeClass(r.id)}>
                Delete
              </Button>
            </div>
          ),
      },
    ],
    [editingId, editName, editTeacherId]
  );

  const rows = useMemo(() => {
    if (!editingId) return classes;
    return classes.map((c) => {
      if (c.id !== editingId) return c;
      return {
        ...c,
        name: (
          <div className="min-w-[180px]">
            <Input
              label=""
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
        ),
        teacher: (
          <div className="min-w-[220px]">
            <Select
              value={editTeacherId}
              onChange={(e) => setEditTeacherId(e.target.value)}
            >
              <option value="">Unassigned</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name || t.email || t.id}
                </option>
              ))}
            </Select>
          </div>
        ),
      };
    });
  }, [classes, editingId, editName, editTeacherId, teachers]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Classes"
          subtitle="Create classes, assign teachers, and keep schedules tidy."
          pill="Class management"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={loadData}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="fade-up fade-up-delay-1">
            <Card title="Create class" subtitle="Add a new class to the school">
              <div className="space-y-4">
                <Input
                  label="Class name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Senior 3 - Sciences"
                />
                <Select
                  label="Teacher (optional)"
                  value={newTeacherId}
                  onChange={(e) => setNewTeacherId(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name || t.email || t.id}
                    </option>
                  ))}
                </Select>
                <Button onClick={createClass} disabled={loading} className="w-full">
                  Create class
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 fade-up fade-up-delay-2">
            <Card
              title="All classes"
              subtitle={loading ? "Loading…" : `${classes.length} total`}
            >
              <Table columns={columns} rows={rows} rowKey={(r) => r.id} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
