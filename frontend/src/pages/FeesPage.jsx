import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Table from "../components/ui/Table.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import { api } from "../services/api.js";
import { useCountUp } from "../hooks/useCountUp.js";

function badgeForType(type) {
  if (type === "DEPOSIT") return <Badge variant="success">Deposit</Badge>;
  if (type === "WITHDRAWAL") return <Badge variant="warning">Withdrawal</Badge>;
  return <Badge variant="neutral">{type || "—"}</Badge>;
}

function formatMoney(amount) {
  const n = Number(amount || 0);
  return `${n.toLocaleString()} RWF`;
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function handleTileMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
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

  const totals = useMemo(() => {
    let deposits = 0;
    let withdrawals = 0;
    for (const r of items) {
      const amt = Number(r.amount) || 0;
      if (r.type === "DEPOSIT") deposits += amt;
      else if (r.type === "WITHDRAWAL") withdrawals += amt;
    }
    return { deposits, withdrawals, net: deposits - withdrawals };
  }, [items]);

  const columns = useMemo(
    () => [
      {
        key: "createdAt",
        header: "Date",
        render: (r) => <span className="text-xs text-muted">{formatDateTime(r.createdAt)}</span>,
      },
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
      { key: "type", header: "Type", render: (r) => badgeForType(r.type) },
      {
        key: "amount",
        header: "Amount",
        render: (r) => <span className="font-mono tabular-nums">{formatMoney(r.amount)}</span>,
      },
      {
        key: "balance",
        header: "Balance",
        render: (r) => <span className="font-mono tabular-nums text-muted">{formatMoney(r.balance)}</span>,
      },
      {
        key: "note",
        header: "Note",
        render: (r) =>
          r.note ? (
            <span className="text-sm text-muted">{r.note}</span>
          ) : (
            <span className="text-muted">—</span>
          ),
      },
    ],
    []
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Fees"
          subtitle="Every payment, refund and balance across the school."
          pill="Money flow"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={loadFees}
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
          <MoneyTile label="Total deposits" amount={totals.deposits} tone="success" />
          <MoneyTile label="Total refunds" amount={totals.withdrawals} tone="warning" />
          <MoneyTile label="Net" amount={totals.net} tone="text" />
        </div>

        <div className="fade-up fade-up-delay-2">
          <Card
            title="All fee transactions"
            subtitle={loading ? "Loading…" : `${items.length} total`}
          >
            <Table columns={columns} rows={items} rowKey={(r) => r.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function MoneyTile({ label, amount, tone = "text" }) {
  const v = useCountUp(Number(amount) || 0, { duration: 1400, delay: 200 });
  const toneText =
    tone === "success" ? "text-success" : tone === "warning" ? "text-accent" : "text-text";
  return (
    <div onMouseMove={handleTileMouseMove} className="tile p-5">
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className={`mt-2 text-3xl font-semibold tabular-nums ${toneText}`}>
        {Math.round(v).toLocaleString()}
        <span className="text-base text-muted ml-1.5">RWF</span>
      </div>
    </div>
  );
}
