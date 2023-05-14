import React from "react";
import { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import MyNavbar from "../Navbar-Components/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Account from "./Account";
import Membership from "./Membership";
import Notification from "./Notification";
import Footer from "../Footer-Components/Footer";
import "../../index.css";

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("myaccount");
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [account, setAccount] = useState("");

  const [childData, setChildData] = useState("");
  const handleChildData = (data) => {
    setChildData(data);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          process.env.REACT_APP_PRODUCTION_URL,
          {
            token: cookies.jwt,
          },
          {
            withCredentials: true,
          }
        );
        console.log(data.user);
        setAccount(data.user);

        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else console.log("Loggedin successfully!");
      }
    };

    verifyUser();

    return () => {
      setActiveTab("myaccount");
      setAccount("");
    };
  }, [cookies, navigate, removeCookie]);

  const styles1 = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "25vh",
  };
  const styles2 = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "10vh",
  };
  return (
    <>
      <MyNavbar onData={handleChildData}></MyNavbar>
      <div>
        <div style={styles1}>
          <img
            className="profile-image"
            src={process.env.REACT_APP_PRODUCTION_URL + `/${account.photo}`}
          />
          {/* <h2>{account.photo}</h2> */}
        </div>
        <div style={styles2}>
          <h2>{account.username}</h2>
        </div>
      </div>
      <div className="breadcrumb-div">
        <Breadcrumb>
          <Breadcrumb.Item
            onClick={() => handleTabClick("myaccount")}
            active={activeTab === "myaccount"}
          >
            {" "}
            ACCOUNT{" "}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => handleTabClick("membership")}
            active={activeTab === "membership"}
          >
            {" "}
            MEMBERSHIP{" "}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => handleTabClick("notification")}
            active={activeTab === "notification"}
          >
            {" "}
            NOTIFICATION{" "}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <hr></hr>
      <div className="breadcrumb-tabs">
        {activeTab === "myaccount" && <Account childData={account} />}
        {activeTab === "membership" && <Membership />}
        {activeTab === "notification" && <Notification />}
      </div>
      <div className="footer--pin">
        <Footer />
      </div>
    </>
  );
}
