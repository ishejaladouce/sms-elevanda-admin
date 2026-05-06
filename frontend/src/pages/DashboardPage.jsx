import { useEffect, useState } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { api } from "../services/api.js";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  async function loadStats() {
    setLoading(true);
    setPageError("");
    try {
      const res = await api.get("/api/admin/dashboard/stats");
      setStats(res.data?.data?.stats ?? null);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p className="text-muted mt-1">Admin overview</p>

        {pageError ? <div className="mt-4 text-danger text-sm">{pageError}</div> : null}

        <div className="mt-4 flex justify-end">
          <Button variant="secondary" size="sm" onClick={loadStats} disabled={loading}>
            Refresh
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Total students">{loading ? "—" : stats?.students ?? 0}</Card>
          <Card title="Total teachers">{loading ? "—" : stats?.teachers ?? 0}</Card>
          <Card title="Fee collection">{loading ? "—" : `${stats?.feeCollection ?? 0} RWF`}</Card>
          <Card title="Attendance rate">{loading ? "—" : `${stats?.attendanceRate ?? 0}%`}</Card>
        </div>
      </div>
    </div>
  );
}

