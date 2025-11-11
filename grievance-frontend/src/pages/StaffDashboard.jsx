import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Dashboard.css";

function StaffDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("grievance_role");
  const userId = localStorage.getItem("grievance_id");

  const [activeSection, setActiveSection] = useState("staff-welfare");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("red");

  const [formData, setFormData] = useState({
    name: "",
    staffId: "",
    email: "",
    department: "",
    message: "",
  });

  // ✅ Route protection
  useEffect(() => {
    if (!role || role !== "staff") navigate("/");
  }, [role, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ✅ Dynamic form submit (same as student)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting your grievance...");

    try {
      const res = await fetch("http://localhost:5000/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...formData,
          category: activeSection.replace("-", " "),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      setMessage("✅ Grievance submitted successfully!");
      setColor("green");
      setFormData({
        name: "",
        staffId: "",
        email: "",
        department: "",
        message: "",
      });
    } catch (err) {
      setMessage(`❌ ${err.message}`);
      setColor("red");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🧑‍🏫 Staff Dashboard</h1>
      </header>

      {/* ✅ NAVBAR */}
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/staff/general">General</Link>
          </li>
          <li>
            <Link to="/staff/administration">Administration</Link>
          </li>
          <li>
            <Link to="/staff/finance">Finance</Link>
          </li>
          <li>
            <Link to="/staff/facilities">Facilities</Link>
          </li>
        </ul>
      </nav>

      {/* ✅ MAIN GRIEVANCE FORM */}
      <section className="dashboard-body">
        <div className="card">
          <h2>Submit a General Grievance</h2>
          <p>
            You can submit a general grievance here, or choose a specific department
            from the navigation bar above.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Full Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  required
                />
              </label>

              <label>
                Staff ID
                <input
                  type="text"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleChange}
                  placeholder="e.g., STF01"
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@college.edu"
                  required
                />
              </label>

              <label>
                Department
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Administration">Administration</option>
                  <option value="Finance">Finance</option>
                  <option value="Examination">Examination</option>
                  <option value="Facilities">Facilities</option>
                  <option value="General">General</option>
                </select>
              </label>
            </div>

            <label>
              Message / Query
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your issue in detail..."
                rows="5"
                required
              ></textarea>
            </label>

            <button type="submit" className="submit-btn">
              Submit Grievance
            </button>
          </form>

          <p style={{ color, marginTop: "10px" }}>{message}</p>
        </div>
      </section>

      {/* ✅ Floating Logout Button */}
      <button className="logout-floating" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default StaffDashboard;
