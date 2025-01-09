import React, { createContext, useState, useEffect } from "react";
import { json } from "react-router-dom";

export const ShopContext = createContext(null);

const getDefaultCart = (products) => {
  let cart = {};
  if (products && products.length > 0) {
    for (let index = 0; index < products.length; index++) {
      cart[index] = 0;
    }
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setall_product] = useState([]);
  const [allBrandName, setAllBrandName] = useState([]);
  const [allProductColor, setAllProductColor] = useState([]);
  const [allDiscount, setAllDiscount] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [UserDetails, setUserDetails] = useState(false);
  const [searchkeyword, setSearchkeyWord] = useState("");
  const [addItemToCArt, setAddItemToCart] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistStatus, setWishlistStatus] = useState(false);
  const [productSize, setProductSize] = useState({});
  const [isUserDetailSaved, setIsUserDetailSaved] = useState(false);
  const [isUserAlreadyExist, setIsUserAlreadyExist] = useState(false)
  const [userShortName, setUserShortName] = useState("")
  const [userInfo, setUserInfo] = useState({})
  const [userid, setUserId] = useState("")
  

  useEffect(() => {
    // Retrieve the persisted userShortName from localStorage
    const storedShortName = localStorage.getItem("userShortName");
    if (storedShortName) {
      setUserShortName(storedShortName);
      setIsUserAlreadyExist(true);
    }
  }, []);
  

  const fetchData = async (Gender, filters = {}) => {
    try {
      const queryParams = new URLSearchParams({ Gender, ...filters }).toString();
      const response = await fetch(`http://localhost:3000/product?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const { filterData, allBrandName, allProductColor, allDiscount } =
        await response.json();
      setall_product(filterData);
      setAllBrandName(allBrandName);
      setAllProductColor(allProductColor);
      setAllDiscount(allDiscount);
    } catch (error) {
      console.error("Error while fetching the data:", error);
    }
  };
  
  const SignupAuthentication = async (
    FirstName,
    LastName,
    Gender,
    Mobile,
    Email,
    Password,
    Address
  ) => {
    try {
      const response = await fetch(`http://localhost:3000/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FirstName,
          LastName,
          Gender,
          Mobile,
          Email,
          Password,
          Address,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsUserAlreadyExist(true);
        const shortName = (FirstName[0] + LastName[0]).toUpperCase();
        setUserInfo({ ...data, shortName });
        alert("Signup successful!");
      } else {
        alert("Unable to save user data");
      }
    } catch (error) {
      console.error("Error while saving user data:", error.message);
    }
  };
  

  const userInfoFetcher = async(UserId) => {
    try {
      const user = await fetch(`http:localhost:3000/user/UserId=${UserId}`);
      console.log(user)

      if (user) {
        setUserInfo(user)
      }
      
    } catch (error) {
      console.log("error while fetching user data")
    }
  }

  const UserVerification = async (Username, Password) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/login?Email=${Username}&Password=${Password}`
      );
      const Data = await response.json();
  
      console.log(Data.user);
      console.log("User ID:", Data.user._id);
  
      if (response.ok) {
        const sortName = Data.user.FirstName[0] + Data.user.LastName[0];
        setIsUserAlreadyExist(true);
        setUserShortName(sortName.toUpperCase());
        setUserId(Data.user._id);
  
        // Retrieve existing user details from localStorage or initialize an empty array
        const localUserDetail = JSON.parse(localStorage.getItem("UserDetail")) || [];
  
        // Check if the user already exists in localStorage
        const userExists = localUserDetail.some((user) => user.Email === Username);
  
        if (!userExists) {
          // If the user does not exist, add them to localStorage
          const updatedUserDetails = [...localUserDetail, { ...Data.user }];
          localStorage.setItem("UserDetail", JSON.stringify(updatedUserDetails));
          console.log("User detail added to localStorage.");
        } else {
          console.log("User detail already exists in localStorage.");
        }
      } else {
        throw new Error(Data.message || "Unable to match user credentials.");
      }
    } catch (error) {
      console.error("Error while matching the user credentials:", error.message);
    }
  };
  
  
  useEffect(() => {
    setCartItems(getDefaultCart(all_product));
  }, [all_product]);


  const handleProductSize = (id, sizeValue) => {
  setProductSize((prev) => ({
    ...prev,
    [id]: sizeValue, // Replace the current size with the new size for the product
  }));
  alert("Size updated!");
};


const addToCart = async (UserId, ProductId, productSize, Quantity) => {
  if (!userInfo || !userInfo._id) {
    alert("Please log in to add items to the cart.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/user/addtocart?UserId=${UserId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserId,
        ProductId,
        Size: productSize.id,
        Quantity,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add item to cart: ${response.status}`);
    }

    const data = await response.json();
    setCartItems((prev) => ({
      ...prev,
      [ProductId]: (prev[ProductId] || 0) + Quantity,
    }));
    alert("Item added to cart!");
  } catch (error) {
    console.error("Error while adding item to cart:", error.message);
  }
};


const increaseQuantity = async (UserId, ProductId, productSize) => {
  addToCart(UserId, ProductId, productSize, 1); // Increment quantity by 1
};

const decreaseQuantity = async (UserId, ProductId, productSize) => {
  setCartItems((prev) => ({
    ...prev,
    [ProductId]: Math.max((prev[ProductId] || 1) - 1, 0),
  }));

  // Optionally, make an API call to update the backend
};


  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const productId in cartItems) {
      const quantity = cartItems[productId];
      if (quantity > 0) {
        const product = all_product.find((item) => item.id === Number(productId));
        if (product) {
          totalAmount += product.new_price * quantity;
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItem = () => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0);
  };

  const handleWishlist = (itemid) => {
    setWishlistStatus((prev) => !prev);
    if (!wishlistItems.includes(itemid)) {
      setWishlistItems((prev) => [...prev, itemid]);
      alert("Item added in the wishlist");
    } else {
      setWishlistItems((prev) => prev.filter((item) => item !== itemid));
      alert("Item removed from the wishlist");
    }
  };

  const contextValue = {
    getTotalCartItem,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    setUserDetails,
    UserDetails,
    searchkeyword,
    setSearchkeyWord,
    addItemToCArt,
    setAddItemToCart,
    wishlistStatus,
    setWishlistStatus,
    wishlistItems,
    setWishlistItems,
    handleWishlist,
    productSize,
    handleProductSize,
    allBrandName,
    allDiscount,
    allProductColor,
    fetchData,
    SignupAuthentication,
    isUserDetailSaved,
    setIsUserDetailSaved,
    UserVerification,
    isUserAlreadyExist,
    setIsUserAlreadyExist,
    userShortName,
    userInfo
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
