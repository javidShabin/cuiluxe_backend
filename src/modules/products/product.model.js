import mongoose, { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true, // Index for search/filter operations
    },
    images: [{ type: String, required: true }],
    sku: {
      type: String,
      required: true,
      unique: false, // Ensure unique SKU
      index: true, // Index for quick lookups
    },
    types: {
      type: String,
      enum: ["kitchen essentials & cookware", "dining & serveware", "appliances & other needs"],
      index: true, // Index for filtering by type
    },
    price: {
      type: Number,
      required: true,
      index: true, // Index for price sorting/filtering
    },
    isPackage: {
      type: Boolean,
      default: false,
      index: true, // Index for package filtering
    },
    category: {
      type: String,
      required: true,
      index: true, // Index for category filtering
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common query patterns
ProductSchema.index({ category: 1, types: 1 }); // For category + type filtering
ProductSchema.index({ isPackage: 1, createdAt: -1 }); // For package products with sorting
ProductSchema.index({ types: 1, createdAt: -1 }); // For type filtering with sorting
ProductSchema.index({ category: 1, types: 1, createdAt: -1 }); // For combined filters with sorting

const Product = model("Product", ProductSchema);

export default Product;
