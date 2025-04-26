import { Navigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CAAAB]"></div>
        </div>;
    }

    const isAdmin = currentUser?.email === "jaichowgule173@gmail.com" || 
                   storedUser?.email === "jaichowgule173@gmail.com";

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;