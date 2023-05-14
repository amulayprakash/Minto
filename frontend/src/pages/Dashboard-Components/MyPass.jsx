import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { ethers } from "ethers";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../index.css";

const contractABI = require("../../artifacts/contracts/DropKitPass.sol/DropKitPass.json");
toast.configure();

export default function MyPass(props) {
  const contractAddress = "0xA190DA981d7c48694A26b505e4c3543fF5C0C08c";
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [contractInstance, setContractInstance] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [members, setMembers] = useState([]);
  let Members = [];
  const [showAddMember, setShowAddMember] = useState(false);
  const [showRemoverMember, setShowRemoverMember] = useState(false);

  const handleCloseADD = () => setShowAddMember(false);
  const handleShowADD = () => setShowAddMember(true);

  const handleCloseREMOVE = () => setShowRemoverMember(false);
  const handleShowREMOVE = () => setShowRemoverMember(true);

  const [newMember, setNewMember] = useState("");

  const handleMember = (event) => {
    // console.log(event.target.value);
    setNewMember(event.target.value);
  };

  useEffect(() => {
    async function connectToMetamask() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        const MaticProvider = new ethers.providers.JsonRpcProvider(
          "https://rpc-mumbai.maticvigil.com"
        );
        const maticSigner = provider.getSigner();
        const maticContract = new ethers.Contract(
          contractAddress,
          contractABI.abi,
          maticSigner
        );
        const signerAddress = await maticSigner.getAddress();
        setContractInstance(maticContract);
        setAddress(signerAddress);

        const result = await maticContract.getActivatedTokenByOwner(
          signerAddress
        );
        const count = await maticContract.getPassMembersCount(
          result.toNumber()
        );
        for (let i = 0; i < count; i++) {
          const address = await maticContract.getPassMemberAt(
            result.toNumber(),
            i
          );
          Members.push(address);
        }

        if (result !== "") {
          setData(result.toNumber());
          setMembers(Members);
          setIsLoading(false);
        }
      } else {
        console.log("Metamask not found!");
      }
    }

    connectToMetamask();

    return () => {
      setAddress("");
      setContractInstance("");
      setIsLoading(true);
      setData(null);
      setMembers([]);

      setShowAddMember(false);
      setShowRemoverMember(false);
    };
  }, []);

  const handleAddMember = async (event) => {
    try {
      event.preventDefault();

      const tx = await contractInstance.addPassMembers(data, [newMember]);
      toast("Transaction Initiated!");
      handleCloseADD();
      await tx.wait();
      window.location.reload(false);
      console.log("Transaction completed!");
      toast("Member added to your pass!");
    } catch (error) {
      console.error(error.message);
      toast(error.message);
      handleCloseADD();
    }
  };
  const handleRemoveMember = async (event) => {
    try {
      event.preventDefault();
      const tx = await contractInstance.removePassMembers(data, [newMember]);
      toast("Transaction Initiated!");
      handleCloseREMOVE();
      await tx.wait();
      window.location.reload(false);
      console.log("Transaction completed!");
      toast("Member added to your pass!");
    } catch (error) {
      console.error(error);
      toast(error.message);
      handleCloseREMOVE();
    }
  };

  return (
    <>
      {isLoading ? (
        <div> Loading...</div>
      ) : data === 0 ? (
        <Button size="lg" as={Link} to="/profile" variant="dark">
          Activate Your Pass
        </Button>
      ) : (
        <>
          {/* <div>{data}</div> */}
          <div className="table-div">
            <Container>
              <br></br>
              <Row>
                <Card className="info-card">
                  <Card.Header>Pass Activated TokenID - {data}</Card.Header>
                  <Card.Body>
                    <blockquote className="blockquote mb-0">
                      <p> Basic Creator Pass </p>
                      <Button onClick={handleShowADD} variant="dark">
                        Add Members
                      </Button>{" "}
                      <></>
                      <Button onClick={handleShowREMOVE} variant="dark">
                        Remove Members
                      </Button>
                    </blockquote>
                  </Card.Body>
                </Card>
              </Row>
              <br></br>
              <Row>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th></th>
                      <th colSpan={2}>Wallet Addresses</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Row>
            </Container>
          </div>
        </>
      )}

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showAddMember}
        onHide={handleCloseADD}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add members to your pass</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMember}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Public Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="0x000000000000000000000000000000000000"
                autoFocus
                value={newMember}
                onChange={handleMember}
              />
            </Form.Group>
            <Button variant="dark" type="submit">
              Submit Transaction
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showRemoverMember}
        onHide={handleCloseREMOVE}
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove members from your pass</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRemoveMember}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Public Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="0x000000000000000000000000000000000000"
                autoFocus
                value={newMember}
                onChange={handleMember}
              />
            </Form.Group>
            <Button variant="dark" type="submit">
              Submit Transaction
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
