import React from "react";
import { Card, Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useEffect, useState, useRef } from "react";
import MyNavbar from "../Navbar-Components/Navbar";
import Footer from "../Footer-Components/Footer";
import { useParams } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { ethers } from "ethers";
import DropCollection from "../../artifacts/contracts/DropCollection.sol/DropCollection.json";
import Overview from "./Overview";
import Members from "./Members";
import Form from "react-bootstrap/Form";
import Waitlist from "./Waitlist";
import TokenAccess from "./TokenAccess";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../index.css";

export default function Drop({ collection }) {
  const [modalShow, setModalShow] = useState(false);
  const [modal2Show, setModal2Show] = useState(false);

  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState("");
  const [title, setTitle] = useState("");
  const [preRevealImage, setpreRevealImage] = useState("");
  const [description, setDescription] = useState("");

  const handleModalClose = () => setModalShow(false);
  const handleModal2Close = () => setModal2Show(false);

  const handleButtonClick = () => setModalShow(true);
  const handleButton2Click = () => setModal2Show(true);

  const handleAirdropClick = async (event) => {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable();
    const signer = provider.getSigner();
    const myContract = new ethers.Contract(
      collection.deployedAddress,
      DropCollection.abi,
      signer
    );
    const transaction = await myContract.batchAirdrop([quantity], [address]);
    toast("Transaction Started");
    handleModalClose();
    await transaction.wait();
    toast("AirDrop Done Successfully!");
    // console.log(event);
  };

  const handlePlaceHolderUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("collectionID", collection.collectionID);
    formData.append("preRevealName", title);
    formData.append("preRevealDescription", description);
    formData.append("preRevealImage", preRevealImage);

    console.log(formData);

    axios
      .put(
        process.env.REACT_APP_PRODUCTION_URL + "/updateCollectionPreReveal",
        formData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Response received", response);
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="drop-button-row">
        <Button style={{ borderRadius: 0 }} variant="outline-dark">
          IMPORT ASSETS
        </Button>
        <Button
          style={{ borderRadius: 0, marginLeft: "0.2rem" }}
          variant="outline-dark"
          onClick={handleButtonClick}
        >
          AIRDROP
        </Button>
        <Button
          style={{ borderRadius: 0, marginLeft: "0.2rem" }}
          variant="outline-dark"
        >
          REVEAL
        </Button>
        <Button
          style={{ borderRadius: 0, marginLeft: "0.2rem" }}
          variant="outline-dark"
        >
          CSV EXPORT
        </Button>
        <Button
          style={{ borderRadius: 0, marginLeft: "0.2rem" }}
          variant="outline-dark"
        >
          DELETE
        </Button>
      </div>
      <br></br>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>Token ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Properties</th>
            <th>Reveal Status</th>
            <th>Mint Status</th>
          </tr>
          <tr>
            <th></th>
            <th>Pre-Reveal (N/A)</th>
            <th>
              {collection.preRevealName ? (
                <i>{collection.preRevealName}</i>
              ) : (
                <span>Title</span>
              )}
            </th>
            <th>
              {collection.preRevealDescription ? (
                <i>{collection.preRevealDescription}</i>
              ) : (
                <span>Description</span>
              )}
            </th>
            <th>
              {collection.preRevealImage ? (
                <>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip id="tooltip-text">
                        Prereveal Placeholder Image
                      </Tooltip>
                    }
                  >
                    <img
                      style={{ height: "60px", width: "60px" }}
                      onClick={handleButton2Click}
                      src={
                        process.env.REACT_APP_PRODUCTION_URL +
                        `/uploads/${collection.preRevealImage}`
                      }
                      alt="Prereveal Placeholder"
                    />
                  </OverlayTrigger>
                </>
              ) : (
                <Button
                  style={{ borderRadius: 0 }}
                  onClick={handleButton2Click}
                  variant="outline-dark"
                  size="sm"
                >
                  UPLOAD PRE-REVEAL IMAGE
                </Button>
              )}
            </th>
            <th>N/A</th>
            <th>N/A</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr> */}
        </tbody>
      </Table>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
        onHide={handleModalClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            AirDrop NFTs
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="form-class">
            <Form.Group className="mb-3" controlId="formBasic">
              <Form.Label>ADDRESS</Form.Label>
              <Form.Control
                type="text"
                placeholder="0xB9e76B08227E88D7066d35E9E4355e724dA8030e"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic">
              <Form.Label>QUANTITY</Form.Label>
              <Form.Control
                type="number"
                placeholder="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button onClick={handleModalClose}>Close</Button> */}
          {/* <Button variant="outline-dark" onClick={handleAirdropClick}>Send Transaction</Button> */}
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={handleModalClose}
            variant="dark"
          >
            CLOSE
          </Button>{" "}
          <br></br>
          {collection.isDeployed ? (
            <>
              <Button
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                onClick={handleAirdropClick}
                variant="dark"
              >
                SEND TRANSACTION
              </Button>{" "}
              <br></br>
            </>
          ) : (
            <>
              <Button
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                onClick={handleAirdropClick}
                variant="dark"
                disabled
              >
                CONTRACT NOT DEPLOYED (DISABLED)
              </Button>{" "}
              <br></br>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modal2Show}
        onHide={handleModal2Close}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Set Prereveal Placeholders
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="form-class">
            <Form.Group className="mb-3" controlId="formBasic">
              <Form.Label>TITLE</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic">
              <Form.Label>DESCRIPTION</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic">
              <Form.Label>UPLOAD PRE-REVEAL PLACEHOLDER IMAGE</Form.Label>
              <Form.Control
                type="file"
                onChange={(event) => setpreRevealImage(event.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={handleModal2Close}
            variant="dark"
          >
            CLOSE
          </Button>{" "}
          <br></br>
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={handlePlaceHolderUpdate}
            variant="dark"
          >
            UPDATE THESE VALUES
          </Button>{" "}
          <br></br>
        </Modal.Footer>
      </Modal>
    </>
  );
}
