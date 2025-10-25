export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // so our handler knows it’s custom
    Error.captureStackTrace(this, this.constructor);
  }
}