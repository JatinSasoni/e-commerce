import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createOrder,
  getOrderById,
  myOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

// Create order
router.post("/create", auth, createOrder);

// Get user orders
router.get("/my-orders", auth, myOrder);

// Get single order
router.get("/:orderId", auth, getOrderById);

export default router;
