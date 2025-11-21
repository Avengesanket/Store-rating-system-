import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { UserRole } from './types';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import StoresList from './pages/StoresList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes */}
            {/* Allow any logged in user */}
            <Route element={<ProtectedRoute />}> 
               <Route path="/change-password" element={<ChangePassword />} />
            </Route>
            
            {/* 1. Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* 2. Store Owner Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.STORE_OWNER]} />}>
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            </Route>

            {/* 3. Normal User Routes (Also accessible to Admin usually, but per requirement separated) */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.NORMAL_USER, UserRole.ADMIN]} />}>
               <Route path="/stores" element={<StoresList />} />
            </Route>
            
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;