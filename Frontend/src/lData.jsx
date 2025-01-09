import React, { useEffect, useState } from "react";

const LoginPage = (setLoginstat) => {
  const [Username, setUserName] = useState("");
  const [Password, setPassword] = useState("");

  //   const { setLoginStat } = props;

  const handleSubmuit = (e) => {
    e.preventDefault();
    console.log("username", Username);
    console.log("password", Password);
  };

  // useEffect(() => {
  // //     // setLoginStat(false);
  // // },[])

  return (
    <>
      <div className="loginpage-container">
        <div className="loginpage-title">
          <h2>Login Page</h2>
        </div>
        <div className="loginpage-input">
          <input
            type="text"
            placeholder="Enter Your Email or UserName"
            value={Username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="text"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleSubmuit(e)}>Submit</button>
      </div>
    </>
  );
};

// export default LoginPage;
