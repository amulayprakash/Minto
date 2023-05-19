import React from 'react'
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function RevenveSplit(props) {
  return (
  <>
  <Container className="collection-container">
  <p> No Revenve Split Contract Found - <span className="create-collection-span" onClick={props.onButtonClick}><i><u>Create Revenve Split Contract</u></i></span></p>

  </Container>
  </>
  )
}
