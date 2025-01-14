import React, { useContext, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const { getTotalAmount, fetchAllProduct, cartItems, removeFromCart, UserId, updateCartQuantity } =
    useContext(ShopContext);
  const [quantityDropdown, setQuantityDropdown] = useState(null); // Tracks which item's quantity dropdown is open

  const handleQuantityClick = (index) => {
    // Toggle dropdown visibility for a specific item
    setQuantityDropdown((prev) => (prev === index ? null : index));
  };

  const handleQuantityChange = (cartItem, newQuantity) => {
    console.log("cart item in cart", cartItem)
    console.log("product id in cart item",cartItem.ProductId)
    // Update the quantity in the cart
    updateCartQuantity(UserId, cartItem.ProductId, cartItem.Size, newQuantity);
    setQuantityDropdown(null); // Close the dropdown
  };

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
          const product = fetchAllProduct.find(
            (p) => p._id.trim().toString() == cartItem.ProductId.trim().toString()
          );

          if (!product) {
            return null;
          }

          return (
            <div key={index} className="cartitems-format cartitems-format-main">
              <img
                src={product.Image1}
                alt={product.Brand}
                className="carticon-product-icon"
              />
              <p className="product-title">{product.Brand}</p>
              <p>${product.Offer_Price}</p>
              <div className="cartitems-quantity-wrapper">
                <p
                  className="cartitems-quantity"
                  onClick={() => handleQuantityClick(index)}
                >
                  {cartItem.Quantity}
                </p>
                {quantityDropdown === index && (
                  <div className="quantity-dropdown">
                    {[...Array(10).keys()].map((i) => (
                      <div
                        key={i + 1}
                        className="quantity-option"
                        onClick={() => handleQuantityChange(cartItem, i + 1)}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p>{cartItem.Size}</p>
              <p>${product.Offer_Price * cartItem.Quantity}</p>
              <img
                className="cartitems-remove-icon"
                src={remove_icon}
                onClick={() =>
                  removeFromCart(UserId, cartItem.ProductId, cartItem.Size)
                }
                alt="Remove"
              />
            </div>
          );
        })}

        <div className="cartitems-down">
          <div className="cartitems-total">
            <h1>Cart Total</h1>
            <div>
              <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>${getTotalAmount()}</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <p>Shipping Fee</p>
                <p>Free</p>
              </div>
              <hr />
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
