import cloudinary from "../../configs/cloudinary.js";
import { AppError } from "../../utils/AppError.js";
import Product from "./product.model.js";
import { validateAddProduct } from "./product.validation.js";

// Add product service
export const addProductService = async (data, files) => {
  validateAddProduct(data);
  const { title, sku, price, category, types, description, isPackage } = data;

  let uploadedImages = [];

  // Parallelize image uploads for better performance
  if (files && files.length > 0) {
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
    });

    try {
      const results = await Promise.all(uploadPromises);
      uploadedImages = results.map((result) => result.secure_url);
    } catch (error) {
      throw new AppError("Image upload failed", 500);
    }
  }

  const newProduct = new Product({
    title,
    sku,
    price,
    category,
    types,
    description,
    isPackage: isPackage === 'true' || isPackage === true,
    images: uploadedImages,
  });

  await newProduct.save();
  return { message: "New product added", newProduct };
};
// Get all product list service with pagination - optimized with parallel queries and lean()
export const getAllProductsService = async (page = 1, limit = 20) => {
  try {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Use Promise.all to run queries in parallel for better performance
    const [products, totalProducts] = await Promise.all([
      Product.find()
        .select("title images price category types sku description isPackage createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(), // Use lean() for faster queries (returns plain JS objects)
      Product.countDocuments()
    ]);

    const totalPages = Math.ceil(totalProducts / limitNum);

    return {
      products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum
      }
    };
  } catch (error) {
    throw error;
  }
};


// Update Product details
export const updateProductService = async (id, data, files) => {

  const product = await Product.findById(id);
  if (!product) throw new AppError("Product not found", 404);

  const { title, sku, price, category, types, description, existingImages, isPackage } = data;

  if (title !== undefined) product.title = title;
  if (sku !== undefined) product.sku = sku;
  if (price !== undefined) product.price = price;
  if (category !== undefined) product.category = category;
  if (types !== undefined) product.types = types;
  if (description !== undefined) product.description = description;
  if (isPackage !== undefined) {
    // Handle boolean coming as string from multipart forms
    product.isPackage = isPackage === 'true' || isPackage === true;
  }

  // 1) Upload new files to Cloudinary in parallel for better performance
  const uploadedUrls = [];
  if (files && files.length > 0) {
    const validFiles = files.filter(file => file && file.buffer);
    
    if (validFiles.length > 0) {
      const uploadPromises = validFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
      });

      try {
        const results = await Promise.all(uploadPromises);
        uploadedUrls.push(...results.map(result => result.secure_url));
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        throw new AppError("Image upload failed", 500);
      }
    }
  }

  // 2) Parse existingImages sent from frontend
  let parsedExisting = [];
  if (existingImages) {
    try {
      parsedExisting = JSON.parse(existingImages);
      if (!Array.isArray(parsedExisting)) parsedExisting = [];
    } catch (e) {
      console.warn("Could not parse existingImages:", e.message);
      parsedExisting = [];
    }
  }

  // 3) Handle image replacement logic
  if (parsedExisting.length === 0 && uploadedUrls.length === 0) {
   
  } else {
    // Start with current images if no existingImages provided
    if (parsedExisting.length === 0 && product.images && product.images.length > 0) {
      parsedExisting = [...product.images];
    }

    // Ensure we have a 5-slot array
    while (parsedExisting.length < 5) {
      parsedExisting.push(null);
    }

    // Replace null slots with new uploaded images
    let uploadIndex = 0;
    for (let i = 0; i < parsedExisting.length && uploadIndex < uploadedUrls.length; i++) {
      if (parsedExisting[i] === null) {
        parsedExisting[i] = uploadedUrls[uploadIndex++];
      }
    }

    // Add any remaining uploaded images
    while (uploadIndex < uploadedUrls.length) {
      parsedExisting.push(uploadedUrls[uploadIndex++]);
    }

    // Filter out null values and update product
    product.images = parsedExisting.filter(img => img !== null);
  }

  await product.save();
  return { message: "Product updated successfully", product };
};


// Delete product
export const deleteProductService = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError("Product not found", 404);

  await Product.findByIdAndDelete(id);
  return { message: "Product deleted successfully" };
};

// filter by category - optimized with parallel queries and fixed select syntax
export const getProductByCategoryService = async (category, type, page = 1, limit = 20) => {
  const filter = {};
  if (category) filter.category = category;
  if (type) filter.types = type;

  const skip = (page - 1) * limit;

  // Run queries in parallel for better performance
  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .select("title images price category types sku description") // Fixed: removed comma
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter)
  ]);

  return {
    products,
    pagination: {
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      itemsPerPage: limit,
    },
  };
};


export const getProductsByTypeService = async (type, page = 1, limit = 20) => {
  if (!type) throw new AppError("Type is required", 400);

  const skip = (page - 1) * limit;

  try {
    // Run queries in parallel and fix select syntax
    const [products, totalProducts] = await Promise.all([
      Product.find({ types: type })
        .select("title images price category types sku description") // Fixed: removed comma
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments({ types: type })
    ]);

    return {
      products,
      pagination: {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getProductByIdService = async (productId) => {
  try {
    const product = await Product.findById(productId).lean(); // Use lean() for faster queries
    return product;
  } catch (error) {
    throw new AppError("Invalid product ID", 400);
  }
};

export const getProductsByPackageService = async (page = 1, limit = 20) => {
  try {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Run queries in parallel for better performance
    const [products, totalProducts] = await Promise.all([
      Product.find({ isPackage: true })
        .select("title images price category types sku description isPackage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments({ isPackage: true })
    ]);

    const totalPages = Math.ceil(totalProducts / limitNum);

    return {
      products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum
      }
    };
  } catch (error) {
    throw error;
  }
};

// Get product metadata (types and categories) - optimized to avoid fetching all products
export const getProductMetadataService = async (isPackage = null) => {
  try {
    const filter = isPackage !== null ? { isPackage } : {};
    
    // Use aggregation pipeline for efficient metadata extraction
    const metadata = await Product.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          types: { $addToSet: "$types" },
          categories: { $addToSet: { type: "$types", category: "$category" } }
        }
      },
      {
        $project: {
          _id: 0,
          types: { $filter: { input: "$types", as: "type", cond: { $ne: ["$$type", null] } } },
          categories: 1
        }
      }
    ]);

    if (metadata.length === 0) {
      return { types: [], categories: [] };
    }

    return {
      types: metadata[0].types || [],
      categories: metadata[0].categories || []
    };
  } catch (error) {
    throw error;
  }
};