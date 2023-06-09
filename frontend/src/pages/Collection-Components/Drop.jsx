import React from "react";
import { Card, Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useEffect, useState, useRef } from "react";
import MyNavbar from "../Navbar-Components/Navbar";
import Footer from "../Footer-Components/Footer";
import { useParams } from "react-router-dom";
import Papa from "papaparse";
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

import jf from "./../../assets/jf.png";
import ml from "./../../assets/ml.png";

import "react-toastify/dist/ReactToastify.css";
import "../../index.css";

export default function Drop({ collection }) {
  const [modalShow, setModalShow] = useState(false);
  const [modal2Show, setModal2Show] = useState(false);
  const [modal3Show, setModal3Show] = useState(false);
  const [modal4Show, setModal4Show] = useState(false);
  const [modal6Show, setModal6Show] = useState(false);
  const [modal7Show, setModal7Show] = useState(false);

  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState("");
  const [title, setTitle] = useState("");
  const [preRevealImage, setpreRevealImage] = useState("");
  const [description, setDescription] = useState("");

  const [revealArray, setRevealArray] = useState([]);
  const [revealIndex, setRevealIndex] = useState({
    stIndx: 0,
    endIdx: 0,
  });
  const [unrevealed, setUnrevealed] = useState({});

  const handleModalClose = () => setModalShow(false);
  const handleModal2Close = () => setModal2Show(false);
  const handleModal3Close = () => setModal3Show(false);
  const handleModal4Close = () => setModal4Show(false);
  const handleModal6Close = () => setModal6Show(false);
  const handleModal7Close = () => setModal7Show(false);

  const handleButtonClick = () => setModalShow(true);
  const handleButton2Click = () => setModal2Show(true);
  const handleButton3Click = () => setModal3Show(true);
  const handleButton4Click = () => setModal4Show(true);
  const handleButton6Click = () => setModal6Show(true);
  const handleButton7Click = () => setModal7Show(true);

  const [parsedData, setParsedData] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [values, setValues] = useState([]);

  const [inpFile, setInpFile] = useState(null);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const run1 = async () => {
      try {
        const { data } = await axios.get(
          process.env.REACT_APP_PRODUCTION_URL +
            "/jsonreturn/placeholder/json/" +
            collection._id
        );

        setUnrevealed(() => data.data);
      } catch (err) {
        console.log(err);
      }
    };
    const run2 = async () => {
      try {
        const { data } = await axios.get(
          process.env.REACT_APP_PRODUCTION_URL + "/jsonreturn/" + collection._id
        );

        setRevealArray(() => data.res.resultData);
      } catch (err) {
        console.log(err);
      }
    };

    run1();
    run2();
  }, [trigger]);

  console.log(unrevealed);

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
    window.location.reload(false);
    await transaction.wait();
    toast("AirDrop Done Successfully!");
    // console.log(event);
  };

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

  const handleAirdropCSV = async (event) => {
    event.preventDefault();
    let addresses = [];
    let quantities = [];
    console.log(values);
    for (let i = 0; i < values.length; i++) {
      addresses.push(values[i][0]);
      quantities.push(Number(values[i][1]));
    }
    console.log(addresses);
    console.log(quantities);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.enable();
      const signer = provider.getSigner();
      const myContract = new ethers.Contract(
        collection.deployedAddress,
        DropCollection.abi,
        signer
      );
      const transaction = await myContract.batchAirdrop(quantities, addresses);
      toast("Transaction Started");
      handleModalClose();
      // window.location.reload(false);
      await transaction.wait();
      toast("AirDrop Done Successfully!");
    } catch (ex) {
      console.log(ex);
    }

    handleModalClose();
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

  // DROP JSON FUNCTIONS
  const handleFileUpload = (e) => {
    try {
      const metadata = e.target.files[0];
      console.log(e.target.files[0]);

      if (!metadata.type.includes("json")) {
        toast("Cannot accept files other than JSON");
        e.target.value = null;
      }
      setInpFile(() => e.target.files[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUploadAsset = async () => {
    try {
      const formData = new FormData();
      if (!inpFile) {
        throw new Error("No file uploaded!");
      }
      formData.append("file", inpFile);
      formData.append("id", collection._id);
      formData.append("collectionID", collection.collectionID);

      const { data } = await axios.post(
        process.env.REACT_APP_PRODUCTION_URL + "/jsonreturn/" + collection._id,
        formData,
        { withCredentials: true }
      );

      setRevealArray(() => data.data);
      handleModal3Close();

      toast(data.msg);

      console.log(data);
    } catch (err) {
      console.log(err);
      toast(err?.message || "Something went wrong!");
    }
  };

  const handleRevealNft = async () => {
    try {
      console.log(revealIndex);
      if (revealIndex.stIndx <= 0 || revealIndex.endIdx > revealArray.length) {
        throw new Error(
          `The index can be greater than 0 and less than ${revealArray.length}`
        );
      }

      const { data } = await axios.post(
        process.env.REACT_APP_PRODUCTION_URL +
          "/jsonreturn/update/revealstatus",
        {
          collectionId: collection._id,
          startIndex: revealIndex.stIndx - 1,
          endIndex: revealIndex.endIdx - 1,
        },
        { withCredentials: true }
      );
      setTrigger((curr) => !curr);

      handleModal4Close();
    } catch (err) {
      console.log(err);
      toast(err?.message || "Something went wrong!");
    }
  };

  const handleUploadPlaceholderAsset = async () => {
    try {
      const formData = new FormData();
      if (!inpFile) {
        throw new Error("No file uploaded!");
      }
      formData.append("file", inpFile);
      formData.append("id", collection._id);
      formData.append("collectionID", collection.collectionID);

      const { data } = await axios.post(
        process.env.REACT_APP_PRODUCTION_URL +
          "/jsonreturn/placeholder/" +
          collection._id +
          "-placeholder",
        formData,
        { withCredentials: true }
      );

      toast(data.msg);

      setTrigger((curr) => !curr);
    } catch (err) {
      console.log(err);
      toast(err?.message || "Something went wrong!");
    }
  };

  const setBaseURIcontract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable();
    const signer = provider.getSigner();
    const myContract = new ethers.Contract(
      collection.deployedAddress,
      DropCollection.abi,
      signer
    );
    const transaction =
      // await myContract.startSale(
      //   NFTCount,
      //   quantityT,
      //   quantityW,
      //   perNFTPrice,
      //   true
      // );
      toast("Transaction Started");
    handleModal2Close();
    await transaction.wait();

    toast("Base URI set seccessfully");
  };
  return (
    <>
      <div className="drop-button-row">
        <Button
          style={{ borderRadius: 0 }}
          variant="outline-dark"
          onClick={handleButton7Click}
        >
          IMPORT ASSETS
        </Button>
        {collection.isDeployed ? (
          <>
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
              onClick={handleButton4Click}
            >
              REVEAL ASSETS
            </Button>
            {/* <Button
          style={{ borderRadius: 0, marginLeft: "0.2rem" }}
          variant="outline-dark"
          onClick={handleButton6Click}
        >
          SET BASE URI
        </Button> */}
          </>
        ) : (
          <></>
        )}
      </div>
      <br></br>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Token ID</th>
            <th>Name</th>
            {/* <th>Description</th> */}
            <th>Revealed</th>
            <th>Minted</th>
          </tr>
        </thead>
        <tbody>
          {collection.isDeployed ? (
            <>
              <tr>
                <td>
                  <Button
                    style={{ borderRadius: 0 }}
                    variant="outline-dark"
                    onClick={handleButton2Click}
                  >
                    SET REVEAL PLACEHOLDER's
                  </Button>
                </td>
                <td>
                  {collection.preRevealName ? collection.preRevealName : <></>}
                </td>
                {/* <td>
                  {collection.preRevealDescription ? (
                    collection.preRevealDescription
                  ) : (
                    <></>
                  )}
                </td> */}
                <td>-</td>
                <td>-</td>
              </tr>
            </>
          ) : (
            <></>
          )}

          {revealArray.map((curr, i) => {
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{curr.name}</td>
                <td>{curr.reveal === 1 ? "Yes" : "No"}</td>
                <td>No</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
        onHide={handleModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            AirDrop NFTs
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Air dropping NFTs is a great way to distribute your digital assets
            to a large group of people quickly and efficiently. You can do this
            by uploading a CSV file containing the addresses and quantities, or
            by manually entering each address and quantity. Either way, make
            sure to double-check your list before you initiate the drop to avoid
            any mistakes. Happy air dropping!
          </p>
          <input
            type="file"
            name="file"
            onChange={changeHandler}
            accept=".csv"
            style={{
              display: "block",
              margin: "10px auto",
              paddingLeft: "2rem",
            }}
          />
          <br></br>
          <Button
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
            }}
            onClick={handleAirdropCSV}
            variant="dark"
          >
            {" "}
            AIRDROP NFTs VIA CSV{" "}
          </Button>{" "}
          <br></br>
          <hr></hr>
          <p>Or Airdrop Manually</p>
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
        </Modal.Footer>
      </Modal>

      {/* UNUSED */}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modal2Show}
        onHide={handleModal2Close}
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

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modal3Show}
        onHide={handleModal3Close}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            UPLOAD ASSETS (JSON FILE)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            To download sample json file:{" "}
            <em>
              <Link to="/file/sample-data.json" target="_blank" download>
                Click Here
              </Link>
            </em>
          </h5>

          <div>
            <br />
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>
                <h3> Upload the Metadata JSON File</h3>
              </Form.Label>
              <Form.Control
                onChange={(e) => handleFileUpload(e)}
                type="file"
                size="lg"
                accept=".json"
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            variant="dark"
            onClick={handleUploadAsset}
          >
            UPLOAD ASSETS
          </Button>{" "}
          <br></br>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modal4Show}
        onHide={handleModal4Close}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Set NFT reveal status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form.Label>
              <h3>Start Index</h3>
            </Form.Label>
            <Form.Control
              type="Number"
              placeholder="Starting index of NFT to be revealed"
              min={0}
              value={revealIndex.stIndx}
              onChange={(e) => {
                setRevealIndex((data) => {
                  return { ...data, stIndx: Number(e.target.value) };
                });
              }}
            />
            <br />
            <Form.Label>
              <h3>Ending Index</h3>
            </Form.Label>

            <Form.Control
              type="Number"
              placeholder="Ending index of NFT to be revealed"
              max={revealArray.length}
              min={0}
              value={revealIndex.endIdx}
              onChange={(e) => {
                setRevealIndex((data) => {
                  return { ...data, endIdx: Number(e.target.value) };
                });
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            variant="dark"
            onClick={() => {
              setRevealIndex((data) => {
                return { ...data, stIndx: 1, endIdx: revealArray.length };
              });
            }}
          >
            Select All
          </Button>
          <br />
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            variant="dark"
            onClick={handleRevealNft}
          >
            Reveal these NFTs
          </Button>{" "}
          <br></br>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modal6Show}
        onHide={handleModal6Close}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            SET BASE URI IN CONTRACT
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h5>The base uri will be:</h5>
            <a
              href={`${process.env.REACT_APP_PRODUCTION_URL}/jsonreturn/${collection._id}/`}
            >{`${process.env.REACT_APP_PRODUCTION_URL}/jsonreturn/${collection._id}/`}</a>
          </div>
          <br />
          {collection.isDeployed ? (
            <>
              <Button
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                onClick={handleAirdropCSV}
                variant="dark"
              >
                SET BASE URI
              </Button>{" "}
            </>
          ) : (
            <>
              <Button
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                onClick={setBaseURIcontract}
                variant="dark"
                disabled
              >
                {" "}
                CONTRACT NOT DEPLOYED (DISABLED)
              </Button>{" "}
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modal7Show}
        onHide={handleModal7Close}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            SET BASE URI IN CONTRACT
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <br />
          <div className="options">
            <div className="one-op">
              <img src={jf} alt="" />
              <h5
                onClick={() => {
                  handleModal7Close();
                  handleButton3Click();
                }}
              >
                Upload a metadata JSON file
              </h5>
            </div>
            <div className="two-op">
              <img src={ml} alt="" />
              <a href="https://hashlips.io" target="_blank" rel="noreferrer">
                <h5>Make your collection</h5>
              </a>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
