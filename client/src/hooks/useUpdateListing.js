import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const useUpdateListing = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateListing = async (id, data) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `/api/listings/${id}`,
        data,
        { withCredentials: true }
      );
      toast.success("Listing updated successfully");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update listing";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateListing, isLoading };
};