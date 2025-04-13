import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export const useFetchListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = async () => {
    try {
      const response = await axios.get("/api/listings", {
        withCredentials: true,
      });

      const transformedData = response.data.listings
        .map((item) => ({
          id: item._id,
          name: item.title,
          quantity: item.currentStock || 0,
          category: item.category,
          minStock: item.minStockLevel,
          maxStock: item.maxStockLevel,
          abcCategory: item.abcCategory,
          status: item.status,
          description: item.description,
          itemCode: item.itemCode,
          currentStock: item.currentStock,
          stockLevel: item.stockLevelStatus,
        }))
        .reverse();
      console.log(`Transformed data: ${JSON.stringify(transformedData)}`);

      setListings(transformedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      toast.error("Failed to fetch listings");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return {
    listings,
    loading,
    error,
    fetchListings,
  };
};
