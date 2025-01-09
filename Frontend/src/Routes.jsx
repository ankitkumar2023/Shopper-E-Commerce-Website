import React from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Shop from "./pages/Shop";
import ShopCategory from "./pages/ShopCategory";
import Product from "./pages/SingleProductPageDesign";
import Cart from "./pages/Cart";
import men_banner from "./components/Assets/banner_mens.png";
import women_banner from "./components/Assets/banner_women.png";
import kid_banner from "./components/Assets/banner_kids.png";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Wishlist from "./pages/Wishlist";


const RoutesFile = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route
          path="/Men"
          element={<ShopCategory banner={men_banner} Gender="men" />}
        />
        <Route
          path="/Women"
          element={<ShopCategory banner={women_banner} Gender="women" />}
        />
        <Route path="/Product" element={<Product />}>
          <Route path=":productId" element={<Product />} />
        </Route>
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist/> } />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

      </Routes>
    </div>
  );
};

export default RoutesFile;
