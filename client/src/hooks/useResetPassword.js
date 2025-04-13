import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetPassword = async (token, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `/api/auth/reset-password/${token}`,
        { password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data.message || 'Password reset successful');
      return response.data;

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    isLoading,
    error
  };
};