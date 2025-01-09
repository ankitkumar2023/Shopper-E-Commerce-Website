import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import RoutesFile from "./Routes";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <RoutesFile />
      <Footer />
    </>
  );
}

export default App;
