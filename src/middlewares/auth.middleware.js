import { verifyToken } from "../utils/token.js";
import { AppError } from "../utils/AppError.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies?.userToken ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return next(new AppError("Not authorized, token missing", 401));
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new AppError("Invalid or expired token", 401));
    }
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
