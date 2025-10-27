import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getAllProductsbyCategory,
  getProductById,
  getProductsByPackage,
  getProductsByTypeController,
  updateProduct,
} from "./product.controller.js";
import upload from "../../middlewares/multer.js";

const router = Router();

router.post("/add-product", upload.array("images", 5), addProduct);
router.get("/get-all-products", getAllProducts);
router.put("/update-product/:id", upload.any(), updateProduct);
router.delete("/delete-product/:id", deleteProduct);
router.get("/filter-product", getAllProductsbyCategory);
router.get("/filter-type", getProductsByTypeController);
router.get("/get-package-products", getProductsByPackage);
router.get("/single-product/:id", getProductById)

export default router;
