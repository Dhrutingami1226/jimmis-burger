import React, { useState } from "react";
import API_BASE_URL from "../config/api.js";

const AdminForgotPassword = ({ onForgotSuccess, onShowMessage }) => {
  const [step, setStep] = useState("email"); // "email" or "verify"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      onShowMessage("Please enter your email", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-pass/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset code");
      }

      onShowMessage("Password reset code sent to your email!", "success");
      setStep("verify");
    } catch (error) {
      onShowMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!code || !newPassword) {
      onShowMessage("Please fill in all fields", "error");
      return;
    }

    if (newPassword.length < 6) {
      onShowMessage("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-pass/resetpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, newpassword: newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      onShowMessage("Password updated successfully!", "success");
      onForgotSuccess();
      // Reset form
      setEmail("");
      setCode("");
      setNewPassword("");
      setStep("email");
    } catch (error) {
      onShowMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setCode("");
    setNewPassword("");
  };

  return (
    <>
      {step === "email" ? (
        <form onSubmit={handleEmailSubmit} className="admin-form">
          <h2>Forgot Password</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <p className="info-text">
            A password reset code will be sent to your email address.
          </p>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit} className="admin-form">
          <h2>Reset Password</h2>

          <div className="form-group">
            <label htmlFor="code">Reset Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter the code from your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <p className="info-text">
            Enter the code we sent to your email and your new password.
          </p>

          <div className="button-group">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <button
              type="button"
              onClick={handleBackToEmail}
              disabled={loading}
              className="back-btn"
            >
              Back
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default AdminForgotPassword;
