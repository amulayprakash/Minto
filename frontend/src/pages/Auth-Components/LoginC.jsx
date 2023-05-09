import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import AuthNavbar from "../Navbar-Components/AuthNavbar";
import Footer from "../Footer-Components/Footer";

import "../../index.css";

function LoginC() {
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
      <div className="container">
        <h2>Login to your Account</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="name">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            />
          </div>
          <button type="submit">Submit</button>
          <span>
            Don't have an account ?<Link to="/register"> Register </Link>
          </span>
        </form>
        <ToastContainer />
      </div>

      <div className="footer--pin">
        <Footer />
      </div>
    </>
  );
}

export default LoginC;
