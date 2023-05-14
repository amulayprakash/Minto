import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import DropCollection from "../../artifacts/contracts/DropCollection.sol/DropCollection.json";
import "../../index.css";

export default function Overview({ collection }) {
  const [totalAmount, setTotalAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [totalSupply, setTotalSupply] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        console.log(collection);
        if (collection.isDeployed) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await window.ethereum.enable();
          const signer = provider.getSigner();
          const myContract = new ethers.Contract(
            collection.deployedAddress,
            DropCollection.abi,
            signer
          );
          const balance = await provider.getBalance(collection.deployedAddress);
          const totalAmount = await myContract.totalRevenue();
          const totalSupply = await myContract.totalSupply();
          setTotalAmount(totalAmount.toNumber());
          setBalance(balance.toNumber());
          setTotalSupply(totalSupply.toNumber());
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getData();

    return () => {
      setTotalAmount("");
      setBalance("");
      setTotalSupply("");
    };
  }, []);

  const handleWithdrawEthers = async (event) => {
    event.preventDefault();
    // console.log(collection.collectionID);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable();
    const signer = provider.getSigner();
    const myContract = new ethers.Contract(
      collection.deployedAddress,
      DropCollection.abi,
      signer
    );
    const transaction = await myContract.withdraw();
    toast("Transaction Started");
    await transaction.wait();
    toast("Ethers withdrawal successfully");
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
      <Card className="overview-card" style={{ width: "100%" }}>
        <Card.Body style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "80%", textAlign: "left" }}>
            <h2 style={{ margin: 0 }}>
              {balance ? balance : 0} Wei / {totalAmount ? totalAmount : 0} Wei
            </h2>
            <h5 style={{ margin: 0 }}>Current Balance / Total Earned</h5>
          </div>
          <div style={{ width: "20%", textAlign: "right" }}>
            <Button size="md" variant="dark" onClick={handleWithdrawEthers}>
              WITHDRAW
            </Button>
          </div>
        </Card.Body>
      </Card>
      <br></br>
      <Card className="overview-card" style={{ width: "100%" }}>
        <Card.Body style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "80%", textAlign: "left" }}>
            <h2 style={{ margin: 0 }}>{totalSupply ? totalSupply : 0}</h2>
            <h5 style={{ margin: 0 }}>NFTS MINTED</h5>
          </div>
          <div style={{ width: "20%", textAlign: "right" }}>
            <Button size="md" variant="dark">
              VIEW MORE
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
