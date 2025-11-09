import React, { useState } from "react";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Submitting...");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setMsg("✅ Registration successful! You can now login.");
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  };

  return (
    <main className="center">
      <div className="card">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input name="id" placeholder="User ID" onChange={handleChange} required />
          <select name="role" onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input name="phone" placeholder="Phone" onChange={handleChange} required />
          <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
          <input name="program" placeholder="Program" onChange={handleChange} />

          <button className="btn" type="submit">Register</button>
        </form>

        <p style={{ textAlign: "center", color: "green" }}>{msg}</p>
        <p style={{ textAlign: "center" }}>
          Already registered? <a href="/">Login here</a>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;
