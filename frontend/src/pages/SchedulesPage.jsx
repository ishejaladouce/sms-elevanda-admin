import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Table from "../components/ui/Table.jsx";
import { api } from "../services/api.js";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

export default function SchedulesPage() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [subject, setSubject] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");

  async function loadClasses() {
    const res = await api.get("/api/admin/classes");
    const list = res.data?.data?.items ?? [];
    setClasses(list);
    if (!classId && list[0]?.id) setClassId(list[0].id);
  }

  async function loadSchedules(targetClassId) {
    if (!targetClassId) return setItems([]);
    const res = await api.get(`/api/admin/classes/${targetClassId}/schedules`);
    setItems(res.data?.data?.items ?? []);
  }

  async function loadAll() {
    setLoading(true);
    setPageError("");
    try {
      await loadClasses();
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setPageError("");
        await loadSchedules(classId);
      } catch (err) {
        setPageError(err?.response?.data?.message || "Failed to load schedules");
      }
    })();
  }, [classId]);

  async function createSchedule() {
    if (!classId) return;
    try {
      setPageError("");
      await api.post(`/api/admin/classes/${classId}/schedules`, {
        subject: subject.trim(),
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
      });
      setSubject("");
      await loadSchedules(classId);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to create schedule");
    }
  }

  async function remove(id) {
    const ok = window.confirm("Delete this schedule?");
    if (!ok) return;
    try {
      setPageError("");
      await api.delete(`/api/admin/schedules/${id}`);
      await loadSchedules(classId);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to delete schedule");
    }
  }

  const columns = useMemo(
    () => [
      {
        key: "dayOfWeek",
        header: "Day",
        render: (r) => <span className="text-muted text-sm">{DAYS[r.dayOfWeek] || r.dayOfWeek}</span>,
      },
      { key: "subject", header: "Subject" },
      { key: "startTime", header: "Start" },
      { key: "endTime", header: "End" },
      {
        key: "actions",
        header: "Actions",
        render: (r) => (
          <Button size="sm" variant="danger" onClick={() => remove(r.id)}>
            Delete
          </Button>
        ),
      },
    ],
    [classId]
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Schedules"
          subtitle="Create weekly schedules for each class."
          pill="Admin"
          action={
            <Button variant="secondary" size="sm" onClick={loadAll} disabled={loading}>
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
            <Card title="Create schedule" subtitle="Add a lesson slot">
              <div className="space-y-4">
                <Select label="Class" value={classId} onChange={(e) => setClassId(e.target.value)}>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
                <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Math" />
                <Select label="Day of week" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
                  {DAYS.map((d, idx) => (
                    <option key={d} value={String(idx)}>
                      {d}
                    </option>
                  ))}
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Start (HH:MM)" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                  <Input label="End (HH:MM)" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
                <Button onClick={createSchedule} className="w-full">
                  Add schedule
                </Button>
              </div>
            </Card>
          </div>

          <div className="fade-up fade-up-delay-2 lg:col-span-2">
            <Card title="Current schedule" subtitle="For the selected class">
              <Table columns={columns} rows={items} rowKey={(r) => r.id} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

