// src/utils/messages.js

export const messages = {
  AUTH: {
    INVALID_TOKEN: "Invalid or expired token.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    LOGIN_FAILED: "Invalid email or password.",
    REGISTER_SUCCESS: "Account created successfully.",
    EMAIL_EXISTS: "Email already exists.",
    ACCOUNT_BLOCKED: "Your account has been blocked. Contact support.",
  },

  USER: {
    NOT_FOUND: "User not found.",
    UPDATED: "User updated successfully.",
    DELETED: "User deleted successfully.",
    ALREADY_EXISTS: "User already exists.",
  },

  PRODUCT: {
    NOT_FOUND: "Product not found.",
    CREATED: "Product created successfully.",
    UPDATED: "Product updated successfully.",
    DELETED: "Product deleted successfully.",
  },

  ORDER: {
    CREATED: "Order placed successfully.",
    NOT_FOUND: "Order not found.",
    STATUS_UPDATED: "Order status updated.",
  },

  CART: {
    ITEM_ADDED: "Item added to cart.",
    ITEM_REMOVED: "Item removed from cart.",
    EMPTY: "Your cart is empty.",
  },

  GENERAL: {
    SERVER_ERROR: "Something went wrong, please try again later.",
    NOT_FOUND: "Resource not found.",
    VALIDATION_ERROR: "Validation failed, please check your inputs.",
    SUCCESS: "Operation completed successfully.",
    ALL_FIELDS_REQUIRED: "All fields are required"
    
  },
};
