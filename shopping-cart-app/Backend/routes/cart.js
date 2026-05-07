import express from "express";
import CartItem from "../models/CartItem.js";

const router = express.Router();

// GET all items
router.get("/", async (req, res) => {
  try {
    const items = await CartItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add new item
router.post("/", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);
    const { productId,name, price, quantity, img } = req.body;
    // Check if item already exists
    const existing = await CartItem.findOne({ productId });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }
    const newItem = new CartItem({ productId, name, price, quantity, img });
    await newItem.save();

    console.log("SAVED:", newItem);

    res.status(201).json(newItem);
  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update quantity
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE item
router.delete("/:id", async (req, res) => {
  try {
    const item = await CartItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;