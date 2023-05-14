import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import { keccak256 } from "js-sha3";
import Papa from "papaparse";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
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

  const [parsedData, setParsedData] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [values, setValues] = useState([]);
  useEffect(() => {
    const getCollections = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_PRODUCTION_URL +
            `/viewPreSaleListbyCollectionID?collectionID=${id}`
        );
        // console.log(res.data);
        setPresalelist(res.data);
        // console.log((res.data[0].createdAt).toLocaleDateString());
        setIsLoading(false);
      } catch (err) {
        console.error(err.message);
        setIsLoading(false);
      }
    };
    getCollections();

    return () => {
      setModalShow(false);
      setIsLoading(true);
      setPresalelist(null);

      setAddress("");
      setQuantity("");
    };
  }, []);

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });
        setParsedData(results.data);
        setTableRows(rowsArray[0]);
        setValues(valuesArray); 

      },
    });
  };

  const handleAddAddress = async (event) => {
    // console.log(address,quantity); 
    console.log(id);
    event.preventDefault();
    try {
      const document={
        collectionID: id,
        addedVia: "Manual",
        walletAddress: address.toLowerCase(),
        quantity: quantity,
      }
      const { data } = await axios.post(
        process.env.REACT_APP_PRODUCTION_URL + "/createPresalelistEntry",
        {
          documents:[document]
        },
        { withCredentials: true }
      );
      console.log(data);
    } catch (ex) {
      console.log(ex);
    } 
    window.location.reload(false);
    handleModalClose();
  };  

  const handleAddAddressCSV = async (event) => {
    event.preventDefault();
    let array=[];
    try {
      for(let i=0;i<values.length; i++){
        let document={ 
            collectionID: id,
            addedVia: "CSV",
            walletAddress: values[i][0].toLowerCase(),
            quantity: values[i][1], 
        };
        array.push(document); 
      }

      const { data } = await axios.post(
        process.env.REACT_APP_PRODUCTION_URL + "/createPresalelistEntry",
        {
          documents:array
        },
        { withCredentials: true }
      );
      window.location.reload(false);
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
    const myContract = new ethers.Contract(collection.deployedAddress, DropCollection.abi, signer );

    const merkleTree = new MerkleTree(
      presalelist.map(({ walletAddress, quantity }) => {
        return ethers.utils.keccak256(
          ethers.utils.solidityPack(["address", "uint256"], [walletAddress, quantity])
        );
      })
      , ethers.utils.keccak256 
      , { sortPairs: true }  
    ); 
    console.log(merkleTree);
    const buf2hex = (x) => "0x" + x.toString("hex"); 
    console.log("Root -:",buf2hex(merkleTree.getRoot()))

    // const leaves = presalelist.map((item) => {
    //   // const encodedParams = solidityKeccak256(['address', 'uint256'], [item.walletAddress, item.quantity]);
    //   const hash = keccak256(item.walletAddress);
    //   return hash;
    // });

    // console.log(leaves);

    // const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    // const buf2hex = (x) => "0x" + x.toString("hex");
    // const root = buf2hex(tree.getRoot());
    // console.log("Root -:", root);
    const transaction = await myContract.setMerkleRoot(buf2hex(merkleTree.getRoot()));
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
      <div className="drop-button-row">
        <Button
          style={{ borderRadius: 0 }}
          variant="outline-dark"
          onClick={handleButtonClick}
        >
          IMPORT/ADD
        </Button>
        <OverlayTrigger placement="bottom" overlay={
            <Tooltip id="tooltip-text">
              Publish the Merkle Root for the Waitlist Addresses
            </Tooltip>}>
        <Button
          style={{ borderRadius: 0, marginLeft: "0.2rem" }}
          variant="outline-dark"
          onClick={handlePublishButton}
          >
          PUBLISH
        </Button>
        </OverlayTrigger>
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
            <p>Loading...</p>
          ) : presalelist.length === 0 ? (
            <p>No Address Found</p>
          ) : (
            <>
              {presalelist.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.createdAt}</td>
                  {/* <td>{item.createdAt.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td> */}
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
          <input
            type="file"
            name="file"
            onChange={changeHandler}
            accept=".csv"
            style={{ display: "block", margin: "10px auto", paddingLeft: "2rem" }}
          />
          <br></br>
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={handleAddAddressCSV}
            variant="dark"
          >
            UPLOAD ADDRESSES VIA CSV
          </Button>{" "}
          <br></br>
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
            ADD AN ADDRESS MANUALLY
          </Button>{" "}
          <br></br>
        </Modal.Footer>
      </Modal>
    </>
  );
}
