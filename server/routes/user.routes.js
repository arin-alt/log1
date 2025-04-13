import express from "express";
import { 
    updateUserProfile, 
    updatePassword,
    toggleTwoFactorAuth,
    getUserProfile 
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.use(verifyToken);

router.get("/profile", getUserProfile);
router.put("/profile", upload.single('profilePicture'), updateUserProfile);
router.put("/password", updatePassword);
router.put("/2fa", toggleTwoFactorAuth);

export default router;