import React, { useState } from "react";
import "../styles/Dashboard.css";

function Accounts() {
  const userId = localStorage.getItem("grievance_id");
  const [formData, setFormData] = useState({
    name: "",
    regid: "",
    phone: "",
    email: "",
    issueType: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [color, setColor] = useState("red");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting your grievance...");

    try {
      const res = await fetch("http://localhost:5000/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: formData.name,
          regid: formData.regid,
          email: formData.email,
          school: "Accounts Department",
          category: "Accounts",
          message: `${formData.issueType} - ${formData.message}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus("✅ Grievance submitted successfully!");
      setColor("green");
      setFormData({
        name: "",
        regid: "",
        phone: "",
        email: "",
        issueType: "",
        message: "",
      });
    } catch (err) {
      setStatus(`❌ ${err.message}`);
      setColor("red");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🏦 Accounts Department Grievance Form</h1>
      </header>

      <section className="dashboard-body">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <label>Full Name<input name="name" value={formData.name} onChange={handleChange} required /></label>
            <label>Registration ID<input name="regid" value={formData.regid} onChange={handleChange} required /></label>
            <label>Phone<input name="phone" value={formData.phone} onChange={handleChange} required /></label>
            <label>Email<input name="email" type="email" value={formData.email} onChange={handleChange} required /></label>
            <label>
              Select Issue
              <select name="issueType" value={formData.issueType} onChange={handleChange} required>
                <option value="">-- Choose an Issue --</option>
                <option value="Fee Payment Problem">Fee Payment Problem</option>
                <option value="Refund Delay">Refund Delay</option>
                <option value="Receipt Missing">Receipt Missing</option>
                <option value="Overcharge Issue">Overcharge Issue</option>
              </select>
            </label>
            <label>Message<textarea name="message" rows="4" value={formData.message} onChange={handleChange}></textarea></label>
            <button type="submit" className="submit-btn">Submit Grievance</button>
            <p style={{ color }}>{status}</p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Accounts;
