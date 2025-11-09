import React from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

function Admission() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🏫 Admission Department</h1>
      </header>

      <nav className="navbar">
        <ul>
          <li><Link to="/student/dashboard">Dashboard</Link></li>
          <li><Link to="/student/welfare">Student Welfare</Link></li>
          <li><Link to="/student/accounts">Accounts</Link></li>
          <li><Link to="/student/examination">Examination</Link></li>
        </ul>
      </nav>

      <section className="dashboard-body">
        <div className="card">
          <h2>Welcome to the Admission Section</h2>
          <p>Handle issues related to registration, enrollment, and admission procedures.</p>
        </div>
      </section>
    </div>
  );
}

export default Admission;
