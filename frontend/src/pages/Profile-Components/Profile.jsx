import React from "react";
import { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import MyNavbar from "../Navbar-Components/Navbar";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Account from "./Account";
import {Container, Row, Col, Button} from "react-bootstrap";

import Membership from "./Membership";
import Notification from "./Notification";
import Footer from "../Footer-Components/Footer";
import "../../index.css";

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("myaccount");
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [account, setAccount] = useState("");
  const [activeKey, setActiveKey] = useState("/myaccount");
  const handleSelect = (selectedKey) => {
    setActiveKey(selectedKey);
  };

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
      <Container>
        <Row>
          <Col style={styles1}>
           <Button as={Link}  to="/dashboard" variant="outline-dark" size="md">
              {"<- BACK TO DASHBOARD"}
            </Button>
          </Col>
          <Col xs={6} style={styles1}>
            <img className="profile-image" src={process.env.REACT_APP_PRODUCTION_URL + `/${account.photo}`}/>
          </Col>
          <Col style={styles1}>
          </Col>
        </Row> 
        <Row>
          <Col style={styles2}>
            <h2>{account.username}</h2>
          </Col>
        </Row>
      </Container>
      {/* <div>
        <div style={styles1}>

        </div>
        <div style={styles2}>
        </div>
      </div> */}
      <div className="MuiBox-root">
        <Nav
          fill
          variant="tabs"
          defaultActiveKey="/home"
          activeKey={activeKey}
          onSelect={handleSelect}
          >
          <Nav.Item>
            <Nav.Link eventKey="/myaccount">MY ACCOUNT</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/membership">MEMBERSHIP</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/notification">NOTIFICATION</Nav.Link>
          </Nav.Item>
        </Nav>
        <br></br>
        <div className="profile-content-div">
          {activeKey === "/myaccount" && ( <Account childData={account} />)}
          {activeKey === "/membership" && <Membership />}
          {activeKey === "/notification" && <Notification />}
        </div>
      </div>

      <div className="footer--pin">
        <Footer />
      </div>
    </>
  );
}
