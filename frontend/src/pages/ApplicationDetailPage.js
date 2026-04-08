import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";
import Modal from "../components/Modal";
import "./ApplicationDetailPage.css";

function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, type: "success", message: "" });

  const loadApplication = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/applications/${id}`);
      setApplication(res.data);
    } catch (error) {
      setModal({
        show: true,
        type: "error",
        message: "Failed to load application details"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplication();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.patch(`/api/applications/${id}`, { status: newStatus });
      setModal({
        show: true,
        type: "success",
        message: `Application status updated to ${newStatus}`
      });
      loadApplication();
    } catch (error) {
      setModal({
        show: true,
        type: "error",
        message: "Failed to update application status"
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    
    try {
      await api.delete(`/api/applications/${id}`);
      setModal({
        show: true,
        type: "success",
        message: "Application deleted successfully"
      });
      setTimeout(() => {
        navigate("/applications");
      }, 1500);
    } catch (error) {
      setModal({
        show: true,
        type: "error",
        message: "Failed to delete application"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="detail-loading">
          <div className="spinner"></div>
          <p>Loading application details...</p>
        </div>
      </Layout>
    );
  }

  if (!application) {
    return (
      <Layout>
        <div className="detail-error">
          <h3>Application not found</h3>
          <button onClick={() => navigate("/applications")}>Back to Applications</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="detail-container">
        <div className="detail-header">
          <div className="header-content">
            <button className="back-btn" onClick={() => navigate("/applications")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Applications
            </button>
            <h2>Application Details</h2>
          </div>
          <div className="header-actions">
            <span className={`status-badge ${application.status?.toLowerCase().replace(' ', '-')}`}>
              {application.status}
            </span>
            <button className="delete-btn" onClick={handleDelete}>Delete Application</button>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-card">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Application No:</label>
                <span>{application.application_no}</span>
              </div>
              <div className="info-item">
                <label>Full Name:</label>
                <span>{application.full_name}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{application.phone}</span>
              </div>
              <div className="info-item">
                <label>Citizenship No:</label>
                <span>{application.citizenship_no}</span>
              </div>
              <div className="info-item">
                <label>Gender:</label>
                <span>{application.gender}</span>
              </div>
              <div className="info-item">
                <label>Date of Birth (AD):</label>
                <span>{application.date_of_birth_ad || 'N/A'}</span>
              </div>
              <div className="info-item">
                <label>Date of Birth (BS):</label>
                <span>{application.date_of_birth_bs || 'N/A'}</span>
              </div>
              <div className="info-item">
                <label>Guardian Name:</label>
                <span>{application.guardian_name || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3>Address Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>District:</label>
                <span>{application.district}</span>
              </div>
              <div className="info-item">
                <label>Local Level:</label>
                <span>{application.local_level}</span>
              </div>
              <div className="info-item">
                <label>Ward No:</label>
                <span>{application.ward_no}</span>
              </div>
              <div className="info-item">
                <label>Province:</label>
                <span>{application.province || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3>Disability Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Disability Type:</label>
                <span>{application.disability_type}</span>
              </div>
              <div className="info-item">
                <label>Severity:</label>
                <span>{application.disability_severity}</span>
              </div>
              <div className="info-item">
                <label>Guardian Name:</label>
                <span>{application.guardian_name || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3>Additional Information</h3>
            <div className="info-grid">
              <div className="info-item full-width">
                <label>Remarks:</label>
                <span>{application.remarks || 'No remarks provided'}</span>
              </div>
              <div className="info-item">
                <label>Created Date:</label>
                <span>{new Date(application.created_at).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <label>Created By:</label>
                <span>{application.created_by || 'N/A'}</span>
              </div>
            </div>
          </div>

          {application.photo_path && (
            <div className="detail-card">
              <h3>Applicant Photo</h3>
              <div className="photo-container">
                <img 
                  src={`http://127.0.0.1:8000/${application.photo_path}`} 
                  alt="Applicant" 
                  className="applicant-photo"
                />
              </div>
            </div>
          )}

          <div className="detail-card">
            <h3>Status Management</h3>
            <div className="status-actions">
              <button 
                className="status-btn pending"
                onClick={() => handleStatusUpdate('Pending')}
                disabled={application.status === 'Pending'}
              >
                Mark as Pending
              </button>
              <button 
                className="status-btn review"
                onClick={() => handleStatusUpdate('Under Review')}
                disabled={application.status === 'Under Review'}
              >
                Mark as Under Review
              </button>
              <button 
                className="status-btn approved"
                onClick={() => handleStatusUpdate('Committee Approved')}
                disabled={application.status === 'Committee Approved'}
              >
                Mark as Approved
              </button>
              <button 
                className="status-btn rejected"
                onClick={() => handleStatusUpdate('Rejected')}
                disabled={application.status === 'Rejected'}
              >
                Mark as Rejected
              </button>
            </div>
          </div>
        </div>
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

export default ApplicationDetailPage;
