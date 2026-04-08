import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import "./MastersPage.css";

function MastersPage() {
  const [types, setTypes] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [typeName, setTypeName] = useState("");
  const [sevCode, setSevCode] = useState("");
  const [sevLabel, setSevLabel] = useState("");

  const load = () => {
    api.get("/api/masters/types").then((res) => setTypes(res.data)).catch(() => {});
    api.get("/api/masters/severities").then((res) => setSeverities(res.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const saveType = async (e) => {
    e.preventDefault();
    await api.post("/api/masters/types", { name: typeName });
    setTypeName("");
    load();
  };

  const saveSeverity = async (e) => {
    e.preventDefault();
    await api.post("/api/masters/severities", { code: sevCode, label: sevLabel });
    setSevCode("");
    setSevLabel("");
    load();
  };

  return (
    <Layout>
      <div className="masters-grid">
        <div className="page-card">
          <h2>Disability Types</h2>
          <form className="master-form" onSubmit={saveType}>
            <input className="form-control" value={typeName} onChange={(e) => setTypeName(e.target.value)} placeholder="Type name" />
            <button className="primary-btn" type="submit">Save Type</button>
          </form>
          <ul className="simple-list">
            {types.map((item) => <li key={item.id}>{item.name}</li>)}
          </ul>
        </div>

        <div className="page-card">
          <h2>Severity Masters</h2>
          <form className="master-form" onSubmit={saveSeverity}>
            <input className="form-control" value={sevCode} onChange={(e) => setSevCode(e.target.value)} placeholder="Code" />
            <input className="form-control" value={sevLabel} onChange={(e) => setSevLabel(e.target.value)} placeholder="Label" />
            <button className="primary-btn" type="submit">Save Severity</button>
          </form>
          <ul className="simple-list">
            {severities.map((item) => <li key={item.id}>{item.code} - {item.label}</li>)}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default MastersPage;
