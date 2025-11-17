// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import "../styles/Dashboard.css";

// function StaffDashboard() {
//   const navigate = useNavigate();
//   const role = localStorage.getItem("grievance_role");
//   const userId = localStorage.getItem("grievance_id");

//   const [activeSection, setActiveSection] = useState("staff-welfare");
//   const [message, setMessage] = useState("");
//   const [color, setColor] = useState("red");

//   const [formData, setFormData] = useState({
//     name: "",
//     staffId: "",
//     email: "",
//     department: "",
//     message: "",
//   });

//   // ✅ Route protection
//   useEffect(() => {
//     if (!role || role !== "staff") navigate("/");
//   }, [role, navigate]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   // ✅ Dynamic form submit (same as student)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("Submitting your grievance...");

//     try {
//       const res = await fetch("http://localhost:5000/api/grievances", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           ...formData,
//           category: activeSection.replace("-", " "),
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Submission failed");

//       setMessage("✅ Grievance submitted successfully!");
//       setColor("green");
//       setFormData({
//         name: "",
//         staffId: "",
//         email: "",
//         department: "",
//         message: "",
//       });
//     } catch (err) {
//       setMessage(`❌ ${err.message}`);
//       setColor("red");
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <h1>🧑‍🏫 Staff Dashboard</h1>
//       </header>

//       {/* ✅ NAVBAR */}
//       <nav className="navbar">
//         <ul>
//           <li>
//             <Link to="/staff/general">General</Link>
//           </li>
//           <li>
//             <Link to="/staff/administration">Administration</Link>
//           </li>
//           <li>
//             <Link to="/staff/finance">Finance</Link>
//           </li>
//           <li>
//             <Link to="/staff/facilities">Facilities</Link>
//           </li>
//         </ul>
//       </nav>

//       {/* ✅ MAIN GRIEVANCE FORM */}
//       <section className="dashboard-body">
//         <div className="card">
//           <h2>Submit a General Grievance</h2>
//           <p>
//             You can submit a general grievance here, or choose a specific department
//             from the navigation bar above.
//           </p>

//           <form onSubmit={handleSubmit}>
//             <div className="form-row">
//               <label>
//                 Full Name
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="John Smith"
//                   required
//                 />
//               </label>

//               <label>
//                 Staff ID
//                 <input
//                   type="text"
//                   name="staffId"
//                   value={formData.staffId}
//                   onChange={handleChange}
//                   placeholder="e.g., STF01"
//                   required
//                 />
//               </label>
//             </div>

//             <div className="form-row">
//               <label>
//                 Email
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="john@college.edu"
//                   required
//                 />
//               </label>

//               <label>
//                 Department
//                 <select
//                   name="department"
//                   value={formData.department}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select Department</option>
//                   <option value="Administration">Administration</option>
//                   <option value="Finance">Finance</option>
//                   <option value="Examination">Examination</option>
//                   <option value="Facilities">Facilities</option>
//                   <option value="General">General</option>
//                 </select>
//               </label>
//             </div>

//             <label>
//               Message / Query
//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 placeholder="Describe your issue in detail..."
//                 rows="5"
//                 required
//               ></textarea>
//             </label>

//             <button type="submit" className="submit-btn">
//               Submit Grievance
//             </button>
//           </form>

//           <p style={{ color, marginTop: "10px" }}>{message}</p>
//         </div>
//       </section>

//       {/* ✅ Floating Logout Button */}
//       <button className="logout-floating" onClick={handleLogout}>
//         Logout
//       </button>
//     </div>
//   );
// }

// export default StaffDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../styles/Dashboard.css"; // Use the new Dashboard.css

function StaffDashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current URL
  const role = localStorage.getItem("grievance_role");
  const userId = localStorage.getItem("grievance_id");

  // Get category from URL path (e.g., "/staff/finance" -> "finance")
  const currentCategory = location.pathname.split("/").pop() || "general";

  const [formData, setFormData] = useState({
    name: "",
    staffId: userId || "", // Pre-fill from localStorage
    email: "",
    department: "",
    message: "",
  });

  const [msg, setMsg] = useState("");
  const [statusType, setStatusType] = useState("");
  const [errors, setErrors] = useState({});

  // Route protection
  useEffect(() => {
    if (!role || role !== "staff") navigate("/");
  }, [role, navigate]);

  // Validation function
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

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
          category: currentCategory, // ✅ Dynamic category
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      setMsg("Grievance submitted successfully!");
      setStatusType("success");
      setFormData({
        ...formData,
        name: "", // Clear fields but keep pre-filled ID
        email: "",
        department: "",
        message: "",
      });
      setErrors({});
    } catch (err) {
      setMsg(`Error: ${err.message}`);
      setStatusType("error");
    }
  };

  // Capitalize first letter for titles (e.g., "finance" -> "Finance")
  const categoryTitle = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Staff Dashboard</h1>
        <p>Welcome, {userId}</p>
      </header>

      {/* Modern Navbar */}
      <nav className="navbar">
        <ul>
          <li className={currentCategory === "general" ? "active" : ""}>
            <Link to="/staff/general">General</Link>
          </li>
          <li className={currentCategory === "administration" ? "active" : ""}>
            <Link to="/staff/administration">Administration</Link>
          </li>
          <li className={currentCategory === "finance" ? "active" : ""}>
            <Link to="/staff/finance">Finance</Link>
          </li>
          <li className={currentCategory === "facilities" ? "active" : ""}>
            <Link to="/staff/facilities">Facilities</Link>
          </li>
        </ul>
      </nav>

      <main className="dashboard-body">
        <div className="card">
          <h2>Submit {categoryTitle} Grievance</h2>
          <p>
            Please describe your issue in detail. This will be sent to the{" "}
            <strong>{categoryTitle}</strong> department.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Alert Box */}
            {msg && <div className={`alert-box ${statusType}`}>{msg}</div>}

            <div className="form-row">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>

              <div className="input-group">
                <label>Staff ID</label>
                <input
                  type="text"
                  name="staffId"
                  value={formData.staffId}
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
                  placeholder="john@college.edu"
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="input-group">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select Your Department</option>
                  <option value="Administration">Administration</option>
                  <option value="Finance">Finance</option>
                  <option value="Examination">Examination</option>
                  <option value="Facilities">Facilities</option>
                  <option value="General">General</option>
                </select>
                {errors.department && (
                  <p className="error-text">{errors.department}</p>
                )}
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

      <button className="logout-floating" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default StaffDashboard;