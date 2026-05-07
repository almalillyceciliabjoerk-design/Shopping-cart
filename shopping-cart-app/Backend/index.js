import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cartRouter from "./routes/cart.js";
import productRouter from "./routes/products.js";

const app = express();
const PORT = 5000; 

// middleware
app.use(cors());
app.use(express.json());
app.use("/products", productRouter);

// routes
app.use("/cart", cartRouter);

app.use("/images", express.static("images"));

// connect to MongoDB
mongoose
  .connect("mongodb+srv://almalbjork_db_user:jsLlrdVDVDI3tyFb@shopping-cart.yck6umj.mongodb.net/test")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:",err));

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



