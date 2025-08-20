import { Product } from "../models/Product.js";
import { sendOrderConfirmationEmail } from "../utils/email.js";
import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ORD-${timestamp.slice(-6)}${random}`;
};

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode ||
      !shippingAddress.country
    ) {
      return res
        .status(400)
        .json({ message: "Complete shipping address is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`,
        });
      }
    }

    // Create order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    // Calculate total
    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      orderNumber: generateOrderNumber(),
    });

    await order.save();
    await order.populate("items.product");

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(req.user.email, req.user.name, order);
    } catch (emailError) {
      console.error("Order confirmation email failed:", emailError);
    }

    res.status(201).json({
      message: "Order created successfully",
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        items: order.items,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const myOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Order fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
