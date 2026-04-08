import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import api, { isAuthenticated } from "../api/axios";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import "./IDCardPage.css";

function IDCardPage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [apps, setApps] = useState([]);
  const [appSearch, setAppSearch] = useState("");
  const [cardSearch, setCardSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);

  const [modal, setModal] = useState({
    show: false,
    type: "success",
    message: ""
  });

  const load = async () => {
    // Check authentication first
    if (!isAuthenticated()) {
      setModal({
        show: true,
        type: "error",
        message: "Authentication required. Please log in to access this page. Use username: testuser, password: testpass123"
      });
      return;
    }

    setLoading(true);
    try {
      const cardsRes = await api.get("/api/id-cards/");
      const appsRes = await api.get("/api/applications/?page=1&limit=300");

      setCards(cardsRes.data || []);
      setApps((appsRes.data.items || []).filter((x) => x.status === "Committee Approved"));
    } catch (error) {
      let errorMessage = "Failed to load ID card data";
      
      if (error.response?.status === 401) {
        errorMessage = "Authentication required. Please log in to access this page. Use username: testuser, password: testpass123";
      } else if (error.message?.includes('Unable to connect to the server')) {
        errorMessage = error.message;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      setModal({
        show: true,
        type: "error",
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Add keyboard shortcut for printing (Ctrl+P or Cmd+P)
  useEffect(() => {
    const handleKeyPress = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'p' && selectedCard) {
        event.preventDefault();
        printCard(selectedCard.id);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCard]);

  const filteredApps = useMemo(() => {
    const q = appSearch.toLowerCase();
    return apps.filter((item) =>
      item.full_name?.toLowerCase().includes(q) ||
      item.application_no?.toLowerCase().includes(q) ||
      item.disability_severity?.toLowerCase().includes(q)
    );
  }, [apps, appSearch]);

  const filteredCards = useMemo(() => {
    const q = cardSearch.toLowerCase();
    return cards.filter((card) =>
      card.card_number?.toLowerCase().includes(q) ||
      card.card_type?.toLowerCase().includes(q) ||
      card.application?.full_name?.toLowerCase().includes(q) ||
      card.application?.application_no?.toLowerCase().includes(q)
    );
  }, [cards, cardSearch]);

  const generate = async (id) => {
    try {
      await api.post(`/api/id-cards/generate/${id}`);
      setModal({
        show: true,
        type: "success",
        message: "ID Card generated successfully"
      });
      load();
    } catch (error) {
      setModal({
        show: true,
        type: "error",
        message: error.response?.data?.detail || "Failed to generate ID card"
      });
    }
  };

  const previewCard = async (id) => {
    try {
      const res = await api.get(`/api/id-cards/${id}`);
      setSelectedCard(res.data);
    } catch (error) {
      setModal({
        show: true,
        type: "error",
        message: "Failed to load card preview"
      });
    }
  };

  const preparePrintLayout = () => {
    // Add print-specific styles for better layout
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body { margin: 0; }
        .preview-modal { 
          box-shadow: none; 
          border: none;
          margin: 0;
          padding: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Clean up after print
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  };

  const printCard = async (id) => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to mark this card as printed and open the print dialog?");
    if (!confirmed) return;

    setPrintLoading(true);
    try {
      // Mark card as printed first
      await api.post(`/api/id-cards/${id}/mark-printed`);
      
      // Prepare print layout
      preparePrintLayout();
      
      // Show success message
      setModal({
        show: true,
        type: "success",
        message: "Card marked as printed successfully. Opening print dialog..."
      });

      // Open print dialog after a short delay
      setTimeout(() => {
        window.print();
      }, 500);
      
      // Reload data to update status
      load();
    } catch (error) {
      let errorMessage = "Failed to mark card as printed";
      
      if (error.response?.status === 401) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      setModal({
        show: true,
        type: "error",
        message: errorMessage
      });
    } finally {
      setPrintLoading(false);
    }
  };

  const createDuplicateRequest = (card) => {
    // Navigate to duplicate requests page with pre-selected card
    navigate(`/duplicate-requests`, { state: { selectedCard: card } });
  };

  const viewDuplicateRequests = () => {
    navigate('/duplicate-requests');
  };

  return (
    <Layout>
      <div className="id-page-header">
        <div>
          <h2>ID Card Management</h2>
          <p>Generate and print disability identity cards</p>
        </div>
        <button className="refresh-btn" onClick={load} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="cards-grid">
        <div className="page-card">
          <div className="card-header-row">
            <h3>Generate ID Card</h3>
            <input
              type="text"
              placeholder="Search approved applications..."
              value={appSearch}
              onChange={(e) => setAppSearch(e.target.value)}
              className="table-search"
            />
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>App No</th>
                <th>Name</th>
                <th>Category</th>
                <th>Generate</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length > 0 ? (
                filteredApps.map((item) => (
                  <tr key={item.id}>
                    <td>{item.application_no}</td>
                    <td>{item.full_name}</td>
                    <td>{item.disability_severity}</td>
                    <td>
                      <button className="primary-btn" onClick={() => generate(item.id)}>
                        Generate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-cell">No approved applications found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="page-card">
          <div className="card-header-row">
            <h3>Generated Cards</h3>
            <input
              type="text"
              placeholder="Search cards..."
              value={cardSearch}
              onChange={(e) => setCardSearch(e.target.value)}
              className="table-search"
            />
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Card No</th>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.length > 0 ? (
                filteredCards.map((card) => (
                  <tr key={card.id}>
                    <td>{card.card_number}</td>
                    <td>{card.application?.full_name || ""}</td>
                    <td>{card.card_type}</td>
                    <td>
                      <span className={`status-badge ${card.card_status?.toLowerCase()}`}>
                        {card.card_status}
                      </span>
                    </td>
                    <td>
                      <div className="action-wrap">
                        <button className="view-btn" onClick={() => previewCard(card.id)}>Preview</button>
                        <button className="duplicate-btn" onClick={() => createDuplicateRequest(card)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          Duplicate
                        </button>
                        {card.card_status === 'Generated' && (
                          <button 
                            className={`print-btn ${printLoading ? 'loading' : ''}`} 
                            onClick={() => printCard(card.id)}
                            disabled={printLoading}
                          >
                            {printLoading ? (
                              <>
                                <span className="spinner"></span>
                                Printing...
                              </>
                            ) : (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="6 9 6 15 18 15"></polyline>
                                  <path d="M6 15h12a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3"></path>
                                </svg>
                                Print
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-cell">No cards generated yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCard && (
        <div className="preview-overlay" onClick={() => setSelectedCard(null)}>
          <div className="preview-modal large-print-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header no-print">
              <h3>ID Card Preview</h3>
              <div className="preview-head-actions">
                <button 
                  className={`print-btn ${printLoading ? 'loading' : ''}`} 
                  onClick={() => printCard(selectedCard.id)}
                  disabled={printLoading}
                  title="Print card (Ctrl+P or Cmd+P)"
                >
                  {printLoading ? (
                    <>
                      <span className="spinner"></span>
                      Printing...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 6 15 18 15"></polyline>
                        <path d="M6 15h12a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3"></path>
                      </svg>
                      Print Card
                    </>
                  )}
                </button>
                <button className="close-btn" onClick={() => setSelectedCard(null)} title="Close (Esc)">×</button>
              </div>
            </div>

            <div className="print-sheet">
              {/* ENGLISH - ANNEX 1 */}
              <div className="gov-card english-card">
                <div className="card-header-logo-row">
                  <img src="/logo.png" alt="logo" className="header-logo" />
                  <div className="header-title-block">
                    <div className="small-head">Annex 1</div>
                    <div className="main-head">Disability Identity Card Format</div>
                    <div className="gov-head">The Government of Nepal</div>
                  </div>
                </div>

                <div className="card-top-row">
                  <div className="stamp-box">
                    <div className="stamp-label">Stamp</div>
                  </div>

                  <div className="photo-box">
                    {selectedCard.application?.photo_path ? (
                      <img
                        src={`http://127.0.0.1:8000/${selectedCard.application.photo_path}`}
                        alt="Applicant"
                        className="card-photo-img"
                      />
                    ) : (
                      <div className="photo-text">Photographs</div>
                    )}
                  </div>
                </div>

                <div className="line-row">
                  <span className="label">ID Card Number:</span>
                  <span className="value">{selectedCard.card_number}</span>
                </div>

                <div className="line-row">
                  <span className="label">ID Card Type:</span>
                  <span className="value">{selectedCard.card_type}</span>
                </div>

                <div className="center-card-heading">Disability Identity Card</div>

                <div className="form-line">1) Full Name of Person <span>{selectedCard.application?.full_name || ""}</span></div>
                <div className="form-line">
                  2) Address: Province <span>{selectedCard.application?.province || ""}</span> District <span>{selectedCard.application?.district || ""}</span> Local Level <span>{selectedCard.application?.local_level || ""}</span>
                </div>
                <div className="double-line">
                  <div>3) Date of Birth <span>{selectedCard.application?.date_of_birth_ad || ""}</span></div>
                  <div>4) Citizenship Number <span>{selectedCard.application?.citizenship_no || ""}</span></div>
                </div>
                <div className="double-line">
                  <div>5) Sex <span>{selectedCard.application?.gender || ""}</span></div>
                  <div>6) Blood Group <span></span></div>
                </div>
                <div className="form-line">
                  7) Types of Disability: On the basis of nature <span>{selectedCard.application?.disability_type || ""}</span> On the basis of Severity <span>{selectedCard.card_type || ""}</span>
                </div>
                <div className="form-line">
                  8) Father Name/Mother Name or Guardian <span>{selectedCard.application?.guardian_name || ""}</span>
                </div>
                <div className="form-line">
                  9) Signature of ID Card Holder <span></span>
                </div>
                <div className="form-line">
                  10) Approved by <span></span>
                </div>

                <div className="approval-section">
                  <div className="approval-left-line"></div>
                  <div className="approval-right">
                    <div>Name <span></span></div>
                    <div>Signature <span></span></div>
                    <div>Designation <span></span></div>
                    <div>Date <span></span></div>
                  </div>
                </div>

                <div className="bottom-note">
                  "If somebody finds this ID card, please deposit this in the nearby police station or municipality office"
                </div>
              </div>

              {/* NEPALI - अनुसूची २ */}
              <div className="gov-card nepali-card">
                <div className="card-header-logo-row">
                  <img src="/logo.png" alt="logo" className="header-logo" />
                  <div className="header-title-block">
                    <div className="small-head">अनुसूची २</div>
                    <div className="main-head">अपाङ्गता भएका व्यक्तिको परिचयपत्रको ढाँचा</div>
                    <div className="gov-head">नेपाल सरकार</div>
                  </div>
                </div>

                <div className="card-top-row">
                  <div className="stamp-box">
                    <div className="stamp-label">निशाना छाप</div>
                  </div>

                  <div className="photo-box">
                    {selectedCard.application?.photo_path ? (
                      <img
                        src={`http://127.0.0.1:8000/${selectedCard.application.photo_path}`}
                        alt="Applicant"
                        className="card-photo-img"
                      />
                    ) : (
                      <div className="photo-text">फोटो</div>
                    )}
                  </div>
                </div>

                <div className="line-row">
                  <span className="label">परिचयपत्र नम्बर:</span>
                  <span className="value">{selectedCard.card_number}</span>
                </div>

                <div className="line-row">
                  <span className="label">परिचयपत्रको प्रकार:</span>
                  <span className="value">{selectedCard.card_type}</span>
                </div>

                <div className="center-card-heading">अपाङ्गता परिचय-पत्र</div>

                <div className="form-line">१) नाम, थर <span>{selectedCard.application?.full_name || ""}</span></div>
                <div className="form-line">
                  २) ठेगाना: प्रदेश <span>{selectedCard.application?.province || ""}</span> जिल्ला <span>{selectedCard.application?.district || ""}</span> स्थानीय तह <span>{selectedCard.application?.local_level || ""}</span>
                </div>

                <div className="double-line">
                  <div>
                    ३) जन्म मितिः <span>{selectedCard.application?.date_of_birth_bs || selectedCard.application?.date_of_birth_ad || ""}</span>
                  </div>
                  <div>
                    ४) नागरिकता नम्बरः <span>{selectedCard.application?.citizenship_no || ""}</span>
                  </div>
                </div>

                <div className="double-line">
                  <div>
                    ५) लिङ्गः <span>{selectedCard.application?.gender || ""}</span>
                  </div>
                  <div>
                    ६) रक्त समूहः <span></span>
                  </div>
                </div>

                <div className="form-line">
                  ७) अपाङ्गताको किसिमः प्रकृतिको आधारमा <span>{selectedCard.application?.disability_type || ""}</span> गम्भीरता <span>{selectedCard.card_type || ""}</span>
                </div>

                <div className="form-line">
                  ८) बाबु/आमा वा संरक्षकको नाम, थर <span>{selectedCard.application?.guardian_name || ""}</span>
                </div>

                <div className="form-line">
                  ९) परिचयपत्र वाहकको दस्तखतः <span></span>
                </div>

                <div className="form-line">
                  १०) परिचयपत्र प्रमाणित गर्ने <span></span>
                </div>

                <div className="approval-section">
                  <div className="approval-left-line"></div>
                  <div className="approval-right">
                    <div>नाम <span></span></div>
                    <div>दस्तखत <span></span></div>
                    <div>पद <span></span></div>
                    <div>मिति <span></span></div>
                  </div>
                </div>

                <div className="bottom-note nepali-note">
                  "यो परिचयपत्र कसैले पाएमा नजिको प्रहरी कार्यालय वा स्थानीय निकायमा बुझाइदिनुहोला"
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        show={modal.show}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
      />
    </Layout>
  );
}

export default IDCardPage;
