import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Table from "../components/ui/Table.jsx";
import { api } from "../services/api.js";

function badgeForVerified(isVerified) {
  return isVerified ? (
    <Badge variant="success">Verified</Badge>
  ) : (
    <Badge variant="warning">Pending</Badge>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  async function loadUsers() {
    setLoading(true);
    setPageError("");
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data?.data?.items ?? []);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function verifyDevice(userId) {
    try {
      await api.patch(`/api/admin/users/${userId}/verify-device`);
      await loadUsers();
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to verify device");
    }
  }

  const pendingCount = users.filter((u) => !u.isDeviceVerified).length;
  const verifiedCount = users.length - pendingCount;

  const columns = useMemo(
    () => [
      { key: "name", header: "Name", render: (r) => <span className="text-text">{r.name || "—"}</span> },
      {
        key: "email",
        header: "Email",
        render: (r) => <span className="font-mono text-xs">{r.email}</span>,
      },
      {
        key: "role",
        header: "Role",
        render: (r) => <Badge variant="neutral">{r.role}</Badge>,
      },
      {
        key: "deviceId",
        header: "Device ID",
        render: (r) => (
          <span className="font-mono text-xs text-muted">
            {r.deviceId ? r.deviceId.slice(0, 14) + (r.deviceId.length > 14 ? "…" : "") : "—"}
          </span>
        ),
      },
      {
        key: "isDeviceVerified",
        header: "Status",
        render: (r) => badgeForVerified(r.isDeviceVerified),
      },
      {
        key: "actions",
        header: "Actions",
        render: (r) =>
          r.isDeviceVerified ? (
            <span className="text-muted text-xs">No action needed</span>
          ) : (
            <Button size="sm" onClick={() => verifyDevice(r.id)}>
              Verify
            </Button>
          ),
      },
    ],
    []
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Users & devices"
          subtitle="Verify each device once. Sessions stay safe even if a phone changes hands."
          pill="Access control"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={loadUsers}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 fade-up fade-up-delay-1">
          <StatTile label="Total users" value={users.length} loading={loading} />
          <StatTile
            label="Verified"
            value={verifiedCount}
            tone="success"
            loading={loading}
          />
          <StatTile
            label="Pending"
            value={pendingCount}
            tone="warning"
            loading={loading}
          />
        </div>

        <div className="fade-up fade-up-delay-2">
          <Card title="All users" subtitle={loading ? "Loading…" : `${users.length} total`}>
            <Table columns={columns} rows={users} rowKey={(r) => r.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, tone = "neutral", loading }) {
  function handle(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }
  const toneText =
    tone === "success" ? "text-success" : tone === "warning" ? "text-accent" : "text-text";
  return (
    <div onMouseMove={handle} className="tile p-5">
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className={`mt-2 text-3xl font-semibold tabular-nums ${toneText}`}>
        {loading ? "—" : value.toLocaleString()}
      </div>
    </div>
  );
}
