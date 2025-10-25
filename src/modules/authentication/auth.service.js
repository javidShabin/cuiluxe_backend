import { AppError } from "../../utils/AppError.js";
import { sendOtpEmail } from "../../utils/email.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";
import { generateToken } from "../../utils/token.js";
import User from "./auth.model.js";
import TempUser from "./auth.temp.model.js";
import {
  validateLogin,
  validateOTP,
  validateSignup,
} from "./auth.validation.js";

// ========================================
// 📝 SIGNUP SERVICE — Handles user registration & OTP generation
// ========================================
export const signupService = async (data) => {
  try {
    // Step 1: Validate signup data
    validateSignup(data);
    const { name, email, password, phone, address, role } = data;

    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError("Email already registered", 400);

    // Step 3: Hash the password before saving
    const hashedPassword = await hashPassword(password);

    // Step 4: Generate a 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Step 5: Set OTP expiry time (10 minutes)
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Step 6: Store user temporarily in TempUser collection
    const tempUser = await TempUser.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      otp,
      otpExpires,
      role,
    });

    // Step 7: Send OTP to user’s email
    await sendOtpEmail(email, otp);

    // Step 8: Return success response
    return { message: "OTP sent successfully", tempUserId: tempUser.email };
  } catch (error) {
    throw error;
  }
};

// ========================================
// 🔐 VERIFY OTP SERVICE — Confirms OTP & creates permanent user
// ========================================
export const verifyOtpService = async (data) => {
  try {
    // Step 1: Validate input data
    validateOTP(data);

    // Step 2: Extract OTP and email
    const { otp, email } = data;

    // Step 3: Find temporary user by email
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) throw new AppError("User not found", 400);

    // Step 4: Compare provided OTP with stored OTP
    if (tempUser.otp !== otp) throw new AppError("Invalid OTP", 400);

    // Step 5: Check if OTP has expired
    if (tempUser.otpExpires.getTime() < Date.now()) {
      throw new AppError("OTP has expired", 400);
    }

    // Step 6: Create a new permanent user in the main User collection
    const newUser = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      phone: tempUser.phone,
      role: tempUser.role,
      avatar: tempUser.avatar,
    });
    await newUser.save();

    // Step 7: Generate JWT token for the new user
    const token = generateToken({ id: newUser.id });

    // Step 8: Remove temp user after successful verification
    await TempUser.deleteOne({ email });

    // Step 9: Return token and success message
    return { message: "Account created successfully", token };
  } catch (error) {
    throw error;
  }
};

// ========================================
// 🔑 LOGIN SERVICE — Authenticates existing users
// ========================================
export const loginService = async (data) => {
  try {
    // Step 1: Validate login data
    validateLogin(data);

    // Step 2: Extract credentials
    const { email, password } = data;

    // Step 3: Check if user exists
    const isUser = await User.findOne({ email });
    if (!isUser) throw new AppError("User does not exist with this email", 400);

    // Step 4: Compare entered password with hashed password
    const isMatch = await comparePassword(password, isUser.password);
    if (!isMatch) throw new AppError("Invalid password", 401);

    // Step 5: Generate JWT token for authenticated user
    const token = generateToken({ id: isUser.id });

    // Step 6: Return success message and token
    return { message: "User logged in successfully", token, isUser };
  } catch (error) {
    throw error;
  }
};
