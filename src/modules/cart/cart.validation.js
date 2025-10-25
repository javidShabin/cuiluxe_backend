import mongoose from "mongoose";
import { AppError } from "../../utils/AppError.js";

export const validateAddToCart = (data) => {
  const { items } = data;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError("Items array is required", 400);
  }

  for (const item of items) {
    const { productId, quantity, price, itemName, image } = item;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError("Invalid or missing productId", 400);
    }

    if (!quantity || quantity < 1) {
      throw new AppError("Quantity must be at least 1", 400);
    }

    if (price == null || price < 0) {
      throw new AppError("Price must be greater than or equal to 0", 400);
    }

    if (!itemName || typeof itemName !== "string" || !itemName.trim()) {
      throw new AppError("Item name is required", 400);
    }

    if (!image || typeof image !== "string" || !image.trim()) {
      throw new AppError("Item image URL is required", 400);
    }
  }
};
