import React from "react";
import ReactDOM from "react-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_client_id}>
    <App />
  </GoogleOAuthProvider>,
  document.getElementById("root")
);
