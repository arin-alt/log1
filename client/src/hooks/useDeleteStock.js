import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const useDeleteStock = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteStock = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/stocks/${id}`, {
        withCredentials: true,
      });
      toast.success("Stock deleted successfully");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete stock";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteStock, isLoading };
};