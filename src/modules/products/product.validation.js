import { AppError } from "../../utils/AppError.js";

export const validateAddProduct = (data) => {
  const { title, sku, price, category, types, description } = data;

  if (!title || typeof title !== "string" || title.trim().length === 0)
    throw new AppError("Title is required and must be a non-empty string", 400);

  if (!sku || typeof sku !== "string" || sku.trim().length === 0)
    throw new AppError("SKU (product code) is required and must be a non-empty string", 400);

  if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0)
    throw new AppError("Price is required and must be a non-negative number", 400);

  if (!types) throw new AppError("Type is required", 400);

  if (!category || typeof category !== "string" || category.trim().length === 0)
    throw new AppError("Category is required and must be a non-empty string", 400);
  if (!description || typeof description !== "string"|| description.trim().length === 0) {
    throw new AppError("Description is required and must be a non-empty string", 400);
  }
}