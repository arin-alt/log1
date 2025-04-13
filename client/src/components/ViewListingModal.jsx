import React, { useState } from "react";
import { X, Edit } from "lucide-react";
import { IoAdd } from "react-icons/io5";
import EditListingModal from "./EditListingModal";
import AddStockModal from "./AddStockModal";
import { useFetchStocks } from "../hooks/useFetchStocks";
import { useDeleteStock } from "../hooks/useDeleteStock";
import { AiFillDelete, AiFillEye } from "react-icons/ai";
import EditStockModal from "./EditStockModal";
import ConfirmationDialog from "./ConfirmationDialog";
import ViewStockModal from "./ViewStockModal";
import { useFetchListings } from "../hooks/useFetchListing";

const ViewListingModal = ({ isOpen, onClose, listing, onEdit, onDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [isEditStockModalOpen, setIsEditStockModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isViewStockModalOpen, setIsViewStockModalOpen] = useState(false);
  const [selectedViewStock, setSelectedViewStock] = useState(null);

  const { deleteStock, isLoading: deletingStock } = useDeleteStock();
  const { fetchListings } = useFetchListings();

  const handleEditStock = (stock) => {
    setSelectedStock(stock);
    setIsEditStockModalOpen(true);
  };

  const handleViewStock = (stock) => {
    setSelectedViewStock(stock);
    setIsViewStockModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (stockToDelete) {
      try {
        await deleteStock(stockToDelete);
        await fetchListings();
        refetch();
        setStockToDelete(null);
      } catch (error) {
        console.error("Error deleting stock:", error);
      }
    }
  };
  const handleDeleteClick = (stockId) => {
    setStockToDelete(stockId);
  };

  const {
    stocks,
    isLoading: loadingStocks,
    error,
    refetch,
  } = useFetchStocks(listing?._id || listing?.id);

  if (!isOpen || !listing) return null;

  const calculateTotalStock = () => {
    if (!stocks || stocks.length === 0) return 0;
    return stocks.reduce((total, stock) => total + stock.quantity, 0);
  };

  /* STOCKS TABLE PAGINATION */
  const itemsPerPage = 5;
  const indexOfLastStock = currentPage * itemsPerPage;
  const indexOfFirstStock = indexOfLastStock - itemsPerPage;
  const currentStocks = stocks
    ? stocks.slice(indexOfFirstStock, indexOfLastStock)
    : [];
  const totalPages = stocks ? Math.ceil(stocks.length / itemsPerPage) : 0;

  const getStockLevelClass = () => {
    if (listing.stockLevel === "low") return "bg-red-100 text-red-800";
    if (listing.stockLevel === "high") return "bg-green-100 text-green-800";
    if (listing.stockLevel === "moderate")
      return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const handleAddStock = () => {
    setIsAddStockModalOpen(true);
  };
  const handleClose = async () => {
    if (onEdit) {
      await onEdit(); // This will refetch the listings table
    }
    onClose();
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async () => {
    setIsEditModalOpen(false);
    onClose();
    if (onEdit) {
      await onEdit();
    }
  };

  const handleDelete = () => {
    onDelete(listing._id || listing.id);
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#00000070] bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
          {/* Fixed Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Listing Details
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="p-2 text-gray-500 hover:text-blue-600 cursor-pointer"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-500 hover:text-red-600 cursor-pointer"
                >
                  <AiFillDelete className="w-5 h-5" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <p className="p-3 bg-gray-50 rounded-md">{listing.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <p className="p-3 bg-gray-50 rounded-md">
                    {listing.category}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ABC Category
                  </label>
                  <p className="p-3 bg-gray-50 rounded-md">
                    {listing.abcCategory || "Not assigned"}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Stocks
                  </label>
                  <p className={`p-3 rounded-md ${getStockLevelClass()}`}>
                    {calculateTotalStock()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Stock
                  </label>
                  <p className="p-3 bg-gray-50 rounded-md">
                    {listing.minStock}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Stock
                  </label>
                  <p className="p-3 bg-gray-50 rounded-md">
                    {listing.maxStock}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="p-3 bg-gray-50 rounded-md min-h-[100px] whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              {/* Stocks Table */}
              <div className="col-span-2 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Stock History</h3>
                  <button
                    onClick={handleAddStock}
                    className="flex items-center px-4 py-2 cursor-pointer bg-[#1F3987] text-white rounded-md hover:bg-[#1F3987]/90 disabled:opacity-50"
                  >
                    <IoAdd className="mr-1" />
                    Add Stock
                  </button>
                </div>

                {loadingStocks ? (
                  <div className="text-center py-4">Loading stocks...</div>
                ) : error ? (
                  <div className="text-center py-4 text-red-500">{error}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acquisition Date
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Notes
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentStocks.map((stock) => (
                          <tr key={stock._id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 whitespace-nowrap">
                              {new Date(
                                stock.acquisitionDate
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              {stock.quantity}
                            </td>
                            <td className="py-3 px-4">{stock.notes}</td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  stock.status.toLowerCase() === "available"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {stock.status.toLowerCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewStock(stock)}
                                  className="text-gray-600 hover:text-blue-600 cursor-pointer"
                                >
                                  <AiFillEye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditStock(stock)}
                                  className="text-gray-600 hover:text-blue-600 cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(stock._id)}
                                  className="text-gray-600 hover:text-red-600 cursor-pointer"
                                  disabled={deletingStock}
                                >
                                  <AiFillDelete className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {(!stocks || stocks.length === 0) && (
                      <div className="text-center py-4 text-gray-500">
                        No stock records found
                      </div>
                    )}

                    {/* Pagination */}
                    {stocks && stocks.length > 0 && (
                      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
                        <div className="flex-1 flex justify-between sm:hidden">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Showing{" "}
                              <span className="font-medium">
                                {indexOfFirstStock + 1}
                              </span>{" "}
                              -{" "}
                              <span className="font-medium">
                                {Math.min(indexOfLastStock, stocks.length)}
                              </span>{" "}
                              of{" "}
                              <span className="font-medium">
                                {stocks.length}
                              </span>{" "}
                              results
                            </p>
                          </div>
                          <div>
                            <nav
                              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                              aria-label="Pagination"
                            >
                              <button
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.max(prev - 1, 1)
                                  )
                                }
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              >
                                Previous
                              </button>
                              {[...Array(totalPages)].map((_, idx) => (
                                <button
                                  key={idx + 1}
                                  onClick={() => setCurrentPage(idx + 1)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === idx + 1
                                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer"
                                  }`}
                                >
                                  {idx + 1}
                                </button>
                              ))}
                              <button
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                  )
                                }
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              >
                                Next
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ViewStockModal
        isOpen={isViewStockModalOpen}
        onClose={() => {
          setIsViewStockModalOpen(false);
          setSelectedViewStock(null);
        }}
        stock={selectedViewStock}
      />
      <ConfirmationDialog
        isOpen={!!stockToDelete}
        onClose={() => setStockToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Stock"
        message="Are you sure you want to delete this stock? This action cannot be undone."
      />
      <EditStockModal
        isOpen={isEditStockModalOpen}
        onClose={() => {
          setIsEditStockModalOpen(false);
          setSelectedStock(null);
        }}
        onSuccess={() => {
          refetch();
          setIsEditStockModalOpen(false);
          setSelectedStock(null);
        }}
        stock={selectedStock}
      />

      <EditListingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        listing={listing}
        _listing={listing}
      />

      <AddStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModalOpen(false)}
        onSuccess={refetch}
        _listing={listing}
        listingId={listing._id || listing.id}
      />
    </>
  );
};

export default ViewListingModal;
