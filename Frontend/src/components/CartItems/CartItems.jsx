import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const { getTotalAmount, fetchAllProduct, cartItems, removeFromCart, UserId } =
    useContext(ShopContext);

  console.log("all products fetch data in cart page", fetchAllProduct);
  console.log("i am inside cartItem.jsx");
  console.log("cartItems", cartItems);

  return (
    <>
      <div className="cartitems">
        <div className="cartitems-format-main">
          <p>Products</p>
          <p className="title">Title</p>
          <p className="y">Price</p>
          <p className="y">Quantity</p>
          <p className="y">Size</p>
          <p className="y">Total</p>
          <p className="y">Remove</p>
        </div>
      </div>

      <div>
        <hr />
        {cartItems.map((cartItem, index) => {
          console.log("inside cartitem.jsx:-",cartItem)
          const product = fetchAllProduct.find(
            (p) => p._id.trim().toString() == cartItem.ProductId.trim().toString()
          ); // Match product by ID
          console.log("matched products", product);

          if (!product) {
            console.log("Product not found for cartItem", cartItem); // Log if product not found
            return null; // Skip if the product is not found
          }

          return (
            <div key={index} className="cartitems-format cartitems-format-main">
              {/* Product Image */}
              <img
                src={product.Image1}
                alt={product.Brand}
                className="carticon-product-icon"
              />

              {/* Product Name */}
              <p className="product-title">{product.Brand}</p>

              {/* Product Price */}
              <p>${product.Offer_Price}</p>

              {/* Quantity */}
              <p className="cartitems-quantity">{cartItem.Quantity}</p>

              {/* Selected Size */}
              <p>{cartItem.Size}</p>

              {/* Product Total */}
              <p>${product.Offer_Price * cartItem.Quantity}</p>

              {/* Remove Icon */}
              <img
                className="cartitems-remove-icon"
                src={remove_icon}
                onClick={() =>
                  removeFromCart(UserId, cartItem.ProductId, cartItem.Size)
                } // Pass productId and size to remove
                alt="Remove"
              />
            </div>
          );
        })}

        {/* Cart Total Section */}
        <div className="cartitems-down">
          <div className="cartitems-total">
            <h1>Cart Total</h1>
            <div>
              {/* Subtotal Section */}
              <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>${getTotalAmount()}</p>
              </div>
              <hr />

              {/* Shipping Fee Section */}
              <div className="cartitems-total-item">
                <p>Shipping Fee</p>
                <p>Free</p>
              </div>
              <hr />

              {/* Total Section */}
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>${getTotalAmount()}</h3>
              </div>
            </div>
            <button>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItems;
