import React, { useState } from "react";
import { X } from "lucide-react";
import { useAddListing } from "../hooks/useAddListing";

const AddListingModal = ({ isOpen, onClose, onSuccess }) => {
  const { addListing, isLoading } = useAddListing();
  const [formData, setFormData] = useState({
    itemCode: "",
    title: "",
    description: "",
    category: "Medicine",
    minStockLevel: "",
    maxStockLevel: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Stock") ? parseInt(value) || "" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addListing(formData);
      setFormData({
        itemCode: "",
        title: "",
        description: "",
        category: "Medicine",
        minStockLevel: "",
        maxStockLevel: "",
      });
      onSuccess(); 
      onClose();
    } catch (error) {
      // Error handled by hook
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000070] bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Listing</h2>
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1F3987] focus:outline-none focus:ring-1 focus:ring-[#1F3987]"
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1F3987] focus:outline-none focus:ring-1 focus:ring-[#1F3987]"
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
              className="cursor-pointer px-4 py-2 bg-[#1F3987] text-white rounded-md hover:bg-[#1F3987]/90"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListingModal;
