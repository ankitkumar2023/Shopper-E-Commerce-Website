import React, { useContext, useEffect, useState } from "react";
import "./CSS/LoginPage.css";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [Username, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const { UserVerification, isUserAlreadyExist, setIsUserAlreadyExist } =
    useContext(ShopContext);
  const navigate = useNavigate();

  const handleSubmuit = (e) => {
    e.preventDefault();
    if (Username && Password) {
      UserVerification(Username, Password);
    } else {
      alert("Please fill the username and password");
    }
  };

  useEffect(() => {
    if (isUserAlreadyExist) {
      // Resetting the state and navigating to the home page
      // setIsUserAlreadyExist(false);
      navigate("/");
    }
  }, [isUserAlreadyExist, navigate, setIsUserAlreadyExist]);

  return (
    <div className="login-container">
      <div className="login-image">
        <img
          src="../src/components/Assets/login-logo.png"
          alt="Login Illustration"
        />
      </div>
      <div className="login-form">
        <h2>Welcome Back</h2>
        <p>Please login to your account</p>
        <form onSubmit={handleSubmuit}>
          <label>
            Username or Email
            <input
              type="email"
              placeholder="Enter your username or email"
              value={Username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="Enter your password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>
        <p className="login-footer">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
