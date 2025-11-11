import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("red");

  const navigate = useNavigate();

  // ✅ Detect user role from ID prefix
  const detectRoleFromId = (id) => {
    const upperId = id.toUpperCase();
    if (upperId.startsWith("STU")) return "student";
    if (upperId.startsWith("STF")) return "staff";
    if (upperId.startsWith("ADM")) return "admin";
    return null;
  };

  // ✅ Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setMessage("📨 Sending OTP...");

    const detectedRole = detectRoleFromId(userId);
    if (!detectedRole) {
      setMessage("❌ Invalid ID format — must start with STU / STF / ADM");
      setColor("red");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: detectedRole,
          id: userId.toUpperCase(),
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setOtpSent(true);
      setMessage("✅ OTP sent successfully! Enter OTP to verify.");
      setColor("green");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
      setColor("red");
    }
  };

  // ✅ Step 2: Verify OTP + Password
  const handleVerifyOTPAndPassword = async (e) => {
    e.preventDefault();
    setMessage("🔍 Verifying credentials...");

    const detectedRole = detectRoleFromId(userId);
    if (!detectedRole) {
      setMessage("❌ Invalid ID format — must start with STU / STF / ADM");
      setColor("red");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId.toUpperCase(),
          otp,
          password,
          role: detectedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP or Password");

      // ✅ Normalize before saving
      const normalizedId = data.id.toUpperCase();
      const normalizedRole = data.role.toLowerCase();

      localStorage.setItem("grievance_id", normalizedId);
      localStorage.setItem("grievance_role", normalizedRole);
      localStorage.setItem("grievance_token", data.token);

      setMessage("✅ Login successful!");
      setColor("green");

      // ✅ Redirect based on ID and role
      setTimeout(() => {
        if (normalizedRole === "student") {
          navigate("/student/dashboard");
        } else if (normalizedRole === "staff") {
          navigate("/staff/dashboard");
        } else if (normalizedRole === "admin") {
          const adminRoutes = {
            ADM01: "/admin/dashboard",
            ADM_ACCOUNT: "/admin/account",
            ADM_WELFARE: "/admin/studentwelfare",
            ADM_ADMISSION: "/admin/admission",
            ADM_EXAM: "/admin/examination",
          };
          navigate(adminRoutes[normalizedId] || "/admin/dashboard");
        }
      }, 1000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
      setColor("red");
    }
  };

  return (
    <main className="center">
      <div className="card">
        <h1>Secure Login Portal</h1>
        <p className="subtitle">
          Login using ID (STU/STF/ADM), Password, and OTP Verification
        </p>

        {/* Step 1: Request OTP */}
        {!otpSent ? (
          <form className="form" onSubmit={handleSendOTP}>
            <label className="field">
              <span>ID</span>
              <input
                type="text"
                placeholder="e.g. STU001 or ADM_ACCOUNT"
                value={userId}
                onChange={(e) => setUserId(e.target.value.toUpperCase())}
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span>Phone</span>
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="[0-9]{10}"
                required
              />
            </label>

            <button className="btn" type="submit">Send OTP</button>
          </form>
        ) : (
          // Step 2: Verify OTP + Password
          <form className="form" onSubmit={handleVerifyOTPAndPassword}>
            <label className="field">
              <span>Enter OTP</span>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </label>

            <button className="btn" type="submit">Verify & Login</button>
          </form>
        )}

        <p className="msg" style={{ color }}>{message}</p>

        <p className="note">
          Don’t have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
