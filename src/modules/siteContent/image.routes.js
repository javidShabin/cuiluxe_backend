import { Router } from "express";
import upload from "../../middlewares/multer.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  uploadComponentImages,
  listComponentImages,
  replaceImage,
} from "./image.controller.js";

const router = Router();

// Public: list images for a component
router.get("/:componentName/images", listComponentImages);

// Protected: upload images for a component (multiple)
router.post(
  "/:componentName/images",
  authMiddleware,
  upload.array("images", 10),
  uploadComponentImages
);

// Protected: replace an existing image by id
router.put(
  "/:componentName/images/:imageId",
  authMiddleware,
  upload.single("image"),
  replaceImage
);

export default router;


