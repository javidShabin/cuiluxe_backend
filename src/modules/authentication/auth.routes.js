import { Router } from "express";
import {
  userLogin,
  userLogout,
  userSignup,
  verifyOtp,
} from "./auth.controller.js";

// ==========================================
// 🧭 AUTH ROUTER — Handles all auth-related routes
// ==========================================
const router = Router();

// ============================
// 📝 USER SIGNUP (Register)
// Route: POST /user-signup
// Description: Registers a new user and sends OTP to email
// ============================
router.post("/user-signup", userSignup);

// ============================
// 🔐 VERIFY OTP
// Route: POST /verify-otp
// Description: Verifies OTP and sets user authentication cookie
// ============================
router.post("/verify-otp", verifyOtp);

// ============================
// 🔑 USER LOGIN
// Route: POST /user-login
// Description: Authenticates user and sets token cookie
// ============================
router.post("/user-login", userLogin);

// ============================
// 🚪 USER LOGOUT
// Route: DELETE /user-logout
// Description: Clears the authentication cookie and logs out user
// ============================
router.delete("/user-logout", userLogout);

// Export the router to be used in the main app
export default router;
