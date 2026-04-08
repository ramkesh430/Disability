import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import "./DashboardPage.css";

function DashboardPage() {
  const [data, setData] = useState({
    total_applications: 0,
    approved: 0,
    ward_pending: 0,
    committee_pending: 0,
    rejected: 0,
    cards_generated: 0
  });

  useEffect(() => {
    api.get("/api/dashboard/").then((res) => setData(res.data)).catch(() => {});
  }, []);

  return (
    <Layout>
      <div className="dashboard-cards">
        <div className="dash-card"><h4>Total Applications</h4><h2>{data.total_applications}</h2></div>
        <div className="dash-card green"><h4>Approved</h4><h2>{data.approved}</h2></div>
        <div className="dash-card orange"><h4>Ward Pending</h4><h2>{data.ward_pending}</h2></div>
        <div className="dash-card purple"><h4>Committee Pending</h4><h2>{data.committee_pending}</h2></div>
        <div className="dash-card red"><h4>Rejected</h4><h2>{data.rejected}</h2></div>
        <div className="dash-card blue"><h4>Cards Generated</h4><h2>{data.cards_generated}</h2></div>
      </div>
    </Layout>
  );
}

export default DashboardPage;
