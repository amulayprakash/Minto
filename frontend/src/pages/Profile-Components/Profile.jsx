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
import Spinner from 'react-bootstrap/Spinner';
import Membership from "./Membership";
import Notification from "./Notification";
import Footer from "../Footer-Components/Footer";
import "../../index.css";

export default function Profile() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  
  const [activeKey, setActiveKey] = useState("/myaccount");

  const [isLoading, setisLoading] =useState(true);

  const handleSelect = (selectedKey) => {
    setActiveKey(selectedKey);
    localStorage.setItem('activeKey', selectedKey);
  };

  const [childData, setChildData] = useState("");

  const handleChildData = (data) => {
    // console.log("Data in profile -",data);
    setChildData(data.user);
    setisLoading(false);
  };

  useEffect(() => {
    console.log("Called");
    const savedActiveKey = localStorage.getItem('activeKey');
    if (savedActiveKey) {
      setActiveKey(savedActiveKey);
    }

    return () => {
      localStorage.removeItem('activeKey');
    };
  }, [cookies, navigate, removeCookie,childData]);

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
      {
      isLoading?
        <div style={{textAlign:"center"}}>
          <Spinner animation="grow" />
        </div>
        :
        <>
      <Container>
        <Row>
          <Col style={styles1}>
           <Button as={Link}  to="/dashboard" variant="outline-dark" size="md">
              {"<- BACK TO DASHBOARD"}
            </Button>
          </Col>
          <Col xs={6} style={styles1}>
            <img className="profile-image" src={process.env.REACT_APP_PRODUCTION_URL + `/${childData.photo}`}/>
          </Col>
          <Col style={styles1}>
          </Col>
        </Row> 
        <Row>
          <Col style={styles2}>
            <h2>{childData.username}</h2>
          </Col>
        </Row>
      </Container>

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
          {activeKey === "/myaccount" && ( <Account childData={childData} setChildData={setChildData} />)}
          {activeKey === "/membership" && <Membership />}
          {activeKey === "/notification" && <Notification />}
        </div>
      </div>
        </>
      }

      <div className="footer--pin">
        <Footer />
      </div>
    </>
  );
}
