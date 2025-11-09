import React from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

function Examination() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🧾 Examination Department</h1>
      </header>

      <nav className="navbar">
        <ul>
          <li><Link to="/student/dashboard">Dashboard</Link></li>
          <li><Link to="/student/welfare">Student Welfare</Link></li>
          <li><Link to="/student/admission">Admission</Link></li>
          <li><Link to="/student/accounts">Accounts</Link></li>
        </ul>
      </nav>

      <section className="dashboard-body">
        <div className="card">
          <h2>Welcome to the Examination Section</h2>
          <p>Raise issues about marks, schedules, or revaluation requests here.</p>
        </div>
      </section>
    </div>
  );
}

export default Examination;
