import React from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

function StudentWelfare() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🎯 Student Welfare Department</h1>
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
          <h2>Welcome to Student Welfare</h2>
          <p>Here you can raise grievances related to welfare, facilities, or student life.</p>
        </div>
      </section>
    </div>
  );
}

export default StudentWelfare;
