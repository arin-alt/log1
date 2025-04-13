import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // check for verification first
      if (response.data.user && !response.data.user.isVerified) {
        toast.info("Please verify your email to continue");
        navigate("/verify-email", { state: { email } });
        return;
      }

      // check if 2FA is required
      if (response.data.requires2FA) {
        toast.info(response.data.message || "2FA code sent to your email");
        return { requires2FA: true };
      }

      // successfully logged in / non-2FA login
      if (response.data.success && !response.data.requires2FA) {
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        setUser(response.data.user);
        toast.success(response.data.message || "Login successful");
      }

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};