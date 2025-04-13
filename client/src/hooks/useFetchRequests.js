// src/hooks/useFetchRequests.js
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export const useFetchRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("/api/requests", {
        withCredentials: true,
      });

      const transformedData = response.data.requests.map((request) => ({
        id: request._id,
        // itemName: request.listing.title,
        // itemCode: request.listing.itemCode,
        itemName: `mock_title`,
        itemCode: `mock_itemCode`,
        listing: request.listing,
        department: request.department,
        requestedBy: `${request.requestedBy.firstName} ${request.requestedBy.lastName}`,
        quantity: request.quantity,
        priority: request.priority,
        purpose: request.purpose,
        status: request.status.toLowerCase(),
        requestDate: new Date(request.createdAt).toISOString(),
        approvedBy: request.approvedBy
          ? `${request.approvedBy.firstName} ${request.approvedBy.lastName}`
          : null,
        fulfilledBy: request.fulfilledBy
          ? `${request.fulfilledBy.firstName} ${request.fulfilledBy.lastName}`
          : null,
        approvalDate: request.approvalDate
          ? new Date(request.approvalDate).toISOString()
          : null,
        fulfillmentDate: request.fulfillmentDate
          ? new Date(request.fulfillmentDate).toISOString()
          : null,
        stocksUsed: request.stocksUsed || [],
      }));
      setRequests(transformedData);
      setLoading(false);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      toast.error(message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    refetchRequests: fetchRequests,
  };
};
