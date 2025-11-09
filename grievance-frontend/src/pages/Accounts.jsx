import React from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

function Accounts() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>💰 Accounts Department</h1>
      </header>

      <nav className="navbar">
        <ul>
          <li><Link to="/student/dashboard">Dashboard</Link></li>
          <li><Link to="/student/welfare">Student Welfare</Link></li>
          <li><Link to="/student/admission">Admission</Link></li>
          <li><Link to="/student/examination">Examination</Link></li>
        </ul>
      </nav>

      <section className="dashboard-body">
        <div className="card">
          <h2>Welcome to the Accounts Section</h2>
          <p>Submit grievances related to fee payment, refunds, or financial issues.</p>
        </div>
      </section>
    </div>
  );
}

export default Accounts;
