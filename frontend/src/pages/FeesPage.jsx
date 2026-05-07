import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card.jsx";
import Table from "../components/ui/Table.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import { api } from "../services/api.js";

function badgeForType(type) {
  if (type === "DEPOSIT") return <Badge variant="success">Deposit</Badge>;
  if (type === "WITHDRAWAL") return <Badge variant="warning">Withdrawal</Badge>;
  return <Badge variant="neutral">{type || "—"}</Badge>;
}

function formatMoney(amount) {
  const n = Number(amount || 0);
  return `RWF ${n.toLocaleString()}`;
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function FeesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  async function loadFees() {
    setLoading(true);
    setPageError("");
    try {
      const res = await api.get("/api/admin/fees");
      setItems(res.data?.data?.items ?? []);
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to load fee payments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFees();
  }, []);

  const columns = useMemo(
    () => [
      { key: "createdAt", header: "Date", render: (r) => <span className="text-sm">{formatDateTime(r.createdAt)}</span> },
      { key: "admissionNumber", header: "Adm No", render: (r) => <span className="font-mono">{r.admissionNumber}</span> },
      { key: "studentName", header: "Student" },
      { key: "className", header: "Class", render: (r) => r.className || <span className="text-muted">—</span> },
      { key: "type", header: "Type", render: (r) => badgeForType(r.type) },
      { key: "amount", header: "Amount", render: (r) => <span className="font-mono">{formatMoney(r.amount)}</span> },
      { key: "balance", header: "Balance", render: (r) => <span className="font-mono">{formatMoney(r.balance)}</span> },
      { key: "note", header: "Note", render: (r) => (r.note ? <span className="text-sm">{r.note}</span> : <span className="text-muted">—</span>) },
    ],
    []
  );

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl">Fees</h1>
        <p className="text-muted mt-1">All fee transactions across all students</p>

        {pageError ? <div className="mt-4 text-danger text-sm">{pageError}</div> : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-muted text-sm">{loading ? "Loading..." : `${items.length} payment(s)`}</div>
          <Button variant="secondary" size="sm" onClick={loadFees} disabled={loading}>
            Refresh
          </Button>
        </div>

        <div className="mt-3">
          <Card>
            <Table columns={columns} rows={items} rowKey={(r) => r.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}

