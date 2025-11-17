// import React, { useState } from "react";

// function RegisterPage() {
//   const [formData, setFormData] = useState({
//     id: "",
//     role: "",
//     fullName: "",
//     email: "",
//     phone: "",
//     password: "",
//     program: "",
//   });

//   const [msg, setMsg] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMsg("Submitting...");

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message);
//       setMsg("✅ Registration successful! You can now login.");
//     } catch (err) {
//       setMsg(`❌ ${err.message}`);
//     }
//   };

//   return (
//     <main className="center">
//       <div className="card">
//         <h1>Register</h1>
//         <form onSubmit={handleSubmit}>
//           <input name="id" placeholder="User ID" onChange={handleChange} required />
//           <select name="role" onChange={handleChange} required>
//             <option value="">Select Role</option>
//             <option value="student">Student</option>
//             <option value="staff">Staff</option>
//             <option value="admin">Admin</option>
//           </select>
//           <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
//           <input name="email" placeholder="Email" onChange={handleChange} required />
//           <input name="phone" placeholder="Phone" onChange={handleChange} required />
//           <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
//           <input name="program" placeholder="Program" onChange={handleChange} />

//           <button className="btn" type="submit">Register</button>
//         </form>

//         <p style={{ textAlign: "center", color: "green" }}>{msg}</p>
//         <p style={{ textAlign: "center" }}>
//           Already registered? <a href="/">Login here</a>
//         </p>
//       </div>
//     </main>
//   );
// }

// export default RegisterPage;

import React, { useState } from "react";
import { Link } from "react-router-dom"; // Use Link for better navigation
import "../styles/LoginPage.css"; // Reuse the same CSS file

// ----- ICONS -----
// You can copy/paste these from your LoginPage.jsx or keep them here
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A2.5 2.5 0 0 1 4 19.5z"></path><path d="M4 7v5h16V7H4z"></path><path d="M18 17H6.5C4 17 4 14.5 4 14.5V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7.5c0 0 .1 2.5-2.5 2.5z"></path></svg>;
// -----------------

function RegisterPage() {
  const [formData, setFormData] = useState({
    id: "",
    role: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    program: "",
  });

  const [msg, setMsg] = useState("");
  const [statusType, setStatusType] = useState(""); // For alert colors

  const handleChange = (e) => {
    // Auto-uppercase the ID field
    const { name, value } = e.target;
    if (name === "id") {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Submitting...");
    setStatusType("info");

    // Clear program if not a student
    const submissionData = { ...formData };
    if (submissionData.role !== 'student') {
      submissionData.program = ''; // Or undefined, depending on backend
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setMsg("Registration successful! You can now login.");
      setStatusType("success");
      setFormData({
        id: "", role: "", fullName: "", email: "", phone: "", password: "", program: "",
      }); // Clear form
    } catch (err) {
      setMsg(err.message || "An error occurred during registration.");
      setStatusType("error");
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE: Branding */}
      <div className="login-brand-section">
        <div className="brand-content">
          <h1>Create an Account</h1>
          <p>
            Join the portal to submit grievances and track their
            resolution.
          </p>
          <div className="brand-footer">© 2025 University Administration</div>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="login-form-section">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Register</h2>
            <p>Fill in your details to get started.</p>
          </div>

          {/* Alert Message */}
          {msg && <div className={`alert-box ${statusType}`}>{msg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Role</label>
              <div className="input-wrapper">
                <span className="icon"><UsersIcon /></span>
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div className="input-group">
              <label>User ID</label>
              <div className="input-wrapper">
                <span className="icon"><UserIcon /></span>
                <input
                  name="id"
                  placeholder="e.g. STU001 or STF001"
                  value={formData.id}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <span className="icon"><UserIcon /></span>
                <input
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <span className="icon"><MailIcon /></span>
                <input
                  name="email"
                  type="email"
                  placeholder="name@university.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Phone</label>
              <div className="input-wrapper">
                <span className="icon"><PhoneIcon /></span>
                <input
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="icon"><LockIcon /></span>
                <input
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Conditional field for Students */}
            {formData.role === 'student' && (
              <div className="input-group">
                <label>Program</label>
                <div className="input-wrapper">
                  <span className="icon"><BookIcon /></span>
                  <input
                    name="program"
                    placeholder="e.g. B.Tech Computer Science"
                    value={formData.program}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <button className="btn-primary" type="submit">
              Register Account
            </button>
          </form>

          <div className="form-footer">
            <p>
              Already have an account? <Link to="/">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;