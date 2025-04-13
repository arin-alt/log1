import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export const useUpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
    setIsLoading(true);
    try {
      // Validate inputs
      if (!currentPassword.trim()) {
        throw new Error("Current password is required");
      }

      if (!newPassword.trim()) {
        throw new Error("New password is required");
      }

      if (newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match");
      }

      if (currentPassword === newPassword) {
        throw new Error("New password must be different from current password");
      }

      const response = await axios.put(
        '/api/users/password',
        { currentPassword, newPassword },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data.message || 'Password updated successfully');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update password';
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePassword, isLoading };
};