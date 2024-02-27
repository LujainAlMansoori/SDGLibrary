import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Paper from "@mui/material/Paper";
import "../components/style/titles.css";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined"; // Import the outlined email icon

import EmailIcon from "@mui/icons-material/Email";

// Popup component for sending emails
const ProfilePopup = ({ profile, onClose }) => {
  if (!profile) return null; // render nothing if no profile

  return (
    <div
      className="popup-container"
      style={{
        position: "fixed",
        top: 69,
        right: 0,
        bottom: 0,
        width: "75%",
        backgroundColor: "white",
        zIndex: 1000,
        overflowY: "auto",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          cursor: "pointer",
        }}
      >
        X
      </button>
      {/* Popup content  */}
      <div>
        <h1>{`${profile.title} ${profile.firstName} ${profile.lastName}`}</h1>
        {/* Include other profile details */}
      </div>
    </div>
  );
};

export default function Researchers() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      const profilesCollection = collection(db, "profiles");
      const profilesSnapshot = await getDocs(profilesCollection);
      const profilesList = profilesSnapshot.docs.map((doc) => doc.data());
      setProfiles(profilesList);
    };

    fetchProfiles();
  }, []);

  // This sets the state of the popup
  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
  };

  //This closes the pop up
  const handleClosePopup = () => {
    setSelectedProfile(null);
  };

  // Prevents click event from propagating to the parent
  const handleContactClick = (event, profile) => {
    event.stopPropagation();
    setSelectedProfile(profile);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <p className="researchers-title">Researchers</p>
      </div>
      {profiles.map((profile, index) => (
        <Paper
          key={index}
          elevation={3}
          style={{
            padding: "20px",
            margin: "10px 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: 1400,
            height: 100,
          }}
          onClick={() => handleProfileClick(profile)}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={profile.profileImage}
              alt={`${profile.firstName} ${profile.lastName}`}
              style={{
                borderRadius: "50%",
                marginRight: "40px",
                marginLeft: "40px",
                width: "80px",
                height: "80px",
              }}
            />
            <div style={{ fontFamily: "Times New Roman", color: "black" }}>
              <div>{`${profile.title} ${profile.firstName} ${profile.lastName}`}</div>
              <br />
              <div>{profile.role}</div>
            </div>
          </div>
          <div

            onClick={(event) => handleContactClick(event, profile)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginRight: "20px",
              fontFamily: "Times New Roman",
              color: "black",
              fontSize: "16px",
              marginTop: "-20px" /* Adjust this value as needed to align */,
            }}
          >
            Contact 
            <EmailOutlinedIcon style={{ color: "black", marginLeft: "5px" }} />
          </div>
        </Paper>
      ))}
    </div>
  );
}
