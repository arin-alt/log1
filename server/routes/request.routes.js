import express from "express";
import {
  createRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  approveRequest,
  fulfillRequest,
  rejectRequest,
  cancelRequest,
} from "../controllers/request.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/:id", getRequest);
router.put("/:id", updateRequest);
router.delete("/:id", deleteRequest);

router.patch("/:id/approve", approveRequest);
router.patch("/:id/fulfill", fulfillRequest);
router.patch("/:id/reject", rejectRequest);
router.patch("/:id/cancel", cancelRequest);

export default router;
