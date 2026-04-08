import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import "./DuplicateRequestPage.css";

function DuplicateRequestPage() {
  const [cards, setCards] = useState([]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ id_card_id: "", reason: "", remarks: "" });
  const [modal, setModal] = useState({ show: false, type: "success", message: "" });
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const cardsRes = await api.get("/api/id-cards/");
      const rowsRes = await api.get("/api/duplicate-requests/");
      setCards(cardsRes.data);
      setRows(rowsRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
      setModal({
        show: true,
        type: "error",
        message: "Failed to load data. Please try again."
      });
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form before submission
    if (!form.id_card_id) {
      setModal({
        show: true,
        type: "error",
        message: "Please select an ID card"
      });
      setLoading(false);
      return;
    }
    
    if (!form.reason.trim()) {
      setModal({
        show: true,
        type: "error",
        message: "Please provide a reason for the duplicate request"
      });
      setLoading(false);
      return;
    }

    try {
      await api.post("/api/duplicate-requests/", form);
      setForm({ id_card_id: "", reason: "", remarks: "" });
      setModal({
        show: true,
        type: "success",
        message: "Duplicate request created successfully!"
      });
      load();
    } catch (error) {
      console.error("Duplicate request error:", error);
      setModal({
        show: true,
        type: "error",
        message: "Failed to create duplicate request. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await api.post(`/api/duplicate-requests/${id}/approve`);
      setModal({
        show: true,
        type: "success",
        message: "Duplicate request approved successfully!"
      });
      load();
    } catch (error) {
      console.error("Approval error:", error);
      setModal({
        show: true,
        type: "error",
        message: "Failed to approve request. Please try again."
      });
    }
  };

  const reject = async (id) => {
    try {
      await api.post(`/api/duplicate-requests/${id}/reject`);
      setModal({
        show: true,
        type: "success",
        message: "Duplicate request rejected successfully!"
      });
      load();
    } catch (error) {
      console.error("Rejection error:", error);
      setModal({
        show: true,
        type: "error",
        message: "Failed to reject request. Please try again."
      });
    }
  };

  const viewCard = (cardId) => {
    navigate(`/id-cards`);
  };

  const getCardDetails = (cardId) => {
    return cards.find(card => card.id === cardId);
  };

  return (
    <Layout>
      <div className="dup-grid">
        <div className="page-card">
          <div className="page-header">
            <h2>Create Duplicate Request</h2>
            <button className="secondary-btn" onClick={() => navigate("/id-cards")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              View ID Cards
            </button>
          </div>
          
          <form className="dup-form" onSubmit={submit}>
            <div className="form-group">
              <label>ID Card *</label>
              <select 
                className="form-control" 
                value={form.id_card_id} 
                onChange={(e) => {
                  setForm({ ...form, id_card_id: e.target.value });
                  setSelectedCard(getCardDetails(parseInt(e.target.value)));
                }}
                required
              >
                <option value="">Select card</option>
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.card_number} - {card.application?.full_name || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>

            {selectedCard && (
              <div className="card-preview">
                <h4>Selected Card Details</h4>
                <div className="card-info">
                  <p><strong>Card Number:</strong> {selectedCard.card_number}</p>
                  <p><strong>Holder Name:</strong> {selectedCard.application?.full_name || 'N/A'}</p>
                  <p><strong>Card Type:</strong> {selectedCard.card_type || 'N/A'}</p>
                  <p><strong>Status:</strong> {selectedCard.card_status || 'N/A'}</p>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Reason *</label>
              <select 
                className="form-control" 
                value={form.reason} 
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                required
              >
                <option value="">Select reason</option>
                <option value="Lost">Lost</option>
                <option value="Damaged">Damaged</option>
                <option value="Stolen">Stolen</option>
                <option value="Information Changed">Information Changed</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <textarea 
                className="form-control" 
                rows="4" 
                value={form.remarks} 
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                placeholder="Additional details about the duplicate request..."
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="button" className="secondary-btn" onClick={() => setForm({ id_card_id: "", reason: "", remarks: "" })}>
                Clear
              </button>
              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Request...
                  </>
                ) : (
                  "Create Duplicate Request"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="page-card">
          <div className="page-header">
            <h2>Duplicate Requests</h2>
            <span className="request-count">{rows.length} requests</span>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Card Details</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-data">No duplicate requests found</td>
                  </tr>
                ) : (
                  rows.map((item) => {
                    const card = getCardDetails(item.id_card_id);
                    return (
                      <tr key={item.id}>
                        <td>
                          <span className="request-id">#{item.id}</span>
                        </td>
                        <td>
                          <div className="card-details">
                            <div className="card-number">{card?.card_number || 'N/A'}</div>
                            <div className="card-holder">{card?.application?.full_name || 'Unknown'}</div>
                          </div>
                        </td>
                        <td>
                          <span className="reason-badge">{item.reason}</span>
                          {item.remarks && (
                            <div className="remarks-text">{item.remarks}</div>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="action-btn view-btn" 
                              onClick={() => viewCard(item.id_card_id)}
                              title="View ID Card"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8z"/>
                                <polyline points="21 12 17 12 17 3 17 3 12"/>
                              </svg>
                            </button>
                            {item.status === 'Pending' && (
                              <>
                                <button 
                                  className="action-btn approve-btn" 
                                  onClick={() => approve(item.id)}
                                  title="Approve Request"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </button>
                                <button 
                                  className="action-btn reject-btn" 
                                  onClick={() => reject(item.id)}
                                  title="Reject Request"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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

export default DuplicateRequestPage;
