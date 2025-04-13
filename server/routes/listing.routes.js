import express from "express";
import { 
    createListing,
    getListings,
    getListing,
    updateListing,
    deleteListing
} from "../controllers/listing.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createListing);
router.get("/", getListings);
router.get("/:id", getListing);
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);

export default router;