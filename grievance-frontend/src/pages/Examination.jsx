import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../styles/Dashboard.css"; // Uses the same professional Dashboard.css

function Examination() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("grievance_role");
  const userId = localStorage.getItem("grievance_id");

  // This page's category is fixed
  const currentCategory = "examination";
  const categoryTitle = "Examination";

  const [formData, setFormData] = useState({
    name: "",
    regid: userId || "", // ✅ Pre-fill from localStorage
    phone: "",
    email: "",
    issueType: "",
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
    } else if (name === "phone" && !/^\d{10}$/.test(value)) {
      error = "Phone number must be 10 digits";
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
    const fieldsToValidate = ["name", "phone", "email", "issueType"];
    // Note: 'message' is optional in your original code, so we don't validate it
    
    fieldsToValidate.forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });

    // Re-check specific formats
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email address is invalid";
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone number must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Updated form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMsg("Please fill out all required fields correctly.");
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
          name: formData.name,
          regid: formData.regid,
          email: formData.email,
          school: "Examination Department", // Hardcoded as in your original file
          category: "Examination",
          // Combines issue type and message as in your original file
          message: `${formData.issueType} - ${formData.message}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      setMsg("Grievance submitted successfully!");
      setStatusType("success");
      setFormData({
        ...formData, // Keep regid
        name: "",
        phone: "",
        email: "",
        issueType: "",
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

      {/* ✅ Smart Student Navbar */}
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
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>
            </div>

            <div className="input-group">
              <label>Select Issue</label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
              >
                <option value="">-- Choose an Issue --</option>
                <option value="Result Issue">Result Issue</option>
                <option value="Revaluation Request">Revaluation Request</option>
                <option value="Exam Hall Ticket Problem">
                  Exam Hall Ticket Problem
                </option>
                <option value="Marks Not Updated">Marks Not Updated</option>
              </select>
              {errors.issueType && <p className="error-text">{errors.issueType}</p>}
            </div>

            <div className="input-group">
              <label>Message (Optional)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Provide any additional details here..."
                rows="4"
              ></textarea>
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

export default Examination;