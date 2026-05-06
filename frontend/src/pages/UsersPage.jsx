import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Table from "../components/ui/Table.jsx";
import { api } from "../services/api.js";

function badgeForVerified(isVerified) {
  return isVerified ? <Badge variant="success">Verified</Badge> : <Badge variant="warning">Pending</Badge>;
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

  const columns = useMemo(
    () => [
      { key: "name", header: "Name" },
      { key: "email", header: "Email", render: (r) => <span className="font-mono">{r.email}</span> },
      { key: "role", header: "Role", render: (r) => <span className="font-mono">{r.role}</span> },
      { key: "deviceId", header: "Device ID", render: (r) => <span className="font-mono">{r.deviceId}</span> },
      { key: "isDeviceVerified", header: "Status", render: (r) => badgeForVerified(r.isDeviceVerified) },
      {
        key: "actions",
        header: "Actions",
        render: (r) =>
          r.isDeviceVerified ? (
            <span className="text-muted text-sm">—</span>
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
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl">Users</h1>
        <p className="text-muted mt-1">Verify device IDs to allow login</p>

        {pageError ? <div className="mt-4 text-danger text-sm">{pageError}</div> : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-muted text-sm">{loading ? "Loading..." : `${users.length} user(s)`}</div>
          <Button variant="secondary" size="sm" onClick={loadUsers} disabled={loading}>
            Refresh
          </Button>
        </div>

        <div className="mt-3">
          <Card>
            <Table columns={columns} rows={users} rowKey={(r) => r.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}

