// src/pages/AccountAdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function AccountAdminDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("grievance_role")?.toLowerCase();
  const userId = localStorage.getItem("grievance_id")?.toUpperCase();

  const [grievances, setGrievances] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Protect route - only accessible to ADM_ACCOUNT
  useEffect(() => {
    if (!role || role !== "admin" || userId !== "ADM_ACCOUNT") {
      navigate("/");
    } else {
      fetchAccountGrievances();
    }
  }, [role, userId, navigate]);

  // ✅ Fetch grievances related to Accounts department
  const fetchAccountGrievances = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/grievances/department/Accounts");
      const data = await res.json();
      setGrievances(data);
    } catch (error) {
      console.error("❌ Error fetching account grievances:", error);
      setMessage("Failed to load grievances");
    }
  };

  // ✅ Update grievance status
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/grievances/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          resolvedBy: userId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("✅ Grievance status updated successfully!");
      fetchAccountGrievances(); // refresh
    } catch (err) {
      console.error("❌ Error updating grievance:", err);
      setMessage("❌ Failed to update grievance status");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🏦 Accounts Department Admin</h1>
        <p>Welcome, {userId}</p>
      </header>

      {/* Navbar */}
      <nav className="navbar">
        <ul>
          <li><span>Accounts Grievances</span></li>
          <li><span>Reports</span></li>
        </ul>
      </nav>

      {/* Dashboard Body */}
      <section className="dashboard-body">
        <div className="card">
          <h2>📋 Grievances Related to Accounts</h2>
          {message && <p style={{ color: "green" }}>{message}</p>}

          {grievances.length === 0 ? (
            <p>No grievances found for Accounts Department.</p>
          ) : (
            <table className="grievance-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>School</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {grievances.map((g) => (
                  <tr key={g._id}>
                    <td>{g.name}</td>
                    <td>{g.email}</td>
                    <td>{g.school}</td>
                    <td>{g.message}</td>
                    <td>{g.status}</td>
                    <td>
                      {g.status !== "Resolved" ? (
                        <button
                          className="resolve-btn"
                          onClick={() => updateStatus(g._id, "Resolved")}
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <button className="resolved-btn" disabled>
                          Resolved
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Floating Logout Button */}
      <button className="logout-floating" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default AccountAdminDashboard;
