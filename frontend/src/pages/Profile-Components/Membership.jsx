import React from "react";
import MyNavbar from "../Navbar-Components/Navbar";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ethers } from "ethers";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../index.css";

const contractABI = require("../../artifacts/contracts/DropKitPass.sol/DropKitPass.json");
toast.configure();

export default function Membership() {
  const contractAddress = "0xA190DA981d7c48694A26b505e4c3543fF5C0C08c";
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [contractInstance, setContractInstance] = useState("");

  const [activeModal, setActiveModal] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  // const [activated, setActivated] = useState(null);

  const handleCardClick = (item) => {
    setActiveItem(item);
    console.log(item);
    if (item.isActive) {
      setActiveModal("ActivatedModal");
    } else {
      setActiveModal("NotActivatedModal");
    }
  };
  const handleClose = () => {
    setActiveModal(null);
  };

  async function ActivatePass() {
    try {
      console.log(activeItem);
      const result = await contractInstance.getActivatedTokenByOwner(address);
      console.log(result.toNumber());
      if (result.toNumber() == 0) {
        // console.log("Hey")
        // console.log(contractInstance);
        // console.log(activeItem.tokenID);
        const tx = await contractInstance.activatePass(activeItem.tokenID);
        toast("Transaction Initiated!");
        handleClose();
        await tx.wait();
        toast("Congratulation, your pass is activated now!");
        console.log("Transaction completed!");
        window.location.reload(false);
      } else {
        handleClose();
        toast("You already have an activated pass");
      }
    } catch (error) {
      console.error(error); // Replace with your desired error handling
    }
  }

  async function DeactivatePass() {
    try {
      console.log("HERE", activeItem);
      const tx = await contractInstance.deactivatePass(activeItem.tokenID);
      toast("Transaction Initiated!");
      handleClose();
      await tx.wait();
      console.log("Transaction completed!");
      toast("Congratulation, your pass is deactivated now!");
      window.location.reload(false);
    } catch (error) {
      handleClose();
      console.error(error); // Replace with your desired error handling
    }
  }

  let tokenIDs = [];
  useEffect(() => {
    console.log("Hello");
    async function connectToMetamask() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        const MaticProvider = new ethers.providers.JsonRpcProvider(
          "https://rpc-mumbai.maticvigil.com"
        );
        const maticSigner = provider.getSigner();
        const maticContract = new ethers.Contract(
          contractAddress,
          contractABI.abi,
          maticSigner
        );
        const signerAddress = await maticSigner.getAddress();
        setContractInstance(maticContract);
        setAddress(signerAddress);

        const state = (await maticContract.balanceOf(signerAddress)).toNumber();
        for (let i = 0; i < state; i++) {
          const tokenID = (
            await maticContract.tokenOfOwnerByIndex(signerAddress, i)
          ).toNumber();
          const address = await maticContract.getActivatedOwnerByToken(tokenID);
          if (address != "0x0000000000000000000000000000000000000000") {
            tokenIDs.push({ tokenID: tokenID, isActive: true });
          } else {
            tokenIDs.push({ tokenID: tokenID, isActive: false });
          }
        }
        if (state !== "") {
          setData(tokenIDs);
          setIsLoading(false);
        }
      } else {
        console.log("Metamask not found!");
      }
    }

    connectToMetamask();

    return () => {
      setAddress("");
      setContractInstance("");
      setActiveModal(null);
      setActiveItem(null);
      setIsLoading(null);
      setData(null);
    };
  }, []);

  return (
    <>
      <Container>
        <Row>
          <div className="mint-creator-button">
            <Button as={Link} to="/pass" variant="dark" size="lg">
              Mint Creator Pass
            </Button>
            <br></br>
          </div>
        </Row>
        <br></br>

        <Row>
          <div className="mint-creator-button">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <Row className="g-4">
                {data.map((e, idx) => (
                  <Col>
                    <Card key={idx} onClick={() => handleCardClick(e)}>
                      <Card.Img variant="top" src="holder.js/100px160" />
                      <Card.Body>
                        <Card.Title>Token ID- {e.tokenID}</Card.Title>
                        <Card.Text>
                          BASIC CREATOR PASS
                          {e.isActive ? (
                            <div>ACTIVATED</div>
                          ) : (
                            <div>NOT ACTIVATED</div>
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}

                <Modal
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  show={activeModal === "NotActivatedModal"}
                  onHide={handleClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                      Activate ReignLabs Creator Pass
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Welcome and gm! If you currently hold a Creator Pass,
                      you'll need to activate it to receive special access on
                      the ReignLabs platform.
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="dark" onClick={ActivatePass}>
                      ACTIVATE MY PASS
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  show={activeModal === "ActivatedModal"}
                  onHide={handleClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                      Deactivate ReignLabs Creator Pass
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Welcome and gm! If you currently hold a Creator Pass,
                      you'll need to activate it to receive special access on
                      the ReignLabs platform.
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="dark" onClick={DeactivatePass}>
                      DEACTIVATE MY PASS
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Row>
            )}
          </div>
        </Row>
      </Container>
    </>
  );
}
