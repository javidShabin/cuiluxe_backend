import mongoose, { Schema, model } from "mongoose";

const CartSchema = new Schema(
  {
    label: {
      type: String,
      default: "Hello world",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
          index: true, // Index for faster product lookups
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        itemName: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    totalPrice: { 
      type: Number, 
      required: true, 
      min: 0,
      index: true, // Index for sorting/filtering by total
    },
  },

  { timestamps: true }
);

// Compound index for faster item lookups
CartSchema.index({ "items.productId": 1 });

const Cart = model("Cart", CartSchema);
export default Cart;
