import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const change = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/auth/login", formData);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("full_name", res.data.full_name);
      localStorage.setItem("role", res.data.role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={submit}>
        <img src="/logo.png" alt="logo" className="login-logo" />
        <h2>Login</h2>
        <p>Disability Identity Card Management System</p>
        {error && <div className="error-box">{error}</div>}
        <label>Username</label>
        <input name="username" value={formData.username} onChange={change} />
        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={change} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
