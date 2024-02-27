import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Paper from "@mui/material/Paper";
import "../components/style/titles.css";
import IconButton from "@mui/material/IconButton";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import "../components/style/noHover.css";
import emailjs from "emailjs-com";
import { useAuth } from "../contexts/AuthContexts";

import { doc, getDoc } from "firebase/firestore";

// sending others emails
const sendEmail = (e) => {
  e.preventDefault();

  emailjs
    .sendForm(
      "service_dnc473a",
      "template_1w5ueo3",
      e.target,
      "N1abVoGcbh8XG1Gp7"
    )
    .then(
      (result) => {
        console.log(result.text); // Handle the success response here
      },
      (error) => {
        console.log(error.text); // Handle the error response here
      }
    );
};

// Popup component for sending emails
const ProfilePopup = ({ profile, onClose }) => {
  const { currentUser } = useAuth();
  const [profileofCurrentUser, setProfileofCurrentUser] = useState(null);
  const senderEmail = profileofCurrentUser?.email; // Email of the current logged-in user
  useEffect(() => {
    async function fetchProfileofCurrentUser() {
      if (currentUser) {
        const profileDoc = await getDoc(doc(db, "profiles", currentUser.uid));
        if (profileDoc.exists()) {
          const data = profileDoc.data();
          console.log("Current user profile data:", data);
          setProfileofCurrentUser(data);
        } else {
          console.log("No such profile for current user!");
        }
      }
    }

    fetchProfileofCurrentUser();
  }, [currentUser]);

  // Do not render the popup until the profile is loaded
  if (!profile) return null;

  const sendEmail = (e) => {
    e.preventDefault();

    console.log("Sender Email:", profileofCurrentUser?.email); // Print sender email
    console.log("Receiver Email:", profile?.email); // Print receiver email

    emailjs
      .sendForm(
        "service_dnc473a",
        "template_1w5ueo3",
        e.target,
        "N1abVoGcbh8XG1Gp7"
      )
      .then(
        (result) => {
          console.log("Email sent result:", result.text); // This will print the result of sending the email
        },
        (error) => {
          console.log("Send email error:", error.text); // This will print the error if email sending fails
        }
      );
  };

  // Do not render the popup until both profiles are loaded
  if (!profile || !profileofCurrentUser) {
    console.log("Waiting for profiles to be loaded..."); // Debug log
    return null;
  }

  console.log("Sending email from:", profileofCurrentUser.email); // Debug log
  console.log("Sending email to:", profile.email); // Debug log

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
        border: "1px solid #e0e0e0",
        boxShadow:
          "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)", // Example shadow, similar to Material-UI Paper elevation=3
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          cursor: "pointer",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          backgroundColor: "#f0f0f0",
          color: "black",
          fontSize: "10px",
        }}
      >
        X
      </button>
      {/* Popup content  */}

      <div>
        <h2>Sender Email: {profileofCurrentUser?.email}</h2>
        <h2>Receiver Email: {profile?.email}</h2>

        <h1>
          Contact {`${profile.title} ${profile.firstName} ${profile.lastName}`}
        </h1>
        {/* Popup content */}
        <div>
          Contact {`${profile.title} ${profile.firstName} ${profile.lastName}`}
          <form onSubmit={sendEmail}>
            {/* Hidden inputs for sender's and receiver's names */}
            <input
              type="hidden"
              name="from_name"
              value={`${currentUser?.displayName}`}
            />
            <input
              type="hidden"
              name="to_name"
              value={`${profile.title} ${profile.firstName} ${profile.lastName}`}
            />
            {/* Textarea for the email message */}
            <textarea
              name="message"
              placeholder="Your message here..."
            ></textarea>
            {/* Hidden inputs for sender's and receiver's emails */}
            <input
              type="hidden"
              name="from_email"
              value={`${profileofCurrentUser?.email}`}
            />
            <input type="hidden" name="to_email" value={profile.email} />

            <button type="submit">Send Email</button>
          </form>
        </div>
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
      const profilesList = profilesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
            justifyContent: "space-between", // Adjust this to space-between to align items properly
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
            <div>
              <div>{`${profile.title} ${profile.firstName} ${profile.lastName}`}</div>
              <br />
              <div>{profile.role}</div>
            </div>
          </div>
          <IconButton
            onClick={(event) => handleContactClick(event, profile)}
            className="noHoverEffect"
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
            Contact{" "}
            <EmailOutlinedIcon style={{ color: "black", marginLeft: "5px" }} />
          </IconButton>
        </Paper>
      ))}
      {selectedProfile && (
        <ProfilePopup profile={selectedProfile} onClose={handleClosePopup} />
      )}
    </div>
  );
}
