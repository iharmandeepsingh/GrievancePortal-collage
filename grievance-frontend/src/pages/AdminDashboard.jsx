import React from "react";

function AdminDashboard() {
  return (
    <div className="dashboard">
      <h1>🧑‍💼 Admin Dashboard</h1>
      <p>Welcome, {localStorage.getItem("grievance_id")}</p>
      <button onClick={() => { localStorage.clear(); window.location.href = "/"; }}>
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;
