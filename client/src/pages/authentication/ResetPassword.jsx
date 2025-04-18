import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";
import { useResetPassword } from "../../hooks/useResetPassword";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, isLoading } = useResetPassword();
  const navigate = useNavigate();
  const { token } = useParams();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      await resetPassword(token, password);
      navigate("/");
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        className="w-full max-w-md p-8 space-y-8 sm:bg-white sm:rounded-lg sm:shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex items-center justify-center space-x-3">
          <img src={logo} alt="Logo" className="w-20 h-20" />
          <div className="text-left">
            <h2 className="text-3xl font-bold text-[#C3000A]">Logistics</h2>
            <p className="text-gray-700 text-xl font-semibold">
              Reset Password
            </p>
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your new password"
                required
                className="bg-white block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-[#1F3987] focus:border-[#1F3987] sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <div
                  className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <IoEyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <IoEye className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm your new password"
                required
                className="bg-white block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-[#1F3987] focus:border-[#1F3987] sm:text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && (
                <div
                  className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <IoEyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <IoEye className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#1F3987] border border-transparent rounded-md shadow-sm hover:bg-[#1F3987] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F3987] disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          Remembered your password?{" "}
          <a
            href="/"
            className="font-medium text-[#1F3987] hover:text-[#1F3987]"
          >
            Log In
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;