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
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        itemName: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    totalPrice: { type: Number, required: true, min: 0 },
  },

  { timestamps: true }
);

const Cart = model("Cart", CartSchema);
export default Cart;
