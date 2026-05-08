import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { api } from "../services/api.js";

const schema = z.object({
  classId: z.string().min(1),
  studentId: z.string().min(1),
  subject: z.string().min(2).max(80),
  term: z.string().min(1).max(40),
  score: z.coerce.number().min(0).max(100),
});

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

export default function TeacherGradesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      classId: "",
      studentId: "",
      subject: "",
      term: "",
      score: "",
    },
  });

  async function load() {
    setLoading(true);
    setPageError("");
    try {
      const res = await api.get("/api/teacher/classes");
      setClasses(res.data?.data?.items ?? []);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const selectedClassId = form.watch("classId");

  const students = useMemo(() => {
    const c = classes.find((x) => x.id === selectedClassId);
    return c?.students ?? [];
  }, [classes, selectedClassId]);

  useEffect(() => {
    if (!students.some((s) => s.id === form.getValues("studentId"))) {
      form.setValue("studentId", "");
    }
  }, [students]);

  async function onSubmit(values) {
    try {
      form.clearErrors("root");
      await api.put("/api/teacher/grades", {
        studentId: values.studentId,
        subject: values.subject.trim(),
        term: values.term.trim(),
        score: values.score,
      });
      form.reset({ ...values, subject: "", term: "", score: "" });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to save grade";
      form.setError("root", { type: "server", message });
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Update grades"
          subtitle="Save a student's score for a subject and term."
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
          <Card title="Grade entry" subtitle="Only for students in your assigned class(es)">
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Class"
                value={form.watch("classId")}
                onChange={(e) => form.setValue("classId", e.target.value)}
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Student"
                value={form.watch("studentId")}
                onChange={(e) => form.setValue("studentId", e.target.value)}
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.admissionNumber || s.id}
                  </option>
                ))}
              </Select>

              <Input label="Subject" error={form.formState.errors.subject?.message} {...form.register("subject")} />
              <Input label="Term" error={form.formState.errors.term?.message} {...form.register("term")} />
              <Input
                label="Score (0-100)"
                inputMode="numeric"
                error={form.formState.errors.score?.message}
                {...form.register("score")}
              />

              <div className="md:col-span-2">
                {form.formState.errors.root?.message ? (
                  <div className="text-danger text-sm mb-3">{form.formState.errors.root.message}</div>
                ) : null}
                <Button type="submit" loading={form.formState.isSubmitting} className="w-full md:w-auto">
                  Save grade
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

