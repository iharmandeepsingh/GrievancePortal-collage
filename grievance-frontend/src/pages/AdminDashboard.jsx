import React, { useState, useEffect } from "react";

function AdminDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all grievances (main admin only)
  useEffect(() => {
    fetch("http://localhost:5000/api/grievances/all")
      .then((res) => res.json())
      .then((data) => setGrievances(data))
      .catch((err) => console.error("Error fetching grievances:", err));
  }, []);

  // Assign grievance to department
  const handleAssign = async (id, dept) => {
    try {
      const deptMap = {
        Accounts: "ADM_ACCOUNT",
        Admission: "ADM_ADMISSION",
        "Student Welfare": "ADM_WELFARE",
        Examination: "ADM_EXAM",
      };

      const res = await fetch(`http://localhost:5000/api/grievances/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Assigned",
          assignedTo: deptMap[dept],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to assign");

      setMessage(`✅ Assigned grievance to ${dept}`);
      setGrievances((prev) =>
        prev.map((g) => (g._id === id ? data.grievance : g))
      );
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>🧑‍💼 Main Admin Dashboard</h1>
      <p>{message}</p>

      <table className="grievance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Message</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Assign</th>
          </tr>
        </thead>
        <tbody>
          {grievances.map((g) => (
            <tr key={g._id}>
              <td>{g.name}</td>
              <td>{g.category}</td>
              <td>{g.message}</td>
              <td>{g.status}</td>
              <td>{g.assignedTo || "Not Assigned"}</td>
              <td>
                <select
                  defaultValue=""
                  onChange={(e) => handleAssign(g._id, e.target.value)}
                >
                  <option value="">Assign to...</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Admission">Admission</option>
                  <option value="Student Welfare">Student Welfare</option>
                  <option value="Examination">Examination</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
