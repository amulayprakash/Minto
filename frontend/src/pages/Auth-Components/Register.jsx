import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import AuthNavbar from "../Navbar-Components/AuthNavbar";
import Footer from "../Footer-Components/Footer";
import Cookies from "universal-cookie";
import "../../index.css";
const PREFIX = "MINTO-";

function Register() {
  const [cookies] = useCookies(["cookie-name"]);
  const ckies = new Cookies();
  const navigate = useNavigate();
  useEffect(() => {
    if (cookies.jwt) {
      navigate("/dashboard");
    }
  }, [cookies, navigate]);

  const [values, setValues] = useState({
    email: "",
    username: "",
    name: "",
    password: "",
  });
  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(values);
      const { data } = await axios.post(
        process.env.REACT_APP_PRODUCTION_URL + "/register",
        {
          ...values,
        },
        { withCredentials: true }
      );
      ckies.set("jwt", data.cookie.token, {
        path: "/",
        maxAge: data.cookie.maxAge,
      });
      localStorage.setItem(PREFIX + "name", JSON.stringify(data.user.name));
      localStorage.setItem(
        PREFIX + "username",
        JSON.stringify(data.user.username)
      );
      localStorage.setItem(
        PREFIX + "imageURL",
        JSON.stringify(data.user.photo)
      );

      if (data) {
        if (data.errors) {
          const { email, username, name, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          navigate("/");
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  return (
    <>
      <AuthNavbar></AuthNavbar>
      <div className="Auth-form-container">
        <form onSubmit={(e) => handleSubmit(e)} className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign Up</h3>
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                className="form-control mt-1"
                placeholder="Enter email"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3">
              <label>Username</label>
              <input
                type="text"
                name="username"
                className="form-control mt-1"
                placeholder="Enter username"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control mt-1"
                placeholder="Enter you full name"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control mt-1"
                placeholder="Enter password"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
            </div>
            <p className="forgot-password text-right mt-2">
              Already have an account ?<Link to="/login"> Login</Link>
            </p>
          </div>
        </form>
      </div>
      <div className="footer--pin">
        <Footer />
      </div>
    </>
  );
}

export default Register;
