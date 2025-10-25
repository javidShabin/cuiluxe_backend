export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((val) => val.message);
    message = errors.join(", ");
  }

  // Mongoose Cast Error (Invalid ObjectId)
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate Key Error (MongoDB unique field)
  else if (err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue);
    message = `Duplicate value entered for ${field}: ${err.keyValue[field]}`;
  }

  // Custom API Error (thrown manually)
  else if (err.isOperational) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Fallback: Unknown / unhandled errors
  else {
    console.error("Unhandled Error:", err);
  }

  // Response in JSON format
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
