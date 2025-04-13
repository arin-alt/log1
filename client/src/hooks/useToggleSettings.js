// src/hooks/useToggleSettings.js
import { useState } from 'react';
import { toast } from 'sonner';

export const useToggleSettings = () => {
  const [isLoading, setIsLoading] = useState(false);

  const toggle2FA = async (enabled) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/2fa', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ enable: enabled }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success('Two-factor authentication settings updated');
      return data.user;
    } catch (err) {
      toast.error(err.message || 'Failed to update 2FA settings');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotifications = async (enabled) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ notificationsEnabled: enabled }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success('Notification settings updated');
      return data.user;
    } catch (err) {
      toast.error(err.message || 'Failed to update notification settings');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { toggle2FA, toggleNotifications, isLoading };
};