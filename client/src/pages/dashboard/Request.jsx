import React, { useState } from "react";
import {
  AiFillEye,
  AiFillDelete,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { Edit, Search } from "lucide-react";
import { toast } from "sonner";
import { IoAdd } from "react-icons/io5";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useFetchRequests } from "../../hooks/useFetchRequests";
import axios from "axios";
import { useCallback } from "react";

const Request = () => {
  const { requests, loading, error, refetchRequests } = useFetchRequests();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 10;
  const [activeMenu, setActiveMenu] = useState(null);

  const handleApprove = useCallback(async (id) => {
    try {
      await axios.patch(
        `/api/requests/${id}/approve`,
        {},
        { withCredentials: true }
      );
      toast.success("Request approved successfully");
      setActiveMenu(null);
      await refetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve request");
    }
  });

  const handleReject = useCallback(async (id) => {
    try {
      await axios.patch(
        `/api/requests/${id}/reject`,
        {},
        { withCredentials: true }
      );
      toast.success("Request rejected successfully");
      setActiveMenu(null);
      await refetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    } finally {
      window.location.reload();
    }
  });

  const handleFulfill = useCallback(async (id) => {
    try {
      await axios.patch(
        `/api/requests/${id}/fulfill`,
        {},
        { withCredentials: true }
      );
      toast.success("Request fulfilled successfully");
      setActiveMenu(null);
      await refetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fulfill request");
    }
  });

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "fulfilled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sortedItems = [...requests].sort((a, b) => {
    if (sortConfig.key) {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "requestDate") {
        aValue = new Date(a.requestDate);
        bValue = new Date(b.requestDate);
      }

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredItems = sortedItems.filter((item) => {
    const matchesSearch = item.listing.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const fetchListingName = async (id) => {
    try {
      const response = await axios.get(`/api/listings/${id}`, {
        withCredentials: true,
      });
      return response.data.listing.title;
    } catch (error) {
      return "Unknown Item";
    }
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
              <Search className="w-5 h-5 text-gray-500" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-100 px-3 py-1.5 rounded-lg focus:outline-none"
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                  <button onClick={() => handleSort("id")} className="ml-2">
                    {sortConfig.key === "id" &&
                    sortConfig.direction === "ascending" ? (
                      <AiOutlineSortAscending className="inline w-4 h-4" />
                    ) : (
                      <AiOutlineSortDescending className="inline w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                  <button
                    onClick={() => handleSort("itemName")}
                    className="ml-2"
                  >
                    {sortConfig.key === "itemName" &&
                    sortConfig.direction === "ascending" ? (
                      <AiOutlineSortAscending className="inline w-4 h-4" />
                    ) : (
                      <AiOutlineSortDescending className="inline w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                  <button
                    onClick={() => handleSort("requestDate")}
                    className="ml-2"
                  >
                    {sortConfig.key === "requestDate" &&
                    sortConfig.direction === "ascending" ? (
                      <AiOutlineSortAscending className="inline w-4 h-4" />
                    ) : (
                      <AiOutlineSortDescending className="inline w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.listing.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        [...item.status][0].toUpperCase() +
                          [...item.status].slice(1).join("")
                      )}`}
                    >
                      {[...item.status][0].toUpperCase() +
                        [...item.status].slice(1).join("")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(item.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600">
                        <BsThreeDotsVertical className="w-5 h-5" />
                      </Menu.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-xl ring-1 ring-gray-300 focus:outline-none z-100">
                          <div className="py-1.5">
                            {item.status === "pending" && (
                              <>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleApprove(item.id);
                                      }}
                                      className={`${
                                        active
                                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                                          : "text-gray-700 bg-white"
                                      } group flex w-full items-center px-4 py-3 text-sm font-medium transition-all duration-150 ease-in-out hover:bg-blue-600 hover:text-white`}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      Approve
                                    </button>
                                  )}
                                </Menu.Item>
                                <div className="border-t border-gray-200 my-1"></div>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReject(item.id);
                                      }}
                                      className={`${
                                        active
                                          ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                                          : "text-gray-700 bg-white"
                                      } group flex w-full items-center px-4 py-3 text-sm font-medium transition-all duration-150 ease-in-out hover:bg-red-600 hover:text-white`}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                      Reject
                                    </button>
                                  )}
                                </Menu.Item>
                              </>
                            )}

                            {item.status === "approved" && (
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFulfill(item.id);
                                    }}
                                    className={`${
                                      active
                                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                                        : "text-gray-700 bg-white"
                                    } group flex w-full items-center px-4 py-3 text-sm font-medium transition-all duration-150 ease-in-out hover:bg-purple-600 hover:text-white`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 mr-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    Fulfilled
                                  </button>
                                )}
                              </Menu.Item>
                            )}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
    </div>
  );
};

export default Request;
