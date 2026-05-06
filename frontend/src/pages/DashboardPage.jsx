import Card from "../components/ui/Card.jsx";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p className="text-muted mt-1">Admin overview</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Total students">—</Card>
          <Card title="Total teachers">—</Card>
          <Card title="Fee collection">—</Card>
          <Card title="Attendance rate">—</Card>
        </div>
      </div>
    </div>
  );
}

