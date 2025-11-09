import cloudinary from "../../configs/cloudinary.js";
import { AppError } from "../../utils/AppError.js";
import SiteContent from "./siteContent.model.js";

// Get all site content
export const getAllSiteContentService = async () => {
  try {
    const contents = await SiteContent.find().sort({ createdAt: -1 });
    return { contents };
  } catch (error) {
    throw error;
  }
};

// Get site content by section
export const getSiteContentBySectionService = async (section) => {
  try {
    const content = await SiteContent.findOne({ section });
    if (!content) {
      // Return empty structure if not found
      return {
        section,
        images: [],
        metadata: {},
      };
    }
    return content;
  } catch (error) {
    throw error;
  }
};

// Create or update site content
export const upsertSiteContentService = async (section, data, files) => {
  try {
    const { images, metadata } = data;

    // Find existing content
    let content = await SiteContent.findOne({ section });

    // Handle image uploads
    const uploadedImages = [];
    if (files && files.length > 0) {
      for (const file of files) {
        if (file && file.buffer) {
          try {
            const result = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: `site-content/${section}` },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              stream.end(file.buffer);
            });
            uploadedImages.push(result.secure_url);
          } catch (err) {
            console.error("Cloudinary upload failed:", err);
            throw new AppError("Image upload failed", 500);
          }
        }
      }
    }

    // Parse images data if it's a string
    let parsedImages = [];
    if (images) {
      try {
        parsedImages = typeof images === "string" ? JSON.parse(images) : images;
        if (!Array.isArray(parsedImages)) parsedImages = [];
      } catch (e) {
        console.warn("Could not parse images:", e.message);
        parsedImages = [];
      }
    }

    // Map uploaded images to image objects
    let uploadIndex = 0;
    const processedImages = parsedImages.map((img, index) => {
      // If image has a new file (marked by fileIndex), use uploaded URL
      if (img.fileIndex !== undefined && uploadedImages[img.fileIndex] !== undefined) {
        const result = {
          ...img,
          src: uploadedImages[img.fileIndex],
        };
        delete result.fileIndex; // Remove temporary field
        uploadIndex++;
        return result;
      }
      return img;
    });

    // Add any remaining uploaded images as new entries
    while (uploadIndex < uploadedImages.length) {
      // New image not mapped to existing entry
      processedImages.push({
        id: `img-${Date.now()}-${uploadIndex}`,
        src: uploadedImages[uploadIndex],
        alt: "",
        label: "",
        gridClasses: "",
        height: "",
        order: processedImages.length,
      });
      uploadIndex++;
    }

    // Parse metadata if it's a string
    let parsedMetadata = {};
    if (metadata) {
      try {
        parsedMetadata =
          typeof metadata === "string" ? JSON.parse(metadata) : metadata;
      } catch (e) {
        console.warn("Could not parse metadata:", e.message);
        parsedMetadata = {};
      }
    }

    if (content) {
      // Update existing
      content.images = processedImages;
      if (Object.keys(parsedMetadata).length > 0) {
        content.metadata = { ...content.metadata, ...parsedMetadata };
      }
      await content.save();
      return { message: "Site content updated successfully", content };
    } else {
      // Create new
      content = new SiteContent({
        section,
        images: processedImages,
        metadata: parsedMetadata,
      });
      await content.save();
      return { message: "Site content created successfully", content };
    }
  } catch (error) {
    throw error;
  }
};

// Delete image from site content
export const deleteImageFromSiteContentService = async (
  section,
  imageId
) => {
  try {
    const content = await SiteContent.findOne({ section });
    if (!content) {
      throw new AppError("Site content not found", 404);
    }

    // Extract public_id from Cloudinary URL for deletion
    const imageToDelete = content.images.find((img) => img.id === imageId);
    if (imageToDelete && imageToDelete.src) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = imageToDelete.src.split("/");
        const publicIdWithExt = urlParts
          .slice(urlParts.indexOf("site-content"))
          .join("/")
          .replace(/\.[^/.]+$/, ""); // Remove extension

        await cloudinary.uploader.destroy(publicIdWithExt);
      } catch (err) {
        console.warn("Failed to delete from Cloudinary:", err);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    content.images = content.images.filter((img) => img.id !== imageId);
    await content.save();

    return { message: "Image deleted successfully", content };
  } catch (error) {
    throw error;
  }
};

// Delete entire site content section
export const deleteSiteContentService = async (section) => {
  try {
    const content = await SiteContent.findOne({ section });
    if (!content) {
      throw new AppError("Site content not found", 404);
    }

    // Delete all images from Cloudinary
    for (const img of content.images) {
      if (img.src) {
        try {
          const urlParts = img.src.split("/");
          const publicIdWithExt = urlParts
            .slice(urlParts.indexOf("site-content"))
            .join("/")
            .replace(/\.[^/.]+$/, "");

          await cloudinary.uploader.destroy(publicIdWithExt);
        } catch (err) {
          console.warn("Failed to delete from Cloudinary:", err);
        }
      }
    }

    await SiteContent.findOneAndDelete({ section });
    return { message: "Site content deleted successfully" };
  } catch (error) {
    throw error;
  }
};

