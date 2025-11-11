import React, { useState } from "react";
import "../styles/Dashboard.css";

function Examination() {
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
    setStatus("Submitting...");

    try {
      const res = await fetch("http://localhost:5000/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: formData.name,
          regid: formData.regid,
          email: formData.email,
          school: "Examination Department",
          category: "Examination",
          message: `${formData.issueType} - ${formData.message}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStatus("✅ Submitted successfully!");
      setColor("green");
      setFormData({ name: "", regid: "", phone: "", email: "", issueType: "", message: "" });
    } catch (err) {
      setStatus(`❌ ${err.message}`);
      setColor("red");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🧪 Examination Department Grievance Form</h1>
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
                <option value="Result Issue">Result Issue</option>
                <option value="Revaluation Request">Revaluation Request</option>
                <option value="Exam Hall Ticket Problem">Exam Hall Ticket Problem</option>
                <option value="Marks Not Updated">Marks Not Updated</option>
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

export default Examination;
