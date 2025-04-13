import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const useUpdateStock = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateAbcClassification = async () => {
    setIsClassifying(true);
    try {
      await axios.get("http://localhost:5000/classify_abc", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      });
      toast.success("ABC classifications updated");
    } catch (error) {
      console.error("Error updating ABC classification:", error);
      toast.error("Failed to update ABC classifications");
    } finally {
      setIsClassifying(false);
    }
  };

  const updateStock = async (id, data) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`/api/stocks/${id}`, data, {
        withCredentials: true,
      });
      toast.success("Stock updated successfully");
      updateAbcClassification();

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update stock";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateStock, isLoading };
};
