import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import AuthNavbar from "../Navbar-Components/AuthNavbar";
import Footer from "../Footer-Components/Footer";
import "../../index.css";
import Cookies from "universal-cookie";
const PREFIX = "MINTO-";

function Login() {
  const ckies = new Cookies();
  const [cookies, setCookie] = useCookies([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (cookies.jwt) {
      navigate("/dashboard");
    }

    return () => {
      setValues({
        email: "",
        username: "",
        password: "",
      });
    };
  }, [cookies, navigate]);

  const [values, setValues] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChildData = (data) => {
    console.log(data);
  };

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

      // ckies.set("jwt", data.cookie.token, {
      //   path: "/",
      //   maxAge: data.cookie.maxAge,
      // });

      setCookie("jwt", data.cookie.token, {
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
      console.log(data);
      if (data) {
        if (data.errors) {
          const { email, username, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          console.log("Navigate to dashboard")
          navigate("/dashboard");
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  return (
    <>
      <AuthNavbar onData={handleChildData}></AuthNavbar>
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
