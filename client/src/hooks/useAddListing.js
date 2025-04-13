import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export const useAddListing = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addListing = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        '/api/listings', 
        data,
        { withCredentials: true }
      );
      toast.success('Listing added successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add listing';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { addListing, isLoading };
};