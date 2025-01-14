import React, { createContext, useState, useEffect } from "react";

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
  const [cartItems, setCartItems] = useState([]);
  const [searchkeyword, setSearchkeyWord] = useState("");
  const [addItemToCArt, setAddItemToCart] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistStatus, setWishlistStatus] = useState(false);
  const [productSize, setProductSize] = useState({});
  const [isUserDetailSaved, setIsUserDetailSaved] = useState(false);
  const [isUserAlreadyExist, setIsUserAlreadyExist] = useState(false);
  const [userShortName, setUserShortName] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [UserId, setUserId] = useState("");
  const [Quantity, setQuantity] = useState(1);
  const [fetchAllProduct, setFetchAllProduct] = useState([]);

  useEffect(async () => {
    const storedUserShortName = JSON.parse(
      localStorage.getItem("userShortName")
    );
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    const storedUserInfo = JSON.parse(localStorage.getItem("UserDetail"));
    const storedwishlistitems = JSON.parse(localStorage.getItem("wishlistItems"));
    

    console.log("userdetail in localstorage", storedUserInfo);
    if (storedUserShortName) {
       setUserShortName(storedUserShortName);
       setIsUserAlreadyExist(true);
    }

    if (storedCartItems) {
       setCartItems(storedCartItems);
    }

    if (storedUserInfo) {
       setUserInfo(storedUserInfo);
       setIsUserDetailSaved(true);
      setIsUserAlreadyExist(true);
      setUserId(storedUserInfo._id)
    } 
    if (storedwishlistitems) {
      setWishlistItems(storedwishlistitems);
    }

    allproductfetcher();
  }, []);

  const allproductfetcher = async () => {
    try {
      const response = await fetch(`http://localhost:3000/product/allproduct`);
      const data = await response.json();
      if (response.ok) {
        setFetchAllProduct(data.allProduct);
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const fetchData = async (Gender, filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        Gender,
        ...filters,
      }).toString();
      const response = await fetch(
        `http://localhost:3000/product?${queryParams}`
      );
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
      if (data.ok) {
        setIsUserAlreadyExist(true);
        const shortName = (FirstName[0] + LastName[0]).toUpperCase();
        localStorage.setItem("userShortName", JSON.stringify(shortName));
        localStorage.setItem("UserDetail", JSON.stringify(data.response));
        localStorage.setItem("cartItems", JSON.stringify(data.response.Cart));
        setUserShortName(shortName);
        setUserInfo(data.savedUser);
        setCartItems(data.response.Cart);
        alert("Signup successful!");
      } else {
        alert("Unable to save user data");
      }
    } catch (error) {
      console.error("Error while saving user data:", error.message);
    }
  };

  const userInfoFetcher = async (UserId) => {
    try {
      const user = await fetch(`http://localhost:3000/user/UserId=${UserId}`);
      if (user) {
        setUserInfo(user);
      }
    } catch (error) {
      console.error("Error while fetching user data:", error);
    }
  };

  const UserVerification = async (Username, Password) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/login?Email=${Username}&Password=${Password}`
      );
      const Data = await response.json();
      console.log("data after successfull login", Data);

      if (response.ok) {
        const sortName = Data.user.FirstName[0] + Data.user.LastName[0];
        setIsUserAlreadyExist(true);
        setUserShortName(sortName.toUpperCase());
        setUserId(Data.user._id);
        setCartItems(Data.user.Cart || []);
        localStorage.setItem("userShortName", JSON.stringify(sortName));
        localStorage.setItem("UserDetail", JSON.stringify(Data.user));
        localStorage.setItem("cartItems", JSON.stringify(Data.user.Cart || []));

        // const localUserDetail =
        //   JSON.parse(localStorage.getItem("UserDetail")) || [];
        // if (!localUserDetail.some((user) => user.Email === Username)) {
        //   const updatedUserDetails = [...localUserDetail, { ...Data.user }];
        //   localStorage.setItem(
        //     "UserDetail",
        //     JSON.stringify(updatedUserDetails)
        //   );
        // }
      // } else {
      //   throw new Error(Data.message || "Unable to match user credentials.");
        // }
      }
    } catch (error) {
      console.error(
        "Error while matching the user credentials:",
        error.message
      );
    }
  };

  const handleProductSize = (id, sizeValue) => {
    setProductSize((prev) => {
      const updatedSizes = Object.keys(prev).reduce((acc, key) => {
        if (key !== id.toString()) {
          acc[key] = "";
        } else {
          acc[key] = prev[key];
        }
        return acc;
      }, {});

      return {
        ...updatedSizes,
        [id]: sizeValue,
      };
    });
    alert("Size updated!");
  };

  const addToCart = async (UserId, ProductId, productSize, Quantity) => {
    if (!isUserAlreadyExist || !isUserDetailSaved) {
      alert("Please log in to add items to the cart.");
    }

    try {
      const response = await fetch(
        `http://localhost:3000/user/addtocart?UserId=${UserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ProductId,
            Size: productSize,
            Quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add item to cart: ${response.status}`);
      }

      const data = await response.json();
      setCartItems(data.Cart);
      localStorage.setItem("cartItems", JSON.stringify(data.Cart));
      alert("Item added to cart!");
      setProductSize({});
    } catch (error) {
      console.error("Error while adding item to cart:", error.message);
    }
  };

  const updateCartQuantity = async (UserId, ProductId, Size, Quantity) => {
    try {
      const response = await fetch(`http://localhost:3000/user/updatecartquantity?UserId=${UserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Correct Content-Type
        },
        body: JSON.stringify({
          ProductId: ProductId,
          Size: Size,
          Quantity: Quantity,
        }),
      });
  
      const data = await response.json();
      console.log(data); // Log API response for debugging
  
      if (data.Cart.length > 0) {
        // Update state with the new cart
        setCartItems(data.Cart);
  
        // Synchronize with local storage
        localStorage.setItem("cartItems", JSON.stringify(data.Cart));
      }
    } catch (error) {
      console.error("Error while updating the product quantity:", error.message);
    }
  };
  

  const increaseQuantity = async (UserId, ProductId, productSize) => {
    addToCart(UserId, ProductId, productSize, 1);
  };

  const decreaseQuantity = async (UserId, ProductId, productSize) => {
    setCartItems((prev) => ({
      ...prev,
      [ProductId]: Math.max((prev[ProductId] || 1) - 1, 0),
    }));
  };

  const removeFromCart = async (UserId, ProductId, Size) => {

    console.log("user id:-",UserId, "Product id :-",ProductId, "Size :-",Size, "inside remove from cart function in shopcontext")
    try {
      const response = await fetch(
        `http://localhost:3000/user/removefromcart?UserId=${UserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ProductId,
            Size,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCartItems(data.Cart);
        localStorage.setItem("cartItems", JSON.stringify(data.Cart));
      }
    } catch (error) {
      console.error("Error while removing item from cart:", error.message);
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, cartItem) => {
      const product = fetchAllProduct.find((p) => p._id === cartItem.ProductId); // Match product by ID
      if (product) {
        return total + product.Offer_Price * cartItem.Quantity; // Calculate total for each item
      }
      return total; // Return the total if product is not found
    }, 0);
  };

  const getTotalCartItem = () => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0);
  };

  const handleWishlist = (itemid) => {
    setWishlistStatus((prev) => !prev);
    if (!wishlistItems.includes(itemid)) {
      setWishlistItems((prev) => [...prev, itemid]);
      alert("Item added to the wishlist");
    } else {
      setWishlistItems((prev) => prev.filter((item) => item !== itemid));
      alert("Item removed from the wishlist");
    }
  };

  const ManageWishlist = async (UserId, ProductId) => {
    if (!isUserAlreadyExist || !isUserDetailSaved) {
      // alert("you first need to login");
      return;
    } else {
      try {
        const response = await fetch(`http://localhost:3000/user/addtowishlist?UserId=${UserId}&ProductId=${ProductId}`,
         {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          
          }
        });
        const data = await response.json();
        console.log("data comming from backend for add to wishlist", data);
        if (response.ok) {
          setWishlistItems(data.WishlistVal)
          localStorage.setItem("wishlistItems",JSON.stringify(data.WishlistVal))

        }
  
        
      } catch (error) {
        console.log("error while adding item to wishlist")
      }
    }
    
  }
  console.log("wishlist items  shopcontext:-",wishlistItems)

  const contextValue = {
    getTotalCartItem,
    getTotalAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    // setUserDetails,
    // UserDetails,
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
    userInfo,
    UserId,
    Quantity,
    fetchAllProduct,
    ManageWishlist,
    updateCartQuantity
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
