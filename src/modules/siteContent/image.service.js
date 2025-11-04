import cloudinary from "../../configs/cloudinary.js";
import { SiteImage } from "./image.model.js";

const uploadBufferToCloudinary = (buffer, folder = "site-content") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const ImageService = {
  async uploadImages(componentName, files, titles) {
    const uploads = await Promise.all(
      files.map(async (file, index) => {
        const res = await uploadBufferToCloudinary(file.buffer, `site-content/${componentName}`);
        const doc = await SiteImage.create({
          componentName,
          title: Array.isArray(titles) ? titles[index] : titles,
          imageUrl: res.secure_url,
          publicId: res.public_id,
        });
        return doc;
      })
    );
    return uploads;
  },

  async listImages(componentName) {
    const images = await SiteImage.find({ componentName }).sort({ createdAt: -1 });
    return images;
  },

  async replaceImage(imageId, file, title) {
    const existing = await SiteImage.findById(imageId);
    if (!existing) return null;

    const uploaded = await uploadBufferToCloudinary(file.buffer, `site-content/${existing.componentName}`);

    // delete old asset (best-effort)
    if (existing.publicId) {
      try { await cloudinary.uploader.destroy(existing.publicId); } catch (_) {}
    }

    existing.imageUrl = uploaded.secure_url;
    existing.publicId = uploaded.public_id;
    if (typeof title === "string") existing.title = title;
    await existing.save();
    return existing;
  },
};


