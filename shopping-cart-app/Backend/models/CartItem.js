import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  img: { type: String, required: true },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

export default CartItem;