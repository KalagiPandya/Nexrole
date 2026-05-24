import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/employee/Dashboard';
import BrowseJobs from './pages/employee/BrowseJobs';
import MyApplications from './pages/employee/MyApplications';
import Profile from './pages/employee/Profile';
import JobDetail from './pages/employee/JobDetail';
import HRDashboard from './pages/hr/HRDashboard';
import PostJob from './pages/hr/PostJob';
import ViewApplicants from './pages/hr/ViewApplicants';
import VacancyReport from './pages/hr/VacancyReport';
import Promotions from './pages/hr/Promotions';
import Notifications from './pages/shared/Notifications';
import NotFound from './pages/shared/NotFound';

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Employee */}
          <Route path="/dashboard" element={<PrivateRoute roles={['employee']}><Dashboard /></PrivateRoute>} />
          <Route path="/jobs" element={<PrivateRoute roles={['employee']}><BrowseJobs /></PrivateRoute>} />
          <Route path="/jobs/:jobId" element={<PrivateRoute roles={['employee']}><JobDetail /></PrivateRoute>} />
          <Route path="/my-applications" element={<PrivateRoute roles={['employee']}><MyApplications /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute roles={['employee']}><Profile /></PrivateRoute>} />

          {/* HR */}
          <Route path="/hr/dashboard" element={<PrivateRoute roles={['hr']}><HRDashboard /></PrivateRoute>} />
          <Route path="/hr/post-job" element={<PrivateRoute roles={['hr']}><PostJob /></PrivateRoute>} />
          <Route path="/hr/applicants/:jobId" element={<PrivateRoute roles={['hr']}><ViewApplicants /></PrivateRoute>} />
          <Route path="/hr/impact/:appId" element={<PrivateRoute roles={['hr']}><VacancyReport /></PrivateRoute>} />
          <Route path="/hr/promotions" element={<PrivateRoute roles={['hr']}><Promotions /></PrivateRoute>} />

          {/* Shared */}
          <Route path="/notifications" element={<PrivateRoute roles={['employee','hr','admin']}><Notifications /></PrivateRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;