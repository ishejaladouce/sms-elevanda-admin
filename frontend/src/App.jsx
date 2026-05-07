import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import ClassesPage from "./pages/ClassesPage.jsx";
import StudentsPage from "./pages/StudentsPage.jsx";
import TeachersPage from "./pages/TeachersPage.jsx";
import FeesPage from "./pages/FeesPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/fees" element={<FeesPage />} />
        <Route path="*" element={<div className="p-6">Not found</div>} />
      </Routes>
    </div>
  );
}

