import React, { useContext } from "react";
import cart_icon from "../Assets/cart_icon.png";
import wishlist_icon from "../Assets/wishlist.png";

import "./Item.css";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import all_product from "../Assets/all_product";

function Item(props) {
  const { addToCart, wishlistItems, handleWishlist } = useContext(ShopContext);

  const { id, image, name, new_price, old_price } = props;

  const handleAddToCart = () => {
    addToCart(id); // Use context function for cart management
    alert("Your item was successfully added");
  };

  const isInWishlist = wishlistItems.includes(id);

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
      </div>
      <div className="item-status">
        <div className="item-cart" onClick={handleAddToCart}>
          <img src={cart_icon} alt="Cart" />
        </div>
        <div
          className="item-wishlist"
          onClick={(e) => {
            handleWishlist(id);
          }}
        >
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
