import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ApplicationListPage from "./pages/ApplicationListPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import ApplicationEditPage from "./pages/ApplicationEditPage";
import ApplicationAddPage from "./pages/ApplicationAddPage";
import WardReviewPage from "./pages/WardReviewPage";
import CommitteeReviewPage from "./pages/CommitteeReviewPage";
import IDCardPage from "./pages/IDCardPage";
import DuplicateRequestPage from "./pages/DuplicateRequestPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import MastersPage from "./pages/MastersPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><ApplicationListPage /></ProtectedRoute>} />
        <Route path="/applications/:id" element={<ProtectedRoute><ApplicationDetailPage /></ProtectedRoute>} />
        <Route path="/applications/edit/:id" element={<ProtectedRoute><ApplicationEditPage /></ProtectedRoute>} />
        <Route path="/applications/add" element={<ProtectedRoute><ApplicationAddPage /></ProtectedRoute>} />
        <Route path="/ward-reviews" element={<ProtectedRoute><WardReviewPage /></ProtectedRoute>} />
        <Route path="/committee-reviews" element={<ProtectedRoute><CommitteeReviewPage /></ProtectedRoute>} />
        <Route path="/id-cards" element={<ProtectedRoute><IDCardPage /></ProtectedRoute>} />
        <Route path="/duplicate-requests" element={<ProtectedRoute><DuplicateRequestPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/masters" element={<ProtectedRoute><MastersPage /></ProtectedRoute>} />
        <Route path="/audit-logs" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
