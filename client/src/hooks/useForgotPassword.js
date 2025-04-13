import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        '/api/auth/forgot-password',
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data.message || 'Password reset email sent');
      return response.data;

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset email';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    forgotPassword,
    isLoading,
    error
  };
};