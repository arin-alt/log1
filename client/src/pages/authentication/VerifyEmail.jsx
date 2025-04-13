import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import logo from "../../assets/logo.png";
import axios from "axios";

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

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

  //   const handleResendVerificationCode = async () => {
  //     try {
  //       await axios.post("/api/auth/resend-verification", { email });
  //       setTimer(120);
  //       setIsResendDisabled(true);
  //       toast.success("New verification code sent to your email");
  //     } catch (error) {
  //       toast.error(
  //         error.response?.data?.message || "Failed to resend verification code"
  //       );
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/auth/verify-email", { code: verificationCode });
      toast.success("Email Verified Successfully", {
        description: "You can now login to your account",
      });
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
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
              Email Verification
            </p>
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="verificationCode"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Enter Verification Code
            </label>
            <input
              id="verificationCode"
              name="verificationCode"
              type="text"
              required
              placeholder="Enter the verification code"
              className="bg-white block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-[#1F3987] focus:border-[#1F3987] sm:text-sm"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#1F3987] border border-transparent rounded-md shadow-sm hover:bg-[#1F3987] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F3987] disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </div>
        </form>
        {/* <div className="text-sm text-center">
          Didn't receive the code?{" "}
          <button
            onClick={handleResendVerificationCode}
            disabled={isResendDisabled}
            className="font-medium text-[#1F3987] hover:text-[#1F3987] disabled:opacity-50"
          >
            Resend Code {isResendDisabled && `(${timer}s)`}
          </button>
        </div> */}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
