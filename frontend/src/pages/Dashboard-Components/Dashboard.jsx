import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ethers } from "ethers";
import axios from "axios";
import "../../index.css";
import { toast, ToastContainer } from "react-toastify";
import Container from "react-bootstrap/Container";
import { OverlayTrigger, Popover } from "react-bootstrap";  

// import Dropdown from 'react-bootstrap/Dropdown';
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Button, Dropdown } from "react-bootstrap";
import MyNavbar from "../Navbar-Components/Navbar";
import Footer from "../Footer-Components/Footer";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Collections from "./Collections";
import MyPass from "./MyPass";
import RevenveSplit from "./RevenveSplit";
import { Column } from "../../FooterStyles";

const PREFIX = "MINTO-";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("collections");

  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [showThirdModal, setShowThirdModal] = useState(false);
  const [showFourthModal, setShowFourthModal] = useState(false);

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [url, setUrl] = useState("");

  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [rpercent, setRpercent] = useState("");

  const [image, setImage] = useState("");
  const [banner, setBanner] = useState("");
  const [description, setDescription] = useState("");

  const handleFirstModalClose = () => setShowFirstModal(false);
  const handleFirstModalShow = () => setShowFirstModal(true);
  const handleSecondModalClose = () => setShowSecondModal(false);
  const handleSecondModalShow = () => setShowSecondModal(true);
  const handleThirdModalClose = () => setShowThirdModal(false);
  const handleThirdModalShow = () => setShowThirdModal(true);
  const handleFourthModalClose = () => setShowFourthModal(false);
  const handleFourthModalShow = () => setShowFourthModal(true);
  
  const [activeKey, setActiveKey] = useState("/collections");
  const handleSelectKey = (selectedKey) => {
    setActiveKey(selectedKey);
  };


  useEffect(() => {
    // console.log("sdsdsdsds");

    // console.log("Called from card",process.env.REACT_APP_PRODUCTION_URL);
    // console.log("Called from card",process.env.REACT_APP_PRODUCTION_URL + `/${localStorage.getItem("MINTO-imageURL").replace(/['"]+/g, "")}`);
    // console.log(localStorage.getItem("MINTO-imageURL"));
    return () => {
      setShowFirstModal(false);
      setShowSecondModal(false);
      setShowThirdModal(false);
      setShowFourthModal(false);

      setName("");
      setSymbol("");
      setUrl("");

      setPrimary("");
      setSecondary("");
      setRpercent("");

      setImage("");
      setBanner("");
      setSelectedOption("Polygon Testnet");
    };
  }, []);
  const [selectedOption, setSelectedOption] = useState("Polygon Testnet");

  const handleSelect = (eventKey) => {
    setSelectedOption(eventKey);
  };

  const handleDraftSave = (event) => {
    event.preventDefault();

    // console.log(localStorage.getItem('REIGNKIT-username').replace(/['"]+/g, ''));
    const formData = new FormData();
    formData.append(
      "username",
      localStorage.getItem("MINTO-username").replace(/['"]+/g, "")
    );
    formData.append("name", name);
    formData.append("symbol", symbol);
    formData.append("url", url);
    formData.append("primary", primary);
    formData.append("secondary", secondary);
    formData.append("rpercent", rpercent);
    formData.append("image", image);
    formData.append("banner", banner);
    formData.append("description", description);
    formData.append("network", selectedOption);

    console.log(formData);

    axios
      .post(
        process.env.REACT_APP_PRODUCTION_URL + "/createCollection",
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

    handleFirstModalClose();
    handleSecondModalClose();
    handleThirdModalClose();
    handleFourthModalClose();
  };

  const handleDeployment = () => {
    handleSecondModalClose();
    handleFirstModalClose();
    handleThirdModalClose();
    handleFourthModalClose();
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleChildData = (data) => {
    // setChildData(data);

    localStorage.setItem(PREFIX + "name", JSON.stringify(data.user.name));
    localStorage.setItem(
      PREFIX + "username",
      JSON.stringify(data.user.username)
    );
    localStorage.setItem(PREFIX + "imageURL", JSON.stringify(data.user.photo));
  };

  const handleReveneSplitCreate =()=>{

  }
  const styles1 = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "30vh",
  };
  const styles2 = {
    display: "flex",
    alignItems: "left",
    justifyContent: "left",
    height: "5vh",
  };
  const styles3 = {
    display: "flex",
    alignItems: "right",
    justifyContent: "right",
    height: "5vh",
  };

  return (
    <>
      <div className="content-container">
        <MyNavbar onData={handleChildData}></MyNavbar>

        <div className="container">
          <div className="box box1">
            <div>
              <div style={styles1}>
                {localStorage.getItem("MINTO-imageURL") == null ? (
                  <div>Loading...</div>
                ) : (
                  <img
                    className="profile-image"
                    src={
                      process.env.REACT_APP_PRODUCTION_URL + `/${localStorage.getItem("MINTO-imageURL").replace(/['"]+/g, "")}`
                    }
                  />
                )}
              </div>
              <div style={styles2}>
                <p className="login-name">
                  {localStorage.getItem("MINTO-name") == null ? (
                    <div>Loading...</div>
                  ) : (
                    localStorage.getItem("MINTO-name").replace(/['"]+/g, "")
                  )}
                </p>
              </div>
              <div style={styles2}>
                {localStorage.getItem("MINTO-name") == null ? (
                  <div>Loading...</div>
                ) : (
                  <h5>
                    @
                    {localStorage
                      .getItem("MINTO-username")
                      .replace(/['"]+/g, "")}
                  </h5>
                )}
              </div>
            </div>
          </div>
          <div className="box box2"></div>
          <div className="box box3">
            <div>
              <div style={styles1}></div>
              <div style={styles3}>
                {/* <Button onClick={handleShow} size="lg" variant="dark">Create</Button> */}
                <Dropdown drop="down-centered">
                  <Dropdown.Toggle
                    variant="dark"
                    size="md"
                    id="dropdown-basic"
                  >
                    {"CREATE"}&nbsp;
                  </Dropdown.Toggle>

                  <Dropdown.Menu variant="dark">
                    <Dropdown.Item onClick={handleFirstModalShow}>
                      COLLECTION
                    </Dropdown.Item>
                    <Dropdown.Item href="#/action-2">
                      REVENUE SPLIT
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              {/* <div style={styles3}>
            </div> */}
            </div>
          </div>
        </div>

        {/* <div className="breadcrumb-div">
          <Breadcrumb>
            <Breadcrumb.Item
              onClick={() => handleTabClick("collections")}
              active={activeTab === "collections"}
            >
              {" "}
              COLLECTIONS{" "}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              onClick={() => handleTabClick("revenvesplit")}
              active={activeTab === "revenvesplit"}
            >
              {" "}
              REVENUE-SPLIT{" "}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              onClick={() => handleTabClick("mypass")}
              active={activeTab === "mypass"}
            >
              {" "}
              MY-PASS{" "}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <hr></hr>
        {activeTab === "collections" && <Collections />}
        {activeTab === "mypass" && <MyPass />}
        {activeTab === "revenvesplit" && <RevenveSplit />} */}

        <div className="MuiBox-root">
        <Nav
          fill
          variant="tabs"
          defaultActiveKey="/home"
          activeKey={activeKey}
          onSelect={handleSelectKey}
          >
          <Nav.Item>
            <Nav.Link eventKey="/collections">COLLECTIONS</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/revenvesplit">REVENUE SPLIT</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/mypass">MY ACTIVATED PASS</Nav.Link>
          </Nav.Item>
        </Nav>
        <br></br>
        <div className="profile-content-div">
          {activeKey === "/collections" && ( <Collections onButtonClick={handleFirstModalShow}/>)}
          {activeKey === "/mypass" && <MyPass />}
          {activeKey === "/revenvesplit" && <RevenveSplit onButtonClick={handleReveneSplitCreate}/>}
        </div>
      </div>

      </div>

      <Modal
        show={showFirstModal}
        onHide={handleFirstModalClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Collection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="content">
            Welcome! This tutorial will help you create a new collection.{" "}
            <br></br>A collection is a smart contract where you store your NFTs
            and digital collectibles. <br></br>
            Collections can be fully customized including network (eg. Ethereum,
            Polygon), <br></br>
            royalties and much more. <br></br>
            Once a collection is created, you can easily mint, manage, <br></br>
            and sell NFTs directly to your community. <br></br>
          </p>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="outline-dark" onClick={handleFirstModalClose}>
          Go Back
          </Button>
          <Button variant="dark" onClick={() => { handleFirstModalClose(); handleSecondModalShow(); }}>
           Continue
          </Button> */}
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={handleFirstModalClose}
            variant="dark"
          >
            GO BACK
          </Button>{" "}
          <br></br>
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={() => {
              handleFirstModalClose();
              handleSecondModalShow();
            }}
            variant="dark"
          >
            NEXT
          </Button>{" "}
          <br></br>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSecondModal}
        onHide={handleSecondModalClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <a
            onClick={() => {
              handleSecondModalClose();
              handleFirstModalShow();
            }}
          >
            <b>{"<-"}&nbsp;&nbsp;&nbsp;</b>
          </a>
          <Modal.Title>Collection Details (1 of 3)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please define your collection contract network, name and symbol.
          <Form className="form-class">
            <Form.Group controlId="formDropdown">
              <br></br>
              <Form.Label>Network *</Form.Label>
              <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  {selectedOption || "Polygon Testnet"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Polygon Testnet" >
                    Polygon Testnet
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Ethereum Mainnet" disabled>
                    Ethereum Mainnet
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Polygon Mainnet" disabled>
                    Polygon Mainnet
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Arbitrum" disabled>
                    Arbitrum
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic">
              <br></br>
              <Form.Label>Contract Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Minto Collection"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic">
              <Form.Label>Contract Symbol *</Form.Label>
              <Form.Control
                type="text"
                placeholder="MCL"
                value={symbol}
                onChange={(event) => setSymbol(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic">
              <Form.Label>Collection URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="app.minto.com/collections/"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="outline-dark" onClick={() => { handleSecondModalClose(); handleFirstModalShow(); }}>
          Go Back
          </Button>
          <Button variant="dark" onClick={() => { handleSecondModalClose(); handleThirdModalShow(); }}>
           Continue
          </Button> */}
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={() => {
              handleSecondModalClose();
              handleFirstModalShow();
            }}
            variant="dark"
          >
            GO BACK
          </Button>{" "}
          <br></br>
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={() => {
              handleSecondModalClose();
              handleThirdModalShow();
            }}
            variant="dark"
          >
            NEXT
          </Button>{" "}
          <br></br>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showThirdModal}
        onHide={handleThirdModalClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <a
            onClick={() => {
              handleThirdModalClose();
              handleSecondModalShow();
            }}
          >
            <b>{"<-"}&nbsp;&nbsp;&nbsp;</b>
          </a>
          <Modal.Title>Collection Details (2 of 3)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please define your collection revenue address and royalty percentage.
          <Form className="form-class">
            <Form.Group className="mb-3" controlId="formBasic">
              <Form.Label>Wallet address to receive primary sales *</Form.Label>
              <div style={{display: "flex"}}>
              <Form.Control
                type="text"
                placeholder={localStorage.getItem("REIGNKIT-address")==null ? 0x0 : localStorage.getItem("REIGNKIT-address").replace(/['"]+/g, "")}
                value={primary}
                onChange={(event) => setPrimary(event.target.value)}
                style={{width:"90%"}}
              />
              <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={
                  <Popover id="popover-basic">
                  <Popover.Header as="h3">Create Revenve Split </Popover.Header>
                  <Popover.Body> Add Recipients . Set Split Amount
                  </Popover.Body>
                  </Popover>
                }
              >
              <Form.Control
                type="button"
                value="<>"
                // onChange={(event) => setPrimary(event.target.value)}
                // onClick
                style={{width:"10%"}}
              />
              </OverlayTrigger>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formBasic">
              <Form.Label>Wallet address to receive secondary sales *</Form.Label>
              <div style={{display: "flex"}}>
              <Form.Control
                type="text"
                placeholder={localStorage.getItem("REIGNKIT-address")==null ? 0x0 : localStorage.getItem("REIGNKIT-address").replace(/['"]+/g, "")}
                value={secondary}
                onChange={(event) => setSecondary(event.target.value)}
                style={{width:"90%"}}
              />
              <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={
                  <Popover id="popover-basic">
                  <Popover.Header as="h3">Create Revenve Split</Popover.Header>
                  <Popover.Body> Add Recipients . Set Split Amount
                  </Popover.Body>
                  </Popover>
                }
              >
              <Form.Control
                type="button"
                value="<>"
                // onChange={(event) => setPrimary(event.target.value)}
                // onClick
                style={{width:"10%"}}
              />
              </OverlayTrigger>
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic">
              <Form.Label>Secondary sale royalty percentage  *</Form.Label>
              <Form.Control
                type="number"
                placeholder="5%"
                value={rpercent}
                onChange={(event) => setRpercent(event.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="outline-dark" onClick={() => { handleThirdModalClose(); handleSecondModalShow(); }}>
          Go Back
          </Button>
          <Button variant="dark" onClick={() => { handleThirdModalClose(); handleFourthModalShow(); }}>
           Continue
          </Button> */}
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={() => {
              handleThirdModalClose();
              handleSecondModalShow();
            }}
            variant="dark"
          >
            GO BACK
          </Button>{" "}
          <br></br>
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={() => {
              handleThirdModalClose();
              handleFourthModalShow();
            }}
            variant="dark"
          >
            NEXT
          </Button>{" "}
          <br></br>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showFourthModal}
        onHide={handleFourthModalClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <a
            onClick={() => {
              handleFourthModalClose();
              handleThirdModalShow();
            }}
          >
            <b>{"<-"}&nbsp;&nbsp;&nbsp;</b>
          </a>
          <Modal.Title>Collection Details (3 of 3)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please add a unique image and description for your collection.
          <Form className="form-class">
            <Form.Group className="mb-3" controlId="formBasic">
              <Form.Label>Upload image</Form.Label>
              <Form.Control
                type="file"
                onChange={(event) => setImage(event.target.files[0])}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic">
              <Form.Label>Upload banner</Form.Label>
              <Form.Control
                type="file"
                onChange={(event) => setBanner(event.target.files[0])}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic">
              <Form.Label>Collection Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tell us about your collection"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="outline-dark" onClick={handleDraftSave}>
          Save as draft
          </Button>
          <Button variant="dark" onClick={handleDeployment}>
           Create now
          </Button> */}
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={handleDraftSave}
            variant="dark"
          >
            SAVE AS DRAFT
          </Button>{" "}
          <br></br>
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={handleDeployment}
            variant="dark"
          >
            CREATE NOW
          </Button>{" "}
          <br></br>
        </Modal.Footer>
      </Modal>

      <div className="footer--pin">
        <Footer />
      </div>
    </>
  );
}
