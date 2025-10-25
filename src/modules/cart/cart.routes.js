import { Router } from "express";
import {
  addToCart,
  deleteCartItem,
  getCart,
  updateCart,
} from "./cart.controller.js";

const router = Router();

router.post("/add-to-cart", addToCart);
router.get("/get-cart", getCart);
router.put("/update-cart", updateCart);
router.delete("/remove-item", deleteCartItem);

export default router;
