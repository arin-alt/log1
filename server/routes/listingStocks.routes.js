import express from "express";
import {
    createStock,
    getStocks,
    getStock,
    updateStock,
    deleteStock
} from "../controllers/listingStocks.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createStock);
router.get("/", getStocks);
router.get("/:id", getStock);
router.put("/:id", updateStock);
router.delete("/:id", deleteStock);

export default router;