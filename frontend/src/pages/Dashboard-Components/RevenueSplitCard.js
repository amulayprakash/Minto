import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import RevenueSplit from "../../artifacts/contracts/RevenueSplit.sol/RevenueSplit.json";
import revenueSplitLogo from "../../assets/icons8-split-64.png";
import "../../index.css";

export default function RevenueSplitCard({split,idx}) {
    const [showModal, setShowModal] = useState(false);

    const handleButtonClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDeployContract = async (event) => {
    
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      // console.log(userAddress);

      const factory = new ethers.ContractFactory(RevenueSplit.abi,RevenueSplit.bytecode,signer);
      // console.log("handleDeployContract",factory);
      // console.log(split);
      const contract = await factory.deploy(split.addresses,split.splits);
      await contract.deployed();
  
      // console.log("Contract deployed successfully", contract.address);
      try {
        const response = await axios.put(
          process.env.REACT_APP_PRODUCTION_URL +
            `/updateRevenueSplit?splitID=${split._id}&address=${contract.address}`
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
      window.location.reload(false);
      event.preventDefault();
      handleCloseModal();
    };

  return (
    <>
        <Card key={idx} onClick={handleButtonClick}>
        <Container>
            <Row>
            <Col md={1} style={{overflow: 'hidden',paddingLeft:'0',paddingRight:'0'}}>
              <img
                alt=""
                src={revenueSplitLogo}
                style={{width: '100%',height: '100%', objectFit:'cover'}}
              />
                {/* <Card.Img variant="top"  width="20" height="50" /> */}
            </Col>
            <Col md={11}>
                <Card.Header>{split.name}</Card.Header>
                <Card.Body>
                {/* <Card.Title>Special title treatment</Card.Title> */}
                <Card.Text>
                    {split.splits.length} Recipitents . {!split.isDeployed? "Draft" : "Live"} . {split.network}
                </Card.Text>
                </Card.Body>
            </Col>
            </Row>
        </Container>
        </Card>

        <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
          Revenue Split - {split.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            !split.isDeployed ?
           <>
           </> :
           <>
           <br></br>
           <a target ="_blank" href={`https://mumbai.polygonscan.com/address/${split.deployedAddress}`}>Link to deployed contract</a>
           </>
          }
                <hr></hr> 
                {split.addresses.map((address, nameIndex) => (
                    <>
                        {address}- {split.splits[nameIndex]}% of revenue (minus sales fees)
                        <hr></hr> 
                    </>
                ))}
        </Modal.Body>
        <Modal.Footer>

          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={handleCloseModal}
            variant="dark"
          >
            CANCEL
          </Button>{" "}
          {/* <br></br> */}
          {
            !split.isDeployed ?
           <>
            <Button
              style={{ display: "block", width: "100%", boxSizing: "border-box" }}
              onClick={() => {handleDeployContract();}}
              variant="dark"
            >
              DEPLOY
            </Button>{" "}
            <br></br>
           </> :
           <>
           </>
          }
        </Modal.Footer>
      </Modal>

    </>
  )
}
