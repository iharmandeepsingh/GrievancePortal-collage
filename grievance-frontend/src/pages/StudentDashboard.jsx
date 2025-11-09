// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Dashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("grievance_role");
  const userId = localStorage.getItem("grievance_id");

  const [activeSection, setActiveSection] = useState("student-welfare");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("red");

  const [formData, setFormData] = useState({
    name: "",
    regid: "",
    email: "",
    school: "",
    message: "",
  });

  // ✅ Route protection
  useEffect(() => {
    if (!role || role !== "student") navigate("/");
  }, [role, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ✅ Dynamic form submit (based on section)
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
        regid: "",
        email: "",
        school: "",
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
        <h1>🎓 Student Dashboard</h1>
      </header>

      {/* ✅ NAVBAR (Links to other pages) */}
    <nav className="navbar">
  <ul>

    <li><Link to="/student/welfare">Student Welfare</Link></li>
    <li><Link to="/student/admission">Admission</Link></li>
    <li><Link to="/student/accounts">Accounts</Link></li>
    <li><Link to="/student/examination">Examination</Link></li>
  </ul>
</nav>


      {/* ✅ MAIN GRIEVANCE FORM (for general submission) */}
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
                  placeholder="John Doe"
                  required
                />
              </label>

              <label>
                Registration ID
                <input
                  type="text"
                  name="regid"
                  value={formData.regid}
                  onChange={handleChange}
                  placeholder="e.g., 22CSE1234"
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
                  placeholder="john@gmail.com"
                  required
                />
              </label>

              <label>
                School
                <select
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select School</option>
                  <option value="School of Engineering">School of Engineering</option>
                  <option value="School of Business">School of Business</option>
                  <option value="School of Sciences">School of Sciences</option>
                  <option value="School of Arts">School of Arts</option>
                  <option value="School of Law">School of Law</option>
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

export default StudentDashboard;
