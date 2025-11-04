import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    componentName: {
      type: String,
      required: true,
      index: true,
      enum: ["hero", "about", "services", "productType", "showWork"],
    },
    title: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const SiteImage = mongoose.model("SiteImage", imageSchema);


