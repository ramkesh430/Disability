import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";
import Modal from "../components/Modal";
import "./ApplicationEditPage.css";

function ApplicationEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState({
    full_name: "",
    gender: "",
    phone: "",
    citizenship_no: "",
    district: "",
    local_level: "",
    ward_no: "",
    province: "",
    disability_type: "",
    disability_severity: "",
    date_of_birth_ad: "",
    date_of_birth_bs: "",
    guardian_name: "",
    remarks: ""
  });
  const [modal, setModal] = useState({ show: false, type: "success", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadApplication();
    }
  }, [id]);

  const loadApplication = async () => {
    try {
      const response = await api.get(`/api/applications/${id}`);
      setApplication(response.data);
    } catch (error) {
      setModal({
        show: true,
        type: "error",
        message: "Failed to load application data"
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplication(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.put(`/api/applications/${id}`, application);
      setModal({
        show: true,
        type: "success",
        message: "Application updated successfully!"
      });
      setTimeout(() => {
        navigate("/applications");
      }, 2000);
    } catch (error) {
      setModal({
        show: true,
        type: "error",
        message: "Failed to update application"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-card">
        <div className="page-header">
          <h2>Edit Application</h2>
          <button className="cancel-btn" onClick={() => navigate("/applications")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9-6 6 6 18"></polyline>
              <path d="m6 6 15 3 3 3 15"></path>
            </svg>
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={application.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={application.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={application.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Citizenship Number</label>
              <input
                type="text"
                name="citizenship_no"
                value={application.citizenship_no}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Province</label>
              <input
                type="text"
                name="province"
                value={application.province}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>District</label>
              <input
                type="text"
                name="district"
                value={application.district}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Local Level</label>
              <input
                type="text"
                name="local_level"
                value={application.local_level}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Ward No</label>
              <input
                type="text"
                name="ward_no"
                value={application.ward_no}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Disability Type</label>
              <select name="disability_type" value={application.disability_type} onChange={handleChange}>
                <option value="">Select Disability Type</option>
                <option value="Physical Disability">Physical Disability</option>
                <option value="Visual Disability">Visual Disability</option>
                <option value="Hearing Disability">Hearing Disability</option>
                <option value="Mental Disability">Mental Disability</option>
                <option value="Multiple Disability">Multiple Disability</option>
              </select>
            </div>

            <div className="form-group">
              <label>Disability Severity</label>
              <select name="disability_severity" value={application.disability_severity} onChange={handleChange}>
                <option value="">Select Severity</option>
                <option value="A">A - पूर्ण अशक्त</option>
                <option value="B">B - अति अशक्त</option>
                <option value="C">C - मध्यम अपाङ्गता</option>
                <option value="D">D - सामान्य अपाङ्गता</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date of Birth (AD)</label>
              <input
                type="date"
                name="date_of_birth_ad"
                value={application.date_of_birth_ad}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date of Birth (BS)</label>
              <input
                type="text"
                name="date_of_birth_bs"
                value={application.date_of_birth_bs}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
              />
            </div>

            <div className="form-group">
              <label>Guardian Name</label>
              <input
                type="text"
                name="guardian_name"
                value={application.guardian_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={application.remarks}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate("/applications")}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Updating...
                </>
              ) : (
                "Update Application"
              )}
            </button>
          </div>
        </form>
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

export default ApplicationEditPage;
