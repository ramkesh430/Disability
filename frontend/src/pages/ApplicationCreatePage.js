import React, { useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import "./ApplicationCreatePage.css";

function ApplicationCreatePage() {
  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    phone: "",
    citizenship_no: "",
    district: "",
    local_level: "",
    ward_no: "",
    disability_type: "",
    disability_severity: "",
    remarks: ""
  });
  const [photo, setPhoto] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    if (photo) fd.append("photo", photo);
    for (let i = 0; i < documents.length; i++) {
      fd.append("documents", documents[i]);
    }

    try {
      await api.post("/api/applications/", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage("Application submitted successfully");
      setForm({
        full_name: "",
        gender: "",
        phone: "",
        citizenship_no: "",
        district: "",
        local_level: "",
        ward_no: "",
        disability_type: "",
        disability_severity: "",
        remarks: ""
      });
      setPhoto(null);
      setDocuments([]);
      e.target.reset();
    } catch {
      setMessage("Failed to submit application");
    }
  };

  return (
    <Layout>
      <div className="page-card">
        <h2>New Application</h2>
        {message && <div className="success-box">{message}</div>}
        <form onSubmit={submit}>
          <div className="form-grid">
            <div><label>Full Name</label><input className="form-control" name="full_name" value={form.full_name} onChange={change} required /></div>
            <div><label>Gender</label><select className="form-control" name="gender" value={form.gender} onChange={change}><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
            <div><label>Phone</label><input className="form-control" name="phone" value={form.phone} onChange={change} /></div>
            <div><label>Citizenship No</label><input className="form-control" name="citizenship_no" value={form.citizenship_no} onChange={change} /></div>
            <div><label>District</label><input className="form-control" name="district" value={form.district} onChange={change} /></div>
            <div><label>Local Level</label><input className="form-control" name="local_level" value={form.local_level} onChange={change} /></div>
            <div><label>Ward No</label><input className="form-control" name="ward_no" value={form.ward_no} onChange={change} /></div>
            <div><label>Disability Type</label><input className="form-control" name="disability_type" value={form.disability_type} onChange={change} /></div>
            <div><label>Disability Severity</label><select className="form-control" name="disability_severity" value={form.disability_severity} onChange={change}><option value="">Select</option><option value="क">क</option><option value="ख">ख</option><option value="ग">ग</option><option value="घ">घ</option></select></div>
            <div><label>Photo</label><input className="form-control" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} /></div>
            <div><label>Documents</label><input className="form-control" type="file" multiple onChange={(e) => setDocuments(e.target.files)} /></div>
          </div>
          <div className="remarks-block">
            <label>Remarks</label>
            <textarea className="form-control" name="remarks" rows="4" value={form.remarks} onChange={change}></textarea>
          </div>
          <button className="primary-btn" type="submit">Save Application</button>
        </form>
      </div>
    </Layout>
  );
}

export default ApplicationCreatePage;
