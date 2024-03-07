import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContexts";
import logo from "./assets/logo.png";
import { db } from "../firebase";
import "./style/NavBar.css";
import MenuListComposition from "./menuListComponent.js";
import Modal from "@mui/material/Modal";

export default function NavBar() {
  const [openFilter, setOpenFilter] = useState(false); // State to handle filter visibility
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { currentUser, logout } = useAuth();

  const [userProfile, setUserProfile] = useState(null);

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser?.uid) {
        const docRef = doc(db, "profiles", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      setError("");
      await logout();
      navigate("/signup");
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
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
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
              style={{ marginRight: "20px", marginLeft: "20px" }}
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
            <li style={{ mmarginRight: "10px" }}>
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
        <div
          style={{ display: "flex", alignItems: "center", marginRight: "40px" }}
        >
          {currentUser && userProfile ? (
            <>
              <img
                src={
                  userProfile.profileImage ||
                  require("../components/assets/profile-photo.webp")
                }
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  border: "1px solid #5c5b5b",
                  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.3)",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <span style={{ marginRight: "10px" }}>
                {userProfile.title} {userProfile.firstName}{" "}
                {userProfile.lastName}
              </span>

              
              <MenuListComposition logout={logout} navigate={navigate} />{" "}
            </>
          ) : (
            <li style={{ marginRight: "10px" }}>
              <Link to="/Signup">Sign In</Link>
            </li>
          )}
        </div>
      </nav>
    </div>
  );
}
