import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { StyleGuidePage } from './pages/StyleGuidePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPatientPage } from './pages/SignUpPatientPage';
import { SignUpDoctorPage } from './pages/SignUpDoctorPage';
import { SignUpHospitalPage } from './pages/SignUpHospitalPage';

// Authenticated Dashboard Shells
import { PatientDashboardPage } from './pages/PatientDashboardPage';
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';
import { HospitalDashboardPage } from './pages/HospitalDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Previews
import { DashboardPreviewPage } from './pages/DashboardPreviewPage';
import { AdminPreviewPage } from './pages/AdminPreviewPage';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Shell */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup/patient" element={<SignUpPatientPage />} />
            <Route path="/signup/doctor" element={<SignUpDoctorPage />} />
            <Route path="/signup/hospital" element={<SignUpHospitalPage />} />
            <Route path="/dev/style-guide" element={<StyleGuidePage />} />

            {/* Placeholders for future phases */}
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
          </Route>

          {/* Authenticated Patient Dashboard Shell */}
          <Route
            path="/dashboard/patient"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <DashboardLayout role="patient" />
              </ProtectedRoute>
            }
          >
            <Route index element={<PatientDashboardPage />} />
          </Route>

          {/* Authenticated Doctor Dashboard Shell */}
          <Route
            path="/dashboard/doctor"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DashboardLayout role="doctor" />
              </ProtectedRoute>
            }
          >
            <Route index element={<DoctorDashboardPage />} />
          </Route>

          {/* Authenticated Hospital Dashboard Shell */}
          <Route
            path="/dashboard/hospital"
            element={
              <ProtectedRoute allowedRoles={['hospital']}>
                <DashboardLayout role="hospital" />
              </ProtectedRoute>
            }
          >
            <Route index element={<HospitalDashboardPage />} />
          </Route>

          {/* Authenticated Admin Shell */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
          </Route>

          {/* Development Previews */}
          <Route path="/preview/dashboard" element={<DashboardLayout role="patient" />}>
            <Route index element={<DashboardPreviewPage />} />
          </Route>
          <Route path="/preview/admin" element={<AdminLayout />}>
            <Route index element={<AdminPreviewPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
