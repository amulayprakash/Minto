import React from 'react'
import MyNavbar from '../Navbar-Components/Navbar'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {ethers} from 'ethers';
import { useEffect, useState, useRef} from 'react';
import { useNavigate } from "react-router-dom";
import Footer from '../Footer-Components/Footer'    

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const contractABI = require('../../artifacts/contracts/DropKitPass.sol/DropKitPass.json')
toast.configure()


export default function MintPass() {
    const contractAddress ="0xA190DA981d7c48694A26b505e4c3543fF5C0C08c"; 
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [contractInstance, setContractInstance] = useState('');
    // const [childData, setChildData] = useState('');
    const handleChildData = (data) => {
      // setChildData(data);
    console.log(data);

    };

    useEffect(() => {
      async function connectToMetamask() {
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await window.ethereum.enable();

          const MaticProvider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
          const maticSigner = provider.getSigner();
          const maticContract = new ethers.Contract(contractAddress, contractABI.abi, maticSigner);
          
          setContractInstance(maticContract);
          console.log(maticContract)
          setAddress(await provider.getSigner().getAddress());

        } else {
          console.log("Metamask not found!");
        }
      }
  
      connectToMetamask();
    }, []);
    const styles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '20vh',
    };  

    async function handleClick() {
        try {
          const tx = await contractInstance.purchasePass(1,500,1,address); 
          toast('Transaction Initiated!')
          navigate("/profile");
          await tx.wait();
          console.log("Transaction completed!");
          toast('Congratulations, you minted a pass!')
        } catch (error) {
          console.error(error); // Replace with your desired error handling
        } 
    }

  return (
    <>
        <MyNavbar onData={handleChildData}></MyNavbar>
        <div style={styles}>
        {address && <h2>{address}</h2>}
        </div>
        <Container>
            <Row>
                <Col>
                    <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Card.Title>Basic Pass</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                        <Button onClick={handleClick} variant="dark">Mint Now</Button>
                    </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Card.Title>Advanced Pass</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                        <Button variant="dark">Mint Now</Button>
                    </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Card.Title>Pro Pass</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                        <Button variant="dark">Mint Now</Button>
                    </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        <div className="footer--pin">
        <Footer />
      </div>
    </>
  )
}
