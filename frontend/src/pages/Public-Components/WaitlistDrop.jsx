import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function WaitlistDrop() {
  const [address, setAddress] = useState("");
  const [show, setShow] = useState(false);
  const [walletAddress, setWalletAddress] = useState(address);
  const { id } = useParams();
  useEffect(() => {
    async function getAddress() {
      // First, check if the user has MetaMask installed
      if (typeof window.ethereum !== "undefined") {
        // Connect to MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.enable();
        // Get the user's address
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
      } else {
        setAddress("Please install MetaMask");
      }
    }
    getAddress();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event) => {
    console.log(id);
    event.preventDefault();
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_PRODUCTION_URL + "/createPresalelistEntry",
        {
          collectionID: id,
          addedVia: "Waitlist",
          walletAddress: walletAddress,
          quantity: 1,
        },
        { withCredentials: true }
      );
      console.log(data);
    } catch (ex) {
      console.log(ex);
    }
    handleClose();
  };

  const handleWalletAddressChange = (event) => {
    setWalletAddress(event.target.value);
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <hr></hr>
        <h2>Presale/Registration Page</h2>
        <h2>Connected Wallet - {address}</h2>
        <h2>Fuzzy Mondays</h2>
        <h2>0xA190DA981d7c48694A26b505e4c3543fF5C0C08c . 5% Royalty</h2>
        <hr></hr>
      </div>
      <div style={{ textAlign: "center" }}>
        <Button size="lg" variant="dark" onClick={handleShow}>
          JOIN WAITLIST
        </Button>
      </div>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Presale Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formWalletAddress">
              <Form.Label>WALLET ADDRESS</Form.Label>
              <Form.Control
                type="text"
                placeholder={address}
                value={walletAddress}
                onChange={handleWalletAddressChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            variant="outline-dark"
            onClick={handleSubmit}
          >
            SUBMIT
          </Button>
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            variant="dark"
            onClick={handleClose}
          >
            CANCEL
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
