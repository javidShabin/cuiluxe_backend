import {
  getAllSiteContentService,
  getSiteContentBySectionService,
  upsertSiteContentService,
  deleteImageFromSiteContentService,
  deleteSiteContentService,
} from "./siteContent.service.js";

// Get all site content
export const getAllSiteContent = async (req, res, next) => {
  try {
    const result = await getAllSiteContentService();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Get site content by section
export const getSiteContentBySection = async (req, res, next) => {
  try {
    const { section } = req.params;
    const result = await getSiteContentBySectionService(section);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Create or update site content
export const upsertSiteContent = async (req, res, next) => {
  try {
    const { section } = req.params;
    const result = await upsertSiteContentService(
      section,
      req.body,
      req.files
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Delete image from site content
export const deleteImageFromSiteContent = async (req, res, next) => {
  try {
    const { section, imageId } = req.params;
    const result = await deleteImageFromSiteContentService(section, imageId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Delete entire site content section
export const deleteSiteContent = async (req, res, next) => {
  try {
    const { section } = req.params;
    const result = await deleteSiteContentService(section);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

