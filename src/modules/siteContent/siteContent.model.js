import mongoose, { Schema, model } from "mongoose";

const SiteContentSchema = new Schema(
  {
    section: {
      type: String,
      required: true,
      enum: ["showWork", "about", "productType", "services"],
      unique: true,
      index: true, // Index for faster section lookups
    },
    images: [
      {
        id: { type: String, required: true, index: true }, // Index for faster image lookups
        src: { type: String, required: true },
        alt: { type: String, default: "" },
        label: { type: String, default: "" },
        gridClasses: { type: String, default: "" },
        height: { type: String, default: "" },
        order: { type: Number, default: 0, index: true }, // Index for sorting
      },
    ],
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const SiteContent = model("SiteContent", SiteContentSchema);

export default SiteContent;

