import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";
import AdminLogin from "./components/AdminLogin";
import AdminRegister from "./components/AdminRegister";
import AdminForgotPassword from "./components/AdminForgotPassword";
import AdminDashboard from "./components/AdminDashboard";

const AdminPanel = () => {
  const [currentPage, setCurrentPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");


  useEffect(() => {
    const savedUser = localStorage.getItem("adminUser");
    if (savedUser) {
      setAdminUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLoginSuccess = (user) => {
    setAdminUser(user);
    setIsLoggedIn(true);
    localStorage.setItem("adminUser", JSON.stringify(user));
    setCurrentPage("dashboard");
    showMessage("Login successful!", "success");
  };

  const handleRegisterSuccess = (user) => {
    showMessage("Registration successful! Please login.", "success");
    setCurrentPage("login");
  };

  const handleForgotPasswordSuccess = () => {
    showMessage("Password reset successfully! Please login with your new password.", "success");
    setCurrentPage("login");
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, {
        withCredentials: true
      });
      setAdminUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("adminUser");
      setCurrentPage("login");
      showMessage("Logged out successfully!", "success");
    } catch (error) {
      console.error("Logout error:", error);

      setAdminUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("adminUser");
      setCurrentPage("login");
      showMessage("Logged out!", "success");
    }
  };

  return (
    <div className="admin-panel">
      {message && <div className={`message ${messageType}`}>{message}</div>}

      {isLoggedIn ? (
        <AdminDashboard admin={adminUser} onLogout={handleLogout} />
      ) : (
        <div className="admin-auth-container">
          <div className="admin-auth-box">
            <div className="admin-tabs">
              <button
                className={`tab-btn ${currentPage === "login" ? "active" : ""}`}
                onClick={() => setCurrentPage("login")}
              >
                Login
              </button>
              <button
                className={`tab-btn ${currentPage === "register" ? "active" : ""}`}
                onClick={() => setCurrentPage("register")}
              >
                Register
              </button>
              <button
                className={`tab-btn ${currentPage === "forgot" ? "active" : ""}`}
                onClick={() => setCurrentPage("forgot")}
              >
                Forgot Password
              </button>
            </div>

            {currentPage === "login" && (
              <AdminLogin
                onLoginSuccess={handleLoginSuccess}
                onShowMessage={showMessage}
              />
            )}

            {currentPage === "register" && (
              <AdminRegister
                onRegisterSuccess={handleRegisterSuccess}
                onShowMessage={showMessage}
              />
            )}

            {currentPage === "forgot" && (
              <AdminForgotPassword
                onForgotSuccess={handleForgotPasswordSuccess}
                onShowMessage={showMessage}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
