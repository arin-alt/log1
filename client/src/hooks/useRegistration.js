import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const useRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/auth/signup", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success)
        toast.success("Registration successful", {
          description: "You can now login to your account",
        });

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
};
