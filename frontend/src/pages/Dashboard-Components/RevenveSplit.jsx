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
import RevenueSplitCard from "./RevenueSplitCard";

export default function RevenveSplit(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [splits, setSplits] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("MINTO-username") == null) {
      console.log("No user found!");
    }
    const getSplits = async () => {
      try { 
        const res = await axios.get(process.env.REACT_APP_PRODUCTION_URL + `/viewRevenueSplits?username=${localStorage.getItem("MINTO-username").replace(/['"]+/g, "")}`);
        setSplits(res.data);
        setIsLoading(false);
        console.log("Splits- ", res.data);
      } catch (err) {
        console.error(err.message);
        setIsLoading(false);
      }
    };
    getSplits();

    return () => {
      setIsLoading(true);
      setSplits(null);
    };
  }, [localStorage.getItem("MINTO-username").replace(/['"]+/g, "")]);

  return (
  <>
    <Container className="collection-container">
        {isLoading ? (
          <div>Loading...</div>
        ) : splits.length === 0 ? (
          <p> No Revenve Split Contract Found - <span className="create-collection-span" onClick={props.onButtonClick}><i><u>Create Revenve Split Contract</u></i></span></p>
        ) : (
          <>
            <Row>
              {splits.map((split, index) => (
                <Col md="12" key={index} style={{marginBottom:"1rem"}}>
                  <RevenueSplitCard key={index} split={split}></RevenueSplitCard>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
  </>
  )
}
