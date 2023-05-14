import React from "react";
// import { useEffect, useState, useRef} from 'react';
import MyNavbar from "./Navbar-Components/Navbar";
import Footer from "./Footer-Components/Footer";

export default function Home() {
  // const [childData, setChildData] = useState('');
  const handleChildData = (data) => {
    // setChildData(data);
    console.log(data);
  };
  return (
    <>
      <MyNavbar onData={handleChildData}></MyNavbar>
      <h1>Home</h1>
      <div className="footer--pin">
        <Footer />
      </div>
    </>
  );
}
