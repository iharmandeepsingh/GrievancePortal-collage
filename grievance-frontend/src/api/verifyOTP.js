export async function verifyOTP(id, otp) {
  const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, otp })
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "OTP verification failed");
  }

  return await res.json();   // { message, role, id, token }
}
