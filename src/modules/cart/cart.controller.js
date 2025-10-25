import {
  addToCartService,
  deleteCartItemService,
  getCartService,
  updateCartService,
} from "./cart.service.js";

export const addToCart = async (req, res, next) => {
  try {
    const result = await addToCartService(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await getCartService();
    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const cart = await updateCartService(req.body);
    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCartItem = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const cart = await deleteCartItemService(productId);
    res.status(200).json({
      success: true,
      message: "Item deleted from cart successfully",
      cart,
    });
  } catch (err) {
    next(err);
  }
};
