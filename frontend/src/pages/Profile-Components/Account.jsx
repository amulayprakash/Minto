import { useEffect, useState, useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import "../../index.css";
import Crop from "./Crop.jsx";
import { Form, Button, Modal } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import { Container } from '../../FooterStyles';

const defaultSrc =
  "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

export default function Account({ childData }) {
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // const [image, setImage] = useState(defaultSrc);
  const [cropData, setCropData] = useState("#");

  const cropperRef = useRef(null);

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setShowModal(true);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current.cropper !== "undefined") {
      setCropData(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
      console.log(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
      setShowModal(false);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", cropData);
    formData.append("fullName", fullName);
    formData.append("username", username);
    axios
      .post(process.env.REACT_APP_PRODUCTION_URL + "/update", formData, {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response);
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (!childData) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Form className="form-class" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasic">
          <Form.Label>Upload image</Form.Label>
          <Form.Control
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={onChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasic">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder={childData.name}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasic">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder={childData.username}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder={childData.email}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="**********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>
        <Button className="save-changes-btn" variant="dark" type="submit">
          Save Changes
        </Button>
        {/* <Crop></Crop> */}
      </Form>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="image-modal"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="outer-div">
            <div className="inner-left-div">
              {/* {image && (
            <img
            src={URL.createObjectURL(image)}
            alt="Selected Image"
            style={{ maxWidth: "100%" }}
            />
          )} */}
              {image && (
                <Cropper
                  style={{ height: 400, width: "100%" }}
                  initialAspectRatio={1}
                  preview=".img-preview"
                  src={image}
                  ref={cropperRef}
                  viewMode={1}
                  guides={true}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  checkOrientation={false}
                />
              )}
            </div>
            <div className="inner-rigth-div">
              <div
                className="img-preview profile-image"
                style={{ width: "100%", float: "left", height: "300px" }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={getCropData}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <img style={{ width: "100%" }} src={cropData} alt="cropped" /> */}
    </>
  );
}
