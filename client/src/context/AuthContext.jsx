import React, { createContext, useState, useEffect } from "react";
import Loader from "../components/Loader";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const retrieveUserFromStorage = () => {
    try {
      const userData = localStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error retrieving user from storage:", error);
      setError(error);
      return null;
    }
  };

  const isLoggedIn = () => {
    setLoading(true);
    const storedUser = retrieveUserFromStorage();
    setUser(storedUser);
    setLoading(false);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};
