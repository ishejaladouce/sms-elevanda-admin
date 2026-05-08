import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/layout/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import ClassesPage from "./pages/ClassesPage.jsx";
import StudentsPage from "./pages/StudentsPage.jsx";
import TeachersPage from "./pages/TeachersPage.jsx";
import FeesPage from "./pages/FeesPage.jsx";
import GradesPage from "./pages/GradesPage.jsx";
import AttendancePage from "./pages/AttendancePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import { useAuthStore } from "./store/authStore.js";
import { api } from "./services/api.js";
import TeacherDashboardPage from "./pages/TeacherDashboardPage.jsx";
import TeacherGradesPage from "./pages/TeacherGradesPage.jsx";
import TeacherAttendancePage from "./pages/TeacherAttendancePage.jsx";
import SchedulesPage from "./pages/SchedulesPage.jsx";

function RequireAuth({ children }) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  if (!hydrated) return <div className="p-6 text-muted">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireRole({ roles, children }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const setUser = useAuthStore((s) => s.setUser);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.get("/api/auth/me");
        if (!alive) return;
        setUser(res.data?.data?.user ?? null);
      } catch {
        if (!alive) return;
        setUser(null);
      } finally {
        if (!alive) return;
        setHydrated(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [setUser, setHydrated]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />

        <Route
          path="/users"
          element={
            <RequireAuth>
              <RequireRole roles={["ADMIN"]}>
                <UsersPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/classes"
          element={
            <RequireAuth>
              <RequireRole roles={["ADMIN"]}>
                <ClassesPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/schedules"
          element={
            <RequireAuth>
              <RequireRole roles={["ADMIN"]}>
                <SchedulesPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/students"
          element={
            <RequireAuth>
              <RequireRole roles={["ADMIN"]}>
                <StudentsPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/teachers"
          element={
            <RequireAuth>
              <RequireRole roles={["ADMIN"]}>
                <TeachersPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/fees"
          element={
            <RequireAuth>
              <RequireRole roles={["ADMIN"]}>
                <FeesPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/grades"
          element={
            <RequireAuth>
              <RequireRole roles={["ADMIN"]}>
                <GradesPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/attendance"
          element={
            <RequireAuth>
              <RequireRole roles={["ADMIN"]}>
                <AttendancePage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          }
        />

        <Route
          path="/teacher"
          element={
            <RequireAuth>
              <RequireRole roles={["TEACHER"]}>
                <TeacherDashboardPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/teacher/grades"
          element={
            <RequireAuth>
              <RequireRole roles={["TEACHER"]}>
                <TeacherGradesPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <RequireAuth>
              <RequireRole roles={["TEACHER"]}>
                <TeacherAttendancePage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route path="*" element={<div className="p-6">Not found</div>} />
      </Routes>
    </div>
  );
}

