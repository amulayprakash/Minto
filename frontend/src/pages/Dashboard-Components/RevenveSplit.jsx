import React from 'react'
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function RevenveSplit() {
  return (
  <>
  <Container>
    <br></br>
    <Row>
      <Card>
        <Card.Header>Blueberry-Revenve-Split</Card.Header>
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <p>
              {' '}
              3 Recipients. Draft. Ethereum Mainnet
              {' '}
            </p>
            {/* <footer className="blockquote-footer">
              Someone famous in <cite title="Source Title">Source Title</cite>
            </footer> */}
          </blockquote>
        </Card.Body>
      </Card>
    </Row>
    <br></br>
    <Row>
      <Card>
        <Card.Header>Mastercard</Card.Header>
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <p>
              {' '}
              7 Recipients. Draft. Polygon Mainnet
              {' '}
            </p>
            {/* <footer className="blockquote-footer">
              Someone famous in <cite title="Source Title">Source Title</cite>
            </footer> */}
          </blockquote>
        </Card.Body>
      </Card>
    </Row>
  </Container>
  </>
  )
}
