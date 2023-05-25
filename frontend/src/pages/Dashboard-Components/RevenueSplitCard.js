import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import "../../index.css";
import revenueSplitLogo from "../../assets/icons8-split-64.png";

export default function RevenueSplitCard({split,idx}) {
    const [showModal, setShowModal] = useState(false);

    const handleButtonClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
  return (
    <>
        <Card key={idx} onClick={handleButtonClick}>
        <Container>
            <Row>
            <Col md={1}>
                {/* <Card.Img variant="top"  width="20" height="50" /> */}
            </Col>
            <Col md={11}>
                <Card.Header>{split.name}</Card.Header>
                <Card.Body>
                {/* <Card.Title>Special title treatment</Card.Title> */}
                <Card.Text>
                    {split.splits.length} Recipitents . {!split.isDeployed? "Draft" : "Live"} . {split.network}
                </Card.Text>
                </Card.Body>
            </Col>
            </Row>
        </Container>
        </Card>

        <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Revenue Split - {split.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <hr></hr> 
                {split.addresses.map((address, nameIndex) => (
                    <>
                        {address}- {split.splits[nameIndex]}% of revenue (minus sales fees)
                        <hr></hr> 
                    </>
                ))}
        </Modal.Body>
        <Modal.Footer>

          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={handleCloseModal}
            variant="dark"
          >
            CANCEL
          </Button>{" "}
          {/* <br></br> */}
          <Button
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
            onClick={() => {
              handleCloseModal();
            }}
            variant="dark"
          >
            DEPLOY
          </Button>{" "}
          <br></br>
        </Modal.Footer>
      </Modal>

    </>
  )
}
