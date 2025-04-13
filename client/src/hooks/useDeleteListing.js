import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const useDeleteListing = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteListing = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/listings/${id}`, {
        withCredentials: true,
      });
      toast.success("Listing deleted successfully");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete listing";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteListing, isLoading };
};
