import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/employee/Dashboard';
import BrowseJobs from './pages/employee/BrowseJobs';
import MyApplications from './pages/employee/MyApplications';
import Profile from './pages/employee/Profile';
import HRDashboard from './pages/hr/HRDashboard';
import PostJob from './pages/hr/PostJob';

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
          <Route path="/my-applications" element={<PrivateRoute roles={['employee']}><MyApplications /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute roles={['employee']}><Profile /></PrivateRoute>} />

          {/* HR */}
          <Route path="/hr/dashboard" element={<PrivateRoute roles={['hr']}><HRDashboard /></PrivateRoute>} />
          <Route path="/hr/post-job" element={<PrivateRoute roles={['hr']}><PostJob /></PrivateRoute>} />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;