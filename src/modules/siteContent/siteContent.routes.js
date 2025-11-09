import { Router } from "express";
import {
  getAllSiteContent,
  getSiteContentBySection,
  upsertSiteContent,
  deleteImageFromSiteContent,
  deleteSiteContent,
} from "./siteContent.controller.js";
import upload from "../../middlewares/multer.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/get-all", getAllSiteContent);
router.get("/get-by-section/:section", getSiteContentBySection);

// Protected routes (admin only)
router.post(
  "/upsert/:section",
  authMiddleware,
  upload.array("images", 20),
  upsertSiteContent
);
router.delete(
  "/delete-image/:section/:imageId",
  authMiddleware,
  deleteImageFromSiteContent
);
router.delete("/delete/:section", authMiddleware, deleteSiteContent);

export default router;

