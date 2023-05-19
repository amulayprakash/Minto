import React from "react";
import MyNavbar from "../Navbar-Components/Navbar";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ethers } from "ethers";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer-Components/Footer";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const contractABI = require("../../artifacts/contracts/DropKitPass.sol/DropKitPass.json");
toast.configure();

export default function MintPass() {
  const contractAddress = "0xA190DA981d7c48694A26b505e4c3543fF5C0C08c";
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [contractInstance, setContractInstance] = useState("");
  // const [childData, setChildData] = useState('');
  const handleChildData = (data) => {
    // setChildData(data);
    console.log(data);
  };

  useEffect(() => {
    async function connectToMetamask() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.enable();

        const MaticProvider = new ethers.providers.JsonRpcProvider(
          "https://rpc-mumbai.maticvigil.com"
        );
        const maticSigner = provider.getSigner();
        const maticContract = new ethers.Contract(
          contractAddress,
          contractABI.abi,
          maticSigner
        );

        setContractInstance(maticContract);
        console.log(maticContract);
        setAddress(await provider.getSigner().getAddress());
      } else {
        console.log("Metamask not found!");
      }
    }

    connectToMetamask();

    return () => {
      setAddress("");
      setContractInstance("");
    };
  }, []);
  const styles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "20vh",
    width: "100%",
    paddingLeft: "20rem",
    paddingRight: "20rem"
  };

  async function handleClick() {
    try {
      const tx = await contractInstance.purchasePass(1, 500, 1, address);
      toast("Transaction Initiated!");
      navigate("/profile");
      await tx.wait();
      console.log("Transaction completed!");
      toast("Congratulations, you minted a pass!");
    } catch (error) {
      console.error(error); // Replace with your desired error handling
    }
  }
  // console.log("Called from card",process.env.REACT_APP_PRODUCTION_URL + `/uploads/${collection.banner}`)

  return (
    <>
      <MyNavbar onData={handleChildData}></MyNavbar>
      <div style={styles}>
        <h2 style={{fontWeight:"bold"}}> 
          CREATOR PASS MINTING PAGE
        </h2>
        {/* <h2>
        Great! You are about to mint an NFT on Minto. Before you proceed, 
        please note that we offer three different types of passes - Basic, Advanced, and Pro. 
        Each pass offers varying degrees of access to the features of our Node code NFT creation website.
        </h2> */}
      </div>
      <Container className="pass-cards-outer-div">
        <Row>
          <Col>
            <Card style={{ width: "22rem", marginLeft: "2rem", marginRight: "2rem" }}>

              <Card.Img variant="top" src={ process.env.REACT_APP_PRODUCTION_URL + `/uploads/pass/CREATOR_PASS_BASIC.png`} />
              <Card.Body>
                {/* <Card.Title>Basic Pass</Card.Title> */}
                <Card.Text>
                Best for those getting started and learning smart contracts and NFTs.
                <ul>
                  <li>
                  5% primary sales fees
                  </li>
                  <li>
                  Basic Support (48 hours)
                  </li>
                </ul>
                </Card.Text>
                <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handleClick} variant="dark" size="lg">
                BUY WITH CRYPTO
                </Button> <br></br>
                <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handleClick} variant="dark" size="lg" disabled>
                BUY WITH CREDIT CARD
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ width: "22rem", marginLeft: "2rem", marginRight: "2rem" }}>
            <Card.Img variant="top" src={ process.env.REACT_APP_PRODUCTION_URL + `/uploads/pass/CREATOR_PASS_ADVANCED.png`} />
              <Card.Body>
                {/* <Card.Title>Advanced Pass</Card.Title> */}
                <Card.Text>
                Best for creators who want more flexibility over their NFT projects.
                <ul>
                  <li>
                  2.5% primary sales fees
                  </li>
                  <li>
                  priority Support (24 hours)
                  </li>
                </ul>
                </Card.Text>
                <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handleClick} variant="dark" size="lg" disabled>
                BUY WITH CRYPTO
                </Button> <br></br>
                <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handleClick} variant="dark" size="lg" disabled>
                BUY WITH CREDIT CARD
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ width: "22rem", marginLeft: "2rem", marginRight: "2rem" }}>
            <Card.Img variant="top" src={ process.env.REACT_APP_PRODUCTION_URL + `/uploads/pass/CREATOR_PASS_PRO.png`} />
              <Card.Body>
                {/* <Card.Title>Pro Pass</Card.Title> */}
                <Card.Text>
                Best for creators who want more flexibility over their NFT projects.
                <ul>
                  <li>
                  0% primary sales fees
                  </li>
                  <li>
                  priority Support (48 hours)
                  </li>
                </ul>
                </Card.Text>
                <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handleClick} variant="dark" size="lg" disabled>
                BUY WITH CRYPTO
                </Button> <br></br>
                <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handleClick} variant="dark" size="lg" disabled>
                BUY WITH CREDIT CARD
                </Button>
                </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <div className="footer--pin">
        <Footer />
      </div>
    </>
  );
}
