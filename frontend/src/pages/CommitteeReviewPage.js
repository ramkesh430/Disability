import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import "./CommitteeReviewPage.css";

function CommitteeReviewPage() {
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [review, setReview] = useState({ decision: "Approved", final_category: "", remarks: "" });

  const load = () => api.get("/api/committee-reviews/").then((res) => setRows(res.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!selectedId) return;
    await api.post(`/api/committee-reviews/${selectedId}`, review);
    setSelectedId(null);
    setReview({ decision: "Approved", final_category: "", remarks: "" });
    load();
  };

  return (
    <Layout>
      <div className="page-card">
        <h2>Committee Review</h2>
        <table className="data-table">
          <thead>
            <tr><th>App No</th><th>Name</th><th>Status</th><th>Review</th></tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id}>
                <td>{item.application_no}</td>
                <td>{item.full_name}</td>
                <td>{item.status}</td>
                <td><button className="primary-btn green-btn" onClick={() => setSelectedId(item.id)}>Select</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedId && (
          <div className="review-panel">
            <h3>Committee Review #{selectedId}</h3>
            <select className="form-control" value={review.decision} onChange={(e) => setReview({ ...review, decision: e.target.value })}>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select className="form-control" value={review.final_category} onChange={(e) => setReview({ ...review, final_category: e.target.value })}>
              <option value="">Select Category</option>
              <option value="क">क</option>
              <option value="ख">ख</option>
              <option value="ग">ग</option>
              <option value="घ">घ</option>
            </select>
            <textarea className="form-control" rows="4" placeholder="Remarks" value={review.remarks} onChange={(e) => setReview({ ...review, remarks: e.target.value })}></textarea>
            <button className="primary-btn green-btn" onClick={submit}>Submit Committee Review</button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CommitteeReviewPage;
