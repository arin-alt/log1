import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/authentication/Login";
import Registration from "./pages/authentication/Registration";
import ResetPassword from "./pages/authentication/ResetPassword";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import OTP from "./pages/authentication/OTP";
import Maintenance from "./pages/error/Maintenance";
import NotFound from "./pages/error/NotFound";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Settings from "./pages/dashboard/Settings";
import Listings from "./pages/dashboard/Listings";
import Request from "./pages/dashboard/Request";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/dashboard/Profile";
import VerifyEmail from "./pages/authentication/VerifyEmail";
import "./utils/axios";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="*" element={<NotFound />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/requests" element={<Request />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
