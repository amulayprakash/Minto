import Container from "react-bootstrap/Container";
import { useEffect, useState, useRef } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ethers } from "ethers";
import { OverlayTrigger, Popover } from "react-bootstrap";  
// import Popover from 'react-bootstrap/Popover';

import axios from "axios";
import Button from "react-bootstrap/Button";
import "../../index.css";
import logo from "../../assets/LogoMinto.png";
const PREFIX = "REIGNKIT-";

function MyNavbar(props) {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [navbarSticky, setNavbarSticky] = useState(false);

  const [address, setAddress] = useState(() => {
    const key = PREFIX + "address";
    const account = localStorage.getItem(key);
    if (account == null || account == undefined) return null;
    return JSON.parse(account);
  });

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    const verifyUser = async () => {
      console.log(cookies);
      if (!cookies.jwt) {
        navigate("/register");
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

        console.log(data);
        props.onData(data);
        if (!data.status) {
          // removeCookie("jwt");
          navigate("/login");
        } else {
          console.log("Loggedin successfully!");
          // navigate("/dashboard");
        }
      }
    };

    verifyUser();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      setNavbarSticky(false);
      setAddress(() => {
        const key = PREFIX + "address";
        const account = localStorage.getItem(key);
        if (account == null || account == undefined) return null;
        return JSON.parse(account);
      });
    };
  }, [cookies, navigate, removeCookie]);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 0) {
      setNavbarSticky(true);
    } else {
      setNavbarSticky(false);
    }
  };

  const detectEthereumProvider = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      setAddress(signerAddress);
      const key = PREFIX + "address";
      localStorage.setItem(key, JSON.stringify(signerAddress));
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const logOut = () => {
    removeCookie("jwt");
    console.log("Logout called")
    // navigate("/dashboard");
    window.location.reload();
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky={navbarSticky ? "top" : ""}
      className={navbarSticky ? "shadow my-nav" : "my-nav"}
    >
      <Container className="navbar-content">
        {/* <Navbar.Brand as={Link} to="/dashboard">ReignLabs</Navbar.Brand> */}
        {/* <Navbar.Brand as={Link} to="/dashboard">

        </Navbar.Brand> */}
        <Container>
          <Navbar.Brand as={Link} to="/dashboard">
            <img
              alt=""
              src={logo}
              width="35"
              height="35"
              className="d-inline-block align-top"
            />{' '}
            Minto
          </Navbar.Brand>
        </Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Link as={Link} to="/login">Login</Nav.Link> */}
            {/* <Nav.Link as={Link} to="/register">Signup</Nav.Link> */}
            <Nav.Link className="special-nav-link" as={Link} to="/profile">
              Profile
            </Nav.Link>
            <Nav.Link className="special-nav-link" onClick={logOut}>Logout</Nav.Link>
            {/*             
            <NavDropdown title="Profile" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/dashboard">Home</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/profile">Account</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Help</NavDropdown.Item>
              <NavDropdown.Item onClick={logOut}>Logout</NavDropdown.Item>
            </NavDropdown> */}

            {!address ? (
              <Button
                onClick={detectEthereumProvider}
                size="md"
                variant="outline-light"
              >
                Connect
              </Button>
            ) : (
              <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={
                <Popover id="popover-basic">
                <Popover.Header as="h3">{address}</Popover.Header>
              </Popover>
              }
            >
              <Nav.Link className="special-nav-link">
                {address.substring(0,4)+"..."}
              </Nav.Link>
              </OverlayTrigger>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
