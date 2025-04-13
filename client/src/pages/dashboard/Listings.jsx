import React, { useState } from "react";
import {
  AiFillEye,
  AiFillDelete,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { Edit, Search } from "lucide-react";
import { IoAdd } from "react-icons/io5";
import { useFetchListings } from "../../hooks/useFetchListing";
import { useFetchStocks } from "../../hooks/useFetchStocks";
import ViewListingModal from "../../components/ViewListingModal";
import AddListingModal from "../../components/AddListingModal";
import EditListingModal from "../../components/EditListingModal";
import ConfirmationDialog from "../../components/ConfirmationDialog";

import Loader from "../../components/Loader";
import { useDeleteListing } from "../../hooks/useDeleteListing";
import {
  calculateTotalStocks,
  getStockLevel,
  getStockLevelClass,
} from "../../utils/stockUtils";

const Listings = () => {
  const {
    listings,
    loading: listingsLoading,
    error: listingsError,
    fetchListings,
  } = useFetchListings();
  const {
    stocks: allStocks,
    loading: stocksLoading,
    error: stocksError,
  } = useFetchStocks();

  /* VIEW A LISTING */
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedViewListing, setSelectedViewListing] = useState(null);

  /* EDIT A LISTING */
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  /* DELETE A LISTING */
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const { deleteListing, isLoading: isDeleting } = useDeleteListing();

  /* FILTERS AND PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockLevelFilter, setStockLevelFilter] = useState("all");
  const [abcFilter, setAbcFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const itemsPerPage = 10;

  const handleView = (id) => {
    const listing = listings.find((item) => item.id === id || item._id === id);
    setSelectedViewListing(listing);
    setIsViewModalOpen(true);
  };

  const handleEdit = (id) => {
    const listing = listings.find((item) => item.id === id || item._id === id);
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    setSelectedItemId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteListing(selectedItemId);
      await fetchListings();
      setIsDeleteDialogOpen(false);
      setIsViewModalOpen(false);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleAddItem = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = async () => {
    await fetchListings();
  };

  const getABCCategory = (itemId) => {
    // find the item directly from listings array
    const item = listings.find(
      (item) => item.id === itemId || item._id === itemId
    );
    // return the actual abcCategory from the item
    return item?.abcCategory || "C";
  };

  const getABCClass = (itemId) => {
    const category = getABCCategory(itemId);
    switch (category) {
      case "A":
        return "bg-blue-100 text-blue-800";
      case "B":
        return "bg-purple-100 text-purple-800";
      case "C":
        return "bg-gray-100 text-gray-800";
    }
  };

  const sortedItems = Array.isArray(listings)
    ? [...listings].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let aValue, bValue;

        // Handle special sorting cases
        if (sortConfig.key === "quantity") {
          aValue = Number(a.quantity) || 0;
          bValue = Number(b.quantity) || 0;
        } else if (sortConfig.key === "stockLevel") {
          aValue = a.stockLevel || 0;
          bValue = b.stockLevel || 0;
        } else {
          // Default sorting for other fields
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        // Handle null/undefined values
        if (aValue == null) aValue = -Infinity;
        if (bValue == null) bValue = -Infinity;

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      })
    : [];

  const categories = [
    ...new Set((listings || []).map((item) => item.category)),
  ];

  const filteredItems = sortedItems.filter((item) => {
    // Fix the search by checking both name and title properties
    const itemName = item.title || item.name || "";
    const matchesSearch = itemName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    // Get the stock level accounting for different property names
    const stockLevel = (
      item.stockLevelStatus ||
      item.stockLevel ||
      ""
    ).toLowerCase();

    const matchesStockLevel =
      stockLevelFilter === "all" ||
      stockLevel === stockLevelFilter.toLowerCase() ||
      // Handle the medium/moderate inconsistency
      (stockLevel === "medium" &&
        stockLevelFilter.toLowerCase() === "moderate") ||
      (stockLevel === "moderate" &&
        stockLevelFilter.toLowerCase() === "medium");

    const matchesABC = abcFilter === "all" || item.abcCategory === abcFilter;

    return matchesSearch && matchesCategory && matchesStockLevel && matchesABC;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  if (listingsLoading || stocksLoading) {
    return <Loader />;
  }

  if (listingsError || stocksError) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-xl text-red-600">
          Error: {listingsError || stocksError}
        </div>
      </div>
    );
  }

  const getDisplayValue = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return value.toString();
  };

  const handleStockLevelClass = (stockLevel) => {
    return getStockLevelClass(stockLevel);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="bg-transparent focus:outline-none w-full md:w-auto"
              />
              <Search className="w-5 h-5 text-gray-500 cursor-pointer" />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-100 px-3 py-1.5 rounded-lg focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={stockLevelFilter}
              onChange={(e) => setStockLevelFilter(e.target.value)}
              className="bg-gray-100 px-3 py-1.5 rounded-lg focus:outline-none"
            >
              <option value="all">All Stock Levels</option>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </select>

            <select
              value={abcFilter}
              onChange={(e) => setAbcFilter(e.target.value)}
              className="bg-gray-100 px-3 py-1.5 rounded-lg focus:outline-none"
            >
              <option value="all">All ABC Categories</option>
              <option value="A">Category A</option>
              <option value="B">Category B</option>
              <option value="C">Category C</option>
            </select>
          </div>
          <button
            onClick={handleAddItem}
            className="px-3 pr-4 py-1.5 bg-[#1F3987] text-white rounded-md hover:bg-[#1F3987]/90 rounded flex items-center space-x-1 cursor-pointer"
          >
            <IoAdd />
            New
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                  <button onClick={() => handleSort("name")} className="ml-2">
                    {sortConfig.key === "name" &&
                    sortConfig.direction === "ascending" ? (
                      <AiOutlineSortAscending className="inline w-4 h-4" />
                    ) : (
                      <AiOutlineSortDescending className="inline w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Stocks
                  <button
                    onClick={() => handleSort("quantity")}
                    className="ml-2"
                  >
                    {sortConfig.key === "quantity" &&
                    sortConfig.direction === "ascending" ? (
                      <AiOutlineSortAscending className="inline w-4 h-4" />
                    ) : (
                      <AiOutlineSortDescending className="inline w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                  <button
                    onClick={() => handleSort("category")}
                    className="ml-2"
                  >
                    {sortConfig.key === "category" &&
                    sortConfig.direction === "ascending" ? (
                      <AiOutlineSortAscending className="inline w-4 h-4" />
                    ) : (
                      <AiOutlineSortDescending className="inline w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                  <button
                    onClick={() => handleSort("stockLevel")}
                    className="ml-2"
                  >
                    {sortConfig.key === "stockLevel" &&
                    sortConfig.direction === "ascending" ? (
                      <AiOutlineSortAscending className="inline w-4 h-4" />
                    ) : (
                      <AiOutlineSortDescending className="inline w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ABC Category
                  <button
                    onClick={() => handleSort("abcCategory")}
                    className="ml-2"
                  >
                    {sortConfig.key === "abcCategory" &&
                    sortConfig.direction === "ascending" ? (
                      <AiOutlineSortAscending className="inline w-4 h-4" />
                    ) : (
                      <AiOutlineSortDescending className="inline w-4 h-4" />
                    )}
                  </button>
                </th>

                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.id || item._id} className="hover:bg-gray-100">
                  <td className="py-4 px-6">
                    {getDisplayValue(item.title || item.name)}
                  </td>
                  {/* Total Stocks */}
                  <td className="py-4 px-6">{item.currentStock}</td>
                  <td className="py-4 px-6">
                    {getDisplayValue(item.category)}
                  </td>
                  {/* Stock Level */}
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 text-sm leading-5 font-semibold rounded-full ${handleStockLevelClass(
                        item.stockLevel
                      )}`}
                    >
                      {item.stockLevel[0].toUpperCase() +
                        item.stockLevel.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded ${getABCClass(
                        item.id || item._id
                      )}`}
                    >
                      {getABCCategory(item.id || item._id)}
                    </span>
                  </td>

                  <td className="py-4 px-6 flex space-x-2">
                    <button
                      onClick={() => handleView(item.id || item._id)}
                      className="text-gray-800 hover:text-blue-700 cursor-pointer"
                    >
                      <AiFillEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(item.id || item._id)}
                      className="text-gray-800 hover:text-green-700 cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id || item._id)}
                      className="text-gray-800 hover:text-red-700 cursor-pointer"
                    >
                      <AiFillDelete className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* PAGINATION */}
        {/* Replace the existing pagination div with this */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
          {/* Mobile pagination */}
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          {/* Desktop pagination */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> -{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredItems.length)}
                </span>{" "}
                of <span className="font-medium">{filteredItems.length}</span>{" "}
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
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
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
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
      </div>
      <ViewListingModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        listing={selectedViewListing}
        onEdit={fetchListings}
        onDelete={handleDelete}
      />

      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
      <EditListingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchListings}
        listing={selectedListing}
      />
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        isDisabled={isDeleting}
      />
    </div>
  );
};

export default Listings;
