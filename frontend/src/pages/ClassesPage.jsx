import { useEffect, useMemo, useState } from "react";
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
      await api.post("/api/admin/classes", { name: newName.trim(), teacherId: newTeacherId || undefined });
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
          r.teacher ? <span className="text-muted">{teacherLabel(r.teacher)}</span> : <Badge>Unassigned</Badge>,
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
            <Input label="" value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>
        ),
        teacher: (
          <select
            className="w-full min-w-[220px] rounded-control border border-border bg-surface2 px-3 py-2 outline-none focus:ring-2 focus:ring-accent/40 transition duration-200 ease-smooth"
            value={editTeacherId}
            onChange={(e) => setEditTeacherId(e.target.value)}
          >
            <option value="">Unassigned</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name || t.email || t.id}
              </option>
            ))}
          </select>
        ),
      };
    });
  }, [classes, editingId, editName, editTeacherId, teachers]);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl">Classes</h1>
        <p className="text-muted mt-1">Create classes and assign teachers</p>

        {pageError ? <div className="mt-4 text-danger text-sm">{pageError}</div> : null}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Create class" className="lg:col-span-1">
            <div className="space-y-3">
              <Input label="Class name" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <div>
                <label className="text-sm text-muted">Teacher (optional)</label>
                <select
                  className="mt-1 w-full rounded-control border border-border bg-surface2 px-3 py-2 outline-none focus:ring-2 focus:ring-accent/40 transition duration-200 ease-smooth"
                  value={newTeacherId}
                  onChange={(e) => setNewTeacherId(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name || t.email || t.id}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={createClass} disabled={loading}>
                Create
              </Button>
            </div>
          </Card>

          <Card title="All classes" className="lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-muted text-sm">{loading ? "Loading..." : `${classes.length} class(es)`}</div>
              <Button variant="secondary" size="sm" onClick={loadData} disabled={loading}>
                Refresh
              </Button>
            </div>
            <div className="mt-3">
              <Table columns={columns} rows={rows} rowKey={(r) => r.id} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

