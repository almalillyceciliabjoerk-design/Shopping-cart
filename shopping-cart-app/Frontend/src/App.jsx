import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]); // products = stock
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(
  JSON.parse(localStorage.getItem("user"))
  );

  const backendUrl = "http://localhost:5000"; // backend root
  const token = localStorage.getItem("token");

  // Fetch products (stock) from backend
  const fetchProducts = async (searchQuery = "") => {
    try {
      const res = await fetch(
        `${backendUrl}/products/search?q=${searchQuery}`
      );

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products.");
    }
  };

  // Fetch cart items from backend
  const fetchCart = async () => {
    try {
      const res = await fetch(`${backendUrl}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCart(data);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const login = async () => {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      console.log("Logged in!");
    }
  };

  useEffect(() => {
  if (token) {
    fetchCart();
  }
}, [token]);

  useEffect(() => {
    fetchProducts(search);
  }, [search]);

  // Add product to cart
  const addToCart = async (product) => {
    if (product.stock < 1) {
      alert("Out of stock!");
      return;
    }

    try {
      // Check if product is already in cart
      const existing = cart.find((item) => item.productId === product._id);

      if (existing) {
        // Increase quantity
        await fetch(`${backendUrl}/cart/${existing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`,
        },
          body: JSON.stringify({ quantity: existing.quantity + 1 }),
        });
      } else {
        // Add new cart item
        await fetch(`${backendUrl}/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`,
        },
          body: JSON.stringify({ 
            productId: product._id,
            name: product.name,
            price: product.price,
            img: product.img,
            quantity: 1, 
         }),
        });
      }

      // Decrease stock in products
      await fetch(`${backendUrl}/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: product.stock - 1 }),
      });

      // Refresh data
      fetchProducts();
      fetchCart();
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  // Update cart item quantity
  const updateQuantity = async (cartItem, newQty) => {
    if (newQty < 1) return;

    try {
      // Get product stock
      const product = products.find((p) => p._id === cartItem.productId);

      if (!product) {
        console.error("Product not found for cart item");
        return;
      }

      const diff = newQty - cartItem.quantity;

      if (diff > product.stock) {
        alert("Not enough stock!");
        return;
      }

      // Update cart
      await fetch(`${backendUrl}/cart/${cartItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ quantity: newQty }),
      });

      // Update product stock
      await fetch(`${backendUrl}/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stock: product.stock - diff }),
      });

      fetchProducts();
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItem) => {
    try {
      const product = products.find((p) => p._id === cartItem.productId);

      if (!product) {
        console.error("Product not found for cart item");
        return;
      }

      // Restore stock
      await fetch(`${backendUrl}/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: product.stock + cartItem.quantity }),
      });

      // Remove cart item
      await fetch(`${backendUrl}/cart/${cartItem._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProducts();
      fetchCart();
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);

        fetchCart();
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const total = Array.isArray(cart)
  ? cart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0)
  : 0;

  return (
    <div className="container">
      <h1>Shopping Cart</h1>

      <section className="products-section">
        <h2>Products</h2>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        {/* Show error if it exists */}
        {error && <p className="error-message">{error}</p>}

        {/* Show products if available */}
        <div className="products">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={`${backendUrl}/images/${product.img}`}
                  alt={product.name}
                  className="product-img"
                />
                <p>{product.name}</p>
                <p>${product.price}</p>
                <p>Stock: {product.stock}</p>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock < 1}
                >
                  {product.stock < 1 ? "Out of stock" : "Add to Cart"}
                </button>
              </div>
            ))
          ) : !error ? (
            <p>Loading products...</p> // while waiting for fetch
          ) : null}

        </div>
      </section>

      <section className="cart">
        <h2>Cart</h2>
        {cart.length === 0 && <p>Your cart is empty.</p>}
        {cart.map((item) => (
          <div key={item._id} className="cart-item">
            <p>{item.name}</p>
            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item, item.quantity + 1)}>+</button>
            </div>
            <button onClick={() => removeFromCart(item)}>Remove</button>
          </div>
        ))}
        <h3>Total: ${total}</h3>
      </section>
    </div>
  );
}

export default App;