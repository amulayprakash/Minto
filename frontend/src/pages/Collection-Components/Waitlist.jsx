import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import { keccak256 } from "js-sha3";
// import { solidityKeccak256 } from 'ethereumjs-abi';
import DropCollection from "../../artifacts/contracts/DropCollection.sol/DropCollection.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { MerkleTree } = require("merkletreejs");

export default function Waitlist({ collection }) {
  const [modalShow, setModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [presalelist, setPresalelist] = useState(null);

  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState("");

  const { id } = useParams();
  const handleModalClose = () => setModalShow(false);
  const handleButtonClick = () => setModalShow(true);

  useEffect(() => {
    const getCollections = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_PRODUCTION_URL +
            `/viewPreSaleListbyCollectionID?collectionID=${id}`
        );
        console.log(res.data);
        setPresalelist(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err.message);
        setIsLoading(false);
      }
    };
    getCollections();
  }, []);

  const handleAddAddress = async (event) => {
    // console.log(address,quantity);
    console.log(id);
    event.preventDefault();
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_PRODUCTION_URL + "/createPresalelistEntry",
        {
          collectionID: id,
          addedVia: "Manual",
          walletAddress: address,
          quantity: quantity,
        },
        { withCredentials: true }
      );
      console.log(data);
    } catch (ex) {
      console.log(ex);
    }

    handleModalClose();
  };

  const handlePublishButton = async (event) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable();
    const signer = provider.getSigner();
    const myContract = new ethers.Contract(
      collection.deployedAddress,
      DropCollection.abi,
      signer
    );

    const leaves = presalelist.map((item) => {
      // const encodedParams = solidityKeccak256(['address', 'uint256'], [item.walletAddress, item.quantity]);
      const hash = keccak256(item.walletAddress);
      return hash;
    });

    console.log(leaves);

    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const buf2hex = (x) => "0x" + x.toString("hex");
    const root = buf2hex(tree.getRoot());
    console.log("Root -:", root);
    const transaction = await myContract.setMerkleRoot(root);
    toast("Transaction Initiated To Set The Merkle Root");
    await transaction.wait();
    toast("Merkle Root Updated");
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div class="drop-button-row">
        <Button
          style={{ borderRadius: 0 }}
          variant="outline-dark"
          onClick={handleButtonClick}
        >
          IMPORT/ADD
        </Button>
        <Button
          style={{ borderRadius: 0, marginLeft: "0.2rem" }}
          variant="outline-dark"
          onClick={handlePublishButton}
        >
          PUBLISH
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
            <th>Date Added</th>
            <th>Added Via</th>
            <th>Wallet Address</th>
            {/* <th>ENS</th> */}
            <th>Quanity</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr> */}
          {isLoading ? (
            <div>Loading...</div>
          ) : presalelist.length === 0 ? (
            <p>No Address Found</p>
          ) : (
            <>
              {presalelist.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.createdAt}</td>
                  <td>{item.addedVia}</td>
                  <td>{item.walletAddress}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </>
          )}
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
            Setup Presale List
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Configure your presale list by either uploading a CSV file or adding
            individual wallet addresses and quantity. New entries will be
            appended to the existing presale list. Uploading a new CSV will not
            overwrite your existing presale list or waitlist data.
          </p>
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
          {/* <Button variant="outline-dark" onClick={handleAddAddress}>Add</Button> */}
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={handleModalClose}
            variant="dark"
          >
            CLOSE
          </Button>{" "}
          <br></br>
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={handleAddAddress}
            variant="dark"
          >
            ADD ADDRESS
          </Button>{" "}
          <br></br>
        </Modal.Footer>
      </Modal>
    </>
  );
}
