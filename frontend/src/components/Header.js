import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="header">
      <div>
        <h3>Admin Dashboard</h3>
        <p>{localStorage.getItem("full_name") || "User"} ({localStorage.getItem("role") || ""})</p>
      </div>
      <button onClick={logout}>Logout</button>
    </header>
  );
}

export default Header;
