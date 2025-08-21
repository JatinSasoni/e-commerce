import express from "express";
import { body } from "express-validator";
import { auth } from "../middleware/auth.js";
import {
  loginUser,
  optResendController,
  profileController,
  registerUser,
  verifyOtp,
} from "../controllers/auth.controller.js";
import {
  loginValidator,
  registerValidator,
  resendOtpValidator,
  verifyOtpValidator,
} from "../validators/authValidator.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();

// Register user
router.post("/register", registerValidator, validate, registerUser);

// Verify OTP
router.post("/verify-otp", verifyOtpValidator, validate, verifyOtp);

// Login user
router.post("/login", loginValidator, validate, loginUser);

// Get user profile
router.get("/profile", auth, profileController);

// Resend OTP
router.post("/resend-otp", resendOtpValidator, validate, optResendController);

export default router;
