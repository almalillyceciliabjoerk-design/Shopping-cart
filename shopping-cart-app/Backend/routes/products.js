import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0 },
  img: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Failed to fetch product:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE a product
router.post("/", async (req, res) => {
  try {
    const { name, price, stock, img } = req.body;
    if (!name || price == null || stock == null || !img) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const product = new Product({ name, price, stock, img });
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Failed to create product:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE product (e.g., stock)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    console.error("Failed to update product:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Failed to delete product:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;