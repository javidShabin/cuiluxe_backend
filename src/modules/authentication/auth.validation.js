import { AppError } from "../../utils/AppError.js";

// ========================================
// 📝 SIGNUP VALIDATION — Validates user signup data
// ========================================
export const validateSignup = (data) => {
  // Step 1: Destructure required user details from data
  const { name, email, password, phone, confirmPassword } = data;

  // Step 2: Check if all required fields are provided
  if (!name || !email || !password || !confirmPassword || !phone) {
    throw new AppError("All fields are required", 400);
  }

  // Step 3: Check if password and confirm password match
  if (password !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }

  // Step 4: Enforce password length policy
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }
};

// ========================================
// 🔐 OTP VALIDATION — Validates OTP and email input
// ========================================
export const validateOTP = (data) => {
  // Step 1: Destructure OTP and email from data
  const { email, otp } = data;

  // Step 2: Ensure both email and OTP are provided
  if (!email || !otp) {
    throw new AppError("OTP and email is required", 400);
  }

  // Step 3: Validate email format
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  // Step 4: Ensure OTP is 6 digits
  if (otp.length < 6) {
    throw new AppError("OTP must have 6 numbers", 400);
  }
};

// ========================================
// 🔑 LOGIN VALIDATION — Validates login credentials
// ========================================
export const validateLogin = (data) => {
  // Step 1: Destructure email and password from data
  const { email, password } = data;

  // Step 2: Ensure both email and password are provided
  if (!email || !password) {
    throw new AppError("Email and password is required", 400);
  }

  // Step 3: Enforce minimum password length
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }
};
