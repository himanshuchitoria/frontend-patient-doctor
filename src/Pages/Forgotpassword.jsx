import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Forgotpassword.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: enter email, 2: enter OTP & new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://backend-dashboard-v3o0.onrender.com/patientauth/forgot-password", { email });
      if (response.data.status) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error sending OTP. Try again later.");
    }
    setLoading(false);
  };

  // Verify OTP and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://backend-dashboard-v3o0.onrender.com/patientauth/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (response.data.status) {
        toast.success("Password reset successful! Please login.");
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Error resetting password. Try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="forgot-password-container">
      {step === 1 && (
        <form onSubmit={handleRequestOTP}>
          <h2>Forgot Password</h2>
          <label>
            Enter your email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@example.com"
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          <h2>Reset Password</h2>
          <label>
            Enter OTP:
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="6-digit OTP"
            />
          </label>
          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="New password"
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;

