import { useAuthStore } from "../store/authStore.js";
import Card from "../components/ui/Card.jsx";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl">Settings</h1>
        <p className="text-muted mt-1">Admin profile</p>

        <div className="mt-6">
          <Card>
            <div className="space-y-3">
              <div>
                <div className="text-muted text-sm">Name</div>
                <div className="mt-1">{user?.name || "—"}</div>
              </div>
              <div>
                <div className="text-muted text-sm">Email</div>
                <div className="mt-1 font-mono">{user?.email || "—"}</div>
              </div>
              <div>
                <div className="text-muted text-sm">Role</div>
                <div className="mt-1 font-mono">{user?.role || "—"}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

