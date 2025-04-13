import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchStocks = (listingId) => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStocks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/stocks", {
        withCredentials: true,
        params: {
          populate: "listing", 
        },
      });

      if (listingId) {
        const filteredStocks = response.data.stocks.filter(
          (stock) => stock.listing?.id === listingId
        );
        setStocks(filteredStocks.reverse());
      } else {
        setStocks(response.data.stocks);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setError(error.response?.data?.message || "Failed to fetch stocks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [listingId]);

  return {
    stocks,
    isLoading,
    error,
    refetch: fetchStocks,
  };
};
