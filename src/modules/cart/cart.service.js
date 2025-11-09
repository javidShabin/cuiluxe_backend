import Cart from "./cart.model.js";
import { AppError } from "../../utils/AppError.js";
import { validateAddToCart } from "./cart.validation.js";
import mongoose from "mongoose";

// Helper function to calculate total price - optimized
const calculateTotalPrice = (items) => {
  return items.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0);
};

export const addToCartService = async (data) => {
  // Validate input
  validateAddToCart(data);

  const { items } = data;

  // Find existing cart - optimized with select (no lean() needed for updates)
  let cart = await Cart.findOne()
    .select("items totalPrice");

  // Calculate new items total
  const newItemsTotal = calculateTotalPrice(items);

  if (!cart) {
    // Create new cart
    const newCart = await Cart.create({
      items,
      totalPrice: newItemsTotal,
    });
    return newCart;
  }

  // Prevent duplicates - optimized with Set for O(1) lookup
  const existingIdsSet = new Set(
    cart.items.map((i) => i.productId.toString())
  );
  const newFilteredItems = items.filter(
    (i) => !existingIdsSet.has(i.productId.toString())
  );

  if (newFilteredItems.length === 0) {
    throw new AppError("item already exist in the cart", 400);
  }

  // Add new items and recalculate total - optimized
  cart.items.push(...newFilteredItems);
  cart.totalPrice = calculateTotalPrice(cart.items);

  await cart.save();

  return cart;
};

export const getCartService = async () => {
  // Find the cart - optimized with select and lean
  const cart = await Cart.findOne()
    .select("items totalPrice createdAt updatedAt")
    .populate("items.productId", "title sku category") // Populate product details
    .lean(); // Use lean() for faster queries

  if (!cart) {
    throw new AppError("Cart is empty or not found", 404);
  }

  // Recalculate total price to ensure accuracy - optimized
  const totalPrice = calculateTotalPrice(cart.items);

  // Return clean response
  return {
    _id: cart._id,
    items: cart.items,
    totalPrice,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
};

export const updateCartService = async (data) => {
  const { productId, action } = data; // action can be "increase" or "decrease"

  if (!productId || !action) {
    throw new AppError("Product ID and action are required", 400);
  }

  if (action !== "increase" && action !== "decrease") {
    throw new AppError("Invalid action type. Use 'increase' or 'decrease'.", 400);
  }

  // Find cart - optimized with select
  const cart = await Cart.findOne()
    .select("items totalPrice");

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  // Find item in cart - optimized
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    throw new AppError("Item not found in cart", 404);
  }

  const item = cart.items[itemIndex];

  // Update quantity
  if (action === "increase") {
    item.quantity += 1;
  } else if (action === "decrease") {
    item.quantity -= 1;

    // If quantity <= 0, remove item
    if (item.quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }
  }

  // Recalculate total price - optimized
  cart.totalPrice = calculateTotalPrice(cart.items);

  await cart.save();

  return cart;
};

export const deleteCartItemService = async (productId) => {
  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }

  // Find cart - optimized with select
  const cart = await Cart.findOne()
    .select("items totalPrice");

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  // Find item index - optimized
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    throw new AppError("Item not found in cart", 404);
  }

  // Remove item
  cart.items.splice(itemIndex, 1);

  // Recalculate total price - optimized
  cart.totalPrice = calculateTotalPrice(cart.items);

  await cart.save();

  return cart;
};
