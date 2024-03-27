import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContexts";
import logo from "./assets/logo.png";
import { db } from "../firebase";
import "./style/NavBar.css";
import MenuListComposition from "./menuListComponent.js";
import Modal from "@mui/material/Modal";
import { Typography } from "@mui/material";
import { useUserProfile } from "../contexts/UserProfileContexts.js";

export default function NavBar() {
  const location = useLocation();

  const [openFilter, setOpenFilter] = useState(false); // State to handle filter visibility
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { currentUser, logout } = useAuth();

  // const [ setUserProfile] = useState(null);

  const { userProfile } = useUserProfile();
  console.log("User Profile:", userProfile);

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     if (currentUser?.uid) {
  //       const docRef = doc(db, "profiles", currentUser.uid);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         setUserProfile(docSnap.data());
  //       } else {
  //         console.log("No such document!");
  //       }
  //     }
  //   };

  //   fetchUserProfile();
  // }, [currentUser, location.pathname]);

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
            {userProfile && userProfile.accountRole === "admin" && (
              <li style={{ marginRight: "10px" }}>
                <Link to="/NewMaterial">Add Material</Link>
              </li>
            )}
            <li style={{ marginRight: "10px" }}>
              <Link to="/SearchResults">Search</Link>
            </li>
            {currentUser &&
              userProfile &&
              userProfile.role &&
              userProfile.firstName &&
              userProfile.lastName && (
                <li style={{ marginRight: "10px" }}>
                  <Link to="/Researchers">Members</Link>
                </li>
              )}
          </ul>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginRight: "40px" }}
        >
          {currentUser ? (
            <>
              {userProfile ? (
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
                <Typography
                  onClick={handleLogout}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                >
                  Log Out
                </Typography>
              )}
            </>
          ) : (
            <Link
              to="/Signup"
              className="nav-link"
              style={{ marginRight: "10px" }}
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
