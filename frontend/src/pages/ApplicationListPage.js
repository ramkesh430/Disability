import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import "./ApplicationListPage.css";

function ApplicationListPage() {
  const [rows, setRows] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [modal, setModal] = useState({ show: false, type: "success", message: "" });
  const navigate = useNavigate();

  const load = () => {
    api.get("/api/applications/").then((res) => setRows(res.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleAppClick = (app) => {
    // Show popup with application details
    setSelectedApp(app);
    setModal({
      show: true,
      type: "info",
      message: `Application ${app.application_no} - ${app.full_name}\n\nOpening detailed view...`
    });
    
    // Navigate to detail page after a short delay
    setTimeout(() => {
      navigate(`/applications/${app.id}`);
    }, 1000);
  };

  const removeItem = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    await api.delete(`/api/applications/${id}`);
    load();
  };

  const editItem = (id) => {
    navigate(`/applications/edit/${id}`);
  };

  const viewItem = (id) => {
    navigate(`/applications/${id}`);
  };

  const addApplication = () => {
    navigate("/applications/add");
  };

  return (
    <Layout>
      <div className="page-card">
        <div className="page-header">
          <h2>Applications</h2>
          <button className="add-btn" onClick={addApplication}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Application
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>App No</th>
              <th>Name</th>
              <th>Phone</th>
              <th>District</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr 
                key={item.id} 
                className="app-row clickable"
                onClick={() => handleAppClick(item)}
              >
                <td>{item.application_no}</td>
                <td>{item.full_name}</td>
                <td>{item.phone}</td>
                <td>{item.district}</td>
                <td>{item.disability_type}</td>
                <td>{item.disability_severity}</td>
                <td>{item.status}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="action-buttons">
                    <button className="action-btn edit-btn" onClick={() => editItem(item.id)} title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                        <polyline points="18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-3.5-3.5a2.121 2.121 0 0 1 3-3l3.5-3.5z"/>
                      </svg>
                    </button>
                    <button className="action-btn view-btn" onClick={() => viewItem(item.id)} title="View">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8z"/>
                        <polyline points="21 12 17 12 17 3 17 3 12"/>
                      </svg>
                    </button>
                    <button className="action-btn delete-btn" onClick={() => removeItem(item.id)} title="Delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="m19 6-14 4 14"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={modal.show}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
      />
    </Layout>
  );
}

export default ApplicationListPage;
