import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Cards from "./Cards";
import "../../index.css";

export default function Collections() {
  const [isLoading, setIsLoading] = useState(true);
  const [collections, setCollections] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("MINTO-username") == null) {
      console.log("No collection found!");
    }
    const getCollections = async () => {
      try {
        console.log("Hello");
        const res = await axios.get(process.env.REACT_APP_PRODUCTION_URL + `/viewCollections?username=${localStorage.getItem("MINTO-username").replace(/['"]+/g, "")}`);
        console.log(res.data);
        setCollections(res.data);
        setIsLoading(false);
        console.log("Collections- ", res.data);
      } catch (err) {
        console.error(err.message);
        setIsLoading(false);
      }
    };
    getCollections();

    return () => {
      setIsLoading(true);
      setCollections(null);
    };
  }, [localStorage.getItem("MINTO-username").replace(/['"]+/g, "")]);

  const handleCardClick = (item) => {
    console.log(item);
  };

  return (
    <>
      <Container className="collection-container">
        {isLoading ? (
          <div>Loading...</div>
        ) : collections.length === 0 ? (
          <p> No Collection Found </p>
        ) : (
          <>
            {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {collections.map((card ,index)=> (
                <Cards key={index} collection={card} style={{ marginBottom: '1rem' }}></Cards>
              ))}
            </div> */}
            <Row>
              {collections.map((card, index) => (
                <Col md={collections.length === 1 ? 12 : 6} key={index}>
                  <Cards key={index} collection={card}></Cards>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </>
  );
}
