import {
  loginService,
  signupService,
  verifyOtpService,
} from "./auth.service.js";

// =========================
// 🧾 USER SIGNUP CONTROLLER
// =========================
export const userSignup = async (req, res, next) => {
  try {
    // Call the signup service with request body
    const result = await signupService(req.body);

    // Send success response with created status
    res.status(201).json(result);
  } catch (error) {
    // Forward error to error-handling middleware
    next(error);
  }
};

// ==========================
// 🔐 VERIFY OTP CONTROLLER
// ==========================
export const verifyOtp = async (req, res, next) => {
  try {
    // Verify user OTP using the service
    const result = await verifyOtpService(req.body);

    // ✅ Set authentication token in cookie after successful OTP verification
    res.cookie("userToken", result.token, {
      httpOnly: true,        // Prevent client-side JavaScript access
      secure: false,         // Set to true in production (HTTPS)
      sameSite: "strict",    // Protect against CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiry: 7 days
    });

    // Send success response
    res.status(200).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

// ==========================
// 🔑 USER LOGIN CONTROLLER
// ==========================
export const userLogin = async (req, res, next) => {
  try {
    // Authenticate user credentials via login service
    const result = await loginService(req.body);

    // ✅ Set authentication token in cookie after successful login
    res.cookie("userToken", result.token, {
      httpOnly: true,        // Prevent client-side access to cookie
      secure: true,         // Should be true in production (HTTPS)
      sameSite: "none",    // Prevent cross-site request issues
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 days
    });

    // Send success message
    res.status(200).json({ message: result.message, user: result.isUser.email });
  } catch (error) {
    next(error);
  }
};

// ==========================
// 🚪 USER LOGOUT CONTROLLER
// ==========================
export const userLogout = async (req, res, next) => {
  try {
    // ❌ Clear the token cookie to log the user out
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: "strict",
    });

    // Send logout success message
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};
