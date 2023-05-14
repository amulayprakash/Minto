import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { Card, Container, Row, Col, Dropdown } from "react-bootstrap";
import DropCollection from "../../artifacts/contracts/DropCollection.sol/DropCollection.json";
import { ToastContainer, toast } from "react-toastify";
import { MerkleTree } from 'merkletreejs';
import { useParams } from "react-router-dom";
import "../../index.css"; 

export default function WaitlistDrop() {
  const [address, setAddress] = useState("");
  // const [show, setShow] = useState(false);
  // const [walletAddress, setWalletAddress] = useState(address);
  const [collection, setCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [totalSupply, setTotalSupply] = useState("");
  const [cards, setCards] = useState([]);

  const { id } = useParams();
  useEffect(() => {
    const getAddress = async () => {
      const res = await axios.get(
        process.env.REACT_APP_PRODUCTION_URL + `/viewCollectionsbyID?id=${id}`
      );
      setCollection(res.data[0]);
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const myContract = new ethers.Contract(res.data[0].deployedAddress,DropCollection.abi,signer);
          const totalSupply = await myContract.totalSupply();
          setTotalSupply(totalSupply.toNumber());
          setAddress(accounts[0]);
          const newCards = [];
          for (let i = 0; i < totalSupply.toNumber(); i++) {
            newCards.push({ index: i });
          }
          setCollection(res.data[0]);
          setCards(newCards);
          setAddress(accounts[0]);
        } catch (error) {
          if (error.code === 4001) {
            console.log(error)
          }
          console.log(error)
        }
      }  
      setIsLoading(false);

    };
    getAddress();
  }, []);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const handleAddWaitlist = async (event) => {
    const res = await axios.get(
      process.env.REACT_APP_PRODUCTION_URL + `/checkInPreSaleList?collectionID=${id}&walletAddress=${address}`
      );
    if(!res.data.length){
      try {
        const document={
          collectionID: id,
          addedVia: "Waitlist",
          walletAddress: address.toLowerCase(),
          quantity: 1,
        }
        const { data } = await axios.post(
          process.env.REACT_APP_PRODUCTION_URL + "/createPresalelistEntry",
          {
            documents:[document]
          },
          { withCredentials: true }
        );
        toast("Successfully added in the Waitlist");
      } catch (ex) {
        console.log(ex);
      } 
    }else{
      toast("Address already exists in the Waitlist");
    }
  };

  const handleMintPresale = async (e)=>{
    try {      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.enable();
      const signer = provider.getSigner();
      const myContract = new ethers.Contract(collection.deployedAddress, DropCollection.abi, signer );
  
      const res = await axios.get(
        process.env.REACT_APP_PRODUCTION_URL +
          `/viewPreSaleListbyCollectionID?collectionID=${id}`
      );
  
      const merkleTree = new MerkleTree(
        res.data.map(({ walletAddress, quantity }) => {
          return ethers.utils.keccak256(
            ethers.utils.solidityPack(["address", "uint256"], [walletAddress, quantity])
          );
        })
        , ethers.utils.keccak256 
        , { sortPairs: true }  
      ); 
      console.log(merkleTree);
      const buf2hex = (x) => "0x" + x.toString("hex"); 
      console.log("Root- ",buf2hex(merkleTree.getRoot()))
      const leaf = ethers.utils.keccak256(ethers.utils.solidityPack(["address", "uint256"], [address, 1])) // address from wallet using walletconnect/metamask
      console.log("Leaf- ",leaf)
      const proof = merkleTree.getProof(leaf).map((x) => buf2hex(x.data)); 
      const amount = await myContract.price();
      const transaction = await myContract.presaleMint(1,1,proof,{ value: amount });
      toast("TRANSACTION INITIATED!");
      await transaction.wait();
      toast("NFT MINTED SUCCESSFULLY");
    } catch (error) {
      console.log(error)
      toast(error.message)
    }
  }

  // const handleWalletAddressChange = (event) => {
  //   setWalletAddress(event.target.value);
  // };

  return (
    <>
    {isLoading ? (
        <>
          <h2 className="MuiBox-root">Loading...</h2>
        </>
      ) : (
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
          <div style={{ textAlign: "center" }}>
            <hr></hr>
            <h2>Presale Mint Page</h2>
            <h2>Connected Wallet - {address}</h2>
            <h2>
              <b>{collection.name}</b>
            </h2>
            <h2>
              {collection.deployedAddress} . {collection.rpercent}% Royalty
            </h2>
            <hr></hr>
          </div>

          {
          collection.preSaleLive ?
          <>
          <Container  style={{ marginBottom: "5.5rem" }}>
            <Row style={{ justifyContent: "center", marginTop: "1.5rem" }}>
              {cards.map((card, index) => (
                <Col
                  sm={6}
                  md={4}
                  lg={3}
                  key={index}
                  style={{ width: "18rem", marginBottom: "1.5rem" }}
                >
                  <Card>
                    {collection.preRevealImage ? (
                      <>
                        <Card.Img
                          variant="top"
                          src={
                            process.env.REACT_APP_PRODUCTION_URL +
                            `/uploads/${collection.preRevealImage}`
                          }
                        />
                      </>
                    ) : (
                      <Card.Img variant="top" src="holder.js/100px180" />
                    )}
                    <Card.Body>
                      <Card.Title>
                        {/* Card {index + 1} Title */}
                        {collection.preRevealName ? (
                          <h4>{collection.preRevealName}</h4>
                        ) : (
                          <span>Title</span>
                        )}
                      </Card.Title>
                      <Card.Text>
                        {/* Card {index + 1} Description */}
                        {collection.preRevealDescription ? (
                          <h5>{collection.preRevealDescription}</h5>
                        ) : (
                          <span>Description</span>
                        )}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>

          </> 
          :
          <>
          </> 
          }
          <footer
            className="fixed-bottom public-mint-footer"
            style={{
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          >
            <Container>
              <Row>
                {
                  collection.waitlistlive ?
                  <>
                <Col lg="10" style={{paddingTop:"1rem"}}>
                  <h5>&copy; 2023 Minto Company</h5>
                </Col>
                <Col className="text-right" lg="2">
                    <Button variant="outline-light" size="lg" onClick={handleAddWaitlist}> JOIN WAITLIST </Button>
                </Col>
                  
                  </>
                  :
                  <>
                  {
                    collection.preSaleLive ?
                    (
                    <>
                    <Col lg="9" style={{paddingTop:"1rem"}}>
                      <h5>&copy; 2023 Minto Company</h5>
                    </Col>
                    <Col className="text-right" lg="3">
                      <Button variant="outline-light" size="lg" onClick={handleMintPresale}>MINT IN PRESALE</Button>
                    </Col>
                      </>
                    ):(
                    <>
                    <Col lg="9" style={{paddingTop:"1rem"}}>
                      <h5>&copy; 2023 Minto Company</h5>
                    </Col>
                    <Col className="text-right" lg="3">
                      <Button variant="outline-light" size="lg" disabled> WAITLIST/PRESALE STOPPED</Button>
                    </Col>
                    </>)
                  }
                  </>
                }
              </Row>
            </Container>
          </footer>

        </>
        )}
      {/* <Modal
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
          </Modal> */}
    </>
  );
}
