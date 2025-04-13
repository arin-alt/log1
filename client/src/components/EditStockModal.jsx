import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUpdateStock } from "../hooks/useUpdateStock";

const EditStockModal = ({ isOpen, onClose, onSuccess, stock }) => {
  const { updateStock, isLoading } = useUpdateStock();
  const [formData, setFormData] = useState({
    quantity: "",
    expirationDate: "",
    supplier: {
      name: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
    },
    manufacturer: "",
    unitCost: "",
    storageLocation: "",
    notes: "",
  });

  useEffect(() => {
    if (stock) {
      setFormData({
        quantity: stock.quantity || "",
        expirationDate: stock.expirationDate
          ? new Date(stock.expirationDate).toISOString().split("T")[0]
          : "",
        supplier: {
          name: stock.supplier?.name || "",
          contactPerson: stock.supplier?.contactPerson || "",
          contactNumber: stock.supplier?.contactNumber || "",
          email: stock.supplier?.email || "",
        },
        manufacturer: stock.manufacturer || "",
        unitCost: stock.unitCost || "",
        storageLocation: stock.storageLocation || "",
        notes: stock.notes || "",
      });
    }
  }, [stock]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("supplier.")) {
      const supplierField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        supplier: {
          ...prev.supplier,
          [supplierField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "quantity" || name === "unitCost"
            ? Number(value) || ""
            : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStock(stock._id, formData);
      onSuccess();
      onClose();
    } catch (error) {
      // Error handled by hook
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000070] bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Edit Stock</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 grid grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiration Date
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit Cost
                </label>
                <input
                  type="number"
                  name="unitCost"
                  value={formData.unitCost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Storage Location
                </label>
                <input
                  type="text"
                  name="storageLocation"
                  value={formData.storageLocation}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            {/* Right Column - Supplier Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Supplier Name
                </label>
                <input
                  type="text"
                  name="supplier.name"
                  value={formData.supplier.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="supplier.contactPerson"
                  value={formData.supplier.contactPerson}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="supplier.contactNumber"
                  value={formData.supplier.contactNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="supplier.email"
                  value={formData.supplier.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-[#1F3987] text-white rounded-md hover:bg-[#1F3987]/90 disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update Stock"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStockModal;
