import "./style/NavBar.css";
import logo from "./assets/logo.png";
import { useAuth } from "../contexts/AuthContexts";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const [setError] = useState("");

  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      setError("");
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
      setError("Failed to Log Out.");
    }
  };

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
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" exact>
            <img
              src={logo}
              alt="Logo"
              className="logo"
              style={{ marginRight: "20px" }}
            />
          </Link>
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <li style={{ marginRight: "10px" }}>
              <Link to="/">Home</Link>
            </li>
            <li style={{ marginRight: "10px" }}>
              <Link to="/NewMaterial">New Material</Link>
            </li>
            <li style={{ marginRight: "10px" }}>
              <Link to="/SearchResults">SearchResults</Link>
            </li>
            <li style={{ marginRight: "10px" }}>
              <Link to="/Researchers">Researchers</Link>
            </li>
          </ul>
        </div>
        <div>
          {/* Show log in or log out depending on if the user is logged in or not*/}
          {currentUser ? (
            <button
              onClick={handleLogout}
              style={{
                marginRight: "13px",
                display: "inline-block",
                color: "black",
                textAlign: "center",
                padding: "14px 16px",
                textDecoration: "none",
                fontSize: "16px",
                fontFamily: "Times New Roman, Times, serif",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Log Out
            </button>
          ) : (
            <li style={{ marginRight: "10px" }}>
              <Link to="/Signup">Sign Up</Link>
            </li>
          )}
        </div>
      </nav>
    </div>
  );
}
