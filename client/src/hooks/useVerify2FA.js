import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export const useVerify2FA = () => {
  const [isLoading, setIsLoading] = useState(false);

  const verify2FA = async (email, password, twoFactorCode) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        '/api/auth/login',
        { email, password, twoFactorCode },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      localStorage.setItem('userData', JSON.stringify(response.data.user));
      toast.success('Login successful');
      return response.data;

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Verification failed';
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { verify2FA, isLoading };
};