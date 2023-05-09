import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import AuthNavbar from "../Navbar-Components/AuthNavbar";
import Footer from "../Footer-Components/Footer";
import "../../index.css";

function Login() {
  const [cookies] = useCookies([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (cookies.jwt) {
      navigate("/dashboard");
    }
  }, [cookies, navigate]);

  const [values, setValues] = useState({
    email: "",
    username: "",
    password: "",
  });

  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_PRODUCTION_URL + "/login",
        {
          ...values,
        },
        { withCredentials: true }
      );
      if (data) {
        if (data.errors) {
          const { email, username, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          navigate("/dashboard");
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
            <h3 className="Auth-form-title">Sign In</h3>
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
              Don't have an account ? <Link to="/register">Register</Link>
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

export default Login;
