import React, { useContext, useState, useEffect } from "react";
import "./CSS/SignupPage.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { ShopContext } from "../Context/ShopContext";

const SignupPage = () => {
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Gender, setGender] = useState("");
  const [Mobile, setMobile] = useState("");
  const [Address, setAddress] = useState({
    Pincode: "",
    State: "",
    City: "",
    Locality: "",
    House_Number: "",
  });
  const [message, setMessage] = useState(""); // Message from the backend
  const [isSuccess, setIsSuccess] = useState(false); // Success state for styling

  const { SignupAuthentication, isUserDetailSaved, setIsUserDetailSaved } =
    useContext(ShopContext);
  const navigate = useNavigate();

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...Address, [name]: value });
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    if (
      FirstName &&
      LastName &&
      Email &&
      Password &&
      Address.Pincode &&
      Address.State &&
      Address.City
    ) {
      const response = await SignupAuthentication(
        FirstName,
        LastName,
        Gender,
        Mobile,
        Email,
        Password,
        Address
      );
      setMessage(response.message); // Set message from backend
      setIsSuccess(response.ok); // Set success state
    } else {
      setMessage("Please fill up all required credentials.");
      setIsSuccess(false);
    }
  };

  useEffect(() => {
    if (isUserDetailSaved) {
      setTimeout(() => {
        navigate("/"); // Redirect to home page
      }, 2000); // 2-second delay for showing the success message
    }
  }, [isUserDetailSaved, navigate]);

  return (
    <div className="signup-page">
      <div className="signup-left">
        <img
          src="./src/components/Assets/signup-logo.jpg"
          alt="Signup Illustration"
          className="signup-image"
        />
      </div>
      <div className="signup-right">
        <div className="signup-container">
          <h1>Sign Up</h1>
          {message && (
            <div
              className={`message ${
                isSuccess ? "success-message" : "error-message"
              }`}
            >
              <p>{message}</p>
            </div>
          )}
          {!isUserDetailSaved && (
            <form onSubmit={handleContinue}>
              <div className="signup-fields">
                <input
                  type="text"
                  placeholder="First Name"
                  value={FirstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={LastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <select
                  value={Gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="signup-select"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="number"
                  placeholder="Mobile Number"
                  value={Mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Pincode"
                  name="Pincode"
                  value={Address.Pincode}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  name="State"
                  value={Address.State}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  name="City"
                  value={Address.City}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  type="text"
                  placeholder="Locality"
                  name="Locality"
                  value={Address.Locality}
                  onChange={handleAddressChange}
                />
                <input
                  type="text"
                  placeholder="House Number"
                  name="House_Number"
                  value={Address.House_Number}
                  onChange={handleAddressChange}
                />
              </div>
              <button type="submit" className="signup-button">
                Continue
              </button>
            </form>
          )}
          <p className="signup-login">
            Already have an account?{" "}
            <Link to="/login">
              <span>Login here</span>
            </Link>
          </p>
          <div className="signup-agree">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              By continuing, I agree to the Terms of Use & Privacy Policy.
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
