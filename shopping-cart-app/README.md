# E-commerce Shopping Cart Application

## Project Summary
This is a single-page e-commerce shopping cart application built using React, Node.js, Express, and MongoDB.  
Users can view products, add them to the shopping cart, adjust quantities, and remove items. The app dynamically updates stock in real-time and provides a seamless user experience without page reloads.

---

## Technical Stack
- Frontend: React builds a single-page application (SPA) that dynamically updates the UI without page reloads., JavaScript and CSS handles interactivity and styling, including product cards, cart functionality, and responsive layout.

- Backend: Node.js and Express provides RESTful APIs for CRUD operations on products and cart items.

- Routing: Backend uses Express REST API routes for products and cart operations. Frontend is a single-page application (SPA) using React; all interactions happen dynamically without page reloads.

- Database: MongoDB (Atlas), cloud-hosted database storing products and cart items, with real-time stock management.

- Other: CORS for API requests

---

## Feature List
- Display all products with name, price, stock, and image.
- Add products to the shopping cart.
- Edit quantity of items in the cart.
- Remove items from the cart.
- Real-time stock update for products.
- Single-page dynamic interface (SPA) using React.
- Responsive layout for desktop and mobile.
- Error handling for API failures and stock limitations.
- Total price calculation in the cart.

---

## Folder Structure

Shopping-cart-app
|
|___Backend/
|   |___images/           #product images
|   |___models/           #Mongoose schemas (cartitem)
|   |   |___CartItem.js   
|   |___routes/           #Express route handlers for products and cart
|   |   |___cart.js
|   |   |___products.js
|   |___index.js          #Entry point for Node/Express server
|   |___package.json      
|    
|___Frontend/
|   |___src/              #React source code
|   |   |___App.css       #Styling for the app
|   |   |___App.jsx       #Main react component
|   |   |___index.css
|   |   |___main.jsx
|   |___index.html        
|   |___package.json      
|___README   
|___test.cartitems.json   #contains the cart items
|___test.products.json    #contains the initial product data (stock)

## Challenges Overcome

Initially, I had some problems finding a structure for the project and where to place the logic for handling the products. During development, I encountered several challenges connecting the frontend and backend to the MongoDB database. Initially, the app failed to add items to the cart due to missing productId fields and validation errors in Mongoose. Managing real-time stock updates while keeping the frontend in sync with the database required careful state handling in React.  These challenges helped me better understand full-stack development and the interaction between React, Express, and MongoDB.
