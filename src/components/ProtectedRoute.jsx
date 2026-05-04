import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Milestone 3: Protected Frontend
// If JWT is missing or user is not logged in, redirect to /login
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f4f6f4' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #E1F5EE', borderTop: '3px solid #0F6E56', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#4a4f4b', fontSize: 14 }}>Loading VitalSync...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // No user = no token = redirect to login
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
