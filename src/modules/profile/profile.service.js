import { AppError } from "../../utils/AppError.js";
import { sendOtpEmail } from "../../utils/email.js";
import { hashPassword } from "../../utils/hash.js";
import User from "../authentication/auth.model.js";
import TempUser from "../authentication/auth.temp.model.js";

export const userProfileService = async ({ id }) => {
  try {
    // Find the user by id
    const isUser = await User.findById(id).select("-password");
    if (!isUser) throw new AppError("User not found", 404);

    return { message: "User profile fetched successfully", data: isUser };
  } catch (error) {
    throw error;
  }
};

export const updatePasswordOtpService = async ({ email }) => {
  try {
    const existingUser = await User.findOne({ email })
    if (!existingUser) throw AppError("User not exist in this mail", 400)

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await TempUser.findOneAndUpdate(
      { email },
      { email, otp, otpExpires },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp);

    return { message: "OTP sent successfully to email", otpExpires };
  } catch (error) {
    throw error
  }
}

export const updatePassowrdService = async (data) => {
  try {
    const { email, otp, password, confirmPassword } = data
    if (!email || !otp || !password || !confirmPassword) {
      throw new AppError("All fields are required", 400);
    }

    // Confirm both passwords match
    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    // Find OTP record
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      throw new AppError("No OTP found for this email", 400);
    }

    // Check OTP validity
    if (tempUser.otp !== otp) {
      throw new AppError("Invalid OTP", 400);
    }

    if (tempUser.otpExpires < Date.now()) {
      throw new AppError("OTP expired", 400);
    }

    // Find main user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    await user.save();

    // Remove used OTP record
    await TempUser.deleteOne({ email });

    // Return success
    return { message: "Password updated successfully" };
  } catch (error) {
    throw error;
  }
}