import React, { useContext } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import wishlist_icon from "../Assets/wishlist.png";
import { ShopContext } from "../../Context/ShopContext";
import { Link, useNavigate } from "react-router-dom";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart, UserId, wishlistItems, handleWishlist, productSize, handleProductSize, Quantity,isUserDetailSaved,isUserAlreadyExist,ManageWishlist} = useContext(ShopContext);
  const navigate = useNavigate();

  const checker = (UserId,ProductId, selectedSize,Quantity,isUserDetailSaved,isUserAlreadyExist) => {
    console.log("product id in single product page", ProductId);
    // Check if user is logged in
    console.log("is user detail saved",isUserDetailSaved)
    if (isUserDetailSaved||isUserAlreadyExist ) {
      console.log("user id :-", UserId, "Product id :-", ProductId, "product size selected:-", selectedSize, "quantity:-", Quantity);
      // Pass selected size and quantity to the addToCart function
      addToCart(UserId, ProductId, selectedSize, Quantity);
    } else {
      navigate("/login");
    }
  };

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const selectedSize = productSize[product._id] || "";// Get the selected size for this product
  console.log("selected size in single product page",selectedSize)

  const isInWishlist = wishlistItems.includes(product._id);

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.Image1} alt="Product" />
          <img src={product.Image2} alt="Product" />
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.Image1} alt="Product" />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          {[...Array(4)].map((_, i) => (
            <img key={i} src={star_icon} alt="Star" />
          ))}
          <img src={star_dull_icon} alt="Star Dull" />
          <p>(122)</p>
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${product.Price}</div>
          <div className="productdisplay-right-price-new">${product.Offer_Price}</div>
        </div>

        <div className="productdisplay-right-description">{product.Description}</div>

        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {sizes.map((size) => (
              <div
                key={size}
                onClick={() => handleProductSize(product._id, size)}  // Update size in context
                className={`size-option ${selectedSize === size ? "selected" : ""}`}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <div className="option-buttons">
          <Link to="/cart">
            <div className="add-to-cart" onClick={() => checker(UserId,product._id, selectedSize,Quantity,isUserDetailSaved,isUserAlreadyExist)}>
              <p>Add To Cart</p>
            </div>
          </Link>
          <div className="wishlist" onClick={() => { handleWishlist(product._id);ManageWishlist(UserId,product._id) }}>
            <p>Add To Wishlist</p>
            <img
              className="wishlist_icon"
              style={{ backgroundColor: isInWishlist ? "red" : "white" }}
              src={wishlist_icon}
              alt="Wishlist"
            />
          </div>
        </div>

        <p className="productdisplay-right-category">
          <span>Category :</span> Women, T-Shirt, Crop-Top
        </p>
        <p className="productdisplay-right-category">
          <span>Tags :</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
