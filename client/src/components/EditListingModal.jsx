import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUpdateListing } from "../hooks/useUpdateListing";
import { toast } from "sonner";

const EditListingModal = ({ isOpen, onClose, onSuccess, listing }) => {
  const { updateListing, isLoading } = useUpdateListing();
  const [formData, setFormData] = useState({
    itemCode: "",
    title: "",
    description: "",
    category: "",
    minStockLevel: "",
    maxStockLevel: "",
  });

  useEffect(() => {
    if (listing) {
      console.log("Received listing:", listing);
      setFormData({
        itemCode: listing.itemCode || "",
        title: listing.name || "",
        description: listing.description || "",
        category: listing.category || "Medicine",
        minStockLevel: listing.minStock || "",
        maxStockLevel: listing.maxStock || "",
      });
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Stock") ? parseInt(value) || "" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(JSON.stringify(listing));

    if (!listing) {
      toast.error("No listing data provided");
      return;
    }

    if (!listing.id) {
      toast.error("Invalid listing ID");
      return;
    }

    if (!formData.itemCode || !formData.title) {
      toast.error("Item code and title are required");
      return;
    }

    try {
      const payload = {
        ...formData,
        minStockLevel: parseInt(formData.minStockLevel),
        maxStockLevel: parseInt(formData.maxStockLevel),
      };

      console.log("Submitting data:", payload);
      await updateListing(listing.id, payload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (!isOpen) return null;

  if (!isOpen || !listing) return null;
  return (
    <div className="fixed inset-0 bg-[#00000070] bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Listing</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Item Code
            </label>
            <input
              type="text"
              name="itemCode"
              value={formData.itemCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1F3987] focus:outline-none focus:ring-1 focus:ring-[#1F3987]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1F3987] focus:outline-none focus:ring-1 focus:ring-[#1F3987]"
            >
              <option value="Medicine">Medicine</option>
              <option value="Equipment">Equipment</option>
              <option value="Supplies">Supplies</option>
              <option value="Consumable">Consumable</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Stock Level
            </label>
            <input
              type="number"
              name="minStockLevel"
              value={formData.minStockLevel}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1F3987] focus:outline-none focus:ring-1 focus:ring-[#1F3987]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Stock Level
            </label>
            <input
              type="number"
              name="maxStockLevel"
              value={formData.maxStockLevel}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1F3987] focus:outline-none focus:ring-1 focus:ring-[#1F3987]"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer px-4 py-2 bg-[#1F3987] text-white rounded-md hover:bg-[#1F3987]/90 disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingModal;
