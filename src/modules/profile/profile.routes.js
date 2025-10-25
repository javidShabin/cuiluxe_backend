import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {  getUserProfile, updatePassowrd, updatePasswordOtp } from "./profile.controller.js";
import upload from "../../middlewares/multer.js";
const router = Router();

router.get("/user-profile", authMiddleware, getUserProfile);
router.post("/update-password-otp", updatePasswordOtp)
router.put("/confirm-update-password", updatePassowrd)

export default router;
