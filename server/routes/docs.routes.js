import express from 'express';

const router = express.Router();

const apiDocs = {
  info: {
    name: "NGH Logistics API",
    version: "1.0.0",
    description: "API documentation for Nodado General Hospital Logistics System"
  },
  endpoints: {
    auth: {
      base: "/api/auth",
      routes: [
        { method: "POST", path: "/signup", description: "Register a new user" },
        { method: "POST", path: "/login", description: "User login with optional 2FA" },
        { method: "POST", path: "/logout", description: "User logout" },
        { method: "POST", path: "/verify-email", description: "Verify user email" },
        { method: "POST", path: "/forgot-password", description: "Request password reset" },
        { method: "POST", path: "/reset-password/:token", description: "Reset password with token" },
        { method: "GET", path: "/check-auth", description: "Check authentication status" }
      ]
    },
    users: {
      base: "/api/users",
      routes: [
        { method: "GET", path: "/profile", description: "Get user profile" },
        { method: "PUT", path: "/profile", description: "Update user profile" },
        { method: "PUT", path: "/password", description: "Update password" },
        { method: "PUT", path: "/2fa", description: "Toggle two-factor authentication" }
      ]
    },
    listings: {
      base: "/api/listings",
      routes: [
        { method: "POST", path: "/", description: "Create new listing" },
        { method: "GET", path: "/", description: "Get all listings" },
        { method: "GET", path: "/:id", description: "Get listing by ID" },
        { method: "PUT", path: "/:id", description: "Update listing" },
        { method: "DELETE", path: "/:id", description: "Delete listing" }
      ]
    },
    stocks: {
      base: "/api/stocks",
      routes: [
        { method: "POST", path: "/", description: "Create new stock entry" },
        { method: "GET", path: "/", description: "Get all stocks" },
        { method: "GET", path: "/:id", description: "Get stock by ID" },
        { method: "PUT", path: "/:id", description: "Update stock" },
        { method: "DELETE", path: "/:id", description: "Delete stock" }
      ]
    },
    requests: {
      base: "/api/requests",
      routes: [
        { method: "POST", path: "/", description: "Create new request" },
        { method: "GET", path: "/", description: "Get all requests" },
        { method: "GET", path: "/:id", description: "Get request by ID" },
        { method: "PUT", path: "/:id", description: "Update request" },
        { method: "DELETE", path: "/:id", description: "Delete request" },
        { method: "PATCH", path: "/:id/approve", description: "Approve request" },
        { method: "PATCH", path: "/:id/fulfill", description: "Fulfill request" },
        { method: "PATCH", path: "/:id/reject", description: "Reject request" },
        { method: "PATCH", path: "/:id/cancel", description: "Cancel request" }
      ]
    },
    notifications: {
      base: "/api/notifications",
      routes: [
        { method: "GET", path: "/", description: "Get user notifications" },
        { method: "GET", path: "/unread-count", description: "Get unread notifications count" },
        { method: "PATCH", path: "/:id/read", description: "Mark notification as read" },
        { method: "PATCH", path: "/mark-all-read", description: "Mark all notifications as read" },
        { method: "DELETE", path: "/:id", description: "Delete notification" },
        { method: "DELETE", path: "/", description: "Delete all notifications" }
      ]
    }
  }
};

router.get('/', (req, res) => {
  res.json(apiDocs);
});

export default router;