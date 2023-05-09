import React from "react";
import Register from "./pages/Auth-Components/Register";
import RegisterC from "./pages/Auth-Components/RegisterC";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/Auth-Components/Login";
import LoginC from "./pages/Auth-Components/LoginC";
import Dashboard from "./pages/Dashboard-Components/Dashboard";
import Detail from "./pages/Collection-Components/Detail";
import Home from "./pages/Home";
import Profile from "./pages/Profile-Components/Profile";
import WaitlistDrop from "./pages/Public-Components/WaitlistDrop";
import PublicMint from "./pages/Public-Components/PublicMint";
import MintPass from "./pages/Profile-Components/MintPass";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-toastify/dist/ReactToastify.css";
toast.configure()

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/register" element={<Register />} /> 
        <Route exact path="/login" element={<Login />} /> 
        <Route exact path="/dashboard" element={<Dashboard />} /> 
        <Route exact path="/profile" element={<Profile />} /> 
        <Route exact path="/pass" element={<MintPass />} /> 
        <Route exact path="/" element={<Home />} /> 
        <Route exact path="/build/:id" element={<Detail />} /> 
        <Route exact path="/collection/:id" element={<WaitlistDrop />} /> 
        <Route exact path="/collection/public-mint/:id" element={<PublicMint />} /> 
      </Routes>
    </BrowserRouter>
  );
}
