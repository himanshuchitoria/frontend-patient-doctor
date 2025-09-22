import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../Context/AuthContext";
import "./Login.css";




const Login = () => {
  const history = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "patient"
  });
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://backend-dashboard-v3o0.onrender.com/${formData.role}/login`,
        formData
      );

      if (response.data.status) {
        toast.success("Login successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);

        if (formData.role === "patient") {
          history("/patient-dashboard");
          login();
        } else if (formData.role === "doctor") {
          history("/doctor-dashboard");
          login();
        } else if (formData.role === "admin") {
          history("/admin-dashboard");
          login();
        }
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("An error occurred while logging in. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Add image above the login box */}
        
        <div className="login-box">
          <h2 className="login-title"></h2>
          <img
          src="https://tse1.mm.bing.net/th/id/OIP.6sCLofRYxKhNsgkEQfGMaQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
          alt="Logo"
          className="login-top-image"
        />
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">
                Email<span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">
                Password<span className="required">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="role-selection">
              <label className="input-label">Role</label>
              <div className="role-options">
                <label className="role-label">
                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={formData.role === "patient"}
                    onChange={handleRoleChange}
                    className="role-radio"
                  />
                  <span className="role-text">Patient</span>
                </label>

                <label className="role-label">
                  <input
                    type="radio"
                    name="role"
                    value="doctor"
                    checked={formData.role === "doctor"}
                    onChange={handleRoleChange}
                    className="role-radio"
                  />
                  <span className="role-text">Doctor</span>
                </label>

                <label className="role-label">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === "admin"}
                    onChange={handleRoleChange}
                    className="role-radio"
                  />
                  <span className="role-text">Admin</span>
                </label>
              </div>
            </div>

            <div className="submit-button-container">
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? "Please wait, logging in..." : "Login"}
              </button>
            </div>
            <div className="register-link">
              New user?{" "}
              <Link to="/register" className="register-anchor">
                Register here.
              </Link>
            </div>
            <div className="register-link">
              
              <Link to="/forgot-password" className="register-anchr">
                Forgot Password ?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
