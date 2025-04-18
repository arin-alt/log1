import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useVerify2FA } from "../../hooks/useVerify2FA";
import logo from "../../assets/logo.png";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120); // Start with 2 minutes
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { verify2FA, isLoading } = useVerify2FA();

  // Get credentials from location state
  const email = location.state?.email;
  const password = location.state?.password;

  useEffect(() => {
    if (!email || !password) {
      navigate('/');
    }
  }, [email, password, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const handleResendOtp = async () => {
    try {
      await verify2FA(email, password); 
      setTimer(120);
      setIsResendDisabled(true);
      toast.success('New OTP sent to your email');
    } catch (error) {
      // Error handled by the hook
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verify2FA(email, password, otp);
      navigate("/dashboard");
    } catch (error) {
      // Error handled by the hook
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
              Two-Factor Authentication
            </p>
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Enter OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              autoComplete="one-time-code"
              required
              placeholder="Enter the OTP"
              className="bg-white block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-[#1F3987] focus:border-[#1F3987] sm:text-sm"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#1F3987] border border-transparent rounded-md shadow-sm hover:bg-[#1F3987] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F3987] disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          Didn't receive the OTP?{" "}
          <button
            onClick={handleResendOtp}
            disabled={isResendDisabled}
            className="font-medium text-[#1F3987] hover:text-[#1F3987] disabled:opacity-50"
          >
            Resend OTP {isResendDisabled && `(${timer}s)`}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OTP;