import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Dashboard.css"; // Uses the same professional Dashboard.css

function StudentWelfare() {
  const navigate = useNavigate();
  const role = localStorage.getItem("grievance_role");
  const userId = localStorage.getItem("grievance_id");

  // This page's category is fixed
  const currentCategory = "welfare";
  const categoryTitle = "Student Welfare";

  const [formData, setFormData] = useState({
    name: "",
    regid: userId || "", // ✅ Pre-fill from localStorage
    email: "",
    school: "",
    message: "",
  });

  const [msg, setMsg] = useState("");
  const [statusType, setStatusType] = useState("");
  const [errors, setErrors] = useState({});

  // ✅ Route protection
  useEffect(() => {
    if (!role || role !== "student") navigate("/");
  }, [role, navigate]);

  // ✅ Validation function
  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Email address is invalid";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value); // Validate on change
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ✅ Form validation check
  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ["name", "email", "school", "message"];
    fieldsToValidate.forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Updated form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMsg("Please fill out all required fields.");
      setStatusType("error");
      return;
    }

    setMsg("Submitting your grievance...");
    setStatusType("info");

    try {
      const res = await fetch("http://localhost:5000/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...formData,
          category: currentCategory, // ✅ Hardcoded to "welfare"
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      setMsg("Grievance submitted successfully!");
      setStatusType("success");
      setFormData({
        ...formData, // Keep regid
        name: "",
        email: "",
        school: "",
        message: "",
      });
      setErrors({});
    } catch (err) {
      setMsg(`Error: ${err.message}`);
      setStatusType("error");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Welcome, {userId}</p>
      </header>

      {/* ✅ Smart Navbar */}
      <nav className="navbar">
        <ul>
          <li className={currentCategory === "welfare" ? "active" : ""}>
            <Link to="/student/welfare">Student Welfare</Link>
          </li>
          <li className={currentCategory === "admission" ? "active" : ""}>
            <Link to="/student/admission">Admission</Link>
          </li>
          <li className={currentCategory === "accounts" ? "active" : ""}>
            <Link to="/student/accounts">Accounts</Link>
          </li>
          <li className={currentCategory === "examination" ? "active" : ""}>
            <Link to="/student/examination">Examination</Link>
          </li>
        </ul>
      </nav>

      {/* ✅ MAIN GRIEVANCE FORM */}
      <main className="dashboard-body">
        <div className="card">
          <h2>Submit {categoryTitle} Grievance</h2>
          <p>
            Please describe your issue in detail. This will be sent to the{" "}
            <strong>{categoryTitle}</strong> department.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* ✅ Professional Alert Box */}
            {msg && <div className={`alert-box ${statusType}`}>{msg}</div>}

            <div className="form-row">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>

              <div className="input-group">
                <label>Registration ID</label>
                <input
                  type="text"
                  name="regid"
                  value={formData.regid}
                  readOnly
                  disabled
                  className="disabled-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@gmail.com"
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="input-group">
                <label>School</label>
                <select
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                >
                  <option value="">Select School</option>
                  <option value="School of Engineering">
                    School of Engineering
                  </option>
                  <option value="School of Business">School of Business</option>
                  <option value="School of Sciences">School of Sciences</option>
                  <option value="School of Arts">School of Arts</option>
                  <option value="School of Law">School of Law</option>
                </select>
                {errors.school && <p className="error-text">{errors.school}</p>}
              </div>
            </div>

            <div className="input-group">
              <label>Message / Query</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your issue in detail..."
                rows="5"
              ></textarea>
              {errors.message && (
                <p className="error-text">{errors.message}</p>
              )}
            </div>

            <button type="submit" className="submit-btn">
              Submit Grievance
            </button>
          </form>
        </div>
      </main>

      {/* ✅ Floating Logout Button */}
      <button className="logout-floating" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default StudentWelfare;