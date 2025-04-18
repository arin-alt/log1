import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Box,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  User,
  HelpCircle,
  Bell,
  GitPullRequest,
} from "lucide-react";
import profile from "../assets/profile.jpg";
import logo from "../assets/logo.png";
import { useLogout } from "../hooks/useLogout";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const MainLayout = () => {
  /* NOTIFICATIONS */
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchTerm, setSearchTerm] = useState("");
  const drawerRef = useRef(null);
  const profileMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useLogout();

  const { user } = useContext(AuthContext);

  const fetchNotifications = async () => {
    try {
      const [notificationsRes, unreadCountRes] = await Promise.all([
        fetch("http://localhost:3000/api/notifications", {
          credentials: "include",
        }),
        fetch("http://localhost:3000/api/notifications/unread-count", {
          credentials: "include",
        }),
      ]);

      const notificationsData = await notificationsRes.json();
      const unreadCountData = await unreadCountRes.json();

      if (notificationsData.success) {
        setNotifications(notificationsData.notifications);
      }
      if (unreadCountData.success) {
        setUnreadCount(unreadCountData.count);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/notifications/mark-all-read",
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setUnreadCount(0);
        fetchNotifications(); // Refresh notifications
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const toggleNotificationMenu = async () => {
    if (!notificationMenuOpen) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/notifications/mark-all-read",
          {
            method: "PATCH",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success) {
          setUnreadCount(0);
          fetchNotifications(); // Refresh notifications
        }
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
    setNotificationMenuOpen(!notificationMenuOpen);
  };

  // ...existing code...

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      setDrawerOpen(false);
    }
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target)
    ) {
      setProfileMenuOpen(false);
    }
    if (
      notificationMenuRef.current &&
      !notificationMenuRef.current.contains(event.target)
    ) {
      setNotificationMenuOpen(false);
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchOpen(false);
    }
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setProfileMenuOpen(false);
    setNotificationMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === "Enter") {
      navigate(`/${searchTerm.toLowerCase()}`);
    }
  };

  const getDefaultAvatar = () => {
    const name = `${user?.firstName}+${user?.lastName}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&size=200`;
  };

  const navigationItems = [
    {
      text: "Dashboard",
      path: "/dashboard",
      icon: <Home className="w-5 h-5 mr-2" />,
    },
    {
      text: "Listings",
      path: "/listings",
      icon: <Box className="w-5 h-5 mr-2" />,
    },
    {
      text: "Requests",
      path: "/requests",
      icon: <GitPullRequest className="w-5 h-5 mr-2" />,
    },
    {
      text: "Settings",
      path: "/settings",
      icon: <Settings className="w-5 h-5 mr-2" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md transform ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30`}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={toggleDrawer}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 md:hidden cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <nav className="mt-4">
            <ul>
              {navigationItems.map((item, index) => (
                <li key={index} className="mb-2">
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-lg transition-all duration-200 
            ${
              location.pathname === item.path
                ? "bg-blue-50 text-[#1F3987] border-l-4 border-[#1F3987] font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
                  >
                    <span
                      className={`${
                        location.pathname === item.path
                          ? "text-[#1F3987]"
                          : "text-gray-500"
                      } mr-3`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              onClick={handleLogout}
              className=" cursor-pointer flex items-center p-2 rounded-lg transition-all duration-200 w-full text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <span className="text-gray-500 mr-3">
                <LogOut className="w-5 h-5" />
              </span>
              <span>Log Out</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* Hamburger Menu and Logo */}
            <div className="flex items-center">
              <button
                onClick={toggleDrawer}
                className="text-gray-600 hover:text-gray-900 focus:outline-none md:hidden cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
              <img src={logo} className="w-8 h-8 rounded-full ml-1" />
              <Link to="/" className="ml-2 text-xl font-bold text-gray-800">
                Logistics
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 flex justify-center md:justify-end mx-4 search-container">
              {!isMobile && (
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                    className="bg-transparent focus:outline-none w-full md:w-auto"
                  />
                  <Search className="w-5 h-5 text-gray-500 cursor-pointer" />
                </div>
              )}
            </div>

            {/* Admin Profile, Notification Icon, and Search Icon */}
            <div className="flex items-center relative">
              {isMobile && (
                <div className="relative" ref={searchRef}>
                  <button
                    onClick={toggleSearch}
                    className="md:hidden flex items-center justify-center mr-2"
                  >
                    {searchOpen ? (
                      <X className="w-5 h-5 text-gray-500 cursor-pointer" />
                    ) : (
                      <Search className="w-5 h-5 text-gray-500 cursor-pointer" />
                    )}
                  </button>
                  {searchOpen && (
                    <div className="absolute right-0 mt-6 w-64 bg-white rounded-md shadow-lg py-2 px-2 z-100">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearchKeyPress}
                        className="bg-white block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-[#1F3987] focus:border-[#1F3987] sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="relative flex items-center" ref={profileMenuRef}>
                {/* Notification Icon */}
                <div className="relative" ref={notificationMenuRef}>
                  <button
                    onClick={toggleNotificationMenu}
                    className="flex items-center focus:outline-none mr-4 relative"
                  >
                    <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {notificationMenuOpen && (
                    <div className="absolute right-0 mt-7 w-96 bg-white rounded-lg shadow-lg py-2 z-100 max-h-[400px] overflow-y-auto">
                      <div className="flex justify-between items-center px-4 py-2 border-b">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 ${
                              !notification.isRead ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })}
                                </p>
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-600">
                          No notifications
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Icon and Menu */}
                <img
                  src={
                    user?.profilePicture
                      ? `http://localhost:3000${user.profilePicture}`
                      : getDefaultAvatar()
                  }
                  alt="Admin"
                  className="w-8 h-8 rounded-full"
                />
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center focus:outline-none ml-2 cursor-pointer"
                >
                  <span className="text-gray-800 hidden md:inline">
                    {user?.firstName} {user?.lastName}
                  </span>
                  {profileMenuOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 ml-1 cursor-pointer" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 ml-1 cursor-pointer" />
                  )}
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-54 w-48 bg-white rounded-lg shadow-lg py-2 z-100">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                    >
                      <User className="w-5 h-5 mr-2" />
                      Profile
                    </Link>
                    {/* <Link
                      to="/help"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                    >
                      <HelpCircle className="w-5 h-5 mr-2" />
                      Help
                    </Link> */}
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                    >
                      <Settings className="w-5 h-5 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="cursor-pointer block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center w-full text-left"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
