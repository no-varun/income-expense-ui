// src/routes/PublicRoute.jsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {

    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;

};

export default PublicRoute;