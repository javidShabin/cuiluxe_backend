import { ImageService } from "./image.service.js";
import { AppError } from "../../utils/AppError.js";

export const uploadComponentImages = async (req, res, next) => {
  try {
    const { componentName } = req.params;
    const titles = req.body?.title || req.body?.titles;
    if (!req.files || req.files.length === 0) {
      return next(new AppError("No files uploaded", 400));
    }
    const images = await ImageService.uploadImages(componentName, req.files, titles);
    res.status(201).json({ status: "success", data: images });
  } catch (error) {
    next(error);
  }
};

export const listComponentImages = async (req, res, next) => {
  try {
    const { componentName } = req.params;
    const images = await ImageService.listImages(componentName);
    res.json({ status: "success", data: images });
  } catch (error) {
    next(error);
  }
};

export const replaceImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;
    if (!req.file) {
      return next(new AppError("No file uploaded", 400));
    }
    const updated = await ImageService.replaceImage(imageId, req.file, req.body?.title);
    if (!updated) return next(new AppError("Image not found", 404));
    res.json({ status: "success", data: updated });
  } catch (error) {
    next(error);
  }
};


