import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import axios from "axios";

const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userData = localStorage.getItem("userData");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/api/auth/check-auth", {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem("userData");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || !userData) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
