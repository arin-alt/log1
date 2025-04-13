import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const useAddStock = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);

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

  const addStock = async (data) => {
    setIsLoading(true);
    try {
      console.log("Submitting stock data:", data);
      const response = await axios.post("/api/stocks", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Stock added successfully");

      // Update ABC classification after successful stock addition
      await updateAbcClassification();

      return response.data;
    } catch (error) {
      console.error("Error adding stock:", error);
      const message = error.response?.data?.message || "Failed to add stock";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { addStock, isLoading: isLoading || isClassifying };
};
