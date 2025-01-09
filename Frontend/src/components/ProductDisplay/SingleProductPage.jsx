import React, { useContext, useEffect, useState } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import wishlist_icon from '../Assets/wishlist.png'

const ProductDisplay = (props) => {
  const { product,ProductId } = props;
  const { addToCart, userInfo, wishlistItems,handleWishlist,productSize,handleProductSize } = useContext(ShopContext);
  
    
    const navigate = useNavigate();

  const checker = (ProductId) => {
    if (userInfo) {
        const UserId=userInfo._id
        addToCart(ProductId,UserId,productSize)
      } else {
          navigate("/login")
    }
  };



  
  const isInWishlist = wishlistItems.includes(product.id)

  const sizes = ["S", "M", "L", "XL", "XXL"];

  const selectedSize = productSize[product.id] || [];  //array of product sizes
  console.log(selectedSize)

  

  return (
    <>
      <div className="productdisplay">
        <div className="productdisplay-left">
          <div className="productdisplay-img-list">
            <img src={product.Image1} alt="" />
            <img src={product.Image2} alt="" />
            <img src={product.Image1} alt="" />
            <img src={product.Image2} alt="" />
          </div>
          <div className="productdisplay-img">
            <img
              className="productdisplay-main-img"
              src={product.Image1}
              alt=""
            />
          </div>
        </div>
        <div className="productdisplay-right">
          <h1>{product.name}</h1>
          <div className="productdisplay-right-stars">
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_dull_icon} alt="" />
            <p>(122)</p>
          </div>
          <div className="productdisplay-right-prices">
            <div className="productdisplay-right-price-old">
              ${product.Price}
            </div>
            <div className="productdisplay-right-price-new">
              ${product.Offer_Price}
            </div>
          </div>
          <div className="productdisplay-right-description">
            {product.Description}
          </div>
          <div className="productdisplay-right-size">
            <h1>Select Size</h1>
            <div className="productdisplay-right-sizes">
              {
                sizes.map((size) => (
                  <div
                    key={size}
                    
                    onClick={() => handleProductSize(product.id, size)}  
                    className={`size-option ${selectedSize.includes(size) ? "selected" : ""}`}
                  >
                    {size}
                  </div>
                ))
             }
            </div>
          </div>
          <div className="option-buttons">
            

            <Link to="/cart"><div
              className="add-to-cart"
            onClick={() => {
              checker(product._id);
            }}
          >
              <p>Add To cart</p>
              <img src="" alt="" />
              </div></Link>
            
            <div className="wishlist"
              onClick={()=>{handleWishlist(product._id)}}
            >
              <p>Add To Wishlist</p>
              <img  className="wishlist_icon"  style={{background : isInWishlist?"red":"white"}} src={wishlist_icon} alt="" />
              </div>
              
            </div>
          <p className="productdisplay-right-category">
            <span>Category :</span>Women , T-Shirt, Crop-Top
          </p>
          <p className="productdisplay-right-category">
            <span>Tags :</span>Modern , LAtest
          </p>
        </div>
      </div>
    </>
  );
};

export default ProductDisplay;
