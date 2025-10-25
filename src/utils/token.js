import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = "7d";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // return null if invalid/expired
  }
};
