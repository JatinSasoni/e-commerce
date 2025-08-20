import express from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { loginUser, optResendController, profileController, registerUser, verifyOtp } from '../controllers/auth.controller.js';
const router = express.Router();


// Register user
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);

// Verify OTP
router.post(
  "/verify-otp",
  [body("email").isEmail(), body("otp").isLength({ min: 6, max: 6 })],
  verifyOtp
);

// Login user
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  loginUser
);

// Get user profile
router.get("/profile", auth, profileController);

// Resend OTP
router.post("/resend-otp", [body("email").isEmail()], optResendController);

export default router;
