import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/ordersRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import { connectToDB } from "./utils/connectDB.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

//* Middleware
app.use(cors());
app.use(express.json());
app.use(cors());

//* Database connection
connectToDB(MONGODB_URI).then(() => {
  // import("./utils/cronJob/randomUserMailer.js");
});

//* Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);

//* Health check route
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

//* Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
