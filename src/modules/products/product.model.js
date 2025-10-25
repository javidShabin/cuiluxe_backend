import mongoose, { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    images: [{ type: String, required: true }],
    sku: {
      type: String,
      required: true
    },
    types: {
      type: String,
      enum: ["kitchen essentials & cookware", "dining & serveware", "appliances & other needs"]
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
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

const Product = model("Product", ProductSchema);

export default Product;
