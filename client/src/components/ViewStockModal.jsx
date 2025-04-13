import React from "react";
import { X } from "lucide-react";

const ViewStockModal = ({ isOpen, onClose, stock }) => {
  if (!isOpen || !stock) return null;

  return (
    <div className="fixed inset-0 bg-[#00000070] bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Stock Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md">
                  {stock.quantity}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Acquisition Date
                </label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md">
                  {new Date(stock.acquisitionDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit Cost
                </label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md">
                  {stock.unitCost}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <p
                  className={`mt-1 p-3 rounded-md ${
                    stock.status === "available"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {stock.status}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md">
                  {stock.notes || "No notes"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Supplier
                </label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md">
                  {stock.supplier?.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Person
                </label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md">
                  {stock.supplier?.contactPerson}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md">
                  {stock.supplier?.contactNumber}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md">
                  {stock.supplier?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStockModal;
