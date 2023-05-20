import Container from "react-bootstrap/Container";
import { useEffect, useState, useRef } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ethers } from "ethers";
import axios from "axios";
import Button from "react-bootstrap/Button";
import "../../index.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Popover from "react-bootstrap/Popover";

import logo from "../../assets/LogoMinto.png";
const PREFIX = "REIGNKIT-";

function AuthNavbar(props) {
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
    setNavbarSticky(false);
    setAddress(null);

    const verifyUser = async () => {
      if (!cookies.jwt) {
        console.log("Yeahh");
        // navigate("/register");
      } else {
        const { data } = await axios.post(
          process.env.REACT_APP_PRODUCTION_URL,
          {},
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else console.log("Loggedin successfully!");
      }
    };

    verifyUser();
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
      props.onData(signerAddress);
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const logOut = () => {
    removeCookie("jwt");
    navigate("/");
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky={navbarSticky ? "top" : ""}
      className={navbarSticky ? "shadow my-nav" : "my-nav"}
    >
      <Container>
        <Container>
          <Navbar.Brand className="ali" as={Link} to="/dashboard">
            <div className="align">
              <img
                alt=""
                src={logo}
                width="35"
                height="35"
                className="d-inline-block align-top"
              />{" "}
              minto
            </div>
          </Navbar.Brand>
        </Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="special-nav-link" as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link className="special-nav-link" as={Link} to="/register">
              Signup
            </Nav.Link>

            {/* <NavDropdown title="Profile" id="basic-nav-dropdown">
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
                  {address.substring(0, 4) + "..."}
                </Nav.Link>
              </OverlayTrigger>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AuthNavbar;
