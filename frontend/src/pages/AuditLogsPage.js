import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import "./AuditLogsPage.css";

function AuditLogsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/api/audit-logs/").then((res) => setRows(res.data)).catch(() => {});
  }, []);

  return (
    <Layout>
      <div className="page-card">
        <h2>Audit Logs</h2>
        <table className="data-table">
          <thead><tr><th>ID</th><th>Module</th><th>Action</th><th>Description</th><th>Date</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.module}</td>
                <td>{row.action}</td>
                <td>{row.description}</td>
                <td>{row.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default AuditLogsPage;
