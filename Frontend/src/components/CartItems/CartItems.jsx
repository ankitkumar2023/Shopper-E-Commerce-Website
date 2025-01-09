import React from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";
import { useContext } from "react";

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart, productSize } = useContext(ShopContext);

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
        {all_product.map((product) => {
          // Only process if the product has been added to the cart
          if (cartItems[product.id] > 0) {
            return (
              <div key={product.id}>
                {productSize[product.id]?.map((size, index) => (
                  <div key={index} className="cartitems-format cartitems-format-main">
                    {/* Product Image */}
                    <img src={product.image} alt={product.name} className="carticon-product-icon" />

                    {/* Product Name */}
                    <p className="product-title">{product.name}</p>

                    {/* Product Price */}
                    <p>${product.new_price}</p>

                    {/* Quantity */}
                    <button className="cartitems-quantity">{cartItems[product.id]}</button>

                    {/* Displaying the selected size */}
                    <p>{size}</p>

                    {/* Product Total */}
                    <p>${product.new_price * cartItems[product.id]}</p>

                    {/* Remove Icon */}
                    <img
                      className="cartitems-remove-icon"
                      src={remove_icon}
                      onClick={() => removeFromCart(product.id)}
                      alt="Remove"
                    />
                  </div>
                ))}
                <hr />
              </div>
            );
          }
          return null;
        })}

        <div className="cartitems-down">
          <div className="cartitems-total">
            <h1>Cart Total</h1>
            <div>
              <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <p>Shipping Fee</p>
                <p>Free</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>${getTotalCartAmount()}</h3>
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
