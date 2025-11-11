// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ✅ Core pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// ✅ Department Admin Dashboards
import AccountAdminDashboard from "./pages/AccountAdminDashboard";
import StudentWelfareAdminDashboard from "./pages/StudentWelfareAdminDashboard";
import AdmissionAdminDashboard from "./pages/AdmissionAdminDashboard";
import ExaminationAdminDashboard from "./pages/ExaminationAdminDashboard";

// ✅ Student department pages
import StudentWelfare from "./pages/StudentWelfare";
import Admission from "./pages/Admission";
import Accounts from "./pages/Accounts";
import Examination from "./pages/Examination";

// ✅ Universal Protected Route
function ProtectedRoute({ children, allowedRoles }) {
  const storedRole = localStorage.getItem("grievance_role");
  const storedId = localStorage.getItem("grievance_id");

  // Normalize values
  const role = storedRole ? storedRole.toLowerCase() : null;
  const id = storedId ? storedId.toUpperCase() : null;

  // Not logged in → redirect to login
  if (!role || !id) {
    return <Navigate to="/" replace />;
  }

  // Map admin IDs to routes
  const adminRoutes = {
    ADM01: "/admin/dashboard",
    ADM_ACCOUNT: "/admin/account",
    ADM_WELFARE: "/admin/studentwelfare",
    ADM_ADMISSION: "/admin/admission",
    ADM_EXAM: "/admin/examination",
  };

  // If user tries to access an unauthorized page
  if (!allowedRoles.includes(role)) {
    if (role === "student") return <Navigate to="/student/dashboard" replace />;
    if (role === "staff") return <Navigate to="/staff/dashboard" replace />;
    if (role === "admin") return <Navigate to={adminRoutes[id] || "/admin/dashboard"} replace />;
    return <Navigate to="/" replace />;
  }

  // ✅ Admin fallback routing (auto-corrects if URL mismatched)
  if (role === "admin" && !Object.keys(adminRoutes).some((key) => window.location.pathname.includes(key.toLowerCase()))) {
    const correctRoute = adminRoutes[id] || "/admin/dashboard";
    if (window.location.pathname !== correctRoute) {
      return <Navigate to={correctRoute} replace />;
    }
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔑 Authentication */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🎓 Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/welfare"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentWelfare />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/admission"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Admission />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/accounts"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/examination"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Examination />
            </ProtectedRoute>
          }
        />

        {/* 👨‍🏫 Staff Routes */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🧑‍💼 Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/account"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AccountAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/studentwelfare"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <StudentWelfareAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/admission"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdmissionAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/examination"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ExaminationAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🚧 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
