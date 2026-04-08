import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import "./SettingsPage.css";

function SettingsPage() {
  const [form, setForm] = useState({
    municipality_name: "",
    office_address: "",
    contact_phone: "",
    card_header_np: "",
    card_header_en: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/api/settings/").then((res) => setForm(res.data)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.put("/api/settings/", form);
    setMessage("Settings updated");
  };

  return (
    <Layout>
      <div className="page-card settings-box">
        <h2>Settings</h2>
        {message && <div className="success-box">{message}</div>}
        <form className="settings-form" onSubmit={submit}>
          <label>Municipality Name</label>
          <input className="form-control" value={form.municipality_name || ""} onChange={(e) => setForm({ ...form, municipality_name: e.target.value })} />
          <label>Office Address</label>
          <input className="form-control" value={form.office_address || ""} onChange={(e) => setForm({ ...form, office_address: e.target.value })} />
          <label>Contact Phone</label>
          <input className="form-control" value={form.contact_phone || ""} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
          <label>Card Header Nepali</label>
          <input className="form-control" value={form.card_header_np || ""} onChange={(e) => setForm({ ...form, card_header_np: e.target.value })} />
          <label>Card Header English</label>
          <input className="form-control" value={form.card_header_en || ""} onChange={(e) => setForm({ ...form, card_header_en: e.target.value })} />
          <button className="primary-btn" type="submit">Save Settings</button>
        </form>
      </div>
    </Layout>
  );
}

export default SettingsPage;
