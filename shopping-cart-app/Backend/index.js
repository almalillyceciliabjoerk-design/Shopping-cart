import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cartRouter from "./routes/cart.js";
import productRouter from "./routes/products.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/cart", cartRouter);
app.use("/auth", authRoutes);
app.use("/products", productRouter);

app.use("/images", express.static("images"));

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:",err));

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



