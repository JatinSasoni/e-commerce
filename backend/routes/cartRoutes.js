import express from "express";
import { auth } from "../middleware/auth.js";
import {
  addItemInCart,
  clearCart,
  getCartProducts,
  removeItem,
  updateCartItemQuantity,
} from "../controllers/cart.controller.js";

const router = express.Router();

// Get user cart
router.get("/", auth, getCartProducts);

// Add item to cart
router.post("/add", auth, addItemInCart);

// Update cart item quantity
router.put("/update", auth, updateCartItemQuantity);

// Remove item from cart
router.delete("/remove/:productId", auth, removeItem);

// Clear cart
router.delete("/clear", auth, clearCart);

export default router;
