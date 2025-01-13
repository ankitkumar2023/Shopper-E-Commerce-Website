import React, { useContext } from "react";
import cart_icon from "../Assets/cart_icon.png";
import wishlist_icon from "../Assets/wishlist.png";

import "./Item.css";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import all_product from "../Assets/all_product";

function Item(props) {
  const { addToCart, wishlistItems, handleWishlist,  Quantity = 1 ,ManageWishlist  , UserId }  =
    useContext(ShopContext);
  const { id, image, name, new_price, old_price, discount } = props;
  // console.log("offer price ",new_price, "and old price ",old_price, "of product:-",id)

  const handleAddToCart = () => {
    try {
      addToCart(UserId, id, "S", Quantity); // Default size "S" and Quantity
      alert("Your item was successfully added to the cart!");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert("Failed to add the item. Please try again.");
    }
  };

  const isInWishlist = wishlistItems.includes(id);
  const toggleWishlist = () => {
    handleWishlist(id);
    ManageWishlist (UserId, id);
      
  };

  return (
    <div className="item">
      <Link to={`/product/${id}`}>
        <img
          onClick={() => window.scrollTo(0, 0)}
          src={image}
          alt={name || "Product"}
        />
      </Link>
      <p>{name}</p>
      <div className="item-prices">
        <div className="item-price-new">$ {new_price}</div>
        <div className="item-price-old">$ {old_price}</div>
        {/* Only show discount if it's greater than 0 */}
        {discount > 0 && (
          <div className="item-discount">{discount}% off</div>
        )}
      </div>
      <div className="item-status">
        <div className="item-cart" onClick={handleAddToCart}>
          <img src={cart_icon} alt="Cart" />
        </div>
        <div className="item-wishlist" onClick={toggleWishlist}>
          <img
            src={wishlist_icon}
            alt="Wishlist"
            className="wishlist_icon"
            style={{ backgroundColor: isInWishlist ? "red" : "white" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Item;
