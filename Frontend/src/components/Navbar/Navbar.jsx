import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import search_icon from "../Assets/search_icon.jpg";
import profile_icon from "../Assets/my_profile.png";
import wishlist_icon from "../Assets/wishlist.png";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";

function Navbar() {
  const [menu, setMenu] = useState("shop");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State for dropdown visibility
  const { 
    searchkeyword, 
    setSearchkeyWord, 
    userShortName, 
    isUserDetailSaved, 
    isUserAlreadyExist,
    userInfo
  } = useContext(ShopContext);

  const navigate = useNavigate()

  const handleSearch = () => {
    console.log("Search initiated for:", searchkeyword);
    // Add your search functionality here
  };

  const toggleDropdown = () => {
    setIsDropdownVisible((prevState) => !prevState);
  };

  const handleLogout = () => {
    alert("User logged out");
    // Clear session, reset user state, and redirect if needed
    localStorage.setItem("UserDetail", JSON.stringify(""));
    localStorage.setItem("cartItems", JSON.stringify(""));
    localStorage.setItem("userShortName", JSON.stringify(""));
    localStorage.setItem("wishlistItems", JSON.stringify(""));
    setTimeout(() => {
      navigate('/')
    },1000)
    setIsDropdownVisible(false); // Close the dropdown
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-info")) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="Navbar">
      <div className="Nav-logo">
        <img src={logo} alt="Logo" />
        <p>SHOPPER</p>
      </div>

      <div className="menu-div">
        <ul className="nav-menu">
          <li onClick={() => setMenu("shop")}>
            <Link style={{ textDecoration: "none" }} to="/">
              Shop
            </Link>
            {menu === "shop" ? <hr /> : null}
          </li>
          <li onClick={() => setMenu("Mens")}>
            <Link style={{ textDecoration: "none" }} to="/Men">
              Mens
            </Link>
            {menu === "Mens" ? <hr /> : null}
          </li>
          <li onClick={() => setMenu("Womens")}>
            <Link style={{ textDecoration: "none" }} to="/Women">
              Womens
            </Link>
            {menu === "Womens" ? <hr /> : null}
          </li>
        </ul>
      </div>

      <div className="searchbar-div">
        <input
          className="searchbar-input"
          type="text"
          placeholder="Search for products"
          value={searchkeyword}
          onChange={(e) => setSearchkeyWord(e.target.value)}
        />
        <button className="search-icon-button" onClick={handleSearch}>
          <img className="search-icon" src={search_icon} alt="Search" />
        </button>
      </div>

      <div className="nav-login-cart">
        {isUserAlreadyExist || isUserDetailSaved ? (
          <div className="user-info" onClick={toggleDropdown}>
            <p>{userShortName}</p>
            <img src={profile_icon} alt="Profile" />
            {isDropdownVisible && (
              <div className="profile-dropdown">
                <p onClick={handleLogout}>Logout</p>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signup">
            <button>Login</button>
          </Link>
        )}
        <Link to="/cart">
          <img src={cart_icon} alt="Cart" />
        </Link>
        <Link to="/wishlist">
          <img src={wishlist_icon} alt="wishlist" />
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
