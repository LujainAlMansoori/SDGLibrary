import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContexts";
import logo from "./assets/logo.png";
import { db } from "../firebase";
import "./style/NavBar.css";
import MenuListComposition from "./menuListComponent.js"; // Import the MenuListComposition component

export default function PageFooter() {
  return (
    <div style={{ width: "100%" }}>
      <nav
        className="navBar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              padding: "30px",
              justifyContent: "center",
            }}
          >
            <li style={{ marginRight: "20px" }}>
              <Link to="/">Home</Link>
            </li>
            <li style={{ marginRight: "20px" }}>
              <Link to="/AboutUs">About Us</Link>
            </li>
            <li style={{ marginRight: "20px" }}>
              <Link to="/AboutSDGLibrary">About the SDGLibrary</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
