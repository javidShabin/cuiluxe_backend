import { updatePassowrdService, updatePasswordOtpService, userProfileService } from "./profile.service.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.user;

    // Pass the id as an object since service expects { id }
    const result = await userProfileService(id);

    // Correct JSON response format
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};


export const updateProfile = async (req, res, next) => {
  try {
  } catch (error) { }
};

export const getAllUsers = async (req, res, next) => {
  try {
  } catch (error) { }
};

export const updatePasswordOtp = async (req, res, next) => {
  try {
    const result = await updatePasswordOtpService(req.body)
    res.status(201).json(result);
  } catch (error) {
    // Forward error to error-handling middleware
    next(error);
  }
}

export const updatePassowrd = async (req, res, next) => {
  try {
    const result = await updatePassowrdService(req.body)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
