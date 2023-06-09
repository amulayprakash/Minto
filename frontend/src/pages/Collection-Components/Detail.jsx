import React from "react";
import { useEffect, useState, useRef } from "react";
import MyNavbar from "../Navbar-Components/Navbar";
import Footer from "../Footer-Components/Footer";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { ethers } from "ethers";
import DropCollection from "../../artifacts/contracts/DropCollection.sol/DropCollection.json";
import Overview from "./Overview";
import Members from "./Members";
import maticlogo from "../../assets/polygon-matic-logo.png";
import Form from "react-bootstrap/Form";
import Drop from "./Drop";
import Waitlist from "./Waitlist";
import TokenAccess from "./TokenAccess";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../index.css";
const DropKitPass = require("../../artifacts/contracts/DropKitPass.sol/DropKitPass.json");

export default function Detail() {
  const DropKitPassAddress = "0xA190DA981d7c48694A26b505e4c3543fF5C0C08c";
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [modal2Show, setModal2Show] = useState(false);
  const [modal3Show, setModal3Show] = useState(false);
  const [modal4Show, setModal4Show] = useState(false);
  const [modal5Show, setModal5Show] = useState(false);

  const handleModalClose = () => setModalShow(false);
  const handleModal2Close = () => setModal2Show(false);
  const handleModal3Close = () => setModal3Show(false);
  const handleModal4Close = () => setModal4Show(false);
  const handleModal5Close = () => setModal5Show(false);

  const handleButtonClick = () => setModalShow(true);
  const handlePrepareDropClick = () => setModal2Show(true);

  const handlePreSaleClick = () => {
    handleModal2Close();
    setModal3Show(true);
  };

  const handlePublicSaleClick = () => {
    handleModal2Close();
    setModal5Show(true);
  };

  const handleWailistMoadalClick = () => {
    handleModal2Close();
    setModal4Show(true);
  };

  const [collection, setCollection] = useState(null);
  const [address, setAddress] = useState(null);

  const [NFTCount, setNFTCount] = useState(null);
  const [perNFTPrice, setPerNFTPrice] = useState(null);
  // const [quantityW, setQuantityW] = useState(null);
  const [quantityT, setQuantityT] = useState(null);

  const [NFTCountPublic, setNFTCountPublic] = useState(null);
  const [perNFTPricePublic, setPerNFTPricePublic] = useState(null);
  const [quantityWPublic, setQuantityWPublic] = useState(null);
  const [quantityTPublic, setQuantityTPublic] = useState(null);

  const [activeKey, setActiveKey] = useState("/drop");
  const { id } = useParams();

  const handleSelect = (selectedKey) => {
    setActiveKey(selectedKey);
    localStorage.setItem('activeKey', selectedKey);

  };

  useEffect(() => {
    const savedActiveKey = localStorage.getItem('activeKey');
    if (savedActiveKey) {
      setActiveKey(savedActiveKey);
    }

    const getCollections = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_PRODUCTION_URL + `/viewCollectionsbyID?id=${id}`
        );
        console.log(res.data[0]);
        setCollection(res.data[0]);
        setIsLoading(false);
      } catch (err) {
        console.error(err.message);
        setIsLoading(false);
      }
    };
    getCollections();

    return () => {
      setCollection(null);
      setAddress(null);
      setNFTCount(null);
      setPerNFTPrice(null);
      // setQuantityW(null);
      setQuantityT(null);

      setNFTCountPublic(null);
      setPerNFTPricePublic(null);
      setQuantityWPublic(null);
      setQuantityTPublic(null);
      setActiveKey("/overview");
      localStorage.removeItem('activeKey');
    };
  }, []);

  const handleChildData = (data) => {
    console.log(data);
  };

  const handleDeployContract = async (event) => {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    const dropkitpass = new ethers.Contract(
      DropKitPassAddress,
      DropKitPass.abi,
      signer
      ); 
    console.log(userAddress);
    const result = await dropkitpass.getActivatedTokenByOwner(userAddress);
    console.log(result);
      // if(result===0) 
    const factory = new ethers.ContractFactory(
        DropCollection.abi,
        DropCollection.bytecode,
        signer
    );
    console.log("handleDeployContract",factory);
      
    const contract = await factory.deploy(
      collection.name,
      collection.symbol,
      collection.primary,
      collection.secondary,
      collection.rpercent
    );
    window.location.reload(false);
    await contract.deployed();

    console.log("Contract deployed successfully", contract.address);
    // setAddress(contract.address)
    try {
      const response = await axios.put(
        process.env.REACT_APP_PRODUCTION_URL +
          `/updateCollection?collectionID=${id}&address=${contract.address}`
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    
    event.preventDefault();
    handleModalClose();
  };

  const handleStartPreSale = async (event) => {
    event.preventDefault();
    if(collection.publicSaleLive || collection.waitlistlive || collection.preSaleLive) {
      toast("Presale/Waitlist/Publicsale is already live!");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable();
    const signer = provider.getSigner();
    const myContract = new ethers.Contract(
      collection.deployedAddress,
      DropCollection.abi,
      signer 
    );
    const transaction = await myContract.startSale(
      NFTCount,
      quantityT,
      // quantityW,
      10,
      perNFTPrice,
      true
    );
    toast("Transaction Started");
    handleModal2Close();
    await transaction.wait();
    try {
      const response = await axios.put(
        process.env.REACT_APP_PRODUCTION_URL +
          `/updateCollectionPreSale?collectionID=${id}&preSaleLive=true`
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    window.location.reload(false);
    toast("Presale is now LIVE!");
    console.log(event);
  };

  const handleStartPublicSale = async (event) => {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable();
    const signer = provider.getSigner();
    const myContract = new ethers.Contract(
      collection.deployedAddress,
      DropCollection.abi,
      signer
    );
    const transaction = await myContract.startSale(
      NFTCountPublic,
      quantityTPublic,
      quantityWPublic,
      perNFTPricePublic,
      false
    );
    toast("Transaction Started");
    handleModal5Close();
    await transaction.wait();
    try {
      const response = await axios.put(
        process.env.REACT_APP_PRODUCTION_URL +
          `/updateCollectionPublicSale?collectionID=${id}&publicSaleLive=true`
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    toast("Public Sale is now LIVE!");
    console.log(event);
    // navigate()
    window.location.reload(false);
    window.open(`/collection/public-mint/${id}`, "_blank");
    handleModal5Close();
  };

  const handleViewPublicMintPage = (e) => {
    e.preventDefault();
    window.open(`/collection/public-mint/${id}`, "_blank");
    window.location.reload(false);
    handleModal5Close();
  };

  const handleViewWaitlistPage = (e) => {
    e.preventDefault();
    window.open(`/collection/presale/${id}`, "_blank");
    window.location.reload(false);
    handleModal5Close();
  };

  const handleStopPreSale = async (event) => {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable();
    const signer = provider.getSigner();
    console.log(signer);
    const myContract = new ethers.Contract(
      collection.deployedAddress,
      DropCollection.abi,
      signer
    );
    const transaction = await myContract.stopSale();
    toast("Transaction Started");
    handleModal2Close();
    await transaction.wait();
    try {
      const response = await axios.put(
        process.env.REACT_APP_PRODUCTION_URL +
          `/updateCollectionPreSale?collectionID=${id}&preSaleLive=false`
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    window.location.reload(false);
    toast("Presale is STOPPED!");
    console.log(event);
  };

  const handleStopPublicSale = async (event) => {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable();
    const signer = provider.getSigner();
    console.log(signer);
    const myContract = new ethers.Contract(
      collection.deployedAddress,
      DropCollection.abi,
      signer
    );
    const transaction = await myContract.stopSale();
    toast("Transaction Started");
    await transaction.wait();
    try {
      const response = await axios.put(
        process.env.REACT_APP_PRODUCTION_URL +
          `/updateCollectionPublicSale?collectionID=${id}&publicSaleLive=false`
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    handleModal5Close();
    window.location.reload(false);
    toast("Public Sale is STOPPED!");
    console.log(event);
  };

  const handleStopWaitList = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        process.env.REACT_APP_PRODUCTION_URL +
          `/updateCollectionWaitlist?collectionID=${id}&waitlistlive=false`
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    handleModal2Close();
    window.location.reload(false);
    toast("Waitlist Stopped!");
    console.log(event);
  };

  const handleWaitlist = async (event) => {
    event.preventDefault();
    console.log(event);
  };

  const [options, setOptions] = useState({
    option1: false,
    option2: false,
    option3: false,
    autofilled: true,
  });

  const [formData, setFormData] = useState({
    textAreaEnabled: false,
    textAreaValue: "",
  });

  const handleOptionChange = (e) => {
    const { name, checked } = e.target;
    setOptions((prevOptions) => ({ ...prevOptions, [name]: checked }));
  };

  const handleCheckBoxChange = (e) => {
    const { checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      textAreaEnabled: checked,
    }));
  };

  const handleTextAreaChange = (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, textAreaValue: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(options);
    // console.log(formData.textAreaValue);
    try {
      const response = await axios.put(
        process.env.REACT_APP_PRODUCTION_URL +
        `/updateCollectionWaitlist?collectionID=${id}&waitlistlive=true`
      );
      console.log(response.data);
      handleModal4Close();
      window.open(`/collection/presale/${id}`, "_blank");
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <MyNavbar onData={handleChildData}></MyNavbar>
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
      <div>
        {isLoading ? (
          <div className="MuiBox-root">Loading...</div>
        ) : (
          <>
            {/* <div className="detail-banner">
                <img className="detail-banner-img" src={process.env.REACT_APP_PRODUCTION_URL + `/uploads/${collection.banner}`} alt="Banner" />
                <div className='detail-image-div'>
                    <img className="detail-image" src={process.env.REACT_APP_PRODUCTION_URL + `/uploads/${collection.image}`}/>
                </div>
            </div> */}
            <div className="detail-deploy-button">
              {collection.isDeployed ? (
                <>
                  {/* <Button
                    className="create-dropdown"
                    onClick={handlePrepareDropClick}
                    size="md"
                    variant="dark"
                    style={{marginRight:"1.5rem"}}
                  >
                    PREPARE DROP
                  </Button> */}
                {collection.publicSaleLive ? (
                  <>
                    <Button style={{ borderRadius: 0, marginLeft: "0.2rem" }} onClick={handleStopPublicSale}  variant="outline-dark" > STOP PUBLIC SALE </Button>{" "}
                    <br></br>
                    <Button style={{ borderRadius: 0, marginLeft: "0.2rem" }} onClick={handleViewPublicMintPage} variant="outline-dark"> VIEW PUBLIC MINT PAGE </Button>{" "}
                    <br></br>
                  </>
                ) : (
                  collection.waitlistlive ? (
                    <>
                    <Button style={{ borderRadius: 0, marginLeft: "0.2rem" }} onClick={handleStopWaitList}  variant="outline-dark" > STOP WAITLIST </Button>{" "}
                    {/* <br></br> */}
                    <Button style={{ borderRadius: 0, marginLeft: "0.2rem" }} onClick={handleViewWaitlistPage} variant="outline-dark"> VIEW WAITLIST PAGE</Button>{" "}
                    {/* <br></br> */}
                   </>
                  ) : (
                    <>
                    {collection.preSaleLive ? (
                      <>
                      <Button style={{ borderRadius: 0, marginLeft: "0.2rem" }} onClick={handleStopPreSale} variant="outline-dark" > STOP PRESALE</Button>{" "}
                      {/* <br></br> */}
                      <Button style={{ borderRadius: 0, marginLeft: "0.2rem" }} onClick={handleViewWaitlistPage} variant="outline-dark"> VIEW PRESALE PAGE</Button>{" "}
                      {/* <br></br> */}
                      </>
                    ) : (
                      <>
                        {/* <Button style={{ borderRadius: 0, marginLeft: "0.2rem" }} onClick={handleWailistMoadalClick} variant="outline-dark" > CONFIGURE WAITLIST </Button> */}
                        {/* <br></br> */}
                        <Button style={{ borderRadius: 0, marginLeft: "0.2rem" }} onClick={handlePreSaleClick} variant="outline-dark"> START PRESALE </Button>{" "}
                        {/* <br></br> */}
                        <Button style={{ borderRadius: 0, marginLeft: "0.2rem" }} onClick={handlePublicSaleClick} variant="outline-dark"> START PUBLIC SALE </Button>{" "}
                        {/* <br></br> */}
                      </>
                    )}
                    
                    </>
                  )
                )}
                  <Button
                    className="create-dropdown"
                    // onClick={handlePrepareDropClick}
                    as={Link}  
                    to={`https://mumbai.polygonscan.com/address/${collection.deployedAddress}`}
                    size="sm"
                    variant="light"
                  >
                    <img
                      alt=""
                      src={maticlogo}
                      width="25"
                      height="25"
                      className="d-inline-block align-top"
                    />
                  </Button>
                  {/* <Button
                    className="create-dropdown"
                    onClick={handleButtonClick}
                    size="md"
                    variant="light"
                  >
                    WITHDRAW
                  </Button> */}
                </>
              ) : (
                <Button
                  className="create-dropdown"
                  onClick={handleButtonClick}
                  size="md"
                  variant="dark"
                >
                  DEPLOY CONTRACT
                </Button>
              )}
            </div>

            <div className="MuiBox-root">
              <h2 className="detail-collection-name">{collection.name}</h2>
              <br></br>
              <h6>
                {collection.symbol} . {collection.rpercent}% Royalty .{" "}
                {collection.network} . {collection.isDeployed ? <span style={{color:"Blue"}}>Live</span>: <span style={{color:"Green"}}>Draft</span>}
              </h6>
              <h6>{collection.description}</h6>
              <br></br>

              <Nav
                fill
                variant="tabs"
                defaultActiveKey="/home"
                activeKey={activeKey}
                onSelect={handleSelect}
              >
                <Nav.Item>
                  <Nav.Link eventKey="/overview">OVERVIEW</Nav.Link>
                </Nav.Item>
                {/* <Nav.Item>
                  <Nav.Link eventKey="/members">MEMBERS</Nav.Link>
                </Nav.Item> */}
                <Nav.Item>
                  <Nav.Link eventKey="/drop">DROP</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="/waitlist">WAITLIST</Nav.Link>
                </Nav.Item>
                {/* <Nav.Item>
                  <Nav.Link eventKey="/tokenaccess">TOKEN ACCESS</Nav.Link>
                </Nav.Item> */}
              </Nav>
              <br></br>
              {activeKey === "/overview" && (
                <Overview collection={collection} />
              )}
              {/* {activeKey === "/members" && <Members />} */}
              {activeKey === "/drop" && <Drop collection={collection} />}
              {activeKey === "/waitlist" && (
                <Waitlist collection={collection} />
              )}
              {/* {activeKey === "/tokenaccess" && <TokenAccess />} */}
            </div>

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
                  Deploy The Contract On Poygon Matic Testnet
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                Congratulations on creating your NFT on Minto! To complete the process, you will need to deploy your NFT contract on the Matic test network. Don't worry, it's a simple process and we'll guide you through it.

                Here's what you need to do:
                <ul>
                  <li>
                    Make sure you have an account on the Matic test network. If you don't have one yet, you can create one by visiting the Matic Wallet website.
                  </li>
                  <li>
                    Once you have your Matic test network account set up, click on the "Deploy Contract" button on the Minto website.
                  </li>
                  <li>
                    On the contract deployment page, select the Matic test network from the dropdown menu.
                  </li>
                  <li>
                    Fill in the necessary details for your contract, such as the contract name and description.
                  </li>
                  <li>
                    Click on the "Deploy Contract" button to deploy your contract on the Matic test network.
                  </li>
                  <li>
                    Wait for a few moments for your contract to be deployed.
                  </li>
                  <li>
                    Use this contract address to interact with your NFT contract on the Matic test network.
                  </li>
                </ul>

                Please note that deploying your contract on the Matic test network may require a small fee in MATIC tokens. Make sure you have enough tokens in your Matic wallet to cover these fees before deploying your contract.
                Thank you for choosing Minto for your NFT creation needs!








                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} variant="outline-dark" onClick={handleModalClose}>CLOSE</Button>
                <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} variant="dark" onClick={handleDeployContract}>
                  DEPLOY CONTRACT
                </Button>
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
                <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {collection.publicSaleLive ? (
                  <>
                    <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handleStopPublicSale}  variant="dark" > STOP PUBLIC SALE </Button>{" "}
                    <br></br>
                    <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handleViewPublicMintPage} variant="dark"> VIEW PUBLIC MINT PAGE </Button>{" "}
                    <br></br>
                  </>
                ) : (
                  collection.waitlistlive ? (
                    <>
                    <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handleStopWaitList}  variant="dark" > STOP WAITLIST </Button>{" "}
                    <br></br>
                    <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handleViewWaitlistPage} variant="dark"> VIEW WAITLIST PAGE</Button>{" "}
                    <br></br>
                   </>
                  ) : (
                    <>
                    {collection.preSaleLive ? (
                      <>
                      <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handleStopPreSale} variant="dark" > STOP PRESALE</Button>{" "}
                      <br></br>
                      <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handleViewWaitlistPage} variant="dark"> VIEW PRESALE PAGE</Button>{" "}
                      <br></br>
                      </>
                    ) : (
                      <>
                        <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handleWailistMoadalClick} variant="dark" > CONFIGURE WAITLIST </Button>{" "}
                        <br></br>
                        <Button style={{ display: "block", width: "100%", boxSizing: "border-box",}} onClick={handlePreSaleClick} variant="dark"> START PRESALE </Button>{" "}
                        <br></br>
                        <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} onClick={handlePublicSaleClick} variant="dark"> START PUBLIC SALE </Button>
                        <br></br>
                      </>
                    )}
                    
                    </>
                  )
                )}
              </Modal.Body>
              <Modal.Footer>
                {/* <Button onClick={handleModal2Close}>Close</Button> */}
                {/* <Button variant="outline-dark" onClick={handleDeployContract}>Deploy</Button> */}
              </Modal.Footer>
            </Modal>

            <Modal
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={modal3Show}
              onHide={handleModal3Close}
              animation={false}
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Start Presale
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                With this tool, you can create a list of eligible participants and assign them a specific allocation of NFTs. This list is stored in a Merkle tree, which allows for secure verification of participants' eligibility without revealing their identities. When the pre-sale begins, participants can prove their eligibility by submitting a Merkle proof, which will grant them access to purchase their allocated NFTs. By using OpenZeppelin's Merkle Proof, we are ensuring a fair and transparent pre-sale process for your NFTs.
                </p>
                <Form className="form-class">
                  <Form.Group className="mb-3" controlId="formBasic">
                    <Form.Label>NUMBER OF NFTS IN THIS PRESALE</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="1000"
                      value={NFTCount}
                      onChange={(event) => setNFTCount(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasic">
                    <Form.Label>PRICE PER NFT</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="150 Wei"
                      value={perNFTPrice}
                      onChange={(event) => setPerNFTPrice(event.target.value)}
                    />
                  </Form.Group>
                  {/* <Form.Group className="mb-3" controlId="formBasic">
                    <Form.Label>MAX QUANTITY PER WALLET ADDRESS</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="1"
                      value={quantityW}
                      onChange={(event) => setQuantityW(event.target.value)}
                    />
                  </Form.Group> */}
                  <Form.Group className="mb-3" controlId="formBasic">
                    <Form.Label>MAX QUANTITY PER MINT TRANSACTION</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="10"
                      value={quantityT}
                      onChange={(event) => setQuantityT(event.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} variant="outline-dark" onClick={handleStartPreSale} > START PRESALE</Button>
                <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} variant="dark" onClick={handleModal3Close} > CANCEL </Button>
              </Modal.Footer> 
            </Modal>

            <Modal
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={modal5Show}
              onHide={handleModal5Close}
              animation={false}
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Start Pubic Sale
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form className="form-class">
                  <Form.Group className="mb-3" controlId="formBasic">
                    <Form.Label>NUMBER OF NFTS IN THIS PUBLIC-SALE</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="1000"
                      value={NFTCountPublic || ""}
                      onChange={(event) =>
                        setNFTCountPublic(event.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasic">
                    <Form.Label>PRICE PER NFT</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="150 Wei"
                      value={perNFTPricePublic || ""}
                      onChange={(event) =>
                        setPerNFTPricePublic(event.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasic">
                    <Form.Label>MAX QUANTITY PER WALLET ADDRESS</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="10"
                      value={quantityWPublic || ""}
                      onChange={(event) =>
                        setQuantityWPublic(event.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasic">
                    <Form.Label>MAX QUANTITY PER MINT TRANSACTION</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="10"
                      value={quantityTPublic || ""}
                      onChange={(event) =>
                        setQuantityTPublic(event.target.value)
                      }
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  style={{
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  variant="outline-dark"
                  onClick={handleStartPublicSale}
                >
                  START PUBLIC SALE
                </Button>
                <Button
                  style={{
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  variant="dark"
                  onClick={handleModal5Close}
                >
                  CANCEL
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={modal4Show}
              onHide={handleModal4Close}
              animation={false}
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Waitlist
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h5>
                  A Waitlist help you build and collect interest in your NFT
                  project prior to your sale. Please configure your waitlist
                  requirements.
                </h5>
                <br></br>
                <Form className="form-class">
                  <Form.Group controlId="formBasicCheckbox3">
                    <Form.Check
                      type="checkbox"
                      label="Require wallet address (mandatory)"
                      defaultChecked
                      disabled
                    />
                  </Form.Group>
                  {/* <br></br>
                  <Form.Group controlId="formBasicCheckbox1">
                    <Form.Check
                      type="checkbox"
                      label="Require full name"
                      name="option1"
                      checked={options.option1}
                      onChange={handleOptionChange}
                    />
                  </Form.Group>
                  <br></br>
                  <Form.Group controlId="formBasicCheckbox1">
                    <Form.Check
                      type="checkbox"
                      label="Require email"
                      name="option2"
                      checked={options.option2}
                      onChange={handleOptionChange}
                    />
                  </Form.Group>
                  <br></br>
                  <Form.Group controlId="formBasicCheckbox1">
                    <Form.Check
                      type="checkbox"
                      label="Require phone number"
                      name="option3"
                      checked={options.option3}
                      onChange={handleOptionChange}
                    />
                  </Form.Group>
                  <br></br>
                  <Form.Group controlId="formBasicCheckbox1">
                    <Form.Check
                      type="checkbox"
                      label="Require custom term and conditions"
                      checked={formData.textAreaEnabled}
                      onChange={handleCheckBoxChange}
                    />
                  </Form.Group>
                  <br></br>
                  {formData.textAreaEnabled && (
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={formData.textAreaValue}
                        onChange={handleTextAreaChange}
                      />
                    </Form.Group>
                  )} */}
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} variant="outline-dark" onClick={handleSubmit} > START WAITLIST </Button>
                <Button style={{ display: "block", width: "100%", boxSizing: "border-box", }} variant="dark" onClick={handleModal4Close} > CANCEL </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>
      <div className="footer--pin">
        <Footer />
      </div>
    </>
  );
}
