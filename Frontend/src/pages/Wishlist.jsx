import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './CSS/Wishlist.css'

const Wishlist = () => {
  const { wishlistItems, fetchAllProduct, ManageWishlist, UserId } = useContext(ShopContext);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  const handleRemoveItem = (ProductId) => {
    ManageWishlist(UserId, ProductId);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to the single product page
  };

  useEffect(() => {
    const productsInWishlist = fetchAllProduct.filter((product) =>
      wishlistItems.includes(product._id)
    );
    setWishlistProducts(productsInWishlist);
  }, [wishlistItems, fetchAllProduct]);

  return (
    <div className="wishlist-container">
      {wishlistProducts.length > 0 ? (
        wishlistProducts.map((product) => (
          <div
            className="wishlist-item"
            key={product._id}
            onClick={() => handleProductClick(product._id)} // Navigate on click
          >
            <img src={product.Image1} alt={product.Brand} />
            <h3>{product.Brand}</h3>
            <p>New Price: ${product.Offer_Price}</p>
            <p>Old Price: ${product.Price}</p>
            {product.Discount > 0 && (
              <p className="discount">{product.Discount}% off</p>
            )}
            <button
              className="cancel-btn"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering navigation
                handleRemoveItem(product._id);
              }}
            >
              Remove
            </button>
          </div>
        ))
      ) : (
        <p className="empty-message">Your wishlist is empty!</p>
      )}
    </div>
  );
};

export default Wishlist;
