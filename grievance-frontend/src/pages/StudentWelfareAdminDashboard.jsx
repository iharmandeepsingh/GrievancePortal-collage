import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

function StudentWelfareAdminDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("grievance_role")?.toLowerCase();
  const userId = localStorage.getItem("grievance_id")?.toUpperCase();

  const [grievances, setGrievances] = useState([]);
  const [msg, setMsg] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" or "error"

  // Protect route
  useEffect(() => {
    if (!role || role !== "admin" || userId !== "ADM_WELFARE") {
      navigate("/");
    } else {
      fetchGrievances();
    }
  }, [role, userId, navigate]);

  // Fetch grievances
  const fetchGrievances = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/grievances/department/Student Welfare"
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setGrievances(data);
    } catch (error) {
      console.error("Error fetching grievances:", error);
      setMsg("Failed to load grievances");
      setStatusType("error");
    }
  };

  // Update grievance status
  const updateStatus = async (id, newStatus) => {
    setMsg("Updating status...");
    setStatusType("info");
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
      
      setMsg("Status updated successfully!");
      setStatusType("success");
      fetchGrievances(); // Refresh the list
    } catch (err) {
      console.error("Error updating grievance:", err);
      setMsg(`Error: ${err.message}`);
      setStatusType("error");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Student Welfare Department</h1>
        <p>Welcome, {userId}</p>
      </header>

      {/* Admin navbar is simple, just shows the title */}
      <nav className="navbar">
        <ul>
          <li className="admin-nav-title">
            <span>Student Welfare Grievances</span>
          </li>
        </ul>
      </nav>

      <main className="dashboard-body">
        <div className="card">
          <h2>Incoming Grievances</h2>
          
          {/* Professional Alert Box */}
          {msg && <div className={`alert-box ${statusType}`}>{msg}</div>}

          {grievances.length === 0 ? (
            <div className="empty-state">
              <p>No grievances found for Student Welfare Department.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="grievance-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>School</th>
                    <th>Message</th>
                    <th>Submitted At</th>
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
                      <td className="message-cell">{g.message}</td>
                      <td>{formatDate(g.createdAt)}</td>
                      <td>
                        <span className={`status-badge status-${g.status.toLowerCase()}`}>
                          {g.status}
                        </span>
                      </td>
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
            </div>
          )}
        </div>
      </main>

      <button className="logout-floating" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default StudentWelfareAdminDashboard;