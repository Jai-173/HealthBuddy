import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user is logged in through Firebase and no valid stored user exists
  if (!currentUser && !storedUser) {
    localStorage.removeItem("user"); // Clear any potential invalid data
    return <Navigate to="/login" />;
  }

  // Verify the stored user has required fields
  if (storedUser && (!storedUser.email || !storedUser.uid)) {
    localStorage.removeItem("user");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;