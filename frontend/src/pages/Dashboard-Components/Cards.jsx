import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/image.jpg";
import Banner from "../../assets/banner.png";
import axios from "axios";
import Detail from "../Collection-Components/Detail";

import "../../index.css";

const Cards = ({ collection, idx }) => {
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (event) => {
    setShowDropdown(!showDropdown);
    event.stopPropagation();
  };
  const handleDropdownClick = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    console.log("Called from card",process.env.REACT_APP_PRODUCTION_URL + `/uploads/${collection.banner}`)
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setShowDropdown(false);
    };
  }, [dropdownRef]);

  const handleCardClick = (item) => {
    console.log("handleCardClick");
    console.log(item);
    navigate(`/build/${item.collectionID}`);
  };

  const handleCardEdit = (item) => {
    console.log("handleCardEdit");
    console.log(item);
  };

  const handleCardDelete = async (item) => {
    console.log("handleCardDelete");
    console.log(item.collectionID);
    try {
      console.log(
        process.env.REACT_APP_PRODUCTION_URL +
          `/deleteCollection/${item.collectionID}`
      );
      const response = await axios.delete(
        process.env.REACT_APP_PRODUCTION_URL +
          `/deleteCollection?id=${item.collectionID}`
      );
      console.log(response.data);
    } catch (err) {
      console.error(err);
    } 
  }; 

  function truncate(str, n) {
    return str.length > n ? str.slice(0, n - 1) + " ..." : str;
  } 

  return ( 
    <div
      key={idx}
      className="tempcard-card"
      onClick={() => handleCardClick(collection)}
    >
      <div className="tempcard-banner">
        <img
          className="tempcard-banner-img"
          src={
            process.env.REACT_APP_PRODUCTION_URL + `/uploads/${collection.banner}`
          }
          alt="Banner"
        />
        <button className="tempcard-dropdown-btn" onClick={toggleDropdown}>
          :
        </button>
        <div
          className={`tempcard-dropdown ${showDropdown ? "show" : ""}`}
          ref={dropdownRef}
          onClick={handleDropdownClick}
        >
          <ul>
            <li onClick={() => handleCardEdit(collection)}>Edit</li>
            <li onClick={() => handleCardDelete(collection)}>Delete</li>
          </ul>
        </div>

        <img
          className="tempcard-profile-img"
          src={
            process.env.REACT_APP_PRODUCTION_URL +
            `/uploads/${collection.image}`
          }
          alt="Profile"
        />
      </div> 
      <div className="tempcard-content">
        <h4 className="tempcard-heading">{collection.name}</h4>
        {collection.isDeployed ? (
          <p className="tempcard-text">
            {collection.symbol} . {collection.network}
          </p>
        ) : (
          <p className="tempcard-text">
            {collection.symbol} . Draft . {collection.network}
          </p>
        )}
        <p className="tempcard-text">{truncate(collection.description, 40)}</p>
      </div> 
    </div>
  ); 
};

export default Cards;
