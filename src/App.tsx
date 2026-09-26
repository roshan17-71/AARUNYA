import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { HomePage } from './pages/HomePage';
import { StyleGuidePage } from './pages/StyleGuidePage';
import { DashboardPreviewPage } from './pages/DashboardPreviewPage';
import { AdminPreviewPage } from './pages/AdminPreviewPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Shell */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dev/style-guide" element={<StyleGuidePage />} />
          {/* Catch-all for non-implemented public pages in Phase 1 redirects to /dev/style-guide with note */}
          <Route path="/treatments" element={<Navigate to="/dev/style-guide" replace />} />
          <Route path="/hospitals" element={<Navigate to="/dev/style-guide" replace />} />
          <Route path="/doctors" element={<Navigate to="/dev/style-guide" replace />} />
          <Route path="/packages" element={<Navigate to="/dev/style-guide" replace />} />
          <Route path="/video-consultation" element={<Navigate to="/dev/style-guide" replace />} />
          <Route path="/second-opinion" element={<Navigate to="/dev/style-guide" replace />} />
          <Route path="/patient-stories" element={<Navigate to="/dev/style-guide" replace />} />
          <Route path="/travel" element={<Navigate to="/dev/style-guide" replace />} />
          <Route path="/flights" element={<Navigate to="/dev/style-guide" replace />} />
          <Route path="/hotels" element={<Navigate to="/dev/style-guide" replace />} />
          <Route path="/medical-visa" element={<Navigate to="/dev/style-guide" replace />} />
          <Route path="/signin" element={<Navigate to="/dev/style-guide" replace />} />
          <Route path="/signup/patient" element={<Navigate to="/dev/style-guide" replace />} />
        </Route>

        {/* Dashboard Shell Preview (Phase 1 preview) */}
        <Route path="/preview/dashboard" element={<DashboardLayout role="patient" />}>
          <Route index element={<DashboardPreviewPage />} />
        </Route>

        {/* Admin Shell Preview (Phase 1 preview) */}
        <Route path="/preview/admin" element={<AdminLayout />}>
          <Route index element={<AdminPreviewPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

