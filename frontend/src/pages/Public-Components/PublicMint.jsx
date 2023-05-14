import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Card, Container, Row, Col, Dropdown } from "react-bootstrap";
import { ethers } from "ethers";
import DropCollection from "../../artifacts/contracts/DropCollection.sol/DropCollection.json";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";

import axios from "axios"; 
import "../../index.css"; 

export default function PublicMint() {
  const [address, setAddress] = useState("");
  const [collection, setCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [totalSupply, setTotalSupply] = useState("");
  const [cards, setCards] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const getCollections = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_PRODUCTION_URL + `/viewCollectionsbyID?id=${id}`
        );

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
          } catch (error) {
            if (error.code === 4001) {
              console.log(error)
            }
            console.log(error)
          
          }
        }
        
        // await window.ethereum.enable();
        // const address = await signer.getAddress();
        // setAddress(address);
        setIsLoading(false);
      } catch (err) {
        console.error(err.message);
        setIsLoading(false);
      }
    };
    getCollections();
    // getAddress();
  }, []);

  const handleMintNFT = async (event) => {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable();
    const signer = provider.getSigner();
    const myContract = new ethers.Contract(
      collection.deployedAddress,
      DropCollection.abi,
      signer
    );
    const amount = await myContract.price();
    const transaction = await myContract.mintTo(address, 1, { value: amount });
    toast("Transaction Started");
    await transaction.wait();
    toast("Congratulations, NFT minted");
  };

  return (
    <>
      {isLoading ? (
        <>
          <div className="MuiBox-root">Loading...</div>
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
            <h2>Public Mint Page</h2>
            <h2>Connected Wallet - {address}</h2>
            <h2>
              <b>{collection.name}</b>
            </h2>
            <h2>
              {collection.deployedAddress} . {collection.rpercent}% Royalty
            </h2>
            <h3>NFTs Minted- {totalSupply}</h3>
            <hr></hr>
          </div>

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

          <footer
            className="fixed-bottom public-mint-footer"
            style={{
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          >
            <Container>
              <Row>
                <Col lg="10" style={{paddingTop:"1rem"}}>
                  <h5>&copy; 2023 Minto Company</h5>
                </Col>
                <Col className="text-right" lg="2">
                  <Button variant="outline-light" size="lg" onClick={handleMintNFT}> MINT A NFT </Button>
                  
                </Col>
              </Row>
            </Container>
          </footer>
        </>
      )}
    </>
  );
}
