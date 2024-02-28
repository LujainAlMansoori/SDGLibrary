import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContexts";
import logo from "./assets/logo.png";
import { db } from "../firebase";
import "./style/NavBar.css";
import MenuListComposition from "./menuListComponent.js"; // Import the MenuListComposition component

export default function NavBar() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { currentUser, logout } = useAuth();

  const [userProfile, setUserProfile] = useState(null);

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
        <div style={{ display: "flex", alignItems: "center" }}>
          {currentUser && userProfile ? (
            <>
              <img
                src={userProfile.profileImage || "default-avatar.png"}
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <span style={{ marginRight: "10px" }}>
                {userProfile.title} {userProfile.firstName}{" "}
                {userProfile.lastName}
              </span>
              <MenuListComposition logout={logout} navigate={navigate} /> {/* Pass logout and navigate as props */}
              {/* Use the MenuListComposition component */}
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
