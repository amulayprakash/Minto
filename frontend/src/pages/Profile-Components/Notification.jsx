import React from 'react'
import MyNavbar from '../Navbar-Components/Navbar'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {ethers} from 'ethers';
import { useEffect, useState, useRef} from 'react';
import { Link,useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../index.css'

export default function Notification() {
  return (
    <Container>
    <Row>
      <div className='mint-creator-button'>
        <Button variant="dark" size="lg">Delete all Notifications</Button><br></br>
      </div>
    </Row>
    <br></br>
  

</Container>

  )
}
