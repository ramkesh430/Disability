import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import "./ReportsPage.css";

function ReportsPage() {
  const [statusRows, setStatusRows] = useState([]);
  const [categoryRows, setCategoryRows] = useState([]);
  const [cardSummary, setCardSummary] = useState({ total_cards: 0 });

  useEffect(() => {
    api.get("/api/reports/status-summary").then((res) => setStatusRows(res.data)).catch(() => {});
    api.get("/api/reports/category-summary").then((res) => setCategoryRows(res.data)).catch(() => {});
    api.get("/api/reports/card-summary").then((res) => setCardSummary(res.data)).catch(() => {});
  }, []);

  return (
    <Layout>
      <div className="reports-grid">
        <div className="page-card">
          <h2>Status Summary</h2>
          {statusRows.map((row, i) => (
            <div className="summary-row" key={i}><span>{row.status}</span><strong>{row.count}</strong></div>
          ))}
        </div>

        <div className="page-card">
          <h2>Category Summary</h2>
          {categoryRows.map((row, i) => (
            <div className="summary-row" key={i}><span>{row.category}</span><strong>{row.count}</strong></div>
          ))}
        </div>

        <div className="page-card">
          <h2>Card Summary</h2>
          <div className="summary-row"><span>Total Cards</span><strong>{cardSummary.total_cards}</strong></div>
        </div>
      </div>
    </Layout>
  );
}

export default ReportsPage;
