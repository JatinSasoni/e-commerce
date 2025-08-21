import express from "express";
import { auth } from "../middleware/auth.js";
import {
  addAdders,
  fetchAdders,
} from "../controllers/addressRoutes.controller.js";
import { addressValidator } from "../validators/addressValidator.js";
import { validate } from "../middleware/validate.js";

// JWT middleware
const router = express.Router();

//  Fetch all addresses of logged-in user
router.get("/", auth, fetchAdders);

//  Add a new address
router.post("/", auth, addressValidator, validate, addAdders);

export default router;
