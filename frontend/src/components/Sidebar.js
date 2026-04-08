import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaStamp,
  FaBriefcase,
  FaIdCard,
  FaClone,
  FaChartBar,
  FaCog,
  FaUser,
  FaClipboardList,
  FaChevronRight
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { label: "Applications", path: "/applications", icon: <FaFileAlt /> },
    { label: "Ward Verification", path: "/ward-reviews", icon: <FaStamp /> },
    { label: "Committee Review", path: "/committee-reviews", icon: <FaBriefcase /> },
    { label: "ID Card Management", path: "/id-cards", icon: <FaIdCard /> },
    { label: "Duplicate Requests", path: "/duplicate-requests", icon: <FaClone /> },
    { label: "Reports & Statistics", path: "/reports", icon: <FaChartBar /> },
    { label: "Master Setup", path: "/masters", icon: <FaCog />, hasArrow: true },
    { label: "User Management", path: "/users", icon: <FaUser />, hasArrow: true },
    { label: "Audit Logs", path: "/audit-logs", icon: <FaClipboardList /> },
    { label: "Settings", path: "/settings", icon: <FaCog /> }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="/logo.png" alt="logo" className="sidebar-logo" />
        <div className="sidebar-brand-text">
          <h2>अपाङ्गता परिचय-पत्र</h2>
          <p>Management System</p>
        </div>
      </div>

      <div className="sidebar-top">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <div className="sidebar-link-left">
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-text">{item.label}</span>
            </div>
            {item.hasArrow && (
              <span className="sidebar-arrow">
                <FaChevronRight />
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
