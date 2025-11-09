// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ✅ Core pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// ✅ Student department pages
import StudentWelfare from "./pages/StudentWelfare";
import Admission from "./pages/Admission";
import Accounts from "./pages/Accounts";
import Examination from "./pages/Examination";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🟢 Auth Pages */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🟢 Student Dashboard (Support old + new path) */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student-dashboard" element={<Navigate to="/student/dashboard" replace />} />

        {/* 🟢 Student Department Pages */}
        <Route path="/student/welfare" element={<StudentWelfare />} />
        <Route path="/student/admission" element={<Admission />} />
        <Route path="/student/accounts" element={<Accounts />} />
        <Route path="/student/examination" element={<Examination />} />

        {/* 🟢 Staff & Admin Dashboards */}
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* 🟡 Catch all invalid routes (optional) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
