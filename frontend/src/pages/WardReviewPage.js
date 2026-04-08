import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import "./WardReviewPage.css";

function WardReviewPage() {
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [review, setReview] = useState({ review_status: "Approved", recommended_category: "", remarks: "" });

  const load = () => api.get("/api/ward-reviews/").then((res) => setRows(res.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!selectedId) return;
    await api.post(`/api/ward-reviews/${selectedId}`, review);
    setSelectedId(null);
    setReview({ review_status: "Approved", recommended_category: "", remarks: "" });
    load();
  };

  return (
    <Layout>
      <div className="page-card">
        <h2>Ward Review</h2>
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
                <td><button className="primary-btn" onClick={() => setSelectedId(item.id)}>Select</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedId && (
          <div className="review-panel">
            <h3>Review Application #{selectedId}</h3>
            <select className="form-control" value={review.review_status} onChange={(e) => setReview({ ...review, review_status: e.target.value })}>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Returned">Returned</option>
            </select>
            <select className="form-control" value={review.recommended_category} onChange={(e) => setReview({ ...review, recommended_category: e.target.value })}>
              <option value="">Select Category</option>
              <option value="क">क</option>
              <option value="ख">ख</option>
              <option value="ग">ग</option>
              <option value="घ">घ</option>
            </select>
            <textarea className="form-control" rows="4" placeholder="Remarks" value={review.remarks} onChange={(e) => setReview({ ...review, remarks: e.target.value })}></textarea>
            <button className="primary-btn" onClick={submit}>Submit Review</button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default WardReviewPage;
