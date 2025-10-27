import {
  addProductService,
  deleteProductService,
  getAllProductsService,
  getProductByCategoryService,
  getProductByIdService,
  getProductsByPackageService,
  getProductsByTypeService,
  updateProductService,
} from "./product.service.js";

// Add product with details
export const addProduct = async (req, res, next) => {
  try {
    const result = await addProductService(req.body, req.files);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Get all products
export const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await getAllProductsService(page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// update a product
export const updateProduct = async (req, res, next) => {
  try {
    const result = await updateProductService(
      req.params.id,
      req.body,
      req.files
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Delete a product
export const deleteProduct = async (req, res, next) => {
  try {
    const result = await deleteProductService(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllProductsbyCategory = async (req, res, next) => {
  try {
    const { category, type, page, limit } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;

    const data = await getProductByCategoryService(category, type, pageNum, limitNum);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getProductsByTypeController = async (req, res, next) => {
  try {
    const { type, page, limit } = req.query;

    if (!type) return res.status(400).json({ message: "Type is required" });

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;

    const data = await getProductsByTypeService(type, pageNum, limitNum);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    // If using route param: /product/:id
    const { id } = req.params; 

    const product = await getProductByIdService(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const getProductsByPackage = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await getProductsByPackageService(page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
